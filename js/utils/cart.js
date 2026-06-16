document.addEventListener("DOMContentLoaded", () => {
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
    !footerTotal ||
    !recommendationSlider
  ) {
    return;
  }

  const STORAGE_KEY = "rounz-cart-items";

  /* =========================
     장바구니 기본 데이터 (2개)
  ========================= */
  const defaultCartItems = [
    {
      id: 1,
      brand: "ROUNZ EYEWEAR",
      title: "Signature Bold Frame 01",
      option: "Black / Free",
      price: 150000,
      quantity: 1,
      selected: true,
      image:
        "https://image.rounz.com/_data/product/RAYBAN/RB3774D-003_87(55)/RB3774D-003_87(55)_03.JPG",
      alt: "Signature Bold Frame 01",
      url: "https://rounz.com/product.php?productIndex=3024878",
    },
    {
      id: 2,
      brand: "RECNZ EYEWEAR",
      title: "Clear Vision Acetate",
      option: "Brown / Free",
      price: 185000,
      quantity: 1,
      selected: true,
      image:
        "https://image.rounz.com/_data/product/RAYBAN/RB2489-1441_R5/RB2489-1441_R5_03.JPG",
      alt: "Clear Vision Acetate",
      url: "https://rounz.com/product.php?productIndex=3024875",
    },
  ];

  let cartItems = loadCartItems();

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
  function loadCartItems() {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      if (!savedItems) {
        return cloneCartItems(defaultCartItems);
      }

      const parsedItems = JSON.parse(savedItems);
      if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
        return cloneCartItems(defaultCartItems);
      }

      return parsedItems
        .map(savedItem => {
          const baseItem = defaultCartItems.find(
            item => Number(item.id) === Number(savedItem.id),
          );

          if (!baseItem) {
            return null;
          }

          return {
            ...baseItem,
            quantity: Math.max(1, Number(savedItem.quantity) || 1),
            selected: savedItem.selected !== false,
          };
        })
        .filter(Boolean);
    } catch (error) {
      return cloneCartItems(defaultCartItems);
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
            selected: item.selected,
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
    const shipping = selectedTotal > 0 ? 0 : 0;
    const total = selectedTotal + shipping;

    cartCount.textContent = `(${cartItems.length})`;
    totalProductPrice.textContent = formatWon(selectedTotal);
    shippingPrice.textContent = formatWon(shipping);
    totalPrice.textContent = formatWon(total);
    footerTotal.textContent = formatWon(total);
  }

  /* =========================
     추천 상품: products.json에서 10개 로드
  ========================= */
  async function loadRecommendationItems() {
    try {
      const response = await fetch("./data/products.json");
      const data = await response.json();
      const allProducts = data.products || [];

      // 장바구니에 있는 상품 제외하고 10개 선택
      const cartIds = cartItems.map(item => Number(item.id));
      const available = allProducts.filter(p => !cartIds.includes(p.id));

      // 좋아요 순으로 정렬 후 10개 선택
      const recommended = available
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 10);

      renderRecommendationItems(recommended);
    } catch (error) {
      console.error("추천 상품 로드 실패:", error);
      recommendationSlider.innerHTML = "<p>추천 상품을 불러올 수 없습니다.</p>";
    }
  }

  function renderRecommendationItems(items) {
    recommendationSlider.innerHTML = items
      .map(
        item => `
          <article class="product-card" aria-labelledby="rec-title-${item.id}">
            <a class="card-img-wrapper" href="${escapeHtml(item.sourceUrl)}" aria-label="${escapeHtml(item.title)} 보기">
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
            <label class="checkbox-label item-check">
              <input type="checkbox" class="item-checkbox" ${item.selected ? "checked" : ""}>
              <span class="checkmark"></span>
            </label>

            <div class="cart-item-img">
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

  /* =========================
     초기화
  ========================= */
  loadRecommendationItems();
  renderCartItems();
});
