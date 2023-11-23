export interface Data<T> {
  data: Attributes<T>[];
}

export interface Attributes<T> {
  id: number;
  attributes: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  blocked: boolean;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerType = {
  Address: string;
  Email: string;
  Name: string;
  projects: Data<Project>;
};

export interface Project {
  project_name: string;
  serial_number?: string;
  machine_type?: string;
  training_state: 'Under Construction' | 'Not Buyed' | 'Finished';
  catalogs?: Catalog[];
  coesia_provider: Data<Provider>;
  customer: CustomerType[];
  date?: Date;
  documents?: Document[];
  machine_sinoptic?: Sinoptic[];
  maintenance_plan_file: MaintenanceFile[];
  modules: Module[];
  new_update?: Update[];
  trainings?: TrainingType[];
  under_construction: boolean;
  update_lists?: UpdateList[];
}

export interface Provider {
  provider_name: 'Volpak' | 'Enflex';
}

export interface Catalog {}

export interface Document {}

export interface Sinoptic {}

export interface MaintenanceFile {}

export interface Module {}

export interface Update {}

export type TrainingType = {
  attributes?: {
    file_name: string;
    training_docs: Data<any>;
  };
  id: number;
};

export interface UpdateList {}
