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
    variant="text"
    text="Upload Maint. Plan"
    :handleCreateOption="addNewDocument"
    :isLoading="isLoading"
  >
    <form>
      <h3>Upload Maintenance Plan File</h3>
      <v-divider class="my-4"></v-divider>
      <v-file-input
        prepend-icon=""
        prepend-inner-icon="mdi-paperclip"
        label="Upload File"
        v-model="fileUploaded"
        :loading="handleLoading"
        class="w-100"
        :rules="[rules.required]"
      ></v-file-input>
    </form>
  </PrimaryButton>
</template>

<script setup>
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import { useProjectsStore } from '@/store/projectsStore.js';
import { useUploadStore } from '@/store/uploadStore.js';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

const projectsStore = useProjectsStore();
const uploadStore = useUploadStore();

//const selectedDocumentName = ref('')
const fileUploaded = ref([]);
const route = useRoute();
const uploadSuccess = ref(true);
const isLoading = ref(false);
const openSnackBar = ref(false);
const errorMessage = ref(false);
const message = ref('');
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

const rules = {
  required: (value) => !!value || 'Field is required',
};

const addNewDocument = async () => {
  isLoading.value = true;
  const fileId = await uploadStore.uploadFile(fileUploaded.value);
  const isUploaded = await projectsStore.uploadMaintenacefile(
    route.params.id,
    fileId,
  );

  if (!isUploaded) {
    uploadSuccess.value = false;
    message.value = 'Document could not be uploaded. Please, try again later.';
    errorMessage.value = true;
    openSnackBar.value = true;
  } else {
    uploadSuccess.value = true;
    //selectedDocumentName.value = ''
    fileUploaded.value = [];
    message.value = 'Document uploaded succesfully';
    openSnackBar.value = true;
    isLoading.value = false;
    openDialog.value = false;
  }
};
</script>
