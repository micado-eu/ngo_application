<template>
  <q-page class="flex flex-center">
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('auth.password.forgot.header') }}
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
            type="text"
            :label="$t('auth.password.forgot.email')"
            :rules="validations['email']"
            lazy-rules
            autofocus
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
import isEmail from 'validator/lib/isEmail'

export default {
  name: 'PasswordForgot',
  data () {
    return {
      data: {
        email: ''
      },
      loading: false,
      validations: {
        email: [
          val => !!val || this.$t('auth.validations.required'),
          val => isEmail(val) || this.$t('auth.validations.email')
        ]
      }
    }
  },
  mounted () {
    if (this.$auth.check()) {
      this.$router.push('/account')
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      this.$auth
        .passwordForgot(this.data)
        .then(response => {
          this.$q
            .dialog({
              message: this.$t('auth.password.forgot.check_email')
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
