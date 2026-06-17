const NAVER_MAP_CLIENT_ID = "elqc9936ti";
const EVENT_FALLBACK_IMAGE = "./img/rounz-event-fallback.webp";

let stores = [];
let currentFeaturedStore = null;
let currentFilteredStores = [];
let currentFilterName = "프리미엄 매장";
let userLocation = null;

let naverMap = null;
let storeMarker = null;
let userMarker = null;
let guideLine = null;
let naverMapScriptPromise = null;
let pcCurrentFilteredStores = [];
let pcSelectedStore = null;
let pcNaverMap = null;
let pcStoreMarkers = [];
let pcUserMarker = null;
let pcGuideLine = null;
let pcVisibleCount = 4;

const PC_FILTER_NAMES = ["전체", "영업중", "프리미엄 매장", "선글라스", "프레임", "렌즈", "AI안경"];

const storeList = document.querySelector(".stores-list__items");
const searchInput = document.querySelector(".stores-search__input-wrap input");
const filterButtons = document.querySelectorAll(".stores-search__filters .filter-chip");
const locationButtons = document.querySelectorAll(
  ".stores-search__location-btn, .stores-cta__btn--primary",
);

const featuredImageWrap = document.querySelector(".stores-featured__image-wrap");
const featuredBadge = document.querySelector(".stores-featured__badge");
const featuredName = document.querySelector(".stores-featured__name-group h2");
const featuredAddress = document.querySelector(".stores-featured__name-group p");
const featuredRating = document.querySelector(".stores-featured__rating .typo-m-caption");
const featuredHours = document.querySelector(".stores-featured__hours .typo-m-caption");
const featuredStore = document.querySelector(".stores-featured");

const mapLightbox = document.querySelector(".map-lightbox");
const mapLightboxOverlay = document.querySelector(".map-lightbox__overlay");
const mapLightboxClose = document.querySelector(".map-lightbox__close");

const pcSearchInput = document.querySelector(".pc-search-form input");
const pcSearchButton = document.querySelector(".pc-search-form__btn");
const pcFilterChipList = document.querySelector(".pc-filter-chips");
let pcFilterButtons = document.querySelectorAll(".pc-filter-chips .filter-chip");
const pcStoreList = document.querySelector(".pc-store-list");
const pcResultsSummaryCount = document.querySelector(".pc-results-summary strong");
const pcMapBg = document.querySelector(".pc-map-bg");
const pcMapToastText = document.querySelector(".pc-map-toast p");
const pcZoomInButton = document.querySelector('.pc-map-controls__btn[aria-label="지도 확대"]');
const pcZoomOutButton = document.querySelector('.pc-map-controls__btn[aria-label="지도 축소"]');
const pcCurrentLocationButton = document.querySelector(
  '.pc-map-controls__btn[aria-label="현재 위치로 이동"]',
);

const pcStoreMoreButton = document.querySelector(".pc-store-list__more");
const pcMapFilterList = document.querySelector(".pc-filter-overlay__list");
let pcMapFilterCheckboxes = document.querySelectorAll(".pc-filter-overlay input");

const pcPromoTitle = document.querySelector(".pc-promo-card__text .typo-p-header-s");
const pcPromoDesc = document.querySelector(".pc-promo-card__text .typo-p-body-s");
const pcPromoButton = document.querySelector(".pc-promo-card__btn");
const pcPromoImage = document.querySelector(".pc-promo-card__image");

showStoreSkeleton();

fetch("./data/stores.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("데이터를 불러오지 못했습니다.");
    }

    return response.json();
  })
  .then(data => {
    stores = data;

    hideStoreSkeleton();
    initStores();
    bindSearchEvent();
    bindFilterEvents();
    bindLocationButtons();
    bindFeaturedMapButton();
    bindMapLightboxCloseEvents();
    renderPcFilterChips();
    renderPcMapFilterOverlay();
    initPcStores();
    bindPcSearchEvents();
    bindPcFilterEvents();
    bindPcMapControlEvents();
    bindPcStoreMoreButton();
    bindPcMapFilterOverlayEvents();
    initPcPromotionCard();
  })
  .catch(error => {
    hideStoreSkeleton();
    renderStoreList([]);
    console.error(error);
  });

function showStoreSkeleton() {
  featuredStore?.classList.add("is-loading");

  if (!storeList) return;

  storeList.innerHTML = `
    <li class="store-card store-card--skeleton d-flex flex-column" aria-hidden="true">
      <div class="store-card__info d-flex justify-content-between">
        <div class="store-card__name-group d-flex flex-column">
          <span class="skeleton-line skeleton-line--title"></span>
          <span class="skeleton-line skeleton-line--address"></span>
        </div>
        <span class="skeleton-line skeleton-line--distance"></span>
      </div>
      <div class="store-card__actions d-flex">
        <span class="skeleton-line skeleton-line--button"></span>
        <span class="skeleton-line skeleton-line--button"></span>
        <span class="skeleton-line skeleton-line--button"></span>
      </div>
    </li>
    <li class="store-card store-card--skeleton d-flex flex-column" aria-hidden="true">
      <div class="store-card__info d-flex justify-content-between">
        <div class="store-card__name-group d-flex flex-column">
          <span class="skeleton-line skeleton-line--title"></span>
          <span class="skeleton-line skeleton-line--address"></span>
        </div>
        <span class="skeleton-line skeleton-line--distance"></span>
      </div>
      <div class="store-card__actions d-flex">
        <span class="skeleton-line skeleton-line--button"></span>
        <span class="skeleton-line skeleton-line--button"></span>
        <span class="skeleton-line skeleton-line--button"></span>
      </div>
    </li>
  `;
}

function hideStoreSkeleton() {
  featuredStore?.classList.remove("is-loading");
}

function initStores() {
  currentFilteredStores = stores
    .filter(store => store.isPremium)
    .sort((a, b) => b.rating - a.rating);

  currentFeaturedStore = currentFilteredStores[0];

  renderFeaturedStore(currentFeaturedStore);
  renderStoreList(currentFilteredStores.slice(1, 3));
}

function renderFeaturedStore(store) {
  if (!store) return;

  currentFeaturedStore = store;

  renderFeaturedImage(store);

  if (featuredBadge) {
    featuredBadge.textContent = store.isPremium ? "PREMIUM" : "ROUNZ";
  }

  if (featuredName) {
    featuredName.textContent = store.name;
  }

  if (featuredAddress) {
    featuredAddress.textContent = store.address;
  }

  if (featuredRating) {
    featuredRating.textContent = store.rating;
  }

  if (featuredHours) {
    featuredHours.textContent = `${store.openTime} - ${store.closeTime}`;
  }
}

function renderFeaturedImage(store) {
  if (!featuredImageWrap) return;

  let featuredImage = featuredImageWrap.querySelector(".stores-featured__image");

  if (!store.thumbnail) {
    featuredImage?.remove();
    return;
  }

  if (!featuredImage) {
    featuredImage = document.createElement("img");
    featuredImage.className = "stores-featured__image";
    featuredImage.loading = "lazy";
    featuredImage.decoding = "async";

    featuredImageWrap.prepend(featuredImage);
  }

  featuredImage.onerror = () => {
    featuredImage.remove();
  };

  featuredImage.src = store.thumbnail;
  featuredImage.alt = `${store.name} 매장 외관`;
}

function renderStoreList(storeData) {
  if (!storeList) return;

  storeList.innerHTML = "";

  if (!storeData.length) {
    storeList.innerHTML = `
      <li class="store-card d-flex flex-column">
        <p class="typo-m-body-s">검색 결과가 없습니다.</p>
      </li>
    `;
    return;
  }

  storeData.forEach(store => {
    const li = document.createElement("li");
    li.className = "store-card d-flex flex-column";
    li.dataset.storeName = store.name;

    li.innerHTML = `
      <div class="store-card__info d-flex justify-content-between">
        <div class="store-card__name-group d-flex flex-column">
          <h3 class="typo-m-product-brand">${store.name}</h3>
          <p class="typo-m-product-name">${store.address}</p>
        </div>
        <span class="store-card__distance typo-m-caption">${store.distance ?? ""}</span>
      </div>
      <div class="store-card__actions d-flex">
        <button
          type="button"
          class="store-card__btn typo-m-btn-s"
          data-action="detail"
          aria-label="${store.name} 상세 정보"
        >
          상세 정보
        </button>
        <button
          type="button"
          class="store-card__btn typo-m-btn-s"
          data-action="map"
          aria-label="${store.name} 지도 보기"
        >
          지도 보기
        </button>
        <button
          type="button"
          class="store-card__btn store-card__btn--primary typo-m-btn-s"
          data-action="direction"
          aria-label="${store.name} 길 안내"
        >
          길 안내
        </button>
      </div>
    `;

    storeList.appendChild(li);
  });

  bindStoreCardEvents();
}

function bindStoreCardEvents() {
  const storeCards = document.querySelectorAll(".store-card");

  storeCards.forEach(card => {
    card.addEventListener("click", event => {
      const storeName = card.dataset.storeName;

      if (!storeName) return;

      const selectedStore = stores.find(store => store.name === storeName);

      if (!selectedStore) return;

      const mapButton = event.target.closest('[data-action="map"]');
      const directionButton = event.target.closest('[data-action="direction"]');

      if (mapButton) {
        openMapLightbox(selectedStore);
        return;
      }

      if (directionButton) {
        showDirectionOnMap(selectedStore);
        return;
      }

      renderFeaturedStore(selectedStore);

      const nearbyStores = getNearbyStores(selectedStore, 2, currentFilteredStores);

      renderStoreList(nearbyStores);
    });
  });
}

function bindSearchEvent() {
  if (!searchInput) return;

  searchInput.addEventListener("input", event => {
    const keyword = event.target.value.trim();

    if (!keyword) {
      applyFilter(currentFilterName);
      return;
    }

    const searchResult = searchStores(keyword);

    currentFilteredStores = searchResult;

    const nextFeaturedStore = searchResult[0];

    renderFeaturedStore(nextFeaturedStore);

    if (!nextFeaturedStore) {
      renderStoreList([]);
      return;
    }

    const nearbyStores = getNearbyStores(nextFeaturedStore, 2, searchResult);

    renderStoreList(nearbyStores);
  });
}

function bindFilterEvents() {
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filterName = button.textContent.trim();

      setActiveFilterButton(filterName);

      currentFilterName = filterName;

      applyFilter(filterName);
    });
  });
}

function bindLocationButtons() {
  if (!locationButtons.length) return;

  locationButtons.forEach(button => {
    button.addEventListener("click", findStoresByCurrentLocation);
  });
}

function setActiveFilterButton(filterName) {
  filterButtons.forEach(filterButton => {
    const isActive = filterButton.textContent.trim() === filterName;

    filterButton.classList.toggle("filter-chip--active", isActive);
    filterButton.setAttribute("aria-pressed", String(isActive));
  });
}

function applyFilter(filterName) {
  let filteredStores = [...stores];

  if (filterName === "영업중") {
    filteredStores = filteredStores.filter(store => store.isOpen);
  }

  if (filterName === "프리미엄 매장") {
    filteredStores = filteredStores.filter(store => store.isPremium);
  }

  if (filterName === "선글라스") {
    filteredStores = filteredStores.filter(store => {
      const services = store.services || [];

      return services.some(service => service.includes("선글라스"));
    });
  }

  if (filterName === "가까운순") {
    filteredStores = sortStoresByDistance(filteredStores);
  } else {
    filteredStores = filteredStores.sort((a, b) => b.rating - a.rating);
  }

  currentFilteredStores = filteredStores;

  const nextFeaturedStore = filteredStores[0];

  renderFeaturedStore(nextFeaturedStore);

  if (!nextFeaturedStore) {
    renderStoreList([]);
    return;
  }

  const nearbyStores =
    filterName === "가까운순" && userLocation
      ? filteredStores.slice(1, 3)
      : getNearbyStores(nextFeaturedStore, 2, filteredStores);

  renderStoreList(nearbyStores);
}

function findStoresByCurrentLocation() {
  getCurrentLocation()
    .then(location => {
      const sortedStores = stores
        .map(store => {
          const distanceValue = getDistance(location.lat, location.lng, store.lat, store.lng);

          return {
            ...store,
            distanceValue,
            distance: formatDistance(distanceValue),
          };
        })
        .sort((a, b) => a.distanceValue - b.distanceValue);

      currentFilteredStores = sortedStores;
      currentFilterName = "가까운순";

      setActiveFilterButton("가까운순");
      renderFeaturedStore(sortedStores[0]);
      renderStoreList(sortedStores.slice(1, 3));
    })
    .catch(error => {
      console.error("현재 위치를 가져오지 못했습니다.", error);
      alert("위치 정보 사용을 허용하면 가까운 매장을 찾을 수 있습니다.");
    });
}

function getCurrentLocation() {
  if (userLocation) {
    return Promise.resolve(userLocation);
  }

  if (!navigator.geolocation) {
    return Promise.reject(new Error("이 브라우저에서는 위치 정보를 사용할 수 없습니다."));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        userLocation = location;

        resolve(location);
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  });
}

function searchStores(keyword) {
  const normalizedKeyword = keyword.toLowerCase();

  return stores.filter(store => {
    const name = store.name.toLowerCase();
    const address = store.address.toLowerCase();

    return name.includes(normalizedKeyword) || address.includes(normalizedKeyword);
  });
}

function sortStoresByDistance(storeData) {
  if (userLocation) {
    return storeData
      .map(store => {
        const distanceValue = getDistance(userLocation.lat, userLocation.lng, store.lat, store.lng);

        return {
          ...store,
          distanceValue,
          distance: formatDistance(distanceValue),
        };
      })
      .sort((a, b) => a.distanceValue - b.distanceValue);
  }

  return storeData.sort((a, b) => {
    const distanceA = parseFloat(a.distance) || 0;
    const distanceB = parseFloat(b.distance) || 0;

    return distanceA - distanceB;
  });
}

function getNearbyStores(baseStore, count = 2, sourceStores = stores) {
  if (!baseStore) return [];

  return sourceStores
    .filter(store => store.name !== baseStore.name)
    .map(store => {
      const distanceValue = getDistance(baseStore.lat, baseStore.lng, store.lat, store.lng);

      return {
        ...store,
        distanceValue,
        distance: formatDistance(distanceValue),
      };
    })
    .sort((a, b) => a.distanceValue - b.distanceValue)
    .slice(0, count);
}

function getDistance(lat1, lng1, lat2, lng2) {
  const toRad = value => (Number(value) * Math.PI) / 180;

  const earthRadius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }

  return `${distance.toFixed(1)}km`;
}

function renderPcFilterChips() {
  if (!pcFilterChipList) return;

  pcFilterChipList.innerHTML = PC_FILTER_NAMES.map((filterName, index) => {
    const isActive = index === 0;

    return `
      <li>
        <button
          type="button"
          class="filter-chip typo-p-btn-s ${isActive ? "filter-chip--active" : ""}"
          aria-pressed="${isActive}"
        >
          ${filterName}
        </button>
      </li>
    `;
  }).join("");

  pcFilterButtons = document.querySelectorAll(".pc-filter-chips .filter-chip");
}

function renderPcMapFilterOverlay() {
  if (!pcMapFilterList) return;

  pcMapFilterList.innerHTML = PC_FILTER_NAMES.map((filterName, index) => {
    const filterId = `pc-map-filter-${index}`;

    return `
      <li class="d-flex align-items-center">
        <input
          type="checkbox"
          id="${filterId}"
          value="${filterName}"
          ${filterName === "전체" ? "checked" : ""}
        />
        <label for="${filterId}" class="typo-p-body-s">${filterName}</label>
      </li>
    `;
  }).join("");

  pcMapFilterCheckboxes = document.querySelectorAll(".pc-filter-overlay input");
}

function initPcStores() {
  if (!pcStoreList || !pcMapBg) return;

  pcVisibleCount = 4;
  pcCurrentFilteredStores = [...stores].sort((a, b) => b.rating - a.rating);
  pcSelectedStore = pcCurrentFilteredStores[0] ?? null;

  renderPcStoreList(pcCurrentFilteredStores);
  updatePcResultsCount(pcCurrentFilteredStores.length);

  if (pcSelectedStore) {
    renderPcNaverMap(pcSelectedStore, pcCurrentFilteredStores);
    updatePcToast("매장을 선택하면 상세 정보를 확인할 수 있습니다");
  }
}

function renderPcStoreList(storeData) {
  if (!pcStoreList) return;

  if (!storeData.length) {
    pcStoreList.innerHTML = `
      <li class="pc-store-card d-flex flex-column">
        <p class="typo-p-body-s">검색 결과가 없습니다.</p>
      </li>
    `;
    updatePcResultsCount(0);
    updatePcStoreMoreButton(0);
    return;
  }

  const visibleStores = storeData.slice(0, pcVisibleCount);

  pcStoreList.innerHTML = visibleStores
    .map(store => {
      const isActive = pcSelectedStore?.name === store.name;
      const openLabel = store.isOpen ? "영업중" : "영업종료";

      return `
        <li
          class="pc-store-card ${isActive ? "pc-store-card--active" : ""} d-flex flex-column"
          data-store-name="${store.name}"
        >
          <div class="pc-store-card__header d-flex align-items-center">
            <h3 class="typo-p-product-brand">${store.name}</h3>
            <span class="pc-store-card__badge typo-p-caption">${openLabel}</span>
          </div>
          <div class="pc-store-card__detail d-flex align-items-center">
            <span class="typo-m-icons-xs-o" aria-hidden="true">location_on</span>
            <p class="typo-p-body-s">${store.address}</p>
          </div>
          <div class="pc-store-card__detail d-flex align-items-center">
            <span class="typo-m-icons-xs-o" aria-hidden="true">call</span>
            <p class="typo-p-body-s">${store.phone}</p>
          </div>
          <div class="pc-store-card__detail d-flex align-items-center">
            <span class="typo-m-icons-xs-o" aria-hidden="true">schedule</span>
            <p class="typo-p-body-s">${store.openTime} - ${store.closeTime}</p>
          </div>
          <div class="pc-store-card__actions d-flex">
            <button
              type="button"
              class="pc-store-card__btn typo-p-btn-s"
              data-action="pc-direction"
              aria-label="${store.name} 길찾기"
            >
              <span class="typo-m-icons-s-o" aria-hidden="true">near_me</span>
              길찾기
            </button>
            <button
              type="button"
              class="pc-store-card__btn pc-store-card__btn--primary typo-p-btn-s"
              data-action="pc-book"
              aria-label="${store.name} 예약하기"
            >
              예약하기
            </button>
          </div>
        </li>
      `;
    })
    .join("");

  bindPcStoreCardEvents();
  updatePcStoreMoreButton(storeData.length);
}

function bindPcStoreCardEvents() {
  if (!pcStoreList) return;

  const pcStoreCards = pcStoreList.querySelectorAll(".pc-store-card");

  pcStoreCards.forEach(card => {
    const storeName = card.dataset.storeName;

    if (!storeName) return;

    const selectedStore = stores.find(store => store.name === storeName);

    if (!selectedStore) return;

    const directionButton = card.querySelector('[data-action="pc-direction"]');
    const bookButton = card.querySelector('[data-action="pc-book"]');

    directionButton?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      showPcDirectionOnMap(selectedStore);
    });

    bookButton?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      alert(`예약 서비스는 현재 준비 중입니다.\n예약 문의는 ${selectedStore.phone}로 연락 주세요.`);
    });

    card.addEventListener("click", event => {
      if (event.target.closest("button")) return;

      pcSelectedStore = selectedStore;
      renderPcStoreList(pcCurrentFilteredStores);
      renderPcNaverMap(selectedStore, pcCurrentFilteredStores);
      updatePcToast(`${selectedStore.name} 상세 정보를 확인 중입니다.`);
    });
  });
}

function bindPcSearchEvents() {
  if (!pcSearchInput && !pcSearchButton) return;

  pcSearchInput?.addEventListener("input", applyPcSearchAndFilter);

  pcSearchInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyPcSearchAndFilter();
    }
  });

  pcSearchButton?.addEventListener("click", applyPcSearchAndFilter);
}

function bindPcFilterEvents() {
  if (!pcFilterButtons.length) return;

  pcFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filterName = button.textContent.trim();

      setActivePcFilterButton(filterName);
      applyPcSearchAndFilter();
    });
  });
}

function bindPcMapControlEvents() {
  pcZoomInButton?.addEventListener("click", () => {
    if (!pcNaverMap) return;

    pcNaverMap.setZoom(pcNaverMap.getZoom() + 1);
  });

  pcZoomOutButton?.addEventListener("click", () => {
    if (!pcNaverMap) return;

    pcNaverMap.setZoom(pcNaverMap.getZoom() - 1);
  });

  pcCurrentLocationButton?.addEventListener("click", () => {
    if (!pcSelectedStore) return;

    showPcDirectionOnMap(pcSelectedStore);
  });
}

function setActivePcFilterButton(filterName) {
  pcFilterButtons.forEach(button => {
    const isActive = button.textContent.trim() === filterName;

    button.classList.toggle("filter-chip--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function getActivePcFilterName() {
  const activeButton = [...pcFilterButtons].find(button =>
    button.classList.contains("filter-chip--active"),
  );

  return activeButton?.textContent.trim() || "전체";
}

function applyPcSearchAndFilter() {
  if (!pcStoreList) return;

  const keyword = pcSearchInput?.value.trim() || "";
  const filterName = getActivePcFilterName();

  let filteredStores = filterPcStores(stores, filterName);

  if (keyword) {
    filteredStores = filteredStores.filter(store => {
      const name = store.name.toLowerCase();
      const address = store.address.toLowerCase();
      const normalizedKeyword = keyword.toLowerCase();

      return name.includes(normalizedKeyword) || address.includes(normalizedKeyword);
    });
  }

  pcVisibleCount = 4;
  pcCurrentFilteredStores = filteredStores.sort((a, b) => b.rating - a.rating);
  pcSelectedStore = pcCurrentFilteredStores[0] ?? null;

  renderPcStoreList(pcCurrentFilteredStores);
  updatePcResultsCount(pcCurrentFilteredStores.length);

  if (pcSelectedStore) {
    renderPcNaverMap(pcSelectedStore, pcCurrentFilteredStores);
    updatePcToast(`${pcSelectedStore.name} 매장을 지도에서 확인 중입니다.`);
  } else {
    updatePcToast("검색 결과가 없습니다.");
  }
}

function filterPcStores(storeData, filterName) {
  let activeFilterNames = [];

  if (filterName && filterName !== "전체") {
    activeFilterNames.push(filterName);
  }

  activeFilterNames = [...activeFilterNames, ...getCheckedPcMapFilterNames()].filter(
    name => name && name !== "전체",
  );

  if (!activeFilterNames.length) {
    return [...storeData];
  }

  return storeData.filter(store =>
    activeFilterNames.every(activeFilterName => isStoreMatchedFilter(store, activeFilterName)),
  );
}

function getCheckedPcMapFilterNames() {
  return [...pcMapFilterCheckboxes]
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
}

function isStoreMatchedFilter(store, filterName) {
  if (filterName === "영업중") {
    return store.isOpen;
  }

  if (filterName === "프리미엄 매장") {
    return store.isPremium;
  }

  return hasStoreService(store, filterName);
}

function hasStoreService(store, keyword) {
  const services = store.services || [];

  return services.some(service => service.includes(keyword));
}

function updatePcResultsCount(count) {
  if (!pcResultsSummaryCount) return;

  pcResultsSummaryCount.textContent = count;
}

function updatePcToast(message) {
  if (!pcMapToastText) return;

  pcMapToastText.textContent = message;
}

function renderPcNaverMap(selectedStore, storeData = pcCurrentFilteredStores, startLocation) {
  if (!pcMapBg || !selectedStore) return;

  const storeLat = Number(selectedStore.lat);
  const storeLng = Number(selectedStore.lng);

  if (Number.isNaN(storeLat) || Number.isNaN(storeLng)) {
    console.error("PC 매장 좌표가 없습니다:", selectedStore);
    return;
  }

  loadNaverMapScript()
    .then(() => {
      const selectedPosition = new naver.maps.LatLng(storeLat, storeLng);

      if (!pcNaverMap) {
        pcNaverMap = new naver.maps.Map(pcMapBg, {
          center: selectedPosition,
          zoom: 12,
        });
      } else {
        pcNaverMap.setCenter(selectedPosition);
      }

      renderPcStoreMarkers(storeData, selectedStore.name);

      if (startLocation) {
        const userPosition = new naver.maps.LatLng(startLocation.lat, startLocation.lng);

        renderPcUserMarker(userPosition);
        renderPcGuideLine(userPosition, selectedPosition);
        fitPcMapBounds(userPosition, selectedPosition);
      } else {
        clearPcUserGuide();
      }

      setTimeout(() => {
        naver.maps.Event.trigger(pcNaverMap, "resize");

        if (startLocation) {
          const userPosition = new naver.maps.LatLng(startLocation.lat, startLocation.lng);
          fitPcMapBounds(userPosition, selectedPosition);
        } else {
          pcNaverMap.setCenter(selectedPosition);
        }
      }, 300);

      setTimeout(() => {
        naver.maps.Event.trigger(pcNaverMap, "resize");

        if (startLocation) {
          const userPosition = new naver.maps.LatLng(startLocation.lat, startLocation.lng);
          fitPcMapBounds(userPosition, selectedPosition);
        } else {
          pcNaverMap.setCenter(selectedPosition);
        }
      }, 700);
    })
    .catch(error => {
      console.error(error);
    });
}

function renderPcStoreMarkers(storeData, selectedStoreName) {
  clearPcStoreMarkers();

  pcStoreMarkers = storeData
    .map(store => {
      const lat = Number(store.lat);
      const lng = Number(store.lng);

      if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: pcNaverMap,
        icon: createPcStoreMarkerIcon(store.name, store.name === selectedStoreName),
        title: store.name,
      });

      naver.maps.Event.addListener(marker, "click", () => {
        pcSelectedStore = store;
        renderPcStoreList(pcCurrentFilteredStores);
        renderPcNaverMap(store, pcCurrentFilteredStores);
        updatePcToast(`${store.name} 상세 정보를 확인 중입니다.`);
      });

      return marker;
    })
    .filter(Boolean);
}

function createPcStoreMarkerIcon(storeName, isActive) {
  const label = isActive ? storeName : "R";
  const minWidth = isActive ? "120px" : "28px";

  return {
    content: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transform: translateY(-4px);
      ">
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: ${minWidth};
          max-width: 180px;
          height: 28px;
          padding: 0 10px;
          border-radius: 100px;
          background: #2563eb;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        ">
          ${label}
        </div>
        <div style="
          width: 12px;
          height: 12px;
          border-radius: 50% 50% 50% 0;
          background: #2563eb;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        "></div>
      </div>
    `,
    anchor: new naver.maps.Point(isActive ? 60 : 14, 44),
  };
}

function clearPcStoreMarkers() {
  pcStoreMarkers.forEach(marker => {
    marker.setMap(null);
  });

  pcStoreMarkers = [];
}

function showPcDirectionOnMap(store) {
  if (!pcMapBg || !store) return;

  getCurrentLocation()
    .then(location => {
      pcSelectedStore = store;
      renderPcStoreList(pcCurrentFilteredStores);
      renderPcNaverMap(store, pcCurrentFilteredStores, location);
      updatePcToast(`${store.name}까지 현재 위치 기준 안내를 표시했습니다.`);
    })
    .catch(error => {
      console.error("현재 위치를 가져오지 못했습니다.", error);
      alert("위치 정보 사용을 허용하면 현재 위치 기준 길찾기를 볼 수 있습니다.");
    });
}

function renderPcUserMarker(position) {
  if (!pcUserMarker) {
    pcUserMarker = new naver.maps.Marker({
      position,
      map: pcNaverMap,
      icon: {
        content:
          '<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);"></div>',
        anchor: new naver.maps.Point(8, 8),
      },
    });
    return;
  }

  pcUserMarker.setPosition(position);
  pcUserMarker.setMap(pcNaverMap);
}

function renderPcGuideLine(userPosition, storePosition) {
  if (!pcGuideLine) {
    pcGuideLine = new naver.maps.Polyline({
      map: pcNaverMap,
      path: [userPosition, storePosition],
      strokeColor: "#2563eb",
      strokeOpacity: 0.85,
      strokeWeight: 4,
      strokeStyle: "shortdash",
    });
    return;
  }

  pcGuideLine.setPath([userPosition, storePosition]);
  pcGuideLine.setMap(pcNaverMap);
}

function clearPcUserGuide() {
  if (pcUserMarker) {
    pcUserMarker.setMap(null);
  }

  if (pcGuideLine) {
    pcGuideLine.setMap(null);
  }
}

function fitPcMapBounds(userPosition, storePosition) {
  const bounds = new naver.maps.LatLngBounds();

  bounds.extend(userPosition);
  bounds.extend(storePosition);

  pcNaverMap.fitBounds(bounds, {
    top: 96,
    right: 96,
    bottom: 96,
    left: 96,
  });
}

function bindPcStoreMoreButton() {
  pcStoreMoreButton?.addEventListener("click", () => {
    pcVisibleCount += 4;
    renderPcStoreList(pcCurrentFilteredStores);
  });
}

function updatePcStoreMoreButton(totalCount) {
  if (!pcStoreMoreButton) return;

  const hasMoreStores = pcVisibleCount < totalCount;

  pcStoreMoreButton.hidden = !hasMoreStores;
  pcStoreMoreButton.textContent = hasMoreStores ? "매장 더보기" : "모든 매장을 표시했습니다";
}

function bindPcMapFilterOverlayEvents() {
  if (!pcMapFilterCheckboxes.length) return;

  pcMapFilterCheckboxes.forEach(input => {
    input.addEventListener("change", () => {
      const allCheckbox = getPcMapFilterAllCheckbox();

      if (input.value === "전체" && input.checked) {
        clearPcMapFilterCheckboxes();
      }

      if (input.value !== "전체" && allCheckbox) {
        allCheckbox.checked = false;
      }

      const hasCheckedFilter = [...pcMapFilterCheckboxes].some(
        checkbox => checkbox.value !== "전체" && checkbox.checked,
      );

      if (!hasCheckedFilter && allCheckbox) {
        allCheckbox.checked = true;
      }

      applyPcSearchAndFilter();
    });
  });
}

function getPcMapFilterAllCheckbox() {
  return [...pcMapFilterCheckboxes].find(checkbox => checkbox.value === "전체");
}

function clearPcMapFilterCheckboxes() {
  pcMapFilterCheckboxes.forEach(checkbox => {
    if (checkbox.value !== "전체") {
      checkbox.checked = false;
    }
  });
}

function initPcPromotionCard() {
  if (!pcPromoTitle && !pcPromoDesc && !pcPromoButton && !pcPromoImage) return;

  fetch("./data/events.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("이벤트 데이터를 불러오지 못했습니다.");
      }

      return response.json();
    })
    .then(data => {
      const events = Array.isArray(data) ? data : data.events || [];
      const event = getRandomPromotionEvent(events);

      if (!event) {
        renderPcPromotionCard(getDefaultPromotionEvent());
        return;
      }

      renderPcPromotionCard(event);
    })
    .catch(error => {
      console.warn(error);
      renderPcPromotionCard(getDefaultPromotionEvent());
    });
}

function getRandomPromotionEvent(events) {
  if (!Array.isArray(events) || events.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * events.length);

  return events[randomIndex];
}

function getDefaultPromotionEvent() {
  return {
    title: "ROUNZ EVENT",
    description: "라운즈의 다양한 혜택과 프로모션을 확인해보세요.",
    thumbnail: EVENT_FALLBACK_IMAGE,
    buttonText: "자세히 보기",
  };
}

function getSafePromotionText(value, fallbackText) {
  if (!value) return fallbackText;

  return String(value).replace(/\\n/g, " ").replace(/\n/g, " ").trim();
}

function renderPcPromotionCard(event) {
  const title = event.title || event.name || event.heading || "렌즈도 미리 비교하고 고르기";
  const description = getSafePromotionText(
    event.description || event.desc || event.summary || event.content,
    "방문 전에 원하는 렌즈를 골라보세요.",
  );
  const buttonText = event.buttonText || event.ctaText || event.cta || "자세히 보기";
  const imageUrl = event.thumbnail || event.image || event.imageUrl || event.img;
  const linkUrl = event.link || event.url || event.href;

  if (pcPromoTitle) {
    pcPromoTitle.textContent = title;
  }

  if (pcPromoDesc) {
    pcPromoDesc.textContent = description;
  }

  if (pcPromoButton) {
    pcPromoButton.textContent = buttonText;

    if (linkUrl) {
      pcPromoButton.addEventListener(
        "click",
        () => {
          window.location.href = linkUrl;
        },
        { once: true },
      );
    }
  }

  renderPcPromotionImage(imageUrl);
}

function renderPcPromotionImage(imageUrl) {
  if (!pcPromoImage) return;

  const nextImageUrl = imageUrl || EVENT_FALLBACK_IMAGE;
  const testImage = new Image();

  testImage.onload = () => {
    setPcPromotionBackground(nextImageUrl);
  };

  testImage.onerror = () => {
    setPcPromotionBackground(EVENT_FALLBACK_IMAGE);
  };

  testImage.src = nextImageUrl;
}

function setPcPromotionBackground(imageUrl) {
  if (!pcPromoImage) return;

  pcPromoImage.style.backgroundImage = `url("${imageUrl}")`;
  pcPromoImage.style.backgroundSize = "cover";
  pcPromoImage.style.backgroundPosition = "center";
  pcPromoImage.style.backgroundRepeat = "no-repeat";
}

function bindFeaturedMapButton() {
  const featuredButtons = document.querySelectorAll(".stores-featured__action-btn");

  featuredButtons.forEach(button => {
    const buttonText = button.textContent.trim();

    if (buttonText.includes("MAP")) {
      button.addEventListener("click", () => {
        openMapLightbox(currentFeaturedStore);
      });
    }

    if (buttonText.includes("DIR")) {
      button.addEventListener("click", () => {
        showDirectionOnMap(currentFeaturedStore);
      });
    }
  });
}

function bindMapLightboxCloseEvents() {
  mapLightboxClose?.addEventListener("click", closeMapLightbox);
  mapLightboxOverlay?.addEventListener("click", closeMapLightbox);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMapLightbox();
    }
  });
}

function openMapLightbox(store) {
  if (!mapLightbox || !store) return;

  mapLightbox.setAttribute("aria-hidden", "false");
  mapLightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";

  renderNaverMap(store);
}

function showDirectionOnMap(store) {
  if (!mapLightbox || !store) return;

  getCurrentLocation()
    .then(location => {
      mapLightbox.setAttribute("aria-hidden", "false");
      mapLightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";

      renderNaverMap(store, location);
    })
    .catch(error => {
      console.error("현재 위치를 가져오지 못했습니다.", error);
      alert("위치 정보 사용을 허용하면 현재 위치 기준 길 안내를 볼 수 있습니다.");
    });
}

function closeMapLightbox() {
  if (!mapLightbox) return;

  mapLightbox.setAttribute("aria-hidden", "true");
  mapLightbox.classList.remove("is-open");
  document.body.style.overflow = "";
}

function loadNaverMapScript() {
  if (window.naver?.maps) {
    return Promise.resolve();
  }

  if (naverMapScriptPromise) {
    return naverMapScriptPromise;
  }

  naverMapScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error("네이버 지도 API를 불러오지 못했습니다."));
    };

    document.head.appendChild(script);
  });

  return naverMapScriptPromise;
}

function getMapContainer() {
  const mapContainer = document.querySelector("#mapLightboxMap");

  if (mapContainer) {
    return mapContainer;
  }

  const lightboxContainer = document.querySelector(".map-lightbox__container");

  if (!lightboxContainer) return null;

  const newMapContainer = document.createElement("div");
  newMapContainer.id = "mapLightboxMap";
  newMapContainer.className = "map-lightbox__map";
  newMapContainer.setAttribute("aria-label", "선택한 매장 지도");

  lightboxContainer.appendChild(newMapContainer);

  return newMapContainer;
}

function renderNaverMap(store, startLocation) {
  const storeLat = Number(store.lat);
  const storeLng = Number(store.lng);

  if (Number.isNaN(storeLat) || Number.isNaN(storeLng)) {
    console.error("매장 좌표가 없습니다:", store);
    return;
  }

  loadNaverMapScript()
    .then(() => {
      const mapContainer = getMapContainer();

      if (!mapContainer) return;

      const storePosition = new naver.maps.LatLng(storeLat, storeLng);

      if (!naverMap) {
        naverMap = new naver.maps.Map(mapContainer, {
          center: storePosition,
          zoom: 16,
        });
      } else {
        naverMap.setCenter(storePosition);
      }

      renderStoreMarker(storePosition, store.name);

      if (startLocation) {
        const userPosition = new naver.maps.LatLng(startLocation.lat, startLocation.lng);

        renderUserMarker(userPosition);
        renderGuideLine(userPosition, storePosition);
        fitMapBounds(userPosition, storePosition);
      } else {
        clearUserGuide();
      }

      setTimeout(() => {
        naver.maps.Event.trigger(naverMap, "resize");

        if (startLocation) {
          const userPosition = new naver.maps.LatLng(startLocation.lat, startLocation.lng);
          fitMapBounds(userPosition, storePosition);
        } else {
          naverMap.setCenter(storePosition);
        }
      }, 300);

      setTimeout(() => {
        naver.maps.Event.trigger(naverMap, "resize");

        if (startLocation) {
          const userPosition = new naver.maps.LatLng(startLocation.lat, startLocation.lng);
          fitMapBounds(userPosition, storePosition);
        } else {
          naverMap.setCenter(storePosition);
        }
      }, 700);
    })
    .catch(error => {
      console.error(error);
    });
}

function renderStoreMarker(position, storeName) {
  const storeMarkerIcon = {
    content: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transform: translateY(-4px);
      ">
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 58px;
          height: 28px;
          padding: 0 10px;
          border-radius: 100px;
          background: #2563eb;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          white-space: nowrap;
        ">
          ROUNZ
        </div>
        <div style="
          width: 12px;
          height: 12px;
          border-radius: 50% 50% 50% 0;
          background: #2563eb;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        "></div>
      </div>
    `,
    anchor: new naver.maps.Point(29, 44),
  };

  if (!storeMarker) {
    storeMarker = new naver.maps.Marker({
      position,
      map: naverMap,
      icon: storeMarkerIcon,
      title: storeName,
    });
    return;
  }

  storeMarker.setPosition(position);
  storeMarker.setIcon(storeMarkerIcon);
  storeMarker.setTitle(storeName);
  storeMarker.setMap(naverMap);
}

function renderUserMarker(position) {
  if (!userMarker) {
    userMarker = new naver.maps.Marker({
      position,
      map: naverMap,
      icon: {
        content:
          '<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);"></div>',
        anchor: new naver.maps.Point(8, 8),
      },
    });
    return;
  }

  userMarker.setPosition(position);
  userMarker.setMap(naverMap);
}

function renderGuideLine(userPosition, storePosition) {
  if (!guideLine) {
    guideLine = new naver.maps.Polyline({
      map: naverMap,
      path: [userPosition, storePosition],
      strokeColor: "#2563eb",
      strokeOpacity: 0.85,
      strokeWeight: 4,
      strokeStyle: "shortdash",
    });
    return;
  }

  guideLine.setPath([userPosition, storePosition]);
  guideLine.setMap(naverMap);
}

function clearUserGuide() {
  if (userMarker) {
    userMarker.setMap(null);
  }

  if (guideLine) {
    guideLine.setMap(null);
  }
}

function fitMapBounds(userPosition, storePosition) {
  const bounds = new naver.maps.LatLngBounds();

  bounds.extend(userPosition);
  bounds.extend(storePosition);

  naverMap.fitBounds(bounds, {
    top: 80,
    right: 48,
    bottom: 80,
    left: 48,
  });
}
