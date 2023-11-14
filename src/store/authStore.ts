import { defineStore } from 'pinia';
import Client from '@/utils/client.js';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      jwt: null,
      userName: '',
      userId: '',
      role: '',
    };
  },
  getters: {
    //
  },
  actions: {
    //
    async login(identifier, password) {
      const uri = `/auth/local`;
      const client = new Client(uri);
      const body = JSON.stringify({
        identifier: identifier,
        password: password,
      });
      try {
        const rawResponse = await client.login(body);
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.jwt = res.jwt;
          this.userName = res.user.username;
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getUserRole() {
      const uri = `/users/me?populate=role`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.role = res.role.id;
          return res.role.id;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async logout() {
      this.jwt = null;
      return true;
    },
  },
  persist: true,
});
