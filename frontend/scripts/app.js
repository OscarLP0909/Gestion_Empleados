const API_URL = "http://localhost:3000";

//LOGIN
const loginForm = document.getElementById("loginForm");

if(loginForm) {
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(API_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });

        const data = await res.json();

        if(res.ok) {
            localStorage.setItem("token", data.token);

            document.getElementById("message").innerText =
                "Login correcto";
        } else {
            document.getElementById("message").innerText =
                data.message;
        }
    });
}

// REGISTER

const registerForm = document.getElementById("registerForm")

if(registerForm) {
    registerForm.addEventListener("submit", async(e) => {
        e.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        const res = await fetch(API_URL + "/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json();

        document.getElementById("message").innerText = data.message;
    })
}