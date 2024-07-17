document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const generalError = document.getElementById('generalError');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission
  
      let valid = true;
  
      // Clear previous errors
      usernameError.textContent = '';
      passwordError.textContent = '';
      generalError.textContent = '';
  
      // Validate username
      if (usernameInput.value.trim() === '') {
        usernameError.textContent = 'Username is required';
        usernameError.style.display = 'block';
        valid = false;
      }
  
      // Validate password
      if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Password is required';
        passwordError.style.display = 'block';
        valid = false;
      }
  
      if (!valid) {
        return; // Stop form submission if invalid
      }
  
      // Get form data
      const data = {
        username: usernameInput.value,
        password: passwordInput.value
      };
  
      // Send AJAX request
      fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.username) {
            usernameError.textContent = result.username;
            usernameError.style.display = 'block';
          }
          if (result.password) {
            passwordError.textContent = result.password;
            passwordError.style.display = 'block';
          }
          if (result.general) {
            generalError.textContent = result.general;
            generalError.style.display = 'block';
          }
          if (result.success) {
            // Redirect to home page if no errors
            window.location.href = '/';
          }
        })
        .catch(error => {
          generalError.textContent = 'Error logging in: ' + error.message;
          generalError.style.display = 'block';
        });
    });
  });
  