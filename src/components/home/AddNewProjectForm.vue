<template>
  <SnackBar
    :text="selectedData.message.value"
    :error="selectedData.errorMessage.value"
    :openSnackBar="selectedData.openSnackBar.value"
    @closeSnackBar="handleSnackBarState"
  />
  <PrimaryButton
    @click="handleOpenDialog"
    @closeDialog="closeDialog"
    actionText="Create"
    formDialog
    text="Add New Project"
    :handleCreateOption="addNewProject"
    :isLoading="selectedData.isLoading.value"
    :openDialog="selectedData.openDialog.value"
    variant="text"
  >
    <ProjectForm
      @selectedName="projectName"
      @selectedCustomer="customerName"
      @selectedMachineType="machineType"
      @selectedSerialNumber="serialNumber"
      @selectedDate="selectedDatePicker"
      @selectedProvider="coesiaProvider"
      :message="selectedData.message.value"
      :projectPosted="selectedData.projectState.value"
      :uploadSuccess="selectedData.uploadSuccess.value"
    />
  </PrimaryButton>
</template>

<script setup lang="ts">
import ProjectForm from '@/components/forms/ProjectForm.vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import { useProjectsStore } from '@/store/projectsStore';
import SnackBar from '@/components/atoms/SnackBar.vue';
/**
 * Init Stores
 */
const projectsStore = useProjectsStore();
/**
 * Binding
 */
const selectedData = {
  selectedName: ref(''),
  parsedDate: ref(''),
  selectedMachineType: ref(''),
  selectedSerialNumber: ref(''),
  selectedCustomer: ref(''),
  message: ref(),
  projectState: ref(false),
  uploadSuccess: ref(true),
  isLoading: ref(false),
  selectedCoesiaProvider: ref(''),
  openSnackBar: ref(false),
  errorMessage: ref(false),
  openDialog: ref(false),
};

/**
 * Emits from form
 */
const projectName = (e) => (selectedData.selectedName.value = e);
const customerName = (e) => (selectedData.selectedCustomer.value = e);
const machineType = (e) => (selectedData.selectedMachineType.value = e);
const serialNumber = (e) => (selectedData.selectedSerialNumber.value = e);
const selectedDatePicker = (e) => (selectedData.parsedDate.value = e);
const coesiaProvider = (e) => (selectedData.selectedCoesiaProvider.value = e);

const handleOpenDialog = () => {
  selectedData.openDialog.value = true;
};

const closeDialog = (e) => {
  selectedData.openDialog.value = false;
  if (e) {
    selectedData.isLoading.value = false;
  }
};

const handleSnackBarState = (close) => {
  selectedData.openSnackBar.value = close;
};
/**
 * When click 'add customer button' first we call function parseDate to parse format date
 * Then we fetch postnNewCustomer at customerStore
 * Returns a validation massage which is rendered as 'message'
 */
const addNewProject = async () => {
  selectedData.isLoading.value = true;
  const projectCreated = await projectsStore.postNewProject(
    selectedData.selectedName.value.toUpperCase(),
    selectedData.parsedDate.value,
    selectedData.selectedCustomer.value,
    selectedData.selectedMachineType.value,
    selectedData.selectedSerialNumber.value,
    selectedData.selectedCoesiaProvider.value,
  );

  if (projectCreated) {
    selectedData.uploadSuccess.value = true;
    selectedData.projectState.value = true;
    selectedData.message.value = 'Project created succesfully';
    selectedData.openSnackBar.value = true;
    selectedData.isLoading.value = false;
    selectedData.openDialog.value = false;
  } else {
    selectedData.uploadSuccess.value = false;
    selectedData.message.value =
      'Document could not be uploaded. Please, try again later.';
    selectedData.errorMessage.value = true;
    selectedData.openSnackBar.value = true;
    selectedData.isLoading.value = false;
  }
};
</script>
