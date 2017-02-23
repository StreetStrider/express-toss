/* @flow */

import toss from '../../toss-to'
import Resp from '../../Resp'

//import { expect } from 'chai'

import { pseudo_rs, expect_rs } from '../_/pseudo-rs'

describe('toss-to', () =>
{
	it('toss(plain)', () =>
	{
		var rs = pseudo_rs()

		toss({ body: true }, rs)

		expect_rs(rs, null, null, { body: true })
	})

	it('toss(Resp(status, body))', () =>
	{
		var rs = pseudo_rs()

		toss(Resp(200, 'body'), rs)

		expect_rs(rs, 200, null, 'body')
	})

	it('toss(Resp(status, mime, body))', () =>
	{
		var rs = pseudo_rs()

		toss(Resp(200, 'json', 'body'), rs)

		expect_rs(rs, 200, 'json', 'body')
	})
})
