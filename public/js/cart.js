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

 
document.addEventListener("DOMContentLoaded", () => {
  // Update quantity in cart
  document.querySelectorAll(".quantity-select").forEach((select) => {
    select.addEventListener("change", function () {
      const productId = this.getAttribute("data-product-id");
      const newQuantity = this.value;
 
      fetch("/update-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Cart updated successfully") {
            window.location.reload();
          } else {
            alert("Failed to update cart");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to update cart");
        });
    });
  });
 
  // Remove item from cart
  document.querySelectorAll(".remove-from-cart-button").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
 
      fetch("/remove-from-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Product removed from cart successfully") {
            window.location.reload();
          } else {
            alert("Failed to remove product from cart");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to remove product from cart");
        });
    });
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
 
document.addEventListener('DOMContentLoaded', () => {
  updateTotalPrice(); // price update
});
 
function convertCurrency(totalPrice, exchangeRates) {
const currency = document.getElementById('currency-select').value;
const rate = exchangeRates[currency];
return totalPrice * rate;
}
 
function updateTotalPrice() {
const totalPriceElement = document.getElementById('total-price');
const baseTotalPrice = parseFloat(totalPriceElement.dataset.baseTotal);
const exchangeRates = JSON.parse(totalPriceElement.dataset.exchangeRates);
const convertedTotalPrice = convertCurrency(baseTotalPrice, exchangeRates);
totalPriceElement.innerText = convertedTotalPrice.toFixed(2) + ' ' + document.getElementById('currency-select').value;
}

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// size of the bag
const bagWidth = 40 - 20; 
const bagHeight = 50 - 20; 
const handleWidth = 4 - 2; 
const handleHeight = 20 - 10;
const speed = 2;
let x = 0;

// location of the bag 
const yOffset = 50 + 30; 

function drawBag(x, y) {
    ctx.fillStyle = '#ffa500'; 
    ctx.fillRect(x, y - bagHeight / 2, bagWidth, bagHeight);

    ctx.strokeStyle = '#ff4500'; 
    ctx.lineWidth = handleWidth;

    ctx.beginPath();
    ctx.moveTo(x + bagWidth / 4, y - bagHeight / 2);
    ctx.lineTo(x + bagWidth / 4 + handleWidth, y - bagHeight / 2 - handleHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 3 * bagWidth / 4, y - bagHeight / 2);
    ctx.lineTo(x + 3 * bagWidth / 4 - handleWidth, y - bagHeight / 2 - handleHeight);
    ctx.stroke();

    ctx.strokeStyle = '#000'; 
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + bagWidth / 4, y - bagHeight / 2);
    ctx.lineTo(x + bagWidth / 4 + handleWidth, y - bagHeight / 2 - handleHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 3 * bagWidth / 4, y - bagHeight / 2);
    ctx.lineTo(x + 3 * bagWidth / 4 - handleWidth, y - bagHeight / 2 - handleHeight);
    ctx.stroke();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const y = yOffset; 
    drawBag(x, y);

    x += speed;

    if (x > canvas.width) {
        x = -bagWidth;
    }

    requestAnimationFrame(animate);
}

animate();
