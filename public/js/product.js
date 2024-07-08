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
            searchForm.style.display = 'none'; // Roey
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        const quantity = this.getAttribute('data-quantity');
  
        fetch('/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity }),
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
  
