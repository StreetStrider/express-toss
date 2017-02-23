/* @flow */

; import type { Wrong } from './Wrong'

; export type Debug = Wrong<any>

;

import $Wrong from './Wrong'

var debug: Debug = $Wrong('debug')

export default debug
