export default function Header({ onWriteClick }) {
  return (
    <header id="app-header" className="app-header">
      <h1 id="app-title">📚 걷기가 서재 : 작가의 산책</h1>
      <button type="button" className="header-action btn btn-primary" onClick={onWriteClick}>
        책 작성하기
      </button>
    </header>
  );
}