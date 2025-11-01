/**
 * Утилиты для работы с аутентификацией
 */

const TOKEN_KEY = 'adminToken';

/**
 * Получить токен из localStorage
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Сохранить токен в localStorage
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Удалить токен из localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Проверить, авторизован ли пользователь
 */
export const isAuthenticated = () => {
  return !!getToken();
};

