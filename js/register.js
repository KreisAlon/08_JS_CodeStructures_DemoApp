import { AccountManager } from "./services/AccountManager.js";

const accountManager = new AccountManager();

const registerForm = document.getElementById("registerForm");
const usernameInput = document.getElementById("usernameInput");
const roleInput = document.getElementById("roleInput");
const messageBox = document.getElementById("messageBox");

registerForm.addEventListener("submit", (event) => {
    // Stop the page from refreshing
    event.preventDefault();

    const username = usernameInput.value.trim();
    const role = roleInput.value;

    // Try to register
    const newUser = accountManager.registerUser(username, role);

    if (!newUser) {
        // If it returns null, the username is already taken
        messageBox.innerHTML = `<div class="alert alert-danger mt-3">שם המשתמש כבר תפוס</div>`;
        return;
    }

    // Show success message and a link to the login page
    messageBox.innerHTML = `
        <div class="alert alert-success mt-3">
            הרשמה בוצעה בהצלחה! 
            <br>
            <a href="login.html" class="alert-link">לחץ כאן כדי לעבור להתחברות</a>
        </div>
    `;
});