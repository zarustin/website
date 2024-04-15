const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, optin } = JSON.parse(event.body);
  const API_KEY = process.env.MAILERLITE_API_KEY;  // Using an environment variable

  const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      fields: { optin: optin }
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Subscription successful'
    })
  };
};
