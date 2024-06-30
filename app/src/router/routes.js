import InformationListPage from '../pages/information_centre/InformationListPage.vue'
import InformationNewPage from '../pages/information_centre/InformationNewPage.vue'
import InformationEditPage from '../pages/information_centre/InformationEditPage.vue'
import EventListPage from '../pages/events/EventListPage.vue'
import EventNewPage from '../pages/events/EventNewPage.vue'
import EventEditPage from '../pages/events/EventEditPage.vue'
import Settings from '../components/Settings.vue'
import MigrantManager from '../components/MigrantManager'
import ProcessList from '../pages/ProcessList.vue'
import UserManagement from '../pages/UserManagement'
import Privacy from '../pages/Privacy'


const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', name:"home", component: () => import('pages/Index.vue') },
      //       { path: '/documents', component: () => import('pages/Documents.vue') },
      { path: '/premises', meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] }, component: () => import('pages/Premise.vue') },
      { path: '/interventions',  meta: { auth: ["Application/micado_ngo_migrant_manager"] } ,component: () => import('pages/Interventions.vue') },
      // { path: '/courses', component: () => import('pages/Courses.vue') },
      { path: '/information', meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] }, component: InformationListPage },
      { path: '/information/new', meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] }, component: InformationNewPage },
      { path: '/information/:id/edit/', meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] }, component: InformationEditPage },
      { path: '/events', meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] },component: EventListPage },
      { path: '/events/new',meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] }, component: EventNewPage },
      { path: '/events/:id/edit/', meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] },component: EventEditPage },
      { path: '/settings',meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] }, component: Settings },
      { path: '/privacy',meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] }, component: Privacy },
      { path: '/migrant',   meta: { auth: ["Application/micado_ngo_migrant_manager"] }, component: MigrantManager },
      { path: 'usermgmt',  meta: { auth: ["Application/micado_ngo_admin"] }, component: UserManagement },
      { path: '/guided_process_editor',meta: { auth: ["Application/micado_ngo_migrant_manager", "Application/micado_ngo_admin", "Application/micado_ngo_superadmin" ] }, component: ProcessList },

    ]
  }/*,
  {
    path: '/documents',
//    meta: { auth: true },
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Documents.vue') }
    ]
  },
  {
    path: '/services',
//    meta: { auth: true },
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Services.vue') }
    ]
  },
  {
    path: '/flows',
//    meta: { auth: true },
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Flows.vue') }
    ]
  },
  {
    path: '/notifications',
//    meta: { auth: true },
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('components/Notifications.vue') }
    ]
  },
  {
    path: '/map',
//    meta: { auth: true },
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('components/Map.vue') }
    ]
  },
  {
    path: '/chatbot',
//    meta: { auth: true },
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('components/Chatbot.vue') }
    ]
  }*/
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
