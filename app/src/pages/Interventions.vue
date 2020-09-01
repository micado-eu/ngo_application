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
        />
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Intervention from '../components/Intervention'

export default {
  // name: 'PageName',
  data () {
    return {
      loading: true,
      search: ""
    };
  },
  components: {
    Intervention
  },
  computed: {
    ...mapGetters("interventions", ["interventions"]),
  },
  methods: {
    ...mapActions("interventions", ["fetchInterventions"]),
    ...mapActions("user", ["fetchUser"]),
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
