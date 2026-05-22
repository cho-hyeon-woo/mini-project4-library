export default function BookDetail({ selectedBook, onStartEdit, onDelete, onClose }) {
  const hasNoImage =
    !selectedBook?.coverImageUrl ||
    selectedBook?.coverImageUrl.includes("via.placeholder.com") ||
    selectedBook?.coverImageUrl === "";

  return (
    <section id="book-detail" className="book-detail">
      {selectedBook && (
        <button
          type="button"
          onClick={onClose}
          className="icon-button"
          title="상세 정보 닫기"
        >
          ✖
        </button>
      )}

      <h3 className="section-title">🔍 도서 상세 정보</h3>

      {selectedBook ? (
        <div className="book-detail__inner">
          <div className="book-detail__cover-panel">
            {hasNoImage ? (
              <div className="cover-placeholder">이미지가 없습니다</div>
            ) : (
              <img
                src={selectedBook.coverImageUrl}
                alt="표지 이미지"
                className="cover-image"
              />
            )}
          </div>

          <div className="book-detail__content-panel">
            <div className="book-detail__metadata">
              <h4 className="book-detail__title">{selectedBook.title}</h4>
              <p className="book-detail__author">저자: {selectedBook.author}</p>
              <p className="book-detail__timestamps">
                작성일: {selectedBook.createdAt} | 수정일: {selectedBook.updatedAt}
              </p>
              <p className="book-detail__content">{selectedBook.content}</p>
            </div>

            <div className="book-detail__actions">
              <button type="button" className="btn btn-secondary" onClick={onStartEdit}>
                수정하기
              </button>
              <button type="button" className="btn btn-danger" onClick={() => onDelete(selectedBook.id)}>
                삭제하기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="empty-state">목록에서 책을 선택하면 상세 내용이 표시됩니다.</p>
      )}
    </section>
  );
}
