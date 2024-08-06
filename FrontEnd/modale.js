document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("edit-button");
  const modal = document.getElementById("modal");
  const addPhotoModal = document.getElementById("add-photo-modal");
  const addPhotoButton = document.getElementById("add-photo");
  const closeButtons = document.querySelectorAll(".close");
  const modalGallery = document.getElementById("modal-gallery");
  const addPhotoForm = document.getElementById("add-photo-form");

  // Ouvrir la modale de la galerie photo
  editButton.addEventListener("click", () => {
    modal.style.display = "block";
    loadGallery();
  });

  // Ouvrir la modale pour ajouter une photo
  addPhotoButton.addEventListener("click", () => {
    modal.style.display = "none";
    addPhotoModal.style.display = "block";
  });

  // Fermer la modale au clic sur la croix
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.style.display = "none";
      addPhotoModal.style.display = "none";
    });
  });

  // Fermer la modale au clic en dehors de celle-ci
  window.addEventListener("click", (event) => {
    if (event.target == modal || event.target == addPhotoModal) {
      modal.style.display = "none";
      addPhotoModal.style.display = "none";
    }
  });

  // Charger la galerie dans la modale
  function loadGallery() {
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
        modalGallery.innerHTML = "";
        data.forEach((work) => {
          const workElement = document.createElement("div");
          workElement.classList.add("work");
          workElement.innerHTML = `
                      <img src="${work.imageUrl}" alt="${work.title}">
                      <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
                  `;
          modalGallery.appendChild(workElement);
        });
        attachDeleteEventListeners();
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des travaux:", error)
      );
  }

  // Attacher les événements de suppression aux icônes de suppression
  function attachDeleteEventListeners() {
    const deleteIcons = document.querySelectorAll(".delete-icon");
    deleteIcons.forEach((icon) => {
      icon.addEventListener("click", (event) => {
        const workId = event.target.getAttribute("data-id");
        deleteWork(workId);
      });
    });
  }

  // Supprimer un travail
  function deleteWork(workId) {
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Supprimer l'élément du DOM
          const workElement = document.querySelector(
            `.delete-icon[data-id="${workId}"]`
          ).parentElement;
          workElement.remove();
        } else {
          console.error(
            "Erreur lors de la suppression du travail:",
            response.statusText
          );
        }
      })
      .catch((error) =>
        console.error("Erreur lors de la suppression du travail:", error)
      );
  }
});
