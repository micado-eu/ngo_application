import { mapGetters, mapActions } from "vuex";

const storeMappingMixin = mappingArray => ({
    computed: {
        //        console.log(mappingArray)
        //        ...mapGetters("interventions", ["interventions"]),
        ...mapGetters(mappingArray.getters)
    },
    methods: {
        //        console.log(mappingArray)
        //        ...mapActions("interventions", ["fetchInterventions"]),
        //        ...mapActions("user", ["fetchUser"]),
        ...mapActions(mappingArray.actions)
    },
})

export default storeMappingMixin