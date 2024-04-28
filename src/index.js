

const express = require('express');
const { router } = require('./router/messageRouter');
// const { router } = require('./router/messageRouter1');

const app = express();

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});