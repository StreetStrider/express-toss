
import Debug    from '../../../Wrong/Debug'
import Internal from '../../../Wrong/Internal'
import Wrong    from '../../../Wrong'

import { expect } from 'chai'

import { expect_resp } from '../../_/pseudo-rs'

describe('Debug', () =>
{
	it('Debug()', () =>
	{
		var debug = Debug()

		expect_resp(debug.resp(),
			500, 'json', { error: 'debug', data: void 0 })
	})

	it('Debug(data)', () =>
	{
		var debug = Debug({ some: 'data' })

		expect_resp(debug.resp(),
			500, 'json', { error: 'debug', data: { some: 'data' }})
	})

	/* eslint-disable max-statements */
	it('Debug.is()', () =>
	{
		var W = Wrong('x')

		expect(Debug.is(null)).false
		expect(Debug.is(void 0)).false
		expect(Debug.is(false)).false
		expect(Debug.is(true)).false
		expect(Debug.is(0)).false
		expect(Debug.is(17)).false
		expect(Debug.is(() => {})).false
		expect(Debug.is({})).false
		expect(Debug.is([])).false
		expect(Debug.is({ some: 'data' })).false

		expect(Debug.is(Wrong)).false
		expect(Debug.is(Internal)).false
		expect(Debug.is(Debug)).false

		expect(Debug.is(W)).false

		var w = W()
		var i = Internal()
		var d = Debug({ some: 'data' })

		expect(Debug.is(w)).false
		expect(Debug.is(i)).false
		expect(Debug.is(d)).true
	})
	/* eslint-enable max-statements */
})
