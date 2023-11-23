import { defineStore } from 'pinia';
import Client from '@/utils/client';
import sort from '@/utils/sort';

export const useTrainingStore = defineStore('training', {
  state: () => {
    return {
      trainingList: [],
      message: '',
    };
  },
  getters: {
    currentMessage: (state) => state.message,
  },
  actions: {
    async getTrainingList(projectId: string) {
      const uri = `/projects/${projectId}?populate[trainings][populate]=*`;
      const client = new Client(uri);
      try {
        const rawResponse = await client.getMethodGet();
        const res = await rawResponse.json();
        this.trainingList = res.data.attributes.trainings.data;
        sort(this.trainingList, 'file_name');

        return true;
      } catch (e) {
        console.error(e);
      }
    },
    async postTrainingDoc(
      fileName: string | null,
      idUploadedFile: number,
      projectId: number,
    ) {
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

        const res = await rawResponse.json();
        this.trainingList.push(res.data);
        sort(this.trainingList, 'file_name');

        this.message = 'Training uploaded succesfully.';
        return true;
      } catch (e) {
        this.message = client.errMessage;
        console.error(e);
      }
    },
    async updateTrainingState(projectId: number, currentState: string) {
      const uri = `/projects/${projectId}`;
      const client = new Client(uri);
      const body = JSON.stringify({
        data: {
          training_state: `${currentState}`,
        },
      });
      try {
        await client.getMethodPut(body);
        this.message = 'State updated succesfully.';
        return true;
      } catch (e) {
        this.message = client.errMessage;
        console.error(e);
      }
    },
    async deleteTraining(trainingId: number) {
      const uri = `/trainings/${trainingId}`;
      const client = new Client(uri);
      try {
        await client.getMethodDelete();
        //mapeo el id del elemento y busco el índice para posteriormente eliminar
        //el valor usando la posición obtenida
        const position = this.trainingList.map((e) => e.id).indexOf(trainingId);
        this.trainingList.splice(position, 1);
        this.message = 'Training deleted successfully.';
        return true;
      } catch (e) {
        this.message = client.errMessage;
        console.error(e);
      }
    },
  },
});
