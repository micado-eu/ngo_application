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

        <q-toolbar-title>{{$t('application_title')}}</q-toolbar-title>
        <q-btn
          v-if="this.$auth.loggedIn() && this.surveyJSON != null"
          no-caps
          style="background-color:white; color:#0B91CE"
          :label="$t('button.survey')"
          @click="generateSurvey"
        />
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
    >
      <div class="column flex-center q-gutter-y-md">
        <q-btn
          round
          class="q-gutter-y-md"
          v-if="isLoggedIn"
        >
          <q-avatar size="42px">
            <img src="https://cdn.quasar.dev/img/avatar2.jpg">
          </q-avatar>
        </q-btn>
      </div>

      <q-item
        clickable
        @click="toLogin()"
        v-if="!isLoggedIn"
        style="padding-top:30px"
      >
        <q-item-section avatar>
          <q-icon name="exit_to_app" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('menu.login') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        @click="toLogout()"
        v-if="isLoggedIn"
      >
        <q-item-section avatar>
          <q-icon name="power_settings_new" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('menu.logout') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-list
        dark
        v-if="isLoggedIn"
      >
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
            <q-item-label caption>{{ $t(nav.description) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>


    <q-dialog v-model="alert" full-width>
       <q-layout
        view="Lhh lpR fff"
        container
        class="bg-white"
      >
      <q-header
          
          class="bg-accent"
        >
          <q-toolbar>

            <q-toolbar-title> {{$t('button.survey')}}</q-toolbar-title>
            <q-btn
              round
              dense
              flat
              v-close-popup
              color="white"
              icon="cancel"
            />
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page class="q-pa-sm">
          <div  id="surveyContainer">
            <survey :survey="survey"></survey>
          </div>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
          </q-page>
        </q-page-container>
       </q-layout>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
//import AuthMenu from "./auth/AuthMenu";
import storeMappingMixin from '../mixin/storeMappingMixin'
import * as SurveyVue from 'survey-vue'


export default {
  name: "Layout",

  components: {
    SurveyVue
  },
  computed: {
    isLoggedIn () {
      console.log("called isloggedin")
      return this.$auth.loggedIn()
    }
  },
  created () {
    console.log("AUTH IN LAYOUT")
    console.log(this.$auth.loggedIn())
  },
  mixins: [storeMappingMixin({
    getters: {
      user: 'auth/user',
     surveys: 'survey/surveys'
      }, actions: {
        fetchNGOSurvey: 'survey/fetchNGOSurvey',
        saveSurveyAnswer: 'survey/saveSurveyAnswer'
      }
  })],
    mounted(){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = "window._mfq = window._mfq || [];(function () {var mf = document.createElement(\"script\"); mf.type = \"text/javascript\"; mf.defer = true;      mf.src = \"//cdn.mouseflow.com/projects/" + this.$envconfig.ngoMouseflow + ".js\";      document.getElementsByTagName(\"head\")[0].appendChild(mf);    })();";
    document.getElementsByTagName('head')[0].appendChild(script);

  },
  data () {
    return {
      surveyJSON: null,
      alert: false,
      survey: null,
      leftDrawerOpen: false,
      navs: [
        {
          label: "menu.information_centre",
          icon: "description",
          to: "/information",
          feature: "FEAT_DEFAULT",
          description: "menu.information_centre_desc"
        },
        {
          label: "menu.events",
          icon: "description",
          to: "/events",
          feature: "FEAT_EVENTS",
          description: "menu.events_desc"
        },
        {
          label: "menu.process",
          icon: "linear_scale",
          to: "/guided_process_editor",
          feature: "FEAT_PROCESSES",
          description: "menu.process_desc"
        },
        {
          label: "menu.interventions",
          icon: "linear_scale",
          to: "/interventions",
          feature: "FEAT_DOCUMENTS",
          description: "menu.validation_requests"
        },
        {
          label: "menu.settings",
          icon: "settings_applications",
          to: "/settings",
          feature: "FEAT_DEFAULT",
          description: "menu.setting_desc"
        },
        {
          label: "menu.CSO_user",
          icon: "settings_applications",
          to: "/usermgmt",
          feature: "FEAT_DEFAULT",
          description: "menu.cso_desc"
        }
      ]
    };
  },
  methods: {
    toLogin () {
      this.$auth.login()
    },
    generateSurvey () {
      console.log("computed surveyrender")
      console.log(this.surveyJSON)
      if (this.surveyJSON != null) {
        this.survey = new SurveyVue.Model(this.surveyJSON)
        console.log("after survey initialization")
        this.survey.onComplete.add((result) => {
          console.log("result of SURVEY")
          console.log(result.data)
          this.saveResults(result.data)
        })
        this.alert = true
        return this.survey
      } else {
        return null
      }
    },
    saveResults (answer) {
      console.log(this.surveys)
      var formatted_results = {
        idSurvey: this.surveys.id,
        idUser: this.user.umid,
        answer: JSON.stringify(answer),
        answerDate: new Date().toISOString()
      }
      console.log(formatted_results)
      this.saveSurveyAnswer(formatted_results)
      console.log("I am saving the results of the survey!!!!!")
    },
    toLogout () {
      this.$auth.logout()
    }
  },
    created () {
    this.fetchNGOSurvey(this.user.umid).then((sr) => {
      console.log("I AM THE SUrVEY")
      console.log(sr)
      if(sr != null){
        this.surveyJSON = JSON.parse(sr.survey)
      }
      console.log("I AM THE SUrVEY json")

      console.log(this.surveyJSON)
    })
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
