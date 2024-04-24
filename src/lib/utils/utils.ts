import type { SubcommandMappingArray } from '@sapphire/plugin-subcommands';

import { type PreconditionEntryResolvable, container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { isNullishOrEmpty } from '@sapphire/utilities';
import {
	type APIUser,
	ChatInputCommandInteraction,
	CommandInteraction,
	type EmbedAuthorData,
	EmbedBuilder,
	GuildMember,
	type ImageURLOptions,
	type InteractionReplyOptions,
	Message,
	MessagePayload,
	Role,
	Snowflake,
	User,
	userMention
} from 'discord.js';

/**
 * Picks a random item from an array
 * @param array - The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Sends a loading message to the current channel
 * @param message - The message data for which to send the loading message
 */
export function sendLoadingMessage(message: Message): Promise<typeof message> {
	const RandomLoadingMessage = ['Loading...', 'Please wait...', 'Fetching...', 'Processing...'];
	return send(message, {
		embeds: [new EmbedBuilder().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')]
	});
}

export function resolveTarget(interaction: ChatInputCommandInteraction) {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const target = userMention(user.id);
	return { options: { context: user === interaction.user ? undefined : 'target', target }, user };
}

/**
 * It replies to an interaction, and if the interaction has already been replied to, it edits the reply instead
 * @param  interaction - The interaction object that was passed to your command handler.
 * @param  options - The options to pass to the reply method.
 * @returns A promise that resolves to the message that was sent.
 */
export function reply(interaction: CommandInteraction, options: InteractionReplyOptions | MessagePayload | string) {
	return interaction[interaction.replied || interaction.deferred ? 'editReply' : 'reply'](options);
}

export interface Mapps {
	name: string;
	preconditions: readonly PreconditionEntryResolvable[];
}

export function createSubcommandMappings(...subcommands: Array<Mapps | string>): SubcommandMappingArray {
	return subcommands.map((subcommand) => {
		if (typeof subcommand === 'string') return { chatInputRun: snakeToCamel(subcommand), name: subcommand };
		return {
			chatInputRun: snakeToCamel(subcommand.name),
			name: subcommand.name,
			preconditions: subcommand.preconditions
		};
	});
}

export function snakeToCamel(str: string) {
	return str.replace(/([-_][a-z])/g, (ltr) => ltr.toUpperCase()).replace(/[^a-zA-Z]/g, '');
}

/**
 * Checks whether or not the user uses the new username change, defined by the
 * `discriminator` being `'0'` or in the future, no discriminator at all.
 * @see {@link https://dis.gd/usernames}
 * @param user The user to check.
 */
export function usesPomelo(user: APIUser | User) {
	return isNullishOrEmpty(user.discriminator) || user.discriminator === '0';
}

export function getDisplayAvatar(user: APIUser | User, options?: Readonly<ImageURLOptions>) {
	if (user.avatar === null) {
		const id = usesPomelo(user) ? Number(BigInt(user.id) >> 22n) % 6 : Number(user.discriminator) % 5;
		return container.client.rest.cdn.defaultAvatar(id);
	}

	return container.client.rest.cdn.avatar(user.id, user.avatar, options);
}

export function getTag(user: APIUser | User) {
	return usesPomelo(user) ? `@${user.username}` : `${user.username}#${user.discriminator}`;
}

export function getEmbedAuthor(user: APIUser | User, url?: string | undefined): EmbedAuthorData {
	return { iconURL: getDisplayAvatar(user, { size: 128 }), name: getTag(user), url };
}

export function getFooterAuthor(user: APIUser | User, url?: string | undefined) {
	return { iconURL: getDisplayAvatar(user, { size: 128 }), text: getTag(user), url };
}

/**
 * Splits a message into multiple messages if it exceeds a certain length, using a specified character as the delimiter.
 * @param content The message to split.
 * @param options The options for splitting the message.
 * @returns An array of messages split from the original message.
 * @throws An error if the content cannot be split.
 */
export function splitMessage(content: string, options: SplitMessageOptions) {
	if (content.length <= options.maxLength) return [content];

	let last = 0;
	const messages = [] as string[];
	while (last < content.length) {
		// If the last chunk can fit the rest of the content, push it and break:
		if (content.length - last <= options.maxLength) {
			messages.push(content.slice(last));
			break;
		}

		// Find the last best index to split the chunk:
		const index = content.lastIndexOf(options.char, options.maxLength + last);
		if (index === -1) throw new Error('Unable to split content.');

		messages.push(content.slice(last, index + 1));
		last = index + 1;
	}

	return messages;
}

export interface SplitMessageOptions {
	char: string;
	maxLength: number;
}

/**
 * Checks if the provided user ID is the same as the client's ID.
 *
 * @param userId - The user ID to check.
 */
export function isUserSelf(userId: Snowflake) {
	return userId === process.env.CLIENT_ID;
}

export function checkPermissions(interaction: ChatInputCommandInteraction<'cached'>, target: GuildMember | Role) {
	// If it's to itself, always block
	if (interaction.member!.id === target.id) return false;

	// If the target is the owner, always block
	if (interaction.guild.ownerId === target.id) return false;

	// If the author is the owner, always allow
	if (interaction.user.id === interaction.guild.ownerId) return true;

	// Check hierarchy role positions, allow when greater, block otherwise
	const targetPosition = target instanceof Role ? target.position : target.roles.highest.position;
	const authorPosition = interaction.member!.roles.highest?.position ?? 0;
	return authorPosition > targetPosition;
}
