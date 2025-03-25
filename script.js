document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultContainer = document.getElementById('result');

    // Handle search button click
    searchButton.addEventListener('click', performSearch);

    // Handle Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Show loading state
        resultContainer.innerHTML = '<p>Searching...</p>';
        resultContainer.classList.add('active');

        try {
            const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Subscription-Token': 'BSAjWf4bmH5d9cw2fdwKkvLuzfGQ4Fb'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            resultContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }

    function displayResults(data) {
        if (!data.web || !data.web.results || data.web.results.length === 0) {
            resultContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        const results = data.web.results;
        let html = '<h2>Search Results</h2>';
        
        results.forEach((result, index) => {
            html += `
                <div class="search-result">
                    <h3><a href="${result.url}" target="_blank">${result.title}</a></h3>
                    <p>${result.description}</p>
                    <small>${result.url}</small>
                </div>
            `;
        });

        resultContainer.innerHTML = html;
    }
});