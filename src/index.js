const debug = require('debug')('app:server');
const express = require('express');
const app = express();
const { config } = require('./config/index');

const postsApi = require('./routes/posts');
const authApi = require('./routes/auth');
const userPostsApi = require('./routes/usersPosts');

const {
  logErrors,
  wrapErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers.js');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

// Body parser
app.use(express.json());


// Routes
postsApi(app);
authApi(app);
userPostsApi(app);

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  debug(`Listening on http://localhost:${config.port}`);
});
