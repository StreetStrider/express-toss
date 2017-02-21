/* @flow */

; export type Status = number

; export type Mime = string | Symbol

; export type RespTuple<T>
= [ Status, Mime, T ]
| [ Status, T ]
| [ Mime, T ]
| [ T ]
| []

; export type Resp<T> =
{
	inspect (): [ Status, Mime, T | Symbol ],

	// eslint-disable-next-line no-undef
	toss (rs: express$Response): void
}

; export default $Resp

/* eslint-disable complexity */
function $Resp <T> (/* :: ...resp: RespTuple<T> */): Resp<T>
{
	var status: Status = 200
	var mime: Mime = Intact
	var body: T | Symbol = Intact

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
		inspect: () => [ status, mime, body ],

		// eslint-disable-next-line no-undef
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
