document.addEventListener('DOMContentLoaded', () => {
    console.log('Fetching products...');
    fetch('/products/list')
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
        .then(products => {
            console.log('Products fetched:', products);
            const productContainer = document.getElementById('productContainer');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';

                const productImage = document.createElement('img');
                productImage.src = product.image[0]; // Assuming the first image URL is to be displayed
                productImage.alt = product.name;

                const productName = document.createElement('h2');
                productName.textContent = product.name;

                const productPrice = document.createElement('p');
                productPrice.textContent = `$${product.price}`;

                productDiv.appendChild(productImage);
                productDiv.appendChild(productName);
                productDiv.appendChild(productPrice);

                productContainer.appendChild(productDiv);
            });
        })
        .catch(err => console.error('Error fetching products:', err));
});
