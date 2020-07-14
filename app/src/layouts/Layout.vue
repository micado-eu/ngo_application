<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-accent">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>Micado App</q-toolbar-title>

        <div>Micado v0.1</div>
      </q-toolbar>
    </q-header>

    <q-footer>
      <q-tabs>
        <q-route-tab
          v-for="(nav, index) in navs"
          :to="nav.to"
          :key="nav.label"
          :label="nav.label"
          :icon="nav.icon"
        />
      </q-tabs>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="767"
      bordered
      content-class="bg-accent text-white"
    >
      <auth-menu />
      <q-list dark>
        <q-item-label header>{{ $t('menu.title') }}</q-item-label>
        <q-item
          clickable
          exact
          v-for="(nav, index) in navs"
          :to="nav.to"
          :key="nav.label"
          active
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t( nav.label) }}</q-item-label>
            <q-item-label caption>{{ nav.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import AuthMenu from "./auth/AuthMenu";

export default {
  name: "Layout",

  components: {
    AuthMenu
  },

  data() {
    return {
      leftDrawerOpen: false,
      navs: [
        // {
        //   label: "menu.courses",
        //   icon: "school",
        //   to: "/courses",
        //   description: "Our course offerng"
        // },
        //        {label:'menu.documents', icon: 'description', to: '/documents', description: 'documents saved in my wallet'},
        //        {label:'menu.assistant', icon: 'question_answer', to: '/chatbot', description: 'Micado Assistant'},
        //        {label:'menu.processes', icon: 'timeline', to: '/flows', description: 'flow description of processes'},
        //        {label:'menu.notifications', icon: 'mail_outline', to: '/notifications', description: 'messages from PA'},
        //        {label:'menu.search', icon: 'search', to: '/map', description: "PA's services around you"},
        //        {label:'menu.speech', icon: 'record_voice_over', to: '/speech', description: "I'll listen to you"},
       /* {
          label: "menu.migrant",
          icon: "face",
          to: "/migrant",
          description: "view migrant user information"
        },*/
        {
          label: "menu.information_centre",
          icon: "description",
          to: "/information",
          description: "Manage the information"
        },
        {
          label: "menu.process",
          icon: "linear_scale",
          to: "/guided_process_editor",
          description: "Edit guided processes information"
        },
        {
          label: "menu.settings",
          icon: "settings_applications",
          to: "/settings",
          description: "configure the application"
        }
      ]
    };
  }
};
</script>

<style>
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
  body {
    font-family: "Nunito", sans-serif;
  }
  .my-menu-link {
    color: white;
    background: #0b91ce;
  }
}
</style>
