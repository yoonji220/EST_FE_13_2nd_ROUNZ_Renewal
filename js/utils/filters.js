import { renderFooter } from "../../js/modules/footer.js";

(function () {
  const { escapeHtml, formatWon, renderList, setExclusiveActive } =
    window.ROUNZCommon;

  /* =========================
     상수 및 상태
  ========================= */
  const ITEMS_PER_PAGE = 8; // 한 번에 보여줄 상품 수
  const MAX_ITEMS = 16; // 최대 표시 가능 상품 수

  let allProducts = []; // 전체 상품 목록 (JSON에서 로드)
  let filteredProducts = []; // 필터/정렬 후 상품
  let currentPage = 1; // 현재 페이지 (더보기 클릭 시 증가)
  let currentCategory = "sunglasses"; // 현재 선택된 카테고리
  let currentSort = "신상품순"; // 현재 정렬 기준

  /* =========================
     DOM 요소
  ========================= */
  const filterPanel = document.getElementById("filter-panel");
  const sortToggle = document.getElementById("sort-toggle");
  const sortCurrent = document.getElementById("sort-current");
  const sortOptionsPanel = document.getElementById("sort-options");
  const productGrid = document.getElementById("product-grid");
  const productCountEl = document.querySelector(".content-count");
  const viewMoreBtn = document.getElementById("view-more-btn");
  const viewMoreWrap = document.getElementById("view-more-wrap");
  const scrollTopButton = document.getElementById("scroll-top");

  /* =========================
     데이터 로드 (products.json)
  ========================= */
  async function loadProducts() {
    try {
      const response = await fetch("./data/products.json");
      const data = await response.json();
      allProducts = data.products || [];
      applyFilters();
    } catch (error) {
      console.error("상품 데이터 로드 실패:", error);
      allProducts = [];
      applyFilters();
    }
  }

  /* =========================
     필터 및 정렬 적용
  ========================= */
  function applyFilters() {
    // 카테고리 필터 적용
    filteredProducts = allProducts.filter(product => {
      if (currentCategory === "sunglasses") {
        return product.category === "sunglasses";
      } else if (currentCategory === "glasses") {
        return (
          product.category === "glasses" ||
          product.category === "eyeglasses" ||
          product.category === ""
        );
      }
      return true;
    });

    // 정렬 적용
    sortProducts();

    // 페이지 초기화
    currentPage = 1;

    // 상품 수 업데이트
    updateProductCount();

    // 렌더링
    renderProducts();
    updateViewMoreButton();
  }

  function sortProducts() {
    switch (currentSort) {
      case "신상품순":
        filteredProducts.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate),
        );
        break;
      case "인기순":
        filteredProducts.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "낮은가격순":
        filteredProducts.sort((a, b) => a.price.final - b.price.final);
        break;
      case "높은가격순":
        filteredProducts.sort((a, b) => b.price.final - a.price.final);
        break;
    }
  }

  function updateProductCount() {
    if (productCountEl) {
      productCountEl.textContent = `${filteredProducts.length.toLocaleString()}개의 제품이 검색되었습니다`;
    }
  }

  /* =========================
     상품 렌더링
  ========================= */
  function renderProducts() {
    if (!productGrid) return;

    const visibleCount = Math.min(
      currentPage * ITEMS_PER_PAGE,
      MAX_ITEMS,
      filteredProducts.length,
    );
    const visibleProducts = filteredProducts.slice(0, visibleCount);

    productGrid.innerHTML = visibleProducts
      .map(product => {
        // 색상 스와치 생성 (otherColors 기반)
        const colors = ["black", "gray", "pink"]; // 기본 색상
        const colorMarkup = colors
          .map((color, index) => {
            const isSelected = index === 0;
            return `<span class="swatch ${escapeHtml(color)}${isSelected ? " selected" : ""}"></span>`;
          })
          .join("");

        // 할인 가격 표시
        const priceDisplay =
          product.price.discountRate > 0
            ? `<strong>${formatWon(product.price.final)}</strong>`
            : `<strong>${formatWon(product.price.final)}</strong>`;

        return `
        <article class="filter-product-card">
          <a href="product_detail.html" class="product-image">
            <img src="${escapeHtml(product.images.thumbnail)}" alt="${escapeHtml(product.title)}">
          </a>
          <div class="product-meta">
            <span class="brand-name">${escapeHtml(product.brand)}</span>
            <h2>${escapeHtml(product.title)}</h2>
            <div class="price-row">
              ${priceDisplay}
              <button class="favorite-btn" type="button" aria-label="찜하기" aria-pressed="false">
                <span class="material-symbols-outlined">favorite_border</span>
              </button>
            </div>
            <div class="color-swatches">
              ${colorMarkup}
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  }

  /* =========================
     더보기 버튼 업데이트
  ========================= */
  function updateViewMoreButton() {
    if (!viewMoreWrap || !viewMoreBtn) return;

    const visibleCount = currentPage * ITEMS_PER_PAGE;
    const maxReachable = Math.min(MAX_ITEMS, filteredProducts.length);

    if (visibleCount >= maxReachable) {
      viewMoreWrap.style.display = "none";
    } else {
      viewMoreWrap.style.display = "flex";
    }
  }

  /* =========================
     이벤트 바인딩
  ========================= */
  function bindEvents() {
    // 모바일 뷰 하단 푸터 렌더링
    document.addEventListener("DOMContentLoaded", () => {
      renderMoblieSubFooter(false);
    });

    // 종류 필터 버튼 클릭
    if (filterPanel) {
      filterPanel.addEventListener("click", event => {
        const button = event.target.closest("[data-filter-option]");
        if (!button) return;

        // 기존 선택 해제
        filterPanel.querySelectorAll("[data-filter-option]").forEach(btn => {
          btn.classList.remove("selected");
        });
        // 새 선택 활성화
        button.classList.add("selected");

        // 카테고리 업데이트
        currentCategory = button.dataset.category;
        applyFilters();
      });
    }

    // 정렬 토글
    sortToggle?.addEventListener("click", event => {
      event.stopPropagation();
      if (!sortOptionsPanel) return;

      const willOpen = Boolean(sortOptionsPanel.hidden);
      sortOptionsPanel.hidden = !willOpen;
      sortToggle.setAttribute("aria-expanded", String(willOpen));
    });

    // 정렬 옵션 선택
    sortOptionsPanel?.addEventListener("click", event => {
      const button = event.target.closest(".sort-option");
      if (!button) return;

      // 활성 상태 업데이트
      sortOptionsPanel.querySelectorAll(".sort-option").forEach(item => {
        item.classList.toggle("active", item === button);
      });

      // 정렬 기준 업데이트
      currentSort = button.textContent.trim();
      if (sortCurrent) {
        sortCurrent.textContent = currentSort;
      }
      sortOptionsPanel.hidden = true;
      sortToggle?.setAttribute("aria-expanded", "false");

      // 다시 필터/정렬 적용
      applyFilters();
    });

    // 외부 클릭 시 정렬 드롭다운 닫기
    document.addEventListener("click", event => {
      if (!sortOptionsPanel || !sortToggle) return;
      if (
        !sortToggle.contains(event.target) &&
        !sortOptionsPanel.contains(event.target)
      ) {
        sortOptionsPanel.hidden = true;
        sortToggle.setAttribute("aria-expanded", "false");
      }
    });

    // 더보기 버튼
    viewMoreBtn?.addEventListener("click", () => {
      currentPage++;
      renderProducts();
      updateViewMoreButton();
    });

    // 찜하기 버튼 (이벤트 위임)
    productGrid?.addEventListener("click", event => {
      const favoriteButton = event.target.closest(".favorite-btn");
      if (!favoriteButton) return;

      event.preventDefault();
      const icon = favoriteButton.querySelector(".material-symbols-outlined");
      const isActive = favoriteButton.classList.toggle("active");
      favoriteButton.setAttribute("aria-pressed", String(isActive));
      if (icon) {
        icon.textContent = isActive ? "favorite" : "favorite_border";
      }
    });

    // 맨 위로 스크롤
    scrollTopButton?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================
     초기화
  ========================= */
  bindEvents();
  loadProducts();
})();
