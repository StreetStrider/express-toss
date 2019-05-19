/* @flow */
/* global express$Middleware */
/* global express$Request */
/* global express$Response */

import type { Options as Toss$Options } from './obscure'

export type Toss$Handler<T> = (rq: express$Request) => Promise<T> | T


import obscurer from './obscure'
import toss_to  from './toss-to'


export default function tosser (options?: Toss$Options)
{
	var obscure = obscurer(options)

	return 0,
	{
		method: method,
		toss:   toss,
	}

	function method<T> (handler: Toss$Handler<T>): express$Middleware
	{
		var $handler = capture(handler)

		return (rq: express$Request, rs: express$Response) =>
		{
			$handler(rq)
			.then(obscure.resolve, obscure.reject)
			.then(resp => toss(resp, rs))
		}
	}

	function toss (resp: any, rs: express$Response)
	{
		toss_to(obscure.fade(resp), rs)
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
