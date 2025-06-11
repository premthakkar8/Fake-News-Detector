import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import SearchBar from './components/SearchBar';
import { fetchNews, classifyNews, NewsArticle, NewsSearchParams } from './services/newsService';

function App() {
  const [searchParams, setSearchParams] = useState<NewsSearchParams>({
    query: '',
    category: '',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: 20,
    page: 1
  });
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadInitialNews();
  }, []);

  useEffect(() => {
    // Fetch news with a broad query or category
    fetchNews({ query: '', category: '' }).then(setAllArticles);
  }, []);

  useEffect(() => {
    let filtered = allArticles;
    if (selectedCategory) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }
    // Category filtering is not possible unless you add a custom property
    setFilteredArticles(filtered);
  }, [allArticles, selectedCategory]);

  const loadInitialNews = async () => {
    try {
      setLoading(true);
      const newsArticles = await fetchNews(searchParams);
      const classifiedArticles = await Promise.all(
        newsArticles.map(async (article) => {
          const classification = await classifyNews(
            article.title,
            article.description || ''
          );
          return {
            ...article,
            isFake: classification?.is_fake,
            confidence: classification?.confidence
          };
        })
      );
      setArticles(classifiedArticles);
    } catch (error) {
      setError('Error loading news articles. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    const newParams = { ...searchParams, query };
    setSearchParams(newParams);
    setLoading(true);
    setError(null);

    try {
      const newsArticles = await fetchNews(newParams);
      const classifiedArticles = await Promise.all(
        newsArticles.map(async (article) => {
          const classification = await classifyNews(
            article.title,
            article.description || ''
          );
          return {
            ...article,
            isFake: classification?.is_fake,
            confidence: classification?.confidence
          };
        })
      );
      setArticles(classifiedArticles);
    } catch (error) {
      setError('Error fetching news articles. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newParams: Partial<NewsSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);
    setLoading(true);
    setError(null);

    try {
      const newsArticles = await fetchNews(updatedParams);
      const classifiedArticles = await Promise.all(
        newsArticles.map(async (article) => {
          const classification = await classifyNews(
            article.title,
            article.description || ''
          );
          return {
            ...article,
            isFake: classification?.is_fake,
            confidence: classification?.confidence
          };
        })
      );
      setArticles(classifiedArticles);
    } catch (error) {
      setError('Error fetching news articles. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        
        {/* Filter Controls */}
        <div className="mb-8 flex flex-wrap gap-4">
          
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Today's Headlines</h2>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-4">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              title={article.title}
              description={article.description}
              url={article.url}
              imageUrl={article.urlToImage}
              isFake={article.isFake}
              confidence={article.confidence}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;