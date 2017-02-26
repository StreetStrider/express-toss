/* @flow */

import tosser from '../../tosser'
import Resp   from '../../Resp'

import { expect } from 'chai'
import sinon from 'sinon'

import express from 'express'
import request from 'request-promise'

var noop = () => {}
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

function expect_body_json_wrong (body)
{
	return (http) =>
	{
		var json = load(http.body)

		expect(json && json.data && json.data.stack).a('string')
		delete json.data.stack

		expect(json).deep.eq(body)

		return http
	}
}

function expect_console (spy, msgs)
{
	return (it) =>
	{
		var calls = spy
		.getCalls()
		.map(call => call.args)

		expect(calls).deep.eq(msgs)

		spy.reset()

		return it
	}
}


// TODO rm only
describe.only('toss', () =>
{
	var toss = tosser()
	var method = toss.method

	var toss_debug = tosser({ debug: true })
	var method_debug = toss_debug.method

	var save_console
	var spy_console_error

	var server

	before(() =>
	{
		save_console = console.error
		/* @flow-off*/
		console.error = noop
		spy_console_error = sinon.spy(console, 'error')

		server = express()

		return new Promise(rs =>
		{
			server.listen(9001, () => rs())
		})
	})

	after(() =>
	{
		/* @flow-off */
		console.error = save_console
	})

	it('resp json', () =>
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

	it('resp text', () =>
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

	it('resp PUT json', () =>
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

	it('resp with promise', () =>
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

	it('resp Resp(body)', () =>
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

	it('resp Resp(status, body)', () =>
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

	it('resp Resp(mime, body)', () =>
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

	it('resp Resp(status, mime, body)', () =>
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

	it('resp Resp(status, mime, body)', () =>
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

	it('resp (Resp with promise)', () =>
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

	it('resp Resp(status = 400)', () =>
	{
		var uri = '/resp-status-400'

		server.get(uri, method(() =>
		{
			return Resp(400, '')
		}))

		return request_local_full({ uri: uri, simple: false })
		.then(expect_head(400, 'text/html'))
	})

	it('resp Error', () =>
	{
		var uri = '/resp-error'
		var uri_debug = uri + '/debug'

		var error = Error('resolve_with_error')

		server.get(uri, method(() =>
		{
			return error
		}))

		server.get(uri_debug, method_debug(() =>
		{
			return error
		}))

		return request_local_full({ uri: uri, simple: false })
		.then(expect_head(500, 'application/json'))
		.then(expect_body_json({ error: 'internal' }))
		.then(expect_console(spy_console_error,
		[
			[ 'toss: non-protocol attempt, mask as Internal()' ],
			[ error ]
		]))
		.then(() =>
		{
			return request_local_full({ uri: uri_debug, simple: false })
			.then(expect_head(500, 'application/json'))
			.then(expect_body_json_wrong(
			{
				error: 'debug',
				data:
				{ name: 'Error', message: 'resolve_with_error' }
			}))
			.then(expect_console(spy_console_error,
			[
				[ 'toss: non-protocol error, upgrade to Debug(error)' ],
				[ error ]
			]))
		})
	})

	it('throw Error', () =>
	{
		var uri = '/throw-error'
		var uri_debug = uri + '/debug'

		var error = Error('throw_error')

		server.get(uri, method(() =>
		{
			throw error
		}))

		server.get(uri_debug, method_debug(() =>
		{
			throw error
		}))

		return request_local_full({ uri: uri, simple: false })
		.then(expect_head(500, 'application/json'))
		.then(expect_body_json({ error: 'internal' }))
		.then(expect_console(spy_console_error,
		[
			[ 'toss: non-protocol attempt, mask as Internal()' ],
			[ error ]
		]))
		.then(() =>
		{
			return request_local_full({ uri: uri_debug, simple: false })
			.then(expect_head(500, 'application/json'))
			.then(expect_body_json_wrong(
			{
				error: 'debug',
				data:
				{ name: 'Error', message: 'throw_error' }
			}))
			.then(expect_console(spy_console_error,
			[
				[ 'toss: non-protocol error, upgrade to Debug(error)' ],
				[ error ]
			]))
		})
	})
})
