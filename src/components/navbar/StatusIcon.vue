<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <PrimaryButton
    v-if="isProject"
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

const projectsStore = useProjectsStore(),
  route = useRoute(),
  projectStatus = ref(),
  isProject = ref(false),
  openSnackBar = ref(false),
  errorMessage = ref(false),
  message = ref('');

onMounted(async () => {
  const res = await projectsStore.getProject(route.params.id);
  if (res.data) {
    isProject.value = true;
    projectStatus.value = res.data.attributes.under_construction;
  } else {
    projectStatus.value = false;
  }
});

const handleState = async () => {
  const statusUpdated = await projectsStore.updateProjectStatus(
    route.params.id,
    !projectStatus.value,
  );
  if (statusUpdated) {
    projectStatus.value = !projectStatus.value;
    message.value = 'Status updated';
    openSnackBar.value = true;
  }
};
</script>
