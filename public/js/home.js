document.addEventListener('DOMContentLoaded', () => {
    fetch('/products/list')
        .then(response => response.json())
        .then(products => {
            // Sort products by date added (assuming there's a 'createdAt' field)

            // Take the last 4 products
            const last4Products = products.slice(-4);

            const productContainer = document.getElementById('productContainer');
            last4Products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';

                const productImage = document.createElement('img');
                productImage.src = product.image[0]; // Assuming the first image URL is to be displayed
                productImage.alt = product.name;

                const productName = document.createElement('h2');
                productName.textContent = product.name;

                const productPrice = document.createElement('p');
                productPrice.textContent = `$${product.price}`;
                 // Add to Cart button
                 const addToCartButton = document.createElement('button');
                 addToCartButton.textContent = 'Add to Cart';
                 addToCartButton.className = 'add-to-cart-button';

                productDiv.appendChild(productImage);
                productDiv.appendChild(productName);
                productDiv.appendChild(productPrice);
                productDiv.appendChild(addToCartButton);


                // Create link to product detail page
                const productLink = document.createElement('a');
                productLink.href = `/products/${product._id}`; // Assuming productId is available in the product object
                productLink.appendChild(productDiv);

                productContainer.appendChild(productLink);
            });
        })
        .catch(err => console.error('Error fetching products:', err));
});
//Search Icon
document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('searchIcon');
    const searchForm = document.getElementById('searchForm');

    searchIcon.addEventListener('click', () => {
        if (searchForm.style.display === 'none' || searchForm.style.display === '') {
            searchForm.style.display = 'flex'; // Adjust display style as needed (e.g., 'block', 'inline-block')
        } else {
            searchForm.style.display = 'none';
        } // Echo
    });
});