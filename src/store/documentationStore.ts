import { defineStore } from 'pinia';
import Client from '@/utils/client';
import sort from '@/utils/sort';

export const useDocumentationStore = defineStore('documentation', {
  state: () => {
    return {
      docuList: [],
      message: '',
    };
  },
  getters: {
    currentMessage: (state) => state.message,
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
    async deleteFile(documentId: number) {
      const uri = `/documents/${documentId}`;
      const client = new Client(uri);
      try {
        await client.getMethodDelete();
        //mapeo el id del elemento y busco el índice para posteriormente eliminar
        //el valor usando la posición obtenida
        const position = this.docuList.map((e) => e.id).indexOf(documentId);
        this.docuList.splice(position, 1);
        return true;
      } catch (e) {
        console.error(e);
        this.message = client.errMessage;
      }
    },
    async uploadDocument(
      fileName: string,
      idUploadedFile: number,
      projectId: string,
    ) {
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

        this.docuList.push(res.data);
        sort(this.docuList, 'doc_name');
        this.message = 'Document uploaded succesfully.';
        return true;
      } catch (e) {
        console.error(e);
        this.message = client.errMessage;
      }
    },
    async downloadDocument(fileURL: string, label) {
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
