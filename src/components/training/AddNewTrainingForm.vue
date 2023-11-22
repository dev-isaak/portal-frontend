<template>
  <SnackBar
    :text="trainingStore.currentMessage || uploadStore.currentMessage"
    :error="isErrorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackbar="openSnackBar = false"
  />
  <PrimaryButton
    @click="openDialog = true"
    @closeDialog="openDialog = false"
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
import type { Ref } from 'vue';
import { useTrainingStore } from '@/store/trainingStore';
import { useUploadStore } from '@/store/uploadStore';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

/** Init Stores */
const trainingStore = useTrainingStore();
const uploadStore = useUploadStore();
const route = useRoute();

/** Binding */
const selectedDocumentName: Ref<string | null> = ref(''),
  fileUploaded = ref([]),
  isLoading = ref(false),
  uploadSuccess = ref(true),
  openSnackBar = ref(false),
  isErrorMessage = ref(false),
  openDialog = ref(false);

const addNewDocument = async () => {
  isLoading.value = true;
  const fileId = await uploadFile();
  if (fileId) {
    const isUploaded = await postTrainingDoc(fileId);

    if (!isUploaded) {
      uploadSuccess.value = false;
      isErrorMessage.value = true;
    } else {
      isErrorMessage.value = false;
      uploadSuccess.value = true;
      selectedDocumentName.value = null;
      fileUploaded.value = [];
      openDialog.value = false;
    }
  }
  isLoading.value = false;
  openSnackBar.value = true;
};

const uploadFile = async () => await uploadStore.uploadFile(fileUploaded.value);
const postTrainingDoc = async (fileId: number) => {
  return await trainingStore.postTrainingDoc(
    selectedDocumentName.value,
    fileId,
    route.params.id,
  );
};
</script>
