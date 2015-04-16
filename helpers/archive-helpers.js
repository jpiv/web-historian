var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  var sites;
  fs.readFile(this.paths.list, function (err, data) {
      if(err) throw err;
      sites = data.toString().split("\n");
      callback(sites);
  });
};

exports.isUrlInList = function(url, callback){
  var isInList;
  this.readListOfUrls(function (list) {
      isInList = (list.indexOf(url) !== -1);
      callback(isInList);
    });
};


exports.addUrlToList = function(url){
  fs.appendFile(this.paths.list, url + "\n" , function (err) {
    if(err) throw err;
  });
};

exports.isUrlArchived = function(url, callback){
  fs.readFile(this.paths.archivedSites + url, function (err, data) {
    if(err) callback(false);
    else callback(true);
  });
};

exports.downloadUrls = function(){
  var siteData = "";
  var sitePath = "";
  this.readListOfUrls(function (list) {
    list = list.slice(0,-1);
    _.each(list, function (val) {
      sitePath = exports.paths.archivedSites +"/"+val;
      http.get("http://"+val, function (res) {
        res.on('data', function (data) {
          siteData += data.toString();
        });
        res.on('end', function () {
          fs.open(sitePath, "w",function (){
              fs.writeFile(sitePath, siteData, function () {
              });
          });
        });
      }).on('error', function (err){console.log(err)})
    });
  });

};
