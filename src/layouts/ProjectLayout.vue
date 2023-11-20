<template>
  <v-layout class="d-flex flex-column w-100">
    <MainNavbar @menuState="handlemenuState" />
    <v-navigation-drawer
      v-model="displayMenu"
      location="left"
      elevation="1"
      temporary
    >
      <MobileMenu />
    </v-navigation-drawer>
    <ProjectNavbar @trolleyStatus="trolleyOpened = true" />
    <v-main
      :class="
        role > 1
          ? 'pa-6 h-100 main-admin-container'
          : 'pa-6 h-100 main-container'
      "
      style="min-height: 75vh"
    >
      <slot class="mt-10"> </slot>
    </v-main>
    <v-navigation-drawer
      v-if="trolleyOpened"
      location="right"
      :width="400"
      elevation="5"
      class="pa-4"
      transition="slide-x-reverse-transition"
    >
      <h2>Trolley</h2>
      <v-divider></v-divider>
    </v-navigation-drawer>
    <v-footer class="d-flex justify-space-around py-5" color="#f5f5f5">
      <MainFooter />
    </v-footer>
  </v-layout>
</template>

<script setup lang="ts">
import ProjectNavbar from '@/components/navbar/ProjectNavbar.vue';
import MainNavbar from '@/components/navbar/MainNavbar.vue';
import MainFooter from '@/components/MainFooter.vue';
import { ref, onBeforeMount } from 'vue';
import MobileMenu from '@/components/navbar/MobileMenu.vue';
import { useAuthStore } from '@/store/authStore';

const auth = useAuthStore();

const role = ref(0),
  trolleyOpened = ref(false),
  displayMenu = ref(false);

onBeforeMount(async () => {
  await auth.getUserRole();
  role.value = auth.role;
});

const handlemenuState = (state: boolean): boolean =>
  (displayMenu.value = state);
</script>

<style scoped>
.main-container {
  margin-top: 3rem;
}
.main-admin-container {
  margin-top: 5rem;
}
@media (min-width: 768px) {
  .main-container {
    margin-top: 5.5rem;
  }
  .main-admin-container {
    margin-top: 7rem;
  }
}
</style>
