<template>
  <SnackBar
    :text="message"
    :error="errorMessage"
    :openSnackBar="openSnackBar"
  />
  <v-text-field
    label="Search project"
    append-inner-icon="mdi-magnify"
    v-model="searchPhrase"
    @update:modelValue="handleSearchProject"
  ></v-text-field>
  <v-sheet>
    <v-expansion-panels variant="inset">
      <v-expansion-panel
        v-for="customer in projectsList"
        :key="customer.id"
        :title="customer.attributes.Name.toUpperCase()"
      >
        <v-expansion-panel-text
          v-for="project in customer.attributes.projects.data"
          :key="project.id"
        >
          <v-container
            class="w-100 px-0 d-flex align-center justify-space-between"
          >
            <v-icon
              icon="mdi-circle-medium"
              :color="
                project.attributes.under_construction ? 'error' : 'success'
              "
            ></v-icon>
            <v-sheet class="d-flex justify-start">
              <v-btn
                class="w-100 px-md-10"
                :to="{ name: 'project', params: { id: project.id } }"
              >
                {{ project.attributes.project_name }}
              </v-btn>
            </v-sheet>
            <v-sheet class="d-flex justify-end">
              <PrimaryButton
                @click="handleOpenEditDialog(project.id)"
                @closeDialog="closeDialog(project.id)"
                :openDialog="openEditDialog[project.id]"
                formDialog
                icon="mdi-file-edit-outline"
                variant="text"
              >
                <UpdateProjectForm
                  :projectName="project.attributes.project_name"
                  :coesiaProvider="
                    project.attributes.coesia_provider.data.attributes
                      .provider_name
                  "
                  :machineType="project.attributes.machine_type"
                  :serialNumber="project.attributes.serial_number"
                  :customerName="customer.attributes.Name"
                  :selectedDatePicker="project.attributes.date"
                  :moduleUnwinder="project.attributes"
                  :projectPosted="projectState"
                  :message="message"
                  :projectId="project.id"
                  @selectedName="ReceivedProjectName"
                  @selectedCustomer="customerName"
                  @selectedProvider="providerId"
                  @selectedMachineType="machineType"
                  @selectedSerialNumber="serialNumber"
                  @parsedDate="selectedDatePicker"
                />
              </PrimaryButton>
              <PrimaryButton
                @click="handleDeleteFunction(project.id)"
                @closeDialog="closeDialog(project.id)"
                :openDialog="openDeleteDialog[project.id]"
                confirmationDialog
                textDialog="delete the project"
                variant="text"
                icon="mdi-delete-outline"
                iconColor="error"
                :handleTrueOption="() => handleDelete(project.id, customer.id)"
              />
            </v-sheet>
          </v-container>
          <v-divider class="mt-4"></v-divider>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-sheet>
</template>
<script setup lang="ts">
/**
 * Display and manage all the customers and projects.
 * @displayName Customer and Projects list (Only admin role)
 */
import { useProjectsStore } from '@/store/projectsStore.js';
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import PrimaryButton from '@/components/atoms/PrimaryButton.vue';
import UpdateProjectForm from '@/components/forms/UpdateProjectForm.vue';
import SnackBar from '@/components/atoms/SnackBar.vue';
import type { DialogStateType } from '@/types/global';
import type { CustomerType, Attributes } from '@/types/project';

/** Init Stores */
const projectsStore = useProjectsStore();

/** Binding */
const searchPhrase = ref(''),
  message = ref(''),
  projectsList: Ref<Attributes<CustomerType>[]> = ref([]),
  errorMessage = ref(false),
  openSnackBar = ref(false),
  openEditDialog: Ref<DialogStateType> = ref({}),
  openDeleteDialog: Ref<DialogStateType> = ref({}),
  selectedName = ref(''),
  parsedDate = ref(''),
  selectedMachineType = ref(''),
  selectedSerialNumber = ref(''),
  selectedCustomer = ref(''),
  coesiaProvider = ref(''),
  projectState = ref(false);

defineProps<{
  projectName: string;
}>();

onMounted(async () => {
  await projectsStore.getAllCustomerProjects();
  projectsList.value = projectsStore.projects;
});

const handleOpenEditDialog = (projectId: number): boolean =>
  (openEditDialog.value[projectId] = true);

const handleDeleteFunction = (projectId: number): boolean =>
  (openDeleteDialog.value[projectId] = true);

const closeDialog = (projectId: number): void => {
  openEditDialog.value[projectId] = false;
  openDeleteDialog.value[projectId] = false;
};

/** When delete button is pressed the file is deleted and the dialog closed */
const handleDelete = async (
  projectId: number,
  customerId: number,
): Promise<void> => {
  await projectsStore.deleteSelectedProject(projectId, customerId);
  message.value = 'Item deleted successfully';
  openSnackBar.value = true;
  openDeleteDialog.value[projectId] = false;
};

/** Emits from form */
const ReceivedProjectName = (e: string) => (selectedName.value = e);
const customerName = (e: string) => (selectedCustomer.value = e);
const machineType = (e: string) => (selectedMachineType.value = e);
const serialNumber = (e: string) => (selectedSerialNumber.value = e);
const selectedDatePicker = (e: string) => (parsedDate.value = e);
const providerId = (e: string) => (coesiaProvider.value = e);

const handleSearchProject = (): void => {
  const searchQuery = searchPhrase.value.toUpperCase();

  if (searchQuery === '' || searchQuery.length < 1) {
    projectsList.value = projectsStore.projects;
  } else {
    // Hacemos un map de projects donde devolvemos un array con los projectos filtrados
    const filteredProjects = projectsStore.projects.map(
      (project: Attributes<CustomerType>) => {
        const filteredElements = project.attributes.projects.data.filter(
          (element) => {
            return element.attributes.project_name.includes(searchQuery);
          },
        );

        if (filteredElements.length > 0) {
          // Si se encontraron elementos en este proyecto, se añaden los projectos filtrados dentro del projecto
          return {
            ...project,
            attributes: {
              ...project.attributes,
              projects: { data: filteredElements },
            },
          };
        } else {
          return null; // No se encontraron elementos en este proyecto, exclúyelo
        }
      },
    );

    // Eliminar proyectos nulos
    projectsList.value = filteredProjects.filter((project) => project !== null); // project devuelve boolean
  }
};
</script>
