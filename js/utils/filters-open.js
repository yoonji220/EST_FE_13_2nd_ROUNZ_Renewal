(function () {
  const { escapeHtml, renderList, setExclusiveActive } = window.ROUNZCommon;

  const brandOptions = [
    { label: "라운즈 (ROUNZ)", selected: true },
    { label: "젠틀몬스터" },
    { label: "레이밴" },
    { label: "GENTLE MONSTER" },
    { label: "Ray-Ban" },
    { label: "TOM FORD" },
  ];

  const faceShapes = [
    {
      label: "둥근형",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=80&q=80",
      alt: "둥근형",
    },
    {
      label: "보스턴",
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=80&q=80",
      alt: "보스턴",
    },
    {
      label: "보잉",
      image:
        "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=80&q=80",
      alt: "보잉",
    },
    {
      label: "스퀘어",
      image:
        "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=80&q=80",
      alt: "스퀘어",
    },
    {
      label: "각진형",
      image:
        "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=80&q=80",
      alt: "각진형",
    },
    {
      label: "하트형",
      image:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=80&q=80",
      alt: "하트형",
    },
    {
      label: "역삼각형",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=80&q=80",
      alt: "역삼각형",
    },
    {
      label: "달걀형",
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=80&q=80",
      alt: "달걀형",
    },
    {
      label: "긴얼굴형",
      image:
        "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=80&q=80",
      alt: "긴얼굴형",
    },
  ];

  const materials = [
    { label: "티타늄", selected: true },
    { label: "뿔테" },
    { label: "나무" },
    { label: "아세테이트" },
    { label: "메탈" },
    { label: "무테/반무테" },
    { label: "스테인리스" },
    { label: "TR" },
    { label: "울템" },
  ];

  const brandGrid = document.querySelector(".brand-grid");
  const faceShapeGrid = document.querySelector(".face-shape-grid");
  const materialGrid = document.querySelector(".material-grid");
  const priceRange = document.getElementById("priceRange");
  const resetButton = document.querySelector(".btn-reset");

  const formatPriceValue = value =>
    `${new Intl.NumberFormat("ko-KR").format(value)}원`;

  const renderBrandGrid = () => {
    renderList(
      brandGrid,
      brandOptions,
      option => `
      <button class="brand-btn${option.selected ? " active" : ""}" data-selection-option type="button">
        ${escapeHtml(option.label)}
      </button>
    `,
    );
  };

  const renderFaceShapeGrid = () => {
    renderList(
      faceShapeGrid,
      faceShapes,
      (shape, index) => `
      <button class="face-shape-item${index === 0 ? " active" : ""}" data-selection-option type="button">
        <div class="shape-icon-wrapper">
          <img src="${escapeHtml(shape.image)}" alt="${escapeHtml(shape.alt)}">
        </div>
        <span>${escapeHtml(shape.label)}</span>
      </button>
    `,
    );
  };

  const renderMaterialGrid = () => {
    renderList(
      materialGrid,
      materials,
      option => `
      <button class="material-btn${option.selected ? " active" : ""}" data-selection-option type="button">
        ${escapeHtml(option.label)}
      </button>
    `,
    );
  };

  const syncPriceRange = () => {
    if (!priceRange) {
      return;
    }

    priceRange.setAttribute(
      "aria-valuetext",
      `${formatPriceValue(Number(priceRange.value))} 이하`,
    );
  };

  renderBrandGrid();
  renderFaceShapeGrid();
  renderMaterialGrid();

  document
    .querySelectorAll(".brand-grid, .face-shape-grid, .material-grid")
    .forEach(grid => {
      setExclusiveActive(grid, "[data-selection-option]", "active");
    });

  priceRange?.addEventListener("input", syncPriceRange);
  syncPriceRange();

  resetButton?.addEventListener("click", () => {
    window.location.reload();
  });
})();
