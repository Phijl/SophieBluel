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
  const photoBox = document.querySelector(".photo-box");
  const picto = document.getElementById("picto");
  const err = document.getElementById("error-message");
  const preview = document.getElementById("preview");

  // Bouton pour ouvrir le sélecteur de fichier
  document
    .getElementById("add-photo-button")
    .addEventListener("click", function () {
      document.getElementById("fileInput").click();
    });

  // Charger les catégories depuis le backend
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      categorySelect.innerHTML = "";
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

  // Gestion de l'aperçu de l'image
  document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const maxSize = 4 * 1024 * 1024; // Taille maximale 4 Mo

    if (file) {
      if (file.size > maxSize) {
        err.style.display = "block";
        err.textContent = "L'image est trop volumineuse (max. 4 Mo).";
        preview.src = "";
        picto.style.display = "block";
        photoBox.querySelector("button").style.display = "initial";
        photoBox.querySelector("p").style.display = "block";
      } else {
        err.style.display = "none";
        const reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
          picto.style.display = "none";
          photoBox.querySelector("button").style.display = "none";
          photoBox.querySelector("p").style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Ouvrir la modale galerie
  editButton.addEventListener("click", () => {
    modal.style.display = "block";
    loadGallery();
  });

  // Revenir à la galerie
  backArrow.addEventListener("click", () => {
    resetForm();
    modal.style.display = "block";
  });

  // Ouvrir la modale d'ajout de photo
  addPhotoButton.addEventListener("click", () => {
    modal.style.display = "none";
    addPhotoModal.style.display = "block";
  });

  // Fermer les modales
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      resetForm();
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === addPhotoModal) {
      resetForm();
    }
  });

  // Charger la galerie photo
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

  // Événements de suppression
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
          document
            .querySelector(`.delete-icon[data-id="${workId}"]`)
            .parentElement.remove();
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

  // Réinitialiser le formulaire
  function resetForm() {
    modal.style.display = "none";
    addPhotoModal.style.display = "none";
    preview.src = "";
    picto.style.display = "block";
    photoBox.querySelector("button").style.display = "initial";
    photoBox.querySelector("p").style.display = "block";
    err.style.display = "none";
    addPhotoForm.reset();
  }

  // Ajouter une photo
  addPhotoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const token = localStorage.getItem("authToken");
    const maxSize = 4 * 1024 * 1024;

    if (!fileInput.files.length || fileInput.files[0].size > maxSize) {
      err.style.display = "block";
      err.textContent = fileInput.files.length
        ? "L'image est trop volumineuse (max. 4 Mo)."
        : "Veuillez sélectionner une image.";
      return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", title);
    formData.append("category", category);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          loadGallery();
          resetForm();
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
  // Vérifie si le bouton "Valider" doit être activé ou désactivé
  function validateForm() {
    console.log("Validation en cours...");
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("fileInput");
    const addPhotoButton = document.getElementById("add-photo");

    console.log({ title, category, fileInputLength: fileInput.files.length });

    if (title && category && fileInput.files.length > 0) {
      addPhotoButton.disabled = false;
      console.log("Bouton activé !");
    } else {
      addPhotoButton.disabled = true;
      console.log("Bouton désactivé !");
    }
  }

  // Ajouter des écouteurs d'événements pour valider les champs à chaque modification
  document.getElementById("title").addEventListener("input", validateForm);
  document.getElementById("category").addEventListener("change", validateForm);
  document.getElementById("fileInput").addEventListener("change", validateForm);

  // Ajouter l'écouteur pour le formulaire d'ajout de travaux
  addPhotoForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const fileInput = document.getElementById("fileInput");
    const errorMessage = document.getElementById("error-message");
    const maxSize = 4 * 1024 * 1024; // Taille maximale en octets (4 Mo)

    if (!fileInput.files.length) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Veuillez sélectionner une image.";
      return;
    }

    const file = fileInput.files[0];
    if (file.size > maxSize) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "L'image est trop volumineuse (max. 4 Mo).";
      return;
    }

    errorMessage.style.display = "none"; // Cache le message d'erreur

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
          loadGallery();
          gallery.renderImages();

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
