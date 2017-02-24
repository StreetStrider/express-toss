/* @flow */

import tosser from '../../toss'

import { expect } from 'chai'

import express from 'express'
import request from 'request-promise'

// TODO rm only
describe.only('toss', () =>
{
	var toss = tosser()
	var method = toss.method

	var server

	before(() =>
	{
		server = express()

		return new Promise(rs =>
		{
			server.listen(9001, () => rs())
		})
	})

	it('works', () =>
	{
		server.get('/json', method(() =>
		{
			return { data: true }
		}))

		return request('http://localhost:9001/json', { json: true })
		.then(body =>
		{
			expect(body).deep.eq({ data: true })
		})
	})
})
