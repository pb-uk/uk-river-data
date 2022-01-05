export const dateTimeFormat = (date: Date): string => {
  return date.toISOString().substring(0, 16).replace('T', ' ');
};
