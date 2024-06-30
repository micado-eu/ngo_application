<template>
  <q-layout view="hHh lpR fFf">
    <!--<q-header
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
        <!--<q-btn
          v-if="this.$auth.loggedIn() && this.surveyJSON != null"
          no-caps
          style="background-color:white; color:#0B91CE"
          :label="$t('button.survey')"
          @click="generateSurvey"
        />
        <q-btn
          no-caps
          v-if="survey_visible"
          style="background-color:white; color:#0B91CE"
          :label="$t('button.survey')"
          @click="openSurvey"
        />
        <div>Micado v0.1</div>
      </q-toolbar>
    </q-header>-->

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
      :mini="leftDrawerOpen"
      show-if-above
      :breakpoint="767"
      bordered
      content-class="bg-accent text-white"
    >
    <q-item class="shadow-box shadow-10">
        <q-item-section avatar>
          <q-icon
            name="menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="app_label">
            {{ $t("application_title") }}
          </q-item-label>
        </q-item-section>
      </q-item>
    <div  v-if="isLoggedIn" class="column flex-center q-gutter-y-md">
      <q-item clickable
         
          @click="back"
          class="go_back">
         <q-item-section avatar>
            <q-icon
              :name="'img:statics/icons/Icon - go back.svg'"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('button.go_back') }}</q-item-label>
          </q-item-section>
      </q-item>

          <!--<q-btn
          class="go_back"
            :label="$t('button.go_back')"
            :icon="'img:statics/icons/Icon - go back.svg'"
            rounded
            no-caps
          v-if="isLoggedIn"
          @click="back"
        >
              </q-btn>-->
    </div>
      <hr  v-if="isLoggedIn" class="separator">

      <div class="column flex-center q-gutter-y-md" style="padding-bottom:20px;padding-top:20px">
         <UserButton/>
       <!-- <q-btn
          round
          class=""
          v-if="isLoggedIn"
        >
          <q-avatar size="42px">
            <img src="https://cdn.quasar.dev/img/avatar2.jpg">
          </q-avatar>
        </q-btn>-->
      </div>
           <hr class="separator">


      <q-item
        clickable
        @click="toLogin()"
        v-if="!isLoggedIn"
        style="padding-top:20px;padding-bottom:20px"
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
           <hr class="separator">
      <div style="text-align:center">
        <q-btn
          no-caps
          :icon="'img:statics/icons/Icon - Survey.svg'"
          v-if="survey_visible"
          style="background-color:white; color:#0B91CE; width:90%"
          :label="$t('button.survey')"
          @click="openSurvey"
        />
      </div>
      <hr class="separator">
      <q-list
        dark
        v-if="isLoggedIn"
      >
        <q-item-label header>{{ $t('menu.title') }}</q-item-label>
        <q-item
          :disable="nav.auth != undefined ? !check(nav.auth) : false"
          :data-cy="nav.label.replace('.', '_')"
          exact
          dark
          active
          clickable
          v-feature-flipping="nav.feature"
          active-class="my-menu-link"
          v-for="(nav) in navs"
          @click="changeIcon(nav.label)"
          :to="nav.to"
          :key="nav.label"
          style="padding-top:16px; padding-bottom:16px"
        >
          <q-item-section avatar>
            <q-icon
              :key="nav.label"
              :name="(selectedKey == nav.label) ? nav.active_icon : nav.icon "
            />
          </q-item-section>
          <q-item-section>
            <q-item-label style="font-weight:500">{{ $t( nav.label) }}</q-item-label>
            <q-item-label caption>{{ $t(nav.description) }}</q-item-label>
          </q-item-section>
        </q-item>
        <br />
        <div class="row justify-center full-height full-width text-center">
          <img
          style="max-width:161px"
            alt="Powered by Micado"
            src="~assets/MICADO Logo - powered by.svg"
          />
        </div>
      </q-list>
      <q-list
        dark
        v-else
      >
        <div class="row justify-center full-height full-width text-center">
          <img
            style="max-width:161px"
            alt="Powered by Micado"
            src="~assets/MICADO Logo - powered by.svg"
          >
        </div>
      </q-list>
    </q-drawer>
 <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('button.survey')}}</div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if=" settings.filter((set)=>{return set.key == 'survey_cso'}).length >0" style="max-height: 50vh" >
        <div v-if=" settings.filter((set)=>{return set.key == 'survey_cso'}).length >0" >{{$t('input_labels.survey_cso')}}</div><br>
        <a v-if=" settings.filter((set)=>{return set.key == 'survey_cso'}).length >0" :href="this.settings.filter((set)=>{return set.key == 'survey_cso'})[0].value">
        {{this.settings.filter((set)=>{return set.key == 'survey_cso'})[0].value}}<br>
        </a>
       </q-card-section>

        
      </q-card>
    </q-dialog>

    <q-dialog v-model="alert_int" full-width>
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
import UserButton from 'components/UserButton'


export default {
  name: "Layout",

  components: {
    SurveyVue,UserButton
  },
  computed: {
    survey_visible(){
      var surveyType = this.settings.filter((set)=>{
        return set.key =='internal_survey'
      })
      console.log(this.user)
       if(surveyType.length >0){
        if(surveyType[0].value =='true'){
          if(this.$auth.loggedIn() && this.surveyJSON !=null){
            return true
          }
          else{
            return false
          }
          
        }
        else{
          if(this.settings.filter((set)=>{return set.key == 'survey_cso'}).length >0){
            return true
          }
          else{
            return false
          }
        }
      }
      else{
         if(this.settings.filter((set)=>{return set.key == 'survey_cso'}).length >0){
            return true
          }
          else{
            return false
          }
      }
    },
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
      check: 'auth/check',
      user: 'auth/user',
      surveys: 'survey/surveys',
      settings: "settings/settings",

      }, actions: {
        fetchNGOSurvey: 'survey/fetchNGOSurvey',
        saveSurveyAnswer: 'survey/saveSurveyAnswer',
        getUserPic: 'user/getUserPic'

      }
  })],
    mounted(){
/*
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = "window._mfq = window._mfq || [];(function () {var mf = document.createElement(\"script\"); mf.type = \"text/javascript\"; mf.defer = true;      mf.src = \"//cdn.mouseflow.com/projects/" + this.$envconfig.ngoMouseflow + ".js\";      document.getElementsByTagName(\"head\")[0].appendChild(mf);    })();";
    document.getElementsByTagName('head')[0].appendChild(script);
*/
  },
  data () {
    return {
      surveyJSON: null,
      alert: false,
      alert_int:false,
      survey: null,
      leftDrawerOpen: false,
      navs: [
         {
          label: 'menu.home',
          icon: 'img:statics/icons/Icon - Home.svg',
          active_icon: 'img:statics/icons/Icon - Home.svg',
          to: '/',
          feature: "FEAT_DEFAULT",
          auth: ["Application/micado_ngo_superadmin", "Application/micado_ngo_admin", "Application/micado_ngo_migrant_manager"],
          description: 'menu.home_desc'
        },
        {
          label: "menu.information_centre",
          icon: "img:statics/icons/Icon - Information Centre.svg",
          active_icon: 'img:statics/icons/Icon - Information Centre.svg',
          to: "/information",
          feature: "FEAT_DEFAULT",
          auth: ["Application/micado_ngo_superadmin", "Application/micado_ngo_admin", "Application/micado_ngo_migrant_manager"],
          description: "menu.information_centre_desc"
        },
        {
          label: "menu.events",
          icon: "img:statics/icons/Icon - Events (4th Iteration)_ (1).svg",
          active_icon: 'img:statics/icons/Icon - Events (4th Iteration)_ (1).svg',
          to: "/events",
          feature: "FEAT_EVENTS",
          auth: ["Application/micado_ngo_superadmin", "Application/micado_ngo_admin", "Application/micado_ngo_migrant_manager"],
          description: "menu.events_desc"
        },
        {
          label: "menu.process",
          icon: "img:statics/icons/Icon - Integration step-bystep.svg",
          active_icon: 'img:statics/icons/Icon - Integration step-bystep.svg',
          to: "/guided_process_editor",
          feature: "FEAT_PROCESSES",
          auth: ["Application/micado_ngo_superadmin", "Application/micado_ngo_admin", "Application/micado_ngo_migrant_manager"],
          description: "menu.process_desc"
        },
        {
          label: "menu.interventions",
          icon: "img:statics/icons/Icon - Manage Validations.svg",
          active_icon: 'img:statics/icons/Icon - Manage Validations.svg',
          to: "/interventions",
          feature: "FEAT_DOCUMENTS",
          auth: ["Application/micado_ngo_superadmin",  "Application/micado_ngo_migrant_manager"],
          description: "menu.validation_requests"
        },
        {
          label: "menu.CSO_user",
          icon: "img:statics/icons/Icon - CSO Admin Management.svg",
          active_icon: 'img:statics/icons/Icon - CSO Admin Management.svg',
          to: "/usermgmt",
          feature: "FEAT_DEFAULT",
          auth: ["Application/micado_ngo_superadmin", "Application/micado_ngo_admin"],
          description: "menu.cso_desc"
        },
        {
          label: "menu.settings",
          icon: "img:statics/icons/Icon - Settings.svg",
          active_icon: 'img:statics/icons/Icon - Settings.svg',
          to: "/settings",
          feature: "FEAT_DEFAULT",
          auth: ["Application/micado_ngo_superadmin", "Application/micado_ngo_admin", "Application/micado_ngo_migrant_manager"],
          description: "menu.setting_desc"
        }

      ],
      selectedKey:null
    };
  },
  methods: {
    openSurvey(){
      var surveyType = this.settings.filter((set)=>{
        return set.key =='internal_survey'
      })
      console.log(surveyType)
      console.log(typeof(surveyType))
      if(surveyType.length >0){
        if(surveyType[0].value =='true'){
          this.generateSurvey()
        }
        else{
          this.alert = true
        }
      }
      else{
        this.alert = true
      }
    },
    back(){
      this.$router.go(-1)
    },
    toLogin () {
//      this.$auth.login()
      this.$keycloak.login()

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
        this.alert_int = true
        return this.survey
      } else {
        return null
      }
    },
    saveResults (answer) {
      console.log(this.surveys)
      var formatted_results = {
        idSurvey: this.surveys.id,
        idUser: this.user.sub,
        answer: JSON.stringify(answer),
        answerDate: new Date().toISOString()
      }
      console.log(formatted_results)
      this.saveSurveyAnswer(formatted_results)
      console.log("I am saving the results of the survey!!!!!")
    },
    toLogout () {
      this.$auth.logout()
      this.$keycloak.logoutFn()

    },
        changeIcon (key) {
      console.log('selected key')
      this.selectedKey = key
    }
  },
    created () {
      this.getUserPic(this.user.sub).then((user_found)=>{
        console.log("I AM THE PICTURE")
        console.log(user_found)
      })
  
    this.fetchNGOSurvey(this.user.sub).then((sr) => {
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
.go_back {
  background-color: white;
  color: #0f3a5d;
  border: 1px solid #0f3a5d;
  border-radius: 50px;
  margin-top:20px;
}
.separator{
  margin-left: 0px;
  margin-right: 0px;
}
</style>
