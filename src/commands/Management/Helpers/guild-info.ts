import { GuildInfoCMD } from '#lib/commands/guildInfo';
import { BirthdayyCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types/Enums';
import { generateDefaultEmbed, isCustom, reply } from '#utils';
import generateConfigList from '#utils/birthday/config';
import { getFormattedTimestamp } from '#utils/common';
import { getCommandGuilds } from '#utils/functions';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, CommandOptionsRunTypeEnum } from '@sapphire/framework';
@ApplyOptions<BirthdayyCommand.Options>({
	description: 'Get Infos about a Guild',
	enabled: !isCustom,
	permissionLevel: PermissionLevels.Administrator,
	runIn: CommandOptionsRunTypeEnum.GuildAny,
})
export class GuildInfoCommand extends BirthdayyCommand {
	public override async registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(GuildInfoCMD(), {
			guildIds: await getCommandGuilds('admin'),
		});
	}

	public override async chatInputRun(interaction: BirthdayyCommand.Interaction<'cached'>) {
		const guildId = interaction.options.getString('guild-id', true);
		const settings = await this.container.utilities.guild.get.GuildById(guildId).catch(() => null);
		const guild = await this.container.client.guilds.fetch(guildId).catch(() => null);
		const guildBirthdayCount = await this.container.utilities.birthday.get.BirthdayCountByGuildId(guildId);

		if (!settings || !guild) return reply(interaction, 'Guild Infos not found');

		const embed = generateDefaultEmbed({
			fields: [
				{
					name: 'GuildId',
					value: settings.guildId,
					inline: true,
				},
				{
					name: 'GuildName',
					value: guild.name,
					inline: true,
				},
				{
					name: 'Description',
					value: guild.description ?? 'No Description',
					inline: true,
				},
				{
					name: 'GuildShard',
					value: `Shard ${guild.shardId + 1}`,
					inline: true,
				},
				{
					name: 'MemberCount',
					value: guild.memberCount.toString(),
					inline: true,
				},
				{
					name: 'BirthdayCount',
					value: guildBirthdayCount.toString(),
					inline: true,
				},

				{
					name: 'GuildOwner',
					value: guild.ownerId,
					inline: true,
				},
				{
					name: 'IsPartnered',
					inline: true,
					value: `${guild.partnered}`,
				},
				{
					name: 'Premium Tier',
					value: `${guild.premiumTier}`,
					inline: true,
				},
				{
					name: 'GuildCreated',
					value: getFormattedTimestamp(guild.createdTimestamp, 'f'),
					inline: true,
				},
				{
					name: 'GuildJoined',
					value: getFormattedTimestamp(guild.joinedTimestamp, 'f'),
					inline: true,
				},
				{
					name: 'GuildServed',
					value: getFormattedTimestamp(guild.joinedTimestamp, 'R'),
					inline: true,
				},
				{
					name: 'Guild Permissions',
					value:
						guild.members.me?.permissions
							.toArray()
							.map((permission: string) => `**\`${permission}\`**`)
							.join(' • ') ?? 'No Permissions',
				},
			],
			thumbnail: {
				url: guild.iconURL({ extension: 'png' }) ?? 'No Image',
			},
			title: 'GuildInfos',
		});

		const configEmbed = generateDefaultEmbed(
			await generateConfigList(guildId, { member: interaction.member, guild }),
		);

		return reply(interaction, {
			content: `GuildInfos for ${guild.name}`,
			embeds: [embed, configEmbed],
		});
	}
}
