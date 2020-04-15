<template>
  <q-page class="flex flex-center">
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('auth.login.login') }}
        </div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <q-card-section>
          <q-input
            id="email"
            v-model.trim="data.body.username"
            :label="this.$t('auth.login.email')"
            :rules="validations['username']"
            lazy-rules
            autofocus
          />
          <q-input
            id="password"
            v-model="data.body.password"
            type="password"
            :label="this.$t('auth.login.password')"
            :rules="validations['password']"
            lazy-rules
          /><br>
          <q-checkbox
            id="rememberMe"
            v-model="data.rememberMe"
            :label="this.$t('auth.login.remember_me')"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('auth.login.login')"
            color="accent"
            :loading="loading"
            type="submit"
          />
        </q-card-actions>
      </q-form>
      <router-link to="/password/forgot">
        <a>{{ this.$t('auth.login.password_forgot') }}</a>
      </router-link>
    </q-card>
  </q-page>
</template>

<script>
import isEmail from 'validator/lib/isEmail'

export default {
  name: 'Login',
  data () {
    return {
      data: {
        body: {
          username: '',
          password: ''
        },
        rememberMe: false
      },
      loading: false,
      validations: {
        username: [
          val => !!val || this.$t('auth.validations.required'),
//          val => isEmail(val) || this.$t('auth.validations.email')
        ],
        password: [val => !!val || this.$t('auth.validations.required')]
      }
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      this.$auth
        .login(this.data)
        .then(response => {
          this.$router.push('/account')
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 401) {
              this.$q.dialog({
                message: this.$t('auth.login.verification_required')
              })
            } else if (error.response.status === 403) {
              this.$q.dialog({
                message: this.$t('auth.login.invalid_credentials')
              })
            } else {
              console.error(error)
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
