<template>
  <v-app-bar v-if="mdAndUp" elevation="0" color="#f5f5f5" class="pl-5" absolute>
    <router-link to="/">
      <v-img
        v-if="volpakLogo"
        src="@/assets/volpak.red.coesia.png"
        width="120"
        alt="Volpak logo"
      ></v-img>
      <v-img
        v-else
        src="@/assets/logo_enflex.png"
        width="120"
        alt="Volpak logo"
      ></v-img>
    </router-link>
    <v-tabs class="w-100 ml-5" color="error">
      <v-tab to="/" class="nav-link">Home</v-tab>
      <v-tab :to="{ name: 'faqs' }" class="nav-link">FAQ</v-tab>
    </v-tabs>
    <AssistanceButton />
    <!-- <PrimaryButton icon="mdi-magnify" variant="text" /> -->
    <PrimaryButton
      icon="mdi-logout"
      confirmationDialog
      :handleTrueOption="handleLogout"
      variant="text"
      textDialog="logout"
    />
  </v-app-bar>
  <v-app-bar v-else elevation="0" color="#f5f5f5" class="pl-5" absolute>
    <router-link to="/">
      <v-img
        v-if="volpakLogo"
        src="@/assets/volpak.red.coesia.png"
        width="120"
        alt="Volpak logo"
      ></v-img>
      <v-img
        v-else
        src="@/assets/logo_enflex.png"
        width="120"
        alt="Volpak logo"
      ></v-img>
    </router-link>
    <v-spacer></v-spacer>
    <v-btn icon="mdi-menu" @click="handleOpenMenu"></v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
/**
 * The navbar displayed when the user is loged in
 * @displayName Home navigation bar
 */
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore.ts';
import { useProjectsStore } from '@/store/projectsStore.ts';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import AssistanceButton from '@/components/navbar/AssistanceButton.vue';
import { onMounted, ref, defineEmits } from 'vue';
import { useDisplay } from 'vuetify';

const { mdAndUp } = useDisplay();

const projectsList = ref([]);
const volpakLogo = ref(true);
const enflexLogo = ref(false);
const menuOpened = ref(false);

const emits = defineEmits('menuState');

/**
 * Init stores
 */
const store = useAuthStore();
const router = useRouter();
const route = useRoute();
const projectsStore = useProjectsStore();

onMounted(async () => {
  await projectsStore.getProject(route.params.id);
  projectsList.value = projectsStore.currentProject;

  if (projectsStore.currentCoesiaProvider != null) {
    if (
      projectsStore.currentCoesiaProvider.data.attributes.provider_name ===
      'Volpak'
    ) {
      volpakLogo.value = true;
    } else if (
      projectsStore.currentCoesiaProvider.data.attributes.provider_name ===
      'Enflex'
    ) {
      volpakLogo.value = false;
      enflexLogo.value = true;
    }
  } else {
    volpakLogo.value = true;
  }
});

/**
 * On click at the "Sure" option on the dialog, the user will be logged out
 */
const handleLogout = async () => {
  const isLogedOut = await store.logout();
  if (isLogedOut) {
    await router.push({ name: 'login' });
  }
};

const handleOpenMenu = () => {
  emits('menuState', (menuOpened.value = !menuOpened.value));
};
</script>

<style scoped></style>
