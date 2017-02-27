/* @flow */

import tosser from '../../tosser'
import Resp   from '../../Resp'
import Debug  from '../../Wrong/Debug'

import { inspect } from 'util'

import { expect } from 'chai'
import sinon from 'sinon'
import { generate as random } from 'randomstring'

import express from 'express'
import request from 'request-promise'
import { flow as compose } from 'lodash'

var noop = () => {}
var assign = Object.assign
var load = JSON.parse

function with_uri (fn)
{
	return function ()
	{
		var uri = '/' + random(16)
		return fn.call(this, uri)
	}
}

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

		expect(json && json.data && json.data.stack, 'has a stack').a('string')
		delete json.data.stack

		expect(json).deep.eq(body)

		return http
	}
}

function expect_console (spy, args_s)
{
	return (it) =>
	{
		try
		{
			var calls = spy
			.getCalls()
			.map(call => call.args)

			expect(marshall(calls)).deep.eq(marshall(args_s))

			return it
		}
		finally
		{
			spy.reset()
		}
	}

	function marshall (args_s)
	{
		return args_s.map(args => inspect(args))
	}
}


// TODO rm only
describe.only('toss', () =>
{
	var toss = tosser()
	var method = toss.method

	var toss_debug = tosser({ debug: true })
	var method_debug = toss_debug.method

	if (1)
	{
		var save_console = console.error
		/* @flow-off*/
		console.error = noop
	}
	var spy_console_error = sinon.spy(console, 'error')

	var server

	before(() =>
	{
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

	it('resp json', with_uri(uri =>
	{
		server.get(uri, method(() =>
		{
			return { data: true }
		}))

		return request_local(uri)
		.then(expect_head(200, 'application/json'))
		.then(expect_body('{"data":true}'))
		.then(expect_body_json({ data: true }))
	}))

	it('resp text', with_uri(uri =>
	{
		server.get(uri, method(() =>
		{
			return 'TEXT'
		}))

		return request_local(uri)
		.then(expect_head(200, 'text/html'))
		.then(expect_body('TEXT'))
	}))

	it('resp PUT json', with_uri(uri =>
	{
		server.put(uri, method(() =>
		{
			return { ok: true }
		}))

		return request_local_full({ uri: uri, method: 'PUT' })
		.then(expect_head(200, 'application/json'))
		.then(expect_body('{"ok":true}'))
		.then(expect_body_json({ ok: true }))
	}))

	it('resp with promise', with_uri(uri =>
	{
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
	}))

	it('resp Resp(body)', with_uri(uri =>
	{
		server.get(uri, method(() =>
		{
			return Resp({ resp: [ 1, 2, 3 ] })
		}))

		return request_local(uri)
		.then(expect_head(200, 'application/json'))
		.then(expect_body('{"resp":[1,2,3]}'))
		.then(expect_body_json({ resp: [ 1, 2, 3 ] }))
	}))

	it('resp Resp(status, body)', with_uri(uri =>
	{
		server.get(uri, method(() =>
		{
			return Resp(202, { resp: 'OK' })
		}))

		return request_local(uri)
		.then(expect_head(202, 'application/json'))
		.then(expect_body_json({ resp: 'OK' }))
	}))

	it('resp Resp(mime, body)', with_uri(uri =>
	{
		server.get(uri, method(() =>
		{
			return Resp('text', 'TEXT-200')
		}))

		return request_local(uri)
		.then(expect_head(200, 'text/plain'))
		.then(expect_body('TEXT-200'))
	}))

	it('resp Resp(status, mime, body)', with_uri(uri =>
	{
		server.get(uri, method(() =>
		{
			return Resp(202, 'text', 'TEXT-202')
		}))

		return request_local(uri)
		.then(expect_head(202, 'text/plain'))
		.then(expect_body('TEXT-202'))
	}))

	it('resp Resp(status, mime, body)', with_uri(uri =>
	{
		server.get(uri, method(() =>
		{
			return Resp(202, 'text', 'TEXT-202')
		}))

		return request_local(uri)
		.then(expect_head(202, 'text/plain'))
		.then(expect_body('TEXT-202'))
	}))

	it('resp (Resp with promise)', with_uri(uri =>
	{
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
	}))

	it('resp Resp(status = 400)', with_uri(uri =>
	{
		server.get(uri, method(() =>
		{
			return Resp(400, '')
		}))

		return request_local_full({ uri: uri, simple: false })
		.then(expect_head(400, 'text/html'))
	}))


	/* test rejections */
	function test_debug_difference (handler, strict_check, debug_check)
	{
		/* nonlocal server */
		/* nonlocal method */
		/* nonlocal method_debug */
		/* nonlocal request_local_full */

		return with_uri(uri =>
		{
			var uri_debug = uri + '/debug'

			server.get(uri, method(handler))
			server.get(uri_debug, method_debug(handler))

			return Promise.resolve()
			.then(() =>
			{
				return request_local_full({ uri: uri, simple: false })
				.then(strict_check)
			})
			.then(() =>
			{
				return request_local_full({ uri: uri_debug, simple: false })
				.then(debug_check)
			})
		})
	}

	it('resp Error', test_debug_difference(
	() =>
	{
		return new Error('resolve_with_error')
	},
	compose(
		expect_head(500, 'application/json'),
		expect_body_json({ error: 'internal' }),
		expect_console(spy_console_error,
		[
			[ 'toss: non-protocol attempt, mask as Internal()' ],
			[ new Error('resolve_with_error') ]
		])
	),
	compose(
		expect_head(500, 'application/json'),
		expect_body_json_wrong(
		{
			error: 'debug',
			data:
			{ name: 'Error', message: 'resolve_with_error' }
		}),
		expect_console(spy_console_error,
		[
			[ 'toss: non-protocol error, upgrade to Debug(error)' ],
			[ new Error('resolve_with_error') ]
		])
	)))

	it('resp resolve(Error)', test_debug_difference(
	() =>
	{
		return Promise.resolve(new Error('promise_resolve_with_error'))
	},
	compose(
		expect_head(500, 'application/json'),
		expect_body_json({ error: 'internal' }),
		expect_console(spy_console_error,
		[
			[ 'toss: non-protocol attempt, mask as Internal()' ],
			[ new Error('promise_resolve_with_error') ]
		])
	),
	compose(
		expect_head(500, 'application/json'),
		expect_body_json_wrong(
		{
			error: 'debug',
			data:
			{ name: 'Error', message: 'promise_resolve_with_error' }
		}),
		expect_console(spy_console_error,
		[
			[ 'toss: non-protocol error, upgrade to Debug(error)' ],
			[ new Error('promise_resolve_with_error') ]
		])
	)))

	it('throw non-Error, non-Wrong', test_debug_difference(
	() =>
	{
		// eslint-disable-next-line no-throw-literal
		throw { literal: true }
	},
	compose(
		expect_head(500, 'application/json'),
		expect_body_json({ error: 'internal' }),
		expect_console(spy_console_error,
		[
			[ 'toss: rejection with nor Error, nor Wrong, upgrade to Debug(rejection)' ],
			[ { literal: true } ],
			[ 'toss: Debug() attempt, mask as Internal()' ],
			[ Debug() ],
		])
	),
	compose(
		expect_head(500, 'application/json'),
		expect_body_json(
		{
			error: 'debug',
			data: { literal: true }
		}),
		expect_console(spy_console_error,
		[
			[ 'toss: rejection with nor Error, nor Wrong, upgrade to Debug(rejection)' ],
			[ { literal: true } ],
		])
	)))

	it('reject non-Error, non-Wrong', test_debug_difference(
	() =>
	{
		return Promise.reject({ promise_literal: true })
	},
	compose(
		expect_head(500, 'application/json'),
		expect_body_json({ error: 'internal' }),
		expect_console(spy_console_error,
		[
			[ 'toss: rejection with nor Error, nor Wrong, upgrade to Debug(rejection)' ],
			[ { promise_literal: true } ],
			[ 'toss: Debug() attempt, mask as Internal()' ],
			[ Debug() ],
		])
	),
	compose(
		expect_head(500, 'application/json'),
		expect_body_json(
		{
			error: 'debug',
			data: { promise_literal: true }
		}),
		expect_console(spy_console_error,
		[
			[ 'toss: rejection with nor Error, nor Wrong, upgrade to Debug(rejection)' ],
			[ { promise_literal: true } ],
		])
	)))

	it('throw Error', test_debug_difference(
	() =>
	{
		throw new Error('throw_error')
	},
	compose(
		expect_head(500, 'application/json'),
		expect_body_json({ error: 'internal' }),
		expect_console(spy_console_error,
		[
			[ 'toss: non-protocol attempt, mask as Internal()' ],
			[ new Error('throw_error') ]
		])
	),
	compose(
		expect_head(500, 'application/json'),
		expect_body_json_wrong(
		{
			error: 'debug',
			data:
			{ name: 'Error', message: 'throw_error' }
		}),
		expect_console(spy_console_error,
		[
			[ 'toss: non-protocol error, upgrade to Debug(error)' ],
			[ new Error('throw_error') ]
		])
	)))

	it('resp reject(Error)', test_debug_difference(
	() =>
	{
		return Promise.reject(new Error('reject_error'))
	},
	compose(
		expect_head(500, 'application/json'),
		expect_body_json({ error: 'internal' }),
		expect_console(spy_console_error,
		[
			[ 'toss: non-protocol attempt, mask as Internal()' ],
			[ new Error('reject_error') ]
		])
	),
	compose(
		expect_head(500, 'application/json'),
		expect_body_json_wrong(
		{
			error: 'debug',
			data:
			{ name: 'Error', message: 'reject_error' }
		}),
		expect_console(spy_console_error,
		[
			[ 'toss: non-protocol error, upgrade to Debug(error)' ],
			[ new Error('reject_error') ]
		])
	)))
})
