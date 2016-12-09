// Karma configuration
// Generated on Fri Apr 18 2014 18:19:03 GMT+0100 (BST)

const path = require('path');

module.exports = function (karma) {

	const config = {

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

		// list of files / patterns to load in the browser
		files: [
			{pattern: 'test/helpers.js', served: true},
			'test/utils/*.spec.js',
			'test/setup.js',
			'test/caches/*.spec.js',
			{pattern: 'test/sw/*.js', served: true, included: false},
			{pattern: 'test/fixtures/files/*', served: true, included: false},
			{pattern: 'test/**/*.js.map', served: true, included: false},
		],
		proxies: {
			'/integration-sw.js': '/base/test/sw/integration.js',
			'/files': '/base/test/fixtures/files'
		},

		preprocessors: {
			'test/helpers.js': ['webpack', 'sourcemap'],
			'test/setup.js': ['webpack', 'sourcemap'],
			'test/**/*.spec.js': ['webpack', 'sourcemap'],
			'test/sw/*.js': ['webpack', 'sourcemap']
		},
		webpack: {
			devtool: 'source-map',
			module: {
				loaders: [
					{
						test: /\.js$/,
						loader: 'babel',
						exclude: [
							path.resolve('./node_modules')
						],
						query: {
							cacheDirectory: true,
							// on latest chrome (installed in dev) on need for this
							presets: ['es2015'],//process.env.CIRCLE_BUILD_NUM ? ['es2015'] : [],
							plugins: [
								['add-module-exports', {loose: true}],
								['transform-es2015-classes', { loose: true }],
								['transform-es2015-modules-commonjs', {loose: true}]
							]
						}
					},
					{
						test: /indexeddb-promised\.js$/,
						loader: require.resolve('imports-loader'),
						query: 'window=>self'
					},
					{
						test: /\.json$/,
						loader: require.resolve('json-loader')
					}
				]
			},
			resolve: {
				root: [
					path.join(__dirname, 'node_modules')
				]
			}
		},
		reporters: ['progress'],
		port: 9876,
		colors: true,
		// possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
		logLevel: karma.LOG_INFO,
		autoWatch: false,
		browsers: ['Chrome'],
		plugins: [
			require('karma-mocha'),
			require('karma-chai'),
			require('karma-sinon'),
			require('karma-sinon-chai'),
			require('karma-sourcemap-loader'),
			require('karma-webpack'),
			require('karma-chrome-launcher'),
			require('karma-firefox-launcher'),
			require('karma-sauce-launcher'),
			require('karma-html-reporter')
		],
		client: {
				mocha: {
						reporter: 'html',
						ui: 'bdd',
						timeout: 5000
				}
		},
		singleRun: true
	};

	if (process.env.CI) {
		const nightwatchBrowsers = require('@financial-times/n-heroku-tools/config/nightwatch').test_settings;
		const whitelistedBrowsers = ['firefox','chrome'];
		const sauceBrowsers = Object.keys(nightwatchBrowsers).reduce((browserList, browserName) => {
			if (browserName === 'default' || whitelistedBrowsers.indexOf(browserName) === -1) {
				return browserList;
			}
			browserList[`${browserName}_sauce`] = Object.assign({base: 'SauceLabs'}, nightwatchBrowsers[browserName].desiredCapabilities);
			return browserList;
		}, {})
		config.customLaunchers = sauceBrowsers;
		config.sauceLabs = {
			testName: 'n-service-worker unit tests',
			username: process.env.SAUCE_USER,
			accessKey: process.env.SAUCE_KEY,
			recordScreenshots: true
		}

		config.browsers = Object.keys(sauceBrowsers);
		config.reporters.push('saucelabs');
	}

	karma.set(config);
};