/* @flow */

; import type { Wrong } from './Wrong'

; export type Debug = Wrong<any>

;

import $Wrong from './Wrong'

var $$Debug: Debug = $Wrong('debug', { status: 500 })

var marker = Symbol('Debug')

var $Debug: Debug = function (data)
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
