<template>
  <v-btn :delete="handleDelete"> test </v-btn>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  if (props.delete) {
    handleDelete();
  }
});

const handleDelete = () => {
  alert('wer');
};

const props = defineProps<{
  delete?: boolean;
}>();
</script>
