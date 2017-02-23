/* @flow */

import Wrong from '../../Wrong'

import { expect } from 'chai'

import { expect_resp } from '../_/pseudo-rs'

describe('Wrong', () =>
{
	it('Wrong()', () =>
	{
		var wrong = Wrong('wrong_input')

		expect(wrong).a('function')

		var wr = wrong()

		expect(wr.code).eq('wrong_input')
		expect(wr.inspect).a('function')
		expect(wr.resp).a('function')

		var resp = wr.resp()

		expect(resp.inspect).a('function')
		expect(resp.toss).a('function')

		expect_resp(resp, 400, 'json',
		{
			error: 'wrong_input',
			data:   null
		})
	})
})
