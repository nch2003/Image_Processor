// Fetch dog image
async function fetchDogImage() {
  // Imagine random din Dog API
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();

  // Ia container-ul cu imaginea si sterge imaginea in caz ca exista una
  const imageContainer = document.querySelector(".image-container");
  const childElement = document.querySelector("img");
  if (childElement) {
    imageContainer.removeChild(childElement);
  }

  // Creeaza o noua imagine cu sursa data de Fetch dog image
  let img = document.createElement("img");
  img.crossOrigin = "anonymous";
  img.onload = function () {
    imageContainer.appendChild(img);
  };
  img.src = data.message;

  return data;
}

document.addEventListener("DOMContentLoaded", function () {
  // Brightness
  function adjustBrightness(img, brightness) {
    // Creeaza un canvas
    const canvas = document.createElement("canvas");
    const c = canvas.getContext("2d");

    // Seteaza dimensiunile canvas-ului cu cele ale imaginii
    canvas.width = img.width;
    canvas.height = img.height;

    c.drawImage(img, 0, 0, img.width, img.height);

    const imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    brightness = brightness * 2.55;

    // Imparte imaginea in patru bucati procesand fiecare pixel in parte
    const size = data.length / 4;
    for (let p = 0; p < 4; p++) {
      setTimeout(() => {
        for (let i = p * size; i < (p + 1) * size; i += 4) {
          if ((i / 4) % canvas.width < canvas.width / 2) {
            data[i] += brightness;
            data[i + 1] += brightness;
            data[i + 2] += brightness;
          }
        }
        c.putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL();
      }, p * 1000);
    }
  }

  // Grayscale
  function convertToGrayscale(img) {
    const canvas = document.createElement("canvas");
    const c = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    c.drawImage(img, 0, 0, img.width, img.height);

    const imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const size = data.length / 4;
    for (let p = 0; p < 4; p++) {
      setTimeout(() => {
        for (let i = p * size; i < (p + 1) * size; i += 4) {
          if ((i / 4) % canvas.width < canvas.width / 2) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
        }
        c.putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL();
      }, p * 1000);
    }
  }

  // Initializeaza o imagine in momentul in care pagina este recincarcata
  let data;
  fetchDogImage().then((responseData) => {
    data = responseData;
  });

  // Functie pentru aplicarea filtrului in functie de ce buton se apasa
  function applyFilter(filterType) {
    const img = document.querySelector("img");
    img.crossOrigin = "anonymous";
    if (filterType === "Grayscale") {
      img.src = data.message;
      convertToGrayscale(img);
    }
    if (filterType === "Brightness") {
      img.src = data.message;
      adjustBrightness(img, 50);
    }
  }

  // EventListener pentru fiecare buton de filtru
  const brightnessButton = document.querySelector(".brightness-button");
  const GrayscaleButton = document.querySelector(".grayScale-button");

  GrayscaleButton.addEventListener("click", function () {
    applyFilter("Grayscale");
  });

  brightnessButton.addEventListener("click", function () {
    applyFilter("Brightness");
  });

  // EventListener pentru schimbarea imaginii
  const changeButton = document.querySelector(".change-button");
  changeButton.addEventListener("click", function () {
    fetchDogImage().then((responseData) => {
      data = responseData;
    });
  });
});
