const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=Preview+Unavailable";

const isImageLikeUrl = (url) => {
  return (
    /images\.unsplash\.com|images\.pexels\.com|i\.ibb\.co|cdn\.instagram\.com|res\.cloudinary\.com|raw\.githubusercontent\.com|githubusercontent\.com/i.test(
      url
    ) ||
    /\.(jpeg|jpg|png|gif|webp|svg)(\?.*)?$/i.test(url)
  );
};

const normalizeMediaUrl = (rawUrl) => {
  const url = (rawUrl || "").trim();

  if (!url) {
    return {
      sourceType: "unknown",
      originalUrl: rawUrl,
      thumbnailUrl: PLACEHOLDER_IMAGE,
      validationStatus: "invalid",
    };
  }

  const isValidProtocol = /^https?:\/\//i.test(url);

  if (!isValidProtocol) {
    return {
      sourceType: "unknown",
      originalUrl: rawUrl,
      thumbnailUrl: PLACEHOLDER_IMAGE,
      validationStatus: "invalid",
    };
  }

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/i
    );

    if (videoIdMatch) {
      const videoId = videoIdMatch[1];

      return {
        sourceType: "youtube",
        originalUrl: url,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        validationStatus: "valid",
      };
    }
  }

  if (
    url.includes("raw.githubusercontent.com") ||
    url.includes("githubusercontent.com") ||
    url.includes("cloudinary.com") ||
    isImageLikeUrl(url)
  ) {
    return {
      sourceType: url.includes("cloudinary.com") ? "cloudinary" : "image",
      originalUrl: url,
      thumbnailUrl: url,
      validationStatus: "valid",
    };
  }

  return {
    sourceType: "unknown",
    originalUrl: url,
    thumbnailUrl: PLACEHOLDER_IMAGE,
    validationStatus: "invalid",
  };
};

module.exports = {
  normalizeMediaUrl,
};