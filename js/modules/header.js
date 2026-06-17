export function renderHeader() {
  const target = document.querySelector(".header");
  target.innerHTML = `
    <div class="container d-flex justify-content-between align-items-center">
        <button type="button" class="btn-hamburger mobile-only" aria-label="메뉴 열기">
          <span class="typo-m-icons-xl-o">menu</span>
        </button>

        <h1 class="logo"><a href="#">rounz</a></h1>

        <nav class="global-nav visually-hidden">
          <div class="nav-top d-flex justify-content-between align-items-center mobile-only">
            <button type="button" class="btn-hamburger mobile-only" aria-label="메뉴 닫기">
              <span class="typo-m-icons-xl-o">close</span>
            </button>
            <h2>메뉴</h2>
            <div></div>
          </div>

          <div class="d-flex">
            <div class="main-menu-panel d-flex flex-column">
              <ul>
                <li class="main-menu-item">
                  <button type="button" data-menu="sunglasses">선글라스</button>
                </li>
                <li class="main-menu-item active">
                  <button type="button" data-menu="glasses">안경테</button>
                </li>
                <li class="main-menu-item">
                  <button type="button" data-menu="best">베스트</button>
                </li>
                <li class="main-menu-item">
                  <button type="button" data-menu="brand">브랜드</button>
                </li>
                <li><a href="#">라운즈only</a></li>
                <li class="hr"><hr /></li>
                <li>
                  <a href="#">안경원</a>
                  <span class="typo-m-icons-l-o mobile-only">arrow_outward</span>
                </li>
                <li>
                  <a href="#">신상품</a>
                  <span class="typo-m-icons-l-o mobile-only">arrow_outward</span>
                </li>
                <li>
                  <a href="#">기획전</a>
                  <span class="typo-m-icons-l-o mobile-only">arrow_outward</span>
                </li>
                <li>
                  <a href="#">시리즈</a>
                  <span class="typo-m-icons-l-o mobile-only">arrow_outward</span>
                </li>
                <li>
                  <a href="#">라운즈소개</a>
                  <span class="typo-m-icons-l-o mobile-only">arrow_outward</span>
                </li>
                <li>
                  <a href="#">고객센터</a>
                  <span class="typo-m-icons-l-o mobile-only">arrow_outward</span>
                </li>
              </ul>
            </div>

            <div class="sub-menu-panel">
              <div class="sub-menu-list d-flex flex-column g-3 visually-hidden" data-submenu="sunglasses">
                <div class="sub-menu d-flex justify-content-between align-items-center">
                  <a href="#">선글라스 전체보기</a>
                  <span class="typo-m-icons-m-o">chevron_right</span>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>모양</p>
                    <span class="typo-m-icons-m-o">chevron_right</span>
                  </div>
                  <div class="sub-menu-item shape-scroll-container ">
                    <div class="shape-item">
                      <img src="#" alt="라운드 선글라스" />
                      <a href="#">라운드</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="스퀘어 선글라스" />
                      <a href="#">스퀘어</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="하금테 선글라스" />
                      <a href="#">하금테</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="고글" />
                      <a href="#">고글</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="믹스 선글라스" />
                      <a href="#">믹스</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="보잉 선글라스" />
                      <a href="#">보잉</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="캣아이 선글라스" />
                      <a href="#">캣아이</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="기타 선글라스" />
                      <a href="#">기타</a>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>브랜드</p>
                    <span class="typo-m-icons-m-o">chevron_right</span>
                  </div>
                  <div class="sub-menu-item grid ">
                    <div><a href="#">Ray-Ban</a></div>
                    <div><a href="#">OAKLEY</a></div>
                    <div><a href="#">LE <br/>SPECS</a></div>
                    <div><a href="#">FAKEME</a></div>
                    <div><a href="#">YELLOW <br/> BEE</a></div>
                    <div><a href="#">더보기</a></div>
                  </div>
                </div>
                <a href="#" class="link-container" aria-label="신상품로 이동">
                  <div class="text-box" id="sunglasses-text-box">
                    <p>new arrivals</p>
                    <p>2026 선글라스 컬렉션</p>
                  </div>
                </a>
              </div>

              <div class="sub-menu-list d-flex flex-column g-3 visually-hidden" data-submenu="glasses">
                <div class="sub-menu d-flex justify-content-between align-items-center">
                  <a href="#">안경테 전체보기</a><span class="typo-m-icons-m-o">chevron_right</span>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>모양</p>
                    <span class="typo-m-icons-m-o">chevron_right</span>
                  </div>
                  <div class="sub-menu-item shape-scroll-container visually-hidden">
                    <div class="shape-item">
                      <img src="img/filters_img/peuleim/1.round.png" alt="라운드 안경테" />
                      <a href="#">라운드</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="스퀘어 안경테" />
                      <a href="#">스퀘어</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="하금태 안경테" />
                      <a href="#">하금테</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="믹스 안경테" />
                      <a href="#">믹스</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="보잉 안경테" />
                      <a href="#">보잉</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="캣아이 안경테" />
                      <a href="#">캣아이</a>
                    </div>
                    <div class="shape-item">
                      <img src="#" alt="기타 안경테" />
                      <a href="#">기타</a>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="sub-menu d-flex justify-content-between align-items-center">
                    <p>브랜드</p>
                    <span class="typo-m-icons-m-o">chevron_right</span>
                  </div>
                  <div class="sub-menu-item grid visually-hidden">
                    <div><a href="#">TART <br/> OPTICAL</a></div>
                    <div><a href="#">STEPHANE <br /> CHRISTIAN</a></div>
                    <div><a href="#">Ray-Ban</a></div>
                    <div><a href="#">NINE <br /> ACCORD</a></div>
                    <div><a href="#">YELLOW <br/> BEE</a></div>
                    <div><a href="#">더보기</a></div>
                  </div>
                </div>
                <a href="#" class="link-container" aria-label="신상품로 이동">
                  <div class="text-box" id="frame-text-box">
                    <p>new arrivals</p>
                    <p>2026 아이웨어 컬렉션</p>
                  </div>
                </a>
              </div>

              <div class="sub-menu-list d-flex flex-column g-3 visually-hidden" data-submenu="best">
                <div class="sub-menu d-flex justify-content-between align-items-center">
                  <a href="#">베스트 상품 보기</a>
                  <span class="typo-m-icons-m-o">chevron_right</span>
                </div>
                <div class="sub-menu">
                  <h2>인기 키워드</h2>
                  <hr />
                  <ul class="grid">
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
}
