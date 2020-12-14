// This is just an example,
// so you can safely delete all default props below

export default {
  buttons: {
    send: 'Send',
    submit: 'Submit',
    save: 'Save'
  },
  auth: {
    network_error: 'Network error. Please check your internet connection',
    submit: 'Submit',
    home: 'Home',
    navigation: 'Navigation',
    my_account: 'My account',
    administrator: {
      title: 'Administrator'
    },
    superuser: {
      title: 'Superuser',
      users: {
        users: 'Users'
      }
    },
    labels: {
      email: 'Email address',
      name: 'Name',
      password: 'Password',
      remember_me: 'Remember me',
      repeat_password: 'Repeat password'
    },
    login: {
      login: 'Login',
      password_forgot: 'Forgot your password?',
      verification_required:
        'Please check your email and verify your account first.',
      invalid_credentials: 'Email address or password is incorrect.',
      email: '@:auth.labels.email',
      password: '@:auth.labels.password',
      remember_me: '@:auth.labels.remember_me'
    },
    register: {
      register: 'Register',
      invalid_data:
        'Server could not process the request. Please correct the sent data.',
      already_registered:
        'Email address is already registered. Please check your email for verification.',
      account_created:
        'Please check your email to verify your registration. This sometimes can take up to 10 minutes. Please check the spam folder if the email has not been received.',
      email: '@:auth.labels.email',
      name: '@:auth.labels.name',
      password: '@:auth.labels.password',
      repeat_password: '@:auth.labels.repeat_password',
      check_email:
        'You want to register with the email address {email}, is this correct?'
    },
    verification: {
      verification_success: 'Your e-mail has been verified. You can now login.',
      verification_failed: 'Verification has failed.'
    },
    logout: {
      logout_confirmation: 'Are you sure you want to log out?',
      confirm: 'Confirm',
      logout: 'Logout',
      cancel: 'Cancel'
    },
    password: {
      forgot: {
        header: 'Request a new password',
        check_email: 'Please check your email to reset your password.',
        email: '@:auth.labels.email'
      },
      reset: {
        header: 'Reset your password',
        success:
          'Your password has been reset. You can now login with the new password.'
      }
    },
    users: {
      labels: {
        email: 'Email',
        name: 'Name'
      },
      verify: {
        label: 'Verify',
        message: 'Are you sure you want to verify {user}?'
      },
      edit: 'Edit'
    },
    validations: {
      required: 'Field is required.',
      password_length: 'The minimum length of the password is {length} characters.',
      password_match: 'Passwords do not match.',
      email: 'A valid email address is required.'
    }
  }
}
