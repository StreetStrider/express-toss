/* @flow */

import Debug from '../../../Wrong/Debug'

import { expect_resp } from '../../_/pseudo-rs'

describe('Debug', () =>
{
	it('Debug()', () =>
	{
		var debug = Debug()

		expect_resp(debug.resp(),
			400, 'json', { error: 'debug', data: void 0 })
	})

	it('Debug(data)', () =>
	{
		var debug = Debug({ some: 'data' })

		expect_resp(debug.resp(),
			400, 'json', { error: 'debug', data: { some: 'data' }})
	})
})
