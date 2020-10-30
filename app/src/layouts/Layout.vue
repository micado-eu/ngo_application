<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="bg-accent"
    >
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
          v-for="(nav) in navs"
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
      v-if="this.$auth.loggedIn()"
    >
      <q-list dark>
        <q-item-label header>{{ $t('menu.title') }} {{ user.name }} {{ user.lastname }}</q-item-label>
        <q-item
          clickable
          exact
          v-for="(nav) in navs"
          :to="nav.to"
          :key="nav.label"
          active
          v-feature-flipping="nav.feature"
          :data-cy="nav.label.replace('.', '_')"
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
//import AuthMenu from "./auth/AuthMenu";
import storeMappingMixin from '../mixin/storeMappingMixin'

export default {
  name: "Layout",

  components: {

  },
  created () {
    console.log("AUTH IN LAYOUT")
    console.log(this.$auth.loggedIn())
  },
  mixins: [storeMappingMixin({
    getters: {
      user: 'auth/user',
    }
  })],
  data () {
    return {
      leftDrawerOpen: false,
      navs: [
        {
          label: "menu.information_centre",
          icon: "description",
          to: "/information",
          feature: "FEAT_DEFAULT",
          description: "Manage the information"
        },
        {
          label: "menu.events",
          icon: "description",
          to: "/events",
          feature: "FEAT_EVENTS",
          description: "Manage the events"
        },
        {
          label: "menu.process",
          icon: "linear_scale",
          to: "/guided_process_editor",
          feature: "FEAT_PROCESSES",
          description: "Edit guided processes information"
        },
        {
          label: "menu.interventions",
          icon: "linear_scale",
          to: "/interventions",
          feature: "FEAT_DOCUMENTS",
          description: "Check validation requests"
        },
        {
          label: "menu.settings",
          icon: "settings_applications",
          to: "/settings",
          feature: "FEAT_DEFAULT",
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
