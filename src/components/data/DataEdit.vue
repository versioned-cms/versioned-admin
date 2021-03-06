<template lang="html">
  <section v-if="doc">
    <div class="page-title">
        <h1>Edit {{model.name}}</h1>
    </div>

    <json-data :jsonData="jsonData" :jsonUrl="jsonUrl" :published="isPublished"></json-data>

    <data-form ref="dataForm" :doc="doc" :docOrig="docOrig" :schema="schema" :models="models" :model="model.coll" :isPublished="isPublished" :versions="versions" :previewUrl="model.previewUrl" @fieldChange="fieldChange($event)" @formSubmit="save($event)" @remove="remove($event)"></data-form>

    <div>
      <router-link :to="listUrl()">Return to {{model.name}} Data</router-link>
    </div>
  </section>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import router from '@/router'
import DataForm from '@/components/data/DataForm'
import Api from '@/services/api'
import Data from '@/services/data'
import Model from '@/services/model'
import Alert from '@/services/alert'
import JsonData from '@/components/JsonData'

export default {
  data: function () {
    return {
      jsonData: null,
      jsonUrl: null,
      id: null,
      model: null,
      models: [],
      isPublished: false,
      schema: null,
      doc: null,
      docOrig: null,
      versions: []
    }
  },
  computed: {
    canDelete: function () {
      // TODO
      return true
    }
  },
  components: {
    DataForm,
    JsonData
  },
  created () {
    this.getData()
  },
  watch: {
    '$route': 'getData'
  },
  methods: {
    getData () {
      this.id = this.$route.params.id
      const spaceId = u.getIn(session.get(), 'space.id')
      Model(spaceId).list().then(({data}) => {
        if (data.length > 0) {
          this.model = data.find(model => model.coll === this.$route.params.model)
          this.models = data
          this.isPublished = u.getIn(this.model, 'model.features', []).includes('published')
          this.schema = u.getIn(this.model, 'model.schema')
          const api = Data(this.model.coll)
          const params = {relationshipLevels: 1}
          this.jsonUrl = api.getUrl(this.id, params)
          if (this.isPublished) params.versions = 1
          const url = api.getUrl(this.id, params)
          Api.getRequest(url).then(doc => {
            const translatedProperties = u.keys(u.filter(this.schema.properties, (p) => u.getIn(p, 'x-meta.translated')))
            const translatedDoc = u.makeObj(translatedProperties, () => ({}))
            this.doc = u.merge(translatedDoc, doc)
            if (!this.docOrig) this.docOrig = JSON.parse(JSON.stringify(doc))
            this.versions = u.getIn(doc, 'sys.versions', [])
            this.jsonData = u.prettyJson(this.doc)
            setTimeout(() => window.scrollTo(0, 0), 10)
          }).catch(() => {
            Alert.set('warning', 'Could not find data')
          })
        } else {
          Alert.set('warning', `Could not find model ${this.$route.params.model}`)
        }
      })
    },
    fieldChange (field) {
      this.doc = u.merge(this.doc, field)
    },
    async save (doc) {
      Alert.clear()
      try {
        const updatedDoc = await Data(this.model.coll).update(doc)
        this.docOrig = null
        await this.getData()
        if (updatedDoc) {
          Alert.setBoth('success', 'Saved')
        } else {
          Alert.setBoth('warning', 'No Changes')
        }
      } catch (error) {
        this.$refs.dataForm.handleError(error)
      }
    },
    remove () {
      if (confirm('Are you sure?')) {
        Data(this.model.coll).remove(this.doc.id)
          .then(() => {
            Alert.setNext('Deleted')
            router.push(`/data/${this.model.coll}`)
          })
          .catch(error => {
            this.$refs.dataForm.handleError(error)
          })
      }
    },
    listUrl () {
      return `/data/${this.model.coll}`
    }
  }
}
</script>

<style lang="css">
  .versions {
    margin-top: 10px;
  }
</style>
