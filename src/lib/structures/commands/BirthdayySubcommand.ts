import type { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import {
	BirthdayyCommandConstructorDefaults,
	implementBirthdayyCommandError,
	implementBirthdayyCommandPaginatedOptions,
	implementBirthdayyCommandParseConstructorPreConditionsPermissionLevel,
	type ExtendOptions
} from '#lib/structures/commands/base/BaseBirthdayyCommandUtilities';
import { PermissionLevels, type TypedT } from '#lib/types';
import { first } from '#utils/common';
import { Command, Args as SapphireArgs, UserError, type MessageCommand } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import type { ChatInputCommandInteraction, Snowflake } from 'discord.js';

/**
 * The base class for all Birthdayy commands with subcommands.
 * @seealso {@link BirthdayyCommand}.
 */
export class BirthdayySubcommand extends Subcommand<BirthdayySubcommand.Args, BirthdayySubcommand.Options> {
	public readonly guarded: boolean;
	public readonly hidden: boolean;
	public readonly permissionLevel: PermissionLevels;
	public declare readonly detailedDescription: TypedT<LanguageHelpDisplayOptions>;
	public override readonly description: TypedT<string>;

	public constructor(context: BirthdayySubcommand.LoaderContext, options: BirthdayySubcommand.Options) {
		super(context, { ...BirthdayyCommandConstructorDefaults, ...options });
		this.guarded = options.guarded ?? BirthdayyCommandConstructorDefaults.guarded;
		this.hidden = options.hidden ?? BirthdayyCommandConstructorDefaults.hidden;
		this.permissionLevel = options.permissionLevel ?? BirthdayyCommandConstructorDefaults.permissionLevel;
		this.description = options.description;
	}

	/**
	 * Retrieves the global command id from the application command registry.
	 *
	 * @remarks
	 *
	 * This method is used for slash commands, and will throw an error if the
	 * global command ids are empty.
	 */
	public getGlobalCommandId(): Snowflake {
		const ids = this.applicationCommandRegistry.globalChatInputCommandIds;
		if (ids.size === 0) throw new Error('The global command ids are empty.');
		return first(ids.values())!;
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		implementBirthdayyCommandError(identifier, context);
	}

	protected override parseConstructorPreConditions(options: BirthdayySubcommand.Options): void {
		super.parseConstructorPreConditions(options);
		implementBirthdayyCommandParseConstructorPreConditionsPermissionLevel(this, options.permissionLevel);
	}

	public static readonly PaginatedOptions = implementBirthdayyCommandPaginatedOptions<BirthdayySubcommand.Options>;
}

export namespace BirthdayySubcommand {
	export type Options = ExtendOptions<Subcommand.Options>;
	export type Args = SapphireArgs;
	export type LoaderContext = Command.LoaderContext;
	export type RunContext = MessageCommand.RunContext;

	export type Interaction = ChatInputCommandInteraction<'cached'>;
}
