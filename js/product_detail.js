// 임시 js - 코드 수정 필요
import { renderFooter } from "./modules/footer.js";
// import { renderHeader } from "./modules/header.js";

// renderHeader();
renderFooter(true);

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
const cartButtons = document.querySelectorAll(".purchase-bar-cart, .sheet-cart, .product-card-wish");
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
