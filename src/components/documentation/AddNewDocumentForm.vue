<template>
  <SnackBar
    :text="documentationStore.currentMessage || uploadStore.currentMessage"
    :error="isErrorMessage"
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
import { useDocumentationStore } from '@/store/documentationStore';
import { useUploadStore } from '@/store/uploadStore';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';
import type { RouteParams } from '@/types/global';

const documentationStore = useDocumentationStore();
const uploadStore = useUploadStore();
const route = useRoute();

const selectedDocumentName: Ref<string | null> = ref(''),
  fileUploaded: Ref<File[] | null> = ref([]),
  uploadSuccess = ref(true),
  isLoading = ref(false),
  openSnackBar = ref(false),
  isErrorMessage = ref(false);

const rules = {
  required: (value) => !!value || 'Field is required',
};

// tipar!!
// const routeId: {
//   params: RouteParams;
// } = route.params.id;

const addNewDocument = async () => {
  isLoading.value = true;
  openSnackBar.value = false;

  const fileId = await uploadFile();
  if (!fileId) {
    uploadSuccess.value = false;
    isErrorMessage.value = true;
    openSnackBar.value = true;
    isLoading.value = false;
  } else if (fileId && selectedDocumentName.value != null) {
    const isUploaded = await documentationStore.uploadDocument(
      selectedDocumentName.value,
      fileId,
      route.params.id,
    );

    if (!isUploaded) {
      uploadSuccess.value = false;
      isErrorMessage.value = true;
    } else {
      uploadSuccess.value = true;
      selectedDocumentName.value = null;
      fileUploaded.value = null;
      isErrorMessage.value = false;
    }
    openSnackBar.value = true;
    isLoading.value = false;
  }
};

const uploadFile = async () => await uploadStore.uploadFile(fileUploaded.value);
</script>
