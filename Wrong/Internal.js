/* @flow */

; import type { Wrong } from './Wrong'

; export type Internal = Wrong<*>

;

import $Wrong from './Wrong'

var internal: Internal = $Wrong('internal')

export default () =>
{
	return internal()
}
