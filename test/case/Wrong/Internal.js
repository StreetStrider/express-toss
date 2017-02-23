/* @flow */

import Internal from '../../../Wrong/Internal'

import { expect_resp } from '../../_/pseudo-rs'

describe('Internal', () =>
{
	it('Internal()', () =>
	{
		var internal = Internal('LOL')

		expect_resp(internal.resp(),
			400, 'json', { error: 'internal', data: null })
	})
})
