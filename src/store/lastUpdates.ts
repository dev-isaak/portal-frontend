import { defineStore } from 'pinia';
import Client from '@/utils/client.ts';

export const useLastUpdatesStore = defineStore('lastUpdates', {
  state: () => {
    return {
      lastUpdatesList: [],
      message: '',
    };
  },
  getters: {
    currentMessage: (state) => state.message,
  },
  actions: {
    async getUpdateList(projectId, page) {
      const uri = `/update-lists?populate=*&filters[project][id][$eq]=${projectId}&sort=id:desc&pagination[page]=${page}&pagination[pageSize]=5`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        const res = await rawResponse.json();
        this.lastUpdatesList = res.data;
        return res.meta;
      } catch (e) {
        this.message = client.errMessage;
        console.error(e);
      }
    },
    async deleteItem(itemId) {
      const uri = `/update-lists/${itemId}`;
      const client = new Client(uri);
      try {
        await client.getMethodDelete();
        this.lastUpdatesList.find((itemId) => itemId.id == itemId);
        const data = this.lastUpdatesList.map((e) => e.id).indexOf(itemId);
        this.lastUpdatesList.splice(data, 1);
        this.message = 'Log deleted succesfully.';
        return true;
      } catch (e) {
        this.message = client.errMessage;
        console.error(e);
      }
    },
    async changeWarningValue(itemId) {
      const uri = `/update-lists/${itemId}`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          warning: false,
        },
      });
      try {
        const rawResponse = await client.getMethodPut(body);
        if (rawResponse.status === 200) {
          //actualizar el array this.lasUpdatesList
          this.lastUpdatesList.forEach((e) => (e.attributes.warning = false));
          return true;
        } else {
          this.message = 'Cannot update training state';
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
});
