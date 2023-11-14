<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
  />
  <AdminNavbar v-if="userRole > 1">
    <AddNewTrainingForm v-if="mdAndUp" />
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
        <AddNewTrainingForm />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <NoDataContent v-if="trainingList < 1" text="No documents uploaded yet" />
  <v-container
    class="d-flex flex-md-row flex-column flex-wrap w-100 align-center"
  >
    <v-container class="d-flex align-center w-100 flex-wrap">
      <DocumentCard
        class="ma-4"
        v-for="training in trainingList"
        :key="training.id"
        :title="training.attributes.file_name"
        :docId="training.id"
        :fileUrl="
          URL_BASE + training.attributes.training_docs.data[0].attributes.url
        "
        @isDeleted="handleDeleteFile"
      />
    </v-container>
  </v-container>
</template>

<script setup>
/**
 * Display all the training documents related to a project
 * @displayName Project Training
 */
import { useTrainingStore } from '@/store/trainingStore.js';
import { useAuthStore } from '@/store/authStore.js';
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';
import AddNewTrainingForm from '@/components/training/AddNewTrainingForm.vue';
import DocumentCard from '../atoms/DocumentCard.vue';
import NoDataContent from '../NoDataContent.vue';
import SnackBar from '@/components/atoms/SnackBar.vue';
import { useDisplay } from 'vuetify';
/**
 * Init Stores
 */
const trainingStore = useTrainingStore();
const auth = useAuthStore();
const { mdAndUp } = useDisplay();
/**
 * Binding
 */
const trainingList = ref([]);
const userRole = ref('');
const openSnackBar = ref(false);
const errorMessage = ref(false);
const message = ref('');
const openMenuAdmin = ref(false);

const URL_BASE = computed(() => {
  return process.env.VUE_APP_BASE;
});

const handleDeleteFile = (deleted) => {
  message.value = 'File deleted succesfully.';
  openSnackBar.value = deleted;
};

const handleSnackBarState = (close) => {
  openSnackBar.value = close;
};

onMounted(async () => {
  userRole.value = auth.role;
  const route = useRoute();
  await trainingStore.getTrainingList(route.params.id);
  trainingList.value = trainingStore.trainingList;
});
</script>