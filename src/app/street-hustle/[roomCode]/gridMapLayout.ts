// Nội dung cho file gridMapLayout.ts

// 'B' = Buildable (Có thể xây)
// 'R' = Road (Đường đi)
export const GRID_MAP_ROWS = 10;
export const GRID_MAP_COLS = 10;

export const gridMapLayout: string[] = [
  "B", "B", "B", "B", "R", "R", "B", "B", "B", "B",
  "B", "B", "B", "B", "R", "R", "B", "B", "B", "B",
  "B", "B", "B", "B", "R", "R", "B", "B", "B", "B",
  "B", "B", "B", "B", "R", "R", "B", "B", "B", "B",
  "R", "R", "R", "R", "R", "R", "R", "R", "R", "R",
  "R", "R", "R", "R", "R", "R", "R", "R", "R", "R",
  "B", "B", "B", "B", "R", "R", "B", "B", "B", "B",
  "B", "B", "B", "B", "R", "R", "B", "B", "B", "B",
  "B", "B", "B", "B", "R", "R", "B", "B", "B", "B",
  "B", "B", "B", "B", "R", "R", "B", "B", "B", "B",
];
// Tổng: 80 ô 'B' và 20 ô 'R'