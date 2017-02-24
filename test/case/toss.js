/* @flow */

import tosser from '../../tosser'

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

		return request('http://localhost:9001/json', { resolveWithFullResponse: true })
		.then(expect_head(200, 'application/json'))
		.then(http =>
		{
			expect(http.body).eq('{"data":true}')
			expect(JSON.parse(http.body)).deep.eq({ data: true })
		})
	})
})

function expect_head (status, mime)
{
	return (http) =>
	{
		expect(http.statusCode).eq(status)
		expect(http.headers['content-type']).match(new RegExp(mime))

		return http
	}
}
