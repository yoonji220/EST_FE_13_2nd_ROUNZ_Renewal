export function renderHeader() {
  const target = document.querySelector(".header");
  target.innerHTML = `
    <div class="main-header container d-flex justify-content-between align-items-center">
        <button type="button" class="btn-hamburger mobile-only" aria-label="메뉴 열기">
          <span class="typo-m-icons-xl-o">menu</span>
        </button>

        <h1 class="logo typo-m-h1"><a href="#">rounz</a></h1>

        <nav class="global-nav hide-menu">
          <div class="nav-top d-flex justify-content-between align-items-center mobile-only">
            <button type="button" class="btn-hamburger mobile-only" aria-label="메뉴 닫기">
              <span class="typo-m-icons-xl-o">close</span>
            </button>
            <h2 class="typo-m-header-l">메뉴</h2>
            <div></div>
          </div>

          <div class="d-flex">
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
                <li class="hr"><hr /></li>
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
                <div class="sub-menu">
                  <a class="d-flex justify-content-between align-items-center" href="#">선글라스 전체보기 <span class="typo-m-icons-m-o">chevron_right</span></a>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>모양</p>
                    <span class="typo-m-icons-m-o">chevron_right</span>
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
                    <span class="typo-m-icons-m-o">chevron_right</span>
                  </div>
                  <div class="sub-menu-item grid typo-m-body hide-menu">
                    <div><a href="#">Ray-Ban</a></div>
                    <div><a href="#">OAKLEY</a></div>
                    <div><a href="#">LE <br/>SPECS</a></div>
                    <div><a href="#">FAKEME</a></div>
                    <div><a href="#">YELLOW <br/> BEE</a></div>
                    <div><a href="#">더보기</a></div>
                  </div>
                </div>
                <a href="#" class="link-container" aria-label="신상품로 이동">
                  <div class="text-box typo-m-body" id="sunglasses-text-box">
                    <p>new arrivals</p>
                    <p>2026 선글라스 컬렉션</p>
                  </div>
                </a>
              </div>

              <div class="sub-menu-list d-flex flex-column g-3 hide-menu typo-m-header" data-submenu="glasses">
                <div class="sub-menu">
                  <a class="d-flex justify-content-between align-items-center" href="#">안경테 전체보기 <span class="typo-m-icons-m-o">chevron_right</span></a>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>모양</p>
                    <span class="typo-m-icons-m-o">chevron_right</span>
                  </div>
                  <div class="sub-menu-item shape-scroll-container typo-m-body hide-menu">
                    <div class="shape-item">
                      <img src="img/glass/1.png" alt="라운드 안경테" />
                      <a href="#">라운드</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/2.png"" alt="스퀘어 안경테" />
                      <a href="#">스퀘어</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/3.png"" alt="하금태 안경테" />
                      <a href="#">하금테</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/4.png"" alt="믹스 안경테" />
                      <a href="#">믹스</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/5.png"" alt="보잉 안경테" />
                      <a href="#">보잉</a>
                    </div>
                    <div class="shape-item">
                      <img src="img/glass/6.png"" alt="캣아이 안경테" />
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
                    <span class="typo-m-icons-m-o">chevron_right</span>
                  </div>
                  <div class="sub-menu-item grid typo-m-body hide-menu">
                    <div><a href="#">TART <br/> OPTICAL</a></div>
                    <div><a href="#">STEPHANE <br /> CHRISTIAN</a></div>
                    <div><a href="#">Ray-Ban</a></div>
                    <div><a href="#">NINE <br /> ACCORD</a></div>
                    <div><a href="#">YELLOW <br/> BEE</a></div>
                    <div><a href="#">더보기</a></div>
                  </div>
                </div>
                <a href="#" class="link-container" aria-label="신상품로 이동">
                  <div class="text-box typo-m-body" id="frame-text-box">
                    <p>new arrivals</p>
                    <p>2026 아이웨어 컬렉션</p>
                  </div>
                </a>
              </div>

              <div class="sub-menu-list d-flex flex-column g-3 hide-menu typo-m-header" data-submenu="best">
                <div class="sub-menu">
                  <a  class="d-flex justify-content-between align-items-center" href="#">베스트 상품 보기 <span class="typo-m-icons-m-o">chevron_right</span></a>
                </div>
                <div class="sub-menu">
                  <h2>인기 키워드</h2>
                  <hr />
                  <ul class="grid typo-m-body">
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
            <a href="#"><span class="typo-m-icons-xl-o">person</span></a>
          </li>
          <li aria-label="제품 검색">
            <a href="#"><span class="typo-m-icons-xl-o">search</span></a>
          </li>
          <li aria-label="장바구니">
            <a href="#"><span class="typo-m-icons-xl-o">shopping_bag</span></a>
          </li>
        </ul>
      </div>
  `;

  bindHeaderEvents(target);
}

function bindHeaderEvents(target){
  const btnOpen = target.querySelector('.btn-hamburger[aria-label="메뉴 열기"]');
  const btnClose = target.querySelector('.btn-hamburger[aria-label="메뉴 닫기"]');
  const globalNav = target.querySelector('.global-nav');
  const body = document.body;

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


  // 1. 탭 전환을 위한 요소들 찾기
  const menuButtons = target.querySelectorAll('.main-menu-item button[data-menu]');
  const menuItems = target.querySelectorAll('.main-menu-item');
  const subMenuLists = target.querySelectorAll('.sub-menu-list[data-submenu]');
  const isPc =window.matchMedia('(min-width: 1200px)');
  // 2. 서브 메뉴 아코디언(Accordion) 열고 닫기 로직
  // .sub-menu-list 안에서 컨텐츠를 열고 닫을 기준이 되는 .sub-menu(제목 부분)를 모두 찾습니다.
  const accordionHeaders = target.querySelectorAll('.sub-menu-list div > .sub-menu');
  

  menuButtons.forEach(button => {
    // 모바일용: 클릭 이벤트
    button.addEventListener('click', (e) => {
      if (!isPc.matches) { // PC가 아닐 때(모바일일 때)만 실행
        console.log('모바일: 클릭으로 서브메뉴 열기');
        // 클릭한 버튼의 data-menu 값 가져오기 (예: 'sunglasses', 'glasses' 등)
        const targetMenu = button.dataset.menu;

        // --- [메인 메뉴 스타일 처리] ---
        // 모든 메인 메뉴 항목에서 active 클래스 제거
        menuItems.forEach(item => item.classList.remove('active'));
        // 클릭한 버튼의 부모(li)에만 active 클래스 추가
        button.closest('.main-menu-item').classList.add('active');

        // --- [서브 메뉴 화면 처리] ---
        // 모든 서브 메뉴를 먼저 숨김 (hide-menu 추가)
        subMenuLists.forEach(subList => subList.classList.add('hide-menu'));
        
        // 클릭한 버튼과 똑같은 값을 가진 서브 메뉴만 찾아서 보여주기 (hide-menu 제거)
        const targetSubMenu = target.querySelector(`.sub-menu-list[data-submenu="${targetMenu}"]`);
        if (targetSubMenu) {
          targetSubMenu.classList.remove('hide-menu');
        }
      }

    });

    // PC용: 마우스 올렸을 때 이벤트
    button.addEventListener('mouseenter', (e) => {
      if (isPc.matches) { // PC일 때만 실행
        console.log('PC: 마우스 호버로 서브메뉴 열기');
        // PC용 드롭다운 열기 로직...
      }
    });
  });
  
    accordionHeaders.forEach(header => {
      header.addEventListener('click', function(e) {
        
        // 💡 [핵심 분기 처리] PC 화면일 때는 아코디언 동작을 막습니다.
      if (isPc.matches) {
          // PC에서 마우스를 올렸을 때의 동작 (예: 드롭다운 열기)
        }

        // --- 여기서부터는 모바일일 때만 실행되는 아코디언 로직 ---
        if (e.target.closest('a')) return;

        // 자바스크립트가 클릭한 요소 바로 밑에 있는 동생 태그(내용물)를 자동으로 찾습니다.
        const content = header.nextElementSibling;

        // 바로 밑에 실제 숨겨진 컨텐츠(.sub-menu-item)가 존재할 경우에만 실행
        if (content && content.classList.contains('sub-menu-item')) {
          // hide-menu 클래스를 토글하여 화면에 보였다가 숨겼다가를 제어합니다.
          content.classList.toggle('hide-menu');

          // (디테일 추가) 우측 화살표 아이콘 방향 변경
          const icon = header.querySelector('.typo-m-icons-m-o');
          if (icon) {
            // 메뉴가 열렸으면 아래 화살표(expand_more), 닫혔으면 오른쪽 화살표(chevron_right)로 변경
            const isHidden = content.classList.contains('hide-menu');
            icon.textContent = isHidden ? 'chevron_right' : 'expand_more';
          }
        }
      });
    });
    

}
