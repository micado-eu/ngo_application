<template>
  <q-page class="flex flex-center">
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('auth.password.reset.header') }}
        </div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <q-card-section>
          <q-input
            id="password"
            v-model="data.password"
            type="password"
            :label="$t('auth.labels.password')"
            bottom-slots
            :rules="validations['password']"
            lazy-rules
          />
          <q-input
            id="repeatPassword"
            v-model="data.repeatPassword"
            type="password"
            :label="$t('auth.labels.repeat_password')"
            bottom-slots
            required
            :rules="validations['repeatPassword']"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('auth.submit')"
            color="accent"
            :loading="loading"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import equals from 'validator/lib/equals'

var minPasswordLength = 8

export default {
  name: 'PasswordReset',
  data () {
    return {
      data: {
        password: '',
        repeatPassword: ''
      },
      loading: false,
      validations: {
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
      this.loading = true
      this.token = this.$route.query.token
      this.$auth
        .passwordReset({
          token: this.token,
          data: { password: this.data.password }
        })
        .then(response => {
          this.$q
            .dialog({
              message: this.$t('auth.password.reset.success')
            })
            .onOk(() => {
              this.$router.push('/login')
            })
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
