<template>
  <v-snackbar
    :model-value="openSnackBar"
    @update:modelValue="handleSnackBarState"
    location="top"
  >
    <v-icon
      class="mr-4"
      :icon="error ? 'mdi-close' : 'mdi-check'"
      :color="error ? 'error' : 'success'"
    ></v-icon>
    {{ text }}
  </v-snackbar>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['closeSnackBar']);
defineProps({
  openSnackBar: Boolean,
  text: String,
  error: Boolean,
});

const handleSnackBarState = () => {
  emit('closeSnackBar', false);
};
</script>
