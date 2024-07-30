document.addEventListener("DOMContentLoaded", () => {
  // Récupérer les catégories depuis l'API
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categoriesData) => {
      const categoriesMenu = document.querySelector(".categories");

      // Créer un bouton pour chaque catégorie
      categoriesData.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        categoriesMenu.appendChild(button);
      });

      // Ajout d'un bouton "Tous" pour afficher tous les travaux
      const allButton = document.createElement("button");
      allButton.textContent = "Tous";
      allButton.dataset.categoryId = "all";
      categoriesMenu.insertBefore(allButton, categoriesMenu.firstChild);

      // Récupérer et afficher les travaux depuis l'API
      fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((worksData) => {
          const gallery = document.querySelector(".gallery");

          // Fonction pour afficher les travaux filtrés
          const displayWorks = (categoryId) => {
            gallery.innerHTML = ""; // Nettoyer la galerie

            worksData.forEach((work) => {
              if (
                categoryId === "all" ||
                work.categoryId === parseInt(categoryId)
              ) {
                // Créer et ajouter un élément pour chaque travail
                const workElement = document.createElement("div");
                workElement.classList.add("work");
                workElement.innerHTML = `
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <h3>${work.title}</h3>
                  `;
                gallery.appendChild(workElement);
              }
            });
          };

          // Afficher tous les travaux par défaut
          displayWorks("all");

          // Ajouter des écouteurs d'événements aux boutons pour le filtrage
          categoriesMenu.addEventListener("click", (event) => {
            if (event.target.tagName === "BUTTON") {
              const categoryId = event.target.dataset.categoryId;

              // Supprimer la classe 'active' de tous les boutons
              document
                .querySelectorAll(".categories button")
                .forEach((button) => {
                  button.classList.remove("active");
                });

              // Ajouter la classe 'active' au bouton cliqué
              event.target.classList.add("active");

              displayWorks(categoryId);
            }
          });
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération des travaux:", error)
        );
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des catégories:", error)
    );
});
