const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function promptChatGPT(messages) {
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo', // gpt-4
		messages,
	});

	const completionText = completion.data.choices[0].message.content;

	return completionText;
}

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.post('/chatgpt', async (req, res) => {
	const { messages } = req.body;

	if (!messages) {
		res.status(400).send('Missing messages');

		return;
	}

	const completion = await promptChatGPT(messages);

	res.send(completion);
});

exports.app = functions.https.onRequest(app);
