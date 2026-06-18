export function renderFloatingBar(){
  const target = document.querySelector('.floating-bar');

  target.innerHTML = `
     <a href="#" class="floating-btn floating-btn--top" aria-label="맨 위로 이동">
        <span class="typo-m-icons-xl-o">keyboard_double_arrow_up</span>
      </a>

      <button type="button" class="floating-btn floating-btn--chat" aria-label="채팅 상담">
        <span class="typo-m-icons-xs-o">comment</span>
      </button>
  `;
}