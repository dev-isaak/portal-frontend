<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <PrimaryButton
    @click="openDialog = true"
    @closeDialog="openDialog = false"
    :openDialog="openDialog"
    actionText="Upload"
    formDialog
    variant="text"
    text="Modules"
    :handleCreateOption="updateInfo"
    :isLoading="isLoading"
  >
    <form class="d-flex flex-column">
      <h3>Modules</h3>
      <!-- Obtener lista de módulos y representarlo en formulario-->
      <v-divider class="my-4"></v-divider>
      <v-col class="w-100 d-flex justify-center">
        <v-sheet class="w-50 d-flex flex-wrap">
          <v-switch
            v-model="moduleUnwinder"
            label="Unwinder"
            color="green"
          ></v-switch>
          <v-switch
            v-model="moduleForming"
            label="Forming"
            color="green"
          ></v-switch>
          <v-switch
            v-model="moduleFilling"
            label="Dosing"
            color="green"
          ></v-switch>
          <v-switch
            v-model="moduleOutput"
            label="Output"
            color="green"
          ></v-switch>
        </v-sheet>
      </v-col>
    </form>
  </PrimaryButton>
</template>

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectsStore } from '@/store/projectsStore.ts';
import SnackBar from '../atoms/SnackBar.vue';

const projectsStore = useProjectsStore(),
  moduleUnwinder = ref(),
  moduleFilling = ref(),
  moduleForming = ref(),
  moduleOutput = ref(),
  uploadSuccess = ref(true),
  isLoading = ref(false),
  openSnackBar = ref(false),
  errorMessage = ref(false),
  message = ref(''),
  openDialog = ref(false);

onMounted(async () => {
  await projectsStore.getProject(route.params.id);
  const modules = projectsStore.projectModules;
  moduleUnwinder.value = modules[0].module_unwinder;
  moduleFilling.value = modules[0].module_dosing;
  moduleForming.value = modules[0].module_forming;
  moduleOutput.value = modules[0].module_output;
});

const route = useRoute();

const updateInfo = async () => {
  isLoading.value = true;
  moduleUnwinder.value === null
    ? (moduleUnwinder.value = false)
    : moduleUnwinder.value;
  moduleFilling.value === null
    ? (moduleFilling.value = false)
    : moduleFilling.value;
  moduleForming.value === null
    ? (moduleForming.value = false)
    : moduleForming.value;
  moduleOutput.value === null
    ? (moduleOutput.value = false)
    : moduleOutput.value;
  const res = await projectsStore.updateModules(
    route.params.id,
    moduleUnwinder.value,
    moduleFilling.value,
    moduleForming.value,
    moduleOutput.value,
  );
  if (res) {
    uploadSuccess.value = true;
    isLoading.value = false;
    message.value = 'Updated succesfully';
    openSnackBar.value = true;
    openDialog.value = false;
  }
};
</script>
