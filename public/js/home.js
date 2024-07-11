document.addEventListener('DOMContentLoaded', () => {
    fetch('/products/list')
        .then(response => response.json())
        .then(products => {
            // Sort products by date added (assuming there's a 'createdAt' field)

            // Take 5 newest  products
            const last4Products = products.slice(-5);

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
        }
    });
});
/// On hover the brands on nav this makes the drop down list fetch our brands and display them.
document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdown.addEventListener('mouseover', async () => {
        if (dropdownContent.children.length === 0) {
            try {
                const response = await fetch('/brands/list');
                const brands = await response.json();

                brands.forEach(brand => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `products/brand/${brand._id}`;
                    a.textContent = brand.name;
                    li.appendChild(a);
                    dropdownContent.appendChild(li);
                });
            } catch (error) {
                console.error('Error fetching brand list:', error);
            }
        }
        dropdownContent.style.display = 'block';
    });

    dropdown.addEventListener('mouseleave', () => {
        dropdownContent.style.display = 'none';
    });
});
