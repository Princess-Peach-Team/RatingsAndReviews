// select count(id) from table <- postgres
const express = require('express');
const path = require('path');
const router = require('./routes');
const compression = require('compression');

const app = express();
app.use(compression());
app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());
app.use(router);


const port = 48888; // <- might need to change this since front end is using this port (3000)
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
