document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signupForm').addEventListener('submit', validateForm);
});

function validateForm(event) {
    let isValid = true;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    // Get form fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validate first name
    if (firstName === '') {
        showError('firstNameError', 'First name is required.');
        isValid = false;
    }

    // Validate last name
    if (lastName === '') {
        showError('lastNameError', 'Last name is required.');
        isValid = false;
    }

    // Validate username
    if (username === '') {
        showError('usernameError', 'Username is required.');
        isValid = false;
    }

    // Validate password length
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters long.');
        isValid = false;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address.');
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerText = message;
    element.style.display = 'block';
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
