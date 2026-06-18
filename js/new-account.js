const accountForm = document.querySelector('form');
const requiredInputs = accountForm.querySelectorAll('input[required]');

// 1. 에러 메시지를 판별해주는 전용 함수
function getErrorMessage(input) {
  if (input.type === 'checkbox' && !input.checked) return "필수 약관에 동의해 주세요.";
  if (!input.value.trim() && input.type !== 'checkbox') return "필수 입력란을 작성해 주세요.";
  
  if (input.type === 'email' && !input.checkValidity()) return "올바른 이메일 형식을 입력해 주세요.";
  
  if (input.id === 'userpw') {
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*~]).{8,}$/;
    if (!pwRegex.test(input.value)) {
      return "영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요.";
    }
  }
  
  if (input.id === 'userpwc') {
    const originalPw = document.getElementById('userpw').value;
    if (input.value !== originalPw) {
      return "비밀번호가 일치하지 않습니다.";
    }
  }

  // 인증번호 유효성 검사 (숫자로만 딱 6자리)
  if (input.id === 'validate_number') { 
    const certRegex = /^\d{6}$/;
    if (!certRegex.test(input.value)) {
      return "인증번호 6자리를 정확히 입력해 주세요.";
    }
  }

  return ""; 
}

// 2. 제출(submit) 버튼 클릭 시 검사
accountForm.addEventListener('submit', function(event) {
  event.preventDefault(); 

  let isFormValid = true; 

  requiredInputs.forEach(input => {
    const parentDiv = input.closest('.field') || input.closest('.d-flex.justify-content-between');
    const feedbackSpan = parentDiv ? parentDiv.querySelector('.feedback') : null;

    const errorMsg = getErrorMessage(input);

    if (errorMsg) {
      isFormValid = false; 
      if (feedbackSpan) {
        feedbackSpan.textContent = errorMsg;
        // ✅ 에러가 있을 때 alert 클래스 추가
        feedbackSpan.classList.add('alert'); 
      }
    } else {
      if (feedbackSpan) {
        feedbackSpan.textContent = ""; 
        // ✅ 정상 입력 시 alert 클래스 제거
        feedbackSpan.classList.remove('alert'); 
      }
    }
  });

  if (isFormValid) {
    window.location.href = "login.html"; 
  }
});

// 3. 사용자가 입력하는 즉시 실시간 피드백
requiredInputs.forEach(input => {
  input.addEventListener('input', function() {
    const parentDiv = input.closest('.field') || input.closest('.d-flex.justify-content-between');
    const feedbackSpan = parentDiv ? parentDiv.querySelector('.feedback') : null;

    if (feedbackSpan) {
      const errorMsg = getErrorMessage(input);
      
      if (!errorMsg) {
        feedbackSpan.textContent = ""; 
        // ✅ 실시간으로 정상 입력되면 alert 클래스 제거
        feedbackSpan.classList.remove('alert'); 
      } else {
        feedbackSpan.textContent = errorMsg; 
        // ✅ 실시간으로 에러가 발생하면 alert 클래스 추가
        feedbackSpan.classList.add('alert'); 
      }
    }
  });
});

// ----------------------------------------------------------------------
// 4. 전체 동의 체크박스 로직
const agreeAllCheckbox = document.getElementById('allagree'); 

if (agreeAllCheckbox) {
  const otherCheckboxes = accountForm.querySelectorAll('input[type="checkbox"]:not(#allagree)');

  agreeAllCheckbox.addEventListener('change', function() {
    const isChecked = this.checked; 
    
    otherCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked; 
      checkbox.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  otherCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const allChecked = Array.from(otherCheckboxes).every(cb => cb.checked);
      agreeAllCheckbox.checked = allChecked;
    });
  });
}