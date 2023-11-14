<template>
  <ProjectLayout>
    <AdminNavbar />
    <h1>
      {{ currentProjectName }} -
      <span class="font-weight-light text-h5">{{
        currentMachineType.toUpperCase()
      }}</span>
    </h1>
    <h4>{{ currentSerialNumber }}</h4>
    <v-divider></v-divider>
    <LastUpdates />
  </ProjectLayout>
</template>

<script setup lang="ts">
import ProjectLayout from '@/layouts/ProjectLayout.vue';
import { useRoute } from 'vue-router';
import { useProjectsStore } from '@/store/projectsStore.ts';
import { onMounted, ref } from 'vue';
import LastUpdates from '@/components/dashboard/LastUpdates.vue';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';

const route = useRoute();
const projectsStore = useProjectsStore();

const projectData = ref([]);
const currentProjectName = ref('');
const currentSerialNumber = ref('');
const currentMachineType = ref('');

onMounted(async () => {
  const projectId = route.params.id;
  projectData.value = await projectsStore.getProject(projectId);
  currentProjectName.value = projectsStore.currentProjectName;
  currentSerialNumber.value = projectsStore.projectSerialNumber;
  currentMachineType.value = projectsStore.projectMachineType;
});
</script>

<style scoped></style>
