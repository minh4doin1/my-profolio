// src/lib/userId.ts

import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'street-hustle-user-id';

/**
 * Lấy user ID từ localStorage.
 * Nếu chưa có, tạo một ID mới, lưu lại và trả về.
 * Hàm này an toàn để gọi ở phía client.
 */
export function getUserId(): string {
  // Kiểm tra xem có đang chạy trên trình duyệt không
  if (typeof window === 'undefined') {
    return '';
  }

  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}