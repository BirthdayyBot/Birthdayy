import { GuildMemberFetchQueue } from '#lib/discord/GuildMemberFetchQueue';
import type { Birthday, Blacklist, Guild, User } from '#root/utilities/db/index';
import { BotList } from '@devtomio/plugin-botlist';
import type { WritePrecisionType } from '@influxdata/influxdb-client';
import type { PrismaClient } from '@prisma/client';
import type { ArrayString, BooleanString, IntegerString, NumberString } from '@skyra/env-utilities';
import type { WebhookClient } from 'discord.js';
import type { Events } from './Enums.js';

declare module 'discord.js' {
	interface Client {
		readonly guildMemberFetchQueue: GuildMemberFetchQueue;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
		webhook: WebhookClient | null;
		botList: BotList;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Administrator: never;
		BotOwner: never;
		Everyone: never;
		GuildPremium: never;
		Moderator: never;
		NotBlacklisted: never;
		ServerOwner: never;
		RoleHigher: never;
	}

	interface SapphireClient {
		emit(event: Events.PostStatsSuccess): boolean;
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		BirthdayReminderTask: { message: string; role: string } | undefined;
		BirthdayRoleRemoverTask: never;
		VoteReminderTask: never;
		CleanDatabaseTask: never;
		DisplayStats: never;
		PostStats: never;
	}
}

declare module '@sapphire/plugin-utilities-store' {
	export interface Utilities {
		guild: Guild;
		birthday: Birthday;
		user: User;
		blacklist: Blacklist;
	}
}

declare module '@skyra/env-utilities' {
	export interface Env {
		CLIENT_NAME: string;
		CLIENT_VERSION: string;
		CLIENT_OWNERS: ArrayString;
		CLIENT_COLOR: NumberString;
		CLIENT_MAIN_GUILD: string;
		CLIENT_ID: string;

		CLIENT_PRESENCE_NAME: string;
		CLIENT_PRESENCE_TYPE: string;

		LOG_CHANNEL_SERVER: string;
		LOG_CHANNEL_ADMIN: string;
		CUSTOM_BOT: BooleanString;
		APP_ENV: 'dev' | 'tst' | 'prd';
		DEBUG: BooleanString;

		API_ENABLED: BooleanString;
		API_ORIGIN: string;
		API_PORT: IntegerString;
		API_PREFIX: string;

		OAUTH_COOKIE: string;
		OAUTH_DOMAIN_OVERWRITE: string;
		OAUTH_REDIRECT_URI: string;
		OAUTH_SCOPE: ArrayString;
		OAUTH_SECRET: string;

		REDIS_PORT: NumberString;
		REDIS_HOST: string;
		REDIS_PASSWORD: string;
		REDIS_DB: IntegerString;
		REDIS_USERNAME: string;

		DATABASE_URL: string;
		PRISMA_DEBUG_LOGS: BooleanString;

		INFLUX_ENABLED: BooleanString;
		INFLUX_URL: string;
		INFLUX_TOKEN: string;
		INFLUX_ORG: string;
		INFLUX_ORG_ANALYTICS_BUCKET: string;

		WEBHOOK_ERROR_ID: string;
		WEBHOOK_ERROR_TOKEN: string;

		SENTRY_URL: string;
		TOP_GG_TOKEN: string;
		DISCORD_TOKEN: string;
		TOPGG_WEBHOOK_SECRET: string;
		DISCORD_LIST_GG_TOKEN: string;
		DISCORD_BOT_LIST_TOKEN: string;
	}
}
