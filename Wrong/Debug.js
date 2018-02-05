/* @flow */

; import type { Toss$Wrong } from './Wrong'
import type { Toss$Wrong$Instance } from './Wrong'

export type Toss$Debug<Data> = Toss$Wrong<'debug', Data>
; export type Toss$Debug$Instance<Data> = Toss$Wrong$Instance<'debug', Data>

;

import Wrong from './Wrong'

var debug_wrong = Wrong('debug', { status: 500 })

var marker = Symbol('Debug')

/* @flow-off */
export default function Debug<Data> (data: Data): Toss$Debug$Instance<Data>
{
	var debug = debug_wrong(data)

	/* @flow-off */
	debug[marker] = true

	return debug
}

Debug.is = (it: any) =>
{
	return Boolean(it && (it[marker]))
}
