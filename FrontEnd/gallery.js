class Gallery {
	 // Constructeur pour stocker la référence à l'élément HTML représentant la galerie
    constructor(galleryElement) {
        this.gallery = galleryElement;
    }
	
	 // Fonction asynchrone pour récupérer les données des images et les afficher dans la galerie
    async renderImages() {
		// Récupérer les données depuis l'API
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
		
		// Effacer le contenu existant de la galerie
        this.gallery.innerHTML = '';
		
		 // Boucler sur chaque élément
        works.forEach(work => {
			// Créer un nouvel élément image		
            const imageElement = document.createElement('img');
			// Ajouter les classes et les attributs de l'élément image
            imageElement.classList.add('gallery-image');
            imageElement.src = work.imageUrl;
            imageElement.dataset.id = work.id;
            imageElement.alt = work.title;
			// Ajouter l'élément image à la galerie
            this.gallery.appendChild(imageElement);
        });
    }
}
// Créer une instance de la classe Galerie, ciblant l'élément avec la classe 'gallery'
const gallery = new Gallery(document.querySelector('.gallery'));
// Appeler la méthode afficherImages pour récupérer et afficher les images
gallery.renderImages();