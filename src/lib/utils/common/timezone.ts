import { Locale } from 'discord-api-types/v10';

export const TIMEZONE_VALUES: Record<number, string> = {
	'-11': 'Pacific/Samoa',
	'-10': 'Pacific/Honolulu',
	'-9': 'America/Anchorage',
	'-8': 'America/Los_Angeles',
	'-7': 'America/Denver',
	'-6': 'America/Chicago',
	'-5': 'America/New_York',
	'-4': 'America/Caracas',
	'-3': 'America/Argentina/Buenos_Aires',
	'-2': 'Atlantic/South_Georgia',
	'-1': 'Atlantic/Azores',
	0: 'Europe/London',
	1: 'Europe/Paris',
	2: 'Europe/Berlin',
	3: 'Europe/Moscow',
	4: 'Asia/Dubai',
	5: 'Asia/Karachi',
	6: 'Asia/Dhaka',
	7: 'Asia/Jakarta',
	8: 'Asia/Shanghai',
	9: 'Asia/Tokyo',
	10: 'Australia/Brisbane',
	11: 'Pacific/Noumea',
	12: 'Pacific/Fiji'
};

export const TimezoneWithLocale: Record<Locale, string> = {
	[Locale.EnglishUS]: 'America/New_York',
	[Locale.Greek]: 'Europe/Athens',
	[Locale.Korean]: 'Asia/Seoul',
	[Locale.Hungarian]: 'Europe/Budapest',
	[Locale.Russian]: 'Europe/Moscow',
	[Locale.French]: 'Europe/Paris',
	[Locale.EnglishGB]: 'Europe/London',
	[Locale.Indonesian]: 'Asia/Makassar',
	[Locale.Bulgarian]: 'Europe/Sofia',
	[Locale.ChineseCN]: 'Asia/Chongqing',
	[Locale.ChineseTW]: 'Asia/Taipei',
	[Locale.Croatian]: 'Europe/Zagreb',
	[Locale.Czech]: 'Europe/Prague',
	[Locale.Danish]: 'Europe/Copenhagen',
	[Locale.Dutch]: 'Europe/Berlin',
	[Locale.Finnish]: 'Europe/Helsinki',
	[Locale.German]: 'Europe/Isle_of_Man',
	[Locale.Hindi]: 'Africa/Lagos',
	[Locale.Italian]: 'Europe/Rome',
	[Locale.Japanese]: 'Asia/Tokyo',
	[Locale.Lithuanian]: 'Europe/Vilnius',
	[Locale.Norwegian]: 'Europe/Berlin',
	[Locale.Polish]: 'Europe/Kyiv',
	[Locale.PortugueseBR]: 'Europe/Lisbon',
	[Locale.Romanian]: 'Europe/Chisinau',
	[Locale.SpanishES]: 'Europe/Madrid',
	[Locale.Swedish]: 'Europe/Berlin',
	[Locale.Thai]: 'Asia/Bangkok',
	[Locale.Turkish]: 'Asia/Istanbul',
	[Locale.Ukrainian]: 'Europe/Simferopol',
	[Locale.Vietnamese]: 'Asia/Ho_Chi_Minh'
};
