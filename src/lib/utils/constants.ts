import { getRootData } from '@sapphire/pieces';
import { join } from 'path';

export const mainFolder = getRootData().root;
export const rootFolder = join(mainFolder, '..');

export const ZeroWidthSpace = '\u200B';
export const LongWidthSpace = '\u3000';

export const enum Emojis {
	Success = '<:checkmark_square_birthdayy:1102222019476586526>',
	Fail = '<:cross_square_birthdayy:1102222032155988068> ',
	ArrowRight = '<:arrow_right_birthdayy:1102221944016875650>',
	ArrowLeft = '<:arrow_left_birthdayy:1102221941223477268>',
	Plus = '<:plus_birthdayy:1102222100544110712>',
	Link = '<:link_birthdayy:1102222076380725319>',
	Exclamation = '<:exclamation_mark_birthdayy:1102222058777223209>',
	Cake = '<:cake_birthdayy:1102221988380020766>',
	Crown = '<:crown_birthdayy:1102222034458660915>',
	News = '<:news_birthdayy:1102222080029761618>',
	Gift = '<:gift_birthdayy:1102222060845015050>',
	Book = '<:book_birthdayy:1102221958592086137>',
	Alarm = '<:bell_birthdayy:1102221947003219968>',
	Support = '<:support_birthdayy:1102222115056386208>',
	Sign = '<:sign_birthdayy:1102222111155703909> ',
	Heart = '<:heart_birthdayy:1102222063030239232>',
	Ping = '<:ping_birthdayy:1102222097788440657>',
	People = '<:people_birthdayy:1102222095573844108>',
	Comment = '<:speech_bubble_birthdayy:1102222112711786577>',
	Online = '<:online_birthdayy:1102222090712657930>',
	Offline = '<:offline_birthdayy:1102222087973769368>',
	Warning = '<:warning_birthdayy:1102222123809906778>',
	Compass = '<:compass_birthdayy:1102222027101839360>',
	Tools = '<:tools_birthdayy:1102222421651623936>',
}

export const enum BrandingColors {
	Birthdayy = 0x78c2ad,
	BirthdayyDev = 0xf3969a,
	BirthdayyTest = 0xb34bd1,
}

/**
 * @name PrismaErrorCodeEnum
 * @description A collection of error codes
 * @link https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
 */
export const enum PrismaErrorCodeEnum {
	UniqueConstraintFailed = 'P2002',
	NotFound = 'P2025',
}

export const enum BirthdayyBotId {
	Birthdayy = '916434908728164372',
	BirthdayyDev = '945106657527078952',
	BirthdayyTest = '1063411719906529323',
}

export const enum GuildIDEnum {
	Birthdayy = '934467365389893704',
	ChilliHQ = '766707453994729532',
	ChilliAttackV2 = '768556541439377438',
	BirthdayyTesting = '980559116076470272',
}

export const enum OwnerID {
	Chillihero = '267614892821970945',
	Nikolai = '531458441382985729',
	Swiizyy = '696324357940838492',
}

export const enum APIErrorCode {
	DuplicateEntr = 'duplicate_entry',
	UnknownError = 'unknown_error',
	InvalidDateFormat = 'invalid_date_format',
	InvalidParameter = 'invalid_parameter',
	MissingParameter = 'missing_parameter',
	Unauthorized = 'unauthorized',
}