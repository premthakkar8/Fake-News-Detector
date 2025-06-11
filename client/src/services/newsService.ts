import axios from 'axios';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export interface NewsArticle {
  title: string;
  description: string;
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
    const {
      query = '',
      category = '',
      language = 'en',
      sortBy = 'publishedAt',
      pageSize = 20,
      page = 1
    } = params;

    const apiParams: any = {
      apiKey: NEWS_API_KEY,
      pageSize,
      page,
      sortBy,
      language,
    };
    if (query) apiParams.q = query;
    if (category) apiParams.category = category;

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: apiParams
    });

    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
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