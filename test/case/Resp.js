/* @flow */

import Resp from '../../Resp'

import { expect } from 'chai'
import { repeat } from 'lodash'

import { expect_resp } from '../_/pseudo-rs'

describe('Resp', () =>
{
	var Intact = Resp.Intact

	it('Resp()', () =>
	{
		expect(Resp().toJSON()).deep.eq([ 200, Intact, Intact ])
	})

	it('Resp(body)', () =>
	{
		expect(Resp('body').toJSON()).deep.eq([ 200, Intact, 'body' ])

		expect(Resp(200).toJSON()).deep.eq([ 200, Intact, 200 ])

		expect(Resp('json').toJSON()).deep.eq([ 200, Intact, 'json' ])

		expect(Resp({ body: true }).toJSON())
		.deep.eq([ 200, Intact, { body: true } ])

		expect(Resp(new Buffer('abc')).toJSON())
		.deep.eq([ 200, Intact, new Buffer('abc') ])
	})

	it('Resp(status, body)', () =>
	{
		expect(Resp(400, 'body').toJSON()).deep.eq([ 400, Intact, 'body' ])

		expect(Resp(400, 200).toJSON()).deep.eq([ 400, Intact, 200 ])

		expect(Resp(400, 'json').toJSON()).deep.eq([ 400, Intact, 'json' ])

		expect(Resp(400, { body: true }).toJSON())
		.deep.eq([ 400, Intact, { body: true } ])

		expect(Resp(400, new Buffer('abc')).toJSON())
		.deep.eq([ 400, Intact, new Buffer('abc') ])

		expect(Resp(400, Intact).toJSON())
		.deep.eq([ 400, Intact, Intact ])
	})

	it('Resp(mime, body)', () =>
	{
		expect(Resp('json', 'body').toJSON()).deep.eq([ 200, 'json', 'body' ])

		expect(Resp('json', 200).toJSON()).deep.eq([ 200, 'json', 200 ])

		expect(Resp('json', { body: true }).toJSON())
		.deep.eq([ 200, 'json', { body: true } ])

		expect(Resp('json', new Buffer('abc')).toJSON())
		.deep.eq([ 200, 'json', new Buffer('abc') ])
	})

	it('Resp(status, mime, body)', () =>
	{
		expect(Resp(400, 'json', 'body').toJSON())
		.deep.eq([ 400, 'json', 'body' ])

		expect(Resp(400, 'json', 200).toJSON())
		.deep.eq([ 400, 'json', 200 ])

		expect(Resp(400, 'json', { body: true }).toJSON())
		.deep.eq([ 400, 'json', { body: true } ])

		expect(Resp(400, 'json', new Buffer('abc')).toJSON())
		.deep.eq([ 400, 'json', new Buffer('abc') ])
	})

	it('Resp(status, Intact, body)', () =>
	{
		/* @flow-off */
		expect(Resp(400, Intact, 'body').toJSON())
		.deep.eq([ 400, Intact, 'body' ])

		/* @flow-off */
		expect(Resp(400, Intact, 200).toJSON())
		.deep.eq([ 400, Intact, 200 ])

		/* @flow-off */
		expect(Resp(400, Intact, { body: true }).toJSON())
		.deep.eq([ 400, Intact, { body: true } ])

		/* @flow-off */
		expect(Resp(400, Intact, new Buffer('abc')).toJSON())
		.deep.eq([ 400, Intact, new Buffer('abc') ])
	})

	it('toss(Resp())', () =>
	{
		expect_resp(Resp(), 200, null, null)
	})

	it('toss(Resp(body))', () =>
	{
		expect_resp(Resp('body'), 200, null, 'body')
		expect_resp(Resp(200), 200, null, 200)
		expect_resp(Resp('json'), 200, null, 'json')
	})

	it('toss(Resp(status, body))', () =>
	{
		expect_resp(Resp(400, 'body'), 400, null, 'body')
		expect_resp(Resp(400, 200), 400, null, 200)
		expect_resp(Resp(400, 'json'), 400, null, 'json')
		expect_resp(Resp(400, Intact), 400, null, null)
	})

	it('toss(Resp(mime, body))', () =>
	{
		expect_resp(Resp('json', 'body'), 200, 'json', 'body')
	})

	it('toss(Resp(status, mime, body))', () =>
	{
		expect_resp(Resp(400, 'json', 'body'), 400, 'json', 'body')
		expect_resp(Resp(400, 'json', 200), 400, 'json', 200)
		/* @flow-off */
		expect_resp(Resp(400, Intact, 'body'), 400, null, 'body')
	})

	it('inspect(body)', () =>
	{
		expect(Resp('body').inspect()).eq('[Resp: 200, body]')
	})

	it('inspect(long body)', () =>
	{
		expect(Resp(repeat('_', 100)).inspect())
		.eq(`[Resp: 200, ${ repeat('_', 25) + '…' + repeat('_', 25) }]`)
	})

	it('inspect(status, body)', () =>
	{
		expect(Resp(201, 'body').inspect()).eq('[Resp: 201, body]')
	})

	it('inspect(mime, body)', () =>
	{
		expect(Resp('text', 'body').inspect()).eq('[Resp: 200, text, body]')
	})

	it('inspect(status, mime, body)', () =>
	{
		expect(Resp(201, 'text', 'body').inspect()).eq('[Resp: 201, text, body]')
	})

	it('inspect(object)', () =>
	{
		expect(Resp({ x: 1 }).inspect()).eq('[Resp: 200, { x: 1 }]')
	})

	it('inspect(array)', () =>
	{
		expect(Resp([ 1, 2, 3 ]).inspect()).eq('[Resp: 200, [ 1, 2, 3 ]]')
	})

	it('inspect(buffer)', () =>
	{
		expect(Resp(new Buffer('abc')).inspect())
		.eq('[Resp: 200, <Buffer 61 62 63>]')
	})
})
