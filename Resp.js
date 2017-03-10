/* @flow */
/* global express$Response */

; export type Toss$Status = number

; export type Toss$Mime = string

; export type Toss$Intacted<T> = T | Symbol

// eslint-disable-next-line no-unused-vars
; type RespTuple<Body>
= [ Toss$Status, Toss$Mime, Body ]
// workaround for (Toss$Mime | Symbol or Toss$Intacted<Toss$Mime>):
| [ Toss$Status, Symbol, Body ]
| [ Toss$Status, Body ]
// workaround for (Body | Symbol or Toss$Intacted<Body>):
| [ Toss$Status, Symbol ]
| [ Toss$Mime, Body ]
| [ Body ]
| []
/*
  Arrays are invariant
  https://github.com/facebook/flow/issues/3416
*/

; export type Toss$Resp<Body> =
{
	inspect (): string,
	toJSON (): [ Toss$Status, Toss$Intacted<Toss$Mime>, Toss$Intacted<Body> ],
	toss (rs: express$Response): void
}

;

import { inspect } from 'util'

/* eslint-disable complexity */
export default function $Resp <Body> (/* :: ...resp: RespTuple<Body> */)
: Toss$Resp<Body>
{
	var status: Toss$Status = 200
	var mime: Toss$Intacted<Toss$Mime> = Intact
	var body: Toss$Intacted<Body> = Intact

	if (arguments.length === 1)
	{
		body = arguments[0]
	}
	else if (arguments.length === 2)
	{
		var status_or_mime: Toss$Status | Toss$Mime = arguments[0]

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
