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
