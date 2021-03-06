<template lang="html">
  <div>
    <div class="page-title">
      <h1>Models</h1>
    </div>

    <div class="row">
      <div class="create-new">
        <router-link v-if="canCreateModel()" class="btn btn-primary new-model" :to="createUrl()">
          New Model
        </router-link>
      </div>
    </div>

    <div class="rows-count" v-if="count === 0 && !$store.state.loading">
      No models created yet
    </div>

    <div class="rows-count" v-if="count && count > 20">
      Number of models: {{count}}
    </div>

    <div class="row">
      <table v-if="models.length > 0" class="table table-striped">
        <thead>
          <tr>
            <th>Model</th>
            <th>Data</th>
            <th>Fields</th>
            <th>Relationships</th>
            <th>Updated</th>
            <th>By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in models" :class="modelRowClass(model)">
            <td>
              <router-link v-if="canUpdateModel()" :to="editUrl(model)" class="models-edit">
                {{model.name}}
              </router-link>
            </td>
            <td>
              <router-link :to="dataUrl(model)" class="data-list">
                {{model.name}} Data
                <template v-if="documentCount(model)">
                  <span>({{documentCount(model)}})</span>
                </template>
                <span v-if="model.external">(external)</span>
              </router-link>
              <br/>
              <router-link v-if="canCreate(model)" :to="createDataUrl(model)" class="new-data">+ New</router-link>
            </td>
            <td class="fields">
              {{fields(model).join(', ')}}
            </td>
            <td class="relationships">
              {{relationships(model).join(', ')}}
            </td>
            <td>
              {{model.updatedAt | date('YYYY-MM-DD hh:mm') }}<br />
              ({{model.updatedAt | timeAgo}})
            </td>
            <td>
              {{model.updatedBy.email}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import u from '@/util'
import {propertiesOrder} from '@/models_util'
// import router from '@/router'
import session from '@/services/session'
import Model from '@/services/model'
import DbStats from '@/services/db_stats'
import {capitalize} from '@/client_util'

export default {
  data () {
    return {
      models: [],
      dbStats: {}
    }
  },
  created () {
    this.getModels()
  },
  watch: {
    '$route': 'getModels'
  },
  computed: {
    count () {
      return this.models ? this.models.length : null
    }
  },
  methods: {
    getModels () {
      const spaceId = u.getIn(session.get(), 'space.id')
      Model(spaceId).list().then(({data}) => {
        this.models = data.filter(m => !m.external).concat(data.filter(m => m.external))
        DbStats(spaceId).get().then((data) => {
          this.dbStats = data
        })
      })
    },
    editUrl (model) {
      return `/models/${model.id}/edit`
    },
    createUrl () {
      return `/models/new`
    },
    dataUrl (model) {
      return `/data/${model.coll}`
    },
    createDataUrl (model) {
      return `/data/${model.coll}/new`
    },
    canCreateModel () {
      // TODO: check if user can create model
      return true
    },
    canUpdateModel () {
      // TODO :check if user can update model
      return true
    },
    canCreate (model) {
      return !model.external
    },
    fieldName (model, property) {
      const fieldPath = `model.schema.properties.${property}.x-meta.field`
      return u.getIn(model, `${fieldPath}.name`) || capitalize(property)
    },
    fields (model) {
      return propertiesOrder(u.getIn(model, 'model.schema'))
        .filter(p => !this.isRelationship(model, p))
        .map(p => this.fieldName(model, p))
    },
    relationships (model) {
      return propertiesOrder(u.getIn(model, 'model.schema'))
        .filter(p => this.isRelationship(model, p))
        .map(p => this.fieldName(model, p))
    },
    isRelationship (model, property) {
      return u.getIn(model, `model.schema.properties.${property}.x-meta.relationship`)
    },
    documentCount (model) {
      return u.getIn(this.dbStats, `${model.coll}.count`)
    },
    modelRowClass (model) {
      return `models-row ${model.coll}`
    }
  }
}
</script>

<style lang="css">
  div.rows-count {
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
