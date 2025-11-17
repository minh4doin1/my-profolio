// Nội dung cho file gridMapLayout.ts

// 'B' = Buildable (Có thể xây)
// 'R' = Road (Đường đi)
export const GRID_MAP_ROWS = 10;
export const GRID_MAP_COLS = 10;

/**
 * Layout "Quần Đảo Tranh Chấp" (Archipelago of Conflict)
 * - Tạo ra các "quần đảo" xây dựng được, ngăn cách bởi các "dòng sông" đường.
 * - Các "cầu nối" (eo đất) rộng 1 ô trở thành các vị trí chiến lược quan trọng.
 * - Cân bằng giữa các khu vực lớn và các điểm nóng tranh chấp nhỏ.
 * - Giảm số lượng ô giáp đường không cần thiết, tăng giá trị cho các khu vực.
 * - Tổng: 80 ô 'B' và 20 ô 'R'.
 */
export const gridMapLayout: string[] = [
// Col: 0    1    2    3    4    5    6    7    8    9
  "B", "B", "B", "R", "B", "B", "B", "B", "R", "B", // Row 0
  "B", "B", "B", "R", "B", "B", "B", "B", "R", "B", // Row 1
  "B", "B", "B", "R", "B", "R", "B", "B", "R", "B", // Row 2
  "R", "R", "R", "R", "B", "R", "R", "R", "R", "R", // Row 3 (Cầu nối tại E4)
  "B", "B", "B", "R", "B", "B", "B", "R", "B", "B", // Row 4
  "B", "B", "B", "R", "B", "B", "B", "R", "B", "B", // Row 5
  "B", "B", "B", "R", "R", "R", "R", "R", "B", "B", // Row 6
  "B", "R", "B", "B", "B", "B", "B", "B", "B", "B", // Row 7
  "B", "R", "B", "B", "B", "B", "B", "B", "B", "B", // Row 8
  "B", "R", "B", "B", "B", "B", "B", "B", "B", "B", // Row 9
];