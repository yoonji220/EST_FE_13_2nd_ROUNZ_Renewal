document.addEventListener("DOMContentLoaded", () => {
  const bestList = document.querySelector("[data-best-list]");

  initHeroVideoSlider();
  initGuideSlider();

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

    const getSlideLeft = index => (cards[index] ? cards[index].offsetLeft - cards[0].offsetLeft : 0);

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
});
