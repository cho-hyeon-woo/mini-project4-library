import { useState, useRef } from "react";
import { BookPlus, Home, Search, UserRound, LogIn, LogOut } from "lucide-react";

// 💡 Props에 isBgOn(상태)과 onToggleBg(함수)를 추가로 받아옵니다.
export default function Header({ isBgOn, onToggleBg, currentMenu, onMenuChange, searchQuery, setSearchQuery, currentUser, onLogout }) {
  const menuItems = [
    { id: "home", label: "홈", Icon: Home },
    { id: "register", label: "도서 등록하기", Icon: BookPlus },
    currentUser
      ? { id: "mypage", label: "마이 페이지", Icon: UserRound }
      : { id: "login", label: "로그인", Icon: LogIn },
  ];

  const boundingRef = useRef(null);
  const [glowStyle, setGlowStyle] = useState({ isHovered: false, x: 0, y: 0 });

  // 🖱️ 마우스가 움직일 때만 불빛을 켜고 좌표를 갱신
  const handleMouseMove = (e) => {
    if (!boundingRef.current) return;
    
    const bounds = boundingRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    
    setGlowStyle({ isHovered: true, x, y });
  };

  // 🖱️ 마우스가 떠나면 즉시 호버 스위치를 끄고 초기화
  const handleMouseLeave = () => {
    setGlowStyle({ isHovered: false, x: 0, y: 0 });
  };

  return (
    <header className="header-root" style={{ position: "relative" }}>
      

      {/* 🌾 [인터랙티브 리모델링] 마우스 위치에 반응하는 글로우 헤더 */}
      <div 
        ref={boundingRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="header-brand group"
        style={{
          width: "100%",
          textAlign: "center",
          padding: "45px 20px 30px 20px",
          borderRadius: "24px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
          cursor: "default",
          
          // 마우스가 올라와 있을 때(isHovered가 true)만 그라데이션 투사!
          background: glowStyle.isHovered 
            ? `radial-gradient(
                350px circle at ${glowStyle.x}px ${glowStyle.y}px,
                rgba(217, 119, 6, 0.09) 0%,
                rgba(247, 244, 238, 0.02) 50%,
                transparent 100%
              )`
            : "transparent",
            
          transition: "background 0.15s ease-out", 
        }}
      >
        {/* 뒤쪽 일러스트 배경과 부드럽게 섞이도록 선 하나 얹기 */}
        <div style={{
          position: "absolute",
          inset: 0,
          border: "1px solid rgba(217, 119, 6, 0.04)",
          borderRadius: "24px",
          pointerEvents: "none"
        }} />

        {/* 메인 영문 로고 */}
        <h1 
          style={{
            margin: "0 0 10px 0",
            fontSize: "36px",
            fontWeight: "800",
            fontFamily: "'Georgia', 'Times New Roman', serif", 
            color: "#1c1917",
            letterSpacing: "0.06em",
            position: "relative",
            zIndex: 2,
            textShadow: "0 2px 4px rgba(255, 255, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.6)"
          }}
        >
          Walking Library
        </h1>

        {/* 국문 감성 슬로건 (오타 정밀 교정) */}
        <p 
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: "600",
            color: "#b45309",
            letterSpacing: "0.2em",
            display: "flex",
            alignItems: "center", // 💡 기존 오타 수정 완료
            justifyContent: "center",
            gap: "12px",
            position: "relative",
            zIndex: 2,
            textShadow: "0 1px 2px rgba(255, 255, 255, 0.9)"
          }}
        >
          <span style={{ opacity: 0.3, fontWeight: "300" }}>—</span> 
          책과 산책하는 시간 
          <span style={{ opacity: 0.3, fontWeight: "300" }}>—</span>
        </p>
      </div>

      {/* 🔍 검색바 및 네비게이션 기능 유지 */}
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