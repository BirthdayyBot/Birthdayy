import { container } from '@sapphire/framework';
import type { MessageCreateOptions } from 'discord.js';
import { editMessage, sendMessage } from '../../lib/discord/message';
import generateBirthdayList from '../generate/birthdayList';
import generateEmbed from '../generate/embed';

export default async function updateBirthdayOverview(guild_id: string) {
	const config = await container.utilities.guild.get.GuildConfig(guild_id);
	console.log('config', config);
	if (!config || !config.overviewChannel) return;
	const { overviewChannel, overviewMessage } = config;

	const birthdayList = await generateBirthdayList(1, guild_id);
	const birthdayEmbedObj = generateEmbed(birthdayList.embed);
	try {
		if (overviewMessage) {
			try {
				await editMessage(overviewChannel, overviewMessage, {
					embeds: [birthdayEmbedObj],
					components: birthdayList.components,
				});
			} catch (error: any) {
				if (error instanceof Error) {
					if (
						error.message === 'Unknown Message' ||
						error.message.includes('authored by another user') ||
						error.message.includes('Message not found')
					) {
						await generateNewOverviewMessage(overviewChannel, birthdayList);
						container.logger.warn('Message Not found, so generated new overview message');
					} else {
						container.logger.error('[OVERVIEW CHANNEL] ', error);
					}
				}
			}
			container.logger.info(`Updated Overview Message in guild: ${guild_id}`);
			return;
		}
		if (!overviewMessage) {
			await generateNewOverviewMessage(overviewChannel, birthdayList);
		}
	} catch (error) {
		container.logger.error('[OVERVIEW CHANNEL] ', error);
	}
}

async function generateNewOverviewMessage(
	channel_id: string,
	birthdayList: Pick<MessageCreateOptions, 'embeds' | 'components'>,
) {
	const message = await sendMessage(channel_id, { ...birthdayList });
	if (!message?.inGuild()) return;
	await container.utilities.guild.set.OverviewMessage(message.guildId, message.id);
}
