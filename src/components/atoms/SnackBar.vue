<template>
  <v-snackbar :model-value="openSnackBar" :timeout="3000" location="top">
    <v-icon
      class="mr-4"
      :icon="error ? 'mdi-close' : 'mdi-check'"
      :color="error ? 'error' : 'success'"
    ></v-icon>
    {{ text }}
  </v-snackbar>
</template>

<script setup lang="ts">
defineProps<{
  openSnackBar: boolean;
  text: string;
  error: boolean;
}>();
</script>
