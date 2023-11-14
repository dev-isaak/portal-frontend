<template>
  <v-app-bar
    v-if="mdAndUp"
    elevation="0"
    color="#D70A32"
    class="pl-5"
    height="40"
    absolute
  >
    <v-btn :to="{ name: 'project', params: { id: projectId } }"
      >Dashboard</v-btn
    >
    |
    <v-btn :to="{ name: 'spareParts', params: { id: projectId } }"
      >Spare Parts</v-btn
    >
    |
    <v-btn :to="{ name: 'projectDocumentation', params: { id: projectId } }"
      >Documentation</v-btn
    >
    |
    <v-btn :to="{ name: 'projectCatalogues', params: { id: projectId } }"
      >Catalogues</v-btn
    >
    |
    <v-btn :to="{ name: 'training', params: { id: projectId } }"
      >Training</v-btn
    >
    <v-spacer></v-spacer>
    <PrimaryButton icon="mdi-cart-outline" variant="text" @click="sendStatus" />
  </v-app-bar>
</template>

<script setup lang="ts">
/**
 * The navbar displayed on each project
 * @displayName Project navigation bar
 */
import { useRoute } from 'vue-router';
import { defineEmits, ref } from 'vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { useDisplay } from 'vuetify';

const { mdAndUp } = useDisplay();

/**
 * Init Stores
 */
const route = useRoute();

const projectId = route.params.id;
const emits = defineEmits(['trolleyStatus']);
let trolleyStatus = ref(false);

const sendStatus = () => {
  emits('trolleyStatus', (trolleyStatus.value = !trolleyStatus.value));
};
</script>

<style scoped></style>
