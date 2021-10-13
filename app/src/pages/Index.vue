<template>
  <q-page  v-if="!this.$auth.loggedIn()" class="col center">
    <div  class="col">
      <img
        alt="Micado logo"
        src="~assets/micado-logo.png"
      >
      <div>
        CSO Application
      </div>
      <div class="h6">Build: {{buildDate}}</div>
    </div>
    <div
      class="h4"
     
    >To log in please press
      <q-btn
        @click="toLogin()"
        label="here"
      />
    </div>
  </q-page>
  <q-page v-else>
    <div class="nav-container row" >
    <div
    v-for="nav in navs"
    :key="nav.label"
    class="navs"
    @click="selected_info = nav.label">
  <div style="text-align:center">
   <q-icon :name="nav.icon" class="top-icon"/>
   <p>{{$t(nav.label)}}</p>
  </div>
  <HelpDialog 
  :nav="nav"
  :selected_info="isOpen(nav.label)"
  @hiding="reset"/>
    </div>
    </div>
  </q-page>
</template>

<script>
import HelpDialog from 'components/HelpDialog'

export default {
  name: 'PageIndex',
  components: {
    HelpDialog
  },
  data () {

    return {
      buildDate: new Date(this.$envconfig.appBuildDate),
      navs: [
        
        {
          label: "menu.information_centre",
          icon: "img:statics/icons/Icon - Information Centre1.svg",
          description: "menu.information_centre_description"
        },

        {
          label: "menu.events",
          icon: "img:statics/icons/Icon - Events (4th Iteration)_ (1)1.svg",
          description: "menu.events_description"
        },
        {
          label: "menu.process",
          icon: "img:statics/icons/Integration-step.svg",
          description: "menu.process_description"
        },
        {
          label: "menu.cso",
          icon: "img:statics/icons/Icon - CSO Admin Management1.svg",
          description: "menu.cso_description"
        },
        {
          label: "menu.setting",
          icon: "img:statics/icons/Icon - Settings1.svg",
          description: "menu.setting_description"
        },
        {
          label: "menu.interventions",
          icon: "img:statics/icons/Icon - Information Centre1.svg",
          description: "menu.validation_description"
        }
      ], 
      selected_info:null
    }
  },
  methods: {
    toLogin () {
      this.$auth.login()
    },
    isOpen(value){
      return this.selected_info == value
    },
    reset(){
      this.selected_info = null
    }
  }
}
</script>
<style scoped>
.navs{
  width: 450px;
height: 250px;
margin-left: 30px;
margin-right:30px;
margin-bottom: 30px;
border: 1px solid #0F3A5D;
box-sizing: border-box;
border-radius: 10px;
}
.nav-container{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row wrap;
  margin-bottom: 25px;
  padding-top:70px;
}
.top-icon{
  width:54px;
  height:54px;
  margin-top:100px;
}

</style>
