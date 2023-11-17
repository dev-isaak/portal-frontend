import { defineStore } from 'pinia';
import Client from '@/utils/client.ts';
import { loginType } from '@/components/login/types/loginTypes';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      jwt: '',
      userName: '',
      userId: '',
      role: 0,
      errMessage: '',
    };
  },
  getters: {
    actualErrorMessage: (state) => state.errMessage,
  },
  actions: {
    async login(identifier: string, password: string) {
      const uri = `/auth/local`;
      const client = new Client(uri);
      const body = JSON.stringify({
        identifier: identifier,
        password: password,
      });
      try {
        const rawResponse: Response = await client.login(body);
        const res: loginType = await rawResponse.json();
        this.jwt = res.jwt;
        this.userName = res.user.username;
        return true;
      } catch (e) {
        this.errMessage = client.errMessage;
        console.error(e);
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
      this.jwt = '';
      return true;
    },
  },
  persist: true,
});
