document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("edit-button");
  const modal = document.getElementById("modal");
  const addPhotoModal = document.getElementById("add-photo-modal");
  const addPhotoButton = document.getElementById("add-photo");
  const closeButtons = document.querySelectorAll(".close");
  const modalGallery = document.getElementById("modal-gallery");
  const addPhotoForm = document.getElementById("addphotoform");
  const backArrow = document.getElementById("back-arrow");
  const categorySelect = document.getElementById("category");
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photo-preview");
  const photoBox = document.querySelector(".photo-box");
  const photoContainer = document.getElementById("photo-container");
  const picto = document.getElementById("picto");

  const preview = document.getElementById("preview");

  document
    .getElementById("add-photo-button")
    .addEventListener("click", function () {
      document.getElementById("fileInput").click(); // Ouvre la boîte de dialogue de fichier
    });

  // Charger les catégories depuis le backend
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      categorySelect.innerHTML = ""; // Vide le select
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des catégories:", error)
    );

  // Afficher un aperçu de la photo sélectionnée
  addPhotoForm.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.textAlign = "center";

        photoBox.querySelector("button").style.display = "none";
        photoBox.querySelector("p").style.display = "none";
        picto.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
  // Ouvrir la modale de la galerie photo
  editButton.addEventListener("click", () => {
    modal.style.display = "block";
    loadGallery();
  });
  backArrow.addEventListener("click", () => {
    preview.src = ""; // Vider l'aperçu de l'image
    picto.style.display = "block";
    photoBox.querySelector("button").style.display = "initial";
    photoBox.querySelector("p").style.display = "block";
    modal.style.display = "block";
    // Réinitialiser le formulaire
    addPhotoForm.reset();

    // Réinitialiser le sélecteur de catégorie à un état vierge
    categorySelect.value = "";

    // Revenir à la modale galerie photo
    addPhotoModal.style.display = "";
    modal.style.display = "block";
  });

  // Ouvrir la modale pour ajouter une photo
  addPhotoButton.addEventListener("click", () => {
    modal.style.display = "none";
    addPhotoModal.style.display = "block";
  });

  // Fermer les modales au clic sur la croix
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.style.display = "none";
      addPhotoModal.style.display = "none";
      preview.src = "";
      picto.style.display = "block";
      photoBox.querySelector("button").style.display = "initial";
      photoBox.querySelector("p").style.display = "block";
    });
  });

  // Fermer la modale au clic en dehors de celle-ci
  window.addEventListener("click", (event) => {
    if (event.target == modal || event.target == addPhotoModal) {
      modal.style.display = "none";
      addPhotoModal.style.display = "none";
      preview.src = "";
      picto.style.display = "block";
      photoBox.querySelector("button").style.display = "initial";
      photoBox.querySelector("p").style.display = "block";
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

  document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const preview = document.getElementById("preview");
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

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
  addPhotoForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les données du formulaire
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", document.getElementById("title").value);
    formData.append("category", document.getElementById("category").value);

    const token = localStorage.getItem("authToken");

    // Envoyer les données au backend
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Si l'ajout est réussi, rafraîchir la galerie
          loadGallery();
          // Fermer la modal d'ajout de photo
          addPhotoModal.style.display = "none";
          modal.style.display = "block";
        } else {
          console.error(
            "Erreur lors de l'ajout de la photo :",
            response.statusText
          );
        }
      })
      .catch((error) =>
        console.error("Erreur lors de l'ajout de la photo :", error)
      );
  });
});
