
import toss from '../../toss-to'
import Resp from '../../Resp'
import Wrong from '../../Wrong'

import { pseudo_rs, expect_rs } from '../_/pseudo-rs'

describe('toss-to', () =>
{
	it('toss(null)', () =>
	{
		var rs = pseudo_rs()

		toss(null, rs)

		expect_rs(rs, null, null, null)
	})

	it('toss(void 0)', () =>
	{
		var rs = pseudo_rs()

		toss(void 0, rs)

		expect_rs(rs, null, null, void 0)
	})

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

	it('toss(wrong)', () =>
	{
		var rs = pseudo_rs()
		var w = Wrong('some_error')

		toss(w({ detail: true }), rs)

		expect_rs(rs, 400, 'json', { error: 'some_error', data: { detail: true }})
	})
})
