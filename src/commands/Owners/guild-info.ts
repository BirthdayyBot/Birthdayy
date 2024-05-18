import { getSupportedUserLanguageT } from '#lib/i18n/translate';
import { BirthdayyCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types/Enums';
import { OWNERS } from '#root/config';
import generateConfigList from '#utils/birthday/config';
import { getFormattedTimestamp } from '#utils/common';
import { generateDefaultEmbed, interactionProblem } from '#utils/embed';
import { isNotCustom as enabled } from '#utils/env';
import { getCommandGuilds } from '#utils/functions';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { applyDescriptionLocalizedBuilder } from '@sapphire/plugin-i18next';
import type { SlashCommandStringOption } from 'discord.js';

@ApplyOptions<BirthdayyCommand.Options>({ enabled, permissionLevel: PermissionLevels.BotOwner })
export class GuildInfoCommand extends BirthdayyCommand {
	public override async registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				applyDescriptionLocalizedBuilder(builder, 'commands/owners:guildInfoDescription')
					.setName('guild-info')
					.setDMPermission(false)
					.addStringOption((option) => this.registerGuildIDCommandOption(option)),
			{
				guildIds: await getCommandGuilds('admin')
			}
		);
	}

	public override async chatInputRun(interaction: BirthdayyCommand.Interaction<'cached'>) {
		if (!OWNERS.includes(interaction.user.id)) return;

		const guildId = interaction.options.getString('guild-id', true);
		const guild = await this.container.client.guilds.fetch(guildId).catch(() => null);
		const t = getSupportedUserLanguageT(interaction);

		if (!guild) return interaction.reply(interactionProblem(t('commands/owners:guildInfoGuildNotFound')));

		const settings = await this.container.prisma.guild.findUnique({ where: { guildId } });

		if (!settings) return interaction.reply(interactionProblem(t('commands/owners:guildInfoSettingsNotFound')));

		const guildBirthdayCount = await this.container.prisma.birthday.count({ where: { guildId } });

		const embed = generateDefaultEmbed({
			fields: [
				{
					name: 'GuildId',
					value: settings.guildId,
					inline: true
				},
				{
					name: 'GuildName',
					value: guild.name,
					inline: true
				},
				{
					name: 'Description',
					value: guild.description ?? 'No Description',
					inline: true
				},
				{
					name: 'GuildShard',
					value: `Shard ${guild.shardId + 1}`,
					inline: true
				},
				{
					name: 'MemberCount',
					value: guild.memberCount.toString(),
					inline: true
				},
				{
					name: 'BirthdayCount',
					value: guildBirthdayCount.toString(),
					inline: true
				},

				{
					name: 'GuildOwner',
					value: guild.ownerId,
					inline: true
				},
				{
					name: 'IsPartnered',
					inline: true,
					value: `${guild.partnered}`
				},
				{
					name: 'Premium Tier',
					value: `${guild.premiumTier}`,
					inline: true
				},
				{
					name: 'GuildCreated',
					value: getFormattedTimestamp(guild.createdTimestamp, 'f'),
					inline: true
				},
				{
					name: 'GuildJoined',
					value: getFormattedTimestamp(guild.joinedTimestamp, 'f'),
					inline: true
				},
				{
					name: 'GuildServed',
					value: getFormattedTimestamp(guild.joinedTimestamp, 'R'),
					inline: true
				},
				{
					name: 'Guild Permissions',
					value:
						guild.members.me?.permissions
							.toArray()
							.map((permission: string) => `**\`${permission}\`**`)
							.join(' • ') ?? 'No Permissions'
				}
			],
			thumbnail: {
				url: guild.iconURL({ extension: 'png' }) ?? 'No Image'
			},
			title: 'GuildInfos'
		});

		const configEmbed = generateDefaultEmbed(
			await generateConfigList(guildId, { member: interaction.member, guild })
		);

		return interaction.reply({
			content: `GuildInfos for ${guild.name}`,
			embeds: [embed, configEmbed]
		});
	}

	private registerGuildIDCommandOption(option: SlashCommandStringOption) {
		return applyDescriptionLocalizedBuilder(option, 'commands/owners:guildInfoGuildIdOptionDescription')
			.setName('guild-id')
			.setRequired(true);
	}
}
