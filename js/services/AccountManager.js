import { User } from "../models/User.js";

export class AccountManager {
    constructor() {
        // Keys for localStorage
        this.storageKey = "app_users_data";
        this.sessionKey = "active_user_session";
    }

    getAllUsers() {
        const storedData = localStorage.getItem(this.storageKey);

        // If there is no data, return an empty array
        if (!storedData) {
            return [];
        }

        const parsedData = JSON.parse(storedData);

        // Return real User objects so we don't lose the class structure
        return parsedData.map(data => {
            const user = new User(data.id, data.name, data.role);
            user.createdAt = data.createdAt;
            return user;
        });
    }

    registerUser(username, role) {
        const usersList = this.getAllUsers();

        // Check if the username already exists (ignore upper/lower case)
        const isUserExists = usersList.some(user => user.name.toLowerCase() === username.toLowerCase());

        if (isUserExists) {
            // Return null instead of throwing an error
            return null;
        }

        // Create new user and add to the list
        const newUser = new User(null, username, role);
        usersList.push(newUser);

        // Save back to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(usersList));
        return newUser;
    }

    loginUser(username) {
        const usersList = this.getAllUsers();

        // Find the user by name
        const foundUser = usersList.find(user => user.name.toLowerCase() === username.toLowerCase());

        if (!foundUser) {
            // User not found
            return null;
        }

        // Save the logged-in user to the session
        localStorage.setItem(this.sessionKey, JSON.stringify(foundUser));
        return foundUser;
    }

    logoutUser() {
        localStorage.removeItem(this.sessionKey);
    }

    getActiveSession() {
        const sessionData = localStorage.getItem(this.sessionKey);

        if (!sessionData) {
            return null;
        }

        const data = JSON.parse(sessionData);
        const user = new User(data.id, data.name, data.role);
        user.createdAt = data.createdAt;
        return user;
    }
}