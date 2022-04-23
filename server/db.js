const { Pool } = require('pg')
const pool = new Pool({
  user: 'mitchwintrow',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'ratingsandreviews'
});

/* This works v. Use as reference for building functions */
// let query = pool.query(`SELECT * FROM review WHERE product`)
// pool.connect()
  // .then(() => console.log('Successfully connected to PostgreSQL: ratingsandreviews'))
  // .then(() => pool.query('SELECT * FROM reviews_photos;'))
  // .then((res) => {
  //   console.table(res.rows[0]);
  //   // console.log(res.rows[0]);
  //   // let obj = res.rows[0];
  //   // for (const prop in obj) {
  //   //   console.log('prop -> ', prop);
  //   //   console.log('val -> ', obj[prop]);
  //   // }
  // })
  // .catch((err) => console.error(err));

const GETProductReviews = (productId) => {
  // return pool.query(`SELECT * FROM review JOIN photos ON review.id = photos.review_id WHERE product_id = ${productId};`); //WHERE product_id = ${productId}
  return pool.query(`SELECT
    review.id AS id,
    review.product_id AS product_id,
    review.rating AS rating,
    to_timestamp(review.date) AS date,
    review.summary AS summary,
    review.body AS body,
    review.recommend AS recommend,
    review.reported AS reported,
    review.reviewer_name AS reviewer_name,
    review.response AS reviewer_response,
    review.helpfulness AS helpfulness,
    (array_agg(
      json_build_object(
        'id', reviews_photos.id,
        'url', reviews_photos.url
      )
    )) AS photos
    FROM review
    LEFT JOIN reviews_photos ON reviews_photos.review_id = review.id
    WHERE review.product_id = ${productId}
    GROUP BY review.id;`);
};

const GETMeta = (productId) => {
  return pool.query(`SELECT * FROM characteristics WHERE product_id = ${productId}`);
};

const PUTHelpful = () => {};

const PUTReport = () => {};

const POSTReviews = () => {};

module.exports.getProduct = GETProductReviews;
module.exports.getMeta = GETMeta;
module.exports.putHelpful = PUTHelpful;
module.exports.putReport = PUTReport;
module.exports.postReviews = POSTReviews;
