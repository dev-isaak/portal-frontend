import { defineStore } from 'pinia';
import Client from '@/utils/client.ts';
import sort from '@/utils/sort';

export const useCatalogStore = defineStore('catalog', {
  state: () => {
    return {
      catalogList: {},
      message: '',
    };
  },
  getters: {
    currentMessage: (state) => state.message,
  },

  actions: {
    async getCatalogList(projectId) {
      const uri = `/projects/${projectId}?populate[catalogs][populate]=*`;
      const client = new Client(uri);

      try {
        const rawResponse = await client.getMethodGet();

        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.catalogList = res.data.attributes.catalogs.data;
          return this.catalogList;
        }
        //Arreglar manejo de errores
        else if (rawResponse.status === 404) return '404';
        else if (rawResponse.status === 500) return '500';
      } catch (e) {
        console.log(e);
      }
    },
    async deleteCatalog(catalogId) {
      const uri = `/catalogs/${catalogId}`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodDelete();
        this.catalogList.find((idCatalog) => idCatalog.id == catalogId);
        const data = this.catalogList.map((e) => e.id).indexOf(catalogId);
        this.catalogList.splice(data, 1);
        this.message = 'Catalog deleted succesfully.';
        return true;
      } catch (e) {
        this.message = client.errMessage;
        console.error(e);
      }
    },
    async uploadCatalog(
      fileName: string,
      idUploadedFile: number,
      idIconUploaded: number,
      projectId,
    ) {
      const uri = `/catalogs?populate=*`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          Name: `${fileName}`,
          files: `${idUploadedFile}`,
          project: `${projectId}`,
          icon: `${idIconUploaded}`,
        },
      });
      try {
        const rawResponse = await client.getMethodPost(body);
        const res = await rawResponse.json();
        this.catalogList.push(res.data);
        sort(this.catalogList, 'Name');
        this.message = 'Document uploaded succesfully.';
        return true;
      } catch (e) {
        this.message = client.errMessage;
        console.error(e);
      }
    },
  },
});
