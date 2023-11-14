import { defineStore } from 'pinia';
import Client from '@/utils/client.js';

export const useUploadStore = defineStore('upload', {
  state: () => {
    return {};
  },
  getters: {},
  actions: {
    async uploadSinopticFile(files) {
      const uri = `/upload`;
      const client = new Client(uri);
      const formData = new FormData();
      formData.append('files', files[0]);
      try {
        const rawResponse = await client.getMethodPost(formData);
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          return res[0].id;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async uploadMaintenanceFile(files) {
      const uri = `/upload`;
      const client = new Client(uri);
      const formData = new FormData();
      formData.append('files', files[0]);
      try {
        const rawResponse = await client.getMethodPost(formData);
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          return res[0].id;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async uploadFile(files) {
      const uri = `/upload`;
      const client = new Client(uri);
      const formData = new FormData();
      formData.append('files', files[0]);
      try {
        const rawResponse = await client.getMethodPost(formData);
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          return res[0].id;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteFile(fileId) {
      const uri = `/upload/files/${fileId}`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodDelete();
        if (rawResponse.status === 200) {
          //mapeo el id del elemento y busco el índice para posteriormente eliminar
          //el valor usando la posición obtenida
          console.log(rawResponse);
          //const position = this.docuList.map(e => e.id).indexOf(documentId)
          //this.docuList.splice(position, 1)
        } else {
          console.log('NO SE HA ENCONTRADO EL ELEMENTO');
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
});
