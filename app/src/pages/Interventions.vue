<template>
  <div v-if="loading">{{$t('input_labels.loading')}}</div>
  <div v-else >
    <div class="image" style="text-align:center;"  >
       <div
            class=" top-div"
            style=""
          >
            {{ $t('menu.interventions') }}
            <q-icon
              name="img:statics/Interventions.svg"
              class="top-icon"
            />
          </div>
        </div>
        <hr style="border: 1px solid #0F3A5D">
        <div style="text-align:center">
      <q-input
        style="width:80%; display:inline-block;"
        dense
        filled
        items-center
        v-model="search"
        :label="$t('input_labels.search')"
      >
        <template v-slot:append>
          <q-avatar>
              <q-icon name="search" />
          </q-avatar>
        </template>
      </q-input>
        </div>
    <div class="q-pa-md">
      <q-list>
        <Intervention
          v-for="interv in searchResults"
          :key="interv.id"
          :the_intervention="interv"
          @doValidation="openValidateDialog($event)"
        />
      </q-list>
    </div>
    <q-dialog
      v-model="ask_validation"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{$t('input_labels.validate_intervention')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            filled
            dense
            clearable
            emit-value
            map-options
            v-model="validatingDocType"
            :options="this.t_docs"
            :label="$t('input_labels.doc_type')"
          />
          <q-file
            v-model="validationFile"
            accept=".jpg, .pdf, image/*"
            label="Choose an optional file for validate"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
          :data-cy="'cancel'"
            :label="$t('button.cancel')"
            color="accent"
            no-caps
            v-close-popup
          />
          <q-btn
            :label="$t('button.add_document')"
            color="accent"
            no-caps
            :data-cy="'validatetask'"
            @click="validateTask()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script> 
//import { mapGetters, mapActions } from "vuex";
import storeMappingMixin from '../mixin/storeMappingMixin'
import editEntityMixin from '../mixin/editEntityMixin'
import Intervention from '../components/Intervention'
//import { mixin } from 'vue/types/umd';

export default {
  // name: 'PageName',
  mixins: [storeMappingMixin({
    getters: {
      interventions: 'interventions/interventions',
      document_types: 'document_type/document_types',
      ngo_user:'auth/user',
      keycloakMigrantUser: 'user/keycloakMigrantUser'
    }, actions: {
      fetchInterventions: 'interventions/fetchInterventions',
      fetchDocumentType: 'document_type/fetchDocumentType',
      fetchKeycloakMigrantUser: 'user/fetchKeycloakMigrantUser',
      fetchUser: 'user/fetchUser',
      fetchTenants: 'tenant/fetchTenants',
      saveDocument: 'documents/saveDocument',
      editIntervention: 'interventions/editIntervention'
    }
  }),
    editEntityMixin],
  data () {
    return {
      loading: true,
      ask_validation: false,
      validationFile: null,
      validatingIntervention: null,
      validatingUser: null,
      validatingDocType: null,
      doc_shell: {
        id: -1,
        pictures: [],
        userId: null,
        userTenant: null,
        askValidateByTenant: null,
        validated: false,
        validationDate: null,
        validatedByTenant: null,
        validatedByUser: null,
        uploadedByMe: true,
        expirationDate: null,
        documentTypeId: "",
        shareable:true
      },
      t_docs: [],
      search: ""
    };
  },
  components: {
    Intervention
  },
  computed: {
    //    ...mapGetters("interventions", ["interventions"]),
    plansToComplete(){
      return this.interventions.filter((plan)=>{
        return plan.completed == false
      })
    }, 
    searchResults(){
          
      //if none of the fields is filled in it will give the full list of processes
      if (this.search == "") {
        return this.plansToComplete
      }
      else {
        return this.plansToComplete.filter((a_process) => {
          console.log(this.activeLanguage)
          //var curlangproc = a_process.translations.filter((transl) => { return transl.lang == this.activeLanguage })[0]
          //Splits the search field and puts the words in an array
          var searchArray = this.search.toLowerCase().split(" ")
          if (searchArray.every(string => a_process.title.toLowerCase().includes(string))) {
            return true
          }        })
      }
    
    }
  },
  methods: {
    //    ...mapActions("interventions", ["fetchInterventions"]),
    //    ...mapActions("user", ["fetchUser"]),
    openValidateDialog (event) {
      console.log(event.intervention)
      this.validatingIntervention = event.intervention
      this.validatingUser = event.userId
      this.ask_validation = true
    },
    validateTask () {
      console.log("user id: " + this.validatingUser)
      let current_data = new Date().toISOString()

      // before validate the intervention and in the then check the file
      this.validatingIntervention.completed = true
      this.validatingIntervention.validationDate = current_data
      // TODO change with the real user ID
      this.validatingIntervention.validatingUserId = this.ngo_user.sub
      this.editIntervention({ intervention: this.validatingIntervention, plan: this.validatingIntervention.list_id })
        .then(() => {
          if (this.validationFile) {
            console.log("we have to upload a file to the user")
            console.log(this.validationFile)
            let reader = new FileReader()
            // Convert the file to base64 text
            reader.readAsDataURL(this.validationFile)
            // on reader load somthing...
            reader.onload = () => {
              // Make a fileInfo Object
              let fileInfo = {
                name: this.validationFile.name,
                type: this.validationFile.type,
                size: Math.round(this.validationFile.size / 1000) + ' kB',
                base64: reader.result,
                file: this.validationFile
              }
              this.doc_shell.userId = this.validatingUser
              this.doc_shell.userTenant = this.$migrant_tenant
              this.doc_shell.documentTypeId = this.validatingDocType
              this.doc_shell.validated = true
              this.doc_shell.validationDate = current_data
              this.doc_shell.uploadedByMe = false
              this.doc_shell.validatedByTenant = this.validatingIntervention.validating_user_tenant
              // TODO substitute with proper value (now using the 17 as id of tenant 3)
              this.doc_shell.validatedByUser = this.ngo_user.sub
              this.doc_shell.pictures.push({
                id: -1,
                picture: fileInfo.base64,
                docId: -1,
                order: null
              })
              // now we can send
              console.log("I am validating intervention and its id")
              console.log(this.validatingIntervention)
              console.log(this.validatingIntervention.id)
              this.saveDocument({document:this.doc_shell, id_intervention:this.validatingIntervention.id})
                .then(() => {
                  // still have to write the completed_intervention_document table to associate the new doc with the intervention

                  this.createShell()
                  this.validationFile = null
                  this.validatingIntervention = null
                  this.validatingUser = null
                  this.validatingDocType = null
                })
            }

          }
        })
    },
    createShell () {
      this.doc_shell = { id: -1, pictures: [], userId: null, userTenant: null, askValidateByTenant: null, validated: false, validationDate: null, validatedByTenant: null, validatedByUser: null, uploadedByMe: true, expirationDate: null, documentTypeId: "", shareable:true }
    },
  },
  created () {
    this.fetchTenants().then((tenants)=>{
      console.log(tenants)
      console.log(this.$store.state.auth.user.groups[0].replace("/", ""))
       var the_tenant = tenants.filter((ten)=>{
        return ten.name == this.$store.state.auth.user.groups[0].replace("/", "")
      })[0]
      console.log(the_tenant)
      this.fetchInterventions({ lang: this.activeLanguage, ngoTenantId:the_tenant.id }).then(() => {
      console.log("I am the interventions fetched")
      console.log(this.interventions)
      let userList = []
      this.interventions.forEach(a_int => {
        console.log(a_int.user_id)
        userList.push(a_int.user_id)
      });
      this.fetchUser(userList).then(() => {
        this.fetchKeycloakMigrantUser().then((us)=>{
          console.log(us)
          this.loading = false
        })
      })
    })
    })

    this.fetchDocumentType()
      .then(document_types => {
        console.log(document_types)
        document_types.forEach(document_type => {
          var the_doc = { label: document_type.translations.filter(this.filterTranslationModel(this.activeLanguage))[0].document, value: document_type.id }
          this.t_docs.push(the_doc)
        })

      })
  }
}
</script>
<style scoped>
.top-icon{
width:360px;
  height:100%
}
.top-div{
  font-style: normal;
  padding-top:15px;
  padding-left:30px;
  font-weight: bold;
  font-size: 40px;
  line-height: 54px;
  color:#0F3A5D; 
}
.image{
  background-image: url("../statics/BG Pattern.svg");
}
</style>