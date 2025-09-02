

// Escape regex special characters so a string can safely be used in a regex search
export function escapeLocation(text: string): string {
  // Replace anything that is not a letter or number with escaped version
  return text.replace(/[^A-Za-z0-9]/g, "\\$&");
}
