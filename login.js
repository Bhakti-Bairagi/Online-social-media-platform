document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page refresh

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("error-message");

    if (username === "a19" && password === "password123") {
        alert("Login Successful!");
        window.location.href = "index.html"; // Redirect to another page
    } else {
        errorMessage.textContent = "Invalid username or password!";
    }
});