// utils/getInitials.js
export const getInitials = (name) => {
    if (!name) return '';
    const names = name.trim().split(' ');
    return names.length >= 2
      ? names[0][0] + names[1][0]
      : names[0][0];
  };
  