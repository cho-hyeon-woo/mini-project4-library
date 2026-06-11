import { BookPlus, Home, Search, UserRound, LogIn, LogOut } from "lucide-react";

export default function Header({ currentMenu, onMenuChange, searchQuery, setSearchQuery, currentUser, onLogout }) {
  const menuItems = [
    { id: "home", label: "홈", Icon: Home },
    { id: "register", label: "도서 등록하기", Icon: BookPlus },
    currentUser
      ? { id: "mypage", label: "마이 페이지", Icon: UserRound }
      : { id: "login", label: "로그인", Icon: LogIn },
  ];

  return (
    <header className="header-root">
      
      {/* 🌾 [리모델링 구역] 딱딱한 박스를 허물고 배경 위에 얹은 매거진 스타일 로고 */}
      <div 
        className="header-brand" // 기존 클래스명은 유지하되, 감성 스타일 덮어쓰기
        style={{
          width: "100%",
          textAlign: "center",
          padding: "35px 20px 20px 20px", // 위아래 여백을 주어 타이틀에 웅장함 부여
          background: "none",            // 하얀색 사각 장벽 제거
          border: "none",                // 딱딱한 테두리선 제거
          boxShadow: "none",             // 기존 그림자 초기화
          boxSizing: "border-box"
        }}
      >
        {/* 메인 영문 로고 */}
        <h1 
          style={{
            margin: "0 0 10px 0",
            fontSize: "36px",
            fontWeight: "800",
            // 💡 고풍스럽고 아날로그한 책방 무드를 내는 정통 영문 세리프(Serif) 서체
            fontFamily: "'Georgia', 'Times New Roman', serif", 
            color: "#1c1917", // 묵직하고 깊은 먹색
            letterSpacing: "0.06em", // 자간을 시원하게 벌려 휑함을 고급진 여백으로 치환
            // 💡 중요: 승헌님이 넣으신 일러스트 배경 위에서도 글씨가 칼같이 정갈하게 읽히도록 소프트 외곽광 주입
            textShadow: "0 2px 4px rgba(255, 255, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.6)"
          }}
        >
          Walking Library
        </h1>

        {/* 국문 감성 슬로건 */}
        <p 
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: "600",
            color: "#b45309", // 밀밭/일러스트 톤과 결을 같이하는 황금빛 앰버 브라운
            letterSpacing: "0.2em", // 슬로건 글자 사이도 리드미컬하게 벌리기
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            textShadow: "0 1px 2px rgba(255, 255, 255, 0.9)"
          }}
        >
          <span style={{ opacity: 0.3, fontWeight: "300" }}>—</span> 
          책과 산책하는 시간 
          <span style={{ opacity: 0.3, fontWeight: "300" }}>—</span>
        </p>
      </div>

      {/* 🔍 아래 기능형 검색바 및 네비게이션 탭은 기존 로직 그대로 100% 보존 */}
      <div className="header-search-row">
        <input
          type="text"
          className="header-search-input"
          placeholder="도서 검색하기"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="header-search-btn search-button">
          <Search size={18} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <div className="header-nav">
        <nav className="header-nav-tabs nav-tabs">
          {menuItems.map((item) => {
            const isActive = currentMenu === item.id;
            const { Icon } = item;
            return (
              <button
                key={item.id}
                className={`header-nav-tab nav-tab${isActive ? " header-nav-tab--active" : ""}`}
                onClick={() => onMenuChange(item.id)}
              >
                <Icon size={19} strokeWidth={2.1} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {currentUser && (
          <button className="header-logout-btn" onClick={onLogout} title="로그아웃">
            <LogOut size={18} strokeWidth={2} />
            로그아웃
          </button>
        )}
      </div>
    </header>
  );
}