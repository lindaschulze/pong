window.onload = function() {
  // Hole das ausgewählte Paddle-Bild aus dem sessionStorage
  const selectedPaddle = sessionStorage.getItem('playerPaddle') || 'paddle1.png'; // Standardmäßig 'paddle1.png'

  // Ersetze das linke Paddle mit dem ausgewählten Bild
  const leftPaddle = document.getElementById('leftPaddle');
  leftPaddle.src = selectedPaddle; // Setze das Bild des linken Paddles

  // Falls nötig, die Größe anpassen
  const originalWidth = 10; // Originalbreite des Paddles
  const originalHeight = 50; // Originalhöhe des Paddles
  const img = new Image();
  img.src = selectedPaddle;
  img.onload = function() {
    const aspectRatio = img.width / img.height;
    leftPaddle.width = originalWidth; // Breite bleibt gleich
    leftPaddle.height = originalWidth / aspectRatio; // Höhe basierend auf dem Seitenverhältnis anpassen
  };

  // Das Spiel nach Auswahl des Paddles starten
  startGame();
};

function startGame() {
  // Hier kommt der bestehende Initialisierungscode des Spiels
}
