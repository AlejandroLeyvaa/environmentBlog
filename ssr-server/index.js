const express = require('express');
const debug = require('debug')('app:server');
const passport = require('passport');
// const session = require('express-session');
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const { config } = require('./config');

const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());
// app.use(session({ secret: config.sessionSecret }));
// app.use(passport.initialize());
// app.use(passport.session());

// Time
const THIRTY_DAYS_IN_SEC = 2592000;
const TWO_HOURS_IN_SEC = 7200;

// Basic strategy
require('./utils/auth/strategies/basic');

// OAuth strategy
require('./utils/auth/strategies/oauth');
// Google stretegy
require('./utils/auth/strategies/google');

app.post('/auth/sign-in', async (req, res, next) => {
  const { rememberMe } =  req.body;

  passport.authenticate('basic', (error, data) => {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      };

      req.login(data, { session: false }, async (error) => {
        if (error) {
          next(error);
        };

        const { token, ...user } = data;

        res.cookie('token', token, {
          httpOnly: !config.dev,
          secure: !config.dev,
          maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC
        });

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }

  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;

  try{
    await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: 'post',
      data: user
    });

    res.status(201).json({ message: 'user created' });
  } catch (error) {
    next(error)
  };
});


// app.get('/posts', async (req, res, next) => {});

app.post('/user-posts', async (req, res, next) => {
  try {
    const { body: userPost } = req;
    const { token } = req.cookies;

    const { data, status } = await axios ({
      url: `${config.apiUrl}/api/user-posts`,
      headers: { Authorization: `Bearer ${token}`},
      method: 'post',
      data: userPost
    });

    if (status !== 201) {
      return next(boom.badImplementation());
    };

    res.status(201).json(data);
  } catch (error) {
    next(error);
  };
});

app.delete('/user-posts/:userPostId', async (req, res, next) => {
  try {
    const { userPostId } = req.params;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-posts/${userPostId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete'
    });

    if (status !==200) {
      return next(boom.badImplementation());
    };

    res.status(200).json(data);
  } catch (error) {
    next(error);
  };
});

app.get(
  '/auth/google-oauth',
  passport.authenticate('google-oauth', {
    scope: ['email', 'profile', 'openid']
  })
)

app.get(
  '/auth/google-oauth/callback',
  passport.authenticate('google-oauth', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    };

    const { token, ...user } = req.user;

    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev
    });

    res.status(200).json(user);
  }
);

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile', 'openid']
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    };

    const { token, ...user } = req.user;

    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev
    });

    res.status(200).json(user);
  }
);

app.listen(config.port, () => {
  debug(`Listening http://localhost:${config.port}`);
});
