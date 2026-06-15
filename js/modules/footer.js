// 모바일 및 테블릿 푸터
export function renderMoblieSubFooter(){
  const target = document.querySelector(".sub-footer");
  target.innerHTML = `
    <div class="footer-inner container">
      <ul class="footer-nav" aria-label="고객센터 및 약관">
        <li><a href="#" aria-label="고객센터">고객센터</a></li>
        <li><a href="#" aria-label="개인정보 처리 방침">개인정보처리방침</a></li>
        <li><a href="#" aria-label="이용약관">이용약관</a></li>
      </ul>
      <p> &copy; ROUNZ AI Eyewear. All rights reserved.</p>
    </div>
  `
};

export function renderMoblieMainFooter(){
  const target = document.querySelector(".main-footer");
   target.innerHTML = `
   <div class="footer-inner container">
      <ul class="footer-nav" aria-label="고객센터 및 약관">
        <li><a href="#" aria-label="고객센터">고객센터</a></li>
        <li><a href="#" aria-label="개인정보 처리 방침">개인정보처리방침</a></li>
        <li><a href="#" aria-label="이용약관">이용약관</a></li>
      </ul>
      <ul class="footer-nav" aria-label="라운즈 서비스">
        <li><a href="#" aria-label="라운즈 앱">라운즈앱</a></li>
        <li><a href="#" aria-label="라운즈 해외">라운즈해외</a></li>
        <li><a href="#" aria-label="라운즈 파트너스">라운즈파트너스</a></li>
        <li><a href="#" aria-label="글라스 픽스">글라스픽스</a></li>
        <li><a href="#" aria-label="가맹문의">가맹문의</a></li>
      </ul>
      <ul class="footer-nav" aria-label="사업자 정보">
        <li><a href="#" aria-label="사업자 정보 확인">사업자정보확인</a></li>
        <li>
            <div>
              <p>(주)라운즈rounz사업자정보</p>
              <span class="material-icons" aria-label="더보기">expand_more</span>
              <span class="material-icons" aria-label="줄이기" hidden>expand_less</span>
            </div>
            <div class="hidden">
              <ul aria-label="주식회사 라운즈 사업자 정보">
                <li aria-label="상호명">상호명 : 주식회사 라운즈</li>
                <li aria-label="회사 대표">대표 : 김세민, 김명섭</li>
                <li><a href="#" aria-label="라운즈 강남역점">플래그십 스토어 : 서울시 강남구 역삼로 109 1층 (라운즈 강남역점)</a></li>
                <li><a href="#" aria-label="라운즈 판교점">경기도 성남시 분당구 판교역로 192번길 12 1층 (라운즈 판교점)</a></li>
                <li><a href="#" aria-label="사업자 주소">사업자 주소 : 서울특별시 강남구 강남대로94길 34, K&Y빌딩 4층</a></li>
                <li aria-label= "사업자 등록번호">사업자등록번호 : 119-86-02418</li>
                <li aria-label= "통신판매업 신고">통신판매업 신고 : 2016-서울강남-03811호</li>
                <li aria-label= "개인정보 관리책임자">개인정보관리책임자 : 김명섭</li>
                <li aria-label= "저작권">&copy;ROUNZ</li>
              </ul>
          </div>
        </li>
      </ul>
      <ul aria-label= "sns">
        <li><a href="#" aria-label ="facebook"><img src="../../img/footer_1.png" alt="facebook"></a></li>
        <li><a href="#" aria-label ="instargram"><img src="../../img/footer_2.png" alt="instargram"></a></li>
        <li><a href="#" aria-label ="naver blog"><img src="../../img/footer_3.png" alt="naverblog"></a></li>
      </ul>
      <p> &copy; ROUNZ AI Eyewear. All rights reserved.</p>
    </div>
  `
};


// PC 푸터