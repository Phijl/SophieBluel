document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth-link");
  const editButton = document.getElementById("edit-button");
  const token = localStorage.getItem("authToken");
  const bandeau = document.getElementById("bandeau");

  if (token) {
    // L'utilisateur est connecté
    authLink.textContent = "logout";
    authLink.href = "#";
    editButton.style.display = "inline";
    bandeau.style.display = "flex";

    authLink.addEventListener("click", () => {
      // Déconnecter l'utilisateur
      localStorage.removeItem("authToken");
      window.location.reload();
    });
  } else {
    // L'utilisateur n'est pas connecté

    editButton.style.display = "none";
    bandeau.style.display = "none";
  }
});
