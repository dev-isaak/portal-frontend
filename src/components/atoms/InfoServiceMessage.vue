<template>
  <v-column class="w-100 d-flex justify-center">
    <p :class="[{ textGreen: uploadSuccess, textRed: !uploadSuccess }]">
      {{ message }}
    </p>
  </v-column>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  message: String,
  uploadSuccess: Boolean,
});
</script>

<style>
.textGreen {
  color: green;
}
.textRed {
  color: red;
}
</style>
