<template>
  <v-btn
    v-if="render"
    delete
    :elevation="elevation"
    :variant="variant"
    :append-icon="appendIcon"
    @click="openDialog = true"
  >
    <v-icon
      v-if="icon"
      :icon="icon"
      :color="iconColor"
      :size="iconSize"
    ></v-icon>
    {{ text }}
    <!--
			The dialog will be shown only if confirmationDialog or formDialog is true
		-->
    <DialogForm
      v-if="confirmationDialog || formDialog"
      :width="formDialog || mdAndUp === false ? '90%' : '30%'"
      :openDialog="openDialog"
      :handleCreateOption="handleCreateOption"
      :confirmationDialog="confirmationDialog"
      :formDialog="formDialog"
      :textDialog="textDialog"
      :aditionalText="aditionalText"
      :handleTrueOption="handleTrueOption"
      :isLoading="isLoading"
      :actionText="actionText"
      @closeDialog="openDialog = false"
    >
      <!-- @slot used to introduce a form-->
      <slot> </slot>
    </DialogForm>
  </v-btn>
</template>

<script setup lang="ts">
/**
 * The primary button
 * @displayName Primary Button
 */
import { ref } from 'vue';
import DialogForm from '@/components/atoms/DialogForm.vue';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/store/authStore.ts';
import { onBeforeMount } from 'vue';

const openDialog = ref(false);
const auth = useAuthStore();
const render = ref(false);

onBeforeMount(() => {
  const userRole = auth.role;
  // alert(userRole);
  if (props.delete) {
    if (userRole < 1) render.value = false;
  }
});

// const emits = defineEmits(['closeDialog']);

const { mdAndUp } = useDisplay();

// const closeDialog = (e) => {
//   emits('closeDialog', e);
// };

const props = defineProps<{
  delete: boolean;
  /**
   * If true, a confirmation dialog will be shown
   */
  confirmationDialog: boolean;
  /**
   * If true, it will work as a slot and a form must be introduced into it.
   *
   */
  formDialog: boolean;
  /**
   * The button icon
   * @values any icon from material design icons.
   * @example mdi-magnify, mdi-plus
   */
  icon: string;
  /**
   * The append icon on the button
   * @values any icon from material design icons.
   * @example mdi-magnify, mdi-plus
   */
  appendIcon: string;
  /**
   * Define the icon size
   */
  iconSize: number;
  /**
   * The differents styles of the button
   * @values text, flat, elevated, tonal, outlined, plain
   */
  variant: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain';
  /**
   * The icon color
   * @values any
   */
  iconColor: string;
  /**
   * The box shadow
   */
  elevation: number;
  /**
   * The text of the button
   * @values any
   */
  text: string;
  /**
   * The text of the dialog after "Do you really want to..."
   * @values any
   */
  textDialog: string;
  /**
   * Recives an aditional text to show it after the question
   */
  aditionalText: string;
  /**
   * The function carried out to handle the "Sure" option
   * @values any
   */
  handleTrueOption: any;
  /**
   * The function carried out when "Create" button is pressed at formDialog
   */
  handleCreateOption: void;
  /**
   *
   */
  isLoading: boolean;
  /**
   *
   */
  actionText: string;
}>();
</script>
