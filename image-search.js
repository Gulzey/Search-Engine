// Function to handle the search request and display images
document.getElementById('searchButton').addEventListener('click', () => {
    const searchQuery = document.getElementById('searchInput').value.trim();
    if (searchQuery !== '') {
        fetchImages(searchQuery);
    }
});

document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const searchQuery = document.getElementById('searchInput').value.trim();
        if (searchQuery !== '') {
            fetchImages(searchQuery);
        }
    }
});

// Function to fetch images from Brave Image Search API
async function fetchImages(query) {
    const url = `/api/search?query=${encodeURIComponent(query)}`;
    
    console.log('Making request to:', url);
    
    // Show loading message
    const resultContainer = document.getElementById('result');
    if (!resultContainer) {
        console.error('Result container not found!');
        return;
    }
    
    resultContainer.innerHTML = '<div class="loading">Loading images...</div>';
    resultContainer.classList.add('active');

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response body:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Full API Response:', JSON.stringify(data, null, 2));
        console.log('First result:', data.results[0]);

        // Create or get the image results container
        let imageResults = document.getElementById('imageResults');
        if (!imageResults) {
            imageResults = document.createElement('div');
            imageResults.id = 'imageResults';
            resultContainer.appendChild(imageResults);
        }
        
        // Clear previous results
        imageResults.innerHTML = '';

        if (data.results && data.results.length > 0) {
            console.log('Found images:', data.results.length);
            // Debug the first few image URLs
            data.results.slice(0, 3).forEach((image, index) => {
                console.log(`Image ${index + 1} URL:`, image.properties.url);
            });
            
            // Loop through the fetched image data and display each image
            data.results.forEach((image, index) => {
                const imageItem = document.createElement('div');
                imageItem.classList.add('gallery-item');
                
                // Debug the image data
                console.log(`Image ${index + 1} data:`, {
                    url: image.properties.url,
                    title: image.title,
                    fullData: image
                });
                
                imageItem.innerHTML = `
                    <div class="gallery-image">
                        <img src="${image.properties.url}" alt="${image.title}" loading="lazy" 
                             onerror="console.error('Failed to load image:', this.src); this.onerror=null; this.src='https://placehold.co/300x300/cccccc/666666?text=Image+Not+Available'">
                    </div>
                    <div class="gallery-title">
                        <p>${image.title}</p>
                    </div>
                `;
                imageResults.appendChild(imageItem);
            });
        } else {
            console.log('No images found in response');
            imageResults.innerHTML = '<div class="no-results">No images found.</div>';
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        resultContainer.innerHTML = `
            <div class="error">
                <p>Failed to load images. Please try again later.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}