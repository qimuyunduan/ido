var bodyParser       = require('body-parser'),
    config           = require('../config'),
    errors           = require('../errors'),
    express          = require('express'),
    logger           = require('morgan'),
    path             = require('path'),
    routes           = require('../routes'),
    utils            = require('../utils'),
    busboy           = require('./busboy'),
	uploadify        = require('uploadify'),
	multerConfig     = require('../api').uploads,
    cacheControl     = require('./cache-control'),
	uuid             = require('node-uuid'),
	helmet           = require('helmet'),
    serveSharedFile  = require('./serve-shared-file'),
    spamPrevention   = require('./spam-prevention'),
    uncapitalise     = require('./uncapitalise'),
	cookieParser     = require('cookie-parser'),
	session          = require('express-session'),
	sessionStore     = require('connect-redis')(session),
	client           = require('redis').createClient(),
    middleware,
    setupMiddleware;



middleware = {
    busboy: busboy,
    cacheControl: cacheControl,
    spamPrevention: spamPrevention

};

setupMiddleware  = function setupMiddleware(App) {

    var logging  = config.logging,
		contentPath = config.paths.contentPath,
        corePath = config.paths.corePath;

	sessionSecret = uuid.v4()+uuid.v1()+uuid.v4();

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

	// Body parsing
	App.use(bodyParser.json({limit: '1mb'}));
	App.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));

	// ### cookie and session

	App.use(cookieParser());

	App.use(session({
		//name:'idoConnectSessId',
		//store:new sessionStore( {
		//	host: 'localhost',
		//	port: 6379,
		//	client: client,
		//	ttl : 60
		//}),
		secret: sessionSecret,
		resave:true,
		saveUninitialized:true
	}));

	App.use(helmet());

	// process file upload
	uploadify(App,{
		path:'/uploads',
		fileKey:'myFile',
		multer:multerConfig
	});

    // Favicon
    App.use(serveSharedFile('favicon.ico', 'image/x-icon', utils.ONE_DAY_S));

	App.use('/js',express.static(path.join(corePath,'/server/views/js')));
	App.use('/css',express.static(path.join(corePath,'/server/views/css')));
	App.use('/themes',express.static(path.join(corePath,'/server/views/themes')));
	App.use('/img',express.static(path.join(corePath,'/server/views/img')));
	App.use('/uploadify',express.static(path.join(corePath,'/server/views/uploadify')));
	App.use('/common', express.static(path.join(corePath, '/server/views/static')));
	App.use('/shared', express.static(path.join(corePath, '/shared')));
	App.use('/res', express.static(contentPath));
	App.use('/res/data', express.static(path.join(contentPath, '/data')));
	App.use('/res/images', express.static(path.join(contentPath, '/images')));

    App.use(uncapitalise);





    // ### Caching

    App.use(cacheControl('public'));

    App.use(routes.apiBaseUri, cacheControl('private'));


    // ### Routing
    // Set up API routes
    App.use(routes.apiBaseUri, routes.api());

    // Set up Frontend routes
    App.use(routes.frontend());


};

module.exports.setupMiddleware = setupMiddleware;

module.exports.middleware = middleware;
