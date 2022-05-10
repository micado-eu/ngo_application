<template>
  <div >
    <p>
    <b>{{userdata}}</b> {{$t('input_labels.request_validation')}}: {{the_intervention.title}}
    </p>
    <div
      v-for="a_int in interventionsToComplete"
      :key="a_int.id"
      class="row"
      style="padding-bottom:10px;"
    >
    <div class="col">
    {{$t('input_labels.intervention')}}: {{a_int.title}}
    </div>
    <div class="col" style="text-align:right">
      <q-btn
        size="11px"
        :data-cy="'validateintervention'.concat(a_int.id)"
        no-caps
        style="width:70px:border-radius:2px"
        color="info"
        label="Validate"
        @click="doValidation(a_int, the_intervention.user_id)"
      />
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import storeMappingMixin from '../mixin/storeMappingMixin'


export default {
  name: 'Intervention',
  props: ["the_intervention"],
  data () {
    return {

    }
  },
  mixins: [storeMappingMixin({
    getters: {
      keycloakMigrantUser: 'user/keycloakMigrantUser'
    }, actions: {
      fetchKeycloakMigrantUser: 'user/fetchKeycloakMigrantUser',
    }
  })],
  computed: {
    userdata () {
      console.log(this.keycloakMigrantUser)
      let u = this.keycloakMigrantUser.filter((user)=>{
        return user.id == this.the_intervention.user_id
      })[0]
        return u.username
    }, 
    interventionsToComplete(){
      return this.the_intervention.interventions.filter((interv)=>{
        return interv.completed == false
      })
    }
  },
  methods: {
    doValidation (intervention, userId) {
      console.log("intervention before emit")
      console.log(intervention)
      this.$emit('doValidation', { intervention: intervention, userId: userId })
    }
  }
}
</script>
