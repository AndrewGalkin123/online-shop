// Function to convert path to title

export const convertPath = (path) => {
  if (!path) return path;

  return (path[0].toUpperCase() + path.slice(1))
    .replace(/([A-Z])/g, " $1")
    .trim();
};
