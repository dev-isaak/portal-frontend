import { defineStore } from 'pinia';
import Client from '@/utils/client.js';

export const useDocumentationStore = defineStore('documentation', {
  state: () => {
    return {
      docuList: [],
    };
  },
  getters: {
    //
  },
  actions: {
    /**
     * Get all the documentation related to a project
     * @param {*} jwt
     * @param {*} projectId
     * @returns an array
     */
    async getProjectDocumentation(projectId) {
      const uri = `/projects/${projectId}?populate[documents][populate]=*`;
      const client = new Client(uri);

      try {
        const rawResponse = await client.getMethodGet();

        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.docuList = res.data.attributes.documents.data;
          return this.docuList;
        }
        //Arreglar manejo de errores
        else if (rawResponse.status === 404) return '404';
        else if (rawResponse.status === 500) return '500';
      } catch (e) {
        console.log(e);
      }
    },
    async deleteFile(documentId) {
      const uri = `/documents/${documentId}`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodDelete();

        if (rawResponse.status === 200) {
          //mapeo el id del elemento y busco el índice para posteriormente eliminar
          //el valor usando la posición obtenida
          const position = this.docuList.map((e) => e.id).indexOf(documentId);
          this.docuList.splice(position, 1);
          return true;
        } else {
          console.log('NO SE HA ENCONTRADO EL ELEMENTO');
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async uploadDocument(fileName, idUploadedFile, projectId) {
      const uri = `/documents?populate=*`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          doc_name: `${fileName}`,
          file: `${idUploadedFile}`,
          project: `${projectId}`,
        },
      });
      try {
        const rawResponse = await client.getMethodPost(body);
        const res = await rawResponse.json();
        if (rawResponse.status === 200) {
          this.docuList.push(res.data);
          /**
           * Sort the result into docuList
           */
          this.docuList.sort((a, b) => {
            if (a.attributes.doc_name > b.attributes.doc_name) {
              return 1;
            }
            if (a.attributes.doc_name < b.attributes.doc_name) {
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
    async downloadDocument(fileURL, label) {
      try {
        const res = await fetch(fileURL);
        const blob = await res.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = label;
        link.click();
        URL.revokeObjectURL(link.href);
      } catch (e) {
        console.error(e);
      }
    },
  },
});
