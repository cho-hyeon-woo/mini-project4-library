export default function BookDetail({ 
  selectedBook, 
  onStartEdit, 
  onDelete, 
  onClose,
  isReadOnly = false 
}) {
  
  if (!selectedBook) return null;

  const hasNoImage = 
    !selectedBook?.coverImageUrl || 
    selectedBook?.coverImageUrl === "";

  return (
    <section style={{ 
      width: "100%", 
      boxSizing: "border-box", 
      border: "1px solid #e2e8f0", 
      padding: "40px", 
      borderRadius: "15px", 
      background: "#fff", 
      position: "relative",
      marginTop: "30px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      animation: "fadeIn 0.5s ease-out"
    }}>
      
      {/* 닫기 버튼 */}
      <button 
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "#f1f5f9",
          border: "none",
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#64748b",
          fontSize: "16px",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
      >
        ✕
      </button>

      {/* 2단 메인 레이아웃 */}
      <div style={{ display: "flex", gap: "50px", alignItems: "flex-start" }}>
        
        {/* ◀ 좌측: 큼직한 도서 이미지 영역 */}
        <div style={{ flex: "0 0 350px" }}>
          <div style={{ 
            width: "100%", 
            height: "520px", 
            background: "#f8fafc", 
            borderRadius: "10px", 
            overflow: "hidden", 
            boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
            border: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {hasNoImage ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <span style={{ fontSize: "50px", display: "block", marginBottom: "10px" }}>📖</span>
                <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>등록된 표지가 없습니다</p>
              </div>
            ) : (
              <img 
                src={selectedBook.coverImageUrl} 
                alt="도서 표지" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            )}
          </div>
        </div>

        {/* ▶ 우측: 도서 상세 정보 영역 */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <span style={{ 
              display: "inline-block", 
              padding: "4px 12px", 
              background: "#eff6ff", 
              color: "#2563eb", 
              borderRadius: "20px", 
              fontSize: "12px", 
              fontWeight: "bold",
              marginBottom: "12px"
            }}>
              {selectedBook.genre || "일반도서"}
            </span>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "36px", color: "#1e293b", letterSpacing: "-1px" }}>
              {selectedBook.title}
            </h2>
            <p style={{ margin: 0, fontSize: "20px", color: "#475569", fontWeight: "500" }}>
              {selectedBook.author} <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "normal" }}>저자</span>
            </p>
          </div>

          <div style={{ 
            display: "flex", 
            gap: "20px", 
            borderTop: "1px solid #f1f5f9", 
            borderBottom: "1px solid #f1f5f9", 
            padding: "15px 0"
          }}>
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              <strong style={{ color: "#334155" }}>작성일:</strong> {new Date(selectedBook.createdAt).toLocaleDateString()}
            </div>
            {selectedBook.updatedAt && selectedBook.updatedAt !== selectedBook.createdAt && (
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                <strong style={{ color: "#334155" }}>최종 수정:</strong> {new Date(selectedBook.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          <div style={{ minHeight: "200px" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#334155", fontSize: "16px" }}>줄거리 및 본문</h4>
            <div style={{ 
              fontSize: "16px", 
              lineHeight: "1.8", 
              color: "#334155", 
              whiteSpace: "pre-wrap",
              background: "#f8fafc",
              padding: "25px",
              borderRadius: "8px",
              border: "1px solid #f1f5f9"
            }}>
              {selectedBook.content}
            </div>
          </div>

          {/* 마이페이지 등 관리자 모드일 때만 버튼 노출 */}
          {!isReadOnly && (
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button 
                onClick={onStartEdit}
                style={{ 
                  flex: 1, 
                  padding: "12px", 
                  background: "#1e293b", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "6px", 
                  cursor: "pointer", 
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
              >
                ✏️ 정보 수정하기
              </button>
              <button 
                onClick={() => onDelete(selectedBook.id)} 
                style={{ 
                  padding: "12px 24px", 
                  background: "#fee2e2", 
                  color: "#ef4444", 
                  border: "none", 
                  borderRadius: "6px", 
                  cursor: "pointer", 
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}