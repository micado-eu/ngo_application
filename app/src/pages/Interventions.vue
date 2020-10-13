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
          <div class="text-h6">Validate intervention</div>
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
            label="Cancel"
            color="accent"
            v-close-popup
          />
          <q-btn
            label="Add document"
            color="accent"
            @click="validateTask()"
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
import editEntityMixin from '../mixin/editEntityMixin'
import Intervention from '../components/Intervention'
//import { mixin } from 'vue/types/umd';

export default {
  // name: 'PageName',
  mixins: [storeMappingMixin({
    getters: {
      interventions: 'interventions/interventions',
      document_types: 'document_type/document_types'
    }, actions: {
      fetchInterventions: 'interventions/fetchInterventions',
      fetchDocumentType: 'document_type/fetchDocumentType',
      fetchUser: 'user/fetchUser',
      saveDocument: 'documents/saveDocument'
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
        documentTypeId: ""
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
  },
  methods: {
    //    ...mapActions("interventions", ["fetchInterventions"]),
    //    ...mapActions("user", ["fetchUser"]),
    openValidateDialog (event) {
      console.log(event)
      this.validatingIntervention = event.intervention
      this.validatingUser = event.userId
      this.ask_validation = true
    },
    validateTask () {
      console.log("user id: " + this.validatingUser)
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
          let current_data = new Date().toISOString()
          this.doc_shell.userId = this.validatingUser
          this.doc_shell.documentTypeId = this.validatingDocType
          this.doc_shell.validated = true
          this.doc_shell.validationDate = current_data
          this.doc_shell.uploadedByMe = false
          this.doc_shell.validatedByTenant = this.validatingIntervention.validating_user_tenant
          this.doc_shell.pictures.push({
            id: -1,
            picture: fileInfo.base64,
            docId: -1,
            order: null
          })
          // now we can send
          this.saveDocument(this.doc_shell)
            .then(() => {
              this.createShell()
              this.validationFile = null
              this.validatingIntervention = null
              this.validatingUser = null
              this.validatingDocType = null
            })
        }

      }
    },
    createShell () {
      this.doc_shell = { id: -1, pictures: [], userId: null, userTenant: null, askValidateByTenant: null, validated: false, validationDate: null, validatedByTenant: null, validatedByUser: null, uploadedByMe: true, expirationDate: null, documentTypeId: "" }
    },
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
