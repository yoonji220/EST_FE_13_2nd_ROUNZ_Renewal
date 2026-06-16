document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Brand 선택
  ========================= */
  const brandButtons = document.querySelectorAll(".brand-btn");

  brandButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  });

  /* =========================
     Shape Card 선택
  ========================= */
  const shapeCards = document.querySelectorAll(".shape-card");

  shapeCards.forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  });

  /* =========================
   Face Shape Toggle (이미지 변경 포함)
========================= */

  const faceShapeItems = document.querySelectorAll(".face-shape-item");

  faceShapeItems.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (!img) return;

      const defaultSrc = img.dataset.default;
      const activeSrc = img.dataset.active;

      const isActive = item.classList.toggle("active");

      img.src = isActive ? activeSrc : defaultSrc;
    });
  });

  /* =========================
     Material 선택
  ========================= */
  const materialButtons = document.querySelectorAll(".material-btn");

  materialButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  });

  /* =========================
     Price Range (단일 슬라이더)
  ========================= */
  const priceSlider = document.getElementById("priceRange");
  const priceDisplay = document.getElementById("priceDisplay");
  const pointColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-point-hover")
    .trim();

  if (priceSlider && priceDisplay) {
    // 슬라이더 배경 그라데이션 업데이트
    function updateSliderBackground() {
      const val = Number(priceSlider.value);
      const max = Number(priceSlider.max);
      const percent = (val / max) * 100;
      priceSlider.style.background = `linear-gradient(90deg, var(--color-point-hover) 0%, var(--color-point-hover) ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`;
    }

    priceSlider.addEventListener("input", () => {
      const val = Number(priceSlider.value);
      priceDisplay.textContent = `${val.toLocaleString()}원+`;
      updateSliderBackground();
    });

    // 초기 배경 설정
    updateSliderBackground();
  }
});
