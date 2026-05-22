import { useState, useEffect } from "react";
import Header from "./components/Header";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";

const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";

function buildBookCoverPrompt(book) {
  return [
    "Create a polished vertical book cover illustration.",
    "Use an artistic, publication-ready style suitable for a Korean creative writing app.",
    `Title: ${book.title}`,
    `Author: ${book.author}`,
    `Book content: ${book.content}`,
    "The cover should visually reflect the mood and core theme of the book.",
    "If text is included, keep it minimal and legible.",
    "Do not include mockup borders, UI elements, watermarks, or extra explanation.",
  ].join("\n");
}

function getOpenAiErrorMessage(status, payload) {
  const apiMessage = payload?.error?.message;

  if (status === 401) {
    return "API Key가 올바르지 않습니다. 키를 다시 확인해주세요.";
  }

  if (status === 429) {
    return "요청 한도에 도달했습니다. 잠시 후 다시 시도해주세요.";
  }

  return apiMessage || `OpenAI 요청에 실패했습니다. (status: ${status})`;
}

export default function App() {
  const dbAddress = "http://localhost:3000/books";

  const [page, setPage] = useState("home");
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [imageModel, setImageModel] = useState("gpt-image-2");
  const [imageSize, setImageSize] = useState("1024x1536");
  const [imageQuality, setImageQuality] = useState("low");
  const [outputFormat, setOutputFormat] = useState("png");
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [draftCoverImage, setDraftCoverImage] = useState("");
  const [draftCoverError, setDraftCoverError] = useState("");

  const fetchBooks = async () => {
    const res = await fetch(dbAddress);
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch(dbAddress);
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      }
    };

    loadInitialData();
  }, []);

  const handleGoHome = () => {
    setPage("home");
    setSelectedBook(null);
    setIsEditing(false);
    setCoverError("");
  };

  const handleWritePage = () => {
    setPage("write");
    setSelectedBook(null);
    setIsEditing(false);
    setCoverError("");
    setDraftCoverImage("");
    setDraftCoverError("");
    setTitle("");
    setAuthor("");
    setContent("");
  };

  const handleGenerateDraftCover = async () => {
    if (!title.trim() || !author.trim() || !content.trim()) {
      setDraftCoverError("제목, 저자, 내용을 모두 입력한 후 표지를 생성해주세요.");
      return;
    }

    if (!apiKey.trim()) {
      setDraftCoverError("OpenAI API Key를 입력해주세요.");
      return;
    }

    setIsGeneratingCover(true);
    setDraftCoverError("");

    try {
      const prompt = buildBookCoverPrompt({ title, author, content });

      const openAiRes = await fetch(OPENAI_IMAGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: imageModel,
          prompt,
          n: 1,
          size: imageSize,
          quality: imageQuality,
          output_format: outputFormat,
        }),
      });

      if (!openAiRes.ok) {
        const errorPayload = await openAiRes.json().catch(() => null);
        throw new Error(getOpenAiErrorMessage(openAiRes.status, errorPayload));
      }

      const data = await openAiRes.json();
      const b64Json = data.data?.[0]?.b64_json;

      if (!b64Json) {
        throw new Error("OpenAI 응답에서 이미지 데이터를 찾을 수 없습니다.");
      }

      const imageSrc = `data:image/${outputFormat};base64,${b64Json}`;
      setDraftCoverImage(imageSrc);
    } catch (err) {
      setDraftCoverError(err.message || "표지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleViewBook = (book) => {
    if (!book) return;
    setSelectedBook(book);
    setPage("read");
    setCoverError("");
  };

  const handleGenerateCover = async (book) => {
    if (!book) {
      setCoverError("표지를 생성할 도서를 먼저 선택해주세요.");
      return;
    }

    if (!apiKey.trim()) {
      setCoverError("OpenAI API Key를 입력해주세요.");
      return;
    }

    setIsGeneratingCover(true);
    setCoverError("");

    try {
      const prompt = buildBookCoverPrompt(book);

      const openAiRes = await fetch(OPENAI_IMAGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: imageModel,
          prompt,
          n: 1,
          size: imageSize,
          quality: imageQuality,
          output_format: outputFormat,
        }),
      });

      if (!openAiRes.ok) {
        const errorPayload = await openAiRes.json().catch(() => null);
        throw new Error(getOpenAiErrorMessage(openAiRes.status, errorPayload));
      }

      const data = await openAiRes.json();
      const b64Json = data.data?.[0]?.b64_json;

      if (!b64Json) {
        throw new Error("OpenAI 응답에서 이미지 데이터를 찾을 수 없습니다.");
      }

      const imageSrc = `data:image/${outputFormat};base64,${b64Json}`;

      const patchRes = await fetch(`${dbAddress}/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImageUrl: imageSrc }),
      });

      if (!patchRes.ok) {
        throw new Error("생성된 표지를 json-server에 저장하지 못했습니다.");
      }

      setBooks((prevBooks) =>
        prevBooks.map((item) =>
          item.id === book.id ? { ...item, coverImageUrl: imageSrc } : item
        )
      );
      setSelectedBook((currentBook) =>
        currentBook?.id === book.id
          ? { ...currentBook, coverImageUrl: imageSrc }
          : currentBook
      );
    } catch (err) {
      setCoverError(err.message || "표지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !content.trim()) {
      alert("모든 필드를 입력해주세요! (공백 금지)");
      return;
    }

    const nowISO = new Date().toISOString();

    const savedCoverImageUrl =
      draftCoverImage || selectedBook?.coverImageUrl || "";

    if (isEditing) {
      await fetch(`${dbAddress}/${selectedBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedBook,
          title,
          author,
          content,
          coverImageUrl: savedCoverImageUrl,
          updatedAt: nowISO,
        }),
      });
      setIsEditing(false);
    } else {
      await fetch(dbAddress, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          content,
          coverImageUrl: savedCoverImageUrl,
          createdAt: nowISO,
          updatedAt: nowISO,
        }),
      });
    }

    setTitle("");
    setAuthor("");
    setContent("");
    setDraftCoverImage("");
    setDraftCoverError("");
    setSelectedBook(null);
    setPage("home");
    fetchBooks();
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 이 책을 삭제하시겠습니까?")) {
      await fetch(`${dbAddress}/${id}`, { method: "DELETE" });
      setSelectedBook(null);
      setPage("home");
      fetchBooks();
    }
  };

  const startEdit = () => {
    setTitle(selectedBook.title);
    setAuthor(selectedBook.author);
    setContent(selectedBook.content);
    setDraftCoverImage(selectedBook.coverImageUrl || "");
    setDraftCoverError("");
    setIsEditing(true);
    setPage("write");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTitle("");
    setAuthor("");
    setContent("");
  };

  const handleSelectBook = (book) => {
    if (book) {
      handleViewBook(book);
    } else {
      setSelectedBook(null);
    }
    setCoverError("");
  };

  return (
    <div id="app-wrapper" className="app-container">
      <Header onWriteClick={handleWritePage} />

      {page === "home" && (
        <main className="main-page">
          <section className="hero-panel">
            <div className="hero-panel__content">
              <p className="hero-label">책과 함께, 나의 하루를 걷다.</p>
              <h2 className="hero-title">당신의 독서와 글쓰기를 한 곳에서 관리하세요.</h2>
              <p className="hero-description">
                다양한 책 기록과 창작 글을 쉽게 확인할 수 있는 홈 화면입니다.
              </p>
              <div className="hero-search">
                <input
                  type="search"
                  placeholder="제목, 저자, 키워드로 검색"
                  className="hero-search__input"
                />
                <button type="button" className="btn btn-primary hero-search__button">
                  검색
                </button>
              </div>
            </div>

            <div className="hero-panel__visual">
              <div className="hero-card">
                <div className="hero-card__image" />
              </div>
            </div>
          </section>

          <BookList
            books={books}
            selectedBook={selectedBook}
            onSelectBook={handleSelectBook}
            onDelete={handleDelete}
          />
        </main>
      )}

      {page === "write" && (
        <section className="write-page">
          <div className="page-header">
            <div>
              <h2>책 작성하기</h2>
              <p>새로운 글을 작성하고 AI 표지를 생성해보세요.</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={handleGoHome}>
              목록으로 돌아가기
            </button>
          </div>

          <BookForm
            selectedBook={selectedBook}
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            content={content}
            setContent={setContent}
            isEditing={isEditing}
            onSave={handleSave}
            onCancel={cancelEdit}
            draftCoverImage={draftCoverImage}
            draftCoverError={draftCoverError}
            apiKey={apiKey}
            setApiKey={setApiKey}
            imageModel={imageModel}
            setImageModel={setImageModel}
            imageSize={imageSize}
            setImageSize={setImageSize}
            imageQuality={imageQuality}
            setImageQuality={setImageQuality}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            onGenerateDraftCover={handleGenerateDraftCover}
            isGeneratingCover={isGeneratingCover}
          />
        </section>
      )}

      {page === "read" && (
        <section className="read-page">
          <div className="page-header page-header--stacked">
            <div>
              <h2>읽기 모드</h2>
              <p>도서를 클릭하면 상세 내용과 표지를 볼 수 있습니다.</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={handleGoHome}>
              목록으로 돌아가기
            </button>
          </div>

          <BookDetail
            selectedBook={selectedBook}
            onStartEdit={startEdit}
            onDelete={handleDelete}
            onClose={handleGoHome}
            apiKey={apiKey}
            setApiKey={setApiKey}
            imageModel={imageModel}
            setImageModel={setImageModel}
            imageSize={imageSize}
            setImageSize={setImageSize}
            imageQuality={imageQuality}
            setImageQuality={setImageQuality}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            isGeneratingCover={isGeneratingCover}
            coverError={coverError}
            onGenerateCover={handleGenerateCover}
          />
        </section>
      )}
    </div>
  );
}
