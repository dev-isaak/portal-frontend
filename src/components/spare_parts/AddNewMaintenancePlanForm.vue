<template>
  <SnackBar
    :text="projectsStore.currentMessage || uploadStore.currentMessage"
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

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import { useProjectsStore } from '@/store/projectsStore';
import { useUploadStore } from '@/store/uploadStore';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

const projectsStore = useProjectsStore();
const uploadStore = useUploadStore();
const route = useRoute();

const fileUploaded = ref([]),
  uploadSuccess = ref(true),
  isLoading = ref(false),
  openSnackBar = ref(false),
  isErrorMessage = ref(false),
  openDialog = ref(false);

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const addNewDocument = async () => {
  isLoading.value = true;
  const fileId = await uploadFile();
  if (fileId) {
    const isUploaded = await uploadMaintenacefile(fileId);

    if (!isUploaded) {
      uploadSuccess.value = false;
      isErrorMessage.value = true;
      openSnackBar.value = true;
    } else {
      isErrorMessage.value = false;
      uploadSuccess.value = true;
      fileUploaded.value = [];
      openDialog.value = false;
    }
  }
  isLoading.value = false;
  openSnackBar.value = true;
};
const uploadFile = async () => await uploadStore.uploadFile(fileUploaded.value);
const uploadMaintenacefile = async (fileId: number) => {
  return await projectsStore.uploadMaintenacefile(route.params.id, fileId);
};
</script>
