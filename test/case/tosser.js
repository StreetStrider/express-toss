/* @flow */

import tosser from '../../tosser'
import Resp   from '../../Resp'

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
		var uri = '/json'

		server.get(uri, method(() =>
		{
			return { data: true }
		}))

		return request_local(uri)
		.then(expect_head(200, 'application/json'))
		.then(expect_body('{"data":true}'))
		.then(expect_body_json({ data: true }))
	})

	it('/text full request', () =>
	{
		var uri = '/text'

		server.get(uri, method(() =>
		{
			return 'TEXT'
		}))

		return request_local(uri)
		.then(expect_head(200, 'text/html'))
		.then(expect_body('TEXT'))
	})

	it('PUT /json full request', () =>
	{
		var uri = '/json'

		server.put(uri, method(() =>
		{
			return { ok: true }
		}))

		return request_local_full({ uri: uri, method: 'PUT' })
		.then(expect_head(200, 'application/json'))
		.then(expect_body('{"ok":true}'))
		.then(expect_body_json({ ok: true }))
	})

	it('/promise', () =>
	{
		var uri = '/promise'

		server.get(uri, method(() =>
		{
			return new Promise(rs =>
			{
				setTimeout(() => rs({ promise: true }), 50)
			})
		}))

		return request_local(uri)
		.then(expect_head(200, 'application/json'))
		.then(expect_body('{"promise":true}'))
		.then(expect_body_json({ promise: true }))
	})

	it('/resp Resp(body)', () =>
	{
		var uri = '/resp'

		server.get(uri, method(() =>
		{
			return Resp({ resp: [ 1, 2, 3 ] })
		}))

		return request_local(uri)
		.then(expect_head(200, 'application/json'))
		.then(expect_body('{"resp":[1,2,3]}'))
		.then(expect_body_json({ resp: [ 1, 2, 3 ] }))
	})

	it('/resp Resp(status, body)', () =>
	{
		var uri = '/resp-status'

		server.get(uri, method(() =>
		{
			return Resp(202, { resp: 'OK' })
		}))

		return request_local(uri)
		.then(expect_head(202, 'application/json'))
		.then(expect_body_json({ resp: 'OK' }))
	})

	it('/resp Resp(mime, body)', () =>
	{
		var uri = '/resp-mime'

		server.get(uri, method(() =>
		{
			return Resp('text', 'TEXT-200')
		}))

		return request_local(uri)
		.then(expect_head(200, 'text/plain'))
		.then(expect_body('TEXT-200'))
	})

	it('/resp Resp(status, mime, body)', () =>
	{
		var uri = '/resp-status-mime'

		server.get(uri, method(() =>
		{
			return Resp(202, 'text', 'TEXT-202')
		}))

		return request_local(uri)
		.then(expect_head(202, 'text/plain'))
		.then(expect_body('TEXT-202'))
	})

	it('/resp Resp(status, mime, body)', () =>
	{
		var uri = '/resp-status-mime'

		server.get(uri, method(() =>
		{
			return Resp(202, 'text', 'TEXT-202')
		}))

		return request_local(uri)
		.then(expect_head(202, 'text/plain'))
		.then(expect_body('TEXT-202'))
	})

	it('/resp-promise Resp with promise', () =>
	{
		var uri = '/resp-promise'

		server.get(uri, method(() =>
		{
			return new Promise(rs =>
			{
				setTimeout(() => rs(Resp({ promise: true })), 50)
			})
		}))

		return request_local(uri)
		.then(expect_head(200, 'application/json'))
		.then(expect_body_json({ promise: true }))
	})

	it('/resp Resp(status = 400)', () =>
	{
		var uri = '/resp-status-400'

		server.get(uri, method(() =>
		{
			return Resp(400, '')
		}))

		return request_local_full({ uri: uri, simple: false })
		.then(expect_head(400, 'text/html'))
	})
})
