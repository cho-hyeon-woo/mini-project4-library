import { useState, useEffect, useRef } from "react";
import { BookOpen, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Header from "./components/Header";
import RegisterPage from "./pages/RegisterPage";
import BookDetail from "./components/BookDetail";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const dbAddress = "http://localhost:8080/books";

  const [currentUser, setCurrentUser] = useState(null);
  const [currentMenu, setCurrentMenu] = useState("home");
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [randomBook, setRandomBook] = useState(null);

  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [detailViewSource, setDetailViewSource] = useState(null);
  const recommendDetailRef = useRef(null);
  const listDetailRef = useRef(null);

  const [showAccountEdit, setShowAccountEdit] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountPassword, setAccountPassword] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const fetchBooks = async () => {
    try {
      const res = await fetch(dbAddress);
      if (!res.ok) throw new Error("도서 목록을 불러오지 못했습니다.");
      const data = await res.json();
      setBooks(data);
      if (data.length > 0 && !randomBook) {
        setRandomBook(data[Math.floor(Math.random() * data.length)]);
      }
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("정말 이 책을 삭제하시겠습니까?")) {
      try {
        const res = await fetch(`${dbAddress}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("도서 삭제 요청에 실패했습니다.");
        setSelectedBook(null);
        setDetailViewSource(null);
        if (randomBook?.id === id) setRandomBook(null);
        fetchBooks();
        toast.success("도서가 삭제되었습니다.");
      } catch (err) {
        toast.error(err.message || "도서 삭제에 실패했습니다.");
      }
    }
  };

  const startEdit = () => {
    setIsEditing(true);
    setCurrentMenu("register");
  };

  const handleUpdateAccount = async () => {
    try {
      const res = await fetch(`http://localhost:8080/users/${currentUser.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: accountName, password: accountPassword }),
      });
      if (!res.ok) throw new Error("회원 정보 수정에 실패했습니다.");
      const updated = await res.json();
      setCurrentUser(updated);
      setShowAccountEdit(false);
      toast.success("회원 정보가 수정되었습니다.");
    } catch (err) {
      toast.error(err.message || "회원 정보 수정에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("정말 회원 탈퇴하시겠습니까? 탈퇴 시 복구할 수 없습니다.")) return;
    try {
      const res = await fetch(`http://localhost:8080/users/${currentUser.userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("회원 탈퇴에 실패했습니다.");
      setCurrentUser(null);
      setShowAccountEdit(false);
      setCurrentMenu("home");
      handleCloseDetail();
      toast.success("회원 탈퇴가 완료되었습니다.");
    } catch (err) {
      toast.error(err.message || "회원 탈퇴에 실패했습니다.");
    }
  };

  const handleOpenDetail = (book, source) => {
    setSelectedBook(book);
    setDetailViewSource(source);
    setTimeout(() => {
      if (source === "recommend" && recommendDetailRef.current) {
        recommendDetailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (source === "list" && listDetailRef.current) {
        listDetailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
    setDetailViewSource(null);
  };

  return (
    <>
      <div className="app-shell" style={{ padding: "20px", width: "100%", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif", background: "#fff", boxSizing: "border-box" }}>
        <Header
          currentMenu={currentMenu}
          onMenuChange={(menu) => {
            if (menu === "login") { setCurrentMenu("login"); return; }
            if ((menu === "register" || menu === "mypage") && !currentUser) {
              toast.warning("로그인이 필요한 서비스입니다.");
              setCurrentMenu("login");
              return;
            }
            setCurrentMenu(menu);
            handleCloseDetail();
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentMenu("home");
            setShowAccountEdit(false);
            handleCloseDetail();
            toast.info("로그아웃 되었습니다.");
          }}
        />

        {/* 로그인 화면 */}
        {currentMenu === "login" && (
          <LoginPage
            onLogin={(user) => {
              setCurrentUser(user);
              setCurrentMenu("home");
              toast.success(`${user.name}님, 환영합니다!`);
            }}
            onGoRegister={() => setCurrentMenu("signup")}
          />
        )}

        {/* 회원가입 화면 */}
        {currentMenu === "signup" && (
          <SignupPage
            onSignupSuccess={(user) => {
              setCurrentUser(user);
              setCurrentMenu("home");
              toast.success(`${user.name}님, 회원가입을 축하합니다!`);
            }}
            onGoLogin={() => setCurrentMenu("login")}
          />
        )}

        {/* 홈 화면 */}
        {currentMenu === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%" }}>

            {/* 이 달의 추천 도서 */}
            {randomBook && !searchQuery && (
              <section className="recommend-section section-card">
                <h3 className="section-title">이 달의 추천 도서</h3>
                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                  <div style={{ width: "120px", height: "180px", background: "#ccc", borderRadius: "4px", flexShrink: 0, overflow: "hidden", border: "1px solid #bbb" }}>
                    {randomBook.coverImageUrl
                      ? <img src={randomBook.coverImageUrl} alt="표지" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ textAlign: "center", padding: "5px", fontSize: "11px", color: "#666" }}>생성된 이미지가 없습니다!</div>}
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <h4 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#333" }}>{randomBook.title}</h4>
                    <p style={{ margin: "0 0 10px 0", color: "#555", fontWeight: "bold" }}>
                      {randomBook.author} <span style={{ fontWeight: "normal", color: "#999", fontSize: "13px" }}>글쓴이</span>
                    </p>
                    <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px", lineHeight: "1.4" }}>{randomBook.content}</p>
                    <span className="detail-link" style={{ cursor: "pointer", color: "#007bff", fontSize: "13px", fontWeight: "bold" }} onClick={() => handleOpenDetail(randomBook, "recommend")}>
                      [자세히 보기]
                    </span>
                  </div>
                </div>
                <div ref={recommendDetailRef}>
                  <AnimatePresence mode="wait">
                    {selectedBook && detailViewSource === "recommend" && (
                      <motion.div
                        key={`recommend-${selectedBook.id}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      >
                        <BookDetail selectedBook={selectedBook} onClose={handleCloseDetail} isReadOnly={true} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* 도서 목록 */}
            <section className="book-list-section section-card">
              <h3 className="section-title">
                <BookOpen size={19} aria-hidden="true" />
                도서 목록 ({filteredBooks.length}권)
              </h3>
              <div className="book-grid">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    className="book-card"
                    onClick={() => handleOpenDetail(book, "list")}
                    style={{ textAlign: "center", cursor: "pointer", border: "1px solid #eee", padding: "10px", borderRadius: "6px", background: "#fff", boxSizing: "border-box" }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  >
                    <div className="book-cover-wrap">
                      {book.coverImageUrl
                        ? <img src={book.coverImageUrl} alt={book.title} />
                        : <span className="book-cover-placeholder">{book.title}</span>}
                    </div>
                    <strong className="book-card-title">{book.title}</strong>
                    <span className="book-card-author">{book.author}</span>
                  </motion.div>
                ))}
              </div>
              {filteredBooks.length === 0 && <p className="book-empty">검색된 도서가 없습니다.</p>}

              <div ref={listDetailRef}>
                <AnimatePresence mode="wait">
                  {selectedBook && detailViewSource === "list" && (
                    <motion.div
                      key={`list-${selectedBook.id}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <BookDetail selectedBook={selectedBook} onClose={handleCloseDetail} isReadOnly={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        )}

        {/* 도서 등록/수정 페이지 */}
        {currentMenu === "register" && (
          <RegisterPage
            dbAddress={dbAddress}
            currentUser={currentUser}
            selectedBook={selectedBook}
            isEditing={isEditing}
            onSaveSuccess={() => {
              setIsEditing(false);
              setSelectedBook(null);
              handleCloseDetail();
              fetchBooks();
              setCurrentMenu("home");
            }}
            onCancel={() => {
              setIsEditing(false);
              setSelectedBook(null);
              setCurrentMenu("home");
            }}
          />
        )}

        {/* 마이 페이지 */}
        {currentMenu === "mypage" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#1e293b", fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                <UserRound size={21} aria-hidden="true" />
                {currentUser?.name}님의 서재
              </h3>
              <button
                type="button"
                className="btn-outline"
                style={{ width: "auto", flexShrink: 0, padding: "8px 14px", fontSize: "13px", marginBottom: 0 }}
                onClick={() => {
                  setAccountName(currentUser?.name || "");
                  setAccountPassword(currentUser?.password || "");
                  setShowAccountEdit((prev) => !prev);
                }}
              >
                계정 관리
              </button>
            </div>

            {showAccountEdit && (
              <div className="auth-wrapper" style={{ minHeight: "auto" }}>
                <div className="auth-card">
                  <div className="auth-logo">
                    <div className="auth-logo-icon">
                      <UserRound size={26} color="#ffa042" />
                    </div>
                    <h2>계정 관리</h2>
                    <p>회원 정보를 수정하거나 탈퇴할 수 있어요</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">이름</label>
                    <input
                      type="text"
                      className="form-input"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">비밀번호</label>
                    <input
                      type="password"
                      className="form-input"
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" className="btn-primary" style={{ flex: 1, marginBottom: 0 }} onClick={handleUpdateAccount}>
                      수정하기
                    </button>
                    <button type="button" className="btn-outline" style={{ flex: 1, marginBottom: 0 }} onClick={handleDeleteAccount}>
                      계정 탈퇴
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!showAccountEdit && (
              <>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>내가 등록한 도서만 표시됩니다. 수정 및 삭제가 가능합니다.</p>

                <BookDetail
                  selectedBook={selectedBook}
                  onStartEdit={startEdit}
                  onDelete={handleDelete}
                  onClose={handleCloseDetail}
                  isReadOnly={false}
                  books={books.filter(b => b.userId === currentUser?.userId)}
                  onSelectBook={(book) => setSelectedBook(book)}
                  isMyPage={true}
                  currentUser={currentUser}
                />
              </>
            )}
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        limit={3}
      />
    </>
  );
}