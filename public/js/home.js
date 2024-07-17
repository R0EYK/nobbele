document.addEventListener("DOMContentLoaded", () => {
  fetch("/products/list")
    .then((response) => response.json())
    .then((products) => {
      // Take 4 newest products
      const last4Products = products.slice(-4);

      const productContainer = document.getElementById("productContainer");
      last4Products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";

        const productLink = document.createElement("a");
        productLink.href = `/products/${product._id}`; // Assuming productId is available in the product object

        const productImage = document.createElement("img");
        productImage.src = product.image[0]; // Assuming the first image URL is to be displayed
        productImage.alt = product.name;

        const productName = document.createElement("h2");
        productName.textContent = product.name;

        const productPrice = document.createElement("p");
        productPrice.textContent = `$${product.price}`;

        productLink.appendChild(productImage);
        productLink.appendChild(productName);
        productLink.appendChild(productPrice);

        // Add to Cart button
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.className = "add-to-cart-button";
        addToCartButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent the product link from being triggered
          addToCart(product._id);
        });

        productDiv.appendChild(productLink);
        productDiv.appendChild(addToCartButton);

        productContainer.appendChild(productDiv);
      });
    })
    .catch((err) => console.error("Error fetching products:", err));
});

function addToCart(productId) {
  fetch("/add-to-cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
      } else {
        alert("Error adding product to cart");
      }
    })
    .catch((err) => console.error("Error adding product to cart:", err));
}

//Search Icon
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("searchIcon");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  searchIcon.addEventListener("click", () => {
    if (
      searchForm.style.display === "none" ||
      searchForm.style.display === ""
    ) {
      searchForm.style.display = "flex"; // Adjust display style as needed (e.g., 'block', 'inline-block')
      // Adjust position of search input
      const iconRect = searchIcon.getBoundingClientRect();
      const inputWidth = 250; // Adjust width as needed
      const inputOffset = 10; // Adjust offset as needed
      const inputLeft = iconRect.left - inputWidth - inputOffset;
      searchInput.style.left = `${inputLeft}px`; // Set the left position dynamically
      searchIcon.style.display = "none"; // Hide the search icon
    } else {
      searchForm.style.display = "none";
    }
  });
});
/// On hover the brands on nav this makes the drop down list fetch our brands and display them.
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".dropdown");
  const dropdownContent = document.querySelector(".dropdown-content");

  dropdown.addEventListener("mouseover", async () => {
    if (dropdownContent.children.length === 0) {
      try {
        const response = await fetch("/brands/list");
        const brands = await response.json();

        brands.forEach((brand) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `products/brand/${brand._id}`;
          a.textContent = brand.name;
          li.appendChild(a);
          dropdownContent.appendChild(li);
        });
      } catch (error) {
        console.error("Error fetching brand list:", error);
      }
    }
    dropdownContent.style.display = "block";
  });

  dropdown.addEventListener("mouseleave", () => {
    dropdownContent.style.display = "none";
  });
});
