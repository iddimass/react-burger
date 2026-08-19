const PASSWORD_RESET_ALLOWED_KEY = 'passwordResetAllowed';

export const allowPasswordReset = (): void => {
  localStorage.setItem(PASSWORD_RESET_ALLOWED_KEY, 'true');
};

export const isPasswordResetAllowed = (): boolean => {
  return localStorage.getItem(PASSWORD_RESET_ALLOWED_KEY) === 'true';
};

export const clearPasswordResetAccess = (): void => {
  localStorage.removeItem(PASSWORD_RESET_ALLOWED_KEY);
};
