import {
	BirthdayyBotColor,
	type ErrorDefaultSentryScope,
	type ErrorHandlerOptions,
	type RouteApiErrorHandler,
} from '#lib/types';
import { generateDefaultEmbed } from '#lib/utils/embed';
import { isDevelopment } from '#lib/utils/env';
import { DEBUG } from '#lib/utils/environment';
import { container } from '@sapphire/framework';
import { captureException, withScope } from '@sentry/node';
import { envIsDefined } from '@skyra/env-utilities';
import { codeBlock, type APIEmbed } from 'discord.js';

export function logErrorToContainer({
	error,
	loggerSeverityLevel,
}: Pick<ErrorHandlerOptions, 'error' | 'loggerSeverityLevel'>): void {
	container.logger[loggerSeverityLevel](error);
}

export function defaultScope({ scope, error, sentrySeverityLevel }: ErrorDefaultSentryScope) {
	scope.setFingerprint([error.name, error.message]),
		scope.setTransactionName(error.name),
		scope.setLevel(sentrySeverityLevel);
	return captureException(error);
}

export function captureCommandErrorToSentry({
	interaction,
	error,
	sentrySeverityLevel,
}: Omit<ErrorHandlerOptions, 'loggerSeverityLevel'>): void {
	return withScope((scope) => {
		scope.setTags({
			channelId: interaction.channelId,
			guildId: interaction.guildId,
			userId: interaction.member?.user.id ?? interaction.user.id,
		});
		return defaultScope({ error, scope, sentrySeverityLevel });
	});
}

export function captureRouteApiErrorToSentry({
	request,
	error,
	sentrySeverityLevel,
}: Omit<RouteApiErrorHandler, 'response' | 'loggerSeverityLevel'>): void {
	return withScope((scope) => {
		scope.setTag('method', request.method);
		return defaultScope({ error, scope, sentrySeverityLevel });
	});
}

function sendErrorMessageToUser({ interaction, error }: Pick<ErrorHandlerOptions, 'interaction' | 'error'>) {
	let errorString = `Command: ${interaction.commandName}\n`;
	if (error.message) errorString += `Error: ${error.message}\n`;
	if (error.cause) errorString += `Cause: ${JSON.stringify(error.cause)}\n`;
	if (error.stack && isDevelopment) errorString += `Stack: ${JSON.stringify(error.stack)}`;

	const errorMessageEmbed = generateDefaultEmbed({
		color: BirthdayyBotColor.BirthdayyDev,
		description: `${codeBlock(`js`, errorString)}`,
		title: 'An error has occured',
	});

	if (interaction.replied || interaction.deferred) {
		interaction
			.editReply({ embeds: [errorMessageEmbed] })
			.catch(() => interaction.user.send({ embeds: [errorMessageEmbed] }));
	} else {
		interaction
			.reply({ embeds: [errorMessageEmbed], ephemeral: true })
			.catch(() => interaction.user.send({ embeds: [errorMessageEmbed] }));
	}

	return sendErrorMessageToAdmin(errorMessageEmbed);
}

function sendErrorMessageToAdmin(embed: APIEmbed) {
	const { webhook } = container;
	if (webhook === null) return;
	return webhook.send({ embeds: [embed] });
}

export function handleCommandErrorAndSendToUser({
	interaction,
	error,
	loggerSeverityLevel,
	sentrySeverityLevel,
}: ErrorHandlerOptions) {
	if (envIsDefined('SENTRY_DSN')) captureCommandErrorToSentry({ error, interaction, sentrySeverityLevel });
	if (DEBUG) logErrorToContainer({ error, loggerSeverityLevel });
	return sendErrorMessageToUser({ error, interaction });
}

export function handleRouteApiError({
	request,
	response,
	error,
	loggerSeverityLevel,
	sentrySeverityLevel,
}: RouteApiErrorHandler): void {
	if (envIsDefined('SENTRY_DSN')) captureRouteApiErrorToSentry({ error, request, sentrySeverityLevel });
	if (DEBUG) logErrorToContainer({ error, loggerSeverityLevel });
	return response.status(500).json({ error: error.message });
}