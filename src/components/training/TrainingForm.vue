<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
  />
  <h1>Training</h1>
  <v-divider></v-divider>
  <v-container>
    <form v-if="role === 3">
      <v-select
        label="Training State"
        :items="['Not Buyed', 'Under Construction', 'Finished']"
        v-model="trainingState"
        @update:modelValue="handleUpdate"
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

<script setup>
import TrainingNotBuyed from './TrainingNotBuyed.vue';
import TrainingUnderConstruction from './TrainingUnderConstruction.vue';
import TrainingList from './TrainingList.vue';
import { useAuthStore } from '@/store/authStore.js';
import { ref, onMounted } from 'vue';
import { useProjectsStore } from '@/store/projectsStore.js';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';
/**
 * Init Store
 */
const projectsStore = useProjectsStore();
const route = useRoute();
const auth = useAuthStore();
/**
 * Binding
 */
let trainingState = ref('');
const role = ref('');
let message = ref('');
const openSnackBar = ref(false);
const errorMessage = ref(false);
const stateChanged = ref(false);
const handleSnackBarState = (close) => {
  openSnackBar.value = close;
};

const projectId = route.params.id;

onMounted(async () => {
  role.value = await auth.getUserRole();
  const response = await projectsStore.getProject(projectId);
  if (response === undefined) {
    return;
  } else {
    console.log(projectsStore.trainingState);
    trainingState.value = projectsStore.trainingState;
  }
});

const handleUpdate = () => {
  stateChanged.value = true;
};

const handleTrainingState = async () => {
  await projectsStore.updateTrainingState(projectId, trainingState.value);
  message.value = projectsStore.message;
  openSnackBar.value = true;
  stateChanged.value = false;
};
</script>
