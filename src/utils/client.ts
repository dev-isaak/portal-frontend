import { useAuthStore } from '@/store/authStore.ts';

export default class Client {
  authStore = useAuthStore();
  jwt: string | null = this.authStore.jwt;
  uri: string = import.meta.env.VITE_APP_BASE_API;
  endpoint: string;
  errMessage: string = '';

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.errMessage;
  }

  async handleResponse(response: Response): Promise<unknown> {
    if (response.status === 200) {
      return response;
    } else {
      if (response.status === 400) {
        this.errMessage = response.statusText;
      } else if (response.status === 404) {
        this.errMessage = response.statusText;
      } else if (response.status === 405) {
        this.errMessage = response.statusText;
      } else if (response.status === 500) {
        this.errMessage = response.statusText;
      } else {
        console.error(response);
      }
      throw new Error(response.statusText);
    }
  }

  async getMethodGet() {
    const rawResponse = await fetch(this.uri + this.endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.jwt}`,
      },
    });
    return rawResponse;
  }

  async getMethodDelete() {
    const rawResponse = await fetch(this.uri + this.endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.jwt}`,
      },
    });
    return this.handleResponse(rawResponse);
  }

  async login(body: string) {
    const rawResponse = await fetch(this.uri + this.endpoint, {
      method: 'POST',
      // If body has a file does not include the content type
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    return this.handleResponse(rawResponse);
  }

  async getMethodPost(body) {
    const rawResponse = await fetch(this.uri + this.endpoint, {
      method: 'POST',
      // If body has a file does not include the content type
      headers:
        body.constructor.name != 'FormData'
          ? {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.jwt}`,
            }
          : {
              Authorization: `Bearer ${this.jwt}`,
            },
      body: body,
    });
    return this.handleResponse(rawResponse);
  }

  async getMethodPut(body) {
    const rawResponse = await fetch(this.uri + this.endpoint, {
      method: 'PUT',
      // If body has a file does not include the content type
      headers:
        body.constructor.name === 'FormData'
          ? {
              Authorization: `Bearer ${this.jwt}`,
            }
          : {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.jwt}`,
            },
      body: body,
    });
    return this.handleResponse(rawResponse);
  }
}
