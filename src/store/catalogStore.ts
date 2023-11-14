import { defineStore } from 'pinia';
import Client from '@/utils/client.ts';

export const useCatalogStore = defineStore('catalog', {
  state: () => {
    return {
      catalogList: {},
    };
  },
  getters: {
    //
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
        if (rawResponse.status === 200) {
          const catalog = this.catalogList.find(
            (idCatalog) => idCatalog.id == catalogId,
          );
          console.log(catalog);
          const data = this.catalogList.map((e) => e.id).indexOf(catalogId);
          this.catalogList.splice(data, 1);
          return true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async uploadCatalog(fileName, idUploadedFile, idIconUploaded, projectId) {
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
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.catalogList.push(res.data);
          /**
           * Sort the result into docuList
           */
          this.catalogList.sort((a, b) => {
            if (a.attributes.Name > b.attributes.Name) {
              return 1;
            }
            if (a.attributes.Name < b.attributes.Name) {
              return -1;
            }
            return 0;
          });
          return true;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
});
