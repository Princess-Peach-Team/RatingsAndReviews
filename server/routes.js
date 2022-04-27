const express = require('express');
const axios = require('axios');
const { getProduct, getMeta, putHelpful, putReport, postReviews } = require('./db.js');

const router = express.Router();

// route to get reviews data by product id, count & sort
router.get('/reviews/:product_id', (req, res) => {
  getProduct(req.params.product_id)
    .then(({ rows }) => {
      console.log('rows ', rows);
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].recommend === 'true') {
          rows[i].recommend = true;
        } else {
          rows[i].recommend = false;
        }
        if (rows[i].reported === 'true') {
          rows[i].reported = true;
        } else {
          rows[i].reported = false;
        }
        if (rows[i].response === 'null') {
          rows[i].response = null;
        }
      }
      console.log('rows after: ', rows);
      let returnObj = {
        product: req.params.product_id,
        page: Number(req.query.page) || 1,
        count: Number(req.query.count) || 5,
        results: rows
      };
      res.send(returnObj);
    })
    .catch((err) => console.error(err));
});

// route to get reviews metadata by product id
router.get('/reviews/meta/:product_id', (req, res) => {
  getMeta(req.params.product_id)
    .then((data) => {
      res.send(data.rows);
    })
    .catch((err) => console.error(err));
});

// route to mark a review as helpful
router.put('/reviews/:review_id/helpful', (req, res) => {
  putHelpful(req.params.review_id)
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => console.error(err));
});

// route to report a review
router.put('/reviews/:review_id/report', (req, res) => {
  putReport(req.params.review_id)
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => console.error(err));
});

// route to post a review
router.post('/reviews', (req, res) => {
  let { body } = req;
  postReviews(body.product_id, body.rating, body.summary, body.body, body.recommend, body.name, body.email, body.photos, body.characteristics);
  res.send('Thank you for your review!');
});

module.exports = router;