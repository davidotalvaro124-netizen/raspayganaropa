document.addEventListener("DOMContentLoaded", () => {
  const emailForm = document.getElementById("email-form");
  const gameArea = document.getElementById("game-area");
  const userEmailInput = document.getElementById("user-email");
  
  const discountVal = document.getElementById("discount-val");
  const couponCode = document.getElementById("coupon-code");
  const claimBtn = document.getElementById("claim-btn");
  
  const canvas = document.getElementById("scratch-canvas");
  const ctx = canvas.getContext("2d");

  let isScratching = false;
  let revealedPixels = 0;

  // 1. Algoritmo de Selección de Premios (Control de Márgenes de Marketing)
  function getRandomPrize() {
    const rand = Math.random() * 100;
    if (rand < 50) return { discount: "10%", code: "FASHION10" };  // 50% probabilidad
    if (rand < 80) return { discount: "20%", code: "FASHION20" };  // 30% probabilidad
    if (rand < 95) return { discount: "40%", code: "FASHION40" };  // 15% probabilidad
    return { discount: "60%", code: "VIP60" };                     // 5% probabilidad (Hook)
  }

  // 2. Evento del Formulario
  emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = userEmailInput.value.trim();

    if (email) {
      // Asignar Premio
      const prize = getRandomPrize();
      discountVal.innerText = prize.discount;
      couponCode.innerText = prize.code;

      // Transición Visual
      emailForm.classList.add("hidden");
      gameArea.classList.remove("hidden");

      // Inicializar Canvas con la capa dorada
      initScratchLayer();
    }
  });

  // 3. Crear capa superficial para raspar
  function initScratchLayer() {
    // Fondo Dorado Elegante
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.5, '#FFF8DC');
    gradient.addColorStop(1, '#AA7C11');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto sobre el raspador
    ctx.fillStyle = "#333";
    ctx.font = "bold 16px Poppins";
    ctx.textAlign = "center";
    ctx.fillText("RASPA AQUÍ CON TU DEDO", canvas.width / 2, canvas.height / 2 + 5);
  }

  // 4. Lógica de Raspado (Mouse y Touch)
  function scratch(e) {
    if (!isScratching) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  }

  // 5. Revelar botón al raspar el 40% del área
  function checkScratchPercentage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
    
    if (percentage > 40) {
      canvas.style.transition = "opacity 0.5s";
      canvas.style.opacity = "0";
      setTimeout(() => {
        canvas.style.display = "none";
        claimBtn.classList.remove("hidden");
      }, 500);
    }
  }

  // Escuchadores de eventos Mouse/Touch
  canvas.addEventListener("mousedown", () => isScratching = true);
  canvas.addEventListener("mouseup", () => isScratching = false);
  canvas.addEventListener("mousemove", scratch);

  canvas.addEventListener("touchstart", () => isScratching = true);
  canvas.addEventListener("touchend", () => isScratching = false);
  canvas.addEventListener("touchmove", scratch);
});
