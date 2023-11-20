<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <AdminNavbar v-if="userRole > 1">
    <AddNewCatalogForm v-if="mdAndUp" />
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
        <AddNewCatalogForm />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <NoDataContent text="No catalogs uploaded yet" v-if="catalogList < 1" />
  <v-container class="d-flex w-100 justify-center flex-wrap">
    <v-sheet
      v-for="catalog in catalogList"
      :key="catalog.id"
      class="d-flex align-center justify-center flex-wrap"
    >
      <v-btn
        v-for="url_file in catalog.attributes.files"
        :key="url_file.id"
        class="ma-5 h-auto"
        :width="200"
        variant="plain"
        :href="URL_BASE + url_file[0].attributes.url"
        download
      >
        <v-img
          v-for="url_icon in catalog.attributes.icon"
          :key="url_icon.id"
          :src="URL_BASE + url_icon.attributes.url"
          :width="200"
        >
        </v-img>
      </v-btn>
      <PrimaryButton
        v-if="userRole > 1"
        @click="handleOpenDialog"
        @closeDialog="closeDialog"
        :openDialog="openDialog"
        confirmationDialog
        variant="text"
        textDialog="delete the catalog"
        icon="mdi-delete-outline"
        iconColor="error"
        :handleTrueOption="() => handleDelete(catalog.id)"
      />
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
/**
 * Display all the catalogs related to a project
 * @displayName Project Catalogs
 */
import { useCatalogStore } from '@/store/catalogStore.ts';
import { useAuthStore } from '@/store/authStore.ts';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';
import AddNewCatalogForm from '@/components/catalogues/AddNewCatalogForm.vue';
import SnackBar from '../atoms/SnackBar.vue';
import NoDataContent from '@/components/NoDataContent.vue';
import { useDisplay } from 'vuetify';
/**
 * Init Stores
 */
const catalogStore = useCatalogStore();
const auth = useAuthStore();
const route = useRoute();
const { mdAndUp } = useDisplay();

const openMenuAdmin = ref(false);
/**
 * Init variables
 */
const userRole = auth.role;
/**
 * Binding
 */
const catalogList = ref([]);
const openSnackBar = ref(false);
const errorMessage = ref(false);
const message = ref('');
const openDialog = ref(false);
const URL_BASE = computed(() => {
  return import.meta.env.VITE_APP_BASE;
});

onMounted(async () => {
  await catalogStore.getCatalogList(route.params.id);
  catalogList.value = catalogStore.catalogList;
});

const closeDialog = () => (openDialog.value = false);

const handleOpenDialog = () => (openDialog.value = true);

/**
 * When delete button is pressed the file is deleted and the dialog closed
 */
const handleDelete = async (catalogId) => {
  await catalogStore.deleteCatalog(catalogId);
  message.value = 'File deleted successfully';
  openSnackBar.value = true;
  openDialog.value = false;
};
</script>
