/* @flow */

; import type { Toss$Wrong } from './Wrong'

; export type Toss$Debug = Toss$Wrong<'debug', any>

;

import Wrong from './Wrong'

var debug_wrong = Wrong('debug', { status: 500 })

var marker = Symbol('Debug')

var Debug: Toss$Debug = function Debug (data)
{
	var debug = debug_wrong(data)

	/* @flow-off */
	debug[marker] = true

	return debug
}

export default Debug

Debug.is = (it: any) =>
{
	return Boolean(it && (it[marker]))
}
