import axios from "axios";

class User {
    constructor(username, password) {
        this.username = username.toLowerCase().trim();
        this.password = password.trim();
    }

    async register() {
        if (!this.username || !this.password) {
            alert("Username and password are required!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/auth/register", {
                username: this.username,
                password: this.password,
            });
            console.log("Register successful:", response.data);
        } catch (e) {
            console.error(e)
        }
    }
}

async function loginUser(username, password) {
    if (!username || !password) {
        alert("Username and password are required!");
        return;
    }

    username.toLowerCase().trim();
    password.trim();

    try {
        const response = await axios.post("http://localhost:5000/auth/login", {
            username,
            password,
        });
        console.log("Login successful:", response.data);
    } catch (e) {
        console.error(e)
    }
}



export default function sendDataToAuth(username, password, type) {
    if (!username || !password) {
        alert("Username and password are required!");
        return;
    }

    if (type === "reg") {
        const newUser = new User(username, password);
        newUser.register();
    }

    if (type === "login") {
        loginUser(username, password);
    }
}