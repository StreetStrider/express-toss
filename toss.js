/* @flow */
/* global express$Middleware */
/* global express$Request */
/* global express$Response */

; export type Options =
{
	debug?: boolean
}

; export type Handler<T> = (rq: express$Request) => Promise<T> | T

;

var assign = Object.assign

import Wrong from './Wrong'
import Debug from './Wrong/Debug'
import Internal from './Wrong/Internal'

import toss_to from './toss-to'

var defaults =
{
	debug: false
}

export default function tosser (options?: Options)
{
	options = assign({}, defaults, options)

	/* @flow-off */
	var debug: boolean = options.debug

	return 0,
	{
		method: method,
		toss: toss,
	}

	function method (handler: Handler<*>): express$Middleware
	{
		var $handler = capture(handler)

		return (rq: express$Request, rs: express$Response) =>
		{
			$handler(rq).then(
			resp =>
			{
				toss(resp, rs)
			},
			error =>
			{
				if (! Wrong.is(error))
				{
					console.error('toss: non-protocol rejection')
					console.error(error)
				}

				toss(error, rs)
			})
		}
	}

	function toss (resp: any, rs: express$Response)
	{
		var pass

		if (resp instanceof Error)
		{
			if (debug)
			{
				pass = Debug(resp)
			}
			else
			{
				pass = Internal()
			}
		}

		toss_to(pass, rs)
	}
}

function capture <T> (fn: Handler<T>): (rq: express$Request) => Promise<T>
{
	return function ()
	{
		return new Promise(rs =>
		{
			return rs(fn.apply(this, arguments))
		})
	}
}
