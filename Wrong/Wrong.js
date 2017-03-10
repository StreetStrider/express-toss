/* @flow */

; import type { Toss$Status, Toss$Resp } from '../Resp'

; export type Toss$Code = string

; export type Toss$WrongData<Data> =
{
	error: Toss$Code,
	data:  Data
}

; export type Toss$WrongInstance<Data> =
{
	code: Toss$Code,
	inspect (): string,
	resp (): Toss$Resp<Toss$WrongData<Data>>
}

; export type Toss$Wrong<Data> = (data: Data) => Toss$WrongInstance<Data>

; export type Options =
{
	status?: Toss$Status,
}

;

var assign = Object.assign

import $Resp from '../Resp'


var defaults =
{
	status: 400
}

var marker = Symbol('Wrong')

export default function Wrong <Data> (code: Toss$Code, options?: Options)
: Toss$Wrong<Data>
{
	options = assign({}, defaults, options)

	/* @flow-off */
	var status: Toss$Status = options.status

	return (data: Data) =>
	{
		/* @flow-off */
		(data == null) && (data = void 0)

		var body: Toss$WrongData<Data> =
		{
			error: code,
			data:  data
		}

		return 0,
		{
			/* @flow-off */
			[marker]: true,

			code: code,

			inspect: () => `[Wrong: ${code}]`,

			resp: () =>
			{
				return $Resp(status, 'json', body)
			}
		}
	}
}

Wrong.is = (it: any) =>
{
	return Boolean(it && (it[marker]))
}
