/* @flow */

import Wrong from '../../../Wrong'

import { expect } from 'chai'

import { expect_resp } from '../../_/pseudo-rs'

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

		expect(wr.inspect()).eq('[Wrong: wrong_input]')

		var resp = wr.resp()

		expect(resp.inspect).a('function')
		expect(resp.toss).a('function')

		expect_resp(resp, 400, 'json',
		{
			error: 'wrong_input',
			data:   void 0
		})
	})

	it('Wrong(data)', () =>
	{
		var wrong = Wrong('wrong_input')

		var wr = wrong({ data: 'data' })

		expect_resp(wr.resp(), 400, 'json',
		{
			error: 'wrong_input',
			data: { data: 'data' }
		})

		expect(wr.inspect()).eq('[Wrong: wrong_input]')
	})

	it('Wrong(data) with options', () =>
	{
		var wrong = Wrong('not_found',
		{
			status: 404
		})

		var wr = wrong({ data: 'data' })

		expect_resp(wr.resp(), 404, 'json',
		{
			error: 'not_found',
			data: { data: 'data' }
		})
	})

	/* eslint-disable max-statements */
	it('Wrong.is()', () =>
	{
		var W1 = Wrong('x')
		var W2 = Wrong('y')

		expect(Wrong.is(null)).false
		expect(Wrong.is(void 0)).false
		expect(Wrong.is(false)).false
		expect(Wrong.is(true)).false
		expect(Wrong.is(0)).false
		expect(Wrong.is(17)).false
		expect(Wrong.is(() => {})).false
		expect(Wrong.is({})).false
		expect(Wrong.is([])).false

		expect(Wrong.is(Wrong)).false
		expect(Wrong.is(W1)).false
		expect(Wrong.is(W2)).false

		var w1_1 = W1()
		var w1_2 = W1()
		var w2_1 = W2({ w: 1 })
		var w2_2 = W2({ w: 2 })

		expect(Wrong.is(w1_1)).true
		expect(Wrong.is(w1_2)).true
		expect(Wrong.is(w2_1)).true
		expect(Wrong.is(w2_2)).true
	})
	/* eslint-enable max-statements */
})
