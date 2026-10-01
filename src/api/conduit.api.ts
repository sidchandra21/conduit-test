import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { API_BASE_URL } from '../../playwright.config';
import { ArticleData, UserData, generateUser } from '../utils/data_generator';

export interface AuthSession {
  user: UserData;
  token: string;
}

export class ConduitApi {
  constructor(private request: APIRequestContext) {}

  async registerUser(userData: UserData = generateUser()): Promise<{ response: APIResponse; session: AuthSession }> {
    const response = await this.request.post(`${API_BASE_URL}/users`, {
      data: { user: userData },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    return {
      response,
      session: {
        user: userData,
        token: body.user.token,
      },
    };
  }

  async createArticle(token: string, article: ArticleData): Promise<APIResponse> {
    return this.request.post(`${API_BASE_URL}/articles/`, {
      headers: { Authorization: `Token ${token}` },
      data: { article },
    });
  }

  async getArticle(slug: string, token?: string): Promise<APIResponse> {
    const headers: Record<string, string> = token ? { Authorization: `Token ${token}` } : {};
    return this.request.get(`${API_BASE_URL}/articles/${slug}`, { headers });
  }

  async updateArticle(token: string, slug: string, articleUpdate: Partial<ArticleData>): Promise<APIResponse> {
    return this.request.put(`${API_BASE_URL}/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
      data: { article: articleUpdate },
    });
  }

  async deleteArticle(token: string, slug: string): Promise<APIResponse> {
    return this.request.delete(`${API_BASE_URL}/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
  }
}