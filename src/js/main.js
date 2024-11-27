<script>
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the inputs are empty
    if (!username || !password) {
      // Prevent form submission
      event.preventDefault();
      alert('Please fill in both the username and password.');
    }
  });
</script>
