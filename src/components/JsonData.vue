<template lang="html">
  <div class="json-data-container">
    <div class="json-data-toggle">
      <a href="#" @click="showJson = !showJson">JSON Data</a>
    </div>

    <div v-if="showJson" class="api-call">
      API call with <a href="https://httpie.org" target="_blanke">httpie</a>:

      <pre>{{apiCall}}</pre>
    </div>

    <pre v-if="showJson" class="json-data" v-html="jsonData">
    </pre>
  </div>
</template>

<script>
import u from '@/util'
import Api from '@/services/api'
import session from '@/services/session'

export default {
  props: ['jsonData', 'jsonUrl', 'published'],
  data () {
    return {
      showJson: false
    }
  },
  computed: {
    apiCall () {
      const apiKey = u.getIn(session.get(), 'space.apiKey')
      return Api.httpie(this.jsonUrl, {apiKey, published: this.published})
    }
  }
}
</script>

<style lang="css">
  .json-data {
    margin-top: 10px;
  }

  .api-call {
    margin-top: 10px;
  }
</style>
