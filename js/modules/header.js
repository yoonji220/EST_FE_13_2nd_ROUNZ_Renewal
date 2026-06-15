export function renderMoblieHeader() {
  const target = document.querySelector(".header");
  target.innerHTML = `
  <div>
        <!-- 햄버거 -->
        <span class="typo-m-icons-xl-o">menu</span>
        <nav>
          <div class="main-menu-panel">
            <ul>
              <li class="main-menu-item" aria-label="선글라스">
                <button type="button" data-menu="sunglasses">선글라스</button>
              </li>
              <li class="main-menu-item active" aria-label="안경테">
                <button type="button" data-menu="glasses">안경테</button>
              </li>
              <li class="main-menu-item" aria-label="베스트">
                <button type="button" data-menu="best">베스트</button>
              </li>
              <li class="main-menu-item" aria-label="브랜드">
                <button type="button" data-menu="brand">브랜드</button>
              </li>
              <li aria-label="라운즈에서만">라운즈only</li>
              <li aria-label="안경원">
                <a href="#">안경원</a><span class="typo-m-icons-l-o">arrow_outward</span>
              </li>
              <li aria-label="신상품">
                <a href="#">신상품</a><span class="typo-m-icons-l-o">arrow_outward</span>
              </li>
              <li aria-label="기획전">
                <a href="#">기획전</a><span class="typo-m-icons-l-o">arrow_outward</span>
              </li>
              <li aria-label="시리즈">
                <a href="#">시리즈</a><span class="typo-m-icons-l-o">arrow_outward</span>
              </li>
              <li aria-label="라운즈소개">
                <a href="#">라운즈소개</a><span class="typo-m-icons-l-o">arrow_outward</span>
              </li>
              <li aria-label="고객센터">
                <a href="#">고객센터</a><span class="typo-m-icons-l-o">arrow_outward</span>
              </li>
            </ul>
          </div>

          <div class="sub-menu-panel">
            <!-- 선글라스 메뉴 -->
            <div class="sub-menu-list" data-submenu="sunglasses">
              <div>
                <a href="#">선글라스 전체보기</a><span class="typo-m-icons-m-o">chevron_right</span>
              </div>
              <div>
                <div>
                  <p>모양</p>
                  <span class="typo-m-icons-m-o">expand_more</span>
                </div>
                <div class="swiper">
                  <div class="swiper-wrapper">
                    <div class="swiper-slide"><a href="#">라운드</a></div>
                    <div class="swiper-slide"><a href="#">스퀘어</a></div>
                    <div class="swiper-slide"><a href="#">하금테</a></div>
                    <div class="swiper-slide"><a href="#">고글</a></div>
                    <div class="swiper-slide"><a href="#">믹스</a></div>
                    <div class="swiper-slide"><a href="#">보잉</a></div>
                    <div class="swiper-slide"><a href="#">켓아이</a></div>
                    <div class="swiper-slide"><a href="#">기타</a></div>
                  </div>
                  <div class="swiper-scrollbar"></div>
                </div>
              </div>
              <div>
                <div>
                  <p>브랜드</p>
                  <span class="typo-m-icons-m-o">expand_more</span>
                </div>
                <div class="grid">
                  <div><a href="#" aria-label="레이벤">Ray-Ban</a></div>
                  <div><a href="#" aria-label="오클리">OAKLEY</a></div>
                  <div><a href="#" aria-label="르 스펙스">LE SPECS</a></div>
                  <div><a href="#" aria-label="페이크미">FAKEME</a></div>
                  <div><a href="#" aria-label="옐로우비">YELLOW BEE</a></div>
                  <div><a href="#" aria-label="브랜드 더보기">더보기</a></div>
                </div>
              </div>
              <a href="#" class="link-container" aria-label="신상품로 이동">
                <div class="text-box">
                  <p>new arrivals</p>
                  <p>2026 선글라스 컬렉션</p>
                </div>
              </a>
            </div>

            <!-- 안경테 메뉴 -->
            <div class="sub-menu-list" data-submenu="glasses">
              <div>
                <a href="#">선글라스 전체보기</a><span class="typo-m-icons-m-o">chevron_right</span>
              </div>
              <div>
                <div>
                  <p>모양</p>
                  <span class="typo-m-icons-m-o">expand_more</span>
                </div>
                <div class="swiper">
                  <div class="swiper-wrapper">
                    <div class="swiper-slide"><a href="#">라운드</a></div>
                    <div class="swiper-slide"><a href="#">스퀘어</a></div>
                    <div class="swiper-slide"><a href="#">하금테</a></div>
                    <div class="swiper-slide"><a href="#">믹스</a></div>
                    <div class="swiper-slide"><a href="#">보잉</a></div>
                    <div class="swiper-slide"><a href="#">켓아이</a></div>
                    <div class="swiper-slide"><a href="#">기타</a></div>
                  </div>
                  <div class="swiper-scrollbar"></div>
                </div>
              </div>
              <div>
                <div>
                  <p>브랜드</p>
                  <span class="typo-m-icons-m-o">expand_more</span>
                </div>
                <div class="grid">
                  <div><a href="#" aria-label="타르트 옵티컬">TART OPTICAL</a></div>
                  <div><a href="#" aria-label="스테판 크리스티앙">STEPHANE CHRISTIAN</a></div>
                  <div><a href="#" aria-label="레이벤">Ray-Ban</a></div>
                  <div><a href="#" aria-label="나인 어코드">NINE ACCORD</a></div>
                  <div><a href="#">YELLOW BEE</a></div>
                  <div><a href="#">더보기</a></div>
                </div>
              </div>
              <a href="#" class="link-container" aria-label="신상품로 이동">
                <div class="text-box">
                  <p>new arrivals</p>
                  <p>2026 아이웨어 컬렉션</p>
                </div>
              </a>
            </div>

            <!-- 베스트 메뉴 -->
            <div class="sub-menu-list" data-submenu="best">
              <div>
                <a href="#">베스트 상품 보기</a><span class="typo-m-icons-m-o">chevron_right</span>
              </div>
              <div>
                <h2>인기 키워드</h2>
                <ul>
                  <li><a href="#">&#035;티타늄 안경테</a></li>
                  <li><a href="#">&#035;동글이 안경테</a></li>
                  <li><a href="#">&#035;뿔테 안경테</a></li>
                  <li><a href="#">&#035;스포츠 고글</a></li>
                  <li><a href="#">&#035;투브릿지 안경테</a></li>
                  <li><a href="#">&#035;틴트 선글라스</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div class="top">
          <span class="typo-m-icons-m-o">close</span>
          <h2>메뉴</h2>
        </div>

        <!-- 로고 -->
        <h1 class="logo">rounz</h1>

        <!-- 바로가기 버튼들 -->

        <ul>
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
}
