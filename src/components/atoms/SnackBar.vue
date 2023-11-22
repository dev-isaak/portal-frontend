<template>
  <v-snackbar :model-value="openSnackBar" :timeout="timeout" location="top">
    <v-icon
      class="mr-4"
      :icon="error ? 'mdi-close' : 'mdi-check'"
      :color="error ? 'error' : 'success'"
    ></v-icon>
    {{ text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { onUpdated } from 'vue';
const timeout: number = 3000;

defineProps<{
  openSnackBar: boolean;
  text: string;
  error: boolean;
}>();

const emits = defineEmits<{
  (event: 'closeSnackbar'): void;
}>();
// Emit an event to close the snackbar --> @closeSnackbar="openSnackBar = false"
onUpdated(() => {
  setTimeout(() => {
    emits('closeSnackbar');
  }, timeout);
});
</script>
