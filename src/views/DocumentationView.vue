<template>
  <ProjectLayoutVue>
    <div>
      <h1>Documentation</h1>
      <v-divider></v-divider>
    </div>
    <ProjectDocumentation />
  </ProjectLayoutVue>
</template>

<script setup lang="ts">
import ProjectLayoutVue from '@/layouts/ProjectLayout.vue';
import ProjectDocumentation from '@/components/documentation/ProjectDocumentation.vue';
</script>

<style scoped></style>
