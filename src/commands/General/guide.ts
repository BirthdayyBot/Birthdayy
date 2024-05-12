import { getSupportedUserLanguageT } from '#lib/i18n/translate';
import { BirthdayyCommand } from '#lib/structures';
import { ConfigApplicationCommandMentions } from '#root/commands/Admin/config';
import { BirthdayApplicationCommandMentions } from '#root/commands/Birthday/birthday';
import { BrandingColors, Emojis } from '#utils/constants';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { applyLocalizedBuilder, type TFunction } from '@sapphire/plugin-i18next';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export class GuideCommand extends BirthdayyCommand {
	public override async registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			applyLocalizedBuilder(builder, 'commands/guide:name', 'commands/guide:description').setDMPermission(true)
		);
	}

	public override async chatInputRun(interaction: BirthdayyCommand.Interaction) {
		const t = getSupportedUserLanguageT(interaction);

		const embed = new EmbedBuilder()
			.setTitle(t('commands/guide:embedTitle'))
			.setDescription(t('commands/guide:embedDescription'))
			.setColor(BrandingColors.Primary)
			.addFields(this.getStartedField(t), this.getConfigField(t), this.getImportantField(t));

		const components = this.createComponents(t);

		return interaction.reply({ embeds: [embed], components, ephemeral: true });
	}

	private getStartedField(t: TFunction) {
		const command = BirthdayApplicationCommandMentions.Set;
		return {
			name: t('commands/guide:embedFieldsStartedTitle'),
			value: t('commands/guide:embedFieldsStartedValue', { command })
		};
	}

	private getConfigField(t: TFunction) {
		const commandView = ConfigApplicationCommandMentions.View;
		const commandEdit = ConfigApplicationCommandMentions.Edit;
		return {
			name: t('commands/guide:embedFieldsConfigTitle'),
			value: t('commands/guide:embedFieldsConfigValue', { commandView, commandEdit })
		};
	}

	private getImportantField(t: TFunction) {
		return {
			name: t('commands/guide:embedFieldsImportantTitle'),
			value: t('commands/guide:embedFieldsImportantValue')
		};
	}

	private createComponents(t: TFunction) {
		return [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setLabel(t('commands/guide:buttonDocsLabel'))
					.setURL('https://birthdayy.xyz/docs')
					.setStyle(ButtonStyle.Link)
					.setEmoji(Emojis.Book),
				new ButtonBuilder()
					.setURL('https://join.birthdayy.xyz')
					.setLabel(t('commands/guide:buttonInviteLabel'))
					.setStyle(ButtonStyle.Link)
					.setEmoji(Emojis.People)
			)
		];
	}
}