const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'unexpectedddd';
const expiration = '2h';

module.exports = {
  // Function for authenticating routes
  authMiddleware: function (req, res, next) {
    // Allows token to be sent via req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    try {
      const { data } = jwt.verify(token, secret, { expiresIn: expiration });
      req.user = data;
      next();
    } catch (err) {
      console.log('Invalid token');
      return res.status(400).json({ message: 'Invalid token!' });
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};