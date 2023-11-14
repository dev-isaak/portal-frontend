<template>
  <v-container>
    <v-expansion-panels variant="popout" class="my-4">
      <v-expansion-panel v-for="faq in faqList" :key="faq.id">
        <v-expansion-panel-title class="font-weight-bold">
          {{ faq.attributes.question }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          {{ faq.attributes.answer }}
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup>
import { useFaqStore } from '@/store/faqStore.js';
import { onMounted, ref } from 'vue';
/**
 * Init Stores
 */
const faqStore = useFaqStore();
/**
 * Binding
 */
const faqList = ref('');

onMounted(async () => {
  faqList.value = await faqStore.getFaqs();
});
</script>

<style scoped></style>
