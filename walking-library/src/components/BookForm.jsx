import React from "react";

export default function BookForm({
  selectedBook,
  title,
  setTitle,
  author,
  setAuthor,
  content,
  setContent,
  isEditing,
  onSave,
  onCancel,
  draftCoverImage,
  draftCoverError,
  apiKey,
  setApiKey,
  imageModel,
  setImageModel,
  imageSize,
  setImageSize,
  imageQuality,
  setImageQuality,
  outputFormat,
  setOutputFormat,
  onGenerateDraftCover,
  isGeneratingCover,
}) {
  const coverPreview = draftCoverImage || selectedBook?.coverImageUrl || "";

  return (
    <section id="book-form" className="book-form">
      <h3 className="section-title">{isEditing ? "도서 수정하기" : "🆕 새 도서 등록하기"}</h3>

      <div className="book-form__preview-panel">
        <div className="book-form__preview-header">AI 표지 미리보기</div>
        {coverPreview ? (
          <img src={coverPreview} alt="표지 미리보기" className="book-form__preview-image" />
        ) : (
          <div className="book-form__preview-placeholder">
            여기에 생성된 표지가 표시됩니다.
          </div>
        )}

        <div className="book-form__generator">
          <div className="form-group">
            <label className="form-label" htmlFor="openai-api-key">
              OpenAI API Key
            </label>
            <input
              id="openai-api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="form-input"
              autoComplete="off"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="image-model">
                모델
              </label>
              <select
                id="image-model"
                value={imageModel}
                onChange={(e) => setImageModel(e.target.value)}
                className="form-input"
              >
                <option value="gpt-image-2">gpt-image-2</option>
                <option value="gpt-image-1.5">gpt-image-1.5</option>
                <option value="gpt-image-1">gpt-image-1</option>
                <option value="gpt-image-1-mini">gpt-image-1-mini</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image-size">
                이미지 크기
              </label>
              <select
                id="image-size"
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                className="form-input"
              >
                <option value="1024x1536">1024x1536</option>
                <option value="1024x1024">1024x1024</option>
                <option value="1536x1024">1536x1024</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image-quality">
                품질
              </label>
              <select
                id="image-quality"
                value={imageQuality}
                onChange={(e) => setImageQuality(e.target.value)}
                className="form-input"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="output-format">
                파일 형식
              </label>
              <select
                id="output-format"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="form-input"
              >
                <option value="png">png</option>
                <option value="jpeg">jpeg</option>
                <option value="webp">webp</option>
              </select>
            </div>
          </div>

          {draftCoverError && <p className="error-text">{draftCoverError}</p>}

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onGenerateDraftCover}
            disabled={isGeneratingCover}
          >
            {isGeneratingCover ? "생성 중..." : "AI 표지 생성"}
          </button>
          <p className="note-text">
            생성된 이미지는 작성 완료 시 함께 저장됩니다. 작성 시 생성하지 않아도 수정에서 다시 생성할 수 있습니다.
          </p>
        </div>
      </div>

      <form onSubmit={onSave} className="book-form__form">
        <div className="book-form__row">
          <input
            type="text"
            placeholder="도서 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="book-form__input"
          />
          <input
            type="text"
            placeholder="작가지망생 이름"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="book-form__input"
          />
        </div>
        <div>
          <textarea
            placeholder="본문 내용을 입력하세요 (AI 표지 생성의 기반이 됩니다)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="book-form__textarea"
          />
        </div>
        <div className="book-form__actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? "수정 완료" : "책 등록하기"}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              취소
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
