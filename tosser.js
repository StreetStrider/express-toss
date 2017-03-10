/* @flow */
/* global express$Middleware */
/* global express$Request */
/* global express$Response */

; export type Toss$Options =
{
	debug?: boolean
}

; export type Toss$Handler<T> = (rq: express$Request) => Promise<T> | T

;

var assign = Object.assign

import Wrong from './Wrong'
import Debug from './Wrong/Debug'
import Internal from './Wrong/Internal'

import toss_to from './toss-to'

var defaults: Toss$Options =
{
	debug: false
}

export default function tosser (options?: Toss$Options)
{
	options = assign({}, defaults, options)

	/* @flow-off */
	var debug: boolean = options.debug

	return 0,
	{
		method: method,
		toss:   toss,
	}

	function method (handler: Toss$Handler<*>): express$Middleware
	{
		var $handler = capture(handler)

		return (rq: express$Request, rs: express$Response) =>
		{
			$handler(rq).then(
				resp  => toss(resp, rs),
				error => toss_error(error, rs)
			)
		}
	}

	function toss_error (error: any, rs: express$Response)
	{
		if (! error_or_wrong(error))
		{
			console.error('toss: ' +
			'rejection with nor Error, nor Wrong, ' +
			'upgrade to Debug(rejection)')
			console.error(error)

			error = Debug(error)
		}

		toss(error, rs)
	}

	function toss (resp: any, rs: express$Response)
	{
		if (debug)
		{
			if (resp instanceof Error)
			{
				console.error('toss: non-protocol error, upgrade to Debug(error)')
				console.error(resp)

				resp = Debug(raw_error(resp))
			}
		}
		else
		{
			if (resp instanceof Error)
			{
				console.error('toss: non-protocol attempt, mask as Internal()')
				console.error(resp)

				resp = Internal()
			}
			else if (Debug.is(resp))
			{
				console.error('toss: Debug() attempt, mask as Internal()')
				console.error(resp)

				resp = Internal()
			}
		}

		toss_to(resp, rs)
	}
}

function capture <T> (fn: Toss$Handler<T>): (rq: express$Request) => Promise<T>
{
	return function ()
	{
		return new Promise(rs =>
		{
			return rs(fn.apply(this, arguments))
		})
	}
}

function error_or_wrong (it: any)
{
	if (it instanceof Error)
	{
		return true
	}
	else if (Wrong.is(it))
	{
		return true
	}
	else
	{
		return false
	}
}

function raw_error (error: Error)
{
	return 0,
	{
		name: error.name,
		message: error.message,
		stack: error.stack,
	}
}
