const cuttingsData = [
      "You arrived in this world and made it brighter from that day onward.",
      "Your smile carries spring wherever it goes.",
      "Your kindness is the softest song a heart can hear.",
      "In every room, your joy leaves a glow behind.",
      "Your courage is quiet, but it is powerful and beautiful.",
      "May this new year bring you dreams that truly bloom.",
      "May your days be full of laughter, letters, and little miracles.",
      "You are deeply loved, and this day is made for you."
    ];

const galleryData = [
  { src: "images/1 (2).jpg", cap: "Memory One" },
  { src: "images/2.jpg", cap: "Memory Two" },
  { src: "images/3.jpg", cap: "Memory Three" },
  { src: "images/1 (2).jpg", cap: "Memory Four" },
  { src: "images/2.jpg", cap: "Memory Five" },
  { src: "images/3.jpg", cap: "Memory Six" },
  { src: "images/1 (2).jpg", cap: "Memory Seven" },
  { src: "images/2.jpg", cap: "Memory Eight" },
  { src: "images/3.jpg", cap: "Memory Nine" }
];

    const songsData = [
      { title: "Song One", src: "audio/Audio1.mp3", img: "images/1 (2).jpg" },
      { title: "Song Two", src: "audio/Audio2.mp3", img: "images/2.jpg" },
      { title: "Song Three", src: "audio/Audio3.mp3", img: "images/3.jpg" }
    ];

const songPlayers = songsData.map(item => {
  const audio = new Audio(item.src);
  audio.loop = true;
  return audio;
});
let currentSongIndex = -1;
let finalQrPrepared = false;
const UNLOCK_AT_IST = new Date("2026-03-27T00:00:00+05:30");
const DEV_SHOW_UNLOCK_BUTTON = true; // Set to false when you want real lock behavior.
let launchTickerId = null;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function formatTimeLeft(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function updateLaunchGateUi() {
  const countdownEl = document.getElementById("unlock-countdown");
  const enterBtn = document.getElementById("unlock-enter-btn");
  if (!countdownEl || !enterBtn) return;

  const now = new Date();
  const isUnlockedByTime = now >= UNLOCK_AT_IST;
  const isUnlocked = isUnlockedByTime || DEV_SHOW_UNLOCK_BUTTON;

  enterBtn.style.display = isUnlocked ? "inline-block" : "none";

  if (isUnlockedByTime) {
    countdownEl.textContent = "Unlocked. You can enter now.";
  } else {
    const left = UNLOCK_AT_IST.getTime() - now.getTime();
    const lockText = `Unlocks in ${formatTimeLeft(left)}`;
    countdownEl.textContent = DEV_SHOW_UNLOCK_BUTTON
      ? `${lockText} (Dev mode: button is visible now)`
      : lockText;
  }
}

function initLaunchGate() {
  const enterBtn = document.getElementById("unlock-enter-btn");
  if (!enterBtn) return;

  enterBtn.addEventListener("click", () => {
    if (launchTickerId) {
      clearInterval(launchTickerId);
      launchTickerId = null;
    }
    showScreen("gate-screen");
  });

  updateLaunchGateUi();
  launchTickerId = setInterval(updateLaunchGateUi, 1000);
}

function initFinalQr() {
  if (finalQrPrepared) return;

  const qrImg = document.getElementById("final-qr-img");
  const qrLink = document.getElementById("final-qr-link");
  const qrStatus = document.getElementById("final-qr-status");
  if (!qrImg || !qrLink || !qrStatus) return;

  const isFileMode = window.location.protocol === "file:";
  const downloadPageUrl = new URL("shivani-download.html", window.location.href).href;
  qrLink.href = downloadPageUrl;
  const qrProviders = [
    `https://api.qrserver.com/v1/create-qr-code/?size=900x900&data=${encodeURIComponent(downloadPageUrl)}`,
    `https://quickchart.io/qr?size=900&text=${encodeURIComponent(downloadPageUrl)}`
  ];

  let providerIndex = 0;
  const tryNextProvider = () => {
    if (providerIndex >= qrProviders.length) {
      qrStatus.innerHTML = `QR could not load. Open this link: <a href="${downloadPageUrl}" target="_blank" rel="noopener noreferrer">Download Shivani image</a>`;
      return;
    }
    qrImg.src = qrProviders[providerIndex];
    providerIndex += 1;
  };

  qrImg.onload = () => {
    finalQrPrepared = true;
    if (isFileMode) {
      qrStatus.textContent = "QR created, but this page is opened as file://. Run with a local server so scan works properly.";
    } else {
      qrStatus.textContent = "Scan QR to download Shivani image.";
    }
  };

  qrImg.onerror = () => {
    tryNextProvider();
  };

  tryNextProvider();
}

    function playSong(index) {
      const status = document.getElementById("song-status");
      songPlayers.forEach((player, i) => {
        if (i !== index) {
          player.pause();
          player.currentTime = 0;
        }
      });

      const selected = songPlayers[index];
      selected.loop = true;
      selected.play()
        .then(() => {
          currentSongIndex = index;
          status.textContent = `${songsData[index].title} is playing in loop.`;
        })
        .catch(() => {
          status.textContent = `Could not play ${songsData[index].title}. Check song file path.`;
        });
    }

    function stopSongs() {
      songPlayers.forEach(player => {
        player.pause();
        player.currentTime = 0;
      });
      currentSongIndex = -1;
      document.getElementById("song-status").textContent = "No song is playing.";
    }

    function initSongStage() {
      const board = document.getElementById("song-board");
      board.innerHTML = "";
      const rotations = [-3, 2, -1];
      const positions = [
        { left: "4%", top: "10%" },
        { left: "36%", top: "28%" },
        { left: "67%", top: "12%" }
      ];

      songsData.forEach((song, index) => {
        const note = document.createElement("article");
        note.className = "song-cutting";
        note.style.left = positions[index].left;
        note.style.top = positions[index].top;
        note.dataset.rot = String(rotations[index]);
        note.style.transform = `rotate(${rotations[index]}deg)`;
        note.style.zIndex = String(50 + index);

        const title = document.createElement("h3");
        title.textContent = song.title;

        const image = document.createElement("img");
        image.src = song.img;
        image.alt = song.title;
        image.addEventListener("error", () => { image.style.display = "none"; }, { once: true });

        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Play This Song";
        btn.addEventListener("click", () => playSong(index));

        note.append(title, image, btn);
        board.appendChild(note);
        makeDraggable(note, () => {});
      });

      document.getElementById("song-status").textContent = currentSongIndex === -1
        ? "No song is playing."
        : `${songsData[currentSongIndex].title} is playing in loop.`;
    }

    document.getElementById("finger-open").addEventListener("click", () => {
      showScreen("song-stage");
      initSongStage();
    });
    document.getElementById("gate-btn").addEventListener("click", () => {
      showScreen("song-stage");
      initSongStage();
    });
    document.getElementById("song-next-btn").addEventListener("click", () => showScreen("letter-screen"));
    document.getElementById("stop-song-btn").addEventListener("click", stopSongs);

    document.getElementById("crush-btn").addEventListener("click", () => {
      const letter = document.getElementById("letter-card");
      letter.classList.add("crush");
      setTimeout(() => {
        showScreen("cuttings-stage");
        initCuttings();
      }, 500);
    });

    let z = 10;
    function makeDraggable(el, onFirstDrag) {
      let dragging = false;
      let moved = false;
      let startX = 0;
      let startY = 0;
      let curX = 0;
      let curY = 0;

      const start = (x, y) => {
        dragging = true;
        el.style.zIndex = String(++z);
        startX = x;
        startY = y;
      };

      const move = (x, y) => {
        if (!dragging) return;
        const dx = x - startX;
        const dy = y - startY;
        startX = x;
        startY = y;
        curX += dx;
        curY += dy;
        el.style.transform = `translate(${curX}px, ${curY}px) rotate(${el.dataset.rot}deg)`;
        if (!moved && (Math.abs(curX) > 5 || Math.abs(curY) > 5)) {
          moved = true;
          onFirstDrag();
        }
      };

      const end = () => { dragging = false; };

      el.addEventListener("mousedown", e => start(e.clientX, e.clientY));
      window.addEventListener("mousemove", e => move(e.clientX, e.clientY));
      window.addEventListener("mouseup", end);

      el.addEventListener("touchstart", e => {
        const t = e.touches[0];
        start(t.clientX, t.clientY);
      }, { passive: true });
      el.addEventListener("touchmove", e => {
        if (!dragging) return;
        e.preventDefault();
        const t = e.touches[0];
        move(t.clientX, t.clientY);
      }, { passive: false });
      window.addEventListener("touchend", end);
    }

    function initCuttings() {
      const board = document.getElementById("board");
      board.innerHTML = "";
      let current = 0;

      function spawnCutting(index) {
        const note = document.createElement("article");
        note.className = "cutting show";
        const maxX = Math.max(20, board.clientWidth - 420);
        const maxY = Math.max(20, board.clientHeight - 260);
        const randomX = Math.floor(Math.random() * maxX) + 10;
        const randomY = Math.floor(Math.random() * maxY) + 10;
        note.style.left = `${randomX}px`;
        note.style.top = `${randomY}px`;
        note.dataset.rot = String(Math.round((Math.random() * 8) - 4));
        note.style.transform = `rotate(${note.dataset.rot}deg)`;
        note.style.zIndex = String(100 + index);

        const title = document.createElement("h3");
        title.textContent = `Cutting ${index + 1} of 8`;

        const text = document.createElement("p");
        text.textContent = cuttingsData[index];

        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = index === 7 ? "Open Last Heart Paper" : "Next Cutting";
        btn.disabled = false;

        const hint = document.createElement("p");
        hint.textContent = "Drag if you want, or click next directly.";
        hint.style.margin = "0 0 10px";
        hint.style.fontSize = "0.9rem";

        makeDraggable(note, () => {
          hint.textContent = "Nice drag. You can continue.";
        });

        btn.addEventListener("click", () => {
          btn.remove();
          //hint.textContent = "Saved.";
          if (index < 7) {
            current += 1;
            spawnCutting(current);
          } else {
            showHeartPaper();
          }
        });

        note.append(title, hint, text, btn);
        board.appendChild(note);
      }

      function showHeartPaper() {
        const heart = document.createElement("article");
        heart.className = "cutting heart-paper show";
        heart.style.left = "50%";
        heart.style.top = "50%";
        heart.style.transform = "translate(-50%, -50%) rotate(-2deg)";
        heart.innerHTML = `
          <h3>The Last Paper</h3>
          <p>Tap the heart to open your gallery.</p>
          <img src="images/heart.webp" alt="Heart" id="heart-img">
          <p class="heart-note">For the Birthday Girl</p>
        `;
        const heartImg = heart.querySelector("#heart-img");
        heartImg.addEventListener("error", () => { heartImg.style.display = "none"; }, { once: true });
        heart.addEventListener("click", () => {
          heartImg.classList.remove("beating");
          void heartImg.offsetWidth;
          heartImg.classList.add("beating");
          setTimeout(() => {
            showScreen("gallery-stage");
            initGallery();
          }, 850);
        });
        board.appendChild(heart);
      }

      spawnCutting(current);
    }

    let galleryIndex = 0;
function initGallery() {
      galleryIndex = 0;
      const image = document.getElementById("gallery-image");
      const caption = document.getElementById("gallery-caption");
      const nextBtn = document.getElementById("gallery-next");
      const end = document.getElementById("end-note");
      end.classList.remove("show");

      function render() {
        const item = galleryData[galleryIndex];
        image.src = item.src;
        image.onerror = () => { image.src = "images/" + item.src; };
        caption.textContent = item.cap;
        if (galleryIndex >= galleryData.length - 1) {
          nextBtn.textContent = "Show End Note";
        } else {
          nextBtn.textContent = "Next Memory";
        }
      }

  nextBtn.onclick = () => {
    if (galleryIndex < galleryData.length - 1) {
      galleryIndex += 1;
      render();
    } else {
      nextBtn.style.display = "none";
      end.classList.add("show");
      initFinalQr();
    }
  };

  nextBtn.style.display = "inline-block";
  render();
}

initLaunchGate();

