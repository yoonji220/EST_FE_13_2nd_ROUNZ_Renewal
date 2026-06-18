import { renderFooter } from "./modules/footer.js";
import { renderHeader } from "./modules/header.js";
import { renderFloatingBar } from "./modules/floating-bar.js";

document.body.classList.add("is-loading");

let product = {};
let quantityValue = 1;
let galleryIndex = 0;
let toastTimer;

let productImageSwiper;

renderHeader();
renderFooter(true);
renderFloatingBar();

// 가격을 원화 형식으로 변환
function formatWon(value) {
  return `₩${Number(value).toLocaleString("ko-KR")}`;
}

// 장바구니 저장용 상품 객체 생성
function makeCartProduct(product) {
  return {
    id: product.id,
    title: product.title,
    brand: product.brand,
    thumbnail: product.images.thumbnail,
    price: product.price.final,
  };
}

// 로컬스토리지에서 장바구니 데이터 읽기
function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("장바구니 데이터를 읽는 중 오류 발생", error);
    return [];
  }
}

// 로컬스토리지에 장바구니 데이터 저장
function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 헤더 장바구니 개수 업데이트
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  if (!cartCount) return;

  const cart = readCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  cartCount.textContent = total;
}

// 장바구니에 상품 추가
function addToCart(product, qty = 1) {
  if (!product) return;

  const cart = readCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      brand: product.brand,
      thumb: product.thumbnail,
      price: product.price,
      qty: qty,
    });
  }

  writeCart(cart);
  updateCartCount();
}

// 상품 id 기준으로 상세 데이터 조회
async function fetchProduct() {
  const params = new URLSearchParams(location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("잘못된 접근입니다. 상품 목록으로 이동합니다.");
    location.href = "./filters.html";
    return;
  }

  try {
    const productRes = await fetch("./data/products.json");
    const brandRes = await fetch("./data/brand.json");
    const colorMapRes = await fetch("./data/color-map.json");

    if (!productRes.ok || !brandRes.ok || !colorMapRes.ok) {
      throw new Error("데이터 파일을 불러오지 못했습니다.");
    }

    const productData = await productRes.json();
    const brandData = await brandRes.json();
    const colorMap = await colorMapRes.json();

    if (!productData.products || productData.products.length === 0) {
      throw new Error("상품 데이터가 비어 있습니다.");
    }

    product = productData.products.find(p => p.id === Number(productId));

    if (!product) {
      alert("존재하지 않는 상품입니다. 상품 목록으로 이동합니다.");
      location.href = "./product-list.html";
      return;
    }

    createContent(product, brandData);
    createColorOptions(product, productData.products, colorMap);
    createRecommendLists(productData.products, product.category, product.id);
    updateTotalPrice();

    document.body.classList.remove("is-loading");
    document.body.removeAttribute("aria-busy");
  } catch (error) {
    console.error(error);
    document.body.classList.remove("is-loading");
    document.body.removeAttribute("aria-busy");

    alert("상품 정보를 불러오지 못했습니다.");
  } finally {
    console.log("상품 상세 조회를 종료했습니다.");
    console.log(product);
  }
}

// 상품 상세 페이지 전체 콘텐츠 렌더링
function createContent(data, brandData) {
  createSummary(data);
  createGallery(data);
  createBrandContent(data, brandData);
  createDetailImages(data);
  createPointCards(data);
  createSizeGuide(data);
  createSheetContent(data);
  createToastContent(data);
  createReviews(data);
  createQna(data);
}

// 상품 요약 정보 렌더링
function createSummary(data) {
  const brand = document.querySelector(".product-brand");
  const title = document.querySelector(".product-title");
  const originPrice = document.querySelector(".price-row del");
  const discountRate = document.querySelector(".discount-rate");
  const finalPrice = document.querySelector(".price-row strong");
  const breadcrumbCurrent = document.querySelector(
    ".breadcrumb-list li[aria-current='page']",
  );

  if (brand) brand.textContent = data.brand;
  if (title) title.textContent = data.title;
  if (originPrice) originPrice.textContent = formatWon(data.price.original);
  if (discountRate) discountRate.textContent = `${data.price.discountRate}%`;
  if (finalPrice) finalPrice.textContent = formatWon(data.price.final);
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = data.brand;
}

function createGallery(data) {
  const imageWrapper = document.querySelector(".product-image-wrapper");
  const thumbList = document.querySelector(".product-thumb-list");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");

  const gallery =
    data.images.gallery?.length > 0
      ? data.images.gallery.slice(0, 4)
      : data.images.thumbnail
        ? [data.images.thumbnail]
        : [];

  if (gallery.length === 0) {
    if (imageWrapper) {
      imageWrapper.innerHTML = `
        <div class="swiper-slide">
          <div class="product-thumb-placeholder">
            <span class="typo-m-caption">이미지 준비중</span>
          </div>
        </div>
      `;
    }

    if (thumbList) {
      thumbList.innerHTML = `
        <li class="product-thumb-item product-thumb-placeholder">
          <span class="typo-m-caption">이미지 준비중</span>
        </li>
      `;
    }

    return;
  }

  if (imageWrapper) {
    imageWrapper.innerHTML = gallery
      .map(
        (image, index) => `
          <div class="swiper-slide">
            <img
              src="${image}"
              alt="${data.title} 상품 이미지 ${index + 1}"
              class="product-image"
            />
          </div>
        `,
      )
      .join("");
  }

  const thumbnailList = [...gallery];

  while (thumbnailList.length < 4) {
    thumbnailList.push(null);
  }

  if (thumbList) {
    thumbList.innerHTML = thumbnailList
      .map((image, index) => {
        if (!image) {
          return `
            <li class="product-thumb-item product-thumb-placeholder">
              <span class="typo-m-caption">이미지 준비중</span>
            </li>
          `;
        }

        return `
          <li class="product-thumb-item">
            <button
              type="button"
              class="product-thumb-button ${index === 0 ? "is-active" : ""}"
              aria-label="상품 이미지 ${index + 1} 보기"
              aria-current="${index === 0 ? "true" : "false"}"
              data-gallery-index="${index}">
              <img src="${image}" alt="" class="product-thumb-image" />
            </button>
          </li>
        `;
      })
      .join("");
  }

  if (productImageSwiper) {
    productImageSwiper.destroy(true, true);
  }

  productImageSwiper = new Swiper(".product-image-swiper", {
    direction: "horizontal",
    loop: true,
    speed: 300,
    navigation: {
      nextEl: ".carousel-next",
      prevEl: ".carousel-prev",
    },
    on: {
      slideChange: function () {
        galleryIndex = this.realIndex;
        updateGalleryThumb();
      },
    },
  });
  thumbList?.addEventListener("click", e => {
    const button = e.target.closest(".product-thumb-button");
    if (!button) return;

    galleryIndex = Number(button.dataset.galleryIndex);
    productImageSwiper?.slideToLoop(galleryIndex);
    updateGalleryThumb();
  });
}

function updateGalleryThumb() {
  const thumbButtons = document.querySelectorAll(".product-thumb-button");

  thumbButtons.forEach((button, index) => {
    const isActive = index === galleryIndex;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", String(isActive));
  });
}

// 브랜드 소개 영역 렌더링
function createBrandContent(data, brandData) {
  const brandImage = document.querySelector(".brand-feature-image");
  const brandTitle = document.querySelector(".brand-feature-title");
  const brandDesc = document.querySelector(".brand-feature-desc");

  const brand = brandData[data.brand];

  if (brandImage) {
    brandImage.src = brand?.image || "./img/brands_img/RAYBAN.webp";
    brandImage.alt = `${data.brand} 브랜드 이미지`;

    brandImage.onerror = () => {
      brandImage.src = "./img/rayban-brand.webp";
    };
  }

  if (brandTitle) brandTitle.textContent = brand?.title ?? data.brand;
  if (brandDesc) {
    brandDesc.textContent =
      brand?.description ?? "브랜드 소개 문구를 준비 중입니다.";
  }
}

// 상세 이미지 렌더링
function createDetailImages(data) {
  const detailImages = document.querySelectorAll(".detail-image");
  const imageUrls = data.images.gallery || [];

  detailImages.forEach((image, index) => {
    const imageUrl = imageUrls[index];

    if (!imageUrl) {
      image.closest(".detail-image-item")?.remove();
      return;
    }

    image.src = imageUrl;
    image.alt = `${data.title} 상세 이미지 ${index + 1}`;

    image.onerror = () => {
      image.onerror = null;
      image.closest(".detail-image-item")?.remove();
    };
  });
}

// 포인트 카드 이미지 렌더링
function createPointCards(data) {
  const pointImages = document.querySelectorAll(".point-image");

  const fallbackImages = [
    "./img/point/point_01.webp",
    "./img/point/point_02.webp",
  ];

  pointImages.forEach((image, index) => {
    image.src = fallbackImages[index];

    image.alt =
      index === 0
        ? `${data.title} 프레임 디테일 이미지`
        : `${data.title} 착용감 참고 이미지`;
  });
}

// 사이즈 가이드 이미지 렌더링
function createSizeGuide(data) {
  const sizeGuideImage = document.querySelector(".size-guide-image");

  if (!sizeGuideImage) return;

  const sizeGuideUrl = data.images?.sizeGuide;

  sizeGuideImage.src = sizeGuideUrl || "./img/SIZE.webp";
  sizeGuideImage.alt = `${data.title} 사이즈 가이드`;

  sizeGuideImage.onerror = () => {
    sizeGuideImage.onerror = null;
    sizeGuideImage.src = "./img/SIZE.webp";
  };
}

// 구매 바텀시트와 PC 구매패널 상품 정보 렌더링
function createSheetContent(data) {
  const sheetName = document.querySelector(".sheet-product-name");
  const sheetPrice = document.querySelector(".sheet-price");
  const pcName = document.querySelector(".pc-purchase-name");
  const pcPrice = document.querySelector(".pc-purchase-price");
  const miniPrice = document.querySelector(".pc-mini-price");
  const miniQty = document.querySelector(".pc-mini-qty");

  if (sheetName) sheetName.textContent = data.title;
  if (sheetPrice) sheetPrice.textContent = formatWon(data.price.final);

  if (pcName) pcName.textContent = data.title;
  if (pcPrice) pcPrice.textContent = formatWon(data.price.final);

  if (miniPrice) miniPrice.textContent = formatWon(data.price.final);
  if (miniQty) miniQty.textContent = `${quantityValue}개`;
}

// 장바구니 토스트 상품 정보
function createToastContent(data) {
  const toastThumb = document.querySelector(".cart-toast-thumb");
  const toastName = document.querySelector(".cart-toast-name");
  const toastPrice = document.querySelector(".cart-toast-price");

  if (toastThumb) {
    toastThumb.src = data.images.thumbnail;
    toastThumb.alt = data.title;
  }

  if (toastName) toastName.textContent = data.title;
  if (toastPrice) toastPrice.textContent = formatWon(data.price.final);
}

// 후기 개수, 목록, 더보기 버튼
function createReviews(data) {
  const reviewTab = document.querySelector("#tab-review");
  const reviewList = document.querySelector(".review-list");
  const reviewMoreButton = document.querySelector(".review-more-button");
  const ratingScore = document.querySelector(".rating-score strong");

  const reviews = data.reviews || [];
  const reviewCount = reviews.length;

  if (reviewTab) {
    reviewTab.textContent = `후기(${reviewCount})`;
  }

  if (ratingScore) {
    ratingScore.textContent = reviewCount > 0 ? "4.9" : "0.0";
  }

  if (!reviewList) return;

  if (reviewCount === 0) {
    reviewList.innerHTML = `
      <li>
        <article class="review-item d-flex flex-column g-1">
          <p class="review-content typo-m-body-s">
            등록된 후기가 없습니다.
          </p>
        </article>
      </li>
    `;

    if (reviewMoreButton) {
      reviewMoreButton.hidden = true;
    }

    return;
  }

  renderReviewItems(reviews.slice(0, 4));

  if (reviewMoreButton) {
    reviewMoreButton.hidden = reviewCount <= 4;
    reviewMoreButton.textContent = `후기 ${reviewCount}개 전체 보기`;

    reviewMoreButton.onclick = () => {
      renderReviewItems(reviews);
      reviewMoreButton.hidden = true;
    };
  }
}

// 후기 목록
function renderReviewItems(reviews) {
  const reviewList = document.querySelector(".review-list");

  if (!reviewList) return;

  const reviewHTML = reviews
    .map((review, index) => {
      const reviewerName = `user${index + 1}***`;
      const reviewerInitial = reviewerName.charAt(0).toUpperCase();
      const reviewDate = getReviewDate(review.image);

      return `
        <li>
          <article class="review-item d-flex flex-column g-1">
            <h3 class="sr-only">${reviewerName} 님의 후기</h3>

            <header class="review-header d-flex justify-content-between align-items-center">
              <div class="reviewer-info d-flex align-items-center g-1">
                <span class="reviewer-initial typo-m-header d-flex justify-content-center align-items-center">
                  ${reviewerInitial}
                </span>
                <span class="reviewer-name typo-m-body-s">${reviewerName}</span>
              </div>
               <time class="review-date typo-m-caption">
                  ${reviewDate}
              </time>
            </header>

            <div
              class="rating-stars d-flex"
              data-rating="5"
              role="img"
              aria-label="5점 만점에 5점">
              <span class="star typo-m-icons-xs-o">star</span>
              <span class="star typo-m-icons-xs-o">star</span>
              <span class="star typo-m-icons-xs-o">star</span>
              <span class="star typo-m-icons-xs-o">star</span>
              <span class="star typo-m-icons-xs-o">star</span>
            </div>

            <p class="review-content typo-m-body-s">
              ${review.content || review.title || "후기 내용이 없습니다."}
            </p>
          </article>
        </li>
      `;
    })
    .join("");

  reviewList.innerHTML = reviewHTML;
}

// 리뷰 이미지 경로에서 작성일 추출
function getReviewDate(imageUrl) {
  const match = imageUrl?.match(/review\/(\d{4})(\d{2})\/(\d{2})\//);

  if (!match) return "";

  const [, year, month, day] = match;

  return `${year}.${month}.${day}`;
}

// 상품 문의 개수, 목록, 더보기 버튼
function createQna(data) {
  const qnaTab = document.querySelector("#tab-qna");
  const qnaList = document.querySelector(".qna-list");
  const qnaMoreButton = document.querySelector(".qna-more-button");

  const qna = data.qna || [];
  const qnaCount = qna.length;

  if (qnaTab) {
    qnaTab.textContent = `문의(${qnaCount})`;
  }

  if (!qnaList) return;

  if (qnaCount === 0) {
    qnaList.innerHTML = `
      <li>
        <article class="qna-item d-flex flex-column g-1">
          <p class="answer-content typo-m-caption">
            등록된 상품 문의가 없습니다.
          </p>
        </article>
      </li>
    `;

    if (qnaMoreButton) {
      qnaMoreButton.hidden = true;
    }

    return;
  }

  renderQnaItems(qna.slice(0, 6));

  if (qnaMoreButton) {
    qnaMoreButton.hidden = qnaCount <= 6;
    qnaMoreButton.textContent = `문의 ${qnaCount}개 전체 보기`;

    qnaMoreButton.onclick = () => {
      renderQnaItems(qna);
      qnaMoreButton.hidden = true;
    };
  }
}

// 상품 문의 목록
function renderQnaItems(qna) {
  const qnaList = document.querySelector(".qna-list");

  if (!qnaList) return;

  const qnaHTML = qna
    .map(item => {
      const title = item.title || "상품 문의";
      const answer = item.answer || item.content || item.reply || "";
      const hasAnswer = Boolean(answer);

      return `
        <li>
          <article class="qna-item d-flex flex-column g-1">
            <div class="qna-question d-flex align-items-center g-2">
              <span class="status-badge typo-m-caption d-flex justify-content-center align-items-center">
                답변완료
              </span>

              <h3 class="qna-question-text typo-m-body-s">
                ${title}
              </h3>
            </div>

            <div class="answer-block d-flex align-items-center g-2">
              <span class="${hasAnswer ? "answer-label typo-m-header" : "answer-lock typo-m-icons-xs-o"}" aria-hidden="true">
              ${hasAnswer ? "A" : "lock"}
              </span>

              <p class="answer-content typo-m-caption">
                ${hasAnswer ? answer : "비밀 문의입니다."}
              </p>
            </div>
          </article>
        </li>
      `;
    })
    .join("");

  qnaList.innerHTML = qnaHTML;
}

// 같은 카테고리의 추천 상품
function createRecommendLists(all, category, id) {
  const recommendGrid = document.querySelector(".recommend-products-list");

  if (!recommendGrid) return;

  const recommendList = all
    .filter(p => p.category === category && p.id !== id)
    .slice(0, 8);

  if (recommendList.length === 0) {
    recommendGrid.innerHTML = `
      <li class="empty-message typo-m-body-s">
        추천 상품이 없습니다.
      </li>
    `;
    return;
  }

  const productHTML = recommendList
    .map(
      p => `
         <div class="recommend-products-item swiper-slide">
          <article class="product-card d-flex flex-column g-1">
            <div class="product-card-image-box">
              <a href="./product_detail.html?id=${p.id}">
                <img
                  src="${p.images.thumbnail}"
                  alt="${p.title}"
                  class="product-card-image" />
              </a>

              <button
                type="button"
                class="product-card-wish d-flex justify-content-center align-items-center"
                aria-label="${p.title} 관심상품 추가">
                <span class="typo-m-icons-s-o" aria-hidden="true"> favorite_border </span>
              </button>
            </div>

            <div class="product-card-info d-flex flex-column">
              <p class="product-card-brand typo-m-caption">${p.brand}</p>

              <h3 class="product-card-title typo-m-body">
                <a href="./product_detail.html?id=${p.id}">${p.title}</a>
              </h3>

              <div class="product-card-price-box">
                <strong class="product-card-price typo-m-header-s">
                  ${formatWon(p.price.final)}
                </strong>
              </div>
            </div>
          </article>
        </div>
      `,
    )
    .join("");

  recommendGrid.innerHTML = productHTML;

  new Swiper(".recommend-swiper", {
    slidesPerView: "auto",
    spaceBetween: 16,
    loop: true,
    speed: 300,
    navigation: {
      nextEl: ".recommend-carousel-next",
      prevEl: ".recommend-carousel-prev",
    },
  });
}

// 상품 상세 tab
const tabButtons = document.querySelectorAll(".product-tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach(btn => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", "false");
    });

    button.classList.add("is-active");
    button.setAttribute("aria-selected", "true");

    tabPanels.forEach(panel => {
      const isTarget = panel.dataset.panel === target;

      panel.hidden = !isTarget;
      panel.classList.toggle("is-active", isTarget);
    });

    const activePanel = document.querySelector(`[data-panel="${target}"]`);

    if (activePanel) {
      activePanel.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// 상품 수량 변경
const quantityControls = document.querySelectorAll("[data-quantity]");

quantityControls.forEach(control => {
  control.addEventListener("click", e => {
    const minusBtn = e.target.closest("[data-quantity-minus]");
    const plusBtn = e.target.closest("[data-quantity-plus]");

    if (!minusBtn && !plusBtn) return;

    if (minusBtn && quantityValue > 1) {
      quantityValue--;
    }

    if (plusBtn) {
      quantityValue++;
    }

    updateQuantity();
    updateTotalPrice();
  });
});

// 수량 표시 업데이트
function updateQuantity() {
  const quantityTexts = document.querySelectorAll("[data-quantity-value]");
  const miniQty = document.querySelector(".pc-mini-qty");

  quantityTexts.forEach(text => {
    text.textContent = quantityValue;
  });

  if (miniQty) {
    miniQty.textContent = `${quantityValue}개`;
  }
}

// 수량 따라 총 상품 금액 업데이트
function updateTotalPrice() {
  const totalPrices = document.querySelectorAll(
    ".product-total-price, .sheet-total-price, .pc-purchase-total-price, .pc-mini-price",
  );

  const total = product.price ? product.price.final * quantityValue : 0;

  totalPrices.forEach(price => {
    price.textContent = formatWon(total);
  });
}

/* 컬러 옵션 */
function getColorFromName(name = "", colorMap = {}) {
  const text = name.toLowerCase();

  const matchedKey = Object.keys(colorMap)
    .sort((a, b) => b.length - a.length)
    .find(key => text.includes(key.toLowerCase()));

  return matchedKey ? colorMap[matchedKey] : { name: "basic", hex: "#b8b8b8" };
}

function createColorOptions(data, allProducts, colorMap) {
  const colorOptions = document.querySelector(".color-options");
  const colorList = document.querySelector(".color-list");
  const selectedColor = document.querySelector("[data-selected-color]");

  if (!colorOptions || !colorList) return;

  const relatedProducts = allProducts.filter(item => {
    const isCurrent = item.id === data.id;

    const currentHasItem = (data.otherColors || []).some(
      color => color.sourceUrl === item.sourceUrl,
    );

    const itemHasCurrent = (item.otherColors || []).some(
      color => color.sourceUrl === data.sourceUrl,
    );

    return isCurrent || currentHasItem || itemHasCurrent;
  });

  const colorItems = relatedProducts.map(item => ({
    id: item.id,
    title: item.title,
    model: item.title,
    checked: item.id === data.id,
  }));
  const visibleColorItems = colorItems.filter(item => {
    const color = getColorFromName(item.model || item.title, colorMap);
    return item.checked || color.name !== "color";
  });

  colorOptions.hidden = false;
  const currentColor = getColorFromName(data.title, colorMap);

  if (selectedColor) {
    selectedColor.textContent = currentColor.name;
    // return matchedKey
    //   ? colorMap[matchedKey]
    //   : { name: "basic color", hex: "#b8b8b8" };
  }

  colorList.innerHTML = visibleColorItems
    .map(item => {
      const color = getColorFromName(item.model || item.title, colorMap);

      return `
        <li>
          <label class="color-chip d-flex align-items-center">
            <input
              type="radio"
              name="color"
              value="${item.id ?? ""}"
              ${item.checked ? "checked" : ""}
              ${item.id ? "" : "disabled"}
              aria-label="${item.model || item.title} 색상 선택"
            />
            <span
              class="color-dot"
              style="background-color: ${color.hex};"
              aria-hidden="true"
            ></span>
            <span class="sr-only">${color.name} 색상 선택</span>
          </label>
        </li>
      `;
    })
    .join("");

  colorList.addEventListener("change", e => {
    const input = e.target.closest("input[name='color']");
    if (!input || !input.value || Number(input.value) === data.id) return;

    location.href = `./product_detail.html?id=${input.value}`;
  });
}

/* Purchase Sheet */
const purchaseBarBuyButtons = document.querySelectorAll(".purchase-bar-buy");
const purchaseSheet = document.querySelector("[data-purchase-sheet]");
const purchaseSheetClose = document.querySelector(".sheet-close");
const purchaseSheetHandle = document.querySelector(".purchase-sheet-handle");
const purchaseBarHandle = document.querySelector(".purchase-bar-handle");

const pcPurchasePanel = document.querySelector(".pc-purchase-panel");
const pcPurchaseClose = document.querySelector(".pc-purchase-close");
const pcPurchaseMiniCard = document.querySelector(".pc-purchase-mini-card");

// 구매 바텀시트 열기
function openPurchaseSheet() {
  if (!purchaseSheet) return;

  purchaseSheet.classList.add("is-open");
  purchaseSheet.setAttribute("aria-hidden", "false");
}

// 구매 바텀 시트 닫기
function closePurchaseSheet() {
  if (!purchaseSheet) return;

  purchaseSheet.classList.remove("is-open");
  purchaseSheet.setAttribute("aria-hidden", "true");
}

purchaseBarBuyButtons.forEach(button => {
  button.addEventListener("click", openPurchaseSheet);
});

purchaseSheetClose?.addEventListener("click", closePurchaseSheet);
purchaseSheetHandle?.addEventListener("click", closePurchaseSheet);
purchaseBarHandle?.addEventListener("click", openPurchaseSheet);

// pc 구매패널 접기
function closePcPurchasePanel() {
  if (!pcPurchasePanel || !pcPurchaseMiniCard) return;

  pcPurchasePanel.hidden = true;
  pcPurchaseMiniCard.hidden = false;
}

// pc 구매 패널 다시 열기
function openPcPurchasePanel() {
  if (!pcPurchasePanel || !pcPurchaseMiniCard) return;

  pcPurchasePanel.hidden = false;
  pcPurchaseMiniCard.hidden = true;
}

pcPurchaseClose?.addEventListener("click", closePcPurchasePanel);
pcPurchaseMiniCard?.addEventListener("click", openPcPurchasePanel);

// 장바구니
const cartButtons = document.querySelectorAll(
  ".purchase-bar-cart, .sheet-cart",
);
const buyButtons = document.querySelectorAll(
  ".sheet-buy, .pc-purchase-panel .purchase-bar-buy, .product-purchase-actions .purchase-bar-buy",
);
cartButtons.forEach(button => {
  button.addEventListener("click", () => {
    addToCart(makeCartProduct(product), quantityValue);
    showToast();
  });
});

buyButtons.forEach(button => {
  button.addEventListener("click", () => {
    addToCart(makeCartProduct(product), quantityValue);
    location.href = "./cart.html";
  });
});

// 버튼
document.addEventListener("click", e => {
  const wishButton = e.target.closest(".wish-button, .product-card-wish");

  if (!wishButton) return;

  const icon = wishButton.querySelector("span");
  const isActive = wishButton.classList.toggle("is-active");

  wishButton.setAttribute("aria-pressed", String(isActive));
  wishButton.setAttribute(
    "aria-label",
    isActive ? "관심상품 제거" : "관심상품 추가",
  );

  if (icon) {
    const defaultClass = wishButton.classList.contains("product-card-wish")
      ? "typo-m-icons-s-o"
      : "typo-m-icons-l-o";

    icon.className = isActive ? "material-icons" : defaultClass;
    icon.textContent = isActive ? "favorite" : "favorite_border";
  }
});

// 장바구니 토스트
const cartToast = document.querySelector("[data-cart-toast]");
const toastClose = document.querySelector(".cart-toast-close");

function showToast() {
  if (!cartToast) return;

  cartToast.hidden = false;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    cartToast.hidden = true;
  }, 3000);
}

toastClose?.addEventListener("click", () => {
  if (!cartToast) return;

  cartToast.hidden = true;
  clearTimeout(toastTimer);
});

updateCartCount();
fetchProduct();
