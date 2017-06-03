/* @flow */

; import type { Toss$Wrong } from './Wrong'

; export type Toss$Internal = Toss$Wrong<'internal', void>

;

import Wrong from './Wrong'

var internal_wrong = Wrong('internal', { status: 500 })

var Internal: Toss$Internal = function Internal ()
{
	return internal_wrong()
}

export default Internal
