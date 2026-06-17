import { renderFooter } from "./modules/footer.js";
import { renderHeader } from "./modules/header.js";

let product = {};
let quantityValue = 1;
let galleryIndex = 0;
let toastTimer;

renderHeader();
renderFooter(true);

function formatWon(value) {
  return `₩${Number(value).toLocaleString("ko-KR")}`;
}

function makeCartProduct(product) {
  return {
    id: product.id,
    title: product.title,
    brand: product.brand,
    thumbnail: product.images.thumbnail,
    price: product.price.final,
  };
}
// 임시 함수
function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("장바구니 데이터를 읽는 중 오류 발생", error);
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  if (!cartCount) return;

  const cart = readCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  cartCount.textContent = total;
}

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

export async function fetchProduct() {
  const params = new URLSearchParams(location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("잘못된 접근입니다. 상품 목록으로 이동합니다.");
    location.href = "./product-list.html";
    return;
  }

  try {
    const productRes = await fetch("./data/products.json");
    const brandRes = await fetch("./data/brand.json");

    if (!productRes.ok || !brandRes.ok) {
      throw new Error("데이터 파일을 불러오지 못했습니다.");
    }

    const productData = await productRes.json();
    const brandData = await brandRes.json();

    product = productData.products.find(p => p.id === Number(productId));

    if (!product) {
      alert("존재하지 않는 상품입니다. 상품 목록으로 이동합니다.");
      location.href = "./product-list.html";
      return;
    }

    createContent(product, brandData);
    createRecommendLists(productData.products, product.category, product.id);
    updateTotalPrice();
  } catch (error) {
    console.error(error);
    alert("상품 정보를 불러오지 못했습니다.");
  } finally {
    console.log("상품 상세 조회를 종료했습니다.");
    console.log(product);
  }
}

function createContent(data, brandData) {
  createSummary(data);
  createGallery(data);
  createBrandContent(data, brandData);
  createDetailImages(data);
  createPointCards(data);
  createSizeGuide(data);
  createSheetContent(data);
  createToastContent(data);
}

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
  const mainImage = document.querySelector(".product-image");
  const thumbList = document.querySelector(".product-thumb-list");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");

  const gallery = data.images.gallery?.length
    ? data.images.gallery
    : [data.images.thumbnail];

  if (mainImage) {
    mainImage.src = gallery[0];
    mainImage.alt = data.title;

    mainImage.onerror = () => {
      mainImage.src = data.images.thumbnail;
    };
  }

  if (thumbList) {
    const thumbHTML = gallery
      .slice(0, 4)
      .map(
        (image, index) => `
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
        `,
      )
      .join("");

    thumbList.innerHTML = thumbHTML;
  }

  thumbList?.addEventListener("click", e => {
    const button = e.target.closest(".product-thumb-button");
    if (!button) return;

    galleryIndex = Number(button.dataset.galleryIndex);
    changeGalleryImage(gallery, data.title);
  });

  prevBtn?.addEventListener("click", () => {
    galleryIndex = galleryIndex === 0 ? gallery.length - 1 : galleryIndex - 1;
    changeGalleryImage(gallery, data.title);
  });

  nextBtn?.addEventListener("click", () => {
    galleryIndex = galleryIndex === gallery.length - 1 ? 0 : galleryIndex + 1;
    changeGalleryImage(gallery, data.title);
  });
}

function changeGalleryImage(gallery, title) {
  const mainImage = document.querySelector(".product-image");
  const thumbButtons = document.querySelectorAll(".product-thumb-button");

  if (mainImage) {
    mainImage.src = gallery[galleryIndex];
    mainImage.alt = `${title} 상품 이미지 ${galleryIndex + 1}`;
  }

  thumbButtons.forEach((button, index) => {
    const isActive = index === galleryIndex;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", String(isActive));
  });
}

function createBrandContent(data, brandData) {
  const brandImage = document.querySelector(".brand-feature-image");
  const brandTitle = document.querySelector(".brand-feature-title");
  const brandDesc = document.querySelector(".brand-feature-desc");

  const brand = brandData[data.brand];

  if (brandImage) {
    brandImage.src = data.images.brand || "./img/rayban-brand.webp";
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

// function createDetailImages(data) {
//   const detailImages = document.querySelectorAll(".detail-image");
//   const imageUrls = data.images.detailImages || [];

//   detailImages.forEach((image, index) => {
//     const imageUrl = imageUrls[index];

//     if (!imageUrl) return;

//     image.src = imageUrl;
//     image.alt = `${data.title} 상세 이미지 ${index + 1}`;

//     image.onerror = () => {
//       image.src = "./img/detail-01.webp";
//     };
//   });
// }
function createDetailImages(data) {
  const detailImages = document.querySelectorAll(".detail-image");
  const imageUrls = data.images.detailImages || [];

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

// function createPointCards(data) {
//   const pointImages = document.querySelectorAll(".point-image");
//   const imageUrls = data.images.pointImages || [];
//   const fallbackImages = ["./img/point-01.webp", "./img/point-02.webp"];

//   pointImages.forEach((image, index) => {
//     image.src = imageUrls[index] || fallbackImages[index];
//     image.alt =
//       index === 0
//         ? `${data.title} 프레임 디테일 이미지`
//         : `${data.title} 착용감 참고 이미지`;

//     image.onerror = () => {
//       image.src = fallbackImages[index];
//     };
//   });
// }

function createPointCards(data) {
  const pointImages = document.querySelectorAll(".point-image");
  const imageUrls = data.images.pointImages || [];

  pointImages.forEach((image, index) => {
    if (!imageUrls[index]) return;

    image.src = imageUrls[index];
    image.alt =
      index === 0
        ? `${data.title} 프레임 디테일 이미지`
        : `${data.title} 착용감 참고 이미지`;
  });
}

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

function createSheetContent(data) {
  const sheetName = document.querySelector(".sheet-product-name");
  const sheetPrice = document.querySelector(".sheet-price");
  const pcName = document.querySelector(".pc-purchase-name");
  const pcPrice = document.querySelector(".pc-purchase-price");

  if (sheetName) sheetName.textContent = data.title;
  if (sheetPrice) sheetPrice.textContent = formatWon(data.price.final);

  if (pcName) pcName.textContent = data.title;
  if (pcPrice) pcPrice.textContent = formatWon(data.price.final);
}

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

function createRecommendLists(all, category, id) {
  const recommendList = all
    .filter(p => p.category === category && p.id !== id)
    .slice(0, 4);

  const recommendGrid = document.querySelector(".recommend-products-list");

  if (!recommendGrid) return;

  const productHTML = recommendList
    .map(
      p => `
        <li class="recommend-products-item">
          <article class="product-card d-flex flex-column g-1">
            <div class="product-card-image-box">
              <a href="./product-detail.html?id=${p.id}">
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
                <a href="./product-detail.html?id=${p.id}">${p.title}</a>
              </h3>

              <div class="product-card-price-box">
                <strong class="product-card-price typo-m-header-s">
                  ${formatWon(p.price.final)}
                </strong>
              </div>
            </div>
          </article>
        </li>
      `,
    )
    .join("");

  recommendGrid.innerHTML = productHTML;
}

/* 상품 상세 tab */
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
      if (panel.dataset.panel === target) {
        panel.hidden = false;
        panel.classList.add("is-active");
      } else {
        panel.hidden = true;
        panel.classList.remove("is-active");
      }
    });
  });
});

/* 상품 수량 변경 */
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

function updateQuantity() {
  const quantityTexts = document.querySelectorAll("[data-quantity-value]");

  quantityTexts.forEach(text => {
    text.textContent = quantityValue;
  });
}

function updateTotalPrice() {
  const totalPrices = document.querySelectorAll(
    ".product-total-price, .sheet-total-price, .pc-purchase-total-price",
  );

  const total = product.price ? product.price.final * quantityValue : 0;

  totalPrices.forEach(price => {
    price.textContent = formatWon(total);
  });
}

/* Purchase Sheet */
const purchaseBarBuyButtons = document.querySelectorAll(".purchase-bar-buy");
const purchaseSheet = document.querySelector("[data-purchase-sheet]");
const purchaseSheetClose = document.querySelector(".sheet-close");
const purchaseSheetHandle = document.querySelector(".purchase-sheet-handle");

function openPurchaseSheet() {
  if (!purchaseSheet) return;

  purchaseSheet.classList.add("is-open");
  purchaseSheet.setAttribute("aria-hidden", "false");
}

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

/* 장바구니 */
const cartButtons = document.querySelectorAll(
  ".purchase-bar-cart, .sheet-cart",
);

cartButtons.forEach(button => {
  button.addEventListener("click", () => {
    addToCart(makeCartProduct(product), quantityValue);
    showToast();
  });
});

/* 찜 버튼 */
document.addEventListener("click", e => {
  const wishButton = e.target.closest(".wish-button, .product-card-wish");

  if (!wishButton) return;

  const icon = wishButton.querySelector("span");
  const isActive = wishButton.classList.toggle("is-active");

  wishButton.setAttribute("aria-pressed", String(isActive));

  if (icon) {
    icon.textContent = isActive ? "favorite" : "favorite_border";
  }
});

/* Cart Toast */
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
