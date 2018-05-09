var path = require("path")
var express = require("express")
var serverStatic = require("serve-static")
var history = require('connect-history-api-fallback');

app = express()
app.use(history())
app.use(serverStatic(__dirname + "/dist"))

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Running server on " + port)
})