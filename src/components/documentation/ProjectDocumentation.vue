<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <AdminNavbar>
    <AddNewDocumentForm v-if="mdAndUp" />
    <v-spacer></v-spacer>
    <v-btn v-if="mdAndUp === false" @click="openMenuAdmin = !openMenuAdmin">
      <v-icon icon="mdi-dots-vertical" size="27"></v-icon>
    </v-btn>
  </AdminNavbar>
  <v-navigation-drawer
    elevation="1"
    v-model="openMenuAdmin"
    location="right"
    color="#474747"
  >
    <v-list>
      <v-list-item>
        <AddNewDocumentForm />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <NoDataContent v-if="docList.length < 1" text="No documents uploaded yet" />
  <v-container
    class="d-flex flex-md-row flex-column flex-wrap w-100 align-center"
  >
    <v-container class="d-flex align-center justify-center w-100 flex-wrap">
      <DocumentCard
        class="ma-4"
        showFile
        v-for="document in docList"
        :key="document.id"
        :title="document.attributes.doc_name"
        :docId="document.id"
        fileType="doc"
        :fileUrl="document.attributes.file.data[0].attributes.url"
        @isDeleted="handleDeleteFile"
      />
    </v-container>
  </v-container>
</template>
<script setup lang="ts">
/**
 * Display all the documentation related to a project
 * @displayName Project Documentation
 */
import { useDocumentationStore } from '@/store/documentationStore';
import { onMounted, ref } from 'vue';
import DocumentCard from '@/components/atoms/DocumentCard.vue';
import { useRoute } from 'vue-router';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';
import AddNewDocumentForm from '@/components/documentation/AddNewDocumentForm.vue';
import SnackBar from '@/components/atoms/SnackBar.vue';
import NoDataContent from '../NoDataContent.vue';
import { useDisplay } from 'vuetify';

/** Init Stores */
const docStore = useDocumentationStore();
const route = useRoute();
const { mdAndUp } = useDisplay();
//const displayAdminMenu = ref(false);

/** Binding */
const docList = ref([]),
  openMenuAdmin = ref(false),
  projectId = ref(''),
  openSnackBar = ref(false),
  errorMessage = ref(false),
  message = ref('');

// const URL_BASE = computed(() => {
//   return import.meta.env.VITE_APP_BASE;
// });

onMounted(async () => {
  /**
   * Obtain the complete list of documentation for the current project
   */
  projectId.value = route.params.id;
  await docStore.getProjectDocumentation(projectId.value);
  docList.value = docStore.currentList;
  /**
   * Sort the output list
   */
  docList.value.sort((a, b) => {
    if (a.attributes.doc_name > b.attributes.doc_name) {
      return 1;
    }
    if (a.attributes.doc_name < b.attributes.doc_name) {
      return -1;
    }
    return 0;
  });
});

const handleDeleteFile = (snackbarState: boolean): boolean => {
  message.value = 'File deleted succesfully.';
  return (openSnackBar.value = snackbarState);
};
</script>
