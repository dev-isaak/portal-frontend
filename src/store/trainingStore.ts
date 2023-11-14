import { defineStore } from 'pinia';
import Client from '@/utils/client.ts';

export const useTrainingStore = defineStore('training', {
  state: () => {
    return {
      trainingList: [],
    };
  },
  getters: {},
  actions: {
    async getTrainingList(projectId) {
      const uri = `/projects/${projectId}?populate[trainings][populate]=*`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.trainingList = res.data.attributes.trainings.data;
          this.trainingList.sort((a, b) => {
            if (a.attributes.file_name > b.attributes.file_name) {
              return 1;
            }
            if (a.attributes.file_name < b.attributes.file_name) {
              return -1;
            }
            return 0;
          });
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async postNewDocument(fileName, idUploadedFile, projectId) {
      const uri = `/trainings?populate=*`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          file_name: `${fileName}`,
          training_docs: `${idUploadedFile}`,
          project: `${projectId}`,
        },
      });
      try {
        const rawResponse = await client.getMethodPost(body);
        if (rawResponse.status === 200) {
          const res = await rawResponse.json();
          this.trainingList.push(res.data);
          this.trainingList.sort((a, b) => {
            if (a.attributes.file_name > b.attributes.file_name) {
              return 1;
            }
            if (a.attributes.file_name < b.attributes.file_name) {
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
    async deleteTraining(trainingId) {
      const uri = `/trainings/${trainingId}`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodDelete();
        if (rawResponse.status === 200) {
          //mapeo el id del elemento y busco el índice para posteriormente eliminar
          //el valor usando la posición obtenida
          const position = this.trainingList
            .map((e) => e.id)
            .indexOf(trainingId);
          this.trainingList.splice(position, 1);
        } else {
          console.log('NO SE HA ENCONTRADO EL ELEMENTO');
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
});
