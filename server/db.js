const { Pool } = require('pg')
const pool = new Pool({
  user: 'mitchwintrow',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'ratingsandreviews'
});

const GETProductReviews = (productId) => {
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
    review.response AS response,
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
  return pool.query(`SELECT
    review.product_id AS product_id,
    json_build_object(
      '1', (SELECT COUNT(rating) FROM review WHERE product_id = $1
      AND rating = 1),
      '2', (SELECT COUNT(rating) FROM review WHERE product_id = $1
      AND rating = 2),
      '3', (SELECT COUNT(rating) FROM review WHERE product_id = $1
      AND rating = 3),
      '4', (SELECT COUNT(rating) FROM review WHERE product_id = $1
      AND rating = 4),
      '5', (SELECT COUNT(rating) FROM review WHERE product_id = $1
      AND rating = 5)
    ) AS rating,
    json_build_object(
      '0', (SELECT COUNT(recommend) FROM review WHERE recommend = 'false' AND product_id = $1),
      '1', (SELECT COUNT(recommend) FROM review WHERE recommend = 'true' AND product_id = $1)
    ) AS recommend,
    json_object_agg(
      characteristics.name, json_build_object(
        'id', characteristics.id,
        'value', (SELECT avg(meta.value) FROM meta WHERE meta.characteristic_id = characteristics.id)
      )
    ) AS characteristics
    FROM review
    LEFT JOIN characteristics ON characteristics.product_id = review.product_id
    LEFT JOIN meta ON meta.characteristic_id = characteristics.id
    WHERE review.product_id = $1
    GROUP BY review.product_id`, [productId]);
};

const PUTHelpful = (reviewId) => {
  let query = {
    text: 'UPDATE review SET helpfulness = helpfulness + 1 WHERE id = $1;',
    values: [reviewId]
  };
  return pool.query(query);
};

const PUTReport = (reviewId) => {
  let query = {
    text: `UPDATE review SET reported = 'true' WHERE id = $1;`,
    values: [reviewId]
  }
  return pool.query(query);
};

const POSTReviews = (productId, rating, summary, body, recommend, name, email, photos, chars) => {
  let date = Date.now();
  let query = {
    text: 'EXPLAIN ANALYZE INSERT INTO review (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;',
    values: [productId, rating, date, summary, body, recommend, 'false', name, email, 'null']
  }
  pool.query(query)
    .then(({ rows }) => {
      console.log('first rows -> ', rows);
      const id = rows[0].id;
      let photosVals = [];
      let photosQueryString = 'EXPLAIN ANALYZE INSERT INTO reviews_photos (review_id, url) VALUES '
      for (let i = 1; i < photos.length + 1; i++) {
        photosVals.push(id);
        photosVals.push(photos[i]);
        if (i === photos.length) {
          photosQueryString += `($${i}, $${i + 1});`;
        } else {
          photosQueryString += `($${i}, ${i + 1}), `;
        }
      }
      let photosQuery = {
        text: photosQueryString,
        values: photosVals
      }
      pool.query(photosQuery);

      let charsQueryString = 'EXPLAIN ANALYZE INSERT INTO characteristics (product_id, name) VALUES ';
      let charsVals = [];
      let charsReviewsQueryString = 'EXPLAIN ANALYZE INSERT INTO meta (characteristic_id, review_id, value) VALUES ';

      const charsLength = Object.keys(chars).length;
      let count = 0;
      let nums = 0;
      let nums2 = 0;
      for (const char in chars) {
        count += 1;
        nums += 1;
        nums2 += 1;
        charsVals.push(productId, char);
        if (count === charsLength) {
          charsQueryString += `($${nums}, $${nums + 1}) RETURNING id;`;
          charsReviewsQueryString += `($${nums2}, $${nums2 + 1}, $${nums2 + 2});`;
          nums += 1;
          nums2 += 2;
        } else {
          charsQueryString += `($${nums}, $${nums + 1}), `;
          charsReviewsQueryString += `($${nums2}, $${nums2+ 1}, $${nums2+ 2}), `;
          nums += 1;
          nums2 += 2;
        }
      }

      let charsQuery = {
        text: charsQueryString,
        values: charsVals
      };
      pool.query(charsQuery)
        .then(({ rows }) => {
          console.log('second rows -> ', rows);
          let charsReviewsVals = [];
          let count = 0;
          for (const char in chars) {
            charsReviewsVals.push(rows[count].id, id, chars[char]);
            count += 1;
          }
          let charsReviewsQuery = {
            text: charsReviewsQueryString,
            values: charsReviewsVals
          };
          pool.query(charsReviewsQuery)
            .then(({ rows }) => console.log('third rows -> ', rows))
            .catch((err) => console.error(err));
        })
        .catch((err) => {
          console.error(err)
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports.getProduct = GETProductReviews;
module.exports.getMeta = GETMeta;
module.exports.putHelpful = PUTHelpful;
module.exports.putReport = PUTReport;
module.exports.postReviews = POSTReviews;


// SELECT
//     review.product_id AS product_id,
//     json_build_object(
//       '1', (SELECT COUNT(rating) FROM review WHERE product_id = 1
//       AND rating = 1),
//       '2', (SELECT COUNT(rating) FROM review WHERE product_id = 1
//       AND rating = 2),
//       '3', (SELECT COUNT(rating) FROM review WHERE product_id = 1
//       AND rating = 3),
//       '4', (SELECT COUNT(rating) FROM review WHERE product_id = 1
//       AND rating = 4),
//       '5', (SELECT COUNT(rating) FROM review WHERE product_id = 1
//       AND rating = 5)
//     ) AS rating,
//     json_build_object(
//       '0', (SELECT COUNT(recommend) FROM review WHERE recommend = 'false' AND product_id = 1),
//       '1', (SELECT COUNT(recommend) FROM review WHERE recommend = 'true' AND product_id = 1)
//     ) AS recommend,
//     json_object_agg(
//       characteristics.name, json_build_object(
//         'id', characteristics.id,
//         'value', (SELECT avg(meta.value) FROM meta WHERE meta.characteristic_id = characteristics.id)
//       )
//     ) AS characteristics
//     FROM review
//     LEFT JOIN characteristics ON characteristics.product_id = review.product_id
//     LEFT JOIN meta ON meta.characteristic_id = characteristics.id
//     WHERE review.product_id = 1
//     GROUP BY review.product_id