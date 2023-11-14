<template>
  <AdminNavbar>
    <div v-if="mdAndUp">
      <AddNewCustomerForm /> |
      <AddNewProjectForm />
    </div>
    <v-spacer></v-spacer>
    <v-btn v-if="mdAndUp === false" @click="openMenuAdmin = !openMenuAdmin">
      <v-icon icon="mdi-dots-vertical" size="27"></v-icon>
    </v-btn>
  </AdminNavbar>
  <v-navigation-drawer
    elevation="1"
    v-model="openMenuAdmin"
    location="right"
    color="#474747"
  >
    <v-list>
      <v-list-item>
        <AddNewCustomerForm />
      </v-list-item>
      <v-list-item>
        <AddNewProjectForm />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <h1>VOLPAK</h1>
  <v-divider></v-divider>
  <div class="general-container">
    <div class="w-100">
      <AdminProjectsList />
    </div>
  </div>
</template>

<script setup>
import AdminProjectsList from '@/components/home/AdminProjectsList.vue';
import AddNewProjectForm from '@/components/home/AddNewProjectForm.vue';
import AddNewCustomerForm from '@/components/home/AddNewCustomerForm.vue';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';
import { useDisplay } from 'vuetify';
import { ref } from 'vue';

const openMenuAdmin = ref(false);
const { mdAndUp } = useDisplay();
</script>

<style scoped>
.general-container {
  display: flex;
  gap: 3em;
  margin-top: 2em;
  max-width: 500px;
}
@media (min-width: 768px) {
  .general-container {
    margin-left: 2em;
  }
}
</style>
