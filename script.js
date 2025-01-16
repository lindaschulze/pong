function selectPaddle(paddleImage) {
  // Speichern der Auswahl im sessionStorage
  sessionStorage.setItem('playerPaddle', paddleImage);

  // Verstecke die Auswahlseite und zeige das Spiel
  document.querySelector('h1').innerText = 'Pong Game';
  document.querySelector('.player-option').style.display = 'none';
  document.querySelector('#game-container').style.display = 'block';

  // Lade das Spiel
  loadGame();
}

function loadGame() {
  // Hole das ausgewählte Paddle aus dem sessionStorage
  const selectedPaddle = sessionStorage.getItem('playerPaddle') || 'paddle1.png';

  // Setze das Paddle-Bild für den linken Spieler
  const leftPaddle = document.getElementById('leftPaddle');
  leftPaddle.src = selectedPaddle;

  // Falls nötig, die Größe anpassen
  const originalWidth = 10;
  const originalHeight = 50;
  const img = new Image();
  img.src = selectedPaddle;
  img.onload = function() {
    const aspectRatio = img.width / img.height;
    leftPaddle.width = originalWidth;
    leftPaddle.height = originalWidth / aspectRatio;
  };

  // Hier kann der bestehende Code für das Spiel folgen
}

window.onload = function() {
  // Prüfen, ob bereits ein Paddle ausgewählt wurde
  const selectedPaddle = sessionStorage.getItem('playerPaddle');
  if (selectedPaddle) {
    loadGame();
  }
};
