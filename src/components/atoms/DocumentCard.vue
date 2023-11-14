<template>
  <v-card min-width="200">
    <div class="d-flex justify-center">
      <v-icon icon="mdi-file" color="#d70a32" size="100" role="img"></v-icon>
    </div>
    <v-card-title class="text-center">{{ title }}</v-card-title>
    <v-divider></v-divider>
    <v-card-actions>
      <PrimaryButton
        v-if="showFile && mdAndUp"
        @click="handleShowPDFOpenDialog"
        @closeDialog="closeDialog"
        :openDialog="openShowPDFDialog"
        icon="mdi-magnify"
        formDialog
      >
        <iframe :src="fileUrl" class="w-100" height="800"></iframe>
      </PrimaryButton>
      <PrimaryButton icon="mdi-download" @click.prevent="handleDownload" />
      <PrimaryButton
        v-if="userRole > 1"
        @click="handleOpenDialog"
        @closeDialog="closeDialog"
        :openDialog="openDialog"
        confirmationDialog
        textDialog="delete the document"
        icon="mdi-delete-outline"
        iconColor="error"
        :handleTrueOption="handleDelete"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { defineProps, defineEmits, ref } from 'vue';
import { useDocumentationStore } from '@/store/documentationStore';
import { useAuthStore } from '@/store/authStore';
import { useTrainingStore } from '@/store/trainingStore';
import { useDisplay } from 'vuetify';

const docStore = useDocumentationStore();
const authStore = useAuthStore();
const trainingStore = useTrainingStore();
const { mdAndUp } = useDisplay();

const openDialog = ref(false);
const openShowPDFDialog = ref(false);
/**
 * Init variables
 */
const userRole = authStore.role;

const emit = defineEmits('isDeleted');

const props = defineProps({
  title: String,
  handleTrueOption: Function,
  href: String,
  fileUrl: String,
  fileType: String,
  docId: String,
  showFile: Boolean,
});

const handleDelete = async () => {
  if (props.fileType === 'doc') {
    docStore.deleteFile(props.docId);
  } else {
    trainingStore.deleteTraining(props.docId);
  }
  emit('isDeleted', true);
};

const handleDownload = async () => {
  await docStore.downloadDocument(props.fileUrl, props.title);
};

const handleOpenDialog = () => {
  openDialog.value = true;
};

const handleShowPDFOpenDialog = () => {
  openShowPDFDialog.value = true;
};

const closeDialog = () => {
  openDialog.value = false;
  openShowPDFDialog.value = false;
};
</script>
