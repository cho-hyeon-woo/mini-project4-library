import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import BookForm from "../components/BookForm";

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

export default function RegisterPage({ dbAddress, currentUser, selectedBook, isEditing, onSaveSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
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

  // 수정 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    if (isEditing && selectedBook) {
      setTitle(selectedBook.title || "");
      setAuthor(selectedBook.author || "");
      setContent(selectedBook.content || "");
      setBookGenre(selectedBook.genre || "실용서적");
      setCoverStyle(selectedBook.style || "미니멀");
      setTempPreviewImage(selectedBook.coverImageUrl || "");
    }
  }, [isEditing, selectedBook]);

  const handleInitiatePreview = async () => {
    if (!title.trim() || !author.trim() || !content.trim()) {
      toast.warning("모든 필수 항목을 기입해 주세요.");
      return;
    }

    if (!apiKey.trim()) {
      if (localImageBase64) {
        setTempPreviewImage(localImageBase64);
        toast.info("업로드한 이미지로 표지 미리보기를 준비했습니다.");
      } else {
        toast.warning("OpenAI API Key를 입력하거나 표지 이미지를 업로드해 주세요.");
      }
      return;
    }

    setIsGeneratingCover(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let prompt = buildBookCoverPrompt(title, author, content, bookGenre, coverStyle);
      if (localImageBase64) {
        const pureBase64 = localImageBase64.split(",")[1];
        const visionRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{
              role: "user",
              content: [
                { type: "text", text: "Analyze this rough sketch/storyboard for a book cover. Describe its layout, composition, subject placement, and implied framing in English so that DALL-E 3 can replicate this exact composition. Keep it concise." },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${pureBase64}` } }
              ]
            }]
          }),
          signal: controller.signal
        });

        if (visionRes.ok) {
          const visionData = await visionRes.json();
          const sketchDescription = visionData.choices?.[0]?.message?.content;
          if (sketchDescription) {
            prompt += `\n\n[CRITICAL COMPOSITION GUIDE]: Replicate the exact composition and layout described here: ${sketchDescription}`;
          }
        }
      }

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
      toast.success("표지 미리보기가 생성되었습니다.");
    } catch (err) {
      if (err.name === "AbortError") {
        toast.info("이미지 생성을 취소했습니다.");
      } else {
        toast.error(`표지 생성 실패: ${err.message}`);
      }
    } finally {
      setIsGeneratingCover(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  const handleFinalSave = async () => {
    const nowISO = new Date().toISOString();
    const wasEditing = isEditing;
    const payload = {
      title, author, content, genre: bookGenre, style: coverStyle,
      imageModel, imageSize, imageQuality, outputFormat,
      coverImageUrl: tempPreviewImage,
      user_id: currentUser?.id,
      updatedAt: nowISO
    };

    try {
      if (isEditing) {
        const res = await fetch(`${dbAddress}/${selectedBook.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...selectedBook, ...payload }),
        });
        if (!res.ok) throw new Error("도서 수정 요청에 실패했습니다.");
      } else {
        const res = await fetch(dbAddress, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdAt: nowISO }),
        });
        if (!res.ok) throw new Error("도서 등록 요청에 실패했습니다.");
      }

      toast.success(wasEditing ? "도서 정보가 수정되었습니다." : "도서가 등록되었습니다.");
      onSaveSuccess();
    } catch (err) {
      toast.error(err.message || "도서 저장에 실패했습니다.");
    }
  };

  return (
    <BookForm
      title={title} setTitle={setTitle}
      author={author} setAuthor={setAuthor}
      content={content} setContent={setContent}
      apiKey={apiKey} setApiKey={setApiKey}
      imageModel={imageModel} setImageModel={setImageModel}
      imageSize={imageSize} setImageSize={setImageSize}
      imageQuality={imageQuality} setImageQuality={setImageQuality}
      outputFormat={outputFormat} setOutputFormat={setOutputFormat}
      bookGenre={bookGenre} setBookGenre={setBookGenre}
      coverStyle={coverStyle} setCoverStyle={setCoverStyle}
      isEditing={isEditing}
      onSave={handleInitiatePreview}
      onFinalSave={handleFinalSave}
      onCancel={onCancel}
      isGenerating={isGeneratingCover}
      onCancelGeneration={handleCancelGeneration}
      tempPreviewImage={tempPreviewImage}
      setTempPreviewImage={setTempPreviewImage}
      localImageBase64={localImageBase64}
      setLocalImageBase64={setLocalImageBase64}
    />
  );
}
