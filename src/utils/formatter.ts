export const formatTitle = (camelCaseStr: string): string => {
  if (!camelCaseStr) return "";

  // Add a space before each uppercase letter, then capitalize the first letter.
  const spacedStr = camelCaseStr.replace(/([A-Z])/g, " $1");
  return spacedStr.charAt(0).toUpperCase() + spacedStr.slice(1);
};
