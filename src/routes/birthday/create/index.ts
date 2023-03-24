import { container } from '@sapphire/framework';
import { methods, Route, type ApiResponse } from '@sapphire/plugin-api';
import { isDateString } from '../../../helpers/utils/date';
import type { ApiRequest, BirthdayQuery } from '../../../lib/api/types';
import { authenticated, validateParams } from '../../../lib/api/utils';
import { APIErrorCode } from '../../../lib/enum/APIErrorCode.enum';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Route.Options>({ route: 'birthday/create' })
export class BirthdayCreateRoute extends Route {
	@authenticated()
	@validateParams<BirthdayQuery>(['guild_id', 'user_id', 'date'])
	public async [methods.POST](request: ApiRequest<BirthdayQuery>, response: ApiResponse) {
		const { date, user_id, guild_id } = request.query;

		const isDate = isDateString(date);

		if (!isDate) {
			return response.badRequest({
				success: false,
				error: { code: APIErrorCode.INVALID_DATE_FORMAT, message: 'Wrong Date Format use YYYY-MM-DD or XXXX-MM-DD' },
			});
		}

		const guild = await container.client.guilds.fetch(guild_id);

		if (!guild) {
			return response.badRequest({
				success: false,
				error: { message: 'Guild not found' },
			});
		}

		const member = await guild.members.fetch(user_id);

		if (!member) {
			return response.badRequest({
				success: false,
				error: { message: 'User not found' },
			});
		}


		await container.utilities.birthday.create(user_id, guild, member.user);

		return response.created({ success: true });
	}
}
