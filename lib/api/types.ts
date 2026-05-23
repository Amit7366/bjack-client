export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  meta?: Record<string, unknown> | null;
};

export type LoginResponseData = {
  accessToken: string;
  needsPasswordChange?: boolean;
  memberId?: string;
  balance?: string;
};

export type RegisterResponseData = {
  userName?: string;
  contactNo?: string;
  name?: string;
  id?: string;
};
