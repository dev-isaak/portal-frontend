<template>
  <v-layout class="d-flex flex-column w-100">
    <v-app-var>
      <MainNavbar @menuState="handlemenuState" />
      <v-navigation-drawer
        v-model="displayMenu"
        location="left"
        elevation="1"
        temporary
      >
        <MobileMenu />
      </v-navigation-drawer>
    </v-app-var>
    <v-main
      :class="
        role > 1
          ? 'pa-6 h-100 main-admin-container'
          : 'pa-6 h-100 main-container'
      "
      style="min-height: 80vh"
    >
      <slot> </slot>
    </v-main>
    <v-footer class="d-flex justify-space-around py-5" color="#f5f5f5">
      <MainFooter />
    </v-footer>
  </v-layout>
</template>

<script setup>
import MainNavbar from '@/components/navbar/MainNavbar.vue';
import MainFooter from '@/components/MainFooter.vue';
import { ref, onBeforeMount } from 'vue';
import MobileMenu from '@/components/navbar/MobileMenu.vue';
import { useAuthStore } from '@/store/authStore';

const auth = useAuthStore();

onBeforeMount(async () => {
  await auth.getUserRole();
  role.value = auth.role;
});

const displayMenu = ref(false);
const role = ref('');

const handlemenuState = (state) => {
  displayMenu.value = state;
};
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
    margin-top: 3rem;
  }
  .main-admin-container {
    margin-top: 5rem;
  }
}
</style>
