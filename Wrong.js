/* @flow */

import type { Status, Resp } from './Resp'

; export type Code = string

; export type WrongData<Data> =
{
	error: Code,
	data:  Data
}

; export type WrongInstance<Data> =
{
	code: Code,
	inspect (): string,
	resp (): Resp<WrongData<Data>>
}

; export type Wrong<Data> = (data: Data) => WrongInstance<Data>

; export type Options =
{
	status?: Status,
}

; var assign = Object.assign
import $Resp from './Resp'

var defaults =
{
	status: 400
}

export default <Data> (code: Code, options?: Options): Wrong<Data> =>
{
	options = assign({}, defaults, options)

	/* @flow-off */
	var status: Status = options.status

	return (data: Data) =>
	{
		/* @flow-off */
		(data == null) && (data = null)

		var body: WrongData<Data> =
		{
			error: code,
			data:  data
		}

		return 0,
		{
			code: code,

			inspect: () => `[Wrong: ${code}]`,

			resp: () =>
			{
				return $Resp(status, 'json', body)
			}
		}
	}
}
