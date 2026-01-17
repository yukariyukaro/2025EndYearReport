export const getAIImageUrl = (itsc: string) => {
  return `https://api.uuunnniii.com/v4/report2025/images/${encodeURIComponent(
    itsc
  )}.png`;
};

export const getOptimizedAIImageUrl = (itsc: string) => {
  const originalUrl = getAIImageUrl(itsc);
  // Use wsrv.nl for on-the-fly WebP conversion and resizing
  // w=1000: Limit width to 1000px (sufficient for high-DPI mobile screens)
  // output=webp: Convert to modern efficient format
  // q=80: 80% quality (good balance)
  return `https://wsrv.nl/?url=${encodeURIComponent(
    originalUrl
  )}&w=1000&output=webp&q=80`;
};

export const preloadImage = (url: string) => {
  if (typeof window === "undefined") return;
  // 使用 Image 对象进行预加载
  const img = new Image();
  img.src = url;

  // 可选：同时也尝试使用 link rel="preload" 以获得更高的优先级支持
  // 但考虑到兼容性和简单性，Image 对象通常足以触发浏览器缓存
};
