<template>
  <SnackBar
    :text="projectsStore.message"
    :error="isErrorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackbar="openSnackBar = false"
  />
  <PrimaryButton
    actionText="Create"
    formDialog
    text="Add New Project"
    :handleCreateOption="addNewProject"
    :isLoading="isLoading"
    variant="text"
    type="submit"
  >
    <ProjectForm
      @selectedName="projectName"
      @selectedCustomer="customerName"
      @selectedMachineType="machineType"
      @selectedSerialNumber="serialNumber"
      @selectedProvider="coesiaProvider"
      :message="message"
      :projectPosted="projectState"
      :uploadSuccess="uploadSuccess"
      :isSuccess="isSuccess"
    />
  </PrimaryButton>
</template>

<script setup lang="ts">
import ProjectForm from '@/components/forms/ProjectForm.vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useProjectsStore } from '@/store/projectsStore';
import SnackBar from '@/components/atoms/SnackBar.vue';

/** Init Stores */
const projectsStore = useProjectsStore();

/** Binding */
const selectedName: Ref<string | null> = ref(''),
  selectedMachineType: Ref<string | null> = ref(''),
  selectedSerialNumber: Ref<string | null> = ref(''),
  selectedCustomer: Ref<string | null> = ref(''),
  message = ref(),
  projectState = ref(false),
  uploadSuccess = ref(true),
  isLoading = ref(false),
  selectedCoesiaProvider: Ref<string | null> = ref(''),
  openSnackBar = ref(false),
  isErrorMessage = ref(false),
  isSuccess = ref(false);

/** Emits from form */
const projectName = (e: string | null) => (selectedName.value = e);
const customerName = (e: string | null) => (selectedCustomer.value = e);
const machineType = (e: string | null) => (selectedMachineType.value = e);
const serialNumber = (e: string | null) => (selectedSerialNumber.value = e);
const coesiaProvider = (e: string | null) => (selectedCoesiaProvider.value = e);

/**
 * When click 'add customer button' first we call function parseDate to parse format date
 * Then we fetch postnNewCustomer at customerStore
 * Returns a validation massage which is rendered as 'message'
 */
const addNewProject = async () => {
  isLoading.value = true;
  const isProjectCreated: boolean | undefined =
    await projectsStore.postNewProject(
      selectedName.value,
      selectedCustomer.value,
      selectedMachineType.value,
      selectedSerialNumber.value,
      selectedCoesiaProvider.value,
    );

  if (isProjectCreated) {
    uploadSuccess.value = true;
    projectState.value = true;
    isSuccess.value = true;
    isErrorMessage.value = false;
  } else {
    uploadSuccess.value = false;
    isErrorMessage.value = true;
    isSuccess.value = false;
  }
  openSnackBar.value = true;
  isLoading.value = false;
};
</script>
