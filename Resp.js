/* @flow */
/* global express$Response */

; export type Status = number

; export type Mime = string

; export type Intacted<T> = T | Symbol

; export type RespTuple<Body>
= [ Status, Mime, Body ]
| [ Status, Symbol, Body ] // workaround for (Mime | Symbol or Intacted<Mime>)
| [ Status, Body ]
| [ Status, Symbol ] // workaround for (Body | Symbol or Intacted<Body>)
| [ Mime, Body ]
| [ Body ]
| []

; export type Resp<Body> =
{
	inspect (): string,
	toJSON (): [ Status, Intacted<Mime>, Intacted<Body> ],
	toss (rs: express$Response): void
}

;

import { inspect } from 'util'

export default $Resp

/* eslint-disable complexity */
function $Resp <Body> (/* :: ...resp: RespTuple<Body> */): Resp<Body>
{
	var status: Status = 200
	var mime: Intacted<Mime> = Intact
	var body: Intacted<Body> = Intact

	if (arguments.length === 1)
	{
		body = arguments[0]
	}
	else if (arguments.length === 2)
	{
		var status_or_mime: Status | Mime = arguments[0]

		if (typeof status_or_mime === 'number')
		{
			status = status_or_mime
		}
		else if (typeof status_or_mime === 'string')
		{
			mime = status_or_mime
		}

		body = arguments[1]
	}
	else if (arguments.length > 2)
	{
		status = arguments[0]
		mime = arguments[1]
		body = arguments[2]
	}

	return 0,
	{
		inspect: () =>
		{
			var seq = [ status ]

			// if (mime !== Intact)
			if (typeof mime === 'string')
			{
				seq.push(mime)
			}

			if (body !== Intact)
			{
				var body_repr: string = ''

				if (typeof body === 'string')
				{
					body_repr = body
				}
				else
				{
					body_repr = inspect(body)
				}

				if (body_repr.length > 51)
				{
					body_repr = body_repr.slice(0, 25)
					+ '…'     + body_repr.slice(-25)
				}

				seq.push(body_repr)
			}

			var seq_repr: string = seq.join(', ')

			return `[Resp: ${seq_repr}]`
		},

		toJSON: () => [ status, mime, body ],

		toss: (rs: express$Response) =>
		{
			rs.status(status)

			// if (mime !== Intact)
			if (typeof mime === 'string')
			{
				rs.type(mime)
			}

			if (body !== Intact)
			{
				rs.send(body)
			}
			else
			{
				rs.end()
			}
		}
	}
}
/* eslint-enable complexity */

var Intact = $Resp.Intact = Symbol('Intact')
