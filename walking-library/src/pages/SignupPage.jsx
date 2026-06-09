import { useState } from "react";
import { BookOpen, UserPlus, ArrowLeft } from "lucide-react";

export default function SignupPage({ onSignupSuccess, onGoLogin }) {
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !loginId.trim() || !password.trim() || !passwordConfirm.trim()) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (loginId.trim().length < 3) {
      setError("아이디는 3자 이상이어야 합니다.");
      return;
    }
    if (password.length < 4) {
      setError("비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 아이디 중복 확인
      const checkRes = await fetch(`http://localhost:3000/users?login_id=${loginId.trim()}`);
      const existing = await checkRes.json();
      if (existing.length > 0) {
        setError("이미 사용 중인 아이디입니다.");
        return;
      }

      // 회원 등록
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginId.trim(),
          password: password.trim(),
          name: name.trim(),
        }),
      });

      if (!res.ok) throw new Error("회원가입에 실패했습니다.");

      const newUser = await res.json();
      onSignupSuccess(newUser);
    } catch (err) {
      setError(err.message || "서버에 연결할 수 없습니다. json-server가 실행 중인지 확인해주세요.");
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
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
            회원가입
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Walking Library와 함께 시작해요</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 이름 */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#555" }}>
              이름
            </label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          {/* 아이디 */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#555" }}>
              아이디
            </label>
            <input
              type="text"
              placeholder="아이디를 입력하세요 (3자 이상)"
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
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#555" }}>
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요 (4자 이상)"
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

          {/* 비밀번호 확인 */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#555" }}>
              비밀번호 확인
            </label>
            <input
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
                border: `1px solid ${passwordConfirm && password !== passwordConfirm ? "#fca5a5" : "#ddd"}`,
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {passwordConfirm && password !== passwordConfirm && (
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#b91c1c" }}>
                비밀번호가 일치하지 않습니다.
              </p>
            )}
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

          {/* 회원가입 버튼 */}
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
              marginBottom: "12px",
            }}
          >
            <UserPlus size={17} />
            {isLoading ? "가입 중..." : "회원가입"}
          </button>

          {/* 로그인으로 돌아가기 */}
          <button
            type="button"
            onClick={onGoLogin}
            style={{
              width: "100%",
              padding: "11px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              color: "#555",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <ArrowLeft size={15} />
            로그인으로 돌아가기
          </button>
        </form>
      </div>
    </div>
  );
}
