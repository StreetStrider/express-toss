/* @flow */
/* global express$Response */

import { expect } from 'chai'

import type { Resp } from '../../Resp'

export type pseudo$Response = express$Response & { _: [ any, any, any ] }

;
export function pseudo_rs (): pseudo$Response
{
	var rs =
	{
		_: [ null, null, null ],

		status: (status) => { rs._[0] = status },
		type: (mime) => { rs._[1] = mime },
		send: (data) => { rs._[2] = data },
		end:  () => {},
	}

	/* @flow-off */
	return rs
}

export function expect_rs
(
	rs: pseudo$Response, status: any, mime: any, data: any
)
{
	expect(rs._[0]).eq(status)
	expect(rs._[1]).eq(mime)
	expect(rs._[2]).deep.eq(data)
}

export function expect_resp <T>
(
	resp: Resp<T>, status: any, mime: any, data: any
)
{
	var rs = pseudo_rs()

	resp.toss(rs)

	expect_rs(rs, status, mime, data)
}
