<template>
  <v-container align="center">
    <v-card color="#474747" class="pa-4">{{ text }}</v-card>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  text: String,
});
</script>
