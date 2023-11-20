<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <PrimaryButton
    @click="handleOpenDialog"
    @closeDialog="closeDialog"
    :openDialog="openDialog"
    actionText="Upload"
    formDialog
    text="Add new training"
    :handleCreateOption="addNewDocument"
    :isLoading="isLoading"
    variant="text"
  >
    <form>
      <h3>Add a new training document</h3>
      <v-divider class="my-4"></v-divider>
      <v-text-field
        label="Document Name"
        v-model="selectedDocumentName"
        clearable
      ></v-text-field>
      <v-file-input
        prepend-icon=""
        prepend-inner-icon="mdi-paperclip"
        label="Upload File"
        v-model="fileUploaded"
        class="w-100"
      ></v-file-input>
    </form>
  </PrimaryButton>
</template>

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import { useTrainingStore } from '@/store/trainingStore.ts';
import { useUploadStore } from '@/store/uploadStore.ts';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

/** Init Stores */
const trainingStore = useTrainingStore();
const uploadStore = useUploadStore();
const route = useRoute();

/** Binding */
const selectedDocumentName = ref(''),
  fileUploaded = ref([]),
  message = ref(''),
  isLoading = ref(false),
  uploadSuccess = ref(true),
  openSnackBar = ref(false),
  errorMessage = ref(false),
  openDialog = ref(false);

const closeDialog = (e: boolean) => {
  openDialog.value = false;
  if (e) {
    isLoading.value = false;
  }
};
const handleOpenDialog = () => {
  openDialog.value = true;
};

const handleSnackBarState = (close) => {
  openSnackBar.value = close;
};

const addNewDocument = async () => {
  isLoading.value = true;
  const fileId = await uploadStore.uploadFile(fileUploaded.value);
  const isUploaded = await trainingStore.postNewDocument(
    selectedDocumentName.value,
    fileId,
    route.params.id,
  );

  if (!isUploaded) {
    uploadSuccess.value = false;
    message.value = 'Document could not be uploaded. Please, try again later.';
    errorMessage.value = true;
    openSnackBar.value = true;
  } else {
    uploadSuccess.value = true;
    selectedDocumentName.value = null;
    fileUploaded.value = [];
    message.value = 'Document uploaded succesfully';
    isLoading.value = false;
    openSnackBar.value = true;
    openDialog.value = false;
  }
};
</script>
