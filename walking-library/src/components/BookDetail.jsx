import { useState, useEffect } from "react";
import { BookOpen, FilePenLine, MousePointer2, Pencil, Trash2, X, Bookmark, Star, Send } from "lucide-react";
import { toast } from "react-toastify";
import ImageLightbox from "./ImageLightbox";

export default function BookDetail({
  selectedBook,
  onStartEdit,
  onDelete,
  onClose,
  books = [],
  onSelectBook = null,
  isMyPage = false,
  currentUser 
}) {
  const [lightboxImage, setLightboxImage] = useState(null);


  const [isBookmarked, setIsBookmarked] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  useEffect(() => {
    if (selectedBook && !isMyPage) {
      fetchBookmarkStatus();
      fetchAverageRating();
      fetchComments();
    }
  }, [selectedBook, isMyPage]);


  const fetchBookmarkStatus = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:8080/bookmarks/status?userId=${currentUser.userId}&bookId=${selectedBook.id}`);
      if (res.ok) {
        const status = await res.json();
        setIsBookmarked(status);
      }
    } catch (err) {
      console.error("북마크 상태 로드 실패:", err);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await fetch(`http://localhost:8080/stars/book/${selectedBook.id}/average`);
      if (res.ok) {
        const avg = await res.json();
        setAverageRating(avg);
      }
    } catch (err) {
      console.error("평균 별점 로드 실패:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8080/comments/book/${selectedBook.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("댓글 목록 로드 실패:", err);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!currentUser) {
      toast.warning("로그인 후 이용할 수 있습니다.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/bookmarks/bookmarking?userId=${currentUser.userId}&bookId=${selectedBook.id}`, { method: "POST" });
      if (res.ok) {
        setIsBookmarked(!isBookmarked);
        toast.success(!isBookmarked ? "북마크에 추가되었습니다." : "북마크가 취소되었습니다.");
      }
    } catch (err) {
      toast.error("북마크 처리에 실패했습니다.");
    }
  };


  const handleRateStar = async (score) => {
    if (!currentUser) {
      toast.warning("로그인 후 이용할 수 있습니다.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/stars/rate?userId=${currentUser.userId}&bookId=${selectedBook.id}&score=${score}`, { method: "POST" });
      if (res.ok) {
        toast.success(`${score}점을 주셨습니다!`);
        fetchAverageRating();
      }
    } catch (err) {
      toast.error("별점 등록에 실패했습니다.");
    }
  };


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warning("로그인 후 이용할 수 있습니다.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/comments/add?userId=${currentUser.userId}&bookId=${selectedBook.id}&content=${encodeURIComponent(newComment)}`, { method: "POST" });
      if (res.ok) {
        setNewComment("");
        fetchComments();
        toast.success("댓글이 등록되었습니다.");
      }
    } catch (err) {
      toast.error("댓글 등록에 실패했습니다.");
    }
  };

  const handleCommentEditStart = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditCommentContent(comment.content);
  };

  const handleCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleCommentEditSave = async (commentId) => {
    if (!editCommentContent.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editCommentContent }),
      });
      if (res.ok) {
        setEditingCommentId(null);
        setEditCommentContent("");
        fetchComments();
        toast.success("댓글이 수정되었습니다.");
      } else {
        toast.error("댓글 수정에 실패했습니다.");
      }
    } catch (err) {
      toast.error("댓글 수정에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:8080/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        fetchComments();
        toast.success("댓글이 삭제되었습니다.");
      } else {
        toast.error("댓글 삭제에 실패했습니다.");
      }
    } catch (err) {
      toast.error("댓글 삭제에 실패했습니다.");
    }
  };

  const formatUserInfo = (name, loginId) => {
    const safeName = name || "사용자";
    const safeId = loginId || "user";
    const maskedId = safeId.length > 2 ? safeId.substring(0, 2) + "****" : safeId + "****";
    return `${safeName}(${maskedId})`;
  };

  const formatCommentDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

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

  if (!selectedBook) return null;
  const hasNoImage = !selectedBook?.coverImageUrl || selectedBook?.coverImageUrl === "";

  return (
    <section className="book-detail-section" style={{ paddingBottom: "40px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginBottom: "15px" }}>
        <button 
          onClick={handleBookmarkToggle} 
          style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: isBookmarked ? "#d97706" : "#94a3b8", fontWeight: "bold" }}
        >
          <Bookmark size={22} fill={isBookmarked ? "currentColor" : "none"} />
          {isBookmarked ? "북마크 됨" : "북마크"}
        </button>
        <button className="book-detail-close close-button" onClick={onClose} aria-label="상세 닫기" style={{ position: "static" }}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div style={{ display: "flex", gap: "50px", alignItems: "flex-start", marginBottom: "40px" }}>
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
            <h2 style={{ margin: "5px 0 10px 0", fontSize: "36px", color: "#1e293b", letterSpacing: "-1px" }}>{selectedBook.title}</h2>
            <p style={{ margin: 0, fontSize: "20px", color: "#475569", fontWeight: "500" }}>
              {selectedBook.author} <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "normal" }}>저자</span>
            </p>
          </div>

          {/* 🌟 별점 인터랙션 영역 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "#fbbf24" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                fill={star <= (hoverRating || averageRating) ? "currentColor" : "none"}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRateStar(star)}
                style={{ cursor: "pointer", transition: "all 0.1s" }}
              />
            ))}
            <span style={{ marginLeft: "8px", color: "#64748b", fontSize: "14px", fontWeight: "bold" }}>
            </span>
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

      {/* 🌟 댓글 목록 및 입력 창 영역 */}
      <div style={{ borderTop: "2px solid #1e293b", paddingTop: "20px" }}>
        <h3 style={{ fontSize: "22px", margin: "0 0 20px 0", color: "#0f172a" }}>댓글 ({comments.length})</h3>
        
        <div style={{ marginBottom: "20px", border: "1px solid #f1f5f9", borderRadius: "8px", padding: "15px" }}>
          {comments.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px 0", fontSize: "14px" }}>첫 번째 댓글을 남겨보세요!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.commentId} style={{ borderBottom: "1px solid #e2e8f0", padding: "15px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <div>
                    <strong style={{ fontSize: "15px", color: "#1e293b" }}>
                      {formatUserInfo(comment.userName, comment.loginId)}
                    </strong>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                      {formatCommentDate(comment.createdAt)}
                    </div>
                  </div>
                  {currentUser?.userId === comment.userId && (
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      {editingCommentId === comment.commentId ? (
                        <>
                          <button onClick={() => handleCommentEditSave(comment.commentId)} style={{ background: "none", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer", color: "#0f172a" }}>저장</button>
                          <button onClick={handleCommentEditCancel} style={{ background: "none", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer", color: "#64748b" }}>취소</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleCommentEditStart(comment)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "4px" }} title="수정">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleCommentDelete(comment.commentId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }} title="삭제">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingCommentId === comment.commentId ? (
                  <input
                    type="text"
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "15px" }}
                  />
                ) : (
                  <p style={{ margin: "5px 0", fontSize: "15px", color: "#334155", lineHeight: "1.5", textAlign: "left", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{comment.content}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* 댓글 작성창 */}
        <form onSubmit={handleCommentSubmit} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={currentUser ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
            disabled={!currentUser}
            style={{ flex: 1, padding: "12px 15px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }}
          />
          <button 
            type="submit" 
            disabled={!currentUser || !newComment.trim()}
            style={{ padding: "0 20px", background: "#ffa042", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <Send size={16} /> 등록
          </button>
        </form>
      </div>

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}