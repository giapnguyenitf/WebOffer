const express = require('express');
const router = express.Router();
const config = require('../config.json');
const utils = require('../utils');
const rand = require('../auth/crypto');

router.get(/^([\/]index|[\/]index\.(html|htm|php)|\/)$/, function(req , res) {
  res.render('pages/index');
});

router.get(/^([\/]member|[\/]member\.(html|htm|php))$/, function(req , res) {
  res.render('pages/member');
});

router.get(/^([\/]faqs|[\/]faqs\.(html|htm|php))$/, function(req , res) {
  res.render('pages/faqs');
});

router.get(/^([\/]offer_survey|[\/]offer_survey\.(html|htm|php))$/, function(req , res) {
  res.render('pages/offer_survey');
});

router.get(/^([\/]offer_wall|[\/]offer_wall\.(html|htm|php))$/, function(req , res) {
  res.render('pages/offer_wall');
});

router.get(/^([\/]service|[\/]service\.(html|htm|php))$/, function(req , res) {
  res.render('pages/service');
});

router.get(/^([\/]content_locker|[\/]content_locker\.(html|htm|php))$/, function(req , res) {
  res.render('pages/content_locker');
});

module.exports = router;
