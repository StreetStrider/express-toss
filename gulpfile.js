
require('console-ultimate')


var Context = require('metalpipe/Context')
var Library = require('metalpipe/prefab/library')


exports.default = Library(Context({ gulp: require('gulp') }))
