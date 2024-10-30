// server.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const axios = require('axios');

const app = express();

// Middleware setup
app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key', // Replace with a secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Custos base URL and client configuration
const custosBaseURL = process.env.CUSTOS_BASE_URL || 'https://api.playground.usecustos.org';
const clientId = process.env.CLIENT_ID; // Your client ID
const redirectUri = process.env.REDIRECT_URI; // Must match exactly with the one registered in Custos

app.get('/login', (req, res) => {
  // Generate state parameter
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;

  // Generate code verifier and code challenge for PKCE
  const codeVerifier = crypto.randomBytes(64).toString('hex');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  req.session.codeVerifier = codeVerifier;

  // Construct the authorization URL
  const custosAuthURL =
    `${custosBaseURL}/api/v1/identity-management/authorize` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent('openid profile email')}` +
    `&state=${encodeURIComponent(state)}` +
    `&code_challenge=${encodeURIComponent(codeChallenge)}` +
    `&code_challenge_method=S256`;

  console.log('Authorization Request redirect_uri:', redirectUri);
  console.log('Redirecting to Custos authorization URL:', custosAuthURL);

  // Redirect the user to the Custos authorization URL
  res.redirect(custosAuthURL);
});

app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.session.oauthState;
  const codeVerifier = req.session.codeVerifier;

  // Verify state parameter
  if (!state || state !== storedState) {
    console.error('State mismatch:', { state, storedState });
    return res.status(400).send('Invalid state parameter');
  }

  // Clear state from session
  delete req.session.oauthState;

  if (!code || !codeVerifier) {
    console.error('Missing code or codeVerifier:', { code, codeVerifier });
    return res.status(400).send('Missing code or code verifier');
  }

  try {
    console.log('Token Request redirect_uri:', redirectUri);

    // Exchange authorization code for access token
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('client_id', clientId);
    params.append('code_verifier', codeVerifier);

    const tokenResponse = await axios.post(
      `${custosBaseURL}/api/v1/identity-management/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Retrieve user info
    const userInfoResponse = await axios.get(`${custosBaseURL}/api/v1/user-management/userinfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userInfoResponse.data;

    // Redirect to frontend with user info
    res.redirect(
      `http://localhost:3000/dashboard?name=${encodeURIComponent(userInfo.name)}&email=${encodeURIComponent(
        userInfo.email
      )}`
    );
  } catch (error) {
    console.error(
      'Authentication error:',
      error.response ? error.response.data : error.message
    );
    res.status(500).send('Authentication failed');
  }
});

// Start the server
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});