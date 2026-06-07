import {
  Link,
} from "react-router-dom";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";

const AdCard = ({ ad }) => {
  // Try to use ad.thumbnail, fallback to first media image, then placeholder
  let imageUrl = ad.thumbnail;
  if (!imageUrl && Array.isArray(ad.media) && ad.media.length > 0) {
    imageUrl = ad.media[0].thumbnailUrl || ad.media[0].originalUrl;
  }
  if (!imageUrl) {
    imageUrl = PLACEHOLDER_IMAGE;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={imageUrl}
        alt={ad.title}
        className="w-full h-52 object-cover"
        onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
      />
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">
          {ad.title}
        </h2>
        <p className="text-gray-600 mb-2">
          {ad.city?.name}
        </p>
        <p className="text-xl font-bold mb-3">
          PKR {ad.price}
        </p>
        {ad.isFeatured && (
          <span className="bg-yellow-400 text-black px-2 py-1 text-sm rounded">
            Featured
          </span>
        )}
        <div className="mt-4">
          <Link
            to={`/ads/${ad.slug}`}
            className="bg-black text-white px-4 py-2 rounded"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdCard;