(function () {
  const { escapeHtml, formatWon, renderList, setExclusiveActive } =
    window.ROUNZCommon;

  const filterRows = [
    {
      label: "BRAND",
      options: [{ label: "ROUNZ", selected: true }, { label: "RECNZ" }],
    },
    {
      label: "COLOR",
      options: [
        { label: "BLACK", selected: true },
        { label: "SILVER" },
        { label: "PINK" },
      ],
    },
  ];

  const sortOptions = [
    { label: "신상품순", active: true },
    { label: "인기순" },
    { label: "낮은가순" },
  ];

  const products = [
    {
      image:
        "https://www.figma.com/api/mcp/asset/04745885-97aa-40ec-b479-1306bb3767e7",
      alt: "Modern black framed eyeglasses",
      brand: "BRAND NAME 1",
      nameLines: ["Product Model", "Identifier 1"],
      price: 128000,
      colors: ["black", "gray", "pink"],
    },
    {
      image:
        "https://www.figma.com/api/mcp/asset/a5c3ac45-25d0-4786-b695-d7b96bfd67d9",
      alt: "Elegant gold metal frame eyeglasses",
      brand: "BRAND NAME 2",
      nameLines: ["Product Model", "Identifier 2"],
      price: 128000,
      colors: ["black", "gray", "pink"],
    },
    {
      image:
        "https://www.figma.com/api/mcp/asset/1912b724-edfb-4e15-893e-ab4e518125a1",
      alt: "Classic round tortoise shell eyeglasses",
      brand: "BRAND NAME 3",
      nameLines: ["Product Model", "Identifier 3"],
      price: 128000,
      colors: ["black", "gray", "pink"],
    },
    {
      image:
        "https://www.figma.com/api/mcp/asset/e28983f4-3118-4627-88c0-95a4eac76e00",
      alt: "Trendy clear acetate eyeglasses",
      brand: "BRAND NAME 4",
      nameLines: ["Product Model", "Identifier 4"],
      price: 128000,
      colors: ["black", "gray", "pink"],
    },
  ];

  const filterToggle = document.getElementById("filter-toggle");
  const filterToggleIcon = document.getElementById("filter-toggle-icon");
  const filterPanel = document.getElementById("filter-panel");
  const sortToggle = document.getElementById("sort-toggle");
  const sortCurrent = document.getElementById("sort-current");
  const sortOptionsPanel = document.getElementById("sort-options");
  const productGrid = document.getElementById("product-grid");
  const scrollTopButton = document.getElementById("scroll-top");

  const renderFilterPanel = () => {
    if (!filterPanel) {
      return;
    }

    filterPanel.innerHTML = filterRows
      .map(
        row => `
          <div class="filter-row" data-selection-group>
            <span>${escapeHtml(row.label)}</span>
            ${row.options
              .map(
                option => `
                  <button
                    class="${option.selected ? "selected" : ""}"
                    data-filter-option
                    type="button"
                  >
                    ${escapeHtml(option.label)}
                  </button>
                `,
              )
              .join("")}
          </div>
        `,
      )
      .join("");
  };

  const renderSortOptions = () => {
    if (!sortOptionsPanel) {
      return;
    }

    sortOptionsPanel.innerHTML = sortOptions
      .map(
        option => `
          <button
            class="sort-option${option.active ? " active" : ""}"
            data-sort-option
            type="button"
          >
            ${escapeHtml(option.label)}
          </button>
        `,
      )
      .join("");

    sortOptionsPanel.hidden = true;
  };

  const renderProducts = () => {
    if (!productGrid) {
      return;
    }

    renderList(productGrid, products, product => {
      const colorMarkup = product.colors
        .map((color, index) => {
          const isSelected = index === 0;
          return `<span class="swatch ${escapeHtml(color)}${isSelected ? " selected" : ""}"></span>`;
        })
        .join("");

      return `
        <article class="filter-product-card">
          <div class="product-image">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}">
          </div>
          <div class="product-meta">
            <span class="brand-name">${escapeHtml(product.brand)}</span>
            <h2>${escapeHtml(product.nameLines[0])}<br>${escapeHtml(product.nameLines[1])}</h2>
            <div class="price-row">
              <strong>${formatWon(product.price)}</strong>
              <button class="favorite-btn" type="button" aria-label="Favorite" aria-pressed="false">
                <span class="material-symbols-outlined">favorite_border</span>
              </button>
            </div>
            <div class="color-swatches">
              ${colorMarkup}
            </div>
          </div>
        </article>
      `;
    });
  };

  const syncSortState = selectedButton => {
    if (!sortCurrent || !sortOptionsPanel || !selectedButton) {
      return;
    }

    sortCurrent.textContent = selectedButton.textContent.trim();
    sortOptionsPanel.hidden = true;
    sortToggle?.setAttribute("aria-expanded", "false");
  };

  const bindSharedActions = () => {
    filterToggle?.addEventListener("click", () => {
      const willOpen = Boolean(filterPanel?.hidden);

      if (filterPanel) {
        filterPanel.hidden = !willOpen;
      }

      filterToggle?.setAttribute("aria-expanded", String(willOpen));

      if (filterToggleIcon) {
        filterToggleIcon.textContent = willOpen ? "expand_less" : "expand_more";
      }
    });

    sortToggle?.addEventListener("click", event => {
      event.stopPropagation();
      if (!sortOptionsPanel) {
        return;
      }

      const willOpen = Boolean(sortOptionsPanel.hidden);
      sortOptionsPanel.hidden = !willOpen;
      sortToggle.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", event => {
      if (!sortOptionsPanel || !sortToggle) {
        return;
      }

      if (
        !sortToggle.contains(event.target) &&
        !sortOptionsPanel.contains(event.target)
      ) {
        sortOptionsPanel.hidden = true;
        sortToggle.setAttribute("aria-expanded", "false");
      }
    });

    sortOptionsPanel?.addEventListener("click", event => {
      const button = event.target.closest("[data-sort-option]");
      if (!button) {
        return;
      }

      sortOptionsPanel.querySelectorAll("[data-sort-option]").forEach(item => {
        item.classList.toggle("active", item === button);
      });

      syncSortState(button);
    });

    productGrid?.addEventListener("click", event => {
      const favoriteButton = event.target.closest(".favorite-btn");
      if (!favoriteButton) {
        return;
      }

      const icon = favoriteButton.querySelector(".material-symbols-outlined");
      const isActive = favoriteButton.classList.toggle("active");

      favoriteButton.setAttribute("aria-pressed", String(isActive));

      if (icon) {
        icon.textContent = isActive ? "favorite" : "favorite_border";
      }
    });

    scrollTopButton?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  renderFilterPanel();
  renderSortOptions();
  renderProducts();
  bindSharedActions();

  document.querySelectorAll(".filter-row").forEach(row => {
    setExclusiveActive(row, "[data-filter-option]", "selected");
  });

  if (sortOptionsPanel) {
    setExclusiveActive(sortOptionsPanel, "[data-sort-option]", "active");
  }

  if (sortOptions.length > 0 && sortCurrent) {
    sortCurrent.textContent =
      sortOptions.find(option => option.active)?.label ?? sortOptions[0].label;
  }
})();
