<template>
  <q-page padding>
    <div class="col">
      <q-input
        style="border-radius:10px; width:590px;font-size:18px"
        dense
        items-center
        filled
        v-model="search"
        label="Search"
      >
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
        </template>
      </q-input>
    </div>
    <div>
      <q-list>
        <Intervention
          v-for="interv in interventions"
          :key="interv.id"
          :the_intervention="interv"
          @doValidation="validate($event)"
        />
      </q-list>
    </div>
    <q-dialog
      v-model="ask_validation"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Validate intervention</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-file
            v-model="validationFile"
            label="Choose an optional file for validate"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            label="Cancel"
            v-close-popup
          />
          <q-btn
            label="Add address"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
//import { mapGetters, mapActions } from "vuex";
import storeMappingMixin from '../mixin/storeMappingMixin'
import Intervention from '../components/Intervention'
//import { mixin } from 'vue/types/umd';

export default {
  // name: 'PageName',
  mixins: [storeMappingMixin({
    getters: {
      interventions: 'interventions/interventions'
    }, actions: {
      fetchInterventions: 'interventions/fetchInterventions',
      fetchUser: 'user/fetchUser'
    }
  })],
  data () {
    return {
      loading: true,
      ask_validation: false,
      validationFile: null,
      search: ""
    };
  },
  components: {
    Intervention
  },
  computed: {
    //    ...mapGetters("interventions", ["interventions"]),
  },
  methods: {
    //    ...mapActions("interventions", ["fetchInterventions"]),
    //    ...mapActions("user", ["fetchUser"]),
    validate (event) {
      console.log(event)
      this.ask_validation = true
    }
  },
  created () {
    this.fetchInterventions().then(() => {
      console.log(this.interventions)
      let userList = []
      this.interventions.forEach(a_int => {
        console.log(a_int.user_id)
        userList.push(a_int.user_id)
      });
      this.fetchUser(userList).then(() => {
      })
    })

  }
}
</script>
