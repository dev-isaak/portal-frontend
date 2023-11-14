import { useAuthStore } from '@/store/authStore.ts';

export default class Client {
  authStore = useAuthStore();
  jwt = this.authStore.jwt;
  uri = import.meta.env.VITE_APP_BASE_API;

  constructor(endpoint) {
    this.endpoint = endpoint;
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
    return rawResponse;
  }

  async login(body) {
    const rawResponse = await fetch(this.uri + this.endpoint, {
      method: 'POST',
      // If body has a file does not include the content type
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    return rawResponse;
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
    return rawResponse;
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
    return rawResponse;
  }
}
