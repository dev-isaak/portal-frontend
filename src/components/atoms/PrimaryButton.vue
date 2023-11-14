<template>
  <v-btn :elevation="elevation" :variant="variant" :append-icon="appendIcon">
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
      @closeDialog="closeDialog"
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
import { defineProps, defineEmits } from 'vue';
import DialogForm from '@/components/atoms/DialogForm.vue';
import { useDisplay } from 'vuetify';

const emits = defineEmits(['closeDialog']);

const { mdAndUp } = useDisplay();

const closeDialog = (e) => {
  emits('closeDialog', e);
};

defineProps({
  openDialog: Boolean,
  /**
   * If true, a confirmation dialog will be shown
   */
  confirmationDialog: Boolean,
  /**
   * If true, it will work as a slot and a form must be introduced into it.
   *
   */
  formDialog: Boolean,
  /**
   * The button icon
   * @values any icon from material design icons.
   * @example mdi-magnify, mdi-plus
   */
  icon: String,
  /**
   * The append icon on the button
   * @values any icon from material design icons.
   * @example mdi-magnify, mdi-plus
   */
  appendIcon: String,
  /**
   * Define the icon size
   */
  iconSize: Number,
  /**
   * The differents styles of the button
   * @values text, flat, elevated, tonal, outlined, plain
   */
  variant: String,
  /**
   * The icon color
   * @values any
   */
  iconColor: String,
  /**
   * The box shadow
   */
  elevation: Number,
  /**
   * The text of the button
   * @values any
   */
  text: String,
  /**
   * The text of the dialog after "Do you really want to..."
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
   *
   */
  isLoading: Boolean,
  /**
   *
   */
  actionText: String,
});
</script>

<style scoped></style>
