/* @flow */

; import type { Toss$Wrong } from './Wrong'

; export type Toss$Internal = Toss$Wrong<void>

;

import Wrong from './Wrong'

var internal: Toss$Internal = Wrong('internal', { status: 500 })

export default function Internal ()
{
	return internal()
}
