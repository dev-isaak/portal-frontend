<template>
  <SnackBar
    :text="catalogStore.currentMessage || uploadStore.currentMessage"
    :error="isErrorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackbar="openSnackBar = false"
  />
  <PrimaryButton
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

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useCatalogStore } from '@/store/catalogStore.ts';
import { useUploadStore } from '@/store/uploadStore.ts';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';

const catalogStore = useCatalogStore();
const uploadStore = useUploadStore();

const selectedDocumentName: Ref<string | null> = ref(''),
  fileUploaded = ref([]),
  iconUploaded = ref([]),
  route = useRoute(),
  uploadSuccess = ref(true),
  isLoading = ref(false),
  openSnackBar = ref(false),
  isErrorMessage = ref(false);

const addNewDocument = async () => {
  const iconId = await uploadIcon();
  const fileId = await uploadFile();
  if (iconId && fileId) {
    const isUploaded = await uploadCatalogDocument(
      selectedDocumentName.value,
      fileId,
      iconId,
    );
    if (!isUploaded) {
      isErrorMessage.value = true;
      uploadSuccess.value = false;
    } else {
      uploadSuccess.value = true;
      selectedDocumentName.value = null;
      fileUploaded.value = [];
      iconUploaded.value = [];
      isLoading.value = false;
    }
    openSnackBar.value = true;
  } else {
    isErrorMessage.value = true;
    uploadSuccess.value = false;
  }
  openSnackBar.value = true;
};

const uploadIcon = async () => await uploadStore.uploadFile(iconUploaded.value);
const uploadFile = async () => await uploadStore.uploadFile(fileUploaded.value);

const uploadCatalogDocument = async (documentName, fileId, iconId) => {
  return catalogStore.uploadCatalog(
    documentName,
    fileId,
    iconId,
    route.params.id,
  );
};
</script>
