import { useState } from "react";

export default function Header({ currentMenu, onMenuChange, searchQuery, setSearchQuery }) {
  const menuItems = [
    { id: "home", label: "홈" },
    { id: "register", label: "도서 등록하기" },
    { id: "mypage", label: "마이 페이지" },
  ];

  // 1. 최상단 배너 내 마우스 실시간 좌표 상태
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  // 2. 네비게이션 버튼 호버 상태 관리
  const [hoveredMenu, setHoveredMenu] = useState(null);

  // 마우스 움직임 감지 함수 (배너 내부 상대 좌표 계산)
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <header style={{ marginBottom: "30px", width: "100%" }}>
      
      {/* 1. 최상단 로고 박스 (실시간 마우스 추적 그라데이션 적용) */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
        style={{
          border: "1px solid #fed7aa",
          borderRadius: "16px",
          padding: "30px 20px",
          textAlign: "center",
          marginBottom: "20px",
          cursor: "default",
          position: "relative", // 💡 조명을 내부에 띄우기 위한 기준점
          overflow: "hidden",   // 💡 조명이 배너 밖으로 빠져나가지 않도록 커팅
          // 평소에도 부드러운 살구-노랑톤을 깔아두어 흰 바탕의 심심함을 제거!
          background: "linear-gradient(135deg, #fffaf3 0%, #fff7ed 50%, #fffbeb 100%)",
          boxShadow: isBannerHovered ? "0 4px 15px rgba(251, 146, 60, 0.06)" : "none",
          transition: "box-shadow 0.3s ease"
        }}
      >
        {/* ✨ [핵심 이펙트] 마우스 위치를 졸졸 따라다니는 주황빛 동적 그라데이션 원 */}
        <div style={{
          position: "absolute",
          pointerEvents: "none", // 텍스트나 마우스 이벤트를 방해하지 않음
          width: "400px",        // 조명 반경
          height: "400px",
          borderRadius: "50%",
          // 마우스 포인터 정중앙에 조명이 위치하도록 계산
          left: `${mousePos.x - 200}px`,
          top: `${mousePos.y - 200}px`,
          opacity: isBannerHovered ? 1 : 0, // 마우스가 들어왔을 때만 조명 켜짐
          // 중심은 따뜻한 주황빛, 외곽으로 갈수록 투명해지는 자연스러운 그라데이션
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, rgba(254, 215, 170, 0.05) 50%, transparent 80%)",
          filter: "blur(15px)", // 조명 경계선을 뭉개주어 은은하게 연출
          transition: "opacity 0.3s ease", // 들어오고 나갈 때 스르륵 페이드
          zIndex: 1
        }} />

        {/* 텍스트 콘텐츠 (조명보다 위에 오도록 zIndex 제어) */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "32px", color: "#431407", fontWeight: "bold", letterSpacing: "-0.03em" }}>
            Walking Library
          </h1>
          <p style={{ margin: 0, color: "#ea580c", fontSize: "14px", fontWeight: "600" }}>
            책과 산책하는 시간
          </p>
        </div>
      </div>

      {/* 2. 도서 검색바 */}
      <div style={{ display: "flex", marginBottom: "20px", width: "100%" }}>
        <input 
          type="text" 
          placeholder="도서 검색하기" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "1px solid #fed7aa",
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
            fontSize: "14px",
            outline: "none",
            color: "#431407",
            background: "#fff"
          }}
        />
        <button style={{
          padding: "0 25px",
          background: "linear-gradient(135deg, #ffa042 0%, #f97316 100%)", 
          border: "none",
          borderTopRightRadius: "12px",
          borderBottomRightRadius: "12px",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          🔍
        </button>
      </div>

      {/* 3. 네비게이션 버튼 */}
      <nav style={{ display: "flex", gap: "15px", width: "100%" }}>
        {menuItems.map((item) => {
          const isActive = currentMenu === item.id;
          const isMenuHovered = hoveredMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              onMouseEnter={() => setHoveredMenu(item.id)}
              onMouseLeave={() => setHoveredMenu(null)}
              style={{
                flex: 1,
                padding: "20px 10px",
                border: "1px solid #fed7aa",
                borderRadius: "12px",
                backgroundColor: isActive ? "#ffa042" : (isMenuHovered ? "#fff7ed" : "#fff"),
                color: isActive ? "#fff" : (isMenuHovered ? "#ea580c" : "#333"),
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: isActive ? "0 4px 8px rgba(234,88,12,0.15)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}