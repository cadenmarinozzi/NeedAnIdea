import axios from 'axios';

async function promptChatGPT(messages) {
	const { data } = await axios.post(
		'https://us-central1-needanidea-web.cloudfunctions.net/app/chatgpt',
		{
			messages,
		}
	);

	return data;
}

export { promptChatGPT };
