/*
  index.html ?�용 ?�크립트
  - BEST ?�품/??��??products.json?�로 ?�더링하�??�세 ?�이지 ?�동???�결?�니??
  - 메인 ?�상, 가?�드 ?�라?�더, 공�?/?�벤???? 찜하�?UI�??�어?�니??
*/

document.addEventListener("DOMContentLoaded", () => {
  /* 초기 DOM 참조 �?공통 UI ?�행 */
  const bestList = document.querySelector("[data-best-list]");
  const bestRanking = document.querySelector("[data-best-ranking]");

  initHeroHeader();
  initHeroVideoSlider();
  initGuideSlider();
  initNoticeEvent();
  initWishlistButtons();
  const mainStoreSearchForm = document.querySelector(".store-search-form");
  const mainStoreSearchInput = document.querySelector(".store-search-input");
  initMainStoreSearch();

  initMainStoreSearch();

  if (!bestList) return;

  /* BEST ?�품 기본 ?�정 */
  const bestProductCount = 7;
  const bestRankingCount = 4;
  const bestTotalCount = bestProductCount + bestRankingCount;
  const fallbackProducts = Array.from({ length: bestTotalCount }, (_, index) => ({
    id: index + 1,
    brand: "ROUNZ BASIC",
    title: `Essential Frame Model ${index + 1}`,
    detailUrl: `./product_detail.html?id=${index + 1}`,
    imageUrl: "img/Main_brand_3.png",
    price: 129000,
  }));

  initBestSection();
  initBestDraggable();

  function initMainStoreSearch() {
    if (!mainStoreSearchForm || !mainStoreSearchInput) return;

    mainStoreSearchForm.addEventListener("submit", event => {
      event.preventDefault();

      const keyword = mainStoreSearchInput.value.trim();

      if (!keyword) {
        window.location.href = "./stores-location.html";
        return;
      }

      window.location.href = `./stores-location.html?keyword=${encodeURIComponent(keyword)}`;
    });
  }

  function initHeroHeader() {
    const header = document.querySelector(".header");
    const hero = document.querySelector(".hero-video");
    if (!header || !hero) return;

    let ticking = false;

  

    const requestSync = () => {
      if (ticking) return;

      ticking = true;
    };

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
  }

  async function initBestSection() {
    const productsSrc = bestList.dataset.productsSrc || "./data/products.json";
    const skeletonStartedAt = performance.now();
    renderBestSkeletons(bestProductCount);

    try {
      const response = await fetch(productsSrc);
      if (!response.ok) throw new Error("Failed to load products.json");

      const data = await response.json();
      const products = getBestProducts(data.products).slice(0, bestTotalCount);
      const displayProducts = products.length ? products : fallbackProducts;
      const productCardProducts = displayProducts.slice(0, bestProductCount);
      const rankingProducts = displayProducts.slice(bestProductCount, bestTotalCount);

      await waitForSkeleton(skeletonStartedAt);
      renderBestProducts(productCardProducts);
      renderBestRanking(rankingProducts);
    } catch (error) {
      console.error(error);
      const fallbackProductCards = fallbackProducts.slice(0, bestProductCount);
      const fallbackRankingProducts = fallbackProducts.slice(bestProductCount, bestTotalCount);

      await waitForSkeleton(skeletonStartedAt);
      renderBestProducts(fallbackProductCards);
      renderBestRanking(fallbackRankingProducts);
    }
  }

  /* BEST ?�품 ?�이??가�?*/
  function getBestProducts(products = []) {
    return products
      .filter(product => product.brand && product.title && product.images?.thumbnail)
      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      .map(product => ({
        id: product.id,
        brand: product.brand,
        title: product.title,
        detailUrl: getProductDetailUrl(product.id),
        imageUrl: product.images.thumbnail,
        price: product.price?.final || product.price?.original || 0,
      }));
  }

  /* BEST ?�품/??�� ?�더�?*/
  function renderBestProducts(products) {
    bestList.classList.remove("is-loading");
    bestList.setAttribute("aria-busy", "false");
    bestList.innerHTML = products.map(createProductCard).join("");
    syncWishlistButtons(bestList);
    bindProductCardLinks(bestList, ".product-card");
  }

  function renderBestRanking(products) {
    if (!bestRanking) return;

    bestRanking.setAttribute("aria-busy", "false");
    bestRanking.innerHTML = products.map(createBestRankingItem).join("");
    syncWishlistButtons(bestRanking);
    bindProductCardLinks(bestRanking, ".best-ranking-item");
  }

  function renderBestSkeletons(count) {
    bestList.classList.add("is-loading");
    bestList.setAttribute("aria-busy", "true");
    bestList.innerHTML = Array.from({ length: count }, createProductSkeletonCard).join("");
  }

  /* BEST ?�품 가�??�래�?*/
  function initBestDraggable() {
    let isPointerDown = false;
    let hasDragged = false;
    let startX = 0;
    let startScrollLeft = 0;
    const dragThreshold = 14;

    bestList.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;

      isPointerDown = true;
      hasDragged = false;
      startX = event.clientX;
      startScrollLeft = bestList.scrollLeft;
    });

    bestList.addEventListener("pointermove", event => {
      if (!isPointerDown) return;

      const dragDistance = event.clientX - startX;

      if (Math.abs(dragDistance) <= dragThreshold) return;

      hasDragged = true;
      bestList.classList.add("is-dragging");

      event.preventDefault();
      bestList.scrollLeft = startScrollLeft - dragDistance;
    });

    bestList.addEventListener("pointerup", () => {
      isPointerDown = false;

      setTimeout(() => {
        hasDragged = false;
      }, 0);

      bestList.classList.remove("is-dragging");
    });

    bestList.addEventListener(
      "click",
      event => {
        if (!hasDragged) return;

        event.preventDefault();
        event.stopPropagation();
      },
      true,
    );
  }

  function createProductSkeletonCard() {
    return `
      <li class="product-card product-card--skeleton g-1 d-flex flex-column" aria-hidden="true">
        <div class="product-card__image skeleton-block"></div>

        <div class="product-card-content g-1 d-flex flex-column justify-content-between">
          <div class="product-card-brand skeleton-block"></div>

          <div class="product-card-title skeleton-block"></div>

          <div class="product-card-price-row d-flex justify-content-between align-items-center">
            <div class="product-card-price skeleton-block"></div>

            <div class="product-card-wish skeleton-block"></div>
          </div>
        </div>
      </li>
    `;
  }

  function waitForSkeleton(startedAt, minDuration = 600) {
    const remainingTime = minDuration - (performance.now() - startedAt);
    if (remainingTime <= 0) return Promise.resolve();

    return new Promise(resolve => {
      window.setTimeout(resolve, remainingTime);
    });
  }

  function createProductCard(product) {
    const brand = escapeHtml(product.brand);
    const title = escapeHtml(product.title);
    const detailUrl = escapeHtml(product.detailUrl || getProductDetailUrl(product.id));
    const imageUrl = escapeHtml(product.imageUrl);
    const price = formatPrice(product.price);

    return `
      <li class="product-card d-flex flex-column" data-detail-url="${detailUrl}">
        <a href="${detailUrl}" class="product-card__image">
          <img src="${imageUrl}" alt="${title}" />
        </a>

        <div class="product-card-content d-flex flex-column justify-content-between">
          <p class="product-card-brand typo-m-product-brand">${brand}</p>

          <p class="product-card-title typo-m-product-name">
            <a href="${detailUrl}">${title}</a>
          </p>

          <div class="product-card-price-row d-flex justify-content-between align-items-center">
            <p class="product-card-price typo-m-product-price">${price}</p>

            <button type="button" class="product-card-wish typo-m-icons-s-o" aria-label="wishlist" aria-pressed="false">
              favorite_border
            </button>
          </div>
        </div>
      </li>
    `;
  }

  function createBestRankingItem(product) {
    const brand = escapeHtml(product.brand);
    const title = escapeHtml(product.title);
    const detailUrl = escapeHtml(product.detailUrl || getProductDetailUrl(product.id));
    const imageUrl = escapeHtml(product.imageUrl);
    const price = formatPrice(product.price);

    return `
      <li class="best-ranking-item d-flex align-items-center g-1" data-detail-url="${detailUrl}">
        <a href="${detailUrl}" class="best-ranking-image-link">
          <img src="${imageUrl}" alt="${title}" />
        </a>
        <div class="best-ranking-content d-flex flex-column justify-content-between">
          <p class="best-ranking-brand">${brand}</p>
          <p class="best-ranking-title">
            <a href="${detailUrl}">${title}</a>
          </p>
          <div class="best-ranking-price-row d-flex justify-content-between align-items-center">
            <span>${price}</span>
            <button type="button" class="best-ranking-wish typo-m-icons-s-o" aria-label="wishlist" aria-pressed="false">
              favorite_border
            </button>
          </div>
        </div>
      </li>
    `;
  }

  /* ?�품 ?�세 ?�동 �?찜하�?*/
  function getProductDetailUrl(productId) {
    return productId
      ? `./product_detail.html?id=${encodeURIComponent(productId)}`
      : "./product_detail.html";
  }

  function bindProductCardLinks(container, itemSelector) {
    // �??�품 ??��???�릭/?�보???�력???�세 ?�이지 ?�동?�로 ?�결?�니??
    // - ?�제 ?�릭 ?�?�이 링크??버튼?�면 기본 ?�작 ?�는 ?�른 ?�들?��? ?�선?�니??
    // - ?�동 주소????��??`data-detail-url`???�선 ?�용?�고, ?�으�??��? 링크??`href`�??�용?�니??
    container.querySelectorAll(itemSelector).forEach(item => {
      item.addEventListener("click", event => {
        // ?��? 링크??버튼???�른 경우 ?�기??추�? ?�동?��? ?�습?�다.
        if (event.target.closest("button")) return;

        const clickedLink = event.target.closest("a");
        if (clickedLink && isValidDestination(clickedLink.getAttribute("href"))) return;

        const destination = getDestinationFromElement(item);
        if (!isValidDestination(destination)) return;

        // ?�반 링크 ?�동�?같�? 방식?�로 ?�이지�??�동?�니??
        event.preventDefault();
        window.location.assign(destination);
      });

      // ?�근?�을 ?�해 Enter/Space ?�로???�품 ??��???????�게 ?�니??
      item.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        // Space ???�력 ???�이지 ?�크롤을 막습?�다.
        event.preventDefault();

        const destination = getDestinationFromElement(item);
        if (!isValidDestination(destination)) return;

        window.location.assign(destination);
      });
    });

  }

  // ?�세 ?�이지 ?�동 ?�틸
  // ?�소?�서 ?�동??URL??찾습?�다.
  // ?�선?�위: data-detail-url -> ?��? anchor[href]
  function getDestinationFromElement(el) {
    if (!el) return null;

    const dataUrl = el.dataset?.detailUrl;
    if (dataUrl) return String(dataUrl).trim();

    const anchor = el.querySelector && el.querySelector("a[href]");
    if (anchor) return String(anchor.getAttribute("href") || "").trim();

    return null;
  }

  // �?�? #, javascript: 같�? ?�못???�동 주소�?걸러?�니??
  function isValidDestination(url) {
    if (!url) return false;
    const trimmed = String(url).trim();
    if (!trimmed) return false;
    const lower = trimmed.toLowerCase();
    if (lower === "#" || lower.startsWith("javascript:")) return false;
    return true;
  }

  function initWishlistButtons() {
    syncWishlistButtons(document);

    document.addEventListener("click", event => {
      const wishButton = event.target.closest('button[class*="wish"]');
      if (!wishButton) return;

      event.preventDefault();
      event.stopPropagation();

      const isWished = wishButton.classList.toggle("is-wished");
      setWishlistButtonState(wishButton, isWished);
    });
  }

  function syncWishlistButtons(root) {
    root.querySelectorAll('button[class*="wish"]').forEach(button => {
      setWishlistButtonState(button, button.classList.contains("is-wished"));
    });
  }

  function setWishlistButtonState(button, isWished) {
    button.classList.toggle("is-wished", isWished);
    button.setAttribute("aria-pressed", String(isWished));
    button.textContent = isWished ? "favorite" : "favorite_border";
  }

  /* 공통 ?�맷/문자???�틸 */
  function formatPrice(price) {
    return `\u20a9${Number(price || 0).toLocaleString("ko-KR")}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* 메인 ?�어�??�상 ?�라?�더 */
  function initHeroVideoSlider() {
    const slider = document.querySelector("[data-hero-video-slider]");
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    const progress = slider.querySelector("[data-hero-progress]");
    const prevButton = slider.querySelector("[data-hero-prev]");
    const nextButton = slider.querySelector("[data-hero-next]");
    if (!slides.length || !progress) return;

    progress.innerHTML = slides
      .map(() => '<span class="hero-video-progress-item"><span class="hero-video-progress-fill"></span></span>')
      .join("");

    const progressFills = Array.from(progress.querySelectorAll(".hero-video-progress-fill"));

    const fallbackDuration = 5000;
    let activeIndex = 0;
    let timerId = null;
    let rafId = null;
    let slideStartedAt = 0;
    let pausedElapsed = 0;
    let isPaused = false;
    let dragStartX = 0;
    let isDragging = false;
    const desktopQuery = window.matchMedia("(min-width: 1200px)");
    const dragThreshold = 56;

    const resetVideo = video => {
      video.pause();
      video.currentTime = 0;
    };

    const stopActiveMedia = () => {
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(rafId);
      slides.forEach(slide => {
        const video = slide.querySelector("video");
        if (video) resetVideo(video);
      });
    };

    const getSlideDuration = slide => {
      const customDuration = Number(slide.dataset.duration);
      if (customDuration > 0) return customDuration;

      const video = slide.querySelector("video");
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        return video.duration * 1000;
      }

      return fallbackDuration;
    };

    const setProgress = value => {
      const clampedValue = Math.min(Math.max(value, 0), 100);
      progressFills.forEach((fill, index) => {
        if (index < activeIndex) {
          fill.style.width = "100%";
          return;
        }

        fill.style.width = index === activeIndex ? `${clampedValue}%` : "0%";
      });
    };

    const updateProgressByTime = duration => {
      if (isPaused) return;

      const elapsed = performance.now() - slideStartedAt;
      setProgress((elapsed / duration) * 100);

      if (elapsed < duration) {
        rafId = window.requestAnimationFrame(() => updateProgressByTime(duration));
      }
    };

    const updateProgressByVideo = video => {
      if (isPaused) return;

      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }

      rafId = window.requestAnimationFrame(() => updateProgressByVideo(video));
    };

    const showSlide = index => {
      isPaused = false;
      pausedElapsed = 0;
      stopActiveMedia();

      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });

      setProgress(0);

      const activeSlide = slides[activeIndex];
      const activeVideo = activeSlide.querySelector("video");

      if (activeVideo) {
        const playActiveVideo = () => {
          activeVideo
            .play()
            .then(() => {
              updateProgressByVideo(activeVideo);
            })
            .catch(() => {
              const duration = getSlideDuration(activeSlide);
              slideStartedAt = performance.now();
              updateProgressByTime(duration);
              timerId = window.setTimeout(() => showSlide(activeIndex + 1), duration);
            });
        };

        activeVideo.onended = () => showSlide(activeIndex + 1);

        if (activeVideo.readyState >= 1) {
          playActiveVideo();
          return;
        }

        activeVideo.onloadedmetadata = playActiveVideo;
        return;
      }

      const duration = getSlideDuration(activeSlide);
      slideStartedAt = performance.now();
      updateProgressByTime(duration);
      timerId = window.setTimeout(() => showSlide(activeIndex + 1), duration);
    };

    const goToSlide = index => {
      showSlide(index);

      if (desktopQuery.matches && slider.matches(":hover")) {
        pauseHero();
      }
    };

    const pauseHero = () => {
      if (isPaused) return;

      slider.classList.add("is-control-visible");

      const activeSlide = slides[activeIndex];
      const activeVideo = activeSlide.querySelector("video");

      isPaused = true;
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(rafId);

      if (activeVideo) {
        activeVideo.pause();
        return;
      }

      pausedElapsed = performance.now() - slideStartedAt;
    };

    const resumeHero = () => {
      if (!isPaused || document.hidden) return;

      slider.classList.remove("is-control-visible");

      const activeSlide = slides[activeIndex];
      const activeVideo = activeSlide.querySelector("video");

      isPaused = false;

      if (activeVideo) {
        activeVideo
          .play()
          .then(() => {
            updateProgressByVideo(activeVideo);
          })
          .catch(() => {
            const duration = getSlideDuration(activeSlide);
            pausedElapsed = activeVideo.duration > 0 ? activeVideo.currentTime * 1000 : pausedElapsed;
            slideStartedAt = performance.now() - pausedElapsed;
            updateProgressByTime(duration);
            timerId = window.setTimeout(() => showSlide(activeIndex + 1), Math.max(duration - pausedElapsed, 0));
          });
        return;
      }

      const duration = getSlideDuration(activeSlide);
      slideStartedAt = performance.now() - pausedElapsed;
      updateProgressByTime(duration);
      timerId = window.setTimeout(() => showSlide(activeIndex + 1), Math.max(duration - pausedElapsed, 0));
    };

    slider.addEventListener("mouseenter", pauseHero);
    slider.addEventListener("mouseleave", resumeHero);

    prevButton?.addEventListener("click", () => {
      goToSlide(activeIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
      goToSlide(activeIndex + 1);
    });

    slider.addEventListener("pointerdown", event => {
      if (desktopQuery.matches) return;

      isDragging = true;
      dragStartX = event.clientX;
      pauseHero();
      slider.setPointerCapture?.(event.pointerId);
    });

    slider.addEventListener("pointerup", event => {
      if (!isDragging) return;

      isDragging = false;
      const dragDistance = event.clientX - dragStartX;
      slider.releasePointerCapture?.(event.pointerId);

      if (Math.abs(dragDistance) >= dragThreshold) {
        showSlide(activeIndex + (dragDistance < 0 ? 1 : -1));
        return;
      }

      resumeHero();
    });

    slider.addEventListener("pointercancel", () => {
      if (!isDragging) return;

      isDragging = false;
      resumeHero();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopActiveMedia();
        return;
      }

      showSlide(activeIndex);
    });

    showSlide(0);
  }

  /* 가?�드 카드 ?�라?�더 */
  function initGuideSlider() {
    const slider = document.querySelector(".guide-slider");
    if (!slider) return;

    const cards = Array.from(slider.querySelectorAll(".guide-card"));
    const mobileQuery = window.matchMedia("(max-width: 1199px)");
    const autoplayDelay = 3000;
    let activeIndex = 0;
    let autoplayId = null;
    let scrollEndId = null;
    let isPaused = false;

    slider.setAttribute("aria-roledescription", "carousel");

    const isMobile = () => mobileQuery.matches && cards.length > 1;

    const getSlideLeft = index => {
      const card = cards[index];
      if (!card) return 0;

      return card.offsetLeft - slider.offsetLeft - (slider.clientWidth - card.offsetWidth) / 2;
    };

    const goToSlide = index => {
      if (!isMobile()) return;

      activeIndex = (index + cards.length) % cards.length;
      slider.scrollTo({
        left: getSlideLeft(activeIndex),
        behavior: "smooth",
      });
    };

    const stopAutoplay = () => {
      if (!autoplayId) return;
      window.clearInterval(autoplayId);
      autoplayId = null;
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (!isMobile() || isPaused) return;

      autoplayId = window.setInterval(() => {
        goToSlide(activeIndex + 1);
      }, autoplayDelay);
    };

    const pauseAutoplay = () => {
      isPaused = true;
      stopAutoplay();
    };

    const resumeAutoplay = () => {
      isPaused = false;
      startAutoplay();
    };

    const syncIndexFromScroll = () => {
      if (!isMobile()) return;
      activeIndex = cards.reduce((closestIndex, card, index) => {
        const closestDistance = Math.abs(slider.scrollLeft - getSlideLeft(closestIndex));
        const cardDistance = Math.abs(slider.scrollLeft - getSlideLeft(index));
        return cardDistance < closestDistance ? index : closestIndex;
      }, 0);
    };

    const handleScroll = () => {
      window.clearTimeout(scrollEndId);
      scrollEndId = window.setTimeout(syncIndexFromScroll, 120);
    };

    const handleModeChange = () => {
      if (isMobile()) {
        slider.scrollTo({ left: getSlideLeft(activeIndex), behavior: "auto" });
        startAutoplay();
        return;
      }

      stopAutoplay();
      activeIndex = 0;
      slider.scrollTo({ left: 0, behavior: "auto" });
    };

    slider.addEventListener("mouseenter", pauseAutoplay);
    slider.addEventListener("mouseleave", resumeAutoplay);
    slider.addEventListener("focusin", pauseAutoplay);
    slider.addEventListener("focusout", resumeAutoplay);
    slider.addEventListener("touchstart", pauseAutoplay, { passive: true });
    slider.addEventListener("touchend", resumeAutoplay);
    slider.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleModeChange);

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleModeChange);
    } else {
      mobileQuery.addListener(handleModeChange);
    }

    handleModeChange();
  }

  /* 공�?/?�벤????�??�코?�언 */
  function initNoticeEvent() {
    const section = document.querySelector(".notice-event");
    if (!section) return;

    const tabButtons = Array.from(section.querySelectorAll(".tab-btn"));
    const tabPanels = Array.from(section.querySelectorAll(".tab-panel"));
    const accordionItems = Array.from(section.querySelectorAll(".accordion-item"));
    const tabTrack = section.querySelector("[data-tab-track]");

    const moveTabTrack = activeIndex => {
      if (!tabTrack) return;
      tabTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
    };

    tabButtons.forEach(button => {
      const tabName = button.dataset.tab;
      const panel = section.querySelector(`#${tabName}-panel`);

      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", button.classList.contains("active") ? "true" : "false");

      if (panel) {
        button.setAttribute("aria-controls", panel.id);
        panel.setAttribute("role", "tabpanel");
      }

      button.addEventListener("click", () => {
        const activeIndex = tabButtons.indexOf(button);

        tabButtons.forEach(tabButton => {
          const isActive = tabButton === button;
          tabButton.classList.toggle("active", isActive);
          tabButton.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        tabPanels.forEach(tabPanel => {
          const isActive = tabPanel.id === `${tabName}-panel`;
          tabPanel.classList.toggle("active", isActive);
          tabPanel.setAttribute("aria-hidden", isActive ? "false" : "true");
        });

        moveTabTrack(activeIndex);
      });
    });

    tabPanels.forEach((panel, index) => {
      const isActive = panel.classList.contains("active");
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
      if (isActive) moveTabTrack(index);
    });

    accordionItems.forEach((item, index) => {
      const header = item.querySelector(".accordion-header");
      const content = item.querySelector(".accordion-content");
      if (!header || !content) return;

      const contentId = content.id || `notice-event-content-${index + 1}`;
      content.id = contentId;
      header.setAttribute("role", "button");
      header.setAttribute("tabindex", "0");
      header.setAttribute("aria-controls", contentId);
      header.setAttribute("aria-expanded", item.classList.contains("active") ? "true" : "false");

      const toggleItem = () => {
        const panel = item.closest(".tab-panel");
        const panelItems = Array.from(panel?.querySelectorAll(".accordion-item") || []);
        const willOpen = !item.classList.contains("active");

        panelItems.forEach(panelItem => {
          panelItem.classList.remove("active");
          panelItem.querySelector(".accordion-header")?.setAttribute("aria-expanded", "false");
        });

        if (willOpen) {
          item.classList.add("active");
          header.setAttribute("aria-expanded", "true");
        }
      };

      header.addEventListener("click", toggleItem);
      header.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        toggleItem();
      });
    });
  }
  /* BEST 상품 카드 마크업 */
  function createProductCardLegacy(product) {
    const brand = escapeHtml(product.brand);
    const title = escapeHtml(product.title);
    const detailUrl = escapeHtml(product.detailUrl || getProductDetailUrl(product.id));
    const imageUrl = escapeHtml(product.imageUrl);
    const price = formatPrice(product.price);

    return `
      <li class="product-card g-1 d-flex flex-column">
        <a href="${detailUrl}" class="product-card__image">
          <img src="${imageUrl}" alt="${title}" />
        </a>

        <div class="product-card-content g-1">
          <p class="product-card-brand typo-m-product-brand">${brand}</p>

          <h3 class="product-card-title typo-m-product-name">${title}</h3>

          <div class="product-card-price-row d-flex justify-content-between">
            <p class="product-card-price typo-m-product-price">${price}</p>

            <button type="button" class="product-card-wish typo-m-icons-s-o" aria-label="찜하기" aria-pressed="false">
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

  function formatPriceLegacy(price) {
    return `₩${Number(price || 0).toLocaleString("ko-KR")}`;
  }
});

document.querySelectorAll(".product-card, .best-ranking-item").forEach(card => {
  card.addEventListener("click", e => {
    if (e.target.closest("button")) return;

    const url = card.dataset.url || "product-detail.html";
    location.href = url;
  });
});
