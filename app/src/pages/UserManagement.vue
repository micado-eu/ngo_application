<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-6">
        <h5>{{$t('new_pa_user.usermgmt')}}</h5>
      </div>
      <div class="col-6 div-1">
        <q-btn
          color="info"
          no-caps
          :data-cy="'adduser'"
          :label="$t('button.add_user')"
          @click="newUser()"
          :disable="hideAdd"
          class="add-button"
        />
      </div>
    </div>
    <q-card
      class="q-pa-xl div-2"
      :hidden="hideForm"
    >
      <q-card-section>
        <div class="text-h6">Migrant application configuration</div>
      </q-card-section>
      <q-card-section>
         <form
          @submit.prevent.stop="onSubmit"
          @reset.prevent.stop="onReset"
          class=""
        >
        <div
              class=" q-pa-xsm "
              id="div-2"
            >
             <HelpLabel
            :fieldLabel="$t('new_pa_user.username')"
            :helpLabel="$t('help.pa_username')"
            class="div-3" />
              <q-input
                :readonly="!is_new"
                dense
                data-cy="title_input"
                bg-color="grey-3"
                standout
                ref="username"
                outlined
                maxlength="50"
                counter
                :rules="[ 
                val => val.length <= 50 || 'Please use maximum 50 characters',
                val => !!val || 'Field is required'
                ]"
                v-model="new_user.username"
              />
            </div>
              <div
              class=" q-pa-xsm "
              id="div-2"
              v-show="is_new"
            >
             <HelpLabel
            :fieldLabel="$t('new_pa_user.password')"
            :helpLabel="$t('help.pa_password')"
            class="div-3" />
      <q-input
                dense
                data-cy="title_input"
                bg-color="grey-3"
                standout
                :type="isPwd ? 'password' : 'text'"
                ref="password"
                outlined
                maxlength="50"
                counter
                :rules="[ 
                val => val.length <= 50 || 'Please use maximum 50 characters',
                val => !!val || 'Field is required'
                ]"
                v-model="new_user.password"
              >
            <template v-slot:append>
            <q-icon
            :name="isPwd? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
            </div>
             <div
              class=" q-pa-xsm "
              id="div-2"
            >
             <HelpLabel
            :fieldLabel="$t('new_pa_user.name')"
            :helpLabel="$t('help.pa_name')"
            class="div-3" />
              <q-input
                dense
                data-cy="title_input"
                bg-color="grey-3"
                standout
                ref="givenName"
                outlined
                maxlength="50"
                counter
                :rules="[ 
                val => val.length <= 50 || 'Please use maximum 50 characters',
                val => !!val || 'Field is required'
                ]"
                v-model="new_user.givenName"
              />
            </div>
             <div
              class=" q-pa-xsm "
              id="div-2"
            >
             <HelpLabel
            :fieldLabel="$t('new_pa_user.surname')"
            :helpLabel="$t('help.pa_surname')"
            class="div-3" />
              <q-input
                dense
                data-cy="title_input"
                bg-color="grey-3"
                standout
                ref="familyName"
                outlined
                maxlength="50"
                counter
                :rules="[ 
                val => val.length <= 50 || 'Please use maximum 50 characters',
                val => !!val || 'Field is required'
                ]"
                v-model="new_user.familyName"
              />
            </div>
             <div
              class=" q-pa-xsm "
              id="div-2"
            >
             <HelpLabel
            :fieldLabel="$t('new_pa_user.email')"
            :helpLabel="$t('help.pa_email')"
            class="div-3" />
              <q-input
                dense
                data-cy="title_input"
                bg-color="grey-3"
                standout
                ref="familyName"
                outlined
                maxlength="50"
                counter
                :rules="[ 
                val => val.length <= 50 || 'Please use maximum 50 characters',
                val => !!val || 'Field is required'
                ]"
                v-model="new_user.email"
              />
            </div>
            <div
              class=" q-pa-xsm "
              id="div-2"
            >
             <HelpLabel
            :fieldLabel="$t('new_pa_user.external_id')"
            :helpLabel="$t('help.pa_external_id')"
            class="div-3" />
              <q-input
                dense
                data-cy="title_input"
                bg-color="grey-3"
                standout
                ref="external_id"
                outlined
                counter
                v-model="new_user.external_id"
              />
            </div>
            <div class="row">
              <div class="col-3">
            <div class="q-gutter-sm row">
               <HelpLabel
          :fieldLabel="$t('new_pa_user.admin')"
          :helpLabel ="$t('help.pa_admin')"
          class="col-1.5 field"
          style="padding-top:10px"
          /> 
              <q-checkbox class=" col-1 div-3" color="accent" style="padding-top:10px" v-model="new_user.admin"  />
            </div>
              </div>
            <div class="q-gutter-sm row">
               <HelpLabel
          :fieldLabel="$t('new_pa_user.mig_tenant')"
          :helpLabel ="$t('help.pa_mig_tenant')"
          class="col-1.5 field"
          style="padding-top:10px"
          /> 
              <q-checkbox class=" col-1 div-3" color="accent" style="padding-top:10px" v-model="new_user.migrant_tenant"  />
            </div>
            </div>
        <hr id="hr">
        <q-btn
          no-caps
          class="delete-button"
          :data-cy="'canceldoc'"
          unelevated
          rounded
          :label="$t('button.cancel')"
          type="reset"
          @click="cancelUser()"
        />
        <q-btn
          no-caps
          :data-cy="'savedoc'"
          color="accent"
          unelevated
          rounded
          :label="$t('button.save')"
          class="button"
          type="submit"
        />
         </form>
      </q-card-section>
    </q-card>
    <q-list
      bordered
      separator
    >
      <PaUser
        v-for="user in completepausers"
        :key="user.umId"
        :theUser="user"
        @edit="editPAUser"
      />
    </q-list>
  </div>
</template>

<script>
import storeMappingMixin from '../mixin/storeMappingMixin'
import PaUser from 'components/PaUser'
import HelpLabel from 'components/HelpLabel'


export default {
  name: "UserManagement",
  data () {
    return {
      group: ["FEAT_SERVICES"],
      hideAdd: false,
      isPwd:true,
      hideForm: true,
      new_user:{
        userid:null,
        username:'', 
        password:'',
        givenName:'',
        familyName:'',
        email:'',
        external_id:'',
        admin:false,
        migrant_tenant:false,
        roles:[]
      },
      is_new:true,
      workingFeatures: []
    }
  },
  mixins: [
    storeMappingMixin({
      getters: {
        pausers: 'user/csouser',
        token: 'auth/token'
      },
      actions: {
        fetchCSOUser: 'user/fetchCSOUser',
        saveCSOUser: 'user/saveCSOUser',
        fetchUserGroup: 'user/fetchUserGroup',
        editUserDataByAdmin:'user/editUserDataByAdmin'
      }
    })],
  components: {
    PaUser,HelpLabel
  },
  computed: {
    completepausers () {
      return this.pausers
    }
  },
  methods: {
    findAttribute(user_mask, editing_user, umAttribute,userAttribute){
      console.log(umAttribute)
      var arr = editing_user.attributes.filter((attr)=>{
        return attr.umAttrName == String(umAttribute)
      })
      if(arr.length>0){
        console.log("inside if")
        user_mask[userAttribute] = arr[0].umAttrValue 
        console.log(user_mask[userAttribute])
      }
    },
    editPAUser(value){
      this.is_new=false
      var editing_user = this.pausers.filter((user)=>{
        return user.umId == value
      })[0]
      console.log(editing_user)
      this.findAttribute(this.new_user, editing_user, 'uid', 'username')
      this.findAttribute(this.new_user, editing_user, 'scimId', 'userid')
      this.findAttribute(this.new_user, editing_user,'givenName', 'givenName')
      this.findAttribute(this.new_user, editing_user,'sn', 'familyName')
      this.findAttribute(this.new_user, editing_user,'workEmail', 'email')
      var working_token = this.token.token.access_token
      this.fetchUserGroup({user:this.new_user.username, token:working_token}).then((userg)=>{
        console.log(userg)
        if(userg.Resources){
        userg.Resources.forEach((role)=>{
          this.new_user.roles.push(role.displayName.replace("Application/", ""))
        })
        
          this.new_user.roles.forEach((role)=>{
          if(role == 'micado_ngo_admin' ){
            this.new_user.admin = true
          }
          if(role == 'micado_ngo_migrant_manager' ){
            this.new_user.migrant_tenant = true
          }
          
        })
        }
        this.new_user.roles=[]
        this.hideAdd = true
        this.hideForm = false

      })
      
    },
    onSubmit () {
      if(this.is_new){
              this.$refs.username.validate()
      this.$refs.password.validate()
      this.$refs.givenName.validate()
      this.$refs.familyName.validate()
      
      if (this.$refs.username.hasError || this.$refs.password.hasError || this.$refs.familyName.hasError || this.$refs.givenName.hasError  ) {
        this.formHasError = true
         this.$q.notify({
          color: 'negative',
          message: 'You need to fill in the required fields first'
        })
        return false
      }
      else{
        console.log("in else of submit")
        console.log(this.new_user)
        this.saveUser()
      }
      }
      else{
              this.$refs.username.validate()
      this.$refs.givenName.validate()
      this.$refs.familyName.validate()
      
      if (this.$refs.username.hasError || this.$refs.familyName.hasError || this.$refs.givenName.hasError  ) {
        this.formHasError = true
         this.$q.notify({
          color: 'negative',
          message: 'You need to fill in the required fields first'
        })
        return false
      }
      else{
        console.log("in else of submit")
        console.log(this.new_user)
        this.saveUser()
      }
      }

    },
        onReset () {
          console.log(this.$refs)
          this.hideForm = true
          this.hideAdd = false
        this.$refs.username.resetValidation()
        this.$refs.password.resetValidation()
        this.$refs.givenName.resetValidation()
        this.$refs.familyName.resetValidation()
        this.new_user={
        username:'', 
        password:'',
        givenName:'',
        familyName:'',
        email:'',
        external_id:'',
        admin:false,
        migrant_tenant:false,
        roles:[]
      }
       
      
    },
    newUser () {
      this.$refs.username.resetValidation()
        this.$refs.password.resetValidation()
        this.$refs.givenName.resetValidation()
        this.$refs.familyName.resetValidation()

      this.is_new = true
      this.hideAdd = true
      this.hideForm = false
    },
    saveUser(){
      console.log(this.new_user)
      this.new_user.roles.push('ngo_sp')
      if(this.new_user.admin == true){
        this.new_user.roles.push('micado_ngo_admin')
      }
      if(this.new_user.migrant_tenant == true){
        this.new_user.roles.push('micado_ngo_migrant_manager')
      }
      console.log(this.new_user)

      
      var working_roles = JSON.stringify(this.new_user.roles)
      var working_token = this.token.token.access_token
      console.log(working_token)
      console.log(working_user)
      console.log({user: working_user, tenant:"pa.micado.eu", token:working_token, roles:working_roles})
      if(this.is_new){
      var working_user =JSON.parse(JSON.stringify(this.new_user, ['username', 'password', 'givenName', 'familyName','email']))
      this.saveCSOUser({user: working_user, tenant:"ngo.micado.eu", token:working_token, roles:working_roles})
      }
      else{
        var working_user =JSON.parse(JSON.stringify(this.new_user, ['userid','username', 'password', 'givenName', 'familyName','email', 'roles']))
        console.log(working_user)
        this.editUserDataByAdmin({user:JSON.stringify(working_user), tenant:"ngo.micado.eu", token:working_token})
      }
      

      this.hideForm = true
      this.hideAdd = false
    },
    cancelUser () {
      //    this.isNew = false
      
      //   this.int_doc_shell.validators = []
      //    this.uploaded_images = []
      //     this.icon = null
      //     this.the_model = null
      //   this.order = 0
    },
    saveFeatures () {
      console.log(this.workingFeatures)
      this.updateAllFeatures(this.workingFeatures)
      console.log("posted")
      this.workingFeatures = JSON.parse(JSON.stringify(this.features))
    }

  },
  async created () {
    console.log("created")
    await this.fetchCSOUser(2)
    console.log(this.csouser)
    //    this.workingFeatures = JSON.parse(JSON.stringify(this.features))
    /*
    this.fetchFeatures()
      .then(features => {
        //        this.loading = false
        console.log("got features")
        console.log(this.features)
      });
      */

  }
}
</script>
<style scoped>
h5 {
  font-weight: bold;
}
.add-button {
  width: 200px;
}
</style>