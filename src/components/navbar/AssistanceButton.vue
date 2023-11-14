<template>
  <PrimaryButton
    @click="handleOpenDialog"
    @closeDialog="closeDialog"
    :openDialog="openDialog"
    formDialog
    append-icon="mdi-phone"
    text="assistance"
    variant="tonal"
    color="error"
    :handleCreateOption="handleContact"
  >
    <v-card-title>Do you need assistance?</v-card-title>
    <v-card-text>Don't heasitate to contact us</v-card-text>
    <form>
      <v-text-field :placeholder="currentCustomerName" disabled> </v-text-field>
      <v-text-field :placeholder="currentProjectName" disabled> </v-text-field>
      <v-col class="d-flex">
        <v-text-field label="Phone Number" required> </v-text-field>
        <v-text-field
          label="Email"
          placeholder="jhon@company.es"
          class="ml-5"
          required
        >
        </v-text-field>
      </v-col>
      <v-textarea label="Your query"></v-textarea>
    </form>
  </PrimaryButton>
</template>

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomerStore } from '@/store/customerStore.ts';
import { useProjectsStore } from '@/store/projectsStore.ts';

const projectsStore = useProjectsStore();
const route = useRoute();
const projectId = route.params.id;
const customerStore = useCustomerStore();

const currentCustomerName = ref('');
const currentProjectName = ref('');
const openDialog = ref(false);

onMounted(async () => {
  await customerStore.getCurrentCustomer();
  await projectsStore.getProject(projectId);

  currentCustomerName.value = customerStore.currentCustomerName;
  currentProjectName.value = projectsStore.currentProjectName;
});

const handleContact = () => {
  alert('Contact');
};

const handleOpenDialog = () => {
  openDialog.value = true;
};

const closeDialog = () => {
  openDialog.value = false;
};
</script>
