import { useState } from "react";
import { BookOpen, LogIn, UserPlus } from "lucide-react";

export default function LoginPage({ onLogin, onGoRegister }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/users?login_id=${loginId.trim()}&password=${password.trim()}`);
      const users = await res.json();

      if (users.length === 0) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      onLogin(users[0]);
    } catch (err) {
      setError("서버에 연결할 수 없습니다. json-server가 실행 중인지 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      width: "100%",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "40px 36px",
        background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}>
        {/* 상단 로고 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#fff7ed",
            border: "2px solid #ffa042",
            marginBottom: "12px",
          }}>
            <BookOpen size={26} color="#ffa042" />
          </div>
          <h2 style={{ margin: "0 0 4px 0", fontSize: "22px", color: "#333", fontWeight: "bold" }}>
            Walking Library
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>책과 산책하는 시간</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 아이디 */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#555" }}>
              아이디
            </label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* 비밀번호 */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#555" }}>
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p style={{
              margin: "0 0 16px 0",
              padding: "10px 14px",
              background: "#fff1f1",
              border: "1px solid #fca5a5",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#b91c1c",
            }}>
              {error}
            </p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "13px",
              background: isLoading ? "#fcd9b0" : "#ffa042",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <LogIn size={17} />
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 구분선 */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0 16px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          <span style={{ fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap" }}>계정이 없으신가요?</span>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="button"
          onClick={onGoRegister}
          style={{
            width: "100%",
            padding: "12px",
            background: "#fff",
            border: "1px solid #ffa042",
            borderRadius: "8px",
            color: "#ffa042",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <UserPlus size={17} />
          회원가입
        </button>

        {/* 테스트 계정 안내 */}
        <div style={{
          padding: "12px",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          fontSize: "12px",
          color: "#64748b",
          textAlign: "center",
        }}>
          <strong>테스트 계정</strong><br />
          아이디: <code style={{ background: "#e2e8f0", padding: "1px 5px", borderRadius: "3px" }}>test</code> &nbsp;
          비밀번호: <code style={{ background: "#e2e8f0", padding: "1px 5px", borderRadius: "3px" }}>1234</code>
        </div>
      </div>
    </div>
  );
}