import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import ProjectView from '../views/ProjectView.vue';
import { useAuthStore } from '@/store/authStore';
import AccessForbidden from '@/views/AccessForbidden.vue';
import DocumentationView from '@/views/DocumentationView.vue';
import FaqView from '@/views/FaqView.vue';
import CataloguesView from '@/views/CataloguesView.vue';
import SparePartsView from '@/views/SparePartsView.vue';
import TrainingView from '@/views/TrainingView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/faqs',
    name: 'faqs',
    component: FaqView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/projects/:id',
    name: 'project',
    component: ProjectView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/projects/:id/documentation',
    name: 'projectDocumentation',
    component: DocumentationView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/projects/:id/catalogues',
    name: 'projectCatalogues',
    component: CataloguesView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/projects/:id/spare-parts',
    name: 'spareParts',
    component: SparePartsView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/projects/:id/training',
    name: 'training',
    component: TrainingView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/access-forbidden',
    name: 'accessForbidden',
    component: AccessForbidden,
    meta: {
      requireAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useAuthStore();

  const isAuthenticated = store.jwt;
  const needAuth = to.meta.requireAuth;

  if (!isAuthenticated && to.name !== 'login' && needAuth == true) {
    return next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
