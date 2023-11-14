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
    text="Add new catalog"
    :handleCreateOption="addNewDocument"
    :isLoading="isLoading"
    variant="text"
  >
    <form>
      <h3>Add a new catalog</h3>
      <v-divider class="my-4"></v-divider>
      <v-text-field
        label="Document Name"
        v-model="selectedDocumentName"
        clearable
      ></v-text-field>
      <v-file-input
        prepend-icon=""
        prepend-inner-icon="mdi-paperclip"
        label="Icon"
        v-model="iconUploaded"
        class="w-100"
      ></v-file-input>
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
import { useCatalogStore } from '@/store/catalogStore.js';
import { useUploadStore } from '@/store/uploadStore.js';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

const catalogStore = useCatalogStore();
const uploadStore = useUploadStore();

const selectedDocumentName = ref('');
const fileUploaded = ref([]);
const iconUploaded = ref([]);
const message = ref('');
const route = useRoute();
const uploadSuccess = ref(true);
const isLoading = ref(false);
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
  const iconId = await uploadStore.uploadFile(iconUploaded.value);
  const fileId = await uploadStore.uploadFile(fileUploaded.value);
  const isUploaded = await catalogStore.uploadCatalog(
    selectedDocumentName.value,
    fileId,
    iconId,
    route.params.id,
  );

  if (!isUploaded) {
    message.value = 'Document could not be uploaded. Please, try again later.';
    errorMessage.value = true;
    openSnackBar.value = true;
    uploadSuccess.value = false;
  } else {
    uploadSuccess.value = true;
    selectedDocumentName.value = null;
    fileUploaded.value = [];
    iconUploaded.value = [];
    message.value = 'Document uploaded succesfully';
    openSnackBar.value = true;
    isLoading.value = false;
    openDialog.value = false;
  }
};
</script>
