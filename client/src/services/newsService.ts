import axios from 'axios';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export interface NewsArticle {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  isFake?: boolean;
  confidence?: number;
}

export interface NewsSearchParams {
  query?: string;
  country?: string;
  category?: string;
  language?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  pageSize?: number;
  page?: number;
}

export const fetchNews = async (params: NewsSearchParams = {}): Promise<NewsArticle[]> => {
  try {
    if (!NEWS_API_KEY) {
      throw new Error('News API key is not configured. Please add REACT_APP_NEWS_API_KEY to your .env file.');
    }

    const {
      query = '',
      category = '',
      language = 'en',
      sortBy = 'publishedAt',
      pageSize = 20,
      page = 1,
      country = 'us' // Default to US news
    } = params;

    const apiParams: any = {
      apiKey: NEWS_API_KEY,
      pageSize,
      page,
      sortBy,
      language,
      country
    };
    if (query) apiParams.q = query;
    if (category) apiParams.category = category;

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: apiParams
    });

    if (!response.data.articles) {
      throw new Error('Invalid response from News API');
    }

    return response.data.articles;
  } catch (error: any) {
    console.error('Error fetching news:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`News API Error: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from News API. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'Error fetching news');
    }
  }
};

export const classifyNews = async (title: string, content: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/classify`, {
      title,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error classifying news:', error);
    throw error;
  }
}; 