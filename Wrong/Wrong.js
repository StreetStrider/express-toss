/* @flow */

; import type { Status, Resp } from '../Resp'

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

;

var assign = Object.assign

import $Resp from '../Resp'


var defaults =
{
	status: 400
}

var mark = Symbol('Wrong')

export default $Wrong

function $Wrong <Data> (code: Code, options?: Options): Wrong<Data>
{
	options = assign({}, defaults, options)

	/* @flow-off */
	var status: Status = options.status

	return (data: Data) =>
	{
		/* @flow-off */
		(data == null) && (data = void 0)

		var body: WrongData<Data> =
		{
			error: code,
			data:  data
		}

		return 0,
		{
			/* @flow-off */
			[mark]: true,

			code: code,

			inspect: () => `[Wrong: ${code}]`,

			resp: () =>
			{
				return $Resp(status, 'json', body)
			}
		}
	}
}

$Wrong.is = (it: any) =>
{
	return Boolean(it && (it[mark]))
}
