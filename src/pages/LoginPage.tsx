import { useState } from "react";
import { usePostProgressSessions } from "@/api/generated/taskProgressAPI.ts";
import { useLocation, useNavigate } from "react-router-dom";
import type { Login } from "@/api/generated/taskProgressAPI.schemas";
import {useAlertDialog} from "@/context/AlertDialogContext.tsx";
import { extractErrorMessage } from "@/utils/errorHandler.ts";

// 定数の定義
const MESSAGES = {
  LOGIN_SUCCESS: "ログイン成功",
  LOGIN_FAILED: "ログイン失敗",
  LOGIN_TITLE: "ログイン",
  EMAIL_LABEL: "メールアドレス",
  PASSWORD_LABEL: "パスワード",
  LOGIN_BUTTON: "ログイン",
  LOGIN_LOADING: "ログイン中...",
} as const;

const ROUTES = {
  DEFAULT: "/",
} as const;

// カスタムフック: ログイン処理の分離
function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || ROUTES.DEFAULT;
  const { openAlertDialog } = useAlertDialog();

  const mutation = usePostProgressSessions({
    mutation: {
      onSuccess: () => {
        navigate(from, { replace: true });
        
        // TODO: より適切な状態管理（Redux、Zustand等）への移行を検討
        // localStorage.setItem("token", response.data.token);
      },
      onError: (error) => {
        const errorMessage = extractErrorMessage(error);
        console.error("Login error:", errorMessage);
        openAlertDialog({
          title: "エラー",
          description: `${MESSAGES.LOGIN_FAILED}: ${errorMessage}`,
          confirmText: "閉じる",
          showCancel: false,
        });
      },
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    from,
  };
}

// カスタムフック: フォーム状態管理の分離
function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const getFormData = (): Login => ({
    email: email.trim(),
    password,
  });

  const isFormValid = () => {
    return email.trim() !== "" && password !== "";
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    resetForm,
    getFormData,
    isFormValid,
  };
}

// UI コンポーネント: 入力フィールド
interface InputFieldProps {
  label: string;
  type: "email" | "password";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

function InputField({ label, type, value, onChange, required = false }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200 focus:border-blue-400"
        required={required}
      />
    </div>
  );
}

// UI コンポーネント: ログインボタン
interface LoginButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
}

function LoginButton({ isLoading, isDisabled }: LoginButtonProps) {
  return (
    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isDisabled}
    >
      {isLoading ? MESSAGES.LOGIN_LOADING : MESSAGES.LOGIN_BUTTON}
    </button>
  );
}

// メインコンポーネント
export default function LoginPage() {
  const { login, isLoading} = useLogin();
  const {
    email,
    setEmail,
    password,
    setPassword,
    getFormData,
    isFormValid,
  } = useLoginForm();


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isFormValid()) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    const loginData = getFormData();
    login({ data: loginData });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {MESSAGES.LOGIN_TITLE}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label={MESSAGES.EMAIL_LABEL}
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
          
          <InputField
            label={MESSAGES.PASSWORD_LABEL}
            type="password"
            value={password}
            onChange={setPassword}
            required
          />
          
          <LoginButton
            isLoading={isLoading}
            isDisabled={isLoading || !isFormValid()}
          />
        </form>
      </div>
    </div>
  );
}