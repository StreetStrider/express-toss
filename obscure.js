/* @flow */

; export type Options =
{
	debug?: boolean,
}

;

var assign = Object.assign

import Wrong from './Wrong'
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

	var obscure =
	{
		resolve: function resolve (resp: any)
		{
			return resp
		},

		reject: function reject (resp: any)
		{
			if (! error_or_wrong(resp))
			{
				console.error('toss: ' +
				'rejection with nor Error, nor Wrong, ' +
				'upgrade to Debug(rejection)')
				console.error(resp)

				resp = Debug(resp)
			}

			return resp
		},

		fade: function fade (resp: any)
		{
			if (debug)
			{
				if (resp instanceof Error)
				{
					console.error('toss: ' +
					'non-protocol error, upgrade to Debug(error)')
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
		},
	}

	return obscure
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
