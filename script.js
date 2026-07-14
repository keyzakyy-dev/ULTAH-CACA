// ================================
// PERSONALISASI CERITA DI SINI
// ================================
const memories = [
  { src: "galeri/1.webp", orientation: "landscape", date: "Senyum favorit", title: "Saat bahagia terlihat sederhana", note: "Aku suka versi kita yang ini—dekat, bahagia, dan tidak perlu menjadi siapa-siapa." },
  { src: "galeri/2.webp", orientation: "portrait", date: "Sisi paling usil", title: "Tertawa tanpa alasan", note: "Kalau bersamamu, bahkan wajah paling iseng pun menjadi kenangan yang ingin kusimpan." },
  { src: "galeri/3.webp", orientation: "portrait", date: "Satu tatapan", title: "Dunia terasa hanya milik kita", note: "Caramu menatapku selalu berhasil membuat dunia di sekitar kita terasa lebih pelan." },
  { src: "galeri/4.webp", orientation: "portrait", fit: "cover", focus: 0.46, date: "Satu tanda kecil", title: "Kalau kamu bahagia, aku juga", note: "Satu jempol darimu cukup untuk mengingatkanku bahwa hal sederhana pun bisa terasa sangat manis." },
  { src: "galeri/5.webp", orientation: "portrait", fit: "cover", focus: 0.5, date: "Usil sekali lagi", title: "Wajah yang tidak pernah membosankan", note: "Foto ini terlalu lucu untuk hanya dilihat sekali—sama seperti tawamu yang selalu ingin kudengar lagi." },
  { src: "galeri/6.webp", orientation: "landscape", date: "Senyum itu", title: "Yang selalu berhasil menenangkanku", note: "Di antara semua hal indah yang pernah kulihat, senyummu tetap menjadi salah satu favoritku." },
  { src: "galeri/7.webp", orientation: "portrait", date: "Sisi paling lucu", title: "Ekspresi paling gemas", note: "Ekspresi kecilmu selalu punya cara sendiri untuk membuat hariku lebih cerah." },
  { src: "galeri/8.webp", orientation: "portrait", date: "Cantik favoritku", title: "Senyum manis itu", note: "Senyum sederhana yang selalu ingin kulihat lebih lama." }
];

const letter = [
  "Selamat ulang tahun untuk perempuan yang berhasil membuat hari-hariku terasa jauh lebih hangat.",
  "Terima kasih sudah hadir dengan caramu sendiri—dengan tawamu, ceritamu, manjamu, bahkan diam kecilmu. Semua itu adalah bagian yang selalu ingin kujaga.",
  "Di umurmu yang baru, aku tidak hanya berharap semua mimpimu tercapai. Aku juga berharap kamu selalu ingat bahwa kamu dicintai, kamu cukup, dan kamu pantas mendapatkan segala hal baik di dunia.",
  "Semoga nanti, ketika kita melihat kembali hari ini, kita masih bisa tersenyum dan berkata: ternyata kita sudah berjalan sejauh ini, ya."
];

let soundOn = true;
let memoryIndex = 0;
let letterStep = 0;
let giftReady = false;
let galleryCompleted = false;
let letterCompleted = false;
let memoryTransitionTimer = null;
let memoryAnimationTimer = null;
let memoryRenderToken = 0;
let sceneTransitionTimer = null;
let musicInterludeTimer = null;
let loveCalculationTimer = null;
let galleryTypingTimer = null;
let galleryTypingFinishTimer = null;
const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.45;

// Pembuka romantis dan PIN tanggal pertama bertemu (27 Februari = 2702).
const memoryPin = "2702";
let enteredPin = "";
let loadingValue = 0;
let pageReady = document.readyState === "complete";

function updateLoading(value) {
  loadingValue = Math.min(100, Math.round(value));
  document.getElementById("loadingProgress").style.width = `${loadingValue}%`;
  document.getElementById("loadingPercent").textContent = `${loadingValue}%`;
  document.querySelector(".love-loader").setAttribute("aria-valuenow", String(loadingValue));

  const message = document.getElementById("loadingMessage");
  if (loadingValue >= 78) message.textContent = "Hampir siap, tinggal menambahkan sedikit rasa sayang";
  else if (loadingValue >= 42) message.textContent = "Menyimpan senyum-senyum favoritmu";
}

function showPinScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  const pinScreen = document.getElementById("pinScreen");
  loadingScreen.classList.remove("active");
  loadingScreen.setAttribute("aria-hidden", "true");
  pinScreen.classList.add("active");
  pinScreen.setAttribute("aria-hidden", "false");
  setTimeout(() => document.querySelector('[data-pin="1"]').focus(), 650);
}

function beginRomanticLoading() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loadingTimer = setInterval(() => {
    const ceiling = pageReady ? 100 : 92;
    const step = reducedMotion ? 24 : Math.max(1, (ceiling - loadingValue) * 0.09);
    updateLoading(Math.min(ceiling, loadingValue + step));
    if (loadingValue >= 100) {
      clearInterval(loadingTimer);
      setTimeout(showPinScreen, reducedMotion ? 120 : 480);
    }
  }, reducedMotion ? 45 : 90);

  window.addEventListener("load", () => { pageReady = true; }, { once: true });
  if (document.readyState === "complete") pageReady = true;
}

function renderPin() {
  document.querySelectorAll("#pinDots span").forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPin.length);
  });
}

function resetPin(message = "Coba ingat lagi, sayang ♡") {
  const card = document.querySelector(".pin-card");
  const feedback = document.getElementById("pinFeedback");
  feedback.textContent = message;
  feedback.classList.add("error");
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
  setTimeout(() => {
    enteredPin = "";
    renderPin();
    card.classList.remove("shake");
  }, 520);
}

function unlockOpening() {
  const opening = document.getElementById("openingExperience");
  const card = document.querySelector(".pin-card");
  const app = document.getElementById("app");
  document.getElementById("pinFeedback").textContent = "Benar. Selamat datang di cerita kita ♡";
  card.classList.add("unlocked");
  setTimeout(() => {
    document.body.classList.remove("intro-locked");
    app.setAttribute("aria-hidden", "false");
    app.classList.add("site-entering");
    opening.classList.add("leaving");
  }, 500);
  setTimeout(() => app.classList.remove("site-entering"), 1500);
  setTimeout(() => opening.remove(), 1350);
}

function submitPinDigit(digit) {
  if (enteredPin.length >= memoryPin.length) return;
  enteredPin += digit;
  document.getElementById("pinFeedback").classList.remove("error");
  renderPin();
  if (enteredPin.length === memoryPin.length) {
    setTimeout(() => enteredPin === memoryPin ? unlockOpening() : resetPin(), 220);
  }
}

document.querySelectorAll("[data-pin]").forEach(button => {
  button.addEventListener("click", () => submitPinDigit(button.dataset.pin));
});

document.getElementById("pinDelete").addEventListener("click", () => {
  enteredPin = enteredPin.slice(0, -1);
  document.getElementById("pinFeedback").textContent = "Format: DDMM";
  document.getElementById("pinFeedback").classList.remove("error");
  renderPin();
});

document.addEventListener("keydown", event => {
  if (!document.getElementById("pinScreen")?.classList.contains("active")) return;
  if (/^\d$/.test(event.key)) submitPinDigit(event.key);
  if (event.key === "Backspace" || event.key === "Delete") {
    enteredPin = enteredPin.slice(0, -1);
    renderPin();
  }
});

beginRomanticLoading();

backgroundMusic.addEventListener("error", () => {
  soundOn = false;
  pauseMusic();
  const soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    soundBtn.innerHTML = "<span>×</span> musik";
    soundBtn.setAttribute("aria-label", "Nyalakan musik");
  }
});

// Browser mencoba autoplay saat halaman dibuka. Jika diblokir,
// musik akan dimulai saat pengunjung menyentuh halaman untuk pertama kali.
async function startMusic() {
  if (!soundOn || !backgroundMusic.paused) return;
  try {
    await backgroundMusic.play();
  } catch (_) {
    // Autoplay diblokir; interaksi pertama akan mencoba lagi.
  }
}

function pauseMusic() {
  backgroundMusic.pause();
}

function showScene(name) {
  const app = document.getElementById("app");
  const incomingScene = document.getElementById(`${name}Scene`);
  document.querySelectorAll(".panel").forEach(panel => panel.classList.remove("active", "scene-entering"));
  app.className = `app scene-${name}`;
  void incomingScene.offsetWidth;
  incomingScene.classList.add("active", "scene-entering");
  clearTimeout(sceneTransitionTimer);
  sceneTransitionTimer = setTimeout(() => incomingScene.classList.remove("scene-entering"), 1100);
  if (name === "letter" && document.querySelector(".envelope-wrap").classList.contains("letter-open") && !document.getElementById("letterScene").classList.contains("ending")) {
    app.classList.add("letter-reading");
  }
  if (name === "gallery") {
    hideGalleryEnding();
    startGalleryTyping();
    renderMemory();
    updateGalleryEnding();
  }
  app.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "auto" });
}

function startGalleryTyping() {
  const message = "Cewek lucu kaya kamu harus bahagia terus!!";
  const text = document.getElementById("galleryTypingText");
  clearInterval(galleryTypingTimer);
  clearTimeout(galleryTypingFinishTimer);
  text.textContent = "";
  text.classList.remove("complete");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    text.textContent = message;
    text.classList.add("complete");
    return;
  }

  let characterIndex = 0;
  galleryTypingTimer = setInterval(() => {
    characterIndex += 1;
    text.textContent = message.slice(0, characterIndex);
    if (characterIndex === message.length) {
      clearInterval(galleryTypingTimer);
      galleryTypingFinishTimer = setTimeout(() => text.classList.add("complete"), 850);
    }
  }, 58);
}

function updateGalleryEnding() {
  const title = document.getElementById("galleryEndingTitle");
  const text = document.getElementById("galleryEndingText");
  const button = document.getElementById("openLetterAfterGallery");
  if (letterCompleted) {
    title.innerHTML = "Semua ceritanya sudah lengkap.<br><em>Satu kejutan lagi?</em>";
    text.textContent = "Kamu sudah melihat foto dan membaca semua kata yang kusimpan. Sekarang ada satu penutup kecil untukmu.";
    button.innerHTML = "Lihat kejutan terakhir <span>✦</span>";
  } else {
    title.innerHTML = "Buka suratnya<br>sekarang, <em>yuk?</em>";
    text.textContent = "Ada beberapa kata yang dari tadi menunggu untuk kamu baca.";
    button.innerHTML = "Buka suratnya <span>♡</span>";
  }
}

function hideGalleryEnding() {
  document.getElementById("galleryScene").classList.remove("ending");
}

function showLetterEnding() {
  letterCompleted = true;
  document.getElementById("app").classList.remove("letter-reading");
  const title = document.getElementById("letterEndingTitle");
  const text = document.getElementById("letterEndingText");
  const button = document.getElementById("continueAfterLetter");
  if (galleryCompleted) {
    title.innerHTML = "Semua ceritanya sudah lengkap.<br><em>Satu kejutan lagi?</em>";
    text.textContent = "Foto-fotonya sudah kamu lihat dan suratnya sudah kamu baca. Tinggal satu kejutan terakhir untukmu.";
    button.innerHTML = "Lihat kejutan terakhir <span>✦</span>";
  } else {
    title.innerHTML = "Lihat foto-foto kita<br>sekarang, <em>yuk?</em>";
    text.textContent = "Suratnya sudah selesai, tapi masih ada beberapa kenangan yang ingin aku tunjukkan.";
    button.innerHTML = "Buka galerinya <span>♡</span>";
  }
  document.getElementById("letterScene").classList.add("ending");
  chime("soft");
}

function hideLetterEnding() {
  document.getElementById("letterScene").classList.remove("ending");
}

function animateLetterEntrance() {
  const envelopeWrap = document.querySelector(".envelope-wrap");
  if (!envelopeWrap) return;
  envelopeWrap.classList.remove("letter-animate-in");
  void envelopeWrap.offsetWidth;
  envelopeWrap.classList.add("letter-animate-in");
  setTimeout(() => envelopeWrap.classList.remove("letter-animate-in"), 1400);
}

function showFinalSurprise() {
  chime("soft");
  const result = document.getElementById("calculatorResult");
  const percentage = document.getElementById("lovePercentage");
  const resultText = document.getElementById("loveResultText");
  const calculateButton = document.getElementById("calculateLoveBtn");
  const loveMeter = document.querySelector(".love-meter");
  const progressBar = document.getElementById("loveProgress");
  clearInterval(loveCalculationTimer);
  document.getElementById("confetti").innerHTML = "";
  result.classList.remove("calculating", "revealed");
  loveMeter.classList.remove("revealed");
  percentage.textContent = "?";
  resultText.textContent = "Tekan tombolnya untuk menghitung";
  document.getElementById("loveProgressFill").style.width = "0%";
  document.getElementById("loveProgressHeart").style.left = "0%";
  progressBar.setAttribute("aria-valuenow", "0");
  progressBar.removeAttribute("aria-valuetext");
  calculateButton.disabled = false;
  calculateButton.innerHTML = "<span>♡</span> Tap untuk kalkulasi";
  showScene("finale");
}

function chime(type = "soft") {
  if (!soundOn) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  const notes = type === "final" ? [392, 494, 587, 784] : [392, 523, 659];
  notes.forEach((frequency, index) => {
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0.045, audio.currentTime + index * 0.12);
    volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + index * 0.12 + 0.5);
    oscillator.connect(volume).connect(audio.destination);
    oscillator.start(audio.currentTime + index * 0.12);
    oscillator.stop(audio.currentTime + index * 0.12 + 0.55);
  });
  setTimeout(() => audio.close(), 1400);
}

function openGift() {
  const gift = document.getElementById("giftBtn");
  if (!gift || gift.classList.contains("opening")) return;
  giftReady = true;
  gift.classList.add("opening");
  chime();
  memoryIndex = 0;
  setTimeout(() => showScene("gallery"), 950);
}

function renderMemory() {
  const gallery = document.getElementById("memoryGallery");
  const orderedMemories = memories
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((first, second) => Number(first.item.orientation === "portrait") - Number(second.item.orientation === "portrait"));

  gallery.innerHTML = orderedMemories.map(({ item, originalIndex }, index) => `
    <article class="memory-item" style="--memory-delay:${index * 0.11}s">
      <button class="polaroid memory-open ${item.orientation}" type="button" data-open-memory="${originalIndex}" aria-label="Buka foto: ${item.title}">
        <div class="photo ${item.orientation}${item.fit === "cover" ? " fit-cover" : ""}" style="--photo-url:url('${item.src}')">
          <img src="${item.src}" alt="${item.title} — foto kenangan berdua" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" style="object-position:50% ${(item.focus ?? 0.5) * 100}%">
        </div>
        <div class="photo-caption"><span>${item.date}</span><b>${item.title}</b></div>
      </button>
      <div class="memory-actions">
        <button class="save-memory" type="button" data-save-memory="${originalIndex}"><span>↓</span> Simpan kenangan</button>
      </div>
    </article>
  `).join("");
  gallery.querySelectorAll("[data-save-memory]").forEach(button => {
    button.addEventListener("click", () => saveMemoryCard(Number(button.dataset.saveMemory), button));
  });
  gallery.querySelectorAll("[data-open-memory]").forEach(button => {
    button.addEventListener("click", () => openMemoryLightbox(Number(button.dataset.openMemory)));
  });
}

function openMemoryLightbox(index) {
  const item = memories[index];
  const lightbox = document.getElementById("memoryLightbox");
  const image = document.getElementById("lightboxImage");
  image.src = item.src;
  image.alt = `${item.title} — foto kenangan berdua`;
  image.style.objectPosition = `50% ${(item.focus ?? 0.5) * 100}%`;
  document.getElementById("lightboxDate").textContent = item.date;
  document.getElementById("lightboxTitle").textContent = item.title;
  lightbox.showModal();
}

function closeMemoryLightbox() {
  const lightbox = document.getElementById("memoryLightbox");
  if (lightbox.open) lightbox.close();
}

function readLetter() {
  const envelope = document.getElementById("envelope");
  const button = document.getElementById("letterBtn");
  const hint = document.getElementById("letterHint");
  if (letterStep === 0) {
    animateLetterEntrance();
    envelope.classList.add("opened");
    document.querySelector(".envelope-wrap").classList.add("letter-open");
    document.getElementById("app").classList.add("letter-reading");
    hint.textContent = "Baca pelan-pelan, ya...";
    button.classList.remove("waiting");
    envelope.setAttribute("aria-expanded", "true");
    envelope.setAttribute("tabindex", "-1");
    chime();
  }
  if (letterStep < letter.length) {
    const paragraph = document.createElement("p");
    paragraph.textContent = letter[letterStep];
    document.getElementById("letterBody").appendChild(paragraph);
    letterStep++;
    document.getElementById("letterProgress").style.width = `${letterStep / letter.length * 100}%`;
    button.innerHTML = letterStep < letter.length ? "Baca selanjutnya <span>↓</span>" : "Lanjutkan <span>→</span>";
    if (letterStep === letter.length) document.getElementById("signature").classList.add("show");
  } else {
    showLetterEnding();
  }
}

function playMusicInterlude() {
  const gate = document.getElementById("musicGate");
  const player = document.getElementById("musicPlayerLoading");
  const progress = document.getElementById("musicLoadingProgress");
  const timeline = document.querySelector(".music-timeline");
  const time = document.getElementById("musicLoadingTime");
  const status = document.getElementById("musicLoadingStatus");
  let value = 0;

  gate.classList.add("leaving");
  setTimeout(() => {
    gate.style.display = "none";
    player.setAttribute("aria-hidden", "false");
    player.classList.add("active");

    clearInterval(musicInterludeTimer);
    musicInterludeTimer = setInterval(() => {
      value = Math.min(100, value + 2);
      progress.style.width = `${value}%`;
      timeline.setAttribute("aria-valuenow", String(value));
      time.textContent = `0:0${Math.min(5, Math.floor(value / 20))}`;
      if (value >= 62) status.textContent = "sebentar lagi, sayang...";

      if (value >= 100) {
        clearInterval(musicInterludeTimer);
        status.textContent = "kenangannya sudah siap ♡";
        setTimeout(() => {
          player.classList.add("leaving");
          setTimeout(() => {
            player.style.display = "none";
            const content = document.getElementById("giftContent");
            content.classList.remove("waiting");
            content.classList.add("entering");
          }, 620);
        }, 650);
      }
    }, 90);
  }, 500);
}

function makeConfetti() {
  const holder = document.getElementById("confetti");
  holder.innerHTML = Array.from({ length: 30 }, (_, index) => `<i style="left:${index * 37 % 100}%;animation-delay:-${index * 0.23}s;animation-duration:${4 + index % 5 * 0.5}s">${index % 3 ? "♥" : "✦"}</i>`).join("");
}

function floatingHeart(x, y, glyph = "♡") {
  const heart = document.createElement("i");
  heart.className = "floating-heart";
  heart.textContent = glyph;
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1300);
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach(word => {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
}

function loadMemoryImage(source) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = source;
  });
}

async function saveMemoryCard(index = memoryIndex, triggerButton = null) {
  const item = memories[index];
  const palettes = [
    ["#dca7aa", "#7b3047"], ["#edc98b", "#ad5266"],
    ["#a9bba9", "#764359"], ["#df9ba7", "#67263b"],
    ["#f0ceb7", "#a14f63"], ["#925269", "#e7b890"],
    ["#b7aaa5", "#5b3445"], ["#d7b7ad", "#725063"]
  ];
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");

  const background = context.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, "#fffaf2");
  background.addColorStop(1, "#edcfd0");
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1350);

  context.fillStyle = "rgba(190,85,107,.10)";
  context.beginPath(); context.arc(90, 140, 210, 0, Math.PI * 2); context.fill();
  context.beginPath(); context.arc(1010, 1220, 260, 0, Math.PI * 2); context.fill();

  context.save();
  context.shadowColor = "rgba(77,28,44,.20)";
  context.shadowBlur = 45;
  context.shadowOffsetY = 20;
  drawRoundedRect(context, 70, 65, 940, 1220, 30);
  context.fillStyle = "#fffdf8";
  context.fill();
  context.restore();

  const photoGradient = context.createLinearGradient(105, 100, 975, 740);
  photoGradient.addColorStop(0, palettes[index][0]);
  photoGradient.addColorStop(1, palettes[index][1]);
  drawRoundedRect(context, 105, 100, 870, 650, 18);
  context.fillStyle = photoGradient;
  context.fill();
  const memoryPhoto = await loadMemoryImage(item.src);
  if (memoryPhoto) {
    const scale = item.fit === "cover"
      ? Math.max(870 / memoryPhoto.width, 650 / memoryPhoto.height)
      : Math.min(870 / memoryPhoto.width, 650 / memoryPhoto.height);
    const width = memoryPhoto.width * scale;
    const height = memoryPhoto.height * scale;
    const focus = item.focus ?? 0.5;
    context.save();
    drawRoundedRect(context, 105, 100, 870, 650, 18);
    context.clip();
    context.drawImage(memoryPhoto, 105 + (870 - width) / 2, 100 + (650 - height) * focus, width, height);
    context.restore();
  } else {
    context.fillStyle = "rgba(255,249,239,.9)";
    context.textAlign = "center";
    context.font = "140px Georgia";
    context.fillText("♡", 540, 410);
  }

  context.textAlign = "left";
  context.fillStyle = "#9a6672";
  context.font = "bold 17px Arial";
  context.fillText(item.date.toUpperCase(), 115, 810);
  context.fillStyle = "#4d1c2c";
  context.font = "italic 48px Georgia";
  drawWrappedText(context, item.title, 115, 880, 850, 58, 2);
  context.fillStyle = "#c98792";
  context.font = "100px Georgia";
  context.fillText("“", 105, 1025);
  context.fillStyle = "#5d454c";
  context.font = "italic 31px Georgia";
  drawWrappedText(context, item.note, 165, 1015, 735, 45, 3);

  context.fillStyle = "#8d5c67";
  context.font = "bold 15px Arial";
  context.fillText(`KENANGAN ${String(index + 1).padStart(2, "0")}`, 115, 1215);
  context.textAlign = "right";
  context.font = "italic 24px Georgia";
  context.fillText("Untuk Caca, dengan cinta ♡", 955, 1215);

  const link = document.createElement("a");
  link.download = `kenangan-caca-${String(index + 1).padStart(2, "0")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();

  const button = triggerButton;
  if (!button) return;
  button.classList.add("saved");
  button.innerHTML = "<span>✓</span> Tersimpan";
  setTimeout(() => {
    button.classList.remove("saved");
    button.innerHTML = "<span>↓</span> Simpan kenangan";
  }, 1800);
}

const relationshipStart = new Date(2025, 1, 27, 0, 0, 0);

function calculateTimeTogether() {
  const now = new Date();
  if (now < relationshipStart) return;
  const cursor = new Date(relationshipStart);
  let years = 0;
  let months = 0;

  while (true) {
    const next = new Date(cursor);
    next.setFullYear(next.getFullYear() + 1);
    if (next > now) break;
    cursor.setFullYear(cursor.getFullYear() + 1);
    years++;
  }

  while (true) {
    const next = new Date(cursor);
    next.setMonth(next.getMonth() + 1);
    if (next > now) break;
    cursor.setMonth(cursor.getMonth() + 1);
    months++;
  }

  const remaining = now - cursor;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor(remaining / 3600000) % 24;
  const minutes = Math.floor(remaining / 60000) % 60;
  const seconds = Math.floor(remaining / 1000) % 60;

  document.getElementById("yearsTogether").textContent = years;
  document.getElementById("monthsTogether").textContent = months;
  document.getElementById("daysTogether").textContent = days;
  document.getElementById("hoursTogether").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutesTogether").textContent = String(minutes).padStart(2, "0");
  document.getElementById("secondsTogether").textContent = String(seconds).padStart(2, "0");
}

document.getElementById("giftBtn").addEventListener("click", openGift);
document.getElementById("giftBtn").addEventListener("pointerdown", openGift);
document.getElementById("openHint").addEventListener("click", openGift);
document.getElementById("openHint").addEventListener("pointerdown", openGift);
document.getElementById("startMusicBtn").addEventListener("click", async () => {
  document.getElementById("startMusicBtn").disabled = true;
  soundOn = true;
  await startMusic();
  giftReady = true;
  document.getElementById("app").classList.remove("music-locked");
  const soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    soundBtn.innerHTML = "<span>♪</span> musik";
  }
  playMusicInterlude();
});
const homeBtn = document.getElementById("homeBtn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    if (giftReady) showScene("gallery");
  });
}
document.getElementById("galleryHomeBtn").addEventListener("click", () => {
  document.getElementById("restartBtn").click();
});
const memoryLightbox = document.getElementById("memoryLightbox");
document.getElementById("closeMemoryLightbox").addEventListener("click", closeMemoryLightbox);
memoryLightbox.addEventListener("click", event => {
  if (event.target === memoryLightbox) closeMemoryLightbox();
});
const soundBtn = document.getElementById("soundBtn");
if (soundBtn) {
  soundBtn.addEventListener("click", event => {
    soundOn = !soundOn;
    event.currentTarget.innerHTML = `<span>${soundOn ? "♪" : "×"}</span> musik`;
    event.currentTarget.setAttribute("aria-label", soundOn ? "Matikan musik" : "Nyalakan musik");
    if (soundOn) startMusic(); else pauseMusic();
  });
}
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => {
  chime();
  showScene(button.dataset.go);
}));
document.getElementById("openLetterAfterGallery").addEventListener("click", () => {
  galleryCompleted = true;
  if (letterCompleted) {
    showFinalSurprise();
  } else {
    chime("soft");
    showScene("letter");
  }
});
document.getElementById("continueAfterLetter").addEventListener("click", () => {
  if (galleryCompleted) {
    showFinalSurprise();
  } else {
    memoryIndex = 0;
    hideGalleryEnding();
    showScene("gallery");
  }
});
document.getElementById("rereadLetter").addEventListener("click", () => {
  hideLetterEnding();
  document.getElementById("app").classList.add("letter-reading");
});
const envelope = document.getElementById("envelope");
envelope.addEventListener("click", () => {
  if (letterStep === 0) readLetter();
});
envelope.addEventListener("keydown", event => {
  if (letterStep !== 0 || !["Enter", " "].includes(event.key)) return;
  event.preventDefault();
  readLetter();
});
document.getElementById("letterBtn").addEventListener("click", readLetter);
document.getElementById("calculateLoveBtn").addEventListener("click", event => {
  const button = event.currentTarget;
  if (button.disabled) return;

  const result = document.getElementById("calculatorResult");
  const percentage = document.getElementById("lovePercentage");
  const resultText = document.getElementById("loveResultText");
  const loveMeter = document.querySelector(".love-meter");
  const progressBar = document.getElementById("loveProgress");
  const progressFill = document.getElementById("loveProgressFill");
  const progressHeart = document.getElementById("loveProgressHeart");
  let progressValue = 0;

  button.disabled = true;
  button.innerHTML = "<span>♡</span> Menghitung cinta...";
  result.classList.add("calculating");
  resultText.textContent = "Mencocokkan dua hati...";
  percentage.textContent = "0%";

  loveCalculationTimer = setInterval(() => {
    progressValue = Math.min(100, progressValue + (progressValue < 72 ? 3 : 2));
    percentage.textContent = `${progressValue}%`;
    progressFill.style.width = `${progressValue}%`;
    progressHeart.style.left = `${progressValue}%`;
    progressBar.setAttribute("aria-valuenow", String(progressValue));

    if (progressValue >= 72) resultText.textContent = "Hampir sampai... cintanya terlalu besar";
    else if (progressValue >= 36) resultText.textContent = "Dua hati semakin terhubung...";

    if (progressValue === 100) {
      clearInterval(loveCalculationTimer);
      setTimeout(() => {
        result.classList.remove("calculating");
        result.classList.add("revealed");
        loveMeter.classList.add("revealed");
        percentage.textContent = "unlimited%";
        resultText.textContent = "Cinta Dzaky & Caca tidak ada batasnya ♡";
        progressBar.setAttribute("aria-valuetext", "unlimited persen");
        button.innerHTML = "<span>♥</span> Unlimited selamanya";
        chime("final");
        makeConfetti();
        for (let index = 0; index < 15; index++) {
          setTimeout(() => floatingHeart(innerWidth / 2 + (Math.random() - .5) * 260, innerHeight / 2 + (Math.random() - .5) * 100, index % 2 ? "♡" : "♥"), index * 45);
        }
      }, 420);
    }
  }, 380);
});
document.getElementById("restartBtn").addEventListener("click", () => {
  letterStep = 0;
  memoryIndex = 0;
  galleryCompleted = false;
  letterCompleted = false;
  document.getElementById("giftBtn").classList.remove("opening");
  document.getElementById("envelope").classList.remove("opened");
  document.querySelector(".envelope-wrap").classList.remove("letter-open");
  document.querySelector(".envelope-wrap").classList.remove("letter-animate-in");
  hideGalleryEnding();
  hideLetterEnding();
  document.getElementById("letterBody").innerHTML = "";
  document.getElementById("signature").classList.remove("show");
  document.getElementById("letterProgress").style.width = "0";
  document.getElementById("letterBtn").classList.add("waiting");
  document.getElementById("letterBtn").innerHTML = "Baca selanjutnya <span>↓</span>";
  document.getElementById("letterHint").textContent = "Ketuk amplopnya untuk membuka surat ♡";
  document.getElementById("envelope").setAttribute("aria-expanded", "false");
  document.getElementById("envelope").setAttribute("tabindex", "0");
  showScene("gift");
});
document.getElementById("app").addEventListener("pointerdown", event => {
  if (!event.target.closest("button")) floatingHeart(event.clientX, event.clientY, Math.random() > .5 ? "♡" : "✦");
});

renderMemory();
calculateTimeTogether();
setInterval(calculateTimeTogether, 1000);
