// Utility function to handle asset paths for GitHub Pages deployment
export function getAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production (GitHub Pages), prepend the base path
  if (process.env.NODE_ENV === 'production') {
    return `/brandon-funnel/${cleanPath}`;
  }
  
  // In development, use the normal path
  return `/${cleanPath}`;
}