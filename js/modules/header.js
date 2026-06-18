export function renderHeader() {
  const target = document.querySelector(".header");
  target.innerHTML = `
    <div class="main-header container d-flex justify-content-between align-items-center">
        <button type="button" class="btn-hamburger mobile-only" aria-label="메뉴 열기">
          <span class="typo-m-icons-xl-o">menu</span>
        </button>

        <h1 class="logo typo-m-h1"><a href="index.html">rounz</a></h1>

        <nav class="global-nav hide-menu">
          <div class="nav-top d-flex justify-content-between align-items-center mobile-only">
            <button type="button" class="btn-hamburger mobile-only" aria-label="메뉴 닫기">
              <span class="typo-m-icons-xl-o">close</span>
            </button>
            <h2 class="typo-m-header-l">메뉴</h2>
            <div></div>
          </div>

          <div class="menu-wrapper d-flex">
            <div class="main-menu-panel d-flex flex-column">
              <ul class="typo-m-header-s">
                <li class="main-menu-item">
                  <button type="button" data-menu="sunglasses">선글라스</button>
                </li>
                <li class="main-menu-item">
                  <button type="button" data-menu="glasses">안경테</button>
                </li>
                <li class="main-menu-item">
                  <button type="button" data-menu="best">베스트</button>
                </li>
                <li><a href="#">브랜드</a></li>
                <li><a href="#">라운즈only</a></li>
                <li class="header-hr"><hr /></li>
                <li>
                  <a href="#">안경원 <span class="typo-m-icons-l-o mobile-only">arrow_outward</span></a>
                </li>
                <li>
                  <a href="#">신상품<span class="typo-m-icons-l-o mobile-only">arrow_outward</span></a>
                </li>
                <li>
                  <a href="#">기획전 <span class="typo-m-icons-l-o mobile-only">arrow_outward</span></a>
                </li>
                <li>
                  <a href="#">시리즈 <span class="typo-m-icons-l-o mobile-only">arrow_outward</span></a>
                </li>
                <li>
                  <a href="#">라운즈소개 <span class="typo-m-icons-l-o mobile-only">arrow_outward</span></a>
                </li>
                <li>
                  <a href="#">고객센터 <span class="typo-m-icons-l-o mobile-only">arrow_outward</span></a>
                </li>
              </ul>
            </div>

            <div class="sub-menu-panel">
              <div class="sub-menu-list d-flex flex-column g-3 hide-menu typo-m-header" data-submenu="sunglasses">
                <div class="sub-menu sub-menu-all">
                  <a class="d-flex justify-content-between align-items-center" href="filters.html">선글라스 전체보기 <span class="typo-m-icons-m-o">chevron_right</span></a>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>모양</p>
                    <span class="typo-m-icons-m-o mobile-only">chevron_right</span>
                  </div>
                  <div class="sub-menu-item shape-scroll-container typo-m-body hide-menu">
                    <div class="shape-item">
                      <img src="img/sunglasses/1.png" alt="라운드 선글라스" />
                      <a href="#">라운드</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/sunglasses/2.png" alt="스퀘어 선글라스" />
                      <a href="#">스퀘어</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/sunglasses/3.png" alt="하금테 선글라스" />
                      <a href="#">하금테</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/sunglasses/4.png" alt="고글" />
                      <a href="#">고글</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/sunglasses/5.png" alt="믹스 선글라스" />
                      <a href="#">믹스</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/sunglasses/6.png" alt="보잉 선글라스" />
                      <a href="#">보잉</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/sunglasses/7.png" alt="캣아이 선글라스" />
                      <a href="#">캣아이</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/sunglasses/8.png" alt="기타 선글라스" />
                      <a href="#">기타</a>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>브랜드</p>
                    <span class="typo-m-icons-m-o mobile-only">chevron_right</span>
                  </div>
                  <div class="sub-menu-item sub-menu-grid typo-m-body hide-menu">
                    <div><a href="#">Ray-Ban</a></div>
                    <div><a href="#">OAKLEY</a></div>
                    <div><a href="#">LE <br class="mobile-only" />SPECS</a></div>
                    <div><a href="#">FAKEME</a></div>
                    <div><a href="#">YELLOW <br class="mobile-only" /> BEE</a></div>
                    <div><a href="#">더보기</a></div>
                  </div>
                </div>
                <a href="filters.html" class="link-container mobile-only" aria-label="신상품로 이동">
                  <div class="text-box typo-m-body " id="sunglasses-text-box">
                    <p>new arrivals</p>
                    <p>2026 선글라스 컬렉션</p>
                  </div>
                </a>
              </div>

              <div class="sub-menu-list d-flex flex-column g-3 hide-menu typo-m-header" data-submenu="glasses">
                <div class="sub-menu sub-menu-all">
                  <a class="d-flex justify-content-between align-items-center" href="filters.html">안경테 전체보기 <span class="typo-m-icons-m-o">chevron_right</span></a>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>모양</p>
                    <span class="typo-m-icons-m-o mobile-only">chevron_right</span>
                  </div>
                  <div class="sub-menu-item shape-scroll-container typo-m-body hide-menu">
                    <div class="shape-item">
                      <img src="img/glass/1.png" alt="라운드 안경테" />
                      <a href="#">라운드</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/2.png" alt="스퀘어 안경테" />
                      <a href="#">스퀘어</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/3.png" alt="하금태 안경테" />
                      <a href="#">하금테</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/4.png" alt="믹스 안경테" />
                      <a href="#">믹스</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/5.png" alt="보잉 안경테" />
                      <a href="#">보잉</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/6.png" alt="캣아이 안경테" />
                      <a href="#">캣아이</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/7.png" alt="기타 안경테" />
                      <a href="#">기타</a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>브랜드</p>
                    <span class="typo-m-icons-m-o mobile-only">chevron_right</span>
                  </div>
                  <div class="sub-menu-item sub-menu-grid typo-m-body hide-menu">
                    <div><a href="#">TART <br class="mobile-only" /> OPTICAL</a></div>
                    <div><a href="#">STEPHANE <br class="mobile-only" /> CHRISTIAN</a></div>
                    <div><a href="#">Ray-Ban</a></div>
                    <div><a href="#">NINE <br class="mobile-only" /> ACCORD</a></div>
                    <div><a href="#">YELLOW <br class="mobile-only" /> BEE</a></div>
                    <div><a href="#">더보기</a></div>
                  </div>
                </div>
                <a href="filters.html" class="link-container mobile-only" aria-label="신상품로 이동">
                  <div class="text-box typo-m-body" id="frame-text-box">
                    <p>new arrivals</p>
                    <p>2026 아이웨어 컬렉션</p>
                  </div>
                </a>
              </div>

              <div class="sub-menu-list d-flex flex-column g-3 hide-menu typo-m-header" data-submenu="best">
                <div class="sub-menu">
                  <a  class="d-flex justify-content-between align-items-center" href="filters.html">베스트 상품 보기 <span class="typo-m-icons-m-o">chevron_right</span></a>
                </div>
                <div>
                  <h2>인기 키워드</h2>
                  <hr class="mobile-only" />
                  <ul class="sub-menu-grid typo-m-body">
                    <li><a href="#">#티타늄 안경테</a></li>
                    <li><a href="#">#동글이 안경테</a></li>
                    <li><a href="#">#뿔테 안경테</a></li>
                    <li><a href="#">#스포츠 고글</a></li>
                    <li><a href="#">#투브릿지 안경테</a></li>
                    <li><a href="#">#뿔테 선글라스</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <ul class="d-flex g-1 shortcut-menu">
          <li aria-label="회원 로그인">
            <a href="login.html"><span class="typo-m-icons-xl-o">person</span></a>
          </li>
          <li aria-label="제품 검색">
            <a href="filters.html"><span class="typo-m-icons-xl-o">search</span></a>
          </li>
          <li aria-label="장바구니">
            <a class="cart-link" href="cart.html">
            <span class="typo-m-icons-xl-o">shopping_bag</span>
            <span class="cart-badge typo-m-btn-s text-center">22</span>
            </a>
          </li>
        </ul>
      </div>
  `;

  bindHeaderEvents(target);

  adjustSubPagePadding();

  window.addEventListener('resize', adjustSubPagePadding);
}

 function bindHeaderEvents(target){
  const btnOpen = target.querySelector('.btn-hamburger[aria-label="메뉴 열기"]');
  const btnClose = target.querySelector('.btn-hamburger[aria-label="메뉴 닫기"]');
  const globalNav = target.querySelector('.global-nav');
  const body = document.body;

  // 요소 찾기
  const menuButtons = target.querySelectorAll('.main-menu-item button[data-menu]');
  const menuItems = target.querySelectorAll('.main-menu-item');
  const subMenuPanel = target.querySelector('.sub-menu-panel');
  const subMenuLists = target.querySelectorAll('.sub-menu-list[data-submenu]');
  const accordionHeaders = target.querySelectorAll('.sub-menu-list div > .sub-menu');
  const subMenuItems = target.querySelectorAll('.sub-menu-item');

  // 화면 크기 감지 (1200px 기준)
  const isPc = window.matchMedia('(min-width: 1200px)');

  // 최초 로드 시 PC화면이면 메뉴 보이기
  if(isPc.matches){
    globalNav.classList.remove('hide-menu');
    subMenuPanel.classList.add('hide-menu');
    subMenuItems.forEach(subitems => subitems.classList.remove('hide-menu'));
  }else{
    globalNav.classList.add('hide-menu');
    subMenuPanel.classList.remove('hide-menu');
  }

  // ==========================================
  // 📦 1. [함수 분리] 모바일 전용 로직
  // ==========================================
  const openMobileSubMenu = (button, targetMenu) => {
    menuItems.forEach(item => item.classList.remove('active'));
    button.closest('.main-menu-item').classList.add('active');

    subMenuLists.forEach(subList => subList.classList.add('hide-menu'));
    const targetSubMenu = target.querySelector(`.sub-menu-list[data-submenu="${targetMenu}"]`);
    if (targetSubMenu) targetSubMenu.classList.remove('hide-menu');
  };

  // ==========================================
  // 📦 2. [함수 분리] PC 전용 로직
  // ==========================================
  const openPcMegaMenu = (button, targetMenu) => {
    if(subMenuPanel) subMenuPanel.classList.remove('hide-menu');
    menuItems.forEach(item => item.classList.remove('active'));
    button.closest('.main-menu-item').classList.add('active');

    subMenuLists.forEach(subList => subList.classList.add('hide-menu'));
    const targetSubMenu = target.querySelector(`.sub-menu-list[data-submenu="${targetMenu}"]`);
    if (targetSubMenu) targetSubMenu.classList.remove('hide-menu');
  };

  const closePcMegaMenu = () => {
    if(subMenuPanel) subMenuPanel.classList.add('hide-menu');
    subMenuLists.forEach(subList => subList.classList.add('hide-menu'));
    menuItems.forEach(item => item.classList.remove('active'));
  };

  // ==========================================
  // 🧹 3. [핵심] 리사이징 시 버그 방지 (초기화 로직)
  // ==========================================
  const resetMenuState = (e) => {
    // 1) 공통 초기화: 활성화된 메뉴 및 패널 모두 닫기
    menuItems.forEach(item => item.classList.remove('active'));
    subMenuLists.forEach(subList => subList.classList.add('hide-menu'));

    if (e.matches) {
      // 💻 모바일 -> PC로 화면이 커졌을 때
      globalNav.classList.remove('hide-menu', 'open'); // 모바일 전체메뉴 흔적 제거
      body.classList.remove('body-no-scroll');         // 스크롤 잠금 해제
      subMenuItems.forEach(item => item.classList.remove('hide-menu')); // PC는 아코디언 항상 펼침
      subMenuPanel.classList.add('hide-menu');
    } else {
      // 📱 PC -> 모바일로 화면이 작아졌을 때
      globalNav.classList.add('hide-menu');            // 모바일 메뉴 기본 숨김
      globalNav.classList.remove('open');
      body.classList.remove('body-no-scroll');
      subMenuItems.forEach(item => item.classList.add('hide-menu')); // 모바일 아코디언 닫기
      subMenuPanel.classList.remove('hide-menu');
      
      // 아코디언 화살표 아이콘 초기화 (우측 방향)
      const icons = target.querySelectorAll('.typo-m-icons-m-o');
      icons.forEach(icon => icon.textContent = 'chevron_right');
    }
  };

  // 💡 window.matchMedia의 'change' 이벤트를 활용하여 화면 크기 교차점을 감지
  isPc.addEventListener('change', resetMenuState);


  // ==========================================
  // 🎧 4. 이벤트 바인딩 (실제 이벤트 동작 연결)
  // ==========================================
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      globalNav.classList.remove('hide-menu');
      globalNav.classList.add('open');
      body.classList.add('body-no-scroll');
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      globalNav.classList.add('hide-menu');
      globalNav.classList.remove('open');
      body.classList.remove('body-no-scroll');
    });
  }

  // 탭 메뉴 버튼 이벤트
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!isPc.matches) openMobileSubMenu(button, button.dataset.menu);
    });

    button.addEventListener('mouseenter', () => {
      if (isPc.matches) openPcMegaMenu(button, button.dataset.menu);
    });
  });

  // PC 메가메뉴 마우스 아웃 이벤트
  const menuWrapper = target.querySelector('.menu-wrapper');
  if (menuWrapper) {
    menuWrapper.addEventListener('mouseleave', () => {
      if (isPc.matches) closePcMegaMenu();
    });
  }
  
  // 모바일 아코디언 메뉴 이벤트
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function(e) {
      if (isPc.matches) return; // PC일 땐 클릭해도 아무 동작 안 함 (이미 초기화 로직에서 다 펼쳐둠)

      if (e.target.closest('a')) return;
      
      const content = header.nextElementSibling;
      if (content && content.classList.contains('sub-menu-item')) {
        content.classList.toggle('hide-menu');
        
        const icon = header.querySelector('.typo-m-icons-m-o');
        if (icon) {
          const isHidden = content.classList.contains('hide-menu');
          icon.textContent = isHidden ? 'chevron_right' : 'expand_more';
        }
      }
    });
  });
}


// 헤더 높이에 맞춰 서브 페이지 상단 여백을 동적으로 조절하는 함수
function adjustSubPagePadding() {
  const header = document.querySelector('.header');
  const subPage = document.querySelector('.sub-page');

  if (header && subPage) {
    // 헤더의 실제 렌더링된 높이를 픽셀 단위로 가져옵니다.
    const headerHeight = header.offsetHeight;
    
    // 서브 페이지의 padding-top을 헤더 높이와 똑같이 맞춰줍니다.
    subPage.style.paddingTop = `${headerHeight}px`;
  }
}