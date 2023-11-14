<template>
  <ProjectLayout>
    <h1>Catalogues</h1>
    <v-divider></v-divider>
    <CataloguesView />
  </ProjectLayout>
</template>

<script setup>
import ProjectLayout from '@/layouts/ProjectLayout.vue';
import CataloguesView from '@/components/catalogues/CatalogList.vue';
</script>

<style scoped></style>
