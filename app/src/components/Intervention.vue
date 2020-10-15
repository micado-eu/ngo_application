<template>
  <div><b>{{userdata}}</b> has requested a validation for his plan: {{the_intervention.title}}
    <div
      v-for="a_int in the_intervention.interventions"
      :key="a_int.id"
    >Intervention: {{a_int.title}}
      <q-btn
        size="11px"
        no-caps
        style="width:70px:border-radius:2px"
        color="info"
        label="Validate"
        @click="doValidation(a_int, the_intervention.user_id)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";


export default {
  name: 'Intervention',
  props: ["the_intervention"],
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters("user", ["userByid"]),
    userdata () {
      let u = this.userByid(this.the_intervention.user_id)
      console.log(u)
      if (Array.isArray(u) && u.length) {
        return u[0].umUserName
      } else {
        return ""
      }
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
