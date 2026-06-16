const tabButtons = document.querySelectorAll(".product-tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach(btn => {
      btn.classList.toggle("is-active", btn === button);
    });

    tabPanels.forEach(panel => {
      const isActive = panel.dataset.panel === target;

      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  });
});
