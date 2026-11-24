// 1. النجوم المتحركة والمضيئة في الخلفية
const canvas = document.getElementById("stars-canvas");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars() {
  const count = Math.min(140, Math.floor((window.innerWidth * window.innerHeight) / 9500));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2.1 + 0.6,
    speedX: (Math.random() - 0.5) * 0.45,
    speedY: (Math.random() - 0.5) * 0.45,
    alpha: Math.random() * 0.8 + 0.2,
    twinkleSpeed: Math.random() * 0.025 + 0.008,
    isRed: Math.random() > 0.65
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    star.x += star.speedX;
    star.y += star.speedY;
    star.alpha += star.twinkleSpeed;

    if (star.alpha <= 0.15 || star.alpha >= 1) {
      star.twinkleSpeed *= -1;
    }

    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.isRed
      ? `rgba(255, 45, 60, ${star.alpha})`
      : `rgba(255, 255, 255, ${star.alpha})`;
    ctx.shadowBlur = star.radius * 6;
    ctx.shadowColor = star.isRed ? "#ff1e2d" : "#ffffff";
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

resizeCanvas();
createStars();
drawStars();

window.addEventListener("resize", () => {
  resizeCanvas();
  createStars();
});

// 2. عداد الأرقام المتحرك
const statNumbers = document.querySelectorAll(".stat-number");
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  const triggerPoint = window.innerHeight * 0.88;
  const firstCard = document.querySelector(".stats-section");
  if (!firstCard || firstCard.getBoundingClientRect().top > triggerPoint) return;

  statsAnimated = true;
  statNumbers.forEach((el) => {
    const target = Number(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 60);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = `+${target}`;
        clearInterval(timer);
      } else {
        el.textContent = `+${current}`;
      }
    }, 24);
  });
}

window.addEventListener("scroll", animateStats);
window.addEventListener("load", animateStats);

// 3. تبديل الأسعار بين مصر وخارج مصر
const regionButtons = document.querySelectorAll(".region-btn");
let currentRegion = "eg";

function updatePrices(region) {
  currentRegion = region;
  document.querySelectorAll(".plan-price").forEach((priceBox) => {
    const mainSpan = priceBox.querySelector("span") || priceBox;
    const oldPriceEl = priceBox.querySelector(".old-price");

    if (priceBox.dataset[region]) {
      priceBox.textContent = priceBox.dataset[region];
    } else if (mainSpan && mainSpan.dataset[region]) {
      mainSpan.textContent = mainSpan.dataset[region];
      if (oldPriceEl && oldPriceEl.dataset[region]) {
        oldPriceEl.textContent = oldPriceEl.dataset[region];
      } else if (oldPriceEl) {
        oldPriceEl.textContent = "";
      }
    }
  });
}

regionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    regionButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updatePrices(btn.dataset.region);
  });
});

// 4. ربط طلب الباقات بالواتساب (01102008626)
document.querySelectorAll(".plan-order-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const planName = btn.dataset.plan;
    const regionLabel = currentRegion === "eg" ? "داخل مصر" : "خارج مصر";
    const msg = encodeURIComponent(
      `مرحبًا Bodanova، أرغب في الاشتراك في (${planName}) - ${regionLabel}`
    );
    window.open(`https://wa.me/201102008626?text=${msg}`, "_blank");
  });
});

// 5. ضمان تشغيل الفيديوهات تلقائياً وتحركها بسلاسة
function ensureVideosPlaying() {
  document.querySelectorAll("video.auto-motion-video").forEach((vid) => {
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.play().catch(() => {});
  });
}

window.addEventListener("load", ensureVideosPlaying);
document.addEventListener("click", ensureVideosPlaying, { once: true });

// 6. تصفية المعرض (الكل / الفيديوهات / الصور)
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filterValue = btn.dataset.filter;
    document.querySelectorAll("#media-grid .media-card").forEach((card) => {
      card.style.display =
        filterValue === "all" || card.dataset.type === filterValue ? "" : "none";
    });
  });
});

// 7. نافذة المعاينة المكبرة للفيديو بالصوت أو الصورة
const modal = document.getElementById("media-modal");
const modalBody = document.getElementById("modal-body");
const modalCaption = document.getElementById("modal-caption");
const closeModalBtn = document.getElementById("close-modal");

document.addEventListener("click", (e) => {
  const expandBtn = e.target.closest(".expand-btn");
  if (!expandBtn) return;

  const card = expandBtn.closest(".media-card");
  const title = card.querySelector("h4")?.textContent || "";
  const vid = card.querySelector("video");
  const img = card.querySelector("img");

  modalCaption.textContent = title;
  if (vid) {
    modalBody.innerHTML = `<video src="${vid.currentSrc || vid.src}" controls autoplay loop></video>`;
  } else if (img) {
    modalBody.innerHTML = `<img src="${img.currentSrc || img.src}" alt="${title}" />`;
  }
  modal.classList.add("open");
});

function closeMediaModal() {
  modal.classList.remove("open");
  modalBody.innerHTML = "";
}

closeModalBtn?.addEventListener("click", closeMediaModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeMediaModal();
});

// 8. إضافة تقييمات العملاء
const reviewForm = document.getElementById("review-form");
const reviewsList = document.getElementById("reviews-list");

reviewForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("reviewer-name").value.trim();
  const ratingCount = Number(document.getElementById("review-rating").value);
  const comment = document.getElementById("review-comment").value.trim();
  if (!name || !comment) return;

  const starsText = "⭐".repeat(ratingCount);
  const reviewCard = document.createElement("div");
  reviewCard.className = "review-card";
  reviewCard.innerHTML = `
    <div class="review-top">
      <strong>${name}</strong>
      <span>${starsText}</span>
    </div>
    <p>"${comment}"</p>
  `;

  reviewsList.prepend(reviewCard);
  reviewForm.reset();
});