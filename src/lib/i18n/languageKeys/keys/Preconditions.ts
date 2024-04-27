import type { ChannelType } from 'discord.js';

import { FT, T } from '#lib/types';

// Sapphire built-in:
export const ClientPermissions = FT<{ missing: string[] }>('preconditions:clientPermissions');
export const ClientPermissionsNoClient = T('preconditions:clientPermissionsNoClient');
export const ClientPermissionsNoPermissions = T('preconditions:clientPermissionsNoPermissions');
export const RunIn = FT<{ types: ChannelType[] }>('preconditions:runIn');
export const UserPermissionsNoPermissions = T('preconditions:userPermissionsNoPermissions');
export const Unavailable = T('preconditions:unavailable');
export const Cooldown = FT<{ remaining: number }>('preconditions:cooldown');
export const DisabledGlobal = T('preconditions:disabledGlobal');
export const Nsfw = T('preconditions:nsfw');
export const UserPermissions = FT<{ missing: string[] }>('preconditions:userPermissions');
export const MissingMessageHandler = T('preconditions:missingMessageHandler');
export const MissingChatInputHandler = T('preconditions:missingChatInputHandler');
export const MissingContextMenuHandler = T('preconditions:missingContextMenuHandler');

// Sapphire built-in (deprecated):
/** @deprecated */
export const DmOnly = T('preconditions:dmOnly');
/** @deprecated */
export const GuildNewsOnly = T('preconditions:guildNewsOnly');
/** @deprecated */
export const GuildNewsThreadOnly = T('preconditions:guildNewsThreadOnly');
/** @deprecated */
export const GuildOnly = T('preconditions:guildOnly');
/** @deprecated */
export const GuildPrivateThreadOnly = T('preconditions:guildPrivateThreadOnly');
/** @deprecated */
export const GuildPublicThreadOnly = T('preconditions:guildPublicThreadOnly');
/** @deprecated */
export const GuildTextOnly = T('preconditions:guildTextOnly');
/** @deprecated */
export const ThreadOnly = T('preconditions:threadOnly');

// Birthdayy:
export const Administrator = T('preconditions:administrator');
export const BotOwner = T('preconditions:botOwner');
export const GuildPremium = T('preconditions:guildPremium');
export const Moderator = T('preconditions:moderator');
export const Manager = T('preconditions:manager');
export const RoleHigher = T('preconditions:roleHigher');
export const ServerOwner = T('preconditions:serverOwner');