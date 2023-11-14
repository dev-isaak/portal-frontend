<template>
  <v-container class="d-flex flex-wrap">
    <div
      v-for="project in projectsList"
      :key="project.id"
      class="container-card"
    >
      <div v-if="project.under_construction" class="info-strip">
        Under Construction
      </div>
      <v-card
        :disabled="project.under_construction ? true : false"
        :to="{ name: 'project', params: { id: project.id } }"
        :width="300"
        min-height="200"
        rounded="lg"
        class="pa-2 ma-4"
      >
        <v-img
          v-if="project.machine_sinoptic != null"
          height="100"
          :src="BASE_URL + project.machine_sinoptic.url"
        >
        </v-img>
        <v-sheet height="20" class="d-flex justify-center mt-5 mb-8" v-else>
          no image uploaded yet
        </v-sheet>
        <v-text>
          {{ project.machine_type != '' ? project.machine_type : '????' }} -
          {{ project.serial_number != '' ? project.serial_number : '????' }}
        </v-text>
        <v-card-title>
          {{ project.project_name }}
        </v-card-title>
        <div v-if="project.new_update != null">
          <v-chip v-if="project.new_update.value" color="blue">
            New Update
          </v-chip>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { useProjectsStore } from '@/store/projectsStore';
import { onMounted, ref, computed } from 'vue';

/**
 * Init Stores
 */
const projectsStore = useProjectsStore();

/**
 * Binding
 */
const projectsList = ref([]);

onMounted(async () => {
  const projects = await projectsStore.getCustomerProjects();
  if (projects) {
    projectsList.value = projects;
  } else {
    console.log('Failed to fetch projects');
  }
});

const BASE_URL = computed(() => {
  return process.env.VUE_APP_BASE;
});
</script>

<style scoped>
.container-card {
  position: relative;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.info-strip {
  position: absolute;
  bottom: 1.5em;
  border-radius: 0 0 5px 5px;
  padding: 0.5em 3em;
  font-size: 1.2em;
  background-color: #496d91;
  color: white;
  z-index: 10;
  font-weight: 900;
}
</style>
