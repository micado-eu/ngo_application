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

const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      //       { path: '/documents', component: () => import('pages/Documents.vue') },
      { path: '/premises', component: () => import('pages/Premise.vue') },
      { path: '/interventions', component: () => import('pages/Interventions.vue') },
      // { path: '/courses', component: () => import('pages/Courses.vue') },
      { path: '/information', component: InformationListPage },
      { path: '/information/new', component: InformationNewPage },
      { path: '/information/:id/edit/', component: InformationEditPage },
      { path: '/events', component: EventListPage },
      { path: '/events/new', component: EventNewPage },
      { path: '/events/:id/edit/', component: EventEditPage },
      { path: '/settings', component: Settings },
      { path: '/migrant', component: MigrantManager },
      { path: 'usermgmt', component: UserManagement },
      { path: '/guided_process_editor', component: ProcessList },

      //       { path: '/notifications', component: () => import('components/Notifications.vue') },
      //       { path: '/speech', component: () => import('pages/Speech.vue') },
      //       { path: '/chatbot', component: () => import('pages/Chatbot.vue') },
      //       { path: '/settings', component: () => import('pages/Settings.vue') },
      //       { path: '/map', component: () => import('components/Map.vue') }
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
