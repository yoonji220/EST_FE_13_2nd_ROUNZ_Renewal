/* ============================================================
   login.js — 로그인 폼 스크립트
   ============================================================ */

import { renderHeader } from './modules/header.js';
import { renderFooter } from './modules/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter(window.innerWidth < 1200);

  // 화면 리사이즈 시 푸터 변경
  window.addEventListener("resize", () => {
    const footerContainer = document.querySelector(".footer .container");
    if (footerContainer) {
      if (window.innerWidth < 1200) {
        footerContainer.classList.remove("footer-main");
        footerContainer.classList.add("footer-simple");
      } else {
        footerContainer.classList.remove("footer-simple");
        footerContainer.classList.add("footer-main");
      }
    }
  });

  const loginForm = document.querySelector('.login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const btnLoginSubmit = document.getElementById('btn-login-submit');

  // 간단한 이메일 형식 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 로그인 버튼 클릭 시 이벤트
  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener('click', () => {
      const emailValue = emailInput.value.trim();
      const passwordValue = passwordInput.value.trim();

      // 1. 빈 값 체크
      if (!emailValue) {
        alert('이메일을 입력해주세요.');
        emailInput.focus();
        return;
      }

      if (!passwordValue) {
        alert('비밀번호를 입력해주세요.');
        passwordInput.focus();
        return;
      }

      // 2. 이메일 형식 체크
      if (!emailRegex.test(emailValue)) {
        alert('유효한 이메일 형식이 아닙니다.');
        emailInput.focus();
        return;
      }

      // 실제 로그인 API 연동이 들어가는 부분 (가상 처리)
      console.log('로그인 시도:', { email: emailValue });
      alert('로그인이 완료되었습니다! (임시)');
      
      // 메인 페이지로 이동 (예시)
      // window.location.href = 'index.html';
    });
  }

  // 폼에서 엔터(Enter) 키 입력 시 로그인 버튼 클릭 처리
  if (loginForm) {
    loginForm.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // 폼 기본 제출 막기
        btnLoginSubmit.click();
      }
    });
  }
});
