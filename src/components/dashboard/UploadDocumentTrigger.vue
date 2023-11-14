<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
    @closeSnackBar="handleSnackBarState"
  />
  <v-sheet
    v-for="element in parsedData"
    :key="element.id"
    class="d-flex flex-column flex-sm-row flex-wrap justify-space-between"
    min-width="350"
  >
    <div class="pr-1">
      <div class="d-flex align-center mb-3">
        <v-icon
          v-if="element.warning"
          icon="mdi-exclamation-thick"
          color="warning"
        />
        <h3 class="mx-4">{{ element.doc_name }}</h3>
        <p>({{ element.from }})</p>
      </div>
      <div class="ml-10">
        {{ element.date }} -
        <v-chip v-if="element.action === 'created'" color="green">
          {{ element.action }}
        </v-chip>
        <v-chip v-else-if="element.action === 'deleted'" color="red">
          {{ element.action }}
        </v-chip>
        <v-chip v-else-if="element.action === 'modified'" color="blue">
          {{ element.action }}
        </v-chip>
      </div>
    </div>
    <div class="d-flex align-center justify-end">
      <PrimaryButton
        v-if="userRole > 1"
        @click="handleOpenDialog"
        @closeDialog="closeDialog"
        :openDialog="openDialog"
        variant="text"
        confirmationDialog
        textDialog="delete the entry"
        icon="mdi-delete-outline"
        iconColor="error"
        :handleTrueOption="() => handleDelete(element.id)"
      />
    </div>
    <v-divider class="my-4"></v-divider>
  </v-sheet>
  <!--
  <tr v-for="element in parsedData" :key="element.id">
    <td>
      <v-icon
        v-if="element.warning"
        icon="mdi-exclamation-thick"
        color="warning"
      />
    </td>
    <td>
      {{ element.doc_name }}
    </td>
    <td>
      {{ element.from }}
    </td>
    <td>
      <v-chip v-if="element.action === 'created'" color="green">
        {{ element.action }}
      </v-chip>
      <v-chip v-else-if="element.action === 'deleted'" color="red">
        {{ element.action }}
      </v-chip>
      <v-chip v-else-if="element.action === 'modified'" color="blue">
        {{ element.action }}
      </v-chip>
    </td>
    <td>
      {{ element.date }}
    </td>
    <td>
      <PrimaryButton
        v-if="userRole > 1"
        @click="handleOpenDialog"
        @closeDialog="closeDialog"
        :openDialog="openDialog"
        variant="text"
        confirmationDialog
        textDialog="delete the entry"
        icon="mdi-delete-outline"
        iconColor="error"
        :handleTrueOption="() => handleDelete(element.id)"
      />
    </td>
  </tr>
  <tr></tr>
  -->
</template>

<script setup>
import { useLastUpdatesStore } from '@/store/lastUpdates.js';
import { useAuthStore } from '@/store/authStore.js';
import { defineProps, computed, ref } from 'vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import SnackBar from '../atoms/SnackBar.vue';

const openSnackBar = ref(false);
const message = ref('');
const errorMessage = ref(false);
const openDialog = ref(false);

const props = defineProps({
  updatedList: Array,
});

/**
 * Init stores
 */
const lastUpdatesStore = useLastUpdatesStore();
const auth = useAuthStore();

const userRole = auth.role;

const parsedData = computed(() => {
  let dataArray = [];
  props.updatedList.forEach((element) => {
    const obj = {};
    //parse date
    const date = new Date(element.attributes.updatedAt);
    const fullDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} (${date.getHours()}:${date.getMinutes()} h)`;
    obj.id = element.id;
    obj.date = fullDate;
    obj.doc_name = element.attributes.doc_name;
    obj.action = element.attributes.action;
    obj.from = element.attributes.from;
    obj.warning = element.attributes.warning;
    dataArray.push(obj);
  });
  return dataArray;
});

const handleDelete = async (itemId) => {
  await lastUpdatesStore.deleteItem(itemId);
  message.value = 'Element deleted successfully.';
  openSnackBar.value = true;
  setTimeout(() => {
    openSnackBar.value = false;
  }, 3000);
};

const closeDialog = () => {
  openDialog.value = false;
};

const handleOpenDialog = () => {
  openDialog.value = true;
};
</script>
