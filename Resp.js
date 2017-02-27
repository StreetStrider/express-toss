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
	toJSON (): [ Status, Intacted<Mime>, Intacted<Body> ],
	toss (rs: express$Response): void
}

;

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
		toJSON: () => [ status, mime, body ],

		toss: (rs: express$Response) =>
		{
			rs.status(status)

			if (typeof mime === 'string')
			// if (mime !== Intact)
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
