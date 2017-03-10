/* @flow */

; import type { Toss$Wrong } from './Wrong'

; export type Toss$Debug = Toss$Wrong<any>

;

import $Wrong from './Wrong'

var $$Debug: Toss$Debug = $Wrong('debug', { status: 500 })

var marker = Symbol('Debug')

var $Debug: Toss$Debug = function (data)
{
	var debug = $$Debug(data)

	/* @flow-off */
	debug[marker] = true

	return debug
}

export default $Debug

$Debug.is = (it: any) =>
{
	return Boolean(it && (it[marker]))
}
