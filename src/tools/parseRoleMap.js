/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

/* This file uses pareseURL.xml and creates the file featureRoutes.api.js */
var fs = require('fs'),
    xml2js = require('xml2js');

var featureLists = [];

function parseRoleMapFile(result, fileToGen, callback)
{
  var itemList = result['roleList']['item'];
  var len = 0;
  var roleCbStr = "";
  var commentStr = "";
  var method;
  var capStr = "";
  var feature, readAccess, writeAccess;

  commentStr += "/*\n";
  commentStr += " * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.\n";
  commentStr += " */\n";
  commentStr += "\n";
  var date = new Date();
  commentStr +=  "/* This file is automatically generated from the roleMap.xml at\n"
  commentStr += "   " + date;
  commentStr += "\n";
  commentStr += "   Please do not edit this file."
  commentStr += "\n"
  commentStr += " */";
  commentStr += "\n";
  commentStr += "\n";

  roleCbStr += commentStr;
  var requiresList = result['roleList']['require'];
  var len = 0;
  if (requiresList) {
    len = requiresList.length;
  }
  for (var i = 0; i < len; i++) {
      var splitter = (requiresList[i]['path']).toString().split('+');
      if (i == 0) {
         if ((requiresList[i] == null) || (null == requiresList[i]['define']) ||
             (null == requiresList[i]['path'])) {
             assert(0);
         }
         roleCbStr += 'var ' + requiresList[i]['define'] + ' = require(';
         if (splitter.length <= 1) {
            roleCbStr += "'" + requiresList[i]['path'] + "')\n";
         } else {
            roleCbStr += requiresList[i]['path'] + ")\n";
         }
         continue;
      }
      roleCbStr += '  , ' + requiresList[i]['define'] + ' = require(';
      if (splitter.length <= 1) {
          roleCbStr += "'" + requiresList[i]['path'] + "')\n";
      } else {
          roleCbStr += requiresList[i]['path'] + ")\n";
      }
  }
  if (len) {
    roleCbStr += "  ;\n";
  }
  roleCbStr += "\n";
  roleCbStr += "\n";
  roleCbStr += "if (!module.parent) {";
  roleCbStr += "\n    console.log(\"Call main app through 'node app'\");";
  roleCbStr += "\n    process.exit(1);";
  roleCbStr += "\n}";
  roleCbStr += "\n";
  roleCbStr += "\n";
 
  var extRoleCbStr = "";
  roleCbStr += "var extRoleMapList = {}\n";
  extRoleCbStr += "\nvar uiRoleMapList = {}\n";
  len = itemList.length
  for (var i = 0; i < len; i++) {
      var uiRole = itemList[i]['uiRole'][0];
      var extRole = itemList[i]['extRole'][0]['item'];
      var extRoleCnt = extRole.length;
      roleCbStr += "extRoleMapList['" + uiRole + "'] = [];\n";
      for (var j = 0; j < extRoleCnt; j++) {
        roleCbStr += "extRoleMapList['" + uiRole + "'].push(";
        roleCbStr += "'" + extRole[j] + "');\n";
        extRoleCbStr += "uiRoleMapList['" + extRole[j] + "'] = '" + 
            uiRole + "';\n";
        //extRoleCbStr += "uiRoleMapList['" + extRole[j] + "']['role'] = '" +
         //   uiRole + "';\n";
        //extRoleCbStr += "uiRoleMapList['" + extRole[j] + "']['precedence'] = " +
         //   uiRolePrecedence + ";\n";
      }
  }
  roleCbStr += extRoleCbStr;
  roleCbStr += "\nexports.extRoleMapList = extRoleMapList;";
  roleCbStr += "\nexports.uiRoleMapList = uiRoleMapList;\n";
  fs.writeFile(fileToGen, roleCbStr, function(err) {
    if (err) throw err;
    console.log("Done, creating file: " + fileToGen);
    callback(err);
  });
}

exports.parseRoleMapFile = parseRoleMapFile;

