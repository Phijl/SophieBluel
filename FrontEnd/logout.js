const authLink = document.getElementById("auth-link");
const editButton = document.getElementById("edit-button");
const token = localStorage.getItem("authToken");
const bandeau = document.getElementById("bandeau");
const filtre = document.getElementById("filtre");
document.addEventListener("DOMContentLoaded", () => {
  if (token) {
    // L'utilisateur est connecté
    authLink.textContent = "logout";
    authLink.href = "#";
    editButton.style.display = "inline";
    bandeau.style.display = "flex";
    filtre.style.display = "none";

    authLink.addEventListener("click", () => {
      // Déconnecter l'utilisateur
      localStorage.removeItem("authToken");
      window.location.reload();
      bandeau.style.display = "none";
    });
  }
});
