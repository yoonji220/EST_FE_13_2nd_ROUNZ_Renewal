import { renderFooter } from "../../js/modules/footer.js";
import { renderHeader } from "../../js/modules/header.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter(window.innerWidth < 1200);

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

  const selectAllCheckbox = document.getElementById("selectAll");
  const cartItemsSection = document.querySelector(".cart-items");
  const cartCount = document.getElementById("cart-count");
  const totalProductPrice = document.getElementById("total-product-price");
  const shippingPrice = document.getElementById("shipping-price");
  const totalPrice = document.getElementById("total-price");
  const footerTotal = document.getElementById("footer-total");
  const recommendationSlider = document.querySelector(".rec-slider");

  if (
    !selectAllCheckbox ||
    !cartItemsSection ||
    !cartCount ||
    !totalProductPrice ||
    !shippingPrice ||
    !totalPrice ||
    !recommendationSlider
  ) {
    return;
  }

  const STORAGE_KEY = "rounz-cart-items";

  /* =========================
     장바구니 데이터
  ========================= */
  let cartItems = [];

  /* =========================
     유틸리티 함수
  ========================= */
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatWon(value) {
    return `${new Intl.NumberFormat("ko-KR").format(Number(value) || 0)}원`;
  }

  function cloneCartItems(items) {
    return items.map(item => ({ ...item }));
  }

  /* =========================
     LocalStorage
  ========================= */
  function loadCartItems(allProducts) {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      if (!savedItems) return [];

      const parsedItems = JSON.parse(savedItems);
      if (!Array.isArray(parsedItems) || parsedItems.length === 0) return [];

      return parsedItems
        .map(savedItem => {
          const baseItem = allProducts.find(
            item => Number(item.id) === Number(savedItem.id)
          );

          if (!baseItem) return null;

          return {
            id: baseItem.id,
            brand: baseItem.brand,
            title: baseItem.title,
            option: "Free",
            price: baseItem.price.final || baseItem.price,
            image: baseItem.images.thumbnail,
            alt: baseItem.title,
            url: `https://rounz.com/product.php?productIndex=${baseItem.id}`,
            quantity: Math.max(1, Number(savedItem.qty) || Number(savedItem.quantity) || 1),
            selected: savedItem.selected !== false,
          };
        })
        .filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function saveCartItems() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            selected: item.selected !== false,
          })),
        ),
      );
    } catch (error) {
      // 저장이 막힌 환경은 무시합니다.
    }
  }

  /* =========================
     합계 계산
  ========================= */
  function getSelectedTotal() {
    return cartItems.reduce((sum, item) => {
      if (!item.selected) {
        return sum;
      }

      return sum + Number(item.price) * Number(item.quantity);
    }, 0);
  }

  function syncSelectAll() {
    const visibleCount = cartItems.length;
    const selectedCount = cartItems.filter(item => item.selected).length;

    selectAllCheckbox.checked =
      visibleCount > 0 && selectedCount === visibleCount;
    selectAllCheckbox.indeterminate =
      selectedCount > 0 && selectedCount < visibleCount;
  }

  function updateSummary() {
    const selectedTotal = getSelectedTotal();
    const shipping = selectedTotal > 0 && selectedTotal < 50000 ? 3000 : 0;
    const total = selectedTotal + shipping;

    const selectedCount = cartItems.filter(item => item.selected).length;
    const subtotalLabel = document.getElementById("subtotal-label");
    if (subtotalLabel) {
      subtotalLabel.textContent = `소계 (${selectedCount} 개)`;
    }

    cartCount.textContent = `(${cartItems.length})`;
    totalProductPrice.textContent = formatWon(selectedTotal);
    shippingPrice.textContent = shipping === 0 ? "무료" : formatWon(shipping);
    totalPrice.textContent = formatWon(total);
    if (footerTotal) footerTotal.textContent = formatWon(total);
  }

  /* =========================
     초기 데이터 로드 및 렌더링
  ========================= */
  async function initCart() {
    try {
      const response = await fetch("./data/products.json");
      const data = await response.json();
      const allProducts = data.products || [];

      // 1. 장바구니 리얼 데이터 매칭 및 렌더링
      cartItems = loadCartItems(allProducts);
      renderCartItems();

      // 2. 장바구니에 있는 상품 제외하고 10개 선택 (추천상품)
      const cartIds = cartItems.map(item => Number(item.id));
      const available = allProducts.filter(p => !cartIds.includes(p.id));

      // 좋아요 순으로 정렬 후 10개 선택
      const recommended = available
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 10);

      renderRecommendationItems(recommended);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      recommendationSlider.innerHTML = "<p>추천 상품을 불러올 수 없습니다.</p>";
      renderCartItems(); // 에러 발생 시에도 빈 장바구니 렌더링 시도
    }
  }

  function renderRecommendationItems(items) {
    recommendationSlider.innerHTML = items
      .map(
        item => `
          <article class="product-card" aria-labelledby="rec-title-${item.id}">
            <a class="card-img-wrapper" href="product_detail.html?id=${item.id}" aria-label="${escapeHtml(item.title)} 보기">
              <img src="${escapeHtml(item.images.thumbnail)}" alt="${escapeHtml(item.title)}">
              <button class="favorite-btn" type="button" aria-label="찜하기" aria-pressed="false">
                <span class="material-symbols-outlined">favorite_border</span>
              </button>
            </a>
            <div class="card-info">
              <span class="brand-name">${escapeHtml(item.brand)}</span>
              <h4 class="product-name" id="rec-title-${item.id}">${escapeHtml(item.title)}</h4>
              <strong class="product-price">${formatWon(item.price.final)}</strong>
            </div>
          </article>
        `,
      )
      .join("");
  }

  /* =========================
     빈 장바구니 상태
  ========================= */
  function renderEmptyState() {
    cartItemsSection.innerHTML = `
      <div class="cart-empty">
        <strong>장바구니가 비어 있습니다.</strong>
        <p>상품을 담으면 여기에서 바로 확인할 수 있습니다.</p>
      </div>
    `;
  }

  /* =========================
     장바구니 상품 렌더링
  ========================= */
  function renderCartItems() {
    if (cartItems.length === 0) {
      renderEmptyState();
      syncSelectAll();
      updateSummary();
      return;
    }

    cartItemsSection.innerHTML = cartItems
      .map(
        item => `
          <article class="cart-item" data-id="${escapeHtml(item.id)}" aria-labelledby="cart-title-${item.id}">

            <div class="cart-item-img">
              <label class="checkbox-label item-check">
                <input type="checkbox" class="item-checkbox" ${item.selected ? "checked" : ""}>
                <span class="checkmark"></span>
              </label>
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}">
            </div>

            <div class="cart-item-details">
              <div class="item-header">
                <span class="brand-name">${escapeHtml(item.brand)}</span>
                <button class="icon-btn close-btn" type="button" aria-label="상품 삭제">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <h3 class="product-name" id="cart-title-${item.id}">${escapeHtml(item.title)}</h3>
              <span class="product-price">${formatWon(item.price)}</span>

              <div class="quantity-control" role="group" aria-label="수량 조절">
                <button class="qty-btn minus" type="button" aria-label="수량 줄이기">
                  <span class="material-symbols-outlined">remove</span>
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn plus" type="button" aria-label="수량 늘리기">
                  <span class="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </article>
        `,
      )
      .join("");

    syncSelectAll();
    updateSummary();
  }

  /* =========================
     이벤트 핸들러
  ========================= */
  selectAllCheckbox.addEventListener("change", event => {
    const isChecked = event.target.checked;

    cartItems = cartItems.map(item => ({
      ...item,
      selected: isChecked,
    }));

    saveCartItems();
    renderCartItems();
  });

  cartItemsSection.addEventListener("change", event => {
    const checkbox = event.target.closest(".item-checkbox");
    if (!checkbox) {
      return;
    }

    const cartItem = checkbox.closest(".cart-item");
    if (!cartItem) {
      return;
    }

    const itemId = Number(cartItem.dataset.id);
    cartItems = cartItems.map(item =>
      Number(item.id) === itemId
        ? { ...item, selected: checkbox.checked }
        : item,
    );

    saveCartItems();
    syncSelectAll();
    updateSummary();
  });

  cartItemsSection.addEventListener("click", event => {
    const cartItem = event.target.closest(".cart-item");
    if (!cartItem) {
      return;
    }

    const itemId = Number(cartItem.dataset.id);
    const currentItem = cartItems.find(item => Number(item.id) === itemId);
    if (!currentItem) {
      return;
    }

    if (event.target.closest(".minus")) {
      currentItem.quantity = Math.max(1, Number(currentItem.quantity) - 1);
      saveCartItems();
      renderCartItems();
      return;
    }

    if (event.target.closest(".plus")) {
      currentItem.quantity = Number(currentItem.quantity) + 1;
      saveCartItems();
      renderCartItems();
      return;
    }

    if (event.target.closest(".close-btn")) {
      cartItems = cartItems.filter(item => Number(item.id) !== itemId);
      saveCartItems();
      renderCartItems();
    }
  });

  /* =========================
     추천 상품 찜하기 + 드래그 스크롤
  ========================= */
  recommendationSlider.addEventListener("click", event => {
    const favoriteButton = event.target.closest(".favorite-btn");
    if (!favoriteButton) {
      return;
    }

    event.preventDefault();
    const icon = favoriteButton.querySelector(".material-symbols-outlined");
    const isActive = favoriteButton.classList.toggle("active");

    favoriteButton.setAttribute("aria-pressed", String(isActive));
    if (icon) {
      icon.textContent = isActive ? "favorite" : "favorite_border";
    }
  });

  // 드래그 스크롤 (데스크탑)
  let isDraggingRecommendationSlider = false;
  let recommendationStartX = 0;
  let recommendationScrollLeft = 0;

  recommendationSlider.addEventListener("mousedown", event => {
    if (event.button !== 0 || event.target.closest(".favorite-btn")) {
      return;
    }

    isDraggingRecommendationSlider = true;
    recommendationStartX = event.pageX - recommendationSlider.offsetLeft;
    recommendationScrollLeft = recommendationSlider.scrollLeft;
    recommendationSlider.style.cursor = "grabbing";
  });

  recommendationSlider.addEventListener("mouseleave", () => {
    isDraggingRecommendationSlider = false;
    recommendationSlider.style.cursor = "grab";
  });

  recommendationSlider.addEventListener("mouseup", () => {
    isDraggingRecommendationSlider = false;
    recommendationSlider.style.cursor = "grab";
  });

  recommendationSlider.addEventListener("mousemove", event => {
    if (!isDraggingRecommendationSlider) {
      return;
    }

    event.preventDefault();
    const currentX = event.pageX - recommendationSlider.offsetLeft;
    const walk = (currentX - recommendationStartX) * 2;
    recommendationSlider.scrollLeft = recommendationScrollLeft - walk;
  });

  // 슬라이더 좌우 이동 버튼
  const prevBtn = document.querySelector(
    ".recommendations .slider-btn[aria-label='이전']",
  );
  const nextBtn = document.querySelector(
    ".recommendations .slider-btn[aria-label='다음']",
  );

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      recommendationSlider.scrollBy({ left: -300, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      recommendationSlider.scrollBy({ left: 300, behavior: "smooth" });
    });
  }

  /* =========================
     초기화
  ========================= */
  initCart();
});
