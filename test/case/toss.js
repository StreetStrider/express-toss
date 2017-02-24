/* @flow */

import tosser from '../../tosser'

import { expect } from 'chai'

import express from 'express'
import request from 'request-promise'

var assign = Object.assign
var load = JSON.parse


function request_local_full (options: Object)
{
	options = assign(
	{
		resolveWithFullResponse: true,
		method: 'GET'
	}
	, options,
	{
		uri: 'http://localhost:9001' + options.uri
	})

	return request(options)
}

function request_local (uri: string)
{
	return request_local_full({ uri: uri })
}


function expect_head (status, mime)
{
	return (http) =>
	{
		expect(http.statusCode).eq(status)
		expect(http.headers['content-type']).match(new RegExp(mime))

		return http
	}
}

function expect_body (body)
{
	return (http) =>
	{
		expect(http.body).eq(body)

		return http
	}
}

function expect_body_json (body)
{
	return (http) =>
	{
		expect(load(http.body)).deep.eq(body)

		return http
	}
}


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

	it('/json full request', () =>
	{
		server.get('/json', method(() =>
		{
			return { data: true }
		}))

		return request_local('/json')
		.then(expect_head(200, 'application/json'))
		.then(expect_body('{"data":true}'))
		.then(expect_body_json({ data: true }))
	})
})
