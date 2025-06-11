import React from 'react';

interface NewsCardProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  isFake?: boolean;
  confidence?: number;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  url,
  imageUrl,
  isFake,
  confidence,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        {isFake !== undefined && (
          <div className="flex items-center space-x-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isFake
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}
            >
              {isFake ? 'Fake News' : 'Real News'}
            </span>
            {confidence && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {confidence}% confidence
              </span>
            )}
          </div>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read more →
        </a>
      </div>
    </div>
  );
};

export default NewsCard; 