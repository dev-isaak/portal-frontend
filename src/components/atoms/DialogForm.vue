<template>
  <v-dialog
    :model-value="openDialog"
    @update:model-value="handleClose"
    width="auto"
  >
    <v-card v-if="confirmationDialog">
      <v-card-text>
        Do you really want to {{ textDialog }}? <br />
        {{ aditionalText }} {{ test }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="handleTrueOption" :loading="isLoading"
          >Sure</v-btn
        >
        <v-btn color="black" @click="handleClose">Close</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="formDialog" class="pa-5">
      <v-card-text>
        <!-- @slot used to introduce a form-->
        <slot> </slot>
      </v-card-text>
      <v-card-action class="d-flex justify-center mt-5">
        <PrimaryButton
          v-if="actionText"
          :text="actionText"
          class="mx-4"
          @click="handleCreateOption"
          :loading="isLoading"
        />
        <PrimaryButton text="Close" class="mx-4" @click="handleClose" />
      </v-card-action>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
/**
 * The dialog that is opened to confirm an action
 * @displayName Confirmation Dialog
 */
import { ref, defineProps, defineEmits } from 'vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import {
  VDialog,
  VCard,
  VCardText,
  VCardActions,
} from 'vuetify/lib/components/index.mjs';

/**
 * Init variables
 */
let dialog = ref(false);
const emits = defineEmits(['closeDialog']);

const handleClose = () => {
  dialog.value = false;
  emits('closeDialog', true);
};

defineProps({
  openDialog: Boolean,
  closeDialog: Boolean,
  /**
   * If true, a confirmation dialog will be shown
   */
  confirmationDialog: Boolean,
  /**
   * If true, a form dialog will be shown
   */
  formDialog: Boolean,
  /**
   * The last part of the confirmation text
   * @values any
   */
  textDialog: String,
  /**
   * Recives an aditional text to show it after the question
   */
  aditionalText: String,
  /**
   * The function carried out to handle the "Sure" option
   * @values any
   */
  handleTrueOption: Function,
  /**
   * The function carried out when "Create" button is pressed at formDialog
   */
  handleCreateOption: Function,
  /**
   * Controls the loading state
   */
  isLoading: Boolean,
  /**
   *
   */
  actionText: String,
});
</script>
