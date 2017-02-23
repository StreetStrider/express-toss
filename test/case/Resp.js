/* @flow */

import Resp from '../../Resp'

import { expect } from 'chai'

import { check_rs } from '../_/pseudo-rs'

describe('Resp', () =>
{
	var Intact = Resp.Intact

	it('Resp()', () =>
	{
		expect(Resp().inspect()).deep.eq([ 200, Intact, Intact ])
	})

	it('Resp(body)', () =>
	{
		expect(Resp('body').inspect()).deep.eq([ 200, Intact, 'body' ])

		expect(Resp(200).inspect()).deep.eq([ 200, Intact, 200 ])

		expect(Resp('json').inspect()).deep.eq([ 200, Intact, 'json' ])

		expect(Resp({ body: true }).inspect())
		.deep.eq([ 200, Intact, { body: true } ])

		expect(Resp(new Buffer('abc')).inspect())
		.deep.eq([ 200, Intact, new Buffer('abc') ])
	})

	it('Resp(status, body)', () =>
	{
		expect(Resp(400, 'body').inspect()).deep.eq([ 400, Intact, 'body' ])

		expect(Resp(400, 200).inspect()).deep.eq([ 400, Intact, 200 ])

		expect(Resp(400, 'json').inspect()).deep.eq([ 400, Intact, 'json' ])

		expect(Resp(400, { body: true }).inspect())
		.deep.eq([ 400, Intact, { body: true } ])

		expect(Resp(400, new Buffer('abc')).inspect())
		.deep.eq([ 400, Intact, new Buffer('abc') ])

		expect(Resp(400, Intact).inspect())
		.deep.eq([ 400, Intact, Intact ])
	})

	it('Resp(mime, body)', () =>
	{
		expect(Resp('json', 'body').inspect()).deep.eq([ 200, 'json', 'body' ])

		expect(Resp('json', 200).inspect()).deep.eq([ 200, 'json', 200 ])

		expect(Resp('json', { body: true }).inspect())
		.deep.eq([ 200, 'json', { body: true } ])

		expect(Resp('json', new Buffer('abc')).inspect())
		.deep.eq([ 200, 'json', new Buffer('abc') ])
	})

	it('Resp(status, mime, body)', () =>
	{
		expect(Resp(400, 'json', 'body').inspect())
		.deep.eq([ 400, 'json', 'body' ])

		expect(Resp(400, 'json', 200).inspect())
		.deep.eq([ 400, 'json', 200 ])

		expect(Resp(400, 'json', { body: true }).inspect())
		.deep.eq([ 400, 'json', { body: true } ])

		expect(Resp(400, 'json', new Buffer('abc')).inspect())
		.deep.eq([ 400, 'json', new Buffer('abc') ])
	})

	it('Resp(status, Intact, body)', () =>
	{
		/* @flow-off */
		expect(Resp(400, Intact, 'body').inspect())
		.deep.eq([ 400, Intact, 'body' ])

		/* @flow-off */
		expect(Resp(400, Intact, 200).inspect())
		.deep.eq([ 400, Intact, 200 ])

		/* @flow-off */
		expect(Resp(400, Intact, { body: true }).inspect())
		.deep.eq([ 400, Intact, { body: true } ])

		/* @flow-off */
		expect(Resp(400, Intact, new Buffer('abc')).inspect())
		.deep.eq([ 400, Intact, new Buffer('abc') ])
	})

	it('toss(Resp())', () =>
	{
		check_rs(Resp(), 200, null, null)
	})

	it('toss(Resp(body))', () =>
	{
		check_rs(Resp('body'), 200, null, 'body')
		check_rs(Resp(200), 200, null, 200)
		check_rs(Resp('json'), 200, null, 'json')
	})

	it('toss(Resp(status, body))', () =>
	{
		check_rs(Resp(400, 'body'), 400, null, 'body')
		check_rs(Resp(400, 200), 400, null, 200)
		check_rs(Resp(400, 'json'), 400, null, 'json')
		check_rs(Resp(400, Intact), 400, null, null)
	})

	it('toss(Resp(mime, body))', () =>
	{
		check_rs(Resp('json', 'body'), 200, 'json', 'body')
	})

	it('toss(Resp(status, mime, body))', () =>
	{
		check_rs(Resp(400, 'json', 'body'), 400, 'json', 'body')
		check_rs(Resp(400, 'json', 200), 400, 'json', 200)
		/* @flow-off */
		check_rs(Resp(400, Intact, 'body'), 400, null, 'body')
	})
})
