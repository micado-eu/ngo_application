<template>
  <q-page
    padding
    class="flex flex-center"
  >
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('auth.register.register') }}
        </div>
      </q-card-section>
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <q-card-section>
          <q-input
            id="email"
            v-model.trim="data.email"
            type="email"
            :label="$t('auth.register.email')"
            bottom-slots
            autofocus
            :rules="validations['email']"
            lazy-rules
          />
          <q-input
            v-model.trim="data.name"
            type="text"
            :label="$t('auth.register.name')"
            :rules="validations['name']"
            lazy-rules
          />
          <q-input
            id="password"
            v-model="data.password"
            type="password"
            :label="$t('auth.register.password')"
            bottom-slots
            :rules="validations['password']"
            lazy-rules
          />
          <q-input
            id="repeatPassword"
            v-model="data.repeatPassword"
            type="password"
            :label="$t('auth.register.repeat_password')"
            bottom-slots
            required
            :rules="validations['repeatPassword']"
            lazy-rules
          />
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('auth.register.register')"
            :loading="loading"
            color="accent"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import isEmail from 'validator/lib/isEmail'
import equals from 'validator/lib/equals'

const minPasswordLength = 8

export default {
  name: 'Register',
  data () {
    return {
      data: {
        name: '',
        email: '',
        password: '',
        repeatPassword: ''
      },
      loading: false,
      minPasswordLength: minPasswordLength,
      validations: {
        email: [
          val => !!val || this.$t('auth.validations.required'),
          val => isEmail(val) || this.$t('auth.validations.email')
        ],
        name: [val => !!val || this.$t('auth.validations.required')],
        password: [
          val => !!val || this.$t('auth.validations.required'),
          val =>
            val.length > minPasswordLength ||
            this.$t('auth.validations.password_length', {
              length: minPasswordLength
            })
        ],
        repeatPassword: [
          val => !!val || this.$t('auth.validations.required'),
          val =>
            equals(val, this.data.password) ||
            this.$t('auth.validations.password_match')
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$q
        .dialog({
          message: this.$t('auth.register.check_email', {
            email: this.data.email
          }),
          cancel: true
        })
        .onOk(() => {
          this.loading = true
          this.$auth
            .register(this.data)
            .then(() => {
              this.$q
                .dialog({
                  message: this.$t('auth.register.account_created')
                })
                .onOk(data => {
                  this.$router.push('/login')
                })
            })
            .catch(error => {
              if (error.response) {
                if (error.response.status === 422) {
                  this.$q.dialog({
                    message: this.$t('auth.register.invalid_data')
                  })
                } else if (error.response.status === 409) {
                  this.$q.dialog({
                    message: this.$t('auth.register.already_registered')
                  })
                } else {
                  console.error(error)
                }
              }
            })
            .finally(() => {
              this.loading = false
            })
        })
    }
  }
}
</script>
