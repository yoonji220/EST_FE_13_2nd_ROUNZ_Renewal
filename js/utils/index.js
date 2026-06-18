/*
  index.html 전용 스크립트
  - BEST 상품/랭킹을 products.json으로 렌더링하고 상세 페이지 이동을 연결합니다.
  - 메인 영상, 가이드 슬라이더, 공지/이벤트 탭, 찜하기 UI를 제어합니다.
*/

document.addEventListener("DOMContentLoaded", () => {
  /* 초기 DOM 참조 및 공통 UI 실행 */
  const bestList = document.querySelector("[data-best-list]");
  const bestRanking = document.querySelector("[data-best-ranking]");

  initHeroVideoSlider();
  initGuideSlider();
  initNoticeEvent();
  initWishlistButtons();
  const mainStoreSearchForm = document.querySelector(".store-search-form");
  const mainStoreSearchInput = document.querySelector(".store-search-input");

  if (!bestList) return;

  /* BEST 상품 기본 설정 */
  const bestProductCount = 7;
  const bestRankingCount = 4;
  const fallbackProducts = Array.from({ length: bestProductCount }, (_, index) => ({
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

  async function initBestSection() {
    const skeletonStartedAt = performance.now();
    renderBestSkeletons(bestProductCount);

    try {
      const response = await fetch("./data/products.json");
      if (!response.ok) throw new Error("Failed to load products.json");

      const data = await response.json();
      const products = getBestProducts(data.products).slice(0, bestProductCount);
      const displayProducts = products.length ? products : fallbackProducts;

      await waitForSkeleton(skeletonStartedAt);
      renderBestProducts(displayProducts);
      renderBestRanking(displayProducts.slice(0, bestRankingCount));
    } catch (error) {
      console.error(error);
      await waitForSkeleton(skeletonStartedAt);
      renderBestProducts(fallbackProducts);
      renderBestRanking(fallbackProducts.slice(0, bestRankingCount));
    }
  }

  /* BEST 상품 데이터 가공 */
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

  /* BEST 상품/랭킹 렌더링 */
  function renderBestProducts(products) {
    bestList.classList.remove("is-loading");
    bestList.setAttribute("aria-busy", "false");
    bestList.innerHTML = products.map(createProductCard).join("");
    bindProductCardLinks(bestList, ".product-card");
  }

  function renderBestRanking(products) {
    if (!bestRanking) return;

    bestRanking.setAttribute("aria-busy", "false");
    bestRanking.innerHTML = products.map(createBestRankingItem).join("");
    bindProductCardLinks(bestRanking, ".best-ranking-item");
  }

  function renderBestSkeletons(count) {
    bestList.classList.add("is-loading");
    bestList.setAttribute("aria-busy", "true");
    bestList.innerHTML = Array.from({ length: count }, createProductSkeletonCard).join("");
  }

  /* BEST 상품 가로 드래그 */
  function initBestDraggable() {
    let isPointerDown = false;
    let hasDragged = false;
    let shouldBlockClick = false;
    let startX = 0;
    let startScrollLeft = 0;
    const dragThreshold = 6;

    const stopDragging = event => {
      if (!isPointerDown) return;

      isPointerDown = false;
      shouldBlockClick = hasDragged;
      bestList.classList.remove("is-dragging");
      bestList.releasePointerCapture?.(event.pointerId);
    };

    bestList.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;

      isPointerDown = true;
      hasDragged = false;
      startX = event.clientX;
      startScrollLeft = bestList.scrollLeft;
      bestList.setPointerCapture?.(event.pointerId);
    });

    bestList.addEventListener("pointermove", event => {
      if (!isPointerDown) return;

      const dragDistance = event.clientX - startX;
      if (Math.abs(dragDistance) > dragThreshold) {
        hasDragged = true;
        bestList.classList.add("is-dragging");
      }

      if (!hasDragged) return;

      event.preventDefault();
      bestList.scrollLeft = startScrollLeft - dragDistance;
    });

    bestList.addEventListener("pointerup", stopDragging);
    bestList.addEventListener("pointercancel", stopDragging);
    bestList.addEventListener("pointerleave", stopDragging);

    bestList.addEventListener(
      "click",
      event => {
        if (!shouldBlockClick) return;

        event.preventDefault();
        event.stopPropagation();
        shouldBlockClick = false;
        hasDragged = false;
      },
      true,
    );
  }

  function createProductSkeletonCard() {
    return `
      <li class="product-card product-card--skeleton g-1 d-flex flex-column" aria-hidden="true">
        <div class="product-card__image skeleton-block"></div>

        <div class="product-card-content g-1">
          <div class="product-card-brand skeleton-block"></div>

          <div class="product-card-title skeleton-block"></div>

          <div class="product-card-price-row d-flex justify-content-between">
            <div class="product-card-price skeleton-block"></div>

            <div class="product-card-wish skeleton-block"></div>
          </div>

          <ul class="product-card-colors d-flex">
            <li>
              <div class="piting-color skeleton-block"></div>
            </li>

            <li>
              <div class="piting-color skeleton-block"></div>
            </li>
          </ul>
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
      <li class="product-card g-1 d-flex flex-column" data-detail-url="${detailUrl}">
        <a href="${detailUrl}" class="product-card__image">
          <img src="${imageUrl}" alt="${title}" />
        </a>

        <div class="product-card-content g-1">
          <p class="product-card-brand typo-m-product-brand">${brand}</p>

          <h3 class="product-card-title typo-m-product-name">
            <a href="${detailUrl}">${title}</a>
          </h3>

          <div class="product-card-price-row d-flex justify-content-between">
            <p class="product-card-price typo-m-product-price">${price}</p>

            <button type="button" class="product-card-wish typo-m-icons-s-o" aria-label="wishlist" aria-pressed="false">
              favorite_border
            </button>
          </div>

          <ul class="product-card-colors d-flex">
            <li>
              <button type="button" class="piting-color black" aria-label="black"></button>
            </li>

            <li>
              <button type="button" class="piting-color gray" aria-label="gray"></button>
            </li>
          </ul>
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

  /* 상품 상세 이동 및 찜하기 */
  function getProductDetailUrl(productId) {
    return productId ? `./product_detail.html?id=${encodeURIComponent(productId)}` : "./product_detail.html";
  }

  function bindProductCardLinks(container, itemSelector) {
    // 각 상품 항목의 클릭/키보드 입력을 상세 페이지 이동으로 연결합니다.
    // - 실제 클릭 대상이 링크나 버튼이면 기본 동작 또는 다른 핸들러를 우선합니다.
    // - 이동 주소는 항목의 `data-detail-url`을 우선 사용하고, 없으면 내부 링크의 `href`를 사용합니다.
    container.querySelectorAll(itemSelector).forEach(item => {
      item.addEventListener("click", event => {
        // 내부 링크나 버튼을 누른 경우 여기서 추가 이동하지 않습니다.
        if (event.target.closest("a, button")) return;

        const destination = getDestinationFromElement(item);
        if (!isValidDestination(destination)) return;

        // 일반 링크 이동과 같은 방식으로 페이지를 이동합니다.
        window.location.assign(destination);
      });

      // 접근성을 위해 Enter/Space 키로도 상품 항목을 열 수 있게 합니다.
      item.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        // Space 키 입력 시 페이지 스크롤을 막습니다.
        event.preventDefault();

        const destination = getDestinationFromElement(item);
        if (!isValidDestination(destination)) return;

        window.location.assign(destination);
      });
    });

    // `data-detail-url`을 직접 가진 요소도 클릭 시 링크처럼 동작하게 합니다.
    container.querySelectorAll("[data-detail-url]").forEach(el => {
      // 위에서 이미 연결한 상품 항목은 중복으로 처리하지 않습니다.
      if (el.matches(itemSelector)) return;

      el.addEventListener("click", event => {
        // 링크 내부 클릭은 해당 링크가 직접 처리하게 둡니다.
        if (event.target.closest("a")) return;

        const destination = String(el.dataset.detailUrl || "");
        if (!isValidDestination(destination)) return;

        window.location.assign(destination);
      });
    });
  }

  // 상세 페이지 이동 유틸
  // 요소에서 이동할 URL을 찾습니다.
  // 우선순위: data-detail-url -> 내부 anchor[href]
  function getDestinationFromElement(el) {
    if (!el) return null;

    const dataUrl = el.dataset?.detailUrl;
    if (dataUrl) return String(dataUrl).trim();

    const anchor = el.querySelector && el.querySelector("a[href]");
    if (anchor) return String(anchor.getAttribute("href") || "").trim();

    return null;
  }

  // 빈 값, #, javascript: 같은 잘못된 이동 주소를 걸러냅니다.
  function isValidDestination(url) {
    if (!url) return false;
    const trimmed = String(url).trim();
    if (!trimmed) return false;
    const lower = trimmed.toLowerCase();
    if (lower === "#" || lower.startsWith("javascript:")) return false;
    return true;
  }

  function initWishlistButtons() {
    document.querySelectorAll('button[class*="wish"]').forEach(button => {
      button.setAttribute("aria-pressed", "false");
    });

    document.addEventListener("click", event => {
      const wishButton = event.target.closest('button[class*="wish"]');
      if (!wishButton) return;

      event.preventDefault();
      event.stopPropagation();

      const isWished = wishButton.classList.toggle("is-wished");
      wishButton.setAttribute("aria-pressed", String(isWished));
      wishButton.textContent = isWished ? "favorite" : "favorite_border";
    });
  }

  /* 공통 포맷/문자열 유틸 */
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

  /* 메인 히어로 영상 슬라이더 */
  function initHeroVideoSlider() {
    const slider = document.querySelector("[data-hero-video-slider]");
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    const progress = slider.querySelector("[data-hero-progress]");
    const prevButton = slider.querySelector("[data-hero-prev]");
    const nextButton = slider.querySelector("[data-hero-next]");
    if (!slides.length || !progress) return;

    progress.innerHTML = slides
      .map(
        () =>
          '<span class="hero-video-progress-item"><span class="hero-video-progress-fill"></span></span>',
      )
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
    let dragCurrentX = 0;
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
            pausedElapsed =
              activeVideo.duration > 0 ? activeVideo.currentTime * 1000 : pausedElapsed;
            slideStartedAt = performance.now() - pausedElapsed;
            updateProgressByTime(duration);
            timerId = window.setTimeout(
              () => showSlide(activeIndex + 1),
              Math.max(duration - pausedElapsed, 0),
            );
          });
        return;
      }

      const duration = getSlideDuration(activeSlide);
      slideStartedAt = performance.now() - pausedElapsed;
      updateProgressByTime(duration);
      timerId = window.setTimeout(
        () => showSlide(activeIndex + 1),
        Math.max(duration - pausedElapsed, 0),
      );
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
      dragCurrentX = event.clientX;
      pauseHero();
      slider.setPointerCapture?.(event.pointerId);
    });

    slider.addEventListener("pointermove", event => {
      if (!isDragging) return;
      dragCurrentX = event.clientX;
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

  /* 가이드 카드 슬라이더 */
  function initGuideSlider() {
    const slider = document.querySelector(".guide-slider");
    if (!slider) return;

    const cards = Array.from(slider.querySelectorAll(".guide-card"));
    const mobileQuery = window.matchMedia("(max-width: 1024px)");
    const autoplayDelay = 3000;
    let activeIndex = 0;
    let autoplayId = null;
    let scrollEndId = null;
    let isPaused = false;

    slider.setAttribute("aria-roledescription", "carousel");

    const isMobile = () => mobileQuery.matches && cards.length > 1;

    const getSlideLeft = index =>
      cards[index] ? cards[index].offsetLeft - cards[0].offsetLeft : 0;

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

  /* 공지/이벤트 탭 및 아코디언 */
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
