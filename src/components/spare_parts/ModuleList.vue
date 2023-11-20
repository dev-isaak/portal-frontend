<template>
  <AdminNavbar>
    <div v-if="mdAndUp">
      <AddNewImageForm /> | <AddNewMaintenancePlanForm /> |
      <UpdateModulesForm />
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
        <AddNewImageForm />
      </v-list-item>
      <v-list-item>
        <AddNewMaintenancePlanForm />
      </v-list-item>
      <v-list-item>
        <UpdateModulesForm />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-container>
    <v-col align="center">
      <v-img
        v-if="sinopticURL !== ''"
        :src="BASE_URL + sinopticURL"
        :max-width="900"
      ></v-img>
      <NoDataContent v-else text="No image uploaded yet" />
    </v-col>

    <v-col v-for="component in modules" :key="component.id">
      <v-row class="d-flex justify-center flex-wrap mt-5">
        <div v-if="component.module_unwinder" class="mx-4">
          <v-card
            width="150"
            to="#"
            class="d-flex flex-column align-center ma-4"
          >
            <v-img
              src="@/assets/em_unwinder.png"
              width="70"
              height="70"
              alt="Unwinder Icon"
            >
            </v-img>
            <v-card-title> Unwinder </v-card-title>
          </v-card>
        </div>
        <div v-if="component.module_forming" class="mx-4">
          <v-card
            width="150"
            to="#"
            class="d-flex flex-column align-center ma-4"
          >
            <v-img
              src="@/assets/em_forming.png"
              width="70"
              height="70"
              alt="Forming Icon"
            >
            </v-img>
            <v-card-title> Forming </v-card-title>
          </v-card>
        </div>
        <div v-if="component.module_dosing" class="mx-4">
          <v-card
            width="150"
            to="#"
            class="d-flex flex-column align-center ma-4"
          >
            <v-img
              src="@/assets/em_filling.png"
              width="70"
              height="70"
              alt="Filling Icon"
            >
            </v-img>
            <v-card-title> Filling </v-card-title>
          </v-card>
        </div>
        <div v-if="component.module_output" class="mx-4">
          <v-card
            width="150"
            to="#"
            class="d-flex flex-column align-center ma-4"
          >
            <v-img
              src="@/assets/em_outfeed.png"
              width="70"
              height="70"
              alt="Output Icon"
            >
            </v-img>
            <v-card-title> Output </v-card-title>
          </v-card>
        </div>
      </v-row>
    </v-col>
    <v-col align="center" class="my-10">
      <v-btn
        v-if="maintenanceFileURL !== ''"
        append-icon="mdi-microsoft-excel"
        :href="uri + maintenanceFileURL"
        download
      >
        Download Maintenance Plan
        <template v-slot:append>
          <v-icon color="success" size="30"></v-icon>
        </template>
      </v-btn>
      <NoDataContent v-else text="No maintenance plan uploaded yet" />
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
import { useProjectsStore } from '@/store/projectsStore';
import { useRoute } from 'vue-router';
import { onMounted, computed, ref } from 'vue';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';
import AddNewImageForm from '@/components/spare_parts/AddNewImageForm.vue';
import AddNewMaintenancePlanForm from '@/components/spare_parts/AddNewMaintenancePlanForm.vue';
import UpdateModulesForm from '@/components/spare_parts/UpdateModulesForm.vue';
import NoDataContent from '@/components/NoDataContent.vue';
import { useDisplay } from 'vuetify';

/** Init Stores */
const projectsStore = useProjectsStore();
const route = useRoute();
const { mdAndUp } = useDisplay();

const openMenuAdmin = ref(false);

onMounted(async () => {
  await projectsStore.getProject(route.params.id);
});

const BASE_URL = computed(() => import.meta.env.VITE_APP_BASE);
const sinopticURL = computed(() => projectsStore.projectSinoptic);
const modules = computed(() => projectsStore.projectModules);
const maintenanceFileURL = computed(
  () => projectsStore.projectMaintenancePlanFile,
);
</script>
