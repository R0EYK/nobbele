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
    searchIcon.addEventListener('click', () => {
        if (searchForm.style.display === 'none' || searchForm.style.display === '') {
            searchForm.style.display = 'flex'; // Adjust display style as needed (e.g., 'block', 'inline-block')
        } else {
            searchForm.style.display = 'none'; 
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior

            const productId = this.getAttribute('data-product-id');

            fetch('/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }), // Send the productId
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Product added to cart successfully') {
                    alert('Product added to cart successfully');
                } else {
                    alert('Failed to add product to cart');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add product to cart');
            });
        });
    });
});

  
  document.addEventListener('DOMContentLoaded', () => {
    // Update quantity in cart
    document.querySelectorAll('.quantity-select').forEach(select => {
        select.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const newQuantity = this.value;

            fetch('/update-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Cart updated successfully') {
                    window.location.reload();
                } else {
                    alert('Failed to update cart');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update cart');
            });
        });
    });

    // Remove item from cart
    document.querySelectorAll('.remove-from-cart-button').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');

            fetch('/remove-from-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Product removed from cart successfully') {
                    window.location.reload();
                } else {
                    alert('Failed to remove product from cart');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to remove product from cart');
            });
        });
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
/// Filter handling
document.addEventListener('DOMContentLoaded', () => {
    const applyFiltersButton = document.getElementById('applyFiltersButton');

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', () => {
            const brandFilter = document.getElementById('brandFilter').value;
            const genderFilter = document.getElementById('genderFilter').value;
            const maxPriceFilter = document.getElementById('priceFilter').value;

            let queryParams = '';

            if (brandFilter) {
                queryParams += `brand=${brandFilter}&`;
            }

            if (genderFilter) {
                queryParams += `gender=${genderFilter}&`;
            }

            if (maxPriceFilter && !isNaN(parseFloat(maxPriceFilter))) {
                queryParams += `maxPrice=${parseFloat(maxPriceFilter)}&`;
            }

            // Remove the trailing '&' if it exists
            queryParams = queryParams.replace(/&$/, '');

            // Determine the current category from the URL
            const pathArray = window.location.pathname.split('/');
            const category = pathArray[pathArray.length - 1];

            // Construct URL with query parameters for the current category
            const url = `/products/${category}?${queryParams}`;

            // Redirect to the constructed URL
            window.location.href = url;
        });
    }
});
