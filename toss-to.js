/* @flow */
/* global express$Response */


export default function toss_to (resp: any, rs: express$Response)
{
	if (resp && typeof resp.resp === 'function')
	{
		resp.resp().toss(rs)
	}
	else if (resp && typeof resp.toss === 'function')
	{
		resp.toss(rs)
	}
	else
	{
		rs.send(resp)
	}
}
