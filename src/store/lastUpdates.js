import { defineStore } from 'pinia';
import Client from '@/utils/client.js';

export const useLastUpdatesStore = defineStore('lastUpdates', {
  state: () => {
    return {
      lastUpdatesList: [],
    };
  },
  getters: {
    //
  },
  actions: {
    async getUpdateList(projectId, page) {
      //Sort de entries
      // https://docs.strapi.io/dev-docs/api/rest/sort-pagination#pagination-by-page
      const uri = `/update-lists?populate=*&filters[project][id][$eq]=${projectId}&sort=id:desc&pagination[page]=${page}&pagination[pageSize]=5`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.lastUpdatesList = res.data;
          return res.meta;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteItem(itemId) {
      const uri = `/update-lists/${itemId}`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodDelete();
        if (rawResponse.status === 200) {
          const entry = this.lastUpdatesList.find(
            (itemId) => itemId.id == itemId,
          );
          console.log(entry);
          const data = this.lastUpdatesList.map((e) => e.id).indexOf(itemId);
          console.log(data);
          this.lastUpdatesList.splice(data, 1);
          return true;
        }
      } catch (e) {
        console.log(e);
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
