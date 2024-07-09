document.addEventListener('DOMContentLoaded', () => {
    const productId = window.location.pathname.split('/').pop();

    // Fetch product details (if needed for the product details page)
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

    // Sort products by price
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortOrder = sortSelect.value;

            // Fetch sorted products
            fetch(`/products/accessories?sort=${sortOrder}`)
                .then(response => response.json())
                .then(products => {
                    // Assuming you have a function to update the product list
                    updateProductList(products);
                })
                .catch(err => console.error('Error fetching sorted products:', err));
        });
    }

    // Function to update product list on the page
    function updateProductList(products) {
        const productContainer = document.querySelector('.productContainer');
        if (productContainer) {
            productContainer.innerHTML = ''; // Clear existing products

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                // Build product HTML
                productDiv.innerHTML = `
                    <img src="${product.image[0]}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <p>Brand: ${product.brand.name}</p>
                    <p>Gender: ${product.gender}</p>
                    <form action="/cart/add" method="post">
                        <input type="hidden" name="productId" value="${product._id}">
                        <button type="submit" class="add-to-cart-button">Add to Cart</button>
                    </form>
                `;

                productContainer.appendChild(productDiv);
            });
        }
    }
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
                    a.href = `brand/${brand._id}`;
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