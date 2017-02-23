/* @flow */
/* global express$Response */

export default (resp: any, rs: express$Response) =>
{
	if (resp && typeof resp.toss === 'function')
	{
		resp.toss(rs)
	}
	else
	{
		rs.send(resp)
	}
}
