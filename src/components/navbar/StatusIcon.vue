<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
  />
  <PrimaryButton
    v-if="isProject"
    @click="handleOpenDialog"
    @closeDialog="closeDialog"
    :openDialog="openDialog"
    confirmationDialog
    textDialog="change the project state"
    :aditionalText="
      projectStatus
        ? 'It means the customer will see all the project documentation.'
        : 'It means the customer won\'t be availabe to navigate through the project documents.'
    "
    icon="mdi-circle-box-outline"
    :color="!projectStatus ? 'success' : 'error'"
    :iconSize="30"
    :handleTrueOption="handleState"
  >
  </PrimaryButton>
</template>

<script setup lang="ts">
import { useProjectsStore } from '@/store/projectsStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import SnackBar from '../atoms/SnackBar.vue';

const projectsStore = useProjectsStore();
const route = useRoute();
const projectStatus = ref();
const isProject = ref(false);
const openSnackBar = ref(false);
const errorMessage = ref(false);
const message = ref('');
const openDialog = ref(false);

onMounted(async () => {
  const res = await projectsStore.getProject(route.params.id);
  if (res.data) {
    isProject.value = true;
    projectStatus.value = res.data.attributes.under_construction;
  } else {
    projectStatus.value = false;
  }
});

const handleOpenDialog = () => {
  openDialog.value = true;
};

const closeDialog = () => {
  openDialog.value = false;
};

const handleSnackBarState = (close) => {
  openSnackBar.value = close;
};

const handleState = async () => {
  const statusUpdated = await projectsStore.updateProjectStatus(
    route.params.id,
    !projectStatus.value,
  );
  if (statusUpdated) {
    projectStatus.value = !projectStatus.value;
    message.value = 'Status updated';
    openSnackBar.value = true;
    openDialog.value = false;
  }
};
</script>
