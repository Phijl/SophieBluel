document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth-link");
  const editButton = document.getElementById("edit-button");
  const token = localStorage.getItem("authToken");

  if (token) {
    // L'utilisateur est connecté
    authLink.textContent = "logout";
    authLink.href = "#";
    editButton.style.display = "inline";

    authLink.addEventListener("click", () => {
      // Déconnecter l'utilisateur
      localStorage.removeItem("authToken");
      window.location.reload();
    });
  } else {
    // L'utilisateur n'est pas connecté
    authLink.textContent = "login";
    authLink.href = "connexion.html";
    editButton.style.display = "none";
  }
});
