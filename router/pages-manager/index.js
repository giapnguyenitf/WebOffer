const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const utils = require('../../utils');
const rand = require('../../auth/crypto');

router.get(/^[\/](index|index\.(html|htm|php)|)$/, function(req , res) {
  if(req.url === '/')
    return res.redirect('/manager/index.html');

  res.render('pages-manager/index');
});

router.get(/^[\/](check_ssh|check_ssh\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/check_ssh');
});

router.get(/^[\/](clicks|clicks\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/clicks');
});

router.get(/^[\/](earn|earn\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/earn');
});

router.get(/^[\/](invoice|invoice\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/invoice');
});

router.get(/^[\/](leads|leads\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/leads');
});

router.get(/^[\/](login|login\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/login');
});

router.get(/^[\/](top_leads|top_leads\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/top_leads');
});

router.get(/^[\/](offer|offer\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/offer');
});

router.get(/^[\/](setting|setting\.(html|htm|php))$/, function(req , res) {
  res.render('pages-manager/setting');
});

module.exports = router;
