<template>
  <SnackBar
    :text="trainingStore.currentMessage"
    :error="isErrorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackbar="openSnackBar = false"
  />
  <h1>Training</h1>
  <v-divider></v-divider>
  <v-container>
    <form v-if="role === 3">
      <v-select
        label="Training State"
        :items="['Not Buyed', 'Under Construction', 'Finished']"
        v-model="trainingState"
        @update:modelValue="stateChanged = true"
      ></v-select>
      <v-col class="d-flex flex-column align-center">
        <v-btn
          @click="handleTrainingState"
          :color="stateChanged ? 'error' : '#474747'"
          >Update Training State</v-btn
        >
      </v-col>
    </form>
    <v-sheet v-if="trainingState == 'Not Buyed'">
      <TrainingNotBuyed />
    </v-sheet>
    <v-sheet v-if="trainingState == 'Under Construction'">
      <TrainingUnderConstruction />
    </v-sheet>
    <v-sheet v-if="trainingState == 'Finished'">
      <TrainingList />
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import TrainingNotBuyed from './TrainingNotBuyed.vue';
import TrainingUnderConstruction from './TrainingUnderConstruction.vue';
import TrainingList from './TrainingList.vue';
import { useAuthStore } from '@/store/authStore';
import { ref, onMounted } from 'vue';
import { useProjectsStore } from '@/store/projectsStore';
import { useTrainingStore } from '@/store/trainingStore';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

/** Init Store */
const projectsStore = useProjectsStore();
const trainingStore = useTrainingStore();
const route = useRoute();
const auth = useAuthStore();

/** Binding */
const trainingState = ref(''),
  role = ref(0),
  message = ref(''),
  openSnackBar = ref(false),
  isErrorMessage = ref(false),
  stateChanged = ref(false);

const projectId = route.params.id;

onMounted(async () => {
  role.value = await auth.getUserRole();
  const response = await projectsStore.getProject(projectId);
  if (response === undefined) {
    return;
  } else {
    trainingState.value = projectsStore.trainingState;
  }
});

const handleTrainingState = async () => {
  const isUpdated = await trainingStore.updateTrainingState(
    projectId,
    trainingState.value,
  );
  if (isUpdated) {
    isErrorMessage.value = false;
    stateChanged.value = false;
    message.value = projectsStore.message;
  } else {
    isErrorMessage.value = true;
  }
  openSnackBar.value = true;
};
</script>
