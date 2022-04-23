const express = require('express');
const axios = require('axios');
const { getProduct, getMeta, putHelpful, putReport, postReviews } = require('./db.js');

const router = express.Router();

// route to get reviews data by product id, count & sort
router.get('/reviews/:product_id', (req, res) => {
  getProduct(req.params.product_id)
    .then(({ rows }) => {
      console.log(rows)
      res.send(rows);
    })
    .catch((err) => console.error(err));
});

// route to get reviews metadata by product id
router.get('/reviews/meta/:product_id', (req, res) => {
  getMeta(req.params.product_id)
    .then(({ rows }) => {
      console.log('meta results: ', rows);
      res.send(rows);
    })
    .catch((err) => console.error(err));
});

// route to mark a review as helpful
router.put('/reviews/:review_id/helpful', (req, res) => {
  // TODO: implement function calls from db.js
});

// route to report a review
router.put('/reviews/:review_id/report', (req, res) => {
  // TODO: implement function calls from db.js
});

// route to post a review
router.post('/reviews', (req, res) => {
  // TODO: implement function calls from db.js
});

module.exports = router;