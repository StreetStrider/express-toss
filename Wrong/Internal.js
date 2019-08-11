
import type { Toss$Wrong } from './Wrong'
import type { Toss$Wrong$Instance } from './Wrong'

export type Toss$Internal = Toss$Wrong<'internal', void>
export type Toss$Internal$Instance = Toss$Wrong$Instance<'internal', void>


import Wrong from './Wrong'


var InternalWrong = Wrong('internal', { status: 500 })


var Internal: Toss$Internal = function Internal (): Toss$Internal$Instance
{
	return (InternalWrong(): Toss$Internal$Instance)
}

export default Internal
