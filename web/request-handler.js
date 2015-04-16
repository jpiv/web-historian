var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
// require more modules/folders here!




var handleGet = function (req, res) {
  if(req.url === '/') {
    httpHelper.serveAssets(res, archive.paths.siteAssets + "/index.html");
  } else if(req.url === '/loading.html') {
    httpHelper.serveAssets(res, archive.paths.siteAssets + "/loading.html");
  }else {
    archive.isUrlArchived(req.url, function (isArchived) {
      if(isArchived) {
        httpHelper.serveAssets(res, archive.paths.archivedSites + req.url);
      } else {
        httpHelper.sendResponse(404,res);
      }
    });
  }
}

var handlePost = function (req, res) {
  var url;

  req.on('data', function (data) {
    url = data.toString().slice(4);
  });
  req.on('end', function () {
    archive.isUrlInList(url, function (is) {
      if(is) {
        httpHelper.redirect("/"+url, res);
      } else {
        archive.addUrlToList(url);
        httpHelper.redirect("/loading.html", res);
      }
    });
  });

}

var actions = {
                "GET": handleGet,
                "POST": handlePost
              };

exports.handleRequest = function (req, res) {
  actions[req.method](req,res);
};
