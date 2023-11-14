import { defineStore } from 'pinia';
import Client from '@/utils/client.js';

export const useFaqStore = defineStore('faq', {
  state: () => {
    return {};
  },
  getters: {
    //
  },
  actions: {
    async getFaqs() {
      const uri = `/faqs`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        const res = await rawResponse.json();
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
