<template>
  <HomeLayout>
    <h1>FAQ</h1>
    <v-divider></v-divider>
    <FaqList />
  </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '@/layouts/HomeLayout.vue';
import FaqList from '@/components/faq/FaqList.vue';
</script>

<style scoped></style>
