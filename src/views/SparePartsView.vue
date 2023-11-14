<template>
  <ProjectLayout>
    <h1>Spare Parts</h1>
    <v-divider></v-divider>
    <v-container class="d-flex justify-center mt-10">
      <ModuleList />
    </v-container>
  </ProjectLayout>
</template>

<script setup lang="ts">
import ProjectLayout from '@/layouts/ProjectLayout.vue';
import ModuleList from '@/components/spare_parts/ModuleList.vue';
</script>

<style scoped></style>
