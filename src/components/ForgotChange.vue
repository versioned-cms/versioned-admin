<template lang="html">
  <section class="forgot-password-page">
    <div class="page-title">
      <h1>Forgot Password</h1>
    </div>

    <p>
      Please enter a new password for {{email}}:
    </p>

    <form class="login-form" @submit.prevent="save">
      <div class="form-group">
        <label for="password">New Password</label>
        <input type="password" v-model="password" class="form-control" id="password" v-autofocus required/>
      </div>

      <input type="submit" class="btn btn-primary" value="Save" />
    </form>
  </section>
</template>

<script>
import User from '@/services/user'
import Alert from '@/services/alert'
import router from '@/router'

export default {
  data: () => {
    return {
      email: null,
      password: null,
      message: null
    }
  },
  created () {
    this.email = this.$route.query.email
  },
  methods: {
    save () {
      const {email, token} = this.$route.query
      User.forgotChange(email, token, this.password)
        .then(() => {
          Alert.setNext('Password changed. You can now log in with your new password')
          router.push(`/login?email=${email}`)
        })
        .catch(() => {
          Alert.set('warning', 'Could not change password')
        })
    }
  }
}
</script>

<style lang="css">
</style>
