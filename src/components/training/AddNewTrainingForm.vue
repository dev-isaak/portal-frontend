<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
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

<script setup>
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import { useTrainingStore } from '@/store/trainingStore.js';
import { useUploadStore } from '@/store/uploadStore.js';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';
/**
 * Init Stores
 */
const trainingStore = useTrainingStore();
const uploadStore = useUploadStore();
const route = useRoute();
/**
 * Binding
 */
const selectedDocumentName = ref('');
const fileUploaded = ref([]);
const message = ref('');
let isLoading = ref(false);
const uploadSuccess = ref(true);
const openSnackBar = ref(false);
const errorMessage = ref(false);
const openDialog = ref(false);

const closeDialog = (e) => {
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
