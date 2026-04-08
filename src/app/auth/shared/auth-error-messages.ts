import { AuthErrorCode } from '../../core/mock-api/mock-auth-api';

/**
 * Shared zh-TW copy for every `AuthErrorCode` surfaced by the mock API.
 * Keeps error messages consistent across all auth screens.
 */
export const AUTH_ERROR_MESSAGES: Readonly<Record<AuthErrorCode, string>> = {
  InvalidCredentials: '電子郵件或密碼不正確，請再試一次。',
  AccountLocked: '此帳號已被暫時鎖定，請稍後再試或聯繫客服。',
  EmailAlreadyInUse: '此電子郵件已被註冊，請直接登入或使用其他信箱。',
  UserNotFound: '找不到對應的帳號，請確認電子郵件或改為註冊。',
  InvalidToken: '重設連結無效或已過期，請重新申請。',
  InvalidCode: '驗證碼不正確，請重新輸入。',
  WeakPassword: '密碼強度不足，請使用至少 8 個字元。',
  TooManyAttempts: '嘗試次數過多，請稍後再試。',
  Unknown: '發生未預期的錯誤，請檢查網路連線後再試。',
} as const;

export function describeAuthError(code: AuthErrorCode): string {
  return AUTH_ERROR_MESSAGES[code];
}
