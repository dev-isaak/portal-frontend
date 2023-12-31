<template>
  <SnackBar
    :text="lastUpdatesStore.currentMessage"
    :error="isErrorMessage"
    :openSnackBar="openSnackBar"
  />
  <v-sheet
    v-for="listItem in updateItemList"
    :key="listItem.id"
    class="d-flex flex-column flex-sm-row flex-wrap justify-space-between"
    min-width="350"
  >
    <div class="pr-1">
      <div class="d-flex align-center mb-3">
        <v-icon
          v-if="listItem.warning"
          icon="mdi-exclamation-thick"
          color="warning"
        />
        <h3 class="mx-4">{{ listItem.doc_name }}</h3>
        <p>({{ listItem.from }})</p>
      </div>
      <div class="ml-10">
        {{ listItem.date }} -
        <v-chip v-if="listItem.action === 'created'" color="green">
          {{ listItem.action }}
        </v-chip>
        <v-chip v-else-if="listItem.action === 'deleted'" color="red">
          {{ listItem.action }}
        </v-chip>
        <v-chip v-else-if="listItem.action === 'modified'" color="blue">
          {{ listItem.action }}
        </v-chip>
      </div>
    </div>
    <div class="d-flex align-center justify-end">
      <PrimaryButton
        v-if="userRole > 1"
        variant="text"
        confirmationDialog
        textDialog="delete the entry"
        icon="mdi-delete-outline"
        iconColor="error"
        :handleTrueOption="() => handleDelete(listItem.id)"
      />
    </div>
    <v-divider class="my-4"></v-divider>
  </v-sheet>
</template>

<script setup lang="ts">
import { useLastUpdatesStore } from '@/store/lastUpdates.ts';
import { useAuthStore } from '@/store/authStore.ts';
import { computed, ref } from 'vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import SnackBar from '../atoms/SnackBar.vue';
import { Attributes } from '@/types/project';
import type { UpdateItemType } from './types/dashboardTypes.ts';

const openSnackBar = ref(false);
const isErrorMessage = ref(false);

const props = defineProps<{
  updatedList: UpdateItemType[];
}>();

/** Init stores */
const lastUpdatesStore = useLastUpdatesStore();
const auth = useAuthStore();

const userRole = auth.role;

const updateItemList = computed<UpdateItemType[]>(() => {
  const dataArray: UpdateItemType[] = [];
  // Receives an array of updates
  props.updatedList.forEach((element: Attributes<UpdateItemType>) => {
    // Create updateItem element
    const updateItem: UpdateItemType = {
      id: 0,
      date: '',
      doc_name: '',
      action: '',
      from: '',
      warning: false,
      updatedAt: '',
    };
    //parse date to show it in a friendly format
    const date = new Date(element.attributes.updatedAt);
    const fullDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} (${date.getHours()}:${date.getMinutes()} h)`;
    updateItem.id = element.id;
    updateItem.date = fullDate;
    updateItem.doc_name = element.attributes.doc_name;
    updateItem.action = element.attributes.action;
    updateItem.from = element.attributes.from;
    updateItem.warning = element.attributes.warning;
    dataArray.push(updateItem);
  });
  return dataArray;
});

const handleDelete = async (itemId: number) => {
  await lastUpdatesStore.deleteItem(itemId);
  openSnackBar.value = true;
};
</script>
