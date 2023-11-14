<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
  />
  <v-container class="d-flex justify-end">
    <PrimaryButton
      v-if="userRole == 1"
      class="mt-5"
      text="Accept updates"
      @click="handleAcceptUpdates"
    />
  </v-container>
  <v-container class="ma-0 pa-0 d-flex flex-column">
    <UploadDocumentTrigger :updatedList="updateList" />
    <PaginationSelector :totalPages="totalPages" v-model="page" />
  </v-container>
</template>

<script setup lang="ts">
import PaginationSelector from '@/components/atoms/PaginationSelector.vue';
import UploadDocumentTrigger from '@/components/dashboard/UploadDocumentTrigger.vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { useAuthStore } from '@/store/authStore.ts';
import { useProjectsStore } from '@/store/projectsStore.ts';
import { useLastUpdatesStore } from '@/store/lastUpdates.ts';
import { onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import SnackBar from '../atoms/SnackBar.vue';
/**
 * Init stores
 */
const auth = useAuthStore();
const projectsStore = useProjectsStore();
const lastUpdatesStore = useLastUpdatesStore();
const route = useRoute();

const page = ref(1);
const meta = ref([]);
const totalPages = ref();
const updateList = ref([]);
const openSnackBar = ref(false);
const errorMessage = ref(false);
const message = ref('');

const userRole = auth.role;

onMounted(async () => {
  meta.value = await lastUpdatesStore.getUpdateList(
    route.params.id,
    page.value,
  );
  updateList.value = lastUpdatesStore.lastUpdatesList;
  totalPages.value = meta.value.pagination.pageCount;
});

const handleAcceptUpdates = async () => {
  //Buscar ID del new update dentro de projects
  const updateItemId = projectsStore.projectUpdateItemId;
  //actualizar el dato en new-updates
  await projectsStore.restoreUpdatePopup(updateItemId);
  //por cada id que encuentre, poner su valor warnig a false para que no muestre el icono
  projectsStore.warningItems.data.forEach((e) => {
    lastUpdatesStore.changeWarningValue(e.id);
  });
  message.value = 'Update list reseted';
  openSnackBar.value = true;
  setTimeout(() => {
    openSnackBar.value = false;
  }, 3000);
};

watch(page, async (newPage) => {
  meta.value = await lastUpdatesStore.getUpdateList(route.params.id, newPage);
  updateList.value = lastUpdatesStore.lastUpdatesList;
  console.log(updateList.value);
});
</script>

<style scoped></style>
