const dogApiUrl = "https://dog.ceo/api/breeds/image/random/10"; // To get 10 random dog images
const breedApiUrl = "https://dog.ceo/api/breeds/list/all"; // To get all breeds for buttons

async function loadDogImages() {
  const res = await fetch(dogApiUrl);
  const data = await res.json();
  const dogImages = data.message;

  const carouselTrack = document.querySelector(".carousel-track");

  dogImages.forEach(imageUrl => {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Random Dog";
    img.classList.add("carousel-item");
    carouselTrack.appendChild(img);
  });

  // Set the first image as visible by default
  showImage(0);
}

// Show a specific image in the carousel based on index
let currentImageIndex = 0;

function showImage(index) {
  const carouselItems = document.querySelectorAll(".carousel-item");
  const totalImages = carouselItems.length;

  if (index >= totalImages) {
    currentImageIndex = 0;
  } else if (index < 0) {
    currentImageIndex = totalImages - 1;
  } else {
    currentImageIndex = index;
  }

  carouselItems.forEach(item => {
    item.style.display = "none";
  });

  carouselItems[currentImageIndex].style.display = "block";
}

function addManualControls() {
  const carousel = document.querySelector(".carousel-container");

  carousel.addEventListener("click", () => {
    showImage(currentImageIndex + 1);
  });
}

async function loadDogBreeds() {
  const res = await fetch(breedApiUrl);
  const data = await res.json();
  const breeds = Object.keys(data.message);

  const breedButtonsContainer = document.getElementById("breed-buttons");

  breeds.forEach(breed => {
    const button = document.createElement("button");
    button.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
    button.classList.add("button-74");
    button.setAttribute("data-breed", breed);
    button.addEventListener("click", () => loadBreedInfo(breed));
    breedButtonsContainer.appendChild(button);
  });
}

async function loadBreedInfo(breed) {
  const breedInfoUrl = `https://api.thedogapi.com/v1/breeds/search?q=${breed}`;
  const res = await fetch(breedInfoUrl);
  const data = await res.json();

  if (data.length > 0) {
    const breedData = data[0];
    document.getElementById("breed-name").textContent = breedData.name;
    document.getElementById("breed-description").textContent = breedData.description;
    document.getElementById("min-life").textContent = breedData.life_span.split(" - ")[0];
    document.getElementById("max-life").textContent = breedData.life_span.split(" - ")[1];

    document.getElementById("breed-info-container").style.display = "block";
  }
}

function startVoice() {
  if (annyang) {
    const commands = {
      'load dog breed *breedName': (breedName) => loadBreedInfo(breedName.toLowerCase())
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}

function stopVoice() {
  if (annyang) {
    annyang.abort();
  }
}

window.onload = () => {
  loadDogImages();
  loadDogBreeds();
  addManualControls();
};




  