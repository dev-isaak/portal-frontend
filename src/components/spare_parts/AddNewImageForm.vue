<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <PrimaryButton
    @click="openDialog = true"
    @closeDialog="openDialog = false"
    :openDialog="openDialog"
    actionText="Upload"
    formDialog
    variant="text"
    text="Upload Sinoptic"
    :handleCreateOption="addNewDocument"
    :isLoading="isLoading"
  >
    <form>
      <h3>Upload Sinoptic</h3>
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

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import { useProjectsStore } from '@/store/projectsStore.ts';
import { useUploadStore } from '@/store/uploadStore.ts';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

const projectsStore = useProjectsStore();
const uploadStore = useUploadStore();

const fileUploaded = ref([]),
  route = useRoute(),
  uploadSuccess = ref(true),
  isLoading = ref(false),
  openSnackBar = ref(false),
  errorMessage = ref(false),
  message = ref(''),
  openDialog = ref(false);

const rules = {
  required: (value) => !!value || 'Field is required',
};

const addNewDocument = async () => {
  isLoading.value = true;
  const fileId = await uploadStore.uploadFile(fileUploaded.value);
  const isUploaded = await projectsStore.uploadSinoptic(
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
    fileUploaded.value = [];
    message.value = 'Document uploaded succesfully';
    openSnackBar.value = true;
    isLoading.value = false;
    openDialog.value = false;
  }
};
</script>
