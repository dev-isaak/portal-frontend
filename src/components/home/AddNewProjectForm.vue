<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <PrimaryButton
    @click="handleOpenDialog"
    @closeDialog="closeDialog"
    actionText="Create"
    formDialog
    text="Add New Project"
    :handleCreateOption="addNewProject"
    :isLoading="isLoading"
    :openDialog="openDialog"
    variant="text"
  >
    <ProjectForm
      @selectedName="projectName"
      @selectedCustomer="customerName"
      @selectedMachineType="machineType"
      @selectedSerialNumber="serialNumber"
      @selectedDate="selectedDatePicker"
      @selectedProvider="coesiaProvider"
      :message="message"
      :projectPosted="projectState"
      :uploadSuccess="uploadSuccess"
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
  parsedDate = ref(''),
  selectedMachineType: Ref<string | null> = ref(''),
  selectedSerialNumber: Ref<string | null> = ref(''),
  selectedCustomer: Ref<string | null> = ref(''),
  message = ref(),
  projectState = ref(false),
  uploadSuccess = ref(true),
  isLoading = ref(false),
  selectedCoesiaProvider: Ref<string | null> = ref(''),
  openSnackBar = ref(false),
  errorMessage = ref(false),
  openDialog = ref(false);

/** Emits from form */
const projectName = (e: string | null) => (selectedName.value = e);
const customerName = (e: string | null) => (selectedCustomer.value = e);
const machineType = (e: string | null) => (selectedMachineType.value = e);
const serialNumber = (e: string | null) => (selectedSerialNumber.value = e);
const selectedDatePicker = (e) => (parsedDate.value = e);
const coesiaProvider = (e: string | null) => (selectedCoesiaProvider.value = e);

const handleOpenDialog = () => (openDialog.value = true);

const closeDialog = (e: boolean) => {
  openDialog.value = false;
  if (e) {
    isLoading.value = false;
  }
};

/**
 * When click 'add customer button' first we call function parseDate to parse format date
 * Then we fetch postnNewCustomer at customerStore
 * Returns a validation massage which is rendered as 'message'
 */
const addNewProject = async () => {
  isLoading.value = true;
  console.log(selectedName.value);
  const projectCreated = await projectsStore.postNewProject(
    selectedName.value,
    parsedDate.value,
    selectedCustomer.value,
    selectedMachineType.value,
    selectedSerialNumber.value,
    selectedCoesiaProvider.value,
  );

  if (projectCreated) {
    uploadSuccess.value = true;
    projectState.value = true;
    message.value = 'Project created succesfully';
    openSnackBar.value = true;
    isLoading.value = false;
    openDialog.value = false;
  } else {
    uploadSuccess.value = false;
    message.value = 'Document could not be uploaded. Please, try again later.';
    errorMessage.value = true;
    openSnackBar.value = true;
    isLoading.value = false;
  }
};
</script>
