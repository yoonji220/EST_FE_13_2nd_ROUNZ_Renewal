// 임시 js - 코드 수정 필요
import { renderFooter } from "./modules/footer.js";
import { renderHeader } from "./modules/header.js";

renderHeader();
renderFooter(true);

/* Product Detail Test */
async function initProductDetail() {
  try {
    const params = new URLSearchParams(location.search);
    const productId = Number(params.get("id")) || 1;

    const [productRes, brandRes] = await Promise.all([
      fetch("./data/products.json"),
      fetch("./data/brand.json"),
    ]);

    if (!productRes.ok || !brandRes.ok) {
      throw new Error("데이터 파일을 불러오지 못했습니다.");
    }

    const productData = await productRes.json();
    const brandData = await brandRes.json();

    const product = productData.products.find(
      item => Number(item.id) === productId,
    );

    if (!product) {
      console.error(`id ${productId} 상품을 찾을 수 없습니다.`);
      return;
    }

    renderBrandContent(product, brandData);
    renderDetailImages(product);
    renderPointCards(product);
    renderSizeGuide(product);

    console.log(product);
  } catch (error) {
    console.error(error);
  }
}

function renderBrandContent(product, brandData) {
  const brandImage = document.querySelector(".brand-feature-image");
  const brandTitle = document.querySelector(".brand-feature-title");
  const brandDesc = document.querySelector(".brand-feature-desc");

  if (!brandImage || !brandTitle || !brandDesc) return;

  const brand = brandData[product.brand];

  brandImage.src = `./img/brands_img/${normalizeBrandImageName(product.brand)}.webp`;
  brandImage.alt = `${product.brand} 브랜드 이미지`;

  brandTitle.textContent = brand?.title ?? product.brand;
  brandDesc.textContent =
    brand?.description ?? "브랜드 소개 문구를 준비 중입니다.";
}

function renderDetailImages(product) {
  const detailImages = document.querySelectorAll(".detail-image");
  const imageUrls = product.images?.detailImages ?? [];

  detailImages.forEach((image, index) => {
    if (!imageUrls[index]) return;

    image.src = imageUrls[index];
    image.alt = `${product.title} 상세 이미지 ${index + 1}`;
  });
}

function renderPointCards(product) {
  const pointImages = document.querySelectorAll(".point-image");
  const imageUrls = product.images?.pointImages ?? [];

  pointImages.forEach((image, index) => {
    if (!imageUrls[index]) return;

    image.src = imageUrls[index];
    image.alt = `${product.title} 포인트 이미지 ${index + 1}`;
  });
}

function renderSizeGuide(product) {
  const sizeGuideImage = document.querySelector(".size-guide-image");

  if (!sizeGuideImage) return;

  sizeGuideImage.src = "./img/size.webp";
  sizeGuideImage.alt = `${product.title} 사이즈 가이드`;
}

function normalizeBrandImageName(brandName) {
  return brandName
    .replaceAll(" ", "")
    .replaceAll("-", "")
    .replaceAll(":", "")
    .toUpperCase();
}

initProductDetail();

function renderPointCards(product) {
  const pointImages = document.querySelectorAll(".point-image");
  const imageUrls = product.images?.pointImages ?? [];

  const fallbackImages = ["./img/point-01.webp", "./img/point-02.webp"];

  const altTexts = [
    `${product.title} 프레임 디테일 이미지`,
    `${product.title} 착용감 참고 이미지`,
  ];

  pointImages.forEach((image, index) => {
    image.src = imageUrls[index] || fallbackImages[index];
    image.alt = altTexts[index];

    image.onerror = () => {
      image.src = fallbackImages[index];
      image.alt = altTexts[index];
    };
  });
}

/* Tab UI */
const tabButtons = document.querySelectorAll(".product-tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach(btn => {
      const isActive = btn === button;

      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach(panel => {
      const isActive = panel.dataset.panel === target;

      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  });
});

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

/* Cart Toast */
const cartToast = document.querySelector("[data-cart-toast]");
const cartButtons = document.querySelectorAll(
  ".purchase-bar-cart, .sheet-cart, .product-card-wish",
);
const toastClose = document.querySelector(".cart-toast-close");

let toastTimer;

function showToast() {
  if (!cartToast) return;

  cartToast.hidden = false;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    cartToast.hidden = true;
  }, 3000);
}

cartButtons.forEach(button => {
  button.addEventListener("click", showToast);
});

toastClose?.addEventListener("click", () => {
  if (!cartToast) return;

  cartToast.hidden = true;
  clearTimeout(toastTimer);
});
