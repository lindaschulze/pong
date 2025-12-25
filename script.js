ocument.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Spieler-Konfiguration (60FPS, pixelsPerFrame)
    const playerConfig = {
        mio:     { image: "paddle1.png", name: "Mio",     pixelsPerFrame: 3,   isAI: false },
        mika:    { image: "paddle2.png", name: "Mika",    pixelsPerFrame: 3,   isAI: false },
        faultier:{ image: "faultier.png",name: "Faulenzo",pixelsPerFrame: 1.5, isAI: false },
        alien:   { image: "alien.png",   name: "Blub",    pixelsPerFrame: 6,   isAI: false },
        roboter: { image: "computer.png",name: "Robo",    pixelsPerFrame: 4,   isAI: true  },
        nugget:  { image: "nugget.png",  name: "Nugget",  pixelsPerFrame: 3,   isAI: false }