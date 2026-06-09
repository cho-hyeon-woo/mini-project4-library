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
  const dbAddress = "http://localhost:3000/books";

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
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
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomBook(data[randomIndex]);
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
            if (menu !== "mypage") handleCloseDetail();
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentMenu("home");
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
              <section className="recommend-section" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "8px", padding: "20px", background: "#fff" }}>
                <h3 style={{ marginTop: 0, marginBottom: "15px", textAlign: "center", color: "#444" }}>이 달의 추천 도서</h3>
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
                    <span className="detail-link" style={{ cursor: "pointer", color: "#007bff", fontSize: "13px", fontWeight: "bold" }} onClick={() => handleOpenDetail(randomBook, "recommend")}>[자세히 보기]</span>
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

            {/* 하단 도서 목록 영역 */}
            <section className="book-list-section" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "8px", padding: "20px", background: "#fff" }}>
              <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#444", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <BookOpen size={19} aria-hidden="true" />
                도서 목록 ({filteredBooks.length}권)
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    className="book-card"
                    onClick={() => handleOpenDetail(book, "list")}
                    style={{ textAlign: "center", cursor: "pointer", border: "1px solid #eee", padding: "10px", borderRadius: "6px", background: "#fff", transition: "transform 0.2s", boxSizing: "border-box" }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  >
                    <div style={{ width: "100%", height: "160px", background: "#f5f5f5", borderRadius: "4px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd", overflow: "hidden" }}>
                      {book.coverImageUrl
                        ? <img src={book.coverImageUrl} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ fontSize: "11px", color: "#999" }}>{book.title}</div>}
                    </div>
                    <strong style={{ display: "block", width: "100%", maxWidth: "160px", fontSize: "13px", marginBottom: "8px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", color: "#333", margin: "0 auto 8px auto" }}>
                      {book.title}
                    </strong>
                    <span style={{ fontSize: "11px", color: "#999" }}>{book.author}</span>
                  </motion.div>
                ))}
              </div>
              {filteredBooks.length === 0 && <p style={{ textAlign: "center", color: "#999", margin: "40px 0" }}>검색된 도서가 없습니다.</p>}

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

        {/* 마이 페이지 화면 */}
        {currentMenu === "mypage" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
            <h3 style={{ margin: "0 0 5px 0", color: "#1e293b", fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
              <UserRound size={21} aria-hidden="true" />
              {currentUser?.name}님의 서재
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>내가 등록한 도서만 표시됩니다. 수정 및 삭제가 가능합니다.</p>

            <BookDetail
              selectedBook={selectedBook}
              onStartEdit={startEdit}
              onDelete={handleDelete}
              onClose={handleCloseDetail}
              isReadOnly={false}
              books={books.filter(b => b.user_id === currentUser?.id)}
              onSelectBook={(book) => setSelectedBook(book)}
              isMyPage={true}
              currentUser={currentUser}
            />
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