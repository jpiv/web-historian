var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(asset, function (err, data) {
    if(err) exports.sendResponse(404,res);
    else exports.sendResponse(200, res, data.toString());
    if(callback) callback(data.toString());
  });
};
exports.sendResponse = function (statusCode, res, body, type) {
  type = type || "text/html";
  body = body || null;
  res.writeHead(statusCode, {"Content-type": type});
  res.end(body);
};

exports.redirect = function (url, res) {
  res.writeHead(302,{"Location":url});
  res.end();
};



// As you progress, keep thinking about what helper functions you can put here!
