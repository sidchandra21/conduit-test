export interface UserData {
  username: string;
  email: string;
  password: string;
}

export interface ArticleData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export function generateUser(prefix = 'qa'): UserData {
  const id = crypto.randomUUID().replace(/-/g, '');
  const cleanPrefix =
  prefix.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'qa';

  const username = `${cleanPrefix}${id.slice(0, 12)}`;

  return {
    username,
    email: `${username}@example.com`,
    password: `Pass${id.slice(0, 15)}!`,
  };
};


export function generateArticle(prefix = 'Article'): ArticleData {
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    title: `${prefix} ${uniqueId}`,
    description: `Automated test description for ${uniqueId}`,
    body: `Full markdown body content for article ${uniqueId}.`,
    tagList: ['automation', 'playwright'],
  };
}