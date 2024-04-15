// Filename: netlify/functions/subscribe.mjs
import fetch from 'node-fetch';

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { email, optin } = JSON.parse(event.body);
    const API_KEY = process.env.MAILERLITE_API_KEY;
    console.log('API Key:', process.env.MAILERLITE_API_KEY); // Only for debugging; remove or obfuscate before going live.

    try {
        const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-MailerLite-ApiKey': API_KEY
            },
            body: JSON.stringify({
                email: email,
                fields: { optin }
            })
        });

        if (!response.ok) {
            const errorData = await response.text();  // Capture non-JSON error responses
            throw new Error(`MailerLite responded with ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Subscription successful', data })
        };
    } catch (error) {
        console.error('Subscribe function error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error', details: error.toString() }) };
    }
}
