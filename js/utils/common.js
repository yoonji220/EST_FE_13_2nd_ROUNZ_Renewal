(function (global) {
  const escapeHtml = value =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const formatWon = value =>
    `${new Intl.NumberFormat("ko-KR").format(Number(value) || 0)}원`;

  const renderList = (container, items, renderItem) => {
    if (!container) {
      return;
    }

    container.innerHTML = items.map(renderItem).join("");
  };

  const setExclusiveActive = (container, selector, activeClass = "active") => {
    if (!container) {
      return;
    }

    container.addEventListener("click", event => {
      const button = event.target.closest(selector);
      if (!button || !container.contains(button)) {
        return;
      }

      const group =
        button.closest("[data-selection-group]") || button.parentElement;
      if (!group) {
        return;
      }

      group.querySelectorAll(selector).forEach(item => {
        item.classList.toggle(activeClass, item === button);
      });
    });
  };

  global.ROUNZCommon = {
    escapeHtml,
    formatWon,
    renderList,
    setExclusiveActive,
  };
})(window);
