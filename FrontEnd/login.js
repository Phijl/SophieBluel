document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche la soumission du formulaire par défaut

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Validation des champs
    if (!email) {
      errorMessage.textContent = "L'e-mail est requis.";
      errorMessage.style.display = "block";
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      errorMessage.textContent = "Veuillez entrer un e-mail valide.";
      errorMessage.style.display = "block";
      return;
    }
    if (!password) {
      errorMessage.textContent = "Le mot de passe est requis.";
      errorMessage.style.display = "block";
      return;
    }

    // Réinitialiser le message d'erreur avant l'envoi
    errorMessage.style.display = "none";
    // Envoyer les données de connexion à l'API
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 404) {
          errorMessage.textContent = "Utilisateur non trouvé.";
          errorMessage.style.display = "block";
          throw new Error("User not found");
        }
        if (response.status === 401) {
          errorMessage.textContent = "E-mail ou mot de passe incorrect.";
          errorMessage.style.display = "block";
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          throw new Error("Failed to login");
        }
        return response.json();
      })
      .then((data) => {
        // Stocker le token d'authentification
        localStorage.setItem("authToken", data.token);
        // Rediriger vers la page d'accueil
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion :", error);
      });
  });
});
