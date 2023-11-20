<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <PrimaryButton
    actionText="Upload"
    formDialog
    variant="text"
    text="Add new document"
    :handleCreateOption="addNewDocument"
    :isLoading="isLoading"
  >
    <form>
      <h3>Add a new document</h3>
      <v-divider class="my-4"></v-divider>
      <v-text-field
        label="Document Name"
        v-model="selectedDocumentName"
        clearable
        :rules="[rules.required]"
      ></v-text-field>
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
import type { Ref } from 'vue';
import { useDocumentationStore } from '@/store/documentationStore.ts';
import { useUploadStore } from '@/store/uploadStore.ts';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

const documentationStore = useDocumentationStore();
const uploadStore = useUploadStore();

const selectedDocumentName: Ref<string | null> = ref(''),
  fileUploaded = ref([]),
  message = ref(''),
  route = useRoute(),
  uploadSuccess = ref(true),
  isLoading = ref(false),
  openSnackBar = ref(false),
  errorMessage = ref(false);

const rules = {
  required: (value) => !!value || 'Field is required',
};

const addNewDocument = async () => {
  isLoading.value = true;
  const fileId = await uploadStore.uploadFile(fileUploaded.value);
  const isUploaded = await documentationStore.uploadDocument(
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
    fileUploaded.value = null;
    message.value = 'Document uploaded succesfully';
    openSnackBar.value = true;
    isLoading.value = false;
  }
};
</script>
