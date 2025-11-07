// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Lấy user ID ẩn danh từ localStorage.
 * Nếu chưa có, tạo một ID mới và lưu lại.
 * Điều này đảm bảo người chơi giữ nguyên định danh của mình
 * khi refresh trang hoặc kết nối lại.
 * @returns {string} The anonymous user ID.
 */
export const getAnonymousUserId = (): string => {
  if (typeof window === 'undefined') {
    // Trả về giá trị tạm thời khi chạy trên server
    return 'server-user';
  }

  let userId = localStorage.getItem('anonymousUserId');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('anonymousUserId', userId);
  }
  return userId;
};