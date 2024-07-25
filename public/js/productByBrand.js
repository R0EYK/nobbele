document.addEventListener("DOMContentLoaded", () => {
  // Get product ID from URL
  const productId = window.location.pathname.split("/").pop();

  // Fetch product details
  fetch(`/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      document.getElementById("productName").textContent = product.name;
      document.getElementById("productPrice").textContent = product.price;
      document.getElementById("productDescription").textContent =
        product.description;
      document.getElementById("productBrand").textContent = product.brand.name;
      document.getElementById("productGender").textContent = product.gender;
      document.getElementById("productImage").src = product.image[0]; // Assuming the first image URL

      document.title = `${product.name} - Product Details`; // Update page title
    })
    .catch((err) => console.error("Error fetching product details:", err));
});
 // Commented for now , I think we can remove it but I`m not sure.

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
          a.href = `/products/brand/${brand._id}`;
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
// Function which listens to the add-to-cart button
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default behavior

      const productId = this.getAttribute("data-product-id");

      fetch("/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }), // Send the productId
      })
        .then((response) => {
          if (response.status === 401) {
            alert("You need to Login");
            throw new Error("Not authenticated");
          }
          return response.json();
        })
        .then((data) => {
          if (data.message === "Product added to cart successfully") {
            alert("Product added to cart successfully");
          } else {
            alert("Failed to add product to cart");
          }
        })
        .catch((error) => {
          if (error.message !== "Not authenticated") {
            console.error("Error:", error);
            alert("Failed to add product to cart");
          }
        });
    });
  });
});
