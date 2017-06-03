/* @flow */

; export type Options =
{
	debug?: boolean,
}

;

var assign = Object.assign

import Debug from './Wrong/Debug'
import Internal from './Wrong/Internal'


var defaults =
{
	debug: false
}

export default function obscurer (options?: Options)
{
	options = assign({}, defaults, options)

	/* @flow-off */
	var debug: boolean = options.debug

	return function obscure (resp: any)
	{
		if (debug)
		{
			if (resp instanceof Error)
			{
				console.error('toss: non-protocol error, upgrade to Debug(error)')
				console.error(resp)

				return Debug(raw_error(resp))
			}
		}
		else
		{
			if (resp instanceof Error)
			{
				console.error('toss: non-protocol attempt, mask as Internal()')
				console.error(resp)

				return Internal()
			}
			else if (Debug.is(resp))
			{
				console.error('toss: Debug() attempt, mask as Internal()')
				console.error(resp)

				return Internal()
			}
		}

		return resp
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
