import { defineStore } from 'pinia';
import axios, { AxiosResponse } from 'axios';

// Define the types for the state
interface Post {
  slug: string;
  post: {
    venue_name: string;
  };
  availability: {
    recommended: { id: string; time: string; text: string }[];
    areas: { id: string; options: { time: string; text: string }[] }[];
  };
}

interface SearchStoreState {
  token: string | null;
  searchId: string | null;
  posts: Post[];
  totalPosts: number;
  isLoading: boolean;
  error: string | null;
}

// Define the types for the response data
interface SearchTokenResponse {
  search_id: string;
}

interface FetchRestaurantsResponse {
  posts: Post[];
  total: number;
}

export const useSearchStore = defineStore('search', {
  state: (): SearchStoreState => ({
    token: null,
    searchId: null,
    posts: [],
    totalPosts: 0,
    isLoading: false,
    error: null,
  }),

  actions: {
    async loginAnonymously(): Promise<void> {
      try {
        const response: AxiosResponse<{ jwt_token: string }> = await axios.post(
          'https://site.ontopo.work/api/loginAnonymously',
          null // No body for this request
        );

        // Save the token
        this.token = response.data.jwt_token;
        localStorage.setItem('jwt_token', this.token);
      } catch (error) {
        console.error('Failed to log in:', error);
        throw new Error('Login failed');
      }
    },

    async createSearchToken(date: string, time: string, guests: number): Promise<void> {
      if (!this.token) {
        console.error('Token is missing. Please log in first.');
        throw new Error('Token is missing');
      }

      try {
        const response: AxiosResponse<SearchTokenResponse> = await axios.post(
          'https://site.ontopo.work/api/search_token',
          {
            criteria: {
              date: date.replace(/-/g, ""), // Format date (YYYYMMDD)
              time: time.replace(':', ""), // Format time (HHmm)
              size: guests.toString(), // Ensure size is a string
            },
            marketplace_id: '15380287', // Static value
            locale: 'en', // Static value
            geocodes: ['belgrade'], // Static value
          },
          {
            headers: {
              token: this.token, // Use the token from loginAnonymously
            },
          }
        );

        // Save the search ID
        this.searchId = response.data.search_id;
      } catch (error) {
        console.error('Failed to create search token:', error);
        throw new Error('Search token creation failed');
      }
    },

    async fetchAvailableRestaurants(): Promise<void> {
      if (!this.searchId) {
        console.error('Search ID is missing. Please create a search token first.');
        throw new Error('Search ID is missing');
      }

      try {
        const response: AxiosResponse<FetchRestaurantsResponse> = await axios.post(
          'https://site.ontopo.work/api/search_request',
          {
            search_id: this.searchId, // Use the search ID from createSearchToken
          },
          {
            headers: {
              token: this.token, // Use the token from loginAnonymously
            },
          }
        );

        // Check if posts already exist
        if (this.posts.length > 0) {
          this.posts = [...this.posts, ...response.data.posts];
        } else {
          this.posts = response.data.posts;
        }

        // Update the totalPosts value
        this.totalPosts = response.data.total;
      } catch (error) {
        console.error('Failed to fetch available restaurants:', error);
        throw new Error('Fetching restaurants failed');
      }
    },

    // Function to run the full workflow
    async runSearchWorkflow(date: string, time: string, guests: number): Promise<void> {
      this.isLoading = true;
      this.error = null;
    
      try {
        if (!this.token) {
          await this.loginAnonymously();
        }
        await this.createSearchToken(date, time, guests); // Step 2: Create Search Token
        await this.fetchAvailableRestaurants(); // Step 3: Fetch Restaurants
      } catch (error: unknown) {
        // Check if the error is an instance of Error
        if (error instanceof Error) {
          console.error('Workflow failed:', error);
          this.error = error.message; // Now `error.message` is accessible
        } else {
          console.error('Workflow failed with unknown error:', error);
          this.error = 'An unknown error occurred'; // Fallback for non-Error objects
        }
      } finally {
        this.isLoading = false;
      }
    },

    clearSearch(): void {
      this.posts = [];
      this.totalPosts = 0;
    },
  },
});
