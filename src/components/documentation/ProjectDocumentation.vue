<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
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

  <NoDataContent v-if="docList < 1" text="No documents uploaded yet" />
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
        :fileUrl="URL_BASE + document.attributes.file.data[0].attributes.url"
        @isDeleted="handleDeleteFile"
      />
    </v-container>
  </v-container>
</template>
<script setup>
/**
 * Display all the documentation related to a project
 * @displayName Project Documentation
 */
import { useDocumentationStore } from '@/store/documentationStore';
import { onMounted, ref, computed } from 'vue';
import DocumentCard from '@/components/atoms/DocumentCard.vue';
import { useRoute } from 'vue-router';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';
import AddNewDocumentForm from '@/components/documentation/AddNewDocumentForm.vue';
import SnackBar from '@/components/atoms/SnackBar.vue';
import NoDataContent from '../NoDataContent.vue';
import { useDisplay } from 'vuetify';
/**
 * Init Stores
 */
const docStore = useDocumentationStore();
const route = useRoute();
const openMenuAdmin = ref(false);

//const displayAdminMenu = ref(false);
const { mdAndUp } = useDisplay();
/**
 * Binding
 */
let docList = ref([]);
const projectId = ref('');
const URL_BASE = computed(() => {
  return process.env.VUE_APP_BASE;
});
const openSnackBar = ref(false);
const errorMessage = ref(false);
const message = ref('');

onMounted(async () => {
  /**
   * Obtain the complete list of documentation for the current project
   */
  projectId.value = route.params.id;
  await docStore.getProjectDocumentation(projectId.value);
  docList.value = docStore.docuList;
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

const handleDeleteFile = (deleted) => {
  message.value = 'File deleted succesfully.';
  openSnackBar.value = deleted;
};

const handleSnackBarState = (close) => {
  openSnackBar.value = close;
};
</script>
