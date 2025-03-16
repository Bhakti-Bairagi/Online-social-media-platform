document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let fullName = document.getElementById("fullname").value.trim();
    let email = document.getElementById("email").value.trim();
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let errorMessage = document.getElementById("error-message");

    if (fullName === "" || email === "" || username === "" || password === "" || confirmPassword === "") {
        errorMessage.textContent = "All fields are required!";
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters long!";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        return;
    }

    errorMessage.textContent = "Account Created Successfully!";
    errorMessage.style.color = "green";

    // Simulate backend submission
    setTimeout(() => {
        window.location.href = "login.html"; // Redirect to login page
    }, 2000);
});