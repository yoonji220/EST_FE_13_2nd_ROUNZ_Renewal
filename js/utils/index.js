document.addEventListener("DOMContentLoaded", () => {
  const bestList = document.querySelector("[data-best-list]");

  if (!bestList) return;

  const fallbackProducts = [
    {
      brand: "ROUNZ BASIC",
      title: "Essential Frame Model",
      sourceUrl: "#",
      imageUrl: "img/Main_brand_3.png",
      price: 129000,
    },
  ];

  initBestSection();

  async function initBestSection() {
    try {
      const response = await fetch("./data/products.json");
      if (!response.ok) throw new Error("Failed to load products.json");

      const data = await response.json();
      const products = getBestProducts(data.products).slice(0, 4);

      renderBestProducts(products.length ? products : fallbackProducts);
    } catch (error) {
      console.error(error);
      renderBestProducts(fallbackProducts);
    }
  }

  function getBestProducts(products = []) {
    return products
      .filter(product => product.brand && product.title && product.images?.thumbnail)
      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      .map(product => ({
        brand: product.brand,
        title: product.title,
        sourceUrl: product.sourceUrl || "#",
        imageUrl: product.images.thumbnail,
        price: product.price?.final || product.price?.original || 0,
      }));
  }

  function renderBestProducts(products) {
    bestList.innerHTML = products.map(createProductCard).join("");
  }

  function createProductCard(product) {
    const brand = escapeHtml(product.brand);
    const title = escapeHtml(product.title);
    const sourceUrl = escapeHtml(product.sourceUrl);
    const imageUrl = escapeHtml(product.imageUrl);
    const price = formatPrice(product.price);

    return `
      <li class="product-card g-1 d-flex flex-column">
        <a href="${sourceUrl}" class="product-card__image">
          <img src="${imageUrl}" alt="${title}" />
        </a>

        <div class="product-card-content g-1">
          <p class="product-card-brand typo-m-product-brand">${brand}</p>

          <h3 class="product-card-title typo-m-product-name">${title}</h3>

          <div class="product-card-price-row d-flex justify-content-between">
            <p class="product-card-price typo-m-product-price">${price}</p>

            <button type="button" class="product-card-wish typo-m-icons-s-o" aria-label="찜하기">
              favorite_border
            </button>
          </div>

          <ul class="product-card-colors d-flex">
            <li>
              <button type="button" class="piting-color black" aria-label="블랙"></button>
            </li>

            <li>
              <button type="button" class="piting-color gray" aria-label="그레이"></button>
            </li>
          </ul>
        </div>
      </li>
    `;
  }

  function formatPrice(price) {
    return `₩${Number(price || 0).toLocaleString("ko-KR")}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
