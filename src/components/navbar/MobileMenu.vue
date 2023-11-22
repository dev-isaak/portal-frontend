<template>
  <v-list
    color="#d70a32"
    class="h-100 d-flex flex-column justify-space-between"
  >
    <v-column>
      <v-list-item to="/"> Home </v-list-item>
      <div v-if="router.currentRoute.value.params.id != undefined">
        <v-list-item :to="{ name: 'project', params: { id: projectId } }">
          Dashboard
        </v-list-item>
        <v-list-item :to="{ name: 'spareParts', params: { id: projectId } }">
          Spare Parts
        </v-list-item>
        <v-list-item
          :to="{ name: 'projectDocumentation', params: { id: projectId } }"
        >
          Documentation
        </v-list-item>
        <v-list-item
          :to="{ name: 'projectCatalogues', params: { id: projectId } }"
        >
          Cataloges
        </v-list-item>
        <v-list-item :to="{ name: 'training', params: { id: projectId } }">
          Training
        </v-list-item>
      </div>
      <v-list-item> FAQ </v-list-item>
    </v-column>
    <v-column class="d-flex flex-column align-center justify-end">
      <AssistanceButton />
      <PrimaryButton
        prepend-icon="mdi-logout"
        text="Logout"
        confirmationDialog
        :handleTrueOption="handleLogout"
        variant="text"
        textDialog="logout"
      />
    </v-column>
  </v-list>
</template>

<script setup lang="ts">
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import AssistanceButton from '@/components/navbar/AssistanceButton.vue';

const store = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  const isLogedOut = await store.logout();
  if (isLogedOut) await router.push({ name: 'login' });
};
</script>
