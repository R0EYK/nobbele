document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const productId = window.location.pathname.split('/').pop();

    // Fetch product details
    fetch(`/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('productName').textContent = product.name;
            document.getElementById('productPrice').textContent = product.price;
            document.getElementById('productDescription').textContent = product.description;
            document.getElementById('productBrand').textContent = product.brand.name;
            document.getElementById('productGender').textContent = product.gender;
            document.getElementById('productImage').src = product.image[0]; // Assuming the first image URL

            document.title = `${product.name} - Product Details`; // Update page title
        })
        .catch(err => console.error('Error fetching product details:', err));
});

//Search Icon
document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('searchIcon');
    const searchForm = document.getElementById('searchForm');
    console.log('TEST');

    searchIcon.addEventListener('click', () => {
        if (searchForm.style.display === 'none' || searchForm.style.display === '') {
            searchForm.style.display = 'flex'; // Adjust display style as needed (e.g., 'block', 'inline-block')
        } else {
            searchForm.style.display = 'none';
        }
    });
});
