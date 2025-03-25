export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const apiUrl = `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(query)}&count=20&safesearch=strict&search_lang=en&country=us&spellcheck=1`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': process.env.BRAVE_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error fetching images', error: error.message });
    }
} 