import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import BookForm from "./components/BookForm";
import BookDetail from "./components/BookDetail";

const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";

function buildBookCoverPrompt(title, author, content, bookGenre, coverStyle) {
  return [
    "Create a polished vertical book cover illustration.",
    "Use an artistic, publication-ready style suitable for a Korean creative writing app.",
    `Genre: ${bookGenre}`,
    `Cover style: ${coverStyle}`,
    `Title: ${title}`,
    `Author: ${author}`,
    `Book content: ${content}`,
    "The cover should visually reflect the selected genre, mood, and core theme of the book.",
    "Do not include mockup borders, UI elements, watermarks, or extra explanation.",
  ].join("\n");
}

export default function App() {
  const dbAddress = "http://localhost:3000/books";

  const [currentMenu, setCurrentMenu] = useState("home");
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [randomBook, setRandomBook] = useState(null);  

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [detailViewSource, setDetailViewSource] = useState(null);
  const recommendDetailRef = useRef(null);
  const listDetailRef = useRef(null);

  const [apiKey, setApiKey] = useState("");
  const [imageModel, setImageModel] = useState("gpt-image-2");
  const [imageSize, setImageSize] = useState("1024x1536");
  const [imageQuality, setImageQuality] = useState("low");
  const [outputFormat, setOutputFormat] = useState("png");
  const [bookGenre, setBookGenre] = useState("실용서적");
  const [coverStyle, setCoverStyle] = useState("미니멀");
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  const [tempPreviewImage, setTempPreviewImage] = useState(""); 
  const [localImageBase64, setLocalImageBase64] = useState("");
  const abortControllerRef = useRef(null);

  const fetchBooks = async () => {
    const res = await fetch(dbAddress);
    const data = await res.json();
    setBooks(data);
    
    if (data.length > 0 && !randomBook) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setRandomBook(data[randomIndex]);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1단계: 미리보기 데이터 조립 (AI 찌르기 또는 로컬 파일 매칭)
  const handleInitiatePreview = async () => {
    if (!title.trim() || !author.trim() || !content.trim()) {
      alert("모든 필수 항목을 기입해 주세요.");
      return;
    }

    if (!apiKey.trim()) {
      if (localImageBase64) {
        setTempPreviewImage(localImageBase64); // 로컬 파일 주소를 미리보기로 승격
      } else {
        alert("AI 표지를 생성하기 위한 OpenAI API Key를 입력하거나,\n좌측 하단에서 직접 업로드할 이미지 파일을 선택해 주세요!");
      }
      return;
    }

    setIsGeneratingCover(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const prompt = buildBookCoverPrompt(title, author, content, bookGenre, coverStyle);
      const openAiRes = await fetch(OPENAI_IMAGE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` },
        body: JSON.stringify({ model: imageModel, prompt, n: 1, size: imageSize, quality: imageQuality, output_format: outputFormat }),
        signal: controller.signal
      });

      if (!openAiRes.ok) throw new Error("OpenAI 서버 응답 실패");

      const data = await openAiRes.json();
      const b64Json = data.data?.[0]?.b64_json;
      if (!b64Json) throw new Error("이미지 본문이 누락되었습니다.");

      setTempPreviewImage(`data:image/${outputFormat};base64,${b64Json}`);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("생성 취소됨");
      } else {
        alert(`에러: ${err.message}`);
      }
    } finally {
      setIsGeneratingCover(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  // 2단계: 유저 검토완료 후 최종 서버 적재
  const handleFinalSave = async () => {
    const nowISO = new Date().toISOString();
    const payload = {
      title, author, content, genre: bookGenre, style: coverStyle,
      imageModel, imageSize, imageQuality, outputFormat,
      coverImageUrl: tempPreviewImage,
      createdAt: nowISO, updatedAt: nowISO
    };

    if (isEditing) {
      await fetch(`${dbAddress}/${selectedBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selectedBook, ...payload }),
      });
      setIsEditing(false);
    } else {
      await fetch(dbAddress, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setTitle(""); setAuthor(""); setContent(""); setSelectedBook(null);
    setTempPreviewImage(""); setLocalImageBase64(""); handleCloseDetail();
    fetchBooks();
    setCurrentMenu("home");
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 이 책을 삭제하시겠습니까?")) {
      await fetch(`${dbAddress}/${id}`, { method: "DELETE" });
      setSelectedBook(null); setDetailViewSource(null);
      if (randomBook?.id === id) setRandomBook(null);
      fetchBooks();
    }
  };

  const startEdit = () => {
    setTitle(selectedBook.title); setAuthor(selectedBook.author); setContent(selectedBook.content);
    setIsEditing(true); setCurrentMenu("register");
  };

  const handleOpenDetail = (book, source) => {
    setSelectedBook(book); setDetailViewSource(source);
    setTimeout(() => {
      if (source === "recommend" && recommendDetailRef.current) {
        recommendDetailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (source === "list" && listDetailRef.current) {
        listDetailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null); setDetailViewSource(null);
  };

  return (
    <div style={{ padding: "20px", width: "100%", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif", background: "#fff", boxSizing: "border-box" }}>
      <Header currentMenu={currentMenu} onMenuChange={setCurrentMenu} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* 🏠 홈 화면 */}
      {currentMenu === "home" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%" }}>
          
          {/* 이 달의 추천 도서 */}
          {randomBook && (
            <section style={{ width: "100%", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "8px", padding: "20px", background: "#fff" }}>
              <h3 style={{ marginTop: 0, marginBottom: "15px", textAlign: "center", color: "#444" }}>이 달의 추천 도서</h3>
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "120px", height: "180px", background: "#ccc", borderRadius: "4px", flexShrink: 0, overflow: "hidden", border: "1px solid #bbb" }}>
                  {randomBook.coverImageUrl ? <img src={randomBook.coverImageUrl} alt="표지" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center", padding: "5px", fontSize: "11px", color: "#666" }}>생성된 이미지가 없습니다!</div>}
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#333" }}>{randomBook.title}</h4>
                  <p style={{ margin: "0 0 10px 0", color: "#555", fontWeight: "bold" }}>{randomBook.author} <span style={{ fontWeight: "normal", color: "#999", fontSize: "13px" }}>글쓴이</span></p>
                  <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px", lineHeight: "1.4" }}>{randomBook.content}</p>
                  <span style={{ cursor: "pointer", color: "#007bff", fontSize: "13px", fontWeight: "bold" }} onClick={() => handleOpenDetail(randomBook, "recommend")}>[자세히 보기]</span>
                </div>
              </div>
              <div ref={recommendDetailRef}>
                {selectedBook && detailViewSource === "recommend" && (
                  <BookDetail selectedBook={selectedBook} onClose={handleCloseDetail} isReadOnly={true} />
                )}
              </div>
            </section>
          )}

          {/* 📖 도서 목록 그리드 */}
          <section style={{ width: "100%", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "8px", padding: "20px", background: "#fff" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#444" }}>📖 도서 목록 ({filteredBooks.length}권)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {filteredBooks.map((book) => (
                <div 
                  key={book.id} 
                  onClick={() => handleOpenDetail(book, "list")}
                  style={{ textAlign: "center", cursor: "pointer", border: "1px solid #eee", padding: "10px", borderRadius: "6px", background: "#fff", transition: "transform 0.2s", boxSizing: "border-box" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                >
                  <div style={{ width: "100%", height: "160px", background: "#f5f5f5", borderRadius: "4px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd", overflow: "hidden" }}>
                    {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ fontSize: "11px", color: "#999" }}>{book.title}</div>}
                  </div>
                  <strong style={{ display: "block", fontSize: "13px", marginBottom: "8px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", color: "#333" }}>{book.title}</strong>
                  <span style={{ fontSize: "11px", color: "#999" }}>{book.author}</span>
                </div>
              ))}
            </div>
            {filteredBooks.length === 0 && <p style={{ textAlign: "center", color: "#999", margin: "40px 0" }}>검색된 도서가 없습니다.</p>}
            <div ref={listDetailRef}>
              {selectedBook && detailViewSource === "list" && (
                <BookDetail selectedBook={selectedBook} onClose={handleCloseDetail} isReadOnly={true} />
              )}
            </div>
          </section>

        </div>
      )}

      {/* ✍️ 도서 등록 대시보드 (오타 전면 수정 완료) */}
      {currentMenu === "register" && (
        <BookForm 
          title={title} setTitle={setTitle} author={author} setAuthor={setAuthor} content={content} setContent={setContent}
          apiKey={apiKey} setApiKey={setApiKey} imageModel={imageModel} setImageModel={setImageModel}
          imageSize={imageSize} setImageSize={setImageSize} imageQuality={imageQuality} setImageQuality={setImageQuality}
          outputFormat={outputFormat} setOutputFormat={setOutputFormat} bookGenre={bookGenre} setBookGenre={setBookGenre}
          coverStyle={coverStyle} setCoverStyle={setCoverStyle}
          isEditing={isEditing} 
          onSave={handleInitiatePreview} // 🎯 오타 수정 완료!
          onFinalSave={handleFinalSave}           
          onCancel={() => { setIsEditing(false); setTempPreviewImage(""); setLocalImageBase64(""); setCurrentMenu("home"); }}
          isGenerating={isGeneratingCover}
          onCancelGeneration={handleCancelGeneration} 
          tempPreviewImage={tempPreviewImage}         
          setTempPreviewImage={setTempPreviewImage}   
          localImageBase64={localImageBase64} setLocalImageBase64={setLocalImageBase64}
        />
      )}

      {/* 👤 마이 페이지 화면 */}
      {currentMenu === "mypage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%" }}>
          <section style={{ width: "100%", boxSizing: "border-box", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9" }}>
            <h3 style={{ marginTop: 0 }}>👤 마이 페이지 (작가 전용 관리실)</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>이곳에서 본인이 등록한 도서의 상세 내용을 확인하고, <strong>수정/삭제 및 AI 표지 생성</strong>을 진행할 수 있습니다.</p>
            {!selectedBook && <p style={{ color: "#999", fontStyle: "italic", marginTop: "15px" }}>👉 관리할 도서를 확인하려면 '홈' 탭에서 먼저 책을 선택하고 마이페이지로 오거나, 아래 목록을 연동해 주세요.</p>}
          </section>

          {selectedBook && (
            <BookDetail 
              selectedBook={selectedBook} onStartEdit={startEdit} onDelete={handleDelete} onClose={handleCloseDetail} isReadOnly={false} 
              apiKey={apiKey} setApiKey={setApiKey} imageModel={imageModel} setImageModel={setImageModel} imageSize={imageSize} setImageSize={setImageSize} imageQuality={imageQuality} setImageQuality={setImageQuality} outputFormat={outputFormat} setOutputFormat={setOutputFormat} bookGenre={bookGenre} setBookGenre={setBookGenre} coverStyle={coverStyle} setCoverStyle={setCoverStyle}
              isGeneratingCover={isGeneratingCover} coverError={""} onGenerateCover={handleInitiatePreview}
            />
          )}
        </div>
      )}
    </div>
  );
}