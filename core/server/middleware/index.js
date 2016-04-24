var bodyParser       = require('body-parser'),
    config           = require('../config'),
    errors           = require('../errors'),
    express          = require('express'),
    logger           = require('morgan'),
    path             = require('path'),
    routes           = require('../routes'),
    utils            = require('../utils'),
    busboy           = require('./busboy'),
    cacheControl     = require('./cache-control'),
    decideIsAdmin    = require('./is-admin'),
    privateBlogging  = require('./private-blogging'),
    serveSharedFile  = require('./serve-shared-file'),
    spamPrevention   = require('./spam-prevention'),
    staticTheme      = require('./static-theme'),
    uncapitalise     = require('./uncapitalise'),
    middleware,
    setupMiddleware;



middleware = {
    busboy: busboy,
    cacheControl: cacheControl,
    spamPrevention: spamPrevention,
    privateBlogging: privateBlogging
};

setupMiddleware  = function setupMiddleware(App) {

    var logging  = config.logging,
        corePath = config.paths.corePath;

    // Make sure 'req.secure' is valid for proxied requests
    // (X-Forwarded-Proto header will be checked, if present)
    App.enable('trust proxy');

    // Logging configuration
    if (logging !== false) {
        if (App.get('env') !== 'development') {
            App.use(logger('combined', logging));
        } else {
            App.use(logger('dev', logging));
        }
    }

    // Favicon
    App.use(serveSharedFile('favicon.ico', 'image/x-icon', utils.ONE_DAY_S));


    // Static assets
    // App.use('/shared', express.static(path.join(corePath, '/shared'), {maxAge: utils.ONE_YEAR_S}));


	App.use('/js',express.static(path.join(corePath,'/server/views/js')));
	App.use('/themes',express.static(path.join(corePath,'/server/views/themes')));
	App.use('/img',express.static(path.join(corePath,'/server/views/img')));
	App.use('/uploadify',express.static(path.join(corePath,'/server/views/uploadify')));
	App.use('/xheditor',express.static(path.join(corePath,'/server/views/xheditor')));
	App.use('/common', express.static(path.join(corePath, '/server/views/viewFiles/static')));
	App.use('/shared', express.static(path.join(corePath, '/shared')));
	//
    // //First determine whether we're serving admin
    //App.use(decideIsAdmin);
	//
    //// Theme only config
    //App.use(staticTheme());
	//
    //// Check if password protected app
    //App.use(privateBlogging.checkIsPrivate); // check if the app is protected
    //App.use(privateBlogging.filterPrivateRoutes);

    //App.use(uncapitalise);

    // Body parsing
    App.use(bodyParser.json({limit: '1mb'}));
    App.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));

    // ### Caching

    App.use(cacheControl('public'));

    App.use(routes.apiBaseUri, cacheControl('private'));


    // ### Routing
    // Set up API routes
    App.use(routes.apiBaseUri, routes.api());

    // Set up Frontend routes
    App.use(routes.frontend());

    // ### Error handling
    // 404 Handler
    App.use(errors.error404);

    // 500 Handler
    App.use(errors.error500);
};

module.exports = setupMiddleware;

module.exports.middleware = middleware;
