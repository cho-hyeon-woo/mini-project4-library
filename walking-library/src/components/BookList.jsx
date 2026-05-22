export default function BookList({ books, selectedBook, onSelectBook, onDelete }) {
  return (
    <section id="book-list" className="book-list">
      <h3 className="section-title">📖 나의 도서 목록 ({books.length}권)</h3>
      <div className="book-list__grid">
        {books.map((book) => {
          const isCurrent = selectedBook?.id === book.id;
          const excerpt = book.content
            ? book.content.length > 100
              ? `${book.content.slice(0, 100)}...`
              : book.content
            : "내용이 없습니다.";

          return (
            <article
              key={book.id}
              id={`book-item-${book.id}`}
              className={`book-item ${isCurrent ? "selected" : ""}`}
              onClick={() => onSelectBook(book)}
              tabIndex={0}
            >
              <div className="book-item__cover-wrapper">
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={`${book.title} 표지`}
                    className="book-item__cover"
                  />
                ) : (
                  <div className="book-item__cover-placeholder">이미지 없음</div>
                )}
              </div>

              <div className="book-item__body">
                <strong className="book-item__title">{book.title}</strong>
                <p className="book-item__excerpt">{excerpt}</p>
                <div className="book-item__meta">작성자: {book.author}</div>
                <div className="book-item__meta">작성일: {book.createdAt}</div>
              </div>

              <button
                type="button"
                className="btn btn-danger book-item__delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(book.id);
                }}
              >
                삭제
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}