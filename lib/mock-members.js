export const membersData = Array.from({ length: 900 }).map((_, i) => ({
    id: i + 1,
    name: `Senior Advocate ${i + 1}`,
    elevationYear: 1975 + Math.floor(Math.random() * 49), // 1975 - 2024
  }));
  