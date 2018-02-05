/* @flow */

; import type { Toss$Status, Toss$Resp } from '../Resp'

export type Toss$Code = string

; export type Toss$Wrong$Data<Code: Toss$Code, Data> =
{
	error: Code,
	data:  Data,
}

; export type Toss$Wrong$Instance<Code: Toss$Code, Data> =
{
	code: Code,
	inspect (): string,
	resp (): Toss$Resp<Toss$Wrong$Data<Code, Data>>,
}

; export type Toss$Wrong<Code: Toss$Code, Data> =
(data: Data) => Toss$Wrong$Instance<Code, Data>

; export type Options =
{
	status?: Toss$Status,
}

;

var assign = Object.assign

import Resp from '../Resp'


var defaults =
{
	status: 400
}

var marker = Symbol('Wrong')

export default function Wrong <Code: Toss$Code, Data>
(
	code: Code,
	options?: Options
)
: Toss$Wrong<Code, Data>
{
	options = assign({}, defaults, options)

	/* @flow-off */
	var status: Toss$Status = options.status

	return (data: Data) =>
	{
		/* @flow-off */
		(data == null) && (data = void 0)

		var body: Toss$Wrong$Data<Code, Data> =
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
				return Resp(status, 'json', body)
			}
		}
	}
}

Wrong.is = (it: any) =>
{
	return Boolean(it && (it[marker]))
}
