//푸터
// 
export function renderFooter(isSimple = false) {
  const target = document.querySelector(".footer");

  const footerModeClass = isSimple ? "footer-simple" : "footer-main";

  const mainFooterHTML = isSimple ? ``: `
        <div>
          <h2 class="pc-only">패밀리 사이트</h2>
          <ul class="footer-nav d-flex g-2">
            <li><a href="#">라운즈앱</a></li>
            <li><a href="#">라운즈해외</a></li>
            <li><a href="#">라운즈파트너스</a></li>
            <li><a href="#">글라스박스</a></li>
            <li><a href="#">가맹문의</a></li>
          </ul>
        </div>

        <div class="pc-only">
          <h2>고객센터</h2>
          <p>1522-0416</p>
          <p>평일 09:00 - 18:00</p>
          <p>주말&middot;공휴일 휴무</p>
        </div>

        
        <div class="mobile-only d-flex g-2">
        <a href="#">사업자정보확인</a>
        <div class="d-flex">
        <p>(주) 라운즈rounz사업장정보</p>
        <button type="button" aria-expanded="false" aria-label="사업자 정보 펼치기" class="info-toggle-btn">
        <span class="material-icons" aria-hidden="true">expand_more</span>
        </button>
        </div>
        </div>
        
        <hr class="contianer pc-only"/>

        <div class="rounz-info">
          <ul>
            <li>상호명 : 주식회사 라운즈</li>
            <li>대표 : 김세민, 김명섭</li>
            <li>사업자등록번호 : 119-86-02418</li>
            <li>통신판매업 신고 : 2016-서울강남-03811호</li>
            <li>개인정보관리책임자 : 김명섭</li>
          </ul>
          <ul>
            <li>대표전화: 1522-0416</li>
            <li>사업자 주소 : 서울특별시 강남구 강남대로94길 34, K&Y빌딩 4층</li>
            <li><a href="#">사업자정보확인</a></li>
          </ul>
        </div>
        
        <div class="mobile-only">
          <ul class="d-flex g-2">
            <li><a href="#"><img src="../../img/footer_1.png" alt="Facebook"></a></li>
            <li><a href="#"><img src="../../img/footer_2.png" alt="Instagram"></a></li>
            <li><a href="#"><img src="../../img/footer_3.png" alt="Naver Blog"></a></li>
          </ul>
        </div>
  `;

  target.innerHTML = `
      <div class="container d-flex flex-column ${footerModeClass}">
        <div class="pc-only">
            <div>
            <h2>ROUNZ</h2>
            <p>세상에 없던 안경 쇼핑</p>
            <ul>
              <li><a href="#"><img src="../../img/footer_1.png" alt="Facebook"></a></li>
              <li><a href="#"><img src="../../img/footer_2.png" alt="Instagram"></a></li>
              <li><a href="#"><img src="../../img/footer_3.png" alt="Naver Blog"></a></li>
            </ul>
            </div>

          <div>
            <h2>고객지원</h2>
            <ul class="footer-nav">
              <li><a href="#">고객센터</a></li>
              <li><a href="#">공지사항</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">이용약관</a></li>
              <li><a href="#">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>

        <div class="mobile-only">
          <ul class="footer-nav d-flex g-2">
            <li><a href="#">고객센터</a></li>
            <li><a href="#">개인정보처리방침</a></li>
            <li><a href="#">이용약관</a></li>
          </ul>
        </div>

        ${mainFooterHTML}
     
        <p>&copy; ROUNZ. All rights reserved.</p>
        
      </div>
  `;
}
