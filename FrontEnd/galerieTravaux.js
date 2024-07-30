document.addEventListener("DOMContentLoaded", () => {
  // Récupération des travaux depuis le back-end
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const gallery = document.querySelector(".gallery");
      data.forEach((work) => {
        const workElement = document.createElement("div");
        workElement.classList.add("work");

        // Remplir le contenu de l'élément travail
        workElement.innerHTML = `
              <img src="${work.imageUrl}" alt="${work.title}">
              <h3>${work.title}</h3>
            `;
        gallery.appendChild(workElement);
      });
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des travaux:", error)
    );
});
