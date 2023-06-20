import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuCommandInteraction, Message, Snowflake } from 'discord.js';
import { isBotAdmin } from '../lib/utils/helper';

export class OwnerOwnlyPrecondition extends Precondition {
	#message = 'This command can only be used by the bot admins.';

	public override chatInputRun(interaction: CommandInteraction) {
		return this.doAdminCheck(interaction.user.id);
	}

	public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
		return this.doAdminCheck(interaction.user.id);
	}

	public override messageRun(message: Message) {
		return this.doAdminCheck(message.author.id);
	}

	private doAdminCheck(userId: Snowflake) {
		return isBotAdmin(userId) ? this.ok() : this.error({ identifier: 'IsNotBotAdmin', message: this.#message });
	}
}