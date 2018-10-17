/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'pilas-engine-bloques',
    environment: environment,
    baseURL: '/',
    versionURL: 'http://pilasbloques.programar.gob.ar/version.json',
    downloadURL: 'http://hugoruscitti.github.io/pilas-engine-bloques/descargas/pilas-engine-bloques-VERSION.zip',
    locationType: 'hash',
    versionURL: 'https://api.github.com/repos/Program-AR/pilas-bloques/releases/latest',
    backendURL: null,
    consultarVersion: false,
    googleAnalyticsEnabled: false,
    linkDeDescarga: 'http://pilasbloques.program.ar/',
    EmberENV: {
      EXTEND_PROTOTYPES: {
        Date: false,
        Array: true,
      },
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };


  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    //ENV['backendURL'] = 'http://0.0.0.0:5000';
    ENV['backendURL'] = 'http://api.pilasbloques-staging.sadosky.net:8000';
    
    ENV['ember-cli-mirage'] = {
      enabled: true
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.consultarVersion = false;

    ENV['backendURL'] = 'http://testing-pilas-bloques-api.enjambrelab.com.ar';

    ENV['ember-cli-mirage'] = {
      enabled: true
    };

  }

  if (environment === 'web') {
    ENV['ember-cli-mirage'] = {
      enabled: true
    };

    ENV['backendURL'] = 'http://api.pilasbloques.program.ar';

    ENV['googleAnalyticsEnabled'] = true;
  }

  ENV.contentSecurityPolicy = {
    'style-src': "'self' 'unsafe-inline'",
    'connect-src': "'self' http://pilasbloques-staging.sadosky.net:5001"
  };


  ENV.ocultar_seccion_libros = true;

  return ENV;
};
