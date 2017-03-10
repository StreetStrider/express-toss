/* @flow */

import Internal from '../../../Wrong/Internal'

import { expect_resp } from '../../_/pseudo-rs'

describe('Internal', () =>
{
	it('Internal()', () =>
	{
		var internal = Internal()

		expect_resp(internal.resp(),
			500, 'json', { error: 'internal', data: void 0 })
	})

	it('Internal(something) ignores something', () =>
	{
		/* @flow-off */
		var internal = Internal('something')

		expect_resp(internal.resp(),
			500, 'json', { error: 'internal', data: void 0 })
	})
})
