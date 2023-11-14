<template>
  <v-pagination
    class="ma-4"
    :length="totalPages"
    :size="32"
    total-visible="3"
  ></v-pagination>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  totalPages: Number,
});
</script>
