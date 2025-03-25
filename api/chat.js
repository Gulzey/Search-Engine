import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const output = await replicate.run(
      "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
      {
        input: {
          prompt: message,
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          system_prompt: "You are a helpful AI assistant that provides informative, educational responses. You should be knowledgeable, accurate, and helpful while maintaining a professional tone."
        }
      }
    );

    res.status(200).json({ response: output });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
} 