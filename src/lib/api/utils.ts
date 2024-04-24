import { canManageGuild } from '#utils/functions/permissions';
import { createFunctionPrecondition } from '@sapphire/decorators';
import { container } from '@sapphire/framework';
import { ApiRequest, type ApiResponse, HttpCodes, type LoginData } from '@sapphire/plugin-api';
import { RateLimitManager } from '@sapphire/ratelimits';
import {
	Client,
	Guild,
	GuildDefaultMessageNotifications,
	GuildExplicitContentFilter,
	GuildMFALevel,
	GuildMember,
	GuildPremiumTier,
	GuildVerificationLevel,
	PermissionsBitField
} from 'discord.js';
import { Locale, PermissionFlagsBits, type RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';

import type { OauthFlattenedGuild, PartialOauthFlattenedGuild, TransformedLoginData } from './types.js';

import { flattenGuild } from './ApiTransformers.js';

export const authenticated = (token?: string) =>
	createFunctionPrecondition(
		(request: ApiRequest) => (token ? request.headers.authorization === token : Boolean(request.auth?.token)),
		(_request: ApiRequest, response: ApiResponse) => response.error(HttpCodes.Unauthorized)
	);

/**
 * @param time The amount of milliseconds for the ratelimits from this manager to expire.
 * @param limit The amount of times a {@link RateLimit} can drip before it's limited.
 * @param auth Whether or not this should be auth-limited
 */
export function ratelimit(time: number, limit = 1, auth = false) {
	const manager = new RateLimitManager(time, limit);
	const xRateLimitLimit = time;
	return createFunctionPrecondition(
		(request: ApiRequest, response: ApiResponse) => {
			const id = (auth ? request.auth!.id : request.headers['x-forwarded-for'] || request.socket.remoteAddress) as string;
			const bucket = manager.acquire(id);

			response.setHeader('Date', new Date().toUTCString());
			if (bucket.limited) {
				response.setHeader('Retry-After', bucket.remainingTime.toString());
				return false;
			}

			try {
				bucket.consume();
			} catch {}

			response.setHeader('X-RateLimit-Limit', xRateLimitLimit);
			response.setHeader('X-RateLimit-Remaining', bucket.remaining.toString());
			response.setHeader('X-RateLimit-Reset', bucket.remainingTime.toString());

			return true;
		},
		(_request: ApiRequest, response: ApiResponse) => {
			response.error(HttpCodes.TooManyRequests);
		}
	);
}

export function canManage(guild: Guild, member: GuildMember): boolean {
	if (guild.ownerId === member.id) return true;
	return canManageGuild(member);
}

async function getManageable(id: string, oauthGuild: RESTAPIPartialCurrentUserGuild, guild: Guild | undefined): Promise<boolean> {
	if (oauthGuild.owner) return true;
	if (typeof guild === 'undefined') return new PermissionsBitField(BigInt(oauthGuild.permissions)).has(PermissionFlagsBits.ManageGuild);

	const member = await guild.members.fetch(id).catch(() => null);
	if (!member) return false;

	return canManage(guild, member);
}

async function transformGuild(client: Client, userId: string, data: RESTAPIPartialCurrentUserGuild): Promise<OauthFlattenedGuild> {
	const guild = client.guilds.cache.get(data.id);
	const serialized: PartialOauthFlattenedGuild =
		typeof guild === 'undefined'
			? {
					afkChannelId: null,
					afkTimeout: 0,
					applicationId: null,
					approximateMemberCount: null,
					approximatePresenceCount: null,
					available: true,
					banner: null,
					channels: [],
					defaultMessageNotifications: GuildDefaultMessageNotifications.OnlyMentions,
					description: null,
					explicitContentFilter: GuildExplicitContentFilter.Disabled,
					icon: data.icon,
					id: data.id,
					joinedTimestamp: null,
					mfaLevel: GuildMFALevel.None,
					name: data.name,
					ownerId: data.owner ? userId : null,
					partnered: false,
					preferredLocale: Locale.EnglishUS,
					premiumSubscriptionCount: null,
					premiumTier: GuildPremiumTier.None,
					roles: [],
					splash: null,
					systemChannelId: null,
					vanityURLCode: null,
					verificationLevel: GuildVerificationLevel.None,
					verified: false,
					widgetEnabled: false
				}
			: flattenGuild(guild);

	return {
		...serialized,
		isBotAdded: typeof guild !== 'undefined',
		manageable: await getManageable(userId, data, guild),
		permissions: data.permissions
	};
}

export async function transformOauthGuildsAndUser({ guilds, user }: LoginData): Promise<TransformedLoginData> {
	if (!user || !guilds) return { guilds, user };

	const { client } = container;
	const userId = user.id;

	const transformedGuilds = await Promise.all(guilds.map((guild) => transformGuild(client, userId, guild)));
	return { transformedGuilds, user };
}
