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
                    a.href = `/products/brand/${brand._id}`;
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