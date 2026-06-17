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

    // 초기 배경 및 텍스트 설정
    function initSlider() {
      const val = Number(priceSlider.value);
      priceDisplay.textContent = `${val.toLocaleString()}원+`;
      updateSliderBackground();
    }
    
    // ==================================
    // sessionStorage 상태 복원
    // ==================================
    const savedStateStr = sessionStorage.getItem('mobileFilters');
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        
        // 브랜드 복원
        brandButtons.forEach(btn => {
          if (savedState.brands && savedState.brands.includes(btn.dataset.value)) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        // 형태 복원
        shapeCards.forEach(card => {
          if (savedState.shapes && savedState.shapes.includes(card.dataset.value)) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });

        // 소재 복원
        materialButtons.forEach(btn => {
          if (savedState.materials && savedState.materials.includes(btn.dataset.value)) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        // 가격 복원
        if (savedState.priceMax !== undefined) {
          priceSlider.value = savedState.priceMax;
        }

      } catch (e) {
        console.error("Failed to parse mobileFilters from sessionStorage");
      }
    }
    
    initSlider();
  }

  /* =========================
     필터 적용 버튼
  ========================= */
  const applyBtn = document.getElementById('apply-mobile-filters');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const activeBrands = Array.from(document.querySelectorAll('.brand-btn.active')).map(b => b.dataset.value);
      const activeShapes = Array.from(document.querySelectorAll('.shape-card.active')).map(b => b.dataset.value);
      const activeMaterials = Array.from(document.querySelectorAll('.material-btn.active')).map(b => b.dataset.value);
      const priceMax = priceSlider ? Number(priceSlider.value) : 500000;

      const filterState = {
        brands: activeBrands,
        shapes: activeShapes,
        materials: activeMaterials,
        priceMax: priceMax
      };

      sessionStorage.setItem('mobileFilters', JSON.stringify(filterState));
      window.location.href = 'filters.html';
    });
  }

});
