/* @flow */

; import type { Wrong } from './Wrong'

; export type Internal = Wrong<void>

;

import $Wrong from './Wrong'

var internal: Internal = $Wrong('internal')

export default () =>
{
	return internal()
}
