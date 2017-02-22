/* @flow */

import Resp from '../../Resp'

import { expect } from 'chai'

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

		expect(Resp({ body: true }).inspect())
		.deep.eq([ 200, Intact, { body: true } ])

		expect(Resp(new Buffer('abc')).inspect())
		.deep.eq([ 200, Intact, new Buffer('abc') ])
	})

	it('Resp(status, body)', () =>
	{
		expect(Resp(400, 'body').inspect()).deep.eq([ 400, Intact, 'body' ])

		expect(Resp(400, 200).inspect()).deep.eq([ 400, Intact, 200 ])

		expect(Resp(400, { body: true }).inspect())
		.deep.eq([ 400, Intact, { body: true } ])

		expect(Resp(400, new Buffer('abc')).inspect())
		.deep.eq([ 400, Intact, new Buffer('abc') ])
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
})
