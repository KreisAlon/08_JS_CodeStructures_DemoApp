import { AccountManager } from "./services/AccountManager.js";

const accountManager = new AccountManager();

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("usernameInput");
const messageBox = document.getElementById("messageBox");

loginForm.addEventListener("submit", (event) => {
    // Stop the page from refreshing when we click submit
    event.preventDefault();

    const username = usernameInput.value.trim();

    // Try to login. If user does not exist, it returns null
    const user = accountManager.loginUser(username);

    if (!user) {
        // Show an error message on the screen
        messageBox.innerHTML = `<div class="alert alert-danger mt-3">המשתמש לא קיים במערכת</div>`;
        return; // Stop the function here
    }

    // Check the role to know which page to link to
    let linkUrl = "";
    if (user.role === "teacher") {
        linkUrl = "teacher.html";
    } else {
        linkUrl = "student.html";
    }

    // Show a success message with a regular HTML link
    messageBox.innerHTML = `
        <div class="alert alert-success mt-3">
            התחברות מוצלחת! 
            <br>
            <a href="${linkUrl}" class="alert-link">לחץ כאן כדי להמשיך לדף שלך</a>
        </div>
    `;
});