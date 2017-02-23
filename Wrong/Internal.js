/* @flow */

; import type { Wrong } from './Wrong'

; export type Internal = Wrong<void>

;

import $Wrong from './Wrong'

var internal: Internal = $Wrong('internal', { status: 500 })

export default () =>
{
	return internal()
}
