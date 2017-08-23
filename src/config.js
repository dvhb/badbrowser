/**
 * Web app configuration
 *
 * Configuration thats imported into the bundle based
 * on the target environment by the app's config-loader
 *
 * From a client-side javascript file you can pull this
 * configuration in with:
 *
 *   var config = require('webpack-config-loader!../config.js');
 *
 * And access the appropriate nodes via:
 *
 *   console.log(config.apiBaseUrl);
 */
module.exports = {
    development: {
        appEnv: 'development',
    },
    staging: {
        appEnv: 'staging',
    },
    production: {
        appEnv: 'production',
    }
};
