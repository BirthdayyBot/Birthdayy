import { TimezoneWithLocale } from '#utils/common/date';
import { BirthdayyBotId, Emojis, LanguageFormatters, OwnerID, rootFolder } from '#utils/constants';
import { isProduction } from '#utils/env';
import { DEBUG, ROOT_DIR } from '#utils/environment';
import { getGuild } from '#utils/functions/guilds';
import type { BotList } from '@devtomio/plugin-botlist';
import type { InfluxOptions } from '@kaname-png/plugin-influxdb';
import { LogLevel, container, type ClientLoggerOptions } from '@sapphire/framework';
import type { ServerOptions } from '@sapphire/plugin-api';
import { type InternationalizationOptions } from '@sapphire/plugin-i18next';
import type { ScheduledTaskHandlerOptions } from '@sapphire/plugin-scheduled-tasks';
import { isNullOrUndefined } from '@sapphire/utilities';
import { Integrations, type NodeOptions } from '@sentry/node';
import { envIsDefined, envParseArray, envParseNumber, envParseString } from '@skyra/env-utilities';
import type { QueueOptions } from 'bullmq';
import {
	ActivityType,
	GatewayIntentBits,
	Locale,
	PermissionFlagsBits,
	PermissionsString,
	PresenceUpdateStatus,
	channelMention,
	roleMention,
	type ClientOptions,
	type PresenceData,
	type WebhookClientData,
} from 'discord.js';
import { FormatFunction, InterpolationOptions } from 'i18next';
import { join } from 'path';

export const OWNERS = envParseArray('BOT_OWNER', [OwnerID.Chillihero, OwnerID.Swiizyy]);

function parseApi(): ServerOptions {
	return {
		prefix: envParseString('API_EXTENSION', ''),
		origin: '*',
		listenOptions: { port: envParseNumber('API_PORT', 4000) },
		automaticallyConnect: false,
	};
}

function parseBotListOptions(): BotList.Options {
	return {
		clientId: BirthdayyBotId.Birthdayy,
		debug: DEBUG,
		shard: true,
		autoPost: {
			enabled: isProduction,
		},
		keys: {
			topGG: envParseString('TOPGG_TOKEN', ''),
			discordListGG: envParseString('DISCORDLIST_TOKEN', ''),
			discordBotList: envParseString('DISCORDBOTLIST_TOKEN', ''),
		},
	};
}

export const PROJECT_ROOT = join(rootFolder, process.env.OVERRIDE_ROOT_PATH ?? 'dist');
export const LANGUAGE_ROOT = join(PROJECT_ROOT, 'languages');

function parseInternationalizationDefaultVariablesPermissions() {
	const keys = Object.keys(PermissionFlagsBits) as readonly PermissionsString[];
	const entries = keys.map((key) => [key, key] as const);

	return Object.fromEntries(entries) as Readonly<Record<PermissionsString, PermissionsString>>;
}

type EmojisString = keyof typeof Emojis;
function parseInternationalizationDefaultVariablesEmojis() {
	const keys = Object.keys(Emojis) as readonly EmojisString[];
	const entries = keys.map((key) => [key, key] as const);

	return Object.fromEntries(entries) as Readonly<Record<EmojisString, EmojisString>>;
}

function parseInternationalizationDefaultVariables() {
	return {
		VERSION: process.env.CLIENT_VERSION,
		SUCCESS: Emojis.Success,
		FAIL: Emojis.Fail,
		PLUS: Emojis.Plus,
		DEFAULT_PREFIX: process.env.CLIENT_PREFIX,
		CLIENT_ID: process.env.CLIENT_ID,
		...parseInternationalizationDefaultVariablesPermissions(),
		...parseInternationalizationDefaultVariablesEmojis,
	};
}

function parseInternationalizationInterpolation(): InterpolationOptions {
	return {
		escapeValue: false,
		defaultVariables: parseInternationalizationDefaultVariables(),
		format: (...[value, format, language, options]: Parameters<FormatFunction>) => {
			const t = container.i18n.getT(language ?? 'en-US');
			const defaultValue = t('globals:none', options);
			if (isNullOrUndefined(value)) return defaultValue;
			switch (format as LanguageFormatters) {
				case LanguageFormatters.Channel:
					return channelMention(value) as string;
				case LanguageFormatters.Role:
					return roleMention(value) as string;
				case LanguageFormatters.Language:
					return t(`languages:${language}`, options);
				case LanguageFormatters.Timezone:
					return TimezoneWithLocale[value as Locale];
				default:
					return value as string;
			}
		},
	};
}

function parseInternationalizationOptions(): InternationalizationOptions {
	return {
		defaultLanguageDirectory: LANGUAGE_ROOT,
		fetchLanguage: ({ guild }) => {
			if (!guild) return 'en-US';

			return getGuild(guild).preferredLocale ?? 'en-US';
		},
		i18next: (_: string[], languages: string[]) => ({
			supportedLngs: languages,
			preload: languages,
			returnObjects: true,
			returnEmptyString: false,
			returnNull: false,
			load: 'all',
			lng: 'en-US',
			fallbackLng: 'en-US',
			defaultNS: 'globals',
			initImmediate: false,
			interpolation: parseInternationalizationInterpolation(),
		}),
	};
}

function parseBullOptions(): QueueOptions {
	return {
		connection: {
			port: envParseNumber('REDIS_PORT'),
			password: envParseString('REDIS_PASSWORD'),
			host: envParseString('REDIS_HOST'),
			db: envParseNumber('REDIS_DB'),
			username: envParseString('REDIS_USERNAME'),
		},
	};
}

function parseScheduledTasksOptions(): ScheduledTaskHandlerOptions {
	return {
		queue: 'birthdayy',
		bull: parseBullOptions(),
	};
}

function parsePresenceOptions(): PresenceData {
	return {
		status: PresenceUpdateStatus.Online,
		activities: [
			{
				name: '/birthday set 🎂',
				type: ActivityType.Watching,
			},
		],
	};
}

function parseLoggerOptions(): ClientLoggerOptions {
	return {
		level: DEBUG ? LogLevel.Debug : LogLevel.Info,
		instance: container.logger,
	};
}

export const SENTRY_OPTIONS: NodeOptions = {
	debug: DEBUG,
	integrations: [new Integrations.Http({ breadcrumbs: true, tracing: true })],
};

function parseSentryOptions() {
	return {
		loadSentryErrorListeners: true,
		root: ROOT_DIR,
		options: SENTRY_OPTIONS,
	};
}

export function parseAnalytics(): InfluxOptions {
	return {
		loadDefaultListeners: true,
	};
}

export const CLIENT_OPTIONS: ClientOptions = {
	analytics: parseAnalytics(),
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
	loadDefaultErrorListeners: true,
	logger: parseLoggerOptions(),
	shards: 'auto',
	api: parseApi(),
	botList: parseBotListOptions(),
	i18n: parseInternationalizationOptions(),
	tasks: parseScheduledTasksOptions(),
	presence: parsePresenceOptions(),
	sentry: parseSentryOptions(),
};

function parseWebhookError(): WebhookClientData | null {
	if (!envIsDefined('DISCORD_ERROR_WEBHOOK_ID', 'DISCORD_ERROR_WEBHOOK_TOKEN')) return null;

	return {
		id: envParseString('DISCORD_ERROR_WEBHOOK_ID'),
		token: envParseString('DISCORD_ERROR_WEBHOOK_TOKEN'),
	};
}

export const WEBHOOK_ERROR = parseWebhookError();
