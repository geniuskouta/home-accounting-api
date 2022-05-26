'use strict';
const fs = require('fs');
const path = require('path');

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20220526054029-create-tags-up.sql');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      console.log(`received data: ${data}`);
      resolve(data);
    });
  })
    .then(data => db.runSql(data));
};

exports.down = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20220526054029-create-tags-down.sql');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      console.log(`received data: ${data}`);
      resolve(data);
    });
  })
    .then(data => db.runSql(data));
};

exports._meta = {
  "version": 1
};
