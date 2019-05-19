# express-toss

[![Travis](https://img.shields.io/travis/StreetStrider/express-toss.svg?style=flat-square)](https://travis-ci.org/StreetStrider/express-toss)
[![Coveralls](https://img.shields.io/coveralls/StreetStrider/express-toss.svg?style=flat-square)](https://coveralls.io/github/StreetStrider/express-toss)
[![ISC licensed](http://img.shields.io/badge/license-ISC-brightgreen.svg?style=flat-square)](#license)
[![npm|express-toss](http://img.shields.io/badge/npm-express--toss-CB3837.svg?style=flat-square)](https://www.npmjs.org/package/express-toss)
[![flowtype](http://img.shields.io/badge/flow-type-EBBF3A.svg?style=flat-square)](#flow)

> Makes **express** router handlers aware of **promises**. Brings more clear dataflow to express handlers.

## `toss.method`
Transforms `(rq) => Promise` function to `(rq, rs) => void` function for use inside Express' handlers.

### resolving
```js
import tosser from 'express-toss'

var toss = tosser({ debug: true })

express.get('/resource', toss.method(rq =>
{
  return db.query().then(transform) /* … */
}))
```
— return value is used as response body with status 200 and adequate mime. MIME would be determined automatically by *express* (`application/json` in case of `Object`, `text/html` in case of `string`, [learn more](http://expressjs.com/en/4x/api.html#res.send)).

### rejecting
```js
import tosser from 'express-toss'

var toss = tosser({ debug: true })

express.get('/resource', toss.method(rq =>
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

express.get('/resource', toss.method(rq =>
{
  // use `Resp` to fine-control response
  return Resp(200, 'text/html', html)

  // can be used for 400s
  return Resp(400, { server: error })
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

express.get('/resource', toss.method(rq =>
{
  // throwing or returning `Wrong` to fine-control response
  throw NotPermitted()

  // details can be supplied
  throw NotFound({ username: 'username' })
}))
```
— `Wrong(code, [options])` creates new specific error *factory*. Calling that factory creates error *instance*. This instance can be throwed/rejected or sync-returned to indicate error situation.

## flow
FlowType definitions included.

## license
ISC © Strider, 2017.
