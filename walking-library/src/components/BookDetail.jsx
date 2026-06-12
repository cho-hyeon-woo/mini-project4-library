import { useState } from "react";
import { BookOpen, FilePenLine, MousePointer2, Pencil, Trash2, X } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

export default function BookDetail({
  selectedBook,
  onStartEdit,
  onDelete,
  onClose,
  books = [],
  onSelectBook = null,
  isMyPage = false
}) {
  const [lightboxImage, setLightboxImage] = useState(null);

  if (isMyPage) {
    return (
      <>
      <div className="mypage-layout">

        {/* 좌측: 도서 목록 */}
        <div className="mypage-sidebar">
          <h4 className="mypage-sidebar-title">
            <FilePenLine size={17} aria-hidden="true" />
            작성한 도서 목록 ({books.length})
          </h4>
          <div className="mypage-sidebar-list">
            {books.map((book) => {
              const isSelected = book.id === selectedBook?.id;
              return (
                <div
                  key={book.id}
                  className="mypage-book-item"
                  onClick={() => onSelectBook && onSelectBook(book)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: isSelected ? "#eff6ff" : "#f8fafc",
                    border: isSelected ? "1px solid #3b82f6" : "1px solid #e2e8f0",
                  }}
                >
                  <div className="mypage-book-thumb">
                    {book.coverImageUrl
                      ? <img src={book.coverImageUrl} alt={book.title} />
                      : <BookOpen size={18} aria-hidden="true" color="#cbd5e1" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: "block", fontSize: "13px", color: isSelected ? "#1d4ed8" : "#334155", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {book.title}
                    </strong>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{book.author}</span>
                  </div>
                </div>
              );
            })}
            {books.length === 0 && (
              <p className="mypage-sidebar-empty">등록된 도서가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 우측: 상세 정보 */}
        <div className="mypage-content">
          {selectedBook ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {selectedBook.coverImageUrl ? (
                <div
                  style={{ maxWidth: "100%", maxHeight: "320px", display: "flex", justifyContent: "center", borderRadius: "8px", overflow: "hidden", cursor: "zoom-in" }}
                  onClick={() => setLightboxImage(selectedBook.coverImageUrl)}
                >
                  <img src={selectedBook.coverImageUrl} alt="표지" style={{ display: "block", maxWidth: "100%", maxHeight: "320px", width: "auto", height: "auto" }} />
                </div>
              ) : (
                <div style={{ width: "200px", height: "290px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <BookOpen size={24} aria-hidden="true" />
                    표지 없음
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "center" }}>
                <div>
                  <span className="genre-badge genre-badge--sm">{selectedBook.genre || "일반"}</span>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "26px", color: "#1e293b" }}>{selectedBook.title}</h3>
                  <p style={{ margin: 0, fontSize: "15px", color: "#475569" }}>{selectedBook.author} 작가</p>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "8px 0", fontSize: "12px", color: "#64748b" }}>
                  <strong>작성일:</strong> {selectedBook.createdAt ? new Date(selectedBook.createdAt).toLocaleDateString() : "미지정"}
                </div>

                <div style={{ textAlign: "left" }}>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#334155" }}>줄거리 정보</h4>
                  <div className="content-box">{selectedBook.content}</div>
                </div>

                {selectedBook.tags && (
                  <div style={{ textAlign: "left" }}>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#334155" }}>#태그</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {selectedBook.tags.split(",").map((tag, idx) => (
                        <span key={idx} style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "20px", padding: "4px 10px", fontSize: "12px" }}>
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
                  <button
                    className="edit-button"
                    onClick={onStartEdit}
                    style={{ flex: 1, padding: "10px", background: "#1e293b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <Pencil size={15} aria-hidden="true" />
                    정보 수정하기
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(selectedBook.id)}
                    style={{ padding: "10px 20px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mypage-content-empty">
              <MousePointer2 size={42} style={{ marginBottom: "10px" }} aria-hidden="true" />
              <p>좌측 목록에서 확인 혹은 관리할 도서를 선택해 주세요.</p>
            </div>
          )}
        </div>
      </div>
      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
      </>
    );
  }

  // 홈 화면 상세 보기 (읽기 전용)
  if (!selectedBook) return null;
  const hasNoImage = !selectedBook?.coverImageUrl || selectedBook?.coverImageUrl === "";

  return (
    <section className="book-detail-section">
      <button className="book-detail-close close-button" onClick={onClose} aria-label="상세 닫기">
        <X size={18} aria-hidden="true" />
      </button>
      <div style={{ display: "flex", gap: "50px", alignItems: "flex-start" }}>
        {hasNoImage ? (
          <div style={{ flex: "0 0 350px", width: "350px", height: "520px", background: "#f8fafc", borderRadius: "10px", boxShadow: "0 15px 35px rgba(0,0,0,0.15)", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <BookOpen size={52} style={{ marginBottom: "10px" }} aria-hidden="true" />
              <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>등록된 표지가 없습니다</p>
            </div>
          </div>
        ) : (
          <div
            style={{ flexShrink: 0, maxWidth: "350px", maxHeight: "520px", background: "#f8fafc", borderRadius: "10px", overflow: "hidden", boxShadow: "0 15px 35px rgba(0,0,0,0.15)", border: "1px solid #f1f5f9", cursor: "zoom-in" }}
            onClick={() => setLightboxImage(selectedBook.coverImageUrl)}
          >
            <img src={selectedBook.coverImageUrl} alt="도서 표지" style={{ display: "block", maxWidth: "350px", maxHeight: "520px", width: "auto", height: "auto" }} />
          </div>
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <span className="genre-badge">{selectedBook.genre || "일반도서"}</span>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "36px", color: "#1e293b", letterSpacing: "-1px" }}>{selectedBook.title}</h2>
            <p style={{ margin: 0, fontSize: "20px", color: "#475569", fontWeight: "500" }}>
              {selectedBook.author} <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "normal" }}>저자</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: "20px", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "15px 0" }}>
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              <strong>작성일:</strong> {selectedBook.createdAt ? new Date(selectedBook.createdAt).toLocaleDateString() : "미지정"}
            </div>
          </div>
          <div>
            <h4 style={{ margin: "0 0 10px 0", color: "#334155", fontSize: "16px" }}>줄거리 및 본문</h4>
            <div className="content-box content-box--lg">{selectedBook.content}</div>
          </div>
          {selectedBook.tags && (
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {selectedBook.tags.split(",").map((tag, idx) => (
                  <span key={idx} style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "20px", padding: "4px 10px", fontSize: "12px" }}>
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}