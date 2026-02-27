import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Dashboard.vue'
import LoginView from '../views/login/LoginView.vue'
import CardsView from '../views/cards/CardsView.vue'
import EditCardView from '../views/EditCardView.vue'
import CreateCardView from '../views/CreateCardView.vue'
import CardManagementView from '../views/cards/CardManagementView.vue'
import ReportsView from '../views/reports/ReportsView.vue'
import AdminsView from '../views/admins/AdminsView.vue'
import SettingsView from '../views/settings/SettingsView.vue'
import UsersView from '../views/users/UsersView.vue'
import GuideView from '../views/guide/GuideView.vue'
import SubscriptionsView from '../views/subscriptions/SubscriptionsView.vue'
import DiscountsView from '../views/discounts/DiscountsView.vue'
import TransactionsView from '../views/transactions/TransactionsView.vue'
import PagesView from '../views/pages/PagesView.vue'
import CreatePageView from '../views/pages/CreatePageView.vue'
import FeaturesView from '../views/features/FeaturesView.vue'
import CreateFeatureView from '../views/features/CreateFeatureView.vue'
import TutorialsView from '../views/tutorials/TutorialsView.vue'
import CreateTutorialView from '../views/tutorials/CreateTutorialView.vue'
import CreateSubscriptionView from '../views/subscriptions/CreateSubscriptionView.vue'
import BackupView from '../views/backup/BackupView.vue'
import {useAuthStore} from "@/stores/auth.ts"
import NotificationView from "@/views/notifications/NotificationView.vue";
import SendNotificationView from "@/views/notifications/SendNotificationView.vue";
import FAQView from "@/views/faqs/FAQView.vue";
import RolesView from "@/pages/roles/index.vue";
import SecurityDashboardView from "@/views/SecurityDashboard.vue";
import FooterCustomizationView from "@/views/footer/FooterCustomizationView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'auth' } // فقط برای login
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/notifications/send',
      name: 'send-notification',
      component: SendNotificationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/cards',
      name: 'cards',
      component: CardsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/cards/create',
      name: 'create-card',
      component: CreateCardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/cards/:id/edit',
      name: 'edit-card',
      component: EditCardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/cards/management',
      name: 'card-management',
      component: CardManagementView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admins',
      name: 'admins',
      component: AdminsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/roles',
      name: 'roles',
      component: RolesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/guide',
      name: 'guide',
      component: GuideView,
      meta: { requiresAuth: true }
    },
    {
      path: '/faqs',
      name: 'faqs',
      component: FAQView,
      meta: { requiresAuth: true }
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: SubscriptionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/subscriptions/create',
      name: 'create-subscription',
      component: CreateSubscriptionView,
      meta: { requiresAuth: true }
    },
    {
      path: '/subscriptions/:id/edit',
      name: 'edit-subscription',
      component: CreateSubscriptionView,
      meta: { requiresAuth: true }
    },
    {
      path: '/discounts',
      name: 'discounts',
      component: DiscountsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/pages',
      name: 'pages',
      component: PagesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/pages/create',
      name: 'create-page',
      component: CreatePageView,
      meta: { requiresAuth: true }
    },
    {
      path: '/pages/:id/edit',
      name: 'edit-page',
      component: CreatePageView,
      meta: { requiresAuth: true }
    },
    {
      path: '/pages/new',
      name: 'pages-new',
      component: PagesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/features',
      name: 'features',
      component: FeaturesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/features/create',
      name: 'create-feature',
      component: CreateFeatureView,
      meta: { requiresAuth: true }
    },
    {
      path: '/features/:id/edit',
      name: 'edit-feature',
      component: CreateFeatureView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tutorials',
      name: 'tutorials',
      component: TutorialsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tutorials/create',
      name: 'create-tutorial',
      component: CreateTutorialView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tutorials/:id/edit',
      name: 'edit-tutorial',
      component: CreateTutorialView,
      meta: { requiresAuth: true }
    },
    {
      path: '/backup',
      name: 'backup',
      component: BackupView,
      meta: { requiresAuth: true }
    },
    {
      path: '/security',
      name: 'security',
      component: SecurityDashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/footer-customization',
      name: 'footer-customization',
      component: FooterCustomizationView,
      meta: { requiresAuth: true }
    },
    // 404 - آدرس نامعتبر
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { layout: 'auth' }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Hydrate token once from sessionStorage if not already done
  if (!authStore.isHydrated) {
    authStore.hydrateToken()
  }

  // اگر مسیر نیاز به auth دارد (همه جا به جز login)
  if (to.meta.requiresAuth) {
    // اول چک کنیم توکن وجود داره یا نه
    if (!authStore.token || authStore.token.length === 0) {
      console.warn('🚫 No token - redirecting to login')
      authStore.logout()
      return next({ name: 'login', replace: true })
    }

    // فقط اگه هنوز verify نشده باشه، با سرور چک کن
    if (!authStore.isVerified) {
      try {
        const isValid = await authStore.verifyToken()
        if (!isValid) {
          console.warn('🚫 Invalid token - redirecting to login')
          return next({ name: 'login', replace: true })
        }
      } catch (error) {
        console.error('🚫 Token verification error:', error)
        authStore.logout()
        return next({ name: 'login', replace: true })
      }
    }
  }

  // اگر مسیر login است و کاربر لاگین است، به home هدایت شود
  if (to.name === 'login') {
    if (authStore.token && authStore.isVerified) {
      console.log('✅ Already authenticated - redirecting to home')
      return next({ name: 'home', replace: true })
    }
  }

  next()
})

export default router
