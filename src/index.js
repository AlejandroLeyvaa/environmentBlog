const express = require('express');
const app = express();
const { config } = require('./config/index');

const postsApi = require('./routes/posts');

// Body parser
app.use(express.json());

// Routes
postsApi(app);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${config.port}`);
});
