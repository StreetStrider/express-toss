/* @flow */

import { inspect } from 'util'

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

		expect(Resp(Buffer.from('abc')).toJSON())
		.deep.eq([ 200, Intact, Buffer.from('abc') ])
	})

	it('Resp(status, body)', () =>
	{
		expect(Resp(400, 'body').toJSON()).deep.eq([ 400, Intact, 'body' ])

		expect(Resp(400, 200).toJSON()).deep.eq([ 400, Intact, 200 ])

		expect(Resp(400, 'json').toJSON()).deep.eq([ 400, Intact, 'json' ])

		expect(Resp(400, { body: true }).toJSON())
		.deep.eq([ 400, Intact, { body: true } ])

		expect(Resp(400, Buffer.from('abc')).toJSON())
		.deep.eq([ 400, Intact, Buffer.from('abc') ])

		expect(Resp(400, Intact).toJSON())
		.deep.eq([ 400, Intact, Intact ])
	})

	it('Resp(mime, body)', () =>
	{
		expect(Resp('json', 'body').toJSON()).deep.eq([ 200, 'json', 'body' ])

		expect(Resp('json', 200).toJSON()).deep.eq([ 200, 'json', 200 ])

		expect(Resp('json', { body: true }).toJSON())
		.deep.eq([ 200, 'json', { body: true } ])

		expect(Resp('json', Buffer.from('abc')).toJSON())
		.deep.eq([ 200, 'json', Buffer.from('abc') ])
	})

	it('Resp(status, mime, body)', () =>
	{
		expect(Resp(400, 'json', 'body').toJSON())
		.deep.eq([ 400, 'json', 'body' ])

		expect(Resp(400, 'json', 200).toJSON())
		.deep.eq([ 400, 'json', 200 ])

		expect(Resp(400, 'json', { body: true }).toJSON())
		.deep.eq([ 400, 'json', { body: true } ])

		expect(Resp(400, 'json', Buffer.from('abc')).toJSON())
		.deep.eq([ 400, 'json', Buffer.from('abc') ])
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
		expect(Resp(400, Intact, Buffer.from('abc')).toJSON())
		.deep.eq([ 400, Intact, Buffer.from('abc') ])
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

	it('custom inspect(body)', () =>
	{
		expect(inspect(Resp('body'))).eq('[Resp: 200, body]')
	})

	it('custom inspect(long body)', () =>
	{
		expect(inspect(Resp(repeat('_', 100))))
		.eq(`[Resp: 200, ${ repeat('_', 25) + '…' + repeat('_', 25) }]`)
	})

	it('custom inspect(status, body)', () =>
	{
		expect(inspect(Resp(201, 'body'))).eq('[Resp: 201, body]')
	})

	it('custom inspect(mime, body)', () =>
	{
		expect(inspect(Resp('text', 'body'))).eq('[Resp: 200, text, body]')
	})

	it('custom inspect(status, mime, body)', () =>
	{
		expect(inspect(Resp(201, 'text', 'body'))).eq('[Resp: 201, text, body]')
	})

	it('custom inspect(object)', () =>
	{
		expect(inspect(Resp({ x: 1 }))).eq('[Resp: 200, { x: 1 }]')
	})

	it('custom inspect(array)', () =>
	{
		expect(inspect(Resp([ 1, 2, 3 ]))).eq('[Resp: 200, [ 1, 2, 3 ]]')
	})

	it('custom inspect(buffer)', () =>
	{
		expect(inspect(Resp(Buffer.from('abc'))))
		.eq('[Resp: 200, <Buffer 61 62 63>]')
	})
})
