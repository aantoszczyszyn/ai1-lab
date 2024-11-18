//leaflet
var map = L.map('map').setView([51.505, -0.09], 13);
map._container.style.width = '300px';
map._container.style.height = '300px';
map.invalidateSize();

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenTopoMap, © OpenStreetMap contributors'
}).addTo(map);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles © Esri'
}).addTo(map);

//pobierz lokalizacje
document.getElementById('getLocation').addEventListener('click', function() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      L.marker([lat, lon]).addTo(map).bindPopup("Jesteś tutaj!").openPopup();
      map.setView([lat, lon], 16);
    }, function(error) {
      alert("Nie udało się pobrać lokalizacji: " + error.message);
    }, {
      enableHighAccuracy: true
    });
  } else {
    alert("Twoja przeglądarka nie wspiera geolokalizacji.");
  }
});

//przycisk zapisz mapke
document.getElementById('saveMap').addEventListener('click', function() {
    console.log("Przycisk 'Zapisz mapę' kliknięty, generowanie obrazu...");
    leafletImage(map, function(err, canvas) {
      if (err) {
        console.error("Błąd przy generowaniu obrazu mapy:", err);
        return;
      }
  
      console.log("Obraz mapy wygenerowany pomyślnie.");
      var imgData = canvas.toDataURL();
      displayRaster(imgData);
      createPuzzle(imgData);
    });
  });
  
  function displayRaster(imageDataUrl) {
    var rasterContainer = document.getElementById('raster-container');
    rasterContainer.innerHTML = ''; 
    var rasterImg = document.createElement('img');
    rasterImg.src = imageDataUrl;
    rasterImg.alt = "Raster mapy";
    rasterImg.style.border = "2px solid #333";
    rasterImg.style.margin = "10px 0";
    rasterImg.style.width = "300px"; 
    rasterImg.style.height = "300px";
    rasterContainer.appendChild(rasterImg);
  }
  

//puzelki
function createPuzzle(imageDataUrl) {
    var img = new Image();
    img.src = imageDataUrl;
  
    img.onload = function() {
      console.log("Obraz mapy załadowany pomyślnie do podziału.");
      var pieceWidth = 75;
      var pieceHeight = 75;
      var puzzleGrid = document.getElementById('puzzle-grid');
      puzzleGrid.innerHTML = '';
  
      for (var i = 0; i < 16; i++) {
        var dropZone = document.createElement('div');
        dropZone.classList.add('drop-zone');
        dropZone.id = `drop-${i}`;
  
        dropZone.addEventListener('dragover', function(event) {
          event.preventDefault();
          this.classList.add('hover');
        });
  
        dropZone.addEventListener('dragleave', function() {
          this.classList.remove('hover');
        });
  
        dropZone.addEventListener('drop', function(event) {
          event.preventDefault();
          const pieceId = event.dataTransfer.getData('text/plain');
          const piece = document.getElementById(pieceId);
  
          if (piece && !this.hasChildNodes()) {
            this.appendChild(piece);
          }
  
          this.classList.remove('hover');
  
          if (checkPuzzleCompletion()) {
            alert("Gratulacje! Układanka ukończona!");
          }
        });
  
        puzzleGrid.appendChild(dropZone);
      }
  
      // puzzle tworzxe
      for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
          var pieceCanvas = document.createElement('canvas');
          pieceCanvas.width = pieceWidth;
          pieceCanvas.height = pieceHeight;
          var ctx = pieceCanvas.getContext('2d');
          ctx.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
  
          var pieceDiv = document.createElement('div');
          pieceDiv.classList.add('piece');
          pieceDiv.draggable = true;
          pieceDiv.id = `piece-${y}-${x}`;
          pieceDiv.appendChild(pieceCanvas);
  
          pieceDiv.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', event.target.id);
            setTimeout(() => {
              event.target.style.visibility = 'hidden';
            }, 0);
          });
          pieceDiv.addEventListener('dragend', function(event) {
            event.target.style.visibility = 'visible';
          });
          document.getElementById('puzzle-container').appendChild(pieceDiv);
        }
      }
    };
  }
  
//funkcja sprawdzająca ukończenie układanki
function checkPuzzleCompletion() {
  let allPieces = document.querySelectorAll('#puzzle-grid .drop-zone');
  let complete = true;

  allPieces.forEach((zone, index) => {
    if (zone.hasChildNodes()) {
      let piece = zone.firstChild;
      if (piece.id !== `piece-${Math.floor(index / 4)}-${index % 4}`) {
        complete = false;
      }
    } else {
      complete = false;
    }
  });

  return complete;
}

//prośba o zgodę na powiadomienia
Notification.requestPermission().then(function(permission) {
  if (permission === 'granted') {
    new Notification("Powiadomienia zostały włączone!");
  }
});
