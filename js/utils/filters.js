import { renderFooter } from "../../js/modules/footer.js";
import { renderHeader } from "../../js/modules/header.js";

(function () {
  const { escapeHtml, formatWon, renderList, setExclusiveActive } =
    window.ROUNZCommon;

  /* =========================
     상수 및 상태
  ========================= */
  const ITEMS_PER_PAGE = 8; // 한 번에 보여줄 상품 수

  let allProducts = []; // 전체 상품 목록 (JSON에서 로드)
  let filteredProducts = []; // 필터/정렬 후 상품
  let currentPage = 1; // 현재 페이지 (더보기 클릭 시 증가)
  
  // URL에서 초기 카테고리 읽기
  const urlParams = new URLSearchParams(window.location.search);
  const queryCategory = urlParams.get("category");
  let currentCategory = queryCategory === "glasses" || queryCategory === "sunglasses" ? queryCategory : "all";

  let currentSort = "신상품순"; // 현재 정렬 기준

  // 초기 로드 시 카테고리 버튼 상태 맞추기
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-filter-option]").forEach(btn => {
      if (btn.dataset.category === currentCategory) {
        btn.classList.add("selected");
      } else {
        btn.classList.remove("selected");
      }
    });
  });

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
  /* =========================
     선택된 태그 UI 렌더링
  ========================= */
  function updateSelectedTagsUI() {
    const selectedTagsContainer = document.querySelector('.selected-tags');
    const tagsList = document.querySelector('.tags-list');
    if (!selectedTagsContainer || !tagsList) return;

    const checkedBoxes = document.querySelectorAll('.filter-accordion input[type="checkbox"]:checked');
    
    if (checkedBoxes.length === 0) {
      selectedTagsContainer.style.display = 'none';
      tagsList.innerHTML = '';
      return;
    }

    selectedTagsContainer.style.display = 'block';
    
    tagsList.innerHTML = Array.from(checkedBoxes).map(cb => {
      const labelText = cb.parentElement.textContent.trim();
      return `
        <span class="tag">
          ${escapeHtml(labelText)}
          <button type="button" data-filter-name="${cb.name}" data-filter-value="${cb.value}">
            <span class="material-symbols-outlined">close</span>
          </button>
        </span>
      `;
    }).join("");

    // 태그 삭제 버튼 이벤트 연결
    tagsList.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-filter-name');
        const value = btn.getAttribute('data-filter-value');
        const checkbox = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (checkbox) {
          checkbox.checked = false;
          applyFilters();
        }
      });
    });
  }

  /* =========================
     필터 및 정렬 적용
  ========================= */
  function applyFilters() {
    // 사이드바 필터 상태 읽기
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const selectedFrames = Array.from(document.querySelectorAll('input[name="frameShape"]:checked')).map(cb => cb.value);
    const selectedMaterials = Array.from(document.querySelectorAll('input[name="material"]:checked')).map(cb => cb.value);
    const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(cb => cb.value);

    // 카테고리 및 속성 필터 적용
    filteredProducts = allProducts.filter(product => {
      // 1. 카테고리 확인 (데이터 오기재 대응 - 제목에 "안경테" 포함 시 안경으로 취급)
      const isGlassesTitle = (product.title || "").includes("안경테");

      if (currentCategory === "sunglasses") {
        if (product.category !== "sunglasses" || isGlassesTitle) return false;
      }
      if (currentCategory === "glasses") {
        const isGlassesCategory = product.category === "frame" || product.category === "glasses" || product.category === "eyeglasses" || product.category === "";
        if (!(isGlassesCategory || isGlassesTitle)) return false;
      }
      
      // 2. 브랜드 필터
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

      // 3. 프레임 형태 필터
      if (selectedFrames.length > 0 && !selectedFrames.includes(product["frame-shape"])) return false;

      // 4. 소재 필터 (이름에 포함되는지 검사 - OR)
      if (selectedMaterials.length > 0) {
        const title = product.title || "";
        const matchesMaterial = selectedMaterials.some(mat => title.includes(mat));
        if (!matchesMaterial) return false;
      }

      // 5. 가격 필터 (선택된 범위 중 하나라도 속하면 통과 - OR)
      if (selectedPrices.length > 0) {
        const price = product.price?.final || 0;
        const matchesPrice = selectedPrices.some(range => {
          const [min, max] = range.split('-').map(Number);
          return price >= min && price <= max;
        });
        if (!matchesPrice) return false;
      }

      return true;
    });

    // 정렬 적용
    sortProducts();

    // 태그 UI 업데이트
    updateSelectedTagsUI();

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
    <a href="./product_detail.html?id=${product.id}" class="product-image">
      <img src="${escapeHtml(product.images.thumbnail)}" alt="${escapeHtml(product.title)}">
    </a>
          <div class="product-meta">
            <span class="brand-name">${escapeHtml(product.brand)}</span>
            <h2><a href="./product_detail.html?id=${product.id}">${escapeHtml(product.title)}</a></h2>
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
    const maxReachable = filteredProducts.length;

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
    // 헤더, 하단 푸터 렌더링 및 모바일 반응형 처리
    document.addEventListener("DOMContentLoaded", () => {
      // 접근성을 위한 검색창 aria-label 동적 추가
      const searchInput = document.querySelector(".search-box input");
      if (searchInput) searchInput.setAttribute("aria-label", "모델명 또는 브랜드 검색");

      // 모바일 필터 연동 (sessionStorage)
      const savedStateStr = sessionStorage.getItem('mobileFilters');
      if (savedStateStr) {
        try {
          const savedState = JSON.parse(savedStateStr);
          
          // 체크박스 복원
          document.querySelectorAll('.filter-accordion input[type="checkbox"]').forEach(cb => {
            if (cb.name === 'brand' && savedState.brands?.includes(cb.value)) cb.checked = true;
            if (cb.name === 'frameShape' && savedState.shapes?.includes(cb.value)) cb.checked = true;
            if (cb.name === 'material' && savedState.materials?.includes(cb.value)) cb.checked = true;
            if (cb.name === 'price') {
              const maxPrice = savedState.priceMax !== undefined ? savedState.priceMax : 500000;
              const [min, max] = cb.value.split('-').map(Number);
              if (max <= maxPrice) cb.checked = true;
            }
          });
        } catch (e) {
          console.error("Failed to parse mobileFilters");
        }
        // 한 번 적용 후 세션 초기화 (계속 남아있으면 불편할 수 있음)
        sessionStorage.removeItem('mobileFilters');
      }

      // 헤더 렌더링
      renderHeader();

      // 초기 너비에 따라 렌더링
      renderFooter(window.innerWidth < 1200);

      // 리사이즈 시 클래스 동적 변경
      window.addEventListener("resize", () => {
        const footerContainer = document.querySelector(".footer .container");
        if (footerContainer) {
          if (window.innerWidth < 1200) {
            footerContainer.classList.remove("footer-main");
            footerContainer.classList.add("footer-simple");
          } else {
            footerContainer.classList.remove("footer-simple");
            footerContainer.classList.add("footer-main");
          }
        }
      });
    });

    // 사이드바 체크박스 이벤트 연결
    const filterAccordion = document.querySelector('.filter-accordion');
    if (filterAccordion) {
      filterAccordion.addEventListener('change', () => {
        applyFilters();
      });
    }

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

        // 카테고리 업데이트 및 URL 변경
        currentCategory = button.dataset.category;
        const newUrl = new URL(window.location);
        newUrl.searchParams.set("category", currentCategory);
        window.history.replaceState({}, "", newUrl);

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
      const icon = favoriteButton.querySelector("span");
      const isActive = favoriteButton.classList.toggle("active");
      favoriteButton.setAttribute("aria-pressed", String(isActive));

      if (icon) {
        icon.className = isActive ? "material-icons" : "material-symbols-outlined";
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
