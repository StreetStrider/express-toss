# express-toss

Makes **express** router handlers aware of **promises**. Brings more clear dataflow to handlers.

## `toss.method`
### resolving
```js
import tosser from 'express-toss'

var toss = tosser({ debug: true })

express.get('/resource', toss.handler(rq =>
{
  return db.query().then(transform) /* … */
}))
```
— return value is used as response body. MIME would be determined automatically by *express* (`application/json` in case of Object, `text/html` in case of `string`, [learn more](http://expressjs.com/en/4x/api.html#res.send)). Status will be 200.

### rejecting
```js
import tosser from 'express-toss'

var toss = tosser({ debug: true })

express.get('/resource', toss.handler(rq =>
{
  throw new TypeError
}))
```
— sync throws or promise rejections will convert into 500s with specific JSON body. If `debug = true` body is detailed, if `debug = false` it is like a simple internal-ish error.

## `Resp()`
```js
import tosser from 'express-toss'
import Resp   from 'express-toss/Resp'

var toss = tosser({ debug: true })

express.get('/resource', toss.handler(rq =>
{
  // use `Resp` to fine-control response
  return Resp(200, 'text/html', html)

  // can be used for 400s
  return(400, { server: error })
}))
```
— `Resp([status], [mime], body)` is applied to express' response. `Resp` can be sync-returned or used inside promise.

## `Wrong()`
```js
import tosser from 'express-toss'
import Wrong  from 'express-toss/Wrong'

var toss = tosser({ debug: true })

// use Wrong to create protocol-level errors
// Wrong(code) creates constructor for `code` error
var NotPermitted = Wrong('permission_required')
var NotFound = Wrong('user_not_found', { status: 404 })

express.get('/resource', toss.handler(rq =>
{
  // throwing or returning `Wrong` to fine-control response
  throw NotPermitted()

  // details can be supplied
  throw NotFound({ username: 'username' })
}))
```
— `Wrong(code, [options])` creates new specific error *factory*. Calling that constructor creates error *instance*. This instance can be throwed/rejected or sync-returned to indicate error situation.
