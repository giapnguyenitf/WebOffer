const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const utils = require('../../utils');
const rand = require('../../auth/crypto');

router.get(/^[\/](index|index\.(html|htm|php)|)$/, function(req , res) {
  if(req.url === '/')
    return res.redirect('/admin/index.html');

  res.render('admin/index');
});

router.get(/^[\/](login|login\.(html|htm|php))$/, function(req , res) {
  res.render('admin/login');
});

module.exports = router;
