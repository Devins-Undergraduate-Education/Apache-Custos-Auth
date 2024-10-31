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
const redirectUri = process.env.REDIRECT_URI || 'http://localhost:8081/callback'; // Must match exactly with the one registered in Custos

// Endpoint to initiate login
app.get('/login', (req, res) => {
  // Generate state parameter
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;

  // Store the selected role from query parameters, if any
  const role = req.query.role;
  if (role) {
    req.session.selectedRole = role;
  }

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

// Callback endpoint to handle Custos response
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
    const userId = userInfo.sub; // Assuming 'sub' contains the user ID

    // Check if a selected role was stored in the session
    const selectedRole = req.session.selectedRole;
    // Clear the selected role from the session
    delete req.session.selectedRole;

    let groupNames = [];

    if (selectedRole) {
      // Option 3: Use the selected role for testing
      groupNames = [selectedRole];
    } else {
      // Option 1: Attempt to fetch the user's group memberships
      try {
        const groupMembershipsResponse = await axios.get(
          `${custosBaseURL}/api/v1/group-management/users/${encodeURIComponent(userId)}/group-memberships`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`, // Use user's access token
            },
            params: {
              client_id: clientId,
            },
          }
        );

        const userGroups = groupMembershipsResponse.data.groups || [];
        // Extract group names
        groupNames = userGroups.map((group) => group.name);
      } catch (groupError) {
        console.error(
          'Error fetching group memberships:',
          groupError.response ? groupError.response.data : groupError.message
        );
        // Handle error (e.g., set groupNames to empty array or default value)
        groupNames = [];
      }
    }

    // Pass user info and groups to the frontend
    res.redirect(
      `http://localhost:3000/dashboard` +
        `?name=${encodeURIComponent(userInfo.name)}` +
        `&email=${encodeURIComponent(userInfo.email)}` +
        `&groups=${encodeURIComponent(JSON.stringify(groupNames))}`
    );
  } catch (error) {
    console.error(
      'Authentication error:',
      error.response ? error.response.data : error.message
    );
    res.status(500).send('Authentication failed');
  }
});

// Logout endpoint
app.get('/logout', (req, res) => {
  // Optionally, you can also revoke tokens with Custos here if you have the refresh_token
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session during logout:', err);
      return res.status(500).send('Unable to logout');
    }
    // Redirect to frontend login page
    res.redirect('http://localhost:3000/');
  });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
