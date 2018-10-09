# Versioned Admin UI

This is the Versioned admin web UI that talks to the [Versioned REST API](https://github.com/versioned/versioned-api).

## Documentation

Documentation is available at [versioned-doc](https://github.com/versioned/versioned-doc)

## Hosted/Managed Service

A hosted and managed version of this UI is available at [versioned.io](http://versioned.io)

## Starting the Development Server

```
yarn install
yarn run dev
open http://localhost:8080
```

To create a production build, run `yarn build`

## Heroku Deploy

```
heroku config:set VUE_APP_API_URL=https://name-of-versioned-api-app.herokuapp.com/v1
```

## Unit Tests

Running:

```
yarn test:unit --watch
```

See [@vue/cli-plugin-unit-jest](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest)

## End-to-End/Integration Tests

The dedicated_space.js spec requires these environment variables:

```
  CYPRESS_MONGODB_URL
  CYPRESS_ALGOLIASEARCH_APPLICATION_ID
  CYPRESS_ALGOLIASEARCH_API_KEY
```

Running in the browser (all specs or single spec):

```
yarn test:e2e
```

Running headless:

```
yarn test:e2e --headless
```

Running single spec headless:

```
yarn test:e2e --headless --spec tests/e2e/specs/dedicated_space.js
```
