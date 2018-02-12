require("source-map-support").install();
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _regenerator = __webpack_require__(1);
  
  var _regenerator2 = _interopRequireDefault(_regenerator);
  
  var _toConsumableArray2 = __webpack_require__(2);
  
  var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
  
  var _set = __webpack_require__(3);
  
  var _set2 = _interopRequireDefault(_set);
  
  var _asyncToGenerator2 = __webpack_require__(4);
  
  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);
  
  __webpack_require__(5);
  
  var _path = __webpack_require__(6);
  
  var _path2 = _interopRequireDefault(_path);
  
  var _express = __webpack_require__(7);
  
  var _express2 = _interopRequireDefault(_express);
  
  var _cookieParser = __webpack_require__(8);
  
  var _cookieParser2 = _interopRequireDefault(_cookieParser);
  
  var _bodyParser = __webpack_require__(9);
  
  var _bodyParser2 = _interopRequireDefault(_bodyParser);
  
  var _expressJwt = __webpack_require__(10);
  
  var _expressJwt2 = _interopRequireDefault(_expressJwt);
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _server = __webpack_require__(12);
  
  var _server2 = _interopRequireDefault(_server);
  
  var _universalRouter = __webpack_require__(13);
  
  var _universalRouter2 = _interopRequireDefault(_universalRouter);
  
  var _prettyError = __webpack_require__(14);
  
  var _prettyError2 = _interopRequireDefault(_prettyError);
  
  var _Html = __webpack_require__(15);
  
  var _Html2 = _interopRequireDefault(_Html);
  
  var _ErrorPage = __webpack_require__(17);
  
  var _ErrorPage2 = __webpack_require__(19);
  
  var _ErrorPage3 = _interopRequireDefault(_ErrorPage2);
  
  var _routes = __webpack_require__(27);
  
  var _routes2 = _interopRequireDefault(_routes);
  
  var _assets = __webpack_require__(144);
  
  var _assets2 = _interopRequireDefault(_assets);
  
  var _config = __webpack_require__(16);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  // import expressGraphQL from 'express-graphql';
  // import jwt from 'jsonwebtoken';
  var app = (0, _express2.default)();
  
  //
  // Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
  // user agent is not known.
  // -----------------------------------------------------------------------------
  // eslint-disable-line import/no-unresolved
  
  // import passport from './core/passport';
  // import models from './data/models';
  // import schema from './data/schema';
  global.navigator = global.navigator || {};
  global.navigator.userAgent = global.navigator.userAgent || 'all';
  
  //
  // Register Node.js middleware
  // -----------------------------------------------------------------------------
  app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));
  app.use((0, _cookieParser2.default)());
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  app.use(_bodyParser2.default.json());
  
  //
  // Authentication
  // -----------------------------------------------------------------------------
  app.use((0, _expressJwt2.default)({
    secret: _config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: function getToken(req) {
      return req.cookies.id_token;
    }
  }));
  
  // app.use(passport.initialize());
  //
  // app.get('/login/facebook',
  //   passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
  // );
  // app.get('/login/facebook/return',
  //   passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  //   (req, res) => {
  //     const expiresIn = 60 * 60 * 24 * 180; // 180 days
  //     const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
  //     res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
  //     res.redirect('/');
  //   }
  // );
  
  //
  // Register API middleware
  // -----------------------------------------------------------------------------
  // app.use('/graphql', expressGraphQL(req => ({
  //   schema,
  //   graphiql: true,
  //   rootValue: { request: req },
  //   pretty: process.env.NODE_ENV !== 'production',
  // })));
  
  //
  // Register server-side rendering middleware
  // -----------------------------------------------------------------------------
  app.get('*', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
      var css, statusCode, data, html;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              css = new _set2.default();
              statusCode = 200;
              data = { title: '', description: '', style: '', script: _assets2.default.main.js, children: '' };
              _context.next = 6;
              return _universalRouter2.default.resolve(_routes2.default, {
                path: req.path,
                query: req.query,
                context: {
                  insertCss: function insertCss() {
                    for (var _len = arguments.length, styles = Array(_len), _key = 0; _key < _len; _key++) {
                      styles[_key] = arguments[_key];
                    }
  
                    styles.forEach(function (style) {
                      return css.add(style._getCss());
                    }); // eslint-disable-line no-underscore-dangle, max-len
                  },
                  setTitle: function setTitle(value) {
                    return data.title = value;
                  },
                  setMeta: function setMeta(key, value) {
                    return data[key] = value;
                  }
                },
                render: function render(component) {
                  var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  
                  // console.log('inside render of UniversalRouter', component);
                  css = new _set2.default();
                  statusCode = status;
                  data.children = _server2.default.renderToString(component);
                  data.style = [].concat((0, _toConsumableArray3.default)(css)).join('');
                  return true;
                }
              });
  
            case 6:
  
              // console.log('outside render func of UniversalRouter with statusCode', statusCode);
              html = _server2.default.renderToStaticMarkup(_react2.default.createElement(_Html2.default, data));
  
  
              res.status(statusCode);
              res.send('<!doctype html>' + html);
              _context.next = 14;
              break;
  
            case 11:
              _context.prev = 11;
              _context.t0 = _context['catch'](0);
  
              // console.log('some error occured', err);
              next(_context.t0);
  
            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 11]]);
    }));
  
    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
  
  //
  // Error handling
  // -----------------------------------------------------------------------------
  var pe = new _prettyError2.default();
  pe.skipNodeFiles();
  pe.skipPackage('express');
  
  app.use(function (err, req, res, next) {
    // eslint-disable-line no-unused-vars
    console.log(pe.render(err)); // eslint-disable-line no-console
    var statusCode = err.status || 500;
    var html = _server2.default.renderToStaticMarkup(_react2.default.createElement(
      _Html2.default,
      {
        title: 'Internal Server Error',
        description: err.message,
        style: _ErrorPage3.default._getCss() // eslint-disable-line no-underscore-dangle
      },
      _server2.default.renderToString(_react2.default.createElement(_ErrorPage.ErrorPageWithoutStyle, { error: err }))
    ));
    res.status(statusCode);
    res.send('<!doctype html>' + html);
  });
  
  app.listen(_config.port, function () {
    console.log('The server is running at http://localhost:' + _config.port + '/');
  });
  
  //
  // Launch the server
  // -----------------------------------------------------------------------------
  /* eslint-disable no-console */
  // models.sync().catch(err => console.error(err.stack)).then(() => {
  //   app.listen(port, () => {
  //     console.log(`The server is running at http://localhost:${port}/`);
  //   });
  // });
  /* eslint-enable no-console */

/***/ }),
/* 1 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/regenerator");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/helpers/toConsumableArray");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/set");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

  module.exports = require("babel-polyfill");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

  module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

  module.exports = require("express");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

  module.exports = require("cookie-parser");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

  module.exports = require("body-parser");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

  module.exports = require("express-jwt");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

  module.exports = require("react");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

  module.exports = require("react-dom/server");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

  module.exports = require("universal-router");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

  module.exports = require("pretty-error");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _config = __webpack_require__(16);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function Html(_ref) {
    var title = _ref.title,
        description = _ref.description,
        style = _ref.style,
        script = _ref.script,
        children = _ref.children;
  
    return _react2.default.createElement(
      'html',
      { className: 'no-js', lang: 'en' },
      _react2.default.createElement(
        'head',
        null,
        _react2.default.createElement('meta', { charSet: 'utf-8' }),
        _react2.default.createElement('meta', { httpEquiv: 'x-ua-compatible', content: 'ie=edge' }),
        _react2.default.createElement(
          'title',
          null,
          title
        ),
        _react2.default.createElement('meta', { name: 'description', content: description }),
        _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
        _react2.default.createElement('link', { rel: 'stylesheet', href: '/css/bootstrap.min.css' }),
        _react2.default.createElement('link', { rel: 'apple-touch-icon', href: 'apple-touch-icon.png' }),
        _react2.default.createElement('link', { rel: 'stylesheet', href: '/css/bootstrap-social.css' }),
        _react2.default.createElement('link', { rel: 'stylesheet', href: '/css/font-awesome.min.css' }),
        _react2.default.createElement('link', { rel: 'stylesheet', href: '/css/sb-admin.css' }),
        _react2.default.createElement('style', { id: 'css', dangerouslySetInnerHTML: { __html: style } })
      ),
      _react2.default.createElement(
        'body',
        null,
        _react2.default.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: children } }),
        script && _react2.default.createElement('script', { src: script }),
        _config.analytics.google.trackingId && _react2.default.createElement('script', {
          dangerouslySetInnerHTML: { __html: 'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' + ('ga(\'create\',\'' + _config.analytics.google.trackingId + '\',\'auto\');ga(\'send\',\'pageview\')') }
        }),
        _config.analytics.google.trackingId && _react2.default.createElement('script', { src: 'https://www.google-analytics.com/analytics.js', async: true, defer: true })
      )
    );
  }
  
  Html.propTypes = {
    title: _react.PropTypes.string.isRequired,
    description: _react.PropTypes.string.isRequired,
    style: _react.PropTypes.string.isRequired,
    script: _react.PropTypes.string,
    children: _react.PropTypes.string
  };
  
  exports.default = Html;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * React Starter Kit (https://www.reactstarterkit.com/)
   *
   * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  /* eslint-disable max-len */
  
  var port = exports.port = process.env.PORT || 3000;
  var host = exports.host = process.env.WEBSITE_HOSTNAME || 'localhost:' + port;
  
  var databaseUrl = exports.databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';
  
  var analytics = exports.analytics = {
  
    // https://analytics.google.com/
    google: {
      trackingId: process.env.GOOGLE_TRACKING_ID // UA-XXXXX-X
    }
  
  };
  
  var auth = exports.auth = {
  
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },
  
    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc'
    },
  
    // https://cloud.google.com/console/project
    google: {
      id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd'
    },
  
    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
      secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ'
    }
  
  };

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ErrorPageWithoutStyle = undefined;
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _withStyles = __webpack_require__(18);
  
  var _withStyles2 = _interopRequireDefault(_withStyles);
  
  var _ErrorPage = __webpack_require__(19);
  
  var _ErrorPage2 = _interopRequireDefault(_ErrorPage);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function ErrorPage(_ref, context) {
    var error = _ref.error;
  
    var title = 'Error';
    var content = 'Sorry, a critical error occurred on this page.';
    var errorMessage = null;
  
    if (error.status === 404) {
      title = 'Page Not Found';
      content = 'Sorry, the page you were trying to view does not exist.';
    } else if (true) {
      errorMessage = _react2.default.createElement(
        'pre',
        null,
        error.stack
      );
    }
  
    if (context.setTitle) {
      context.setTitle(title);
    }
  
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h1',
        null,
        title
      ),
      _react2.default.createElement(
        'p',
        null,
        content
      ),
      errorMessage
    );
  } /**
     * React Starter Kit (https://www.reactstarterkit.com/)
     *
     * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE.txt file in the root directory of this source tree.
     */
  
  ErrorPage.propTypes = { error: _react.PropTypes.object.isRequired };
  ErrorPage.contextTypes = { setTitle: _react.PropTypes.func.isRequired };
  
  exports.ErrorPageWithoutStyle = ErrorPage;
  exports.default = (0, _withStyles2.default)(_ErrorPage2.default)(ErrorPage);

/***/ }),
/* 18 */
/***/ (function(module, exports) {

  module.exports = require("isomorphic-style-loader/lib/withStyles");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(20);
      var insertCss = __webpack_require__(22);
  
      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }
  
      module.exports = content.locals || {};
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
    
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]_[local]_[hash:base64:3]\",\"minimize\":false}!../../../node_modules/postcss-loader/index.js?pack=default!./ErrorPage.css", function() {
          content = require("!!../../../node_modules/css-loader/index.js?{\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]_[local]_[hash:base64:3]\",\"minimize\":false}!../../../node_modules/postcss-loader/index.js?pack=default!./ErrorPage.css");
  
          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }
  
          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(21)();
  // imports
  
  
  // module
  exports.push([module.id, "/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n* {\n  line-height: 1.2;\n  margin: 0;\n}\n\nhtml {\n  color: #888;\n  display: table;\n  font-family: sans-serif;\n  height: 100%;\n  text-align: center;\n  width: 100%;\n}\n\nbody {\n  display: table-cell;\n  vertical-align: middle;\n  /* stylelint-disable */\n  margin: 2em auto;\n  /* stylelint-enable */\n}\n\nh1 {\n  color: #555;\n  font-size: 2em;\n  font-weight: 400;\n}\n\np {\n  margin: 0 auto;\n  width: 280px;\n}\n\npre {\n  text-align: left;\n  margin-top: 32px;\n  margin-top: 2rem;\n}\n\n@media only screen and (max-width: 280px) {\n  body,\n  p {\n    width: 95%;\n  }\n\n  h1 {\n    font-size: 1.5em;\n    margin: 0 0 0.3em;\n  }\n}\n", "", {"version":3,"sources":["/./routes/error/ErrorPage.css"],"names":[],"mappings":"AAAA;;;;;;;GAOG;;AAEH;EACE,iBAAiB;EACjB,UAAU;CACX;;AAED;EACE,YAAY;EACZ,eAAe;EACf,wBAAwB;EACxB,aAAa;EACb,mBAAmB;EACnB,YAAY;CACb;;AAED;EACE,oBAAoB;EACpB,uBAAuB;EACvB,uBAAuB;EACvB,iBAAiB;EACjB,sBAAsB;CACvB;;AAED;EACE,YAAY;EACZ,eAAe;EACf,iBAAiB;CAClB;;AAED;EACE,eAAe;EACf,aAAa;CACd;;AAED;EACE,iBAAiB;EACjB,iBAAiB;EAAjB,iBAAiB;CAClB;;AAED;EACE;;IAEE,WAAW;GACZ;;EAED;IACE,iBAAiB;IACjB,kBAAkB;GACnB;CACF","file":"ErrorPage.css","sourcesContent":["/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n* {\n  line-height: 1.2;\n  margin: 0;\n}\n\nhtml {\n  color: #888;\n  display: table;\n  font-family: sans-serif;\n  height: 100%;\n  text-align: center;\n  width: 100%;\n}\n\nbody {\n  display: table-cell;\n  vertical-align: middle;\n  /* stylelint-disable */\n  margin: 2em auto;\n  /* stylelint-enable */\n}\n\nh1 {\n  color: #555;\n  font-size: 2em;\n  font-weight: 400;\n}\n\np {\n  margin: 0 auto;\n  width: 280px;\n}\n\npre {\n  text-align: left;\n  margin-top: 2rem;\n}\n\n@media only screen and (max-width: 280px) {\n  body,\n  p {\n    width: 95%;\n  }\n\n  h1 {\n    font-size: 1.5em;\n    margin: 0 0 0.3em;\n  }\n}\n"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ }),
/* 21 */
/***/ (function(module, exports) {

  /*
  	MIT License http://www.opensource.org/licenses/mit-license.php
  	Author Tobias Koppers @sokra
  */
  // css base code, injected by the css-loader
  module.exports = function() {
  	var list = [];
  
  	// return the list of modules as css string
  	list.toString = function toString() {
  		var result = [];
  		for(var i = 0; i < this.length; i++) {
  			var item = this[i];
  			if(item[2]) {
  				result.push("@media " + item[2] + "{" + item[1] + "}");
  			} else {
  				result.push(item[1]);
  			}
  		}
  		return result.join("");
  	};
  
  	// import a list of modules into the list
  	list.i = function(modules, mediaQuery) {
  		if(typeof modules === "string")
  			modules = [[null, modules, ""]];
  		var alreadyImportedModules = {};
  		for(var i = 0; i < this.length; i++) {
  			var id = this[i][0];
  			if(typeof id === "number")
  				alreadyImportedModules[id] = true;
  		}
  		for(i = 0; i < modules.length; i++) {
  			var item = modules[i];
  			// skip already imported module
  			// this implementation is not 100% perfect for weird media query combinations
  			//  when a module is imported multiple times with different media queries.
  			//  I hope this will never occur (Hey this way we have smaller bundles)
  			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
  				if(mediaQuery && !item[2]) {
  					item[2] = mediaQuery;
  				} else if(mediaQuery) {
  					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
  				}
  				list.push(item);
  			}
  		}
  	};
  	return list;
  };


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault(_assign);
  
  var _stringify = __webpack_require__(24);
  
  var _stringify2 = _interopRequireDefault(_stringify);
  
  var _slicedToArray2 = __webpack_require__(25);
  
  var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);
  
  var _getIterator2 = __webpack_require__(26);
  
  var _getIterator3 = _interopRequireDefault(_getIterator2);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  /**
   * Isomorphic CSS style loader for Webpack
   *
   * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  var prefix = 's';
  var inserted = {};
  
  // Base64 encoding and decoding - The "Unicode Problem"
  // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
  function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }
  
  /**
   * Remove style/link elements for specified node IDs
   * if they are no longer referenced by UI components.
   */
  function removeCss(ids) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
  
    try {
      for (var _iterator = (0, _getIterator3.default)(ids), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var id = _step.value;
  
        if (--inserted[id] <= 0) {
          var elem = document.getElementById(prefix + id);
          if (elem) {
            elem.parentNode.removeChild(elem);
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  
  /**
   * Example:
   *   // Insert CSS styles object generated by `css-loader` into DOM
   *   var removeCss = insertCss([[1, 'body { color: red; }']]);
   *
   *   // Remove it from the DOM
   *   removeCss();
   */
  function insertCss(styles, options) {
    var _Object$assign = (0, _assign2.default)({
      replace: false,
      prepend: false
    }, options);
  
    var replace = _Object$assign.replace;
    var prepend = _Object$assign.prepend;
  
  
    var ids = [];
    for (var i = 0; i < styles.length; i++) {
      var _styles$i = (0, _slicedToArray3.default)(styles[i], 4);
  
      var moduleId = _styles$i[0];
      var css = _styles$i[1];
      var media = _styles$i[2];
      var sourceMap = _styles$i[3];
  
      var id = moduleId + '-' + i;
  
      ids.push(id);
  
      if (inserted[id]) {
        if (!replace) {
          inserted[id]++;
          continue;
        }
      }
  
      inserted[id] = 1;
  
      var elem = document.getElementById(prefix + id);
      var create = false;
  
      if (!elem) {
        create = true;
  
        elem = document.createElement('style');
        elem.setAttribute('type', 'text/css');
        elem.id = prefix + id;
  
        if (media) {
          elem.setAttribute('media', media);
        }
      }
  
      var cssText = css;
      if (sourceMap) {
        cssText += '\n/*# sourceMappingURL=data:application/json;base64,' + b64EncodeUnicode((0, _stringify2.default)(sourceMap)) + '*/';
        cssText += '\n/*# sourceURL=' + sourceMap.file + '*/';
      }
  
      if ('textContent' in elem) {
        elem.textContent = cssText;
      } else {
        elem.styleSheet.cssText = cssText;
      }
  
      if (create) {
        if (prepend) {
          document.head.insertBefore(elem, document.head.childNodes[0]);
        } else {
          document.head.appendChild(elem);
        }
      }
    }
  
    return removeCss.bind(null, ids);
  }
  
  module.exports = insertCss;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/object/assign");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/get-iterator");

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _regenerator = __webpack_require__(1);
  
  var _regenerator2 = _interopRequireDefault(_regenerator);
  
  var _asyncToGenerator2 = __webpack_require__(4);
  
  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _App = __webpack_require__(28);
  
  var _App2 = _interopRequireDefault(_App);
  
  var _home = __webpack_require__(48);
  
  var _home2 = _interopRequireDefault(_home);
  
  var _Header = __webpack_require__(37);
  
  var _Header2 = _interopRequireDefault(_Header);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  // Child routes
  /**
   * React Starter Kit (https://www.reactstarterkit.com/)
   *
   * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  exports.default = [{
    path: '/',
  
    // keep in mind, routes are evaluated in order
    children: [_home2.default],
  
    action: function action(_ref) {
      var _this = this;
  
      var next = _ref.next,
          render = _ref.render,
          context = _ref.context;
      return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var component;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return next();
  
              case 2:
                component = _context.sent;
  
                if (!(component === undefined)) {
                  _context.next = 5;
                  break;
                }
  
                return _context.abrupt('return', component);
  
              case 5:
                return _context.abrupt('return', render(_react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(_Header2.default, null),
                  _react2.default.createElement(
                    'div',
                    { id: 'page-wrapper', className: 'page-wrapper' },
                    _react2.default.createElement(
                      _App2.default,
                      { context: context },
                      component
                    )
                  )
                )));
  
              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    }
  }];

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
  
  var _classCallCheck2 = __webpack_require__(30);
  
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  
  var _createClass2 = __webpack_require__(31);
  
  var _createClass3 = _interopRequireDefault(_createClass2);
  
  var _possibleConstructorReturn2 = __webpack_require__(32);
  
  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
  
  var _inherits2 = __webpack_require__(33);
  
  var _inherits3 = _interopRequireDefault(_inherits2);
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _emptyFunction = __webpack_require__(34);
  
  var _emptyFunction2 = _interopRequireDefault(_emptyFunction);
  
  var _App = __webpack_require__(35);
  
  var _App2 = _interopRequireDefault(_App);
  
  var _Header = __webpack_require__(37);
  
  var _Header2 = _interopRequireDefault(_Header);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  // import Feedback from '../Feedback';
  // import Footer from '../Footer';
  
  /**
   * React Starter Kit (https://www.reactstarterkit.com/)
   *
   * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  var App = function (_Component) {
    (0, _inherits3.default)(App, _Component);
  
    function App() {
      (0, _classCallCheck3.default)(this, App);
      return (0, _possibleConstructorReturn3.default)(this, (App.__proto__ || (0, _getPrototypeOf2.default)(App)).apply(this, arguments));
    }
  
    (0, _createClass3.default)(App, [{
      key: 'getChildContext',
      value: function getChildContext() {
        var context = this.props.context;
        return {
          insertCss: context.insertCss || _emptyFunction2.default,
          setTitle: context.setTitle || _emptyFunction2.default,
          setMeta: context.setMeta || _emptyFunction2.default
        };
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var insertCss = this.props.context.insertCss;
  
        this.removeCss = insertCss(_App2.default);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
  
        this.removeCss();
      }
    }, {
      key: 'render',
      value: function render() {
        // console.log('\n********\n', this.props, '\n********12334\n');
        return this.props.children;
      }
    }]);
    return App;
  }(_react.Component);
  
  App.propTypes = {
    context: _react.PropTypes.shape({
      insertCss: _react.PropTypes.func,
      setTitle: _react.PropTypes.func,
      setMeta: _react.PropTypes.func
    }),
    children: _react.PropTypes.element.isRequired,
    error: _react.PropTypes.object
  };
  App.childContextTypes = {
    insertCss: _react.PropTypes.func.isRequired,
    setTitle: _react.PropTypes.func.isRequired,
    setMeta: _react.PropTypes.func.isRequired
  };
  exports.default = App;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/helpers/createClass");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/helpers/inherits");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

  module.exports = require("fbjs/lib/emptyFunction");

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(36);
      var insertCss = __webpack_require__(22);
  
      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }
  
      module.exports = content.locals || {};
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
    
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]_[local]_[hash:base64:3]\",\"minimize\":false}!../../../node_modules/postcss-loader/index.js?pack=default!./App.css", function() {
          content = require("!!../../../node_modules/css-loader/index.js?{\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]_[local]_[hash:base64:3]\",\"minimize\":false}!../../../node_modules/postcss-loader/index.js?pack=default!./App.css");
  
          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }
  
          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(21)();
  // imports
  
  
  // module
  exports.push([module.id, "/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */\n\n/**\n * 1. Change the default font family in all browsers (opinionated).\n * 2. Correct the line height in all browsers.\n * 3. Prevent adjustments of font size after orientation changes in IE and iOS.\n */\n\nhtml {\n  font-family: sans-serif; /* 1 */\n  line-height: 1.15; /* 2 */\n  -ms-text-size-adjust: 100%; /* 3 */\n  -webkit-text-size-adjust: 100%; /* 3 */\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n * 2. Add the correct display in IE.\n */\n\narticle,\naside,\ndetails, /* 1 */\nfigcaption,\nfigure,\nfooter,\nheader,\nmain, /* 2 */\nmenu,\nnav,\nsection,\nsummary { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Add the correct display in IE 10-.\n * 1. Add the correct display in IE.\n */\n\ntemplate, /* 1 */\n[hidden] {\n  display: none;\n}\n\n/* Links\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * Remove the outline on focused links when they are also active or hovered\n * in all browsers (opinionated).\n */\n\na:active,\na:hover {\n  outline-width: 0;\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change font properties to `inherit` in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font: inherit; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Restore the font weight unset by the previous rule.\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Change the border, margin, and padding in all browsers (opinionated).\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on OS X.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * Correct the text style of placeholders in Chrome, Edge, and Safari.\n */\n\n::-webkit-input-placeholder {\n  color: inherit;\n  opacity: 0.54;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*! React Starter Kit | MIT License | https://www.reactstarterkit.com/ */\n\n/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n:root {\n  /*\n   * Typography\n   * ======================================================================== */\n\n  /*\n   * Layout\n   * ======================================================================== */\n\n  /*\n   * Media queries breakpoints\n   * ======================================================================== */  /* Extra small screen / phone */  /* Small screen / tablet */  /* Medium screen / desktop */ /* Large screen / wide desktop */\n}\n\n/*\n * Base styles\n * ========================================================================== */\n\nhtml {\n  color: #222;\n  font-size: 1em; /* ~16px; */\n  font-family: 'Segoe UI', 'HelveticaNeue-Light', sans-serif;\n  line-height: 1.375; /* ~22px */\n}\n\na {\n  color: #0074c2;\n}\n\n/*\n * Remove text-shadow in selection highlight:\n * https://twitter.com/miketaylr/status/12228805301\n *\n * These selection rule sets have to be separate.\n * Customize the background color to match your design.\n */\n\n::-moz-selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n::selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n/*\n * A better looking default horizontal rule\n */\n\nhr {\n  display: block;\n  height: 1px;\n  border: 0;\n  border-top: 1px solid #ccc;\n  margin: 1em 0;\n  padding: 0;\n}\n\n/*\n * Remove the gap between audio, canvas, iframes,\n * images, videos and the bottom of their containers:\n * https://github.com/h5bp/html5-boilerplate/issues/440\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n\n/*\n * Remove default fieldset styles.\n */\n\nfieldset {\n  border: 0;\n  margin: 0;\n  padding: 0;\n}\n\n/*\n * Allow only vertical resizing of textareas.\n */\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n * Browser upgrade prompt\n * ========================================================================== */\n\n.browserupgrade {\n  margin: 0.2em 0;\n  background: #ccc;\n  color: #000;\n  padding: 0.2em 0;\n}\n\n/*\n * Print styles\n * Inlined to avoid the additional HTTP request:\n * http://www.phpied.com/delay-loading-your-print-css/\n * ========================================================================== */\n\n@media print {\n  *,\n  *::before,\n  *::after {\n    background: transparent !important;\n    color: #000 !important; /* Black prints faster: http://www.sanbeiji.com/archives/953 */\n    -webkit-box-shadow: none !important;\n            box-shadow: none !important;\n    text-shadow: none !important;\n  }\n\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n\n  a[href]::after {\n    content: ' (' attr(href) ')';\n  }\n\n  abbr[title]::after {\n    content: ' (' attr(title) ')';\n  }\n\n  /*\n   * Don't show links that are fragment identifiers,\n   * or use the `javascript:` pseudo protocol\n   */\n\n  a[href^='#']::after,\n  a[href^='javascript:']::after {\n    content: '';\n  }\n\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid;\n  }\n\n  /*\n   * Printing Tables:\n   * http://css-discuss.incutio.com/wiki/Printing_Tables\n   */\n\n  thead {\n    display: table-header-group;\n  }\n\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n\n  img {\n    max-width: 100% !important;\n  }\n\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n}\n", "", {"version":3,"sources":["/./components/App/App.css","/../node_modules/normalize.css/normalize.css","/./components/variables.css"],"names":[],"mappings":"AAAA;;;;;;;GAOG;;ACPH,4EAA4E;;AAE5E;;;;GAIG;;AAEH;EACE,wBAAwB,CAAC,OAAO;EAChC,kBAAkB,CAAC,OAAO;EAC1B,2BAA2B,CAAC,OAAO;EACnC,+BAA+B,CAAC,OAAO;CACxC;;AAED;;GAEG;;AAEH;EACE,UAAU;CACX;;AAED;gFACgF;;AAEhF;;;;GAIG;;AAEH;;;;;;;;;;;UAWU,OAAO;EACf,eAAe;CAChB;;AAED;;GAEG;;AAEH;;;;EAIE,sBAAsB;CACvB;;AAED;;GAEG;;AAEH;EACE,cAAc;EACd,UAAU;CACX;;AAED;;GAEG;;AAEH;EACE,yBAAyB;CAC1B;;AAED;;;GAGG;;AAEH;;EAEE,cAAc;CACf;;AAED;gFACgF;;AAEhF;;;GAGG;;AAEH;EACE,8BAA8B,CAAC,OAAO;EACtC,sCAAsC,CAAC,OAAO;CAC/C;;AAED;;;GAGG;;AAEH;;EAEE,iBAAiB;CAClB;;AAED;gFACgF;;AAEhF;;;GAGG;;AAEH;EACE,oBAAoB,CAAC,OAAO;EAC5B,2BAA2B,CAAC,OAAO;EACnC,kCAAkC,CAAC,OAAO;CAC3C;;AAED;;GAEG;;AAEH;;EAEE,qBAAqB;CACtB;;AAED;;GAEG;;AAEH;;EAEE,oBAAoB;CACrB;;AAED;;GAEG;;AAEH;EACE,mBAAmB;CACpB;;AAED;;;GAGG;;AAEH;EACE,eAAe;EACf,iBAAiB;CAClB;;AAED;;GAEG;;AAEH;EACE,uBAAuB;EACvB,YAAY;CACb;;AAED;;GAEG;;AAEH;EACE,eAAe;CAChB;;AAED;;;GAGG;;AAEH;;EAEE,eAAe;EACf,eAAe;EACf,mBAAmB;EACnB,yBAAyB;CAC1B;;AAED;EACE,gBAAgB;CACjB;;AAED;EACE,YAAY;CACb;;AAED;gFACgF;;AAEhF;;GAEG;;AAEH;EACE,mBAAmB;CACpB;;AAED;;GAEG;;AAEH;EACE,iBAAiB;CAClB;;AAED;gFACgF;;AAEhF;;;GAGG;;AAEH;;;;EAIE,kCAAkC,CAAC,OAAO;EAC1C,eAAe,CAAC,OAAO;CACxB;;AAED;;GAEG;;AAEH;EACE,iBAAiB;CAClB;;AAED;;;GAGG;;AAEH;EACE,gCAAwB;UAAxB,wBAAwB,CAAC,OAAO;EAChC,UAAU,CAAC,OAAO;EAClB,kBAAkB,CAAC,OAAO;CAC3B;;AAED;gFACgF;;AAEhF;;;GAGG;;AAEH;;;;;EAKE,cAAc,CAAC,OAAO;EACtB,UAAU,CAAC,OAAO;CACnB;;AAED;;GAEG;;AAEH;EACE,kBAAkB;CACnB;;AAED;;;GAGG;;AAEH;QACQ,OAAO;EACb,kBAAkB;CACnB;;AAED;;;GAGG;;AAEH;SACS,OAAO;EACd,qBAAqB;CACtB;;AAED;;;;GAIG;;AAEH;;;;EAIE,2BAA2B,CAAC,OAAO;CACpC;;AAED;;GAEG;;AAEH;;;;EAIE,mBAAmB;EACnB,WAAW;CACZ;;AAED;;GAEG;;AAEH;;;;EAIE,+BAA+B;CAChC;;AAED;;GAEG;;AAEH;EACE,0BAA0B;EAC1B,cAAc;EACd,+BAA+B;CAChC;;AAED;;;;;GAKG;;AAEH;EACE,+BAAuB;UAAvB,uBAAuB,CAAC,OAAO;EAC/B,eAAe,CAAC,OAAO;EACvB,eAAe,CAAC,OAAO;EACvB,gBAAgB,CAAC,OAAO;EACxB,WAAW,CAAC,OAAO;EACnB,oBAAoB,CAAC,OAAO;CAC7B;;AAED;;GAEG;;AAEH;EACE,eAAe;CAChB;;AAED;;;GAGG;;AAEH;;EAEE,+BAAuB;UAAvB,uBAAuB,CAAC,OAAO;EAC/B,WAAW,CAAC,OAAO;CACpB;;AAED;;GAEG;;AAEH;;EAEE,aAAa;CACd;;AAED;;;GAGG;;AAEH;EACE,8BAA8B,CAAC,OAAO;EACtC,qBAAqB,CAAC,OAAO;CAC9B;;AAED;;GAEG;;AAEH;;EAEE,yBAAyB;CAC1B;;AAED;;GAEG;;AAEH;EACE,eAAe;EACf,cAAc;CACf;;AAED;;;GAGG;;AAEH;EACE,2BAA2B,CAAC,OAAO;EACnC,cAAc,CAAC,OAAO;CACvB;;AD1ZD,yEAAyE;;AEXzE;;;;;;;GAOG;;AAEH;EACE;;gFAE8E;;EAI9E;;gFAE8E;;EAI9E;;gFAE8E,EAErD,gCAAgC,EAChC,2BAA2B,EAC3B,6BAA6B,CAC7B,iCAAiC;CAC3D;;AFfD;;gFAEgF;;AAEhF;EACE,YAAY;EACZ,eAAe,CAAC,YAAY;EAC5B,2DAAqC;EACrC,mBAAmB,CAAC,WAAW;CAChC;;AAED;EACE,eAAe;CAChB;;AAED;;;;;;GAMG;;AAEH;EACE,oBAAoB;EACpB,kBAAkB;CACnB;;AAED;EACE,oBAAoB;EACpB,kBAAkB;CACnB;;AAED;;GAEG;;AAEH;EACE,eAAe;EACf,YAAY;EACZ,UAAU;EACV,2BAA2B;EAC3B,cAAc;EACd,WAAW;CACZ;;AAED;;;;GAIG;;AAEH;;;;;;EAME,uBAAuB;CACxB;;AAED;;GAEG;;AAEH;EACE,UAAU;EACV,UAAU;EACV,WAAW;CACZ;;AAED;;GAEG;;AAEH;EACE,iBAAiB;CAClB;;AAED;;gFAEgF;;AAEhF;EACE,gBAAgB;EAChB,iBAAiB;EACjB,YAAY;EACZ,iBAAiB;CAClB;;AAED;;;;gFAIgF;;AAEhF;EACE;;;IAGE,mCAAmC;IACnC,uBAAuB,CAAC,+DAA+D;IACvF,oCAA4B;YAA5B,4BAA4B;IAC5B,6BAA6B;GAC9B;;EAED;;IAEE,2BAA2B;GAC5B;;EAED;IACE,6BAA6B;GAC9B;;EAED;IACE,8BAA8B;GAC/B;;EAED;;;KAGG;;EAEH;;IAEE,YAAY;GACb;;EAED;;IAEE,uBAAuB;IACvB,yBAAyB;GAC1B;;EAED;;;KAGG;;EAEH;IACE,4BAA4B;GAC7B;;EAED;;IAEE,yBAAyB;GAC1B;;EAED;IACE,2BAA2B;GAC5B;;EAED;;;IAGE,WAAW;IACX,UAAU;GACX;;EAED;;IAEE,wBAAwB;GACzB;CACF","file":"App.css","sourcesContent":["/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n@import '../../../node_modules/normalize.css/normalize.css';\n\n/*! React Starter Kit | MIT License | https://www.reactstarterkit.com/ */\n\n@import '../variables.css';\n\n/*\n * Base styles\n * ========================================================================== */\n\nhtml {\n  color: #222;\n  font-size: 1em; /* ~16px; */\n  font-family: var(--font-family-base);\n  line-height: 1.375; /* ~22px */\n}\n\na {\n  color: #0074c2;\n}\n\n/*\n * Remove text-shadow in selection highlight:\n * https://twitter.com/miketaylr/status/12228805301\n *\n * These selection rule sets have to be separate.\n * Customize the background color to match your design.\n */\n\n::-moz-selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n::selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n/*\n * A better looking default horizontal rule\n */\n\nhr {\n  display: block;\n  height: 1px;\n  border: 0;\n  border-top: 1px solid #ccc;\n  margin: 1em 0;\n  padding: 0;\n}\n\n/*\n * Remove the gap between audio, canvas, iframes,\n * images, videos and the bottom of their containers:\n * https://github.com/h5bp/html5-boilerplate/issues/440\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n\n/*\n * Remove default fieldset styles.\n */\n\nfieldset {\n  border: 0;\n  margin: 0;\n  padding: 0;\n}\n\n/*\n * Allow only vertical resizing of textareas.\n */\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n * Browser upgrade prompt\n * ========================================================================== */\n\n:global(.browserupgrade) {\n  margin: 0.2em 0;\n  background: #ccc;\n  color: #000;\n  padding: 0.2em 0;\n}\n\n/*\n * Print styles\n * Inlined to avoid the additional HTTP request:\n * http://www.phpied.com/delay-loading-your-print-css/\n * ========================================================================== */\n\n@media print {\n  *,\n  *::before,\n  *::after {\n    background: transparent !important;\n    color: #000 !important; /* Black prints faster: http://www.sanbeiji.com/archives/953 */\n    box-shadow: none !important;\n    text-shadow: none !important;\n  }\n\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n\n  a[href]::after {\n    content: ' (' attr(href) ')';\n  }\n\n  abbr[title]::after {\n    content: ' (' attr(title) ')';\n  }\n\n  /*\n   * Don't show links that are fragment identifiers,\n   * or use the `javascript:` pseudo protocol\n   */\n\n  a[href^='#']::after,\n  a[href^='javascript:']::after {\n    content: '';\n  }\n\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid;\n  }\n\n  /*\n   * Printing Tables:\n   * http://css-discuss.incutio.com/wiki/Printing_Tables\n   */\n\n  thead {\n    display: table-header-group;\n  }\n\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n\n  img {\n    max-width: 100% !important;\n  }\n\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n}\n","/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */\n\n/**\n * 1. Change the default font family in all browsers (opinionated).\n * 2. Correct the line height in all browsers.\n * 3. Prevent adjustments of font size after orientation changes in IE and iOS.\n */\n\nhtml {\n  font-family: sans-serif; /* 1 */\n  line-height: 1.15; /* 2 */\n  -ms-text-size-adjust: 100%; /* 3 */\n  -webkit-text-size-adjust: 100%; /* 3 */\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n * 2. Add the correct display in IE.\n */\n\narticle,\naside,\ndetails, /* 1 */\nfigcaption,\nfigure,\nfooter,\nheader,\nmain, /* 2 */\nmenu,\nnav,\nsection,\nsummary { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Add the correct display in IE 10-.\n * 1. Add the correct display in IE.\n */\n\ntemplate, /* 1 */\n[hidden] {\n  display: none;\n}\n\n/* Links\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * Remove the outline on focused links when they are also active or hovered\n * in all browsers (opinionated).\n */\n\na:active,\na:hover {\n  outline-width: 0;\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change font properties to `inherit` in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font: inherit; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Restore the font weight unset by the previous rule.\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Change the border, margin, and padding in all browsers (opinionated).\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on OS X.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * Correct the text style of placeholders in Chrome, Edge, and Safari.\n */\n\n::-webkit-input-placeholder {\n  color: inherit;\n  opacity: 0.54;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n","/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n:root {\n  /*\n   * Typography\n   * ======================================================================== */\n\n  --font-family-base: 'Segoe UI', 'HelveticaNeue-Light', sans-serif;\n\n  /*\n   * Layout\n   * ======================================================================== */\n\n  --max-content-width: 1000px;\n\n  /*\n   * Media queries breakpoints\n   * ======================================================================== */\n\n  --screen-xs-min: 480px;  /* Extra small screen / phone */\n  --screen-sm-min: 768px;  /* Small screen / tablet */\n  --screen-md-min: 992px;  /* Medium screen / desktop */\n  --screen-lg-min: 1200px; /* Large screen / wide desktop */\n}\n"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _withStyles = __webpack_require__(18);
  
  var _withStyles2 = _interopRequireDefault(_withStyles);
  
  var _reactBootstrap = __webpack_require__(38);
  
  var _Navbar = __webpack_require__(39);
  
  var _Navbar2 = _interopRequireDefault(_Navbar);
  
  var _history = __webpack_require__(40);
  
  var _history2 = _interopRequireDefault(_history);
  
  var _jquery = __webpack_require__(44);
  
  var _jquery2 = _interopRequireDefault(_jquery);
  
  var _Sidebar = __webpack_require__(45);
  
  var _Sidebar2 = _interopRequireDefault(_Sidebar);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var logo = __webpack_require__(47); /**
                                     * React Starter Kit (https://www.reactstarterkit.com/)
                                     *
                                     * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                     *
                                     * This source code is licensed under the MIT license found in the
                                     * LICENSE.txt file in the root directory of this source tree.
                                     */
  
  function Header() {
    return _react2.default.createElement(
      'div',
      { id: 'wrapper', className: 'content' },
      _react2.default.createElement(
        _Navbar2.default,
        { fluid: true, style: { margin: 0 } },
        _react2.default.createElement(
          _Navbar.Brand,
          null,
          _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement('img', { src: logo, alt: 'Start React', title: 'Start React' }),
            _react2.default.createElement(
              'span',
              null,
              '\xA0SB Admin React - '
            ),
            _react2.default.createElement(
              'a',
              { href: 'http://startreact.com/', title: 'Start React', rel: 'home' },
              'StartReact.com'
            ),
            _react2.default.createElement(
              'button',
              { type: 'button', className: 'navbar-toggle', onClick: function onClick() {
                  toggleMenu();
                }, style: { position: 'absolute', right: 0, top: 0 } },
              _react2.default.createElement(
                'span',
                { className: 'sr-only' },
                'Toggle navigation'
              ),
              _react2.default.createElement('span', { className: 'icon-bar' }),
              _react2.default.createElement('span', { className: 'icon-bar' }),
              _react2.default.createElement('span', { className: 'icon-bar' })
            )
          )
        ),
        _react2.default.createElement(
          'ul',
          { className: 'nav navbar-top-links navbar-right' },
          _react2.default.createElement(
            _reactBootstrap.NavDropdown,
            { bsClass: 'dropdown', title: _react2.default.createElement(
                'span',
                null,
                _react2.default.createElement('i', { className: 'fa fa-envelope fa-fw' })
              ), id: 'navDropdown1' },
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { style: { width: 300 }, eventKey: '1' },
              _react2.default.createElement(
                'div',
                null,
                ' ',
                _react2.default.createElement(
                  'strong',
                  null,
                  'John Smith'
                ),
                ' ',
                _react2.default.createElement(
                  'span',
                  { className: 'pull-right text-muted' },
                  ' ',
                  _react2.default.createElement(
                    'em',
                    null,
                    'Yesterday'
                  ),
                  ' '
                ),
                ' '
              ),
              _react2.default.createElement(
                'div',
                null,
                ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...'
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '2' },
              _react2.default.createElement(
                'div',
                null,
                ' ',
                _react2.default.createElement(
                  'strong',
                  null,
                  'John Smith'
                ),
                ' ',
                _react2.default.createElement(
                  'span',
                  { className: 'pull-right text-muted' },
                  ' ',
                  _react2.default.createElement(
                    'em',
                    null,
                    'Yesterday'
                  ),
                  ' '
                ),
                ' '
              ),
              _react2.default.createElement(
                'div',
                null,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...'
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '3' },
              _react2.default.createElement(
                'div',
                null,
                ' ',
                _react2.default.createElement(
                  'strong',
                  null,
                  'John Smith'
                ),
                ' ',
                _react2.default.createElement(
                  'span',
                  { className: 'pull-right text-muted' },
                  ' ',
                  _react2.default.createElement(
                    'em',
                    null,
                    'Yesterday'
                  ),
                  ' '
                ),
                ' '
              ),
              _react2.default.createElement(
                'div',
                null,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...'
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '4', className: 'text-center' },
              _react2.default.createElement(
                'strong',
                null,
                'Read All Messages'
              ),
              ' ',
              _react2.default.createElement('i', { className: 'fa fa-angle-right' })
            )
          ),
          _react2.default.createElement(
            _reactBootstrap.NavDropdown,
            { title: _react2.default.createElement(
                'span',
                null,
                _react2.default.createElement('i', { className: 'fa fa-tasks fa-fw' }),
                ' '
              ), id: 'navDropdown2222' },
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '1', style: { width: 300 } },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'p',
                  null,
                  ' ',
                  _react2.default.createElement(
                    'strong',
                    null,
                    'Task 1'
                  ),
                  ' ',
                  _react2.default.createElement(
                    'span',
                    { className: 'pull-right text-muted' },
                    '40% Complete'
                  ),
                  ' '
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(_reactBootstrap.ProgressBar, { bsStyle: 'success', now: 40 })
                )
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '2' },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'p',
                  null,
                  ' ',
                  _react2.default.createElement(
                    'strong',
                    null,
                    'Task 2'
                  ),
                  ' ',
                  _react2.default.createElement(
                    'span',
                    { className: 'pull-right text-muted' },
                    '20% Complete'
                  ),
                  ' '
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(_reactBootstrap.ProgressBar, { bsStyle: 'info', now: 20 })
                )
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '3' },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'p',
                  null,
                  ' ',
                  _react2.default.createElement(
                    'strong',
                    null,
                    'Task 3'
                  ),
                  ' ',
                  _react2.default.createElement(
                    'span',
                    { className: 'pull-right text-muted' },
                    '60% Complete'
                  ),
                  ' '
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(_reactBootstrap.ProgressBar, { bsStyle: 'warning', now: 60 })
                )
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '4' },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'p',
                  null,
                  ' ',
                  _react2.default.createElement(
                    'strong',
                    null,
                    'Task 4'
                  ),
                  ' ',
                  _react2.default.createElement(
                    'span',
                    { className: 'pull-right text-muted' },
                    '80% Complete'
                  ),
                  ' '
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(_reactBootstrap.ProgressBar, { bsStyle: 'danger', now: 80 })
                )
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '5' },
              _react2.default.createElement(
                'strong',
                null,
                'See All Tasks'
              ),
              ' ',
              _react2.default.createElement('i', { className: 'fa fa-angle-right' })
            )
          ),
          _react2.default.createElement(
            _reactBootstrap.NavDropdown,
            { title: _react2.default.createElement('i', { className: 'fa fa-bell fa-fw' }), id: 'navDropdown3' },
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '1', style: { width: 300 } },
              _react2.default.createElement(
                'div',
                null,
                ' ',
                _react2.default.createElement('i', { className: 'fa fa-comment fa-fw' }),
                ' New Comment ',
                _react2.default.createElement(
                  'span',
                  { className: 'pull-right text-muted small' },
                  '4 minutes ago'
                ),
                ' '
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '2' },
              _react2.default.createElement(
                'div',
                null,
                ' ',
                _react2.default.createElement('i', { className: 'fa fa-twitter fa-fw' }),
                ' 3 New Followers ',
                _react2.default.createElement(
                  'span',
                  { className: 'pull-right text-muted small' },
                  '12 minutes ago'
                ),
                ' '
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '3' },
              _react2.default.createElement(
                'div',
                null,
                ' ',
                _react2.default.createElement('i', { className: 'fa fa-envelope fa-fw' }),
                ' Message Sent ',
                _react2.default.createElement(
                  'span',
                  { className: 'pull-right text-muted small' },
                  '4 minutes ago'
                ),
                ' '
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '4' },
              _react2.default.createElement(
                'div',
                null,
                ' ',
                _react2.default.createElement('i', { className: 'fa fa-tasks fa-fw' }),
                ' New Task ',
                _react2.default.createElement(
                  'span',
                  { className: 'pull-right text-muted small' },
                  '4 minutes ago'
                ),
                ' '
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '5' },
              _react2.default.createElement(
                'div',
                null,
                ' ',
                _react2.default.createElement('i', { className: 'fa fa-upload fa-fw' }),
                ' Server Rebooted ',
                _react2.default.createElement(
                  'span',
                  { className: 'pull-right text-muted small' },
                  '4 minutes ago'
                ),
                ' '
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '6' },
              _react2.default.createElement(
                'strong',
                null,
                'See All Alerts'
              ),
              ' ',
              _react2.default.createElement('i', { className: 'fa fa-angle-right' })
            )
          ),
          _react2.default.createElement(
            _reactBootstrap.NavDropdown,
            { title: _react2.default.createElement('i', { className: 'fa fa-user fa-fw' }), id: 'navDropdown4' },
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '1' },
              _react2.default.createElement(
                'span',
                null,
                ' ',
                _react2.default.createElement('i', { className: 'fa fa-user fa-fw' }),
                ' User Profile '
              )
            ),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '2' },
              _react2.default.createElement(
                'span',
                null,
                _react2.default.createElement('i', { className: 'fa fa-gear fa-fw' }),
                ' Settings '
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '3', href: 'http://www.strapui.com' },
              _react2.default.createElement(
                'span',
                null,
                ' ',
                _react2.default.createElement('i', { className: 'fa fa-eye fa-fw' }),
                ' Premium React Themes '
              )
            ),
            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '4', onClick: function onClick(event) {
                  _history2.default.push('/login');
                } },
              _react2.default.createElement(
                'span',
                null,
                ' ',
                _react2.default.createElement('i', { className: 'fa fa-sign-out fa-fw' }),
                ' Logout '
              )
            )
          )
        ),
        _react2.default.createElement(_Sidebar2.default, null)
      )
    );
  }
  function toggleMenu() {
    if ((0, _jquery2.default)(".navbar-collapse").hasClass('collapse')) {
      (0, _jquery2.default)(".navbar-collapse").removeClass('collapse');
    } else {
      (0, _jquery2.default)(".navbar-collapse").addClass('collapse');
    }
  }
  
  exports.default = Header;

/***/ }),
/* 38 */
/***/ (function(module, exports) {

  module.exports = require("react-bootstrap");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

  module.exports = require("react-bootstrap/lib/Navbar");

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createBrowserHistory = __webpack_require__(41);
  
  var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);
  
  var _createMemoryHistory = __webpack_require__(42);
  
  var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);
  
  var _useQueries = __webpack_require__(43);
  
  var _useQueries2 = _interopRequireDefault(_useQueries);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var history = (0, _useQueries2.default)( false ? _createBrowserHistory2.default : _createMemoryHistory2.default)(); /**
                                                                                                                                    * React Starter Kit (https://www.reactstarterkit.com/)
                                                                                                                                    *
                                                                                                                                    * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
                                                                                                                                    *
                                                                                                                                    * This source code is licensed under the MIT license found in the
                                                                                                                                    * LICENSE.txt file in the root directory of this source tree.
                                                                                                                                    */
  
  exports.default = history;

/***/ }),
/* 41 */
/***/ (function(module, exports) {

  module.exports = require("history/lib/createBrowserHistory");

/***/ }),
/* 42 */
/***/ (function(module, exports) {

  module.exports = require("history/lib/createMemoryHistory");

/***/ }),
/* 43 */
/***/ (function(module, exports) {

  module.exports = require("history/lib/useQueries");

/***/ }),
/* 44 */
/***/ (function(module, exports) {

  module.exports = require("jquery");

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
  
  var _classCallCheck2 = __webpack_require__(30);
  
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  
  var _createClass2 = __webpack_require__(31);
  
  var _createClass3 = _interopRequireDefault(_createClass2);
  
  var _possibleConstructorReturn2 = __webpack_require__(32);
  
  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
  
  var _inherits2 = __webpack_require__(33);
  
  var _inherits3 = _interopRequireDefault(_inherits2);
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _history = __webpack_require__(40);
  
  var _history2 = _interopRequireDefault(_history);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var Sidebar = function (_Component) {
    (0, _inherits3.default)(Sidebar, _Component);
  
    function Sidebar(props) {
      (0, _classCallCheck3.default)(this, Sidebar);
  
      var _this = (0, _possibleConstructorReturn3.default)(this, (Sidebar.__proto__ || (0, _getPrototypeOf2.default)(Sidebar)).call(this, props));
  
      _this.state = {
        uiElementsCollapsed: true,
        chartsElementsCollapsed: true,
        multiLevelDropdownCollapsed: true,
        thirdLevelDropdownCollapsed: true,
        samplePagesCollapsed: true
      };
      return _this;
    }
  
    (0, _createClass3.default)(Sidebar, [{
      key: 'render',
      value: function render() {
        var _this2 = this;
  
        return _react2.default.createElement(
          'div',
          { className: 'navbar-default sidebar', style: { marginLeft: '-20px' }, role: 'navigation' },
          _react2.default.createElement(
            'div',
            { className: 'sidebar-nav navbar-collapse collapse' },
            _react2.default.createElement(
              'ul',
              { className: 'nav in', id: 'side-menu' },
              _react2.default.createElement(
                'li',
                { className: 'sidebar-search' },
                _react2.default.createElement(
                  'div',
                  { className: 'input-group custom-search-form' },
                  _react2.default.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Search...' }),
                  _react2.default.createElement(
                    'span',
                    { className: 'input-group-btn' },
                    _react2.default.createElement(
                      'button',
                      { className: 'btn btn-default', type: 'button' },
                      _react2.default.createElement('i', { className: 'fa fa-search' })
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'a',
                  { href: '', onClick: function onClick(e) {
                      e.preventDefault();_history2.default.push('/');
                    } },
                  _react2.default.createElement('i', { className: 'fa fa-dashboard fa-fw' }),
                  ' \xA0Dashboard'
                )
              ),
              _react2.default.createElement(
                'li',
                { className: (0, _classnames2.default)({ active: !this.state.chartsElementsCollapsed }) },
                _react2.default.createElement(
                  'a',
                  {
                    href: '',
                    onClick: function onClick(e) {
                      e.preventDefault();
                      _this2.setState({ chartsElementsCollapsed: !_this2.state.chartsElementsCollapsed });
                      return false;
                    }
                  },
                  _react2.default.createElement('i', { className: 'fa fa-bar-chart-o fa-fw' }),
                  ' \xA0Charts',
                  _react2.default.createElement('span', { className: 'fa arrow' })
                ),
                _react2.default.createElement(
                  'ul',
                  {
                    className: (0, _classnames2.default)({
                      'nav nav-second-level': true,
                      collapse: this.state.chartsElementsCollapsed
                    })
                  },
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/flotcharts');
                        } },
                      'FlotCharts'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      {
                        href: '',
                        onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/morrisjscharts');
                        }
                      },
                      'Morrisjs Charts'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'a',
                  { href: '', onClick: function onClick(e) {
                      e.preventDefault();_history2.default.push('/table');
                    } },
                  _react2.default.createElement('i', { className: 'fa fa-table fa-fw' }),
                  ' \xA0Tables'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'a',
                  { href: '', onClick: function onClick(e) {
                      e.preventDefault();_history2.default.push('/forms');
                    } },
                  _react2.default.createElement('i', { className: 'fa fa-table fa-fw' }),
                  ' \xA0Forms'
                )
              ),
              _react2.default.createElement(
                'li',
                { className: (0, _classnames2.default)({ active: !this.state.uiElementsCollapsed }) },
                _react2.default.createElement(
                  'a',
                  {
                    href: '',
                    onClick: function onClick(e) {
                      e.preventDefault();
                      _this2.setState({ uiElementsCollapsed: !_this2.state.uiElementsCollapsed
                      });return false;
                    }
                  },
                  _react2.default.createElement('i', { className: 'fa fa-edit fa-fw' }),
                  ' UI Elements',
                  _react2.default.createElement('span', { className: 'fa arrow' })
                ),
                _react2.default.createElement(
                  'ul',
                  {
                    className: (0, _classnames2.default)({
                      'nav nav-second-level': true,
                      collapse: this.state.uiElementsCollapsed
                    })
                  },
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/panelwells');
                        } },
                      'Panels And Wells'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/button');
                        } },
                      'Buttons'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      {
                        href: '',
                        onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/notification');
                        }
                      },
                      'Notification'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/typography');
                        } },
                      'Typography'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/icons');
                        } },
                      'Icons'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/grid');
                        } },
                      'Grid'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                { className: (0, _classnames2.default)({ active: !this.state.multiLevelDropdownCollapsed }) },
                _react2.default.createElement(
                  'a',
                  {
                    href: '',
                    onClick: function onClick(e) {
                      e.preventDefault();
                      _this2.setState({
                        multiLevelDropdownCollapsed: !_this2.state.multiLevelDropdownCollapsed
                      });
                      return false;
                    }
                  },
                  _react2.default.createElement('i', { className: 'fa fa-sitemap fa-fw' }),
                  '\xA0Multi-Level Dropdown',
                  _react2.default.createElement('span', { className: 'fa arrow' })
                ),
                _react2.default.createElement(
                  'ul',
                  {
                    className: (0, _classnames2.default)({
                      'nav nav-second-level': true, collapse: this.state.multiLevelDropdownCollapsed
                    })
                  },
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();
                        } },
                      'Second Level Item'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();
                        } },
                      'Second Level Item'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    { className: (0, _classnames2.default)({ active: !this.state.thirdLevelDropdownCollapsed }) },
                    _react2.default.createElement(
                      'a',
                      {
                        href: '',
                        onClick: function onClick(e) {
                          e.preventDefault();
                          _this2.setState({
                            thirdLevelDropdownCollapsed: !_this2.state.thirdLevelDropdownCollapsed
                          });
                          return false;
                        }
                      },
                      'Third Level',
                      _react2.default.createElement('span', { className: 'fa arrow' })
                    ),
                    _react2.default.createElement(
                      'ul',
                      {
                        className: (0, _classnames2.default)({
                          'nav nav-second-level': true,
                          collapse: this.state.thirdLevelDropdownCollapsed
                        })
                      },
                      _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                          'a',
                          { href: '', onClick: function onClick(e) {
                              e.preventDefault();
                            } },
                          'Third Level Item'
                        )
                      ),
                      _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                          'a',
                          { href: '', onClick: function onClick(e) {
                              e.preventDefault();
                            } },
                          'Third Level Item'
                        )
                      ),
                      _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                          'a',
                          { href: '', onClick: function onClick(e) {
                              e.preventDefault();
                            } },
                          'Third Level Item'
                        )
                      ),
                      _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                          'a',
                          { href: '', onClick: function onClick(e) {
                              e.preventDefault();
                            } },
                          'Third Level Item'
                        )
                      )
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                { className: (0, _classnames2.default)({ active: !this.state.samplePagesCollapsed }) },
                _react2.default.createElement(
                  'a',
                  {
                    href: '',
                    onClick: function onClick(e) {
                      e.preventDefault();
                      _this2.setState({
                        samplePagesCollapsed: !_this2.state.samplePagesCollapsed
                      });
                      return false;
                    }
                  },
                  _react2.default.createElement('i', { className: 'fa fa-files-o fa-fw' }),
                  '\xA0Sample Pages',
                  _react2.default.createElement('span', { className: 'fa arrow' })
                ),
                _react2.default.createElement(
                  'ul',
                  {
                    className: (0, _classnames2.default)({
                      'nav nav-second-level': true,
                      collapse: this.state.samplePagesCollapsed
                    })
                  },
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/blank');
                        } },
                      'Blank'
                    )
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                      'a',
                      { href: '', onClick: function onClick(e) {
                          e.preventDefault();_history2.default.push('/login');
                        } },
                      'Login'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'a',
                  { href: 'http://www.strapui.com/' },
                  'Premium React Themes'
                )
              )
            )
          )
        );
      }
    }]);
    return Sidebar;
  }(_react.Component);
  
  exports.default = Sidebar;

/***/ }),
/* 46 */
/***/ (function(module, exports) {

  module.exports = require("classnames");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

  module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAmCAYAAACyAQkgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGODdGMTE3NDA3MjA2ODExODA4M0E3MjY3MTQwRTY5RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RTIzNTA3RUM5OEExMUU0QjRCOUUwQTIyNkYzQTlCNiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RTIzNTA3REM5OEExMUU0QjRCOUUwQTIyNkYzQTlCNiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjExNzQwNzIwNjgxMTgwODNBNzI2NzE0MEU2OUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Rjg3RjExNzQwNzIwNjgxMTgwODNBNzI2NzE0MEU2OUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5xbRMYAAAIAklEQVR42qyZC5BNdRzH//9zd++6a1msRwi7SCrPXmZkSjU1pSmPEnrNoEQhjGEKq2xEKZRJHiEkRNIMkple8kiZyGu9GcZrsezL7tp7/n1/Z7+X47rn3mu2/8xnz7nnnP///M7v/3v9/6uNMSo3qFTOFaV8Wnk2A3A7GYem/HkEFKiba5VABo+HMcgleaWNk/p+DG55d0yQP5vzjPo6x1aB6JL2gqQTcJbOK6fBcjAd7IshYH0wALxAQaWdxZgTMOa0Ukg6vL5PtUr2HsAKaasMf4Le9ASLQXWwAMwHl8FAsAtMBIEI/SwwFGSDUXxGxpkDysBUMFKeNTG+NOGqxFCm1p7TNQ6U4OsfwnGHq+9T4AMwEjwOerm0Wwcs4PWTYDD4BhTzfj2wBWOOwXsX8pnoGo3R7gW3gbkuIaWVgVXgbjANtAWbQHvQBPxBIZeClmCeS0hFwaaCyuCRWELEI+hdPG7wuC8vHwJ6g1SwGmyk040GPcEFj76beWyj4p36KK22y3mitfkUdCp/i5bHx+hzLuwdFdJovO1W0J/nQXp42/9r8HgEzeWxRpRnAnSU5mAYp7sW+BbcEqVfatg74hDUGC9O8Jge5ZkpoAOYyvPlYChoAuYC7dGvAY/HYgWoazaqPePTQR5bq+tvJ1GTEpJep739CboBHzgE9oMnwfvgY3CZhFoLZ0ytspXSFXamw+AU6AD6gvtBK2aoFIYXaTU5/ZHaO4wMknKPg92MIk8w3+yuiNcHGN+eB9X4ew7vFYGjFE5U8SXYw+v5dCZJFFVAY6ZPSZDHGLbuAa9wLNvSesr2QrPkYlCvu2LUpZAAkrEaoga4IxBZ0FRO5SB6snzxeQq6iNN4kFMuGWUlUvWrutx6fM50loebU0pSJxKDT8bQaiiuLWZ/SQj9wAhwMVGrZ9bn2l0h2AU8N5sh7rTk6E41LAhq3eD1z1IzkzilnzLEPMj7aUyR8jETHQ0aNaKKz6l8bodfyBRuB+twfSfS8uFqPlUVxzH4LSaUychwiBqW1h2aaOb36axAgr6MwmgkyAYDpEhKpN+4Bc1iNSTTPIZT9hbT5l7wCx2jHq/Xx8vHlRpzsE9tS92VrCfiXEJSO8nzmML2df1qdGYDqxAfUhgst9NEji2z04P2v5HHTKbqN0Ap+Jxp2+fY6Hlk7P2XzYAE7aS7XfKFIDuCScg0P8wiRIqRAyzxFPqqgqBJ10rLR23l8znQwmbMWsifJee/RpMpYJyd6RQ715pEhBliTmJmGLf38VKTc7xUj7T2FJlaWwvMGL+lc3Czk4eQigXISTpBGm2tUG74IUzzZL3aVkY+5F3ej9Sy6Hz9KOBij+ckXXeBTDsg3/Ct+XYLC1LfB2OuC/uaxdDh1aSw+Irnf9OxrraGSVqE+AKMlaIYEX6hT5n0sDF+A9/xfCVNyqsVwHanwUwt2OlDbhvVccRU7TqGP1/CMCS2PV5r3R3h5ue8oEqzdMQxrJt4n/PwVk6pTEejKJ3SXLFP4uBLHs/JWioTmnji7BWTsbfIPOy/JmhH0JXnncGdUd5XhUlCYvKvFlNfFoP3GnCHR8fO9Pj57DM6lJUQR60iaE5fr+UEGTzJUsWuLC4eb9NEJAW/6PGuuuAHFtwfSeYKqV86vscv3EY7C6+WXnalw+nMMIORVdSFMpW0JtfekqC1xOBlYC1i9bo6fr2xSUCvL7Wdfj2Z6STNDnUWd+URIMn1DomtA8FOal8y3ijHBjbl2WrGaRshxtFHF1z7jBnpEh1mrmN/WMTh/hqGpuqMrzVxvVWKTx0sstVL0OwzeEayUjGc8ydEg9lVfSo/t0xVw71/cK8e64R9TjIxyH5aPcZ03IerBCkLL3IdNqsEHXukWTek0O/Bz4x3shh7k1xw1Y13sip62/kQrSbDYbpY5eeL3MWYaPKs7UTssbiXTnPZx8AeWj8tw6NVS4LGh1k4h+fGU1lnHA+FoGX46nCNhq8+O7Io6YmvD7juF1MLTVnYzGPqlYxyhfVBIqe1ASt/P4WsR0cJ7WoEsVRf+WiqXppeySlK8t1CSGHSrFL06kmE+RH8ztR5ik7XjkaewUySwimL1QqYnrOZATewbGxvGzO8TWXrWOvkitWjjWk3C+jx83ndT633ojOeZ54u4bjyoZ+AZq7CuThsySw7KA9wpXss9lLEe4khNOXx37DrpSAPzAQzQBqXI6vACtAcNAOrQSa4CIrDxtjFY/P4liKhZUjk3NTgaiD3zl3DqJVB1MwJMJmFS1/lLcVx5rhG/8dSpFocK8VimsB6CmgzTnYPea9Hy4tjhevaJIsy8y5dxKoFJA3Pdo27JGwLyHuj0CgTa5fMSXOonpyaMpIo6H82eG3TK1rrS4fJpYYH08HGRekjaVv2Zc9YMdSQ0CZFq0kZvogr5SRc21agds85YysUFg96rDKlWv+QqU9qgKc53euYlluyqjoXoW/7YgT0bmnWjpbJMaZehKkFS63pu5EqUDdS4F+mPBP1CduiSeQafjuF3MadvC2soCTsrAXPMXe/6lonhbaAhmDaC1IsJxtWbEsHQpZgsEzgB7+CRWABOABWgAwwAXTgtZB954CngAhTGcwGR8ASMBf8BW4FWbH2RuPyelTqytL2Uqs8fE1wlWYnuUqdzjDktfU/jXtQ/dm3B++dKa++zGdxVezGRHe3QgSaU6VXw2yAqdMwXhbd5KacnzssUgMcxSD58o+G2jCiVF/0jv8JMABBEldD7PKL3QAAAABJRU5ErkJggg=="

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _regenerator = __webpack_require__(1);
  
  var _regenerator2 = _interopRequireDefault(_regenerator);
  
  var _asyncToGenerator2 = __webpack_require__(4);
  
  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _Home = __webpack_require__(49);
  
  var _Home2 = _interopRequireDefault(_Home);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  // import fetch from '../../core/fetch';
  
  /**
   * React Starter Kit (https://www.reactstarterkit.com/)
   *
   * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  exports.default = {
  
    path: '/',
  
    action: function action() {
      var _this = this;
  
      return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', _react2.default.createElement(_Home2.default, null));
  
              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    }
  };

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
  
  var _classCallCheck2 = __webpack_require__(30);
  
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  
  var _createClass2 = __webpack_require__(31);
  
  var _createClass3 = _interopRequireDefault(_createClass2);
  
  var _possibleConstructorReturn2 = __webpack_require__(32);
  
  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
  
  var _inherits2 = __webpack_require__(33);
  
  var _inherits3 = _interopRequireDefault(_inherits2);
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _withStyles = __webpack_require__(18);
  
  var _withStyles2 = _interopRequireDefault(_withStyles);
  
  var _reactBootstrap = __webpack_require__(38);
  
  var _Home = __webpack_require__(50);
  
  var _Home2 = _interopRequireDefault(_Home);
  
  var _recharts = __webpack_require__(52);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var data = __webpack_require__(142);
  var xmlToJSON = __webpack_require__(143);
  
  var title = 'Sb Admin React';
  
  // Convert the data from xml to json
  
  var Home = function (_React$Component) {
    (0, _inherits3.default)(Home, _React$Component);
  
    function Home() {
      (0, _classCallCheck3.default)(this, Home);
      return (0, _possibleConstructorReturn3.default)(this, (Home.__proto__ || (0, _getPrototypeOf2.default)(Home)).apply(this, arguments));
    }
  
    (0, _createClass3.default)(Home, [{
      key: 'render',
  
      // constructor(props, context)
      // {
      //   super(props, context);
      //   //this.props = props;
      //   //this.context = context;
      // }
      value: function render() {
  
        var values = [];
        try {
          console.log("A");
          var json = xmlToJSON.parseString(data.data);
          console.log("B");
          var cpuValues = JSON.parse(json.bobMonData[0].cpuBar[0]._text);
          console.log("C");
          cpuValues.forEach(function (v) {
            values.push({
              name: v[0],
              uv: v[1],
              amt: v[1]
            });
          });
        } catch (e) {}
  
        var data = [{ name: 'Page A', uv: 4000, pv: 2400, amt: 0 }, { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 }, { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 }, { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 }, { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 }, { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 }, { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }];
  
        console.log(values);
  
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-lg-12' },
              _react2.default.createElement(
                _reactBootstrap.PageHeader,
                null,
                'Dashboard'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              _recharts.ResponsiveContainer,
              { width: '100%', aspect: 2 },
              _react2.default.createElement(
                _recharts.BarChart,
                { data: data, margin: { top: 10, right: 30, left: 0, bottom: 0 } },
                _react2.default.createElement(_recharts.Bar, { dataKey: 'uv', stackId: '1', fill: '#8884d8' })
              )
            )
          )
        );
      }
    }]);
    return Home;
  }(_react2.default.Component);
  
  //Hello.contextTypes = {setTitle: PropTypes.func.isRequired};
  
  exports.default = (0, _withStyles2.default)(_Home2.default)(Home);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

  
      var content = __webpack_require__(51);
      var insertCss = __webpack_require__(22);
  
      if (typeof content === 'string') {
        content = [[module.id, content, '']];
      }
  
      module.exports = content.locals || {};
      module.exports._getCss = function() { return content.toString(); };
      module.exports._insertCss = function(options) { return insertCss(content, options) };
    
      // Hot Module Replacement
      // https://webpack.github.io/docs/hot-module-replacement
      // Only activated in browser context
      if (false) {
        var removeCss = function() {};
        module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]_[local]_[hash:base64:3]\",\"minimize\":false}!../../../node_modules/postcss-loader/index.js?pack=default!./Home.css", function() {
          content = require("!!../../../node_modules/css-loader/index.js?{\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]_[local]_[hash:base64:3]\",\"minimize\":false}!../../../node_modules/postcss-loader/index.js?pack=default!./Home.css");
  
          if (typeof content === 'string') {
            content = [[module.id, content, '']];
          }
  
          removeCss = insertCss(content, { replace: true });
        });
        module.hot.dispose(function() { removeCss(); });
      }
    

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(21)();
  // imports
  
  
  // module
  exports.push([module.id, "/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n:root {\n  /*\n   * Typography\n   * ======================================================================== */\n\n  /*\n   * Layout\n   * ======================================================================== */\n\n  /*\n   * Media queries breakpoints\n   * ======================================================================== */  /* Extra small screen / phone */  /* Small screen / tablet */  /* Medium screen / desktop */ /* Large screen / wide desktop */\n}\n\n.Home_root_2IM {\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n.Home_container_2Ye {\n  margin: 0 auto;\n  padding: 0 0 40px;\n  max-width: 1000px;\n}\n\n.Home_news_oTy {\n  padding: 0;\n}\n\n.Home_newsItem_3Ob {\n  list-style-type: none;\n  padding-bottom: 6px;\n}\n\n.Home_newsTitle_1yW {\n  font-size: 1.125em;\n}\n\n.Home_newsTitle_1yW,\n.Home_newsDesc_21L {\n  display: block;\n}\n", "", {"version":3,"sources":["/./routes/home/Home.css","/./components/variables.css"],"names":[],"mappings":"AAAA;;;;;;;GAOG;;ACPH;;;;;;;GAOG;;AAEH;EACE;;gFAE8E;;EAI9E;;gFAE8E;;EAI9E;;gFAE8E,EAErD,gCAAgC,EAChC,2BAA2B,EAC3B,6BAA6B,CAC7B,iCAAiC;CAC3D;;ADnBD;EACE,mBAAmB;EACnB,oBAAoB;CACrB;;AAED;EACE,eAAe;EACf,kBAAkB;EAClB,kBAAoC;CACrC;;AAED;EACE,WAAW;CACZ;;AAED;EACE,sBAAsB;EACtB,oBAAoB;CACrB;;AAED;EACE,mBAAmB;CACpB;;AAED;;EAEE,eAAe;CAChB","file":"Home.css","sourcesContent":["/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n@import '../../components/variables.css';\n\n.root {\n  padding-left: 20px;\n  padding-right: 20px;\n}\n\n.container {\n  margin: 0 auto;\n  padding: 0 0 40px;\n  max-width: var(--max-content-width);\n}\n\n.news {\n  padding: 0;\n}\n\n.newsItem {\n  list-style-type: none;\n  padding-bottom: 6px;\n}\n\n.newsTitle {\n  font-size: 1.125em;\n}\n\n.newsTitle,\n.newsDesc {\n  display: block;\n}\n","/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\n:root {\n  /*\n   * Typography\n   * ======================================================================== */\n\n  --font-family-base: 'Segoe UI', 'HelveticaNeue-Light', sans-serif;\n\n  /*\n   * Layout\n   * ======================================================================== */\n\n  --max-content-width: 1000px;\n\n  /*\n   * Media queries breakpoints\n   * ======================================================================== */\n\n  --screen-xs-min: 480px;  /* Extra small screen / phone */\n  --screen-sm-min: 768px;  /* Small screen / tablet */\n  --screen-md-min: 992px;  /* Medium screen / desktop */\n  --screen-lg-min: 1200px; /* Large screen / wide desktop */\n}\n"],"sourceRoot":"webpack://"}]);
  
  // exports
  exports.locals = {
  	"root": "Home_root_2IM",
  	"container": "Home_container_2Ye",
  	"news": "Home_news_oTy",
  	"newsItem": "Home_newsItem_3Ob",
  	"newsTitle": "Home_newsTitle_1yW",
  	"newsDesc": "Home_newsDesc_21L"
  };

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ComposedChart = exports.RadialBarChart = exports.AreaChart = exports.ScatterChart = exports.RadarChart = exports.Sankey = exports.Treemap = exports.PieChart = exports.BarChart = exports.LineChart = exports.ZAxis = exports.YAxis = exports.XAxis = exports.Scatter = exports.Bar = exports.Area = exports.Line = exports.CartesianGrid = exports.CartesianAxis = exports.ReferenceArea = exports.ReferenceDot = exports.ReferenceLine = exports.Brush = exports.RadialBar = exports.Radar = exports.Pie = exports.PolarAngleAxis = exports.PolarRadiusAxis = exports.PolarGrid = exports.Symbols = exports.Cross = exports.Dot = exports.Polygon = exports.Rectangle = exports.Curve = exports.Sector = exports.Text = exports.Cell = exports.ResponsiveContainer = exports.Tooltip = exports.Legend = exports.Layer = exports.Surface = undefined;
  
  __webpack_require__(53);
  
  __webpack_require__(55);
  
  var _Surface2 = __webpack_require__(56);
  
  var _Surface3 = _interopRequireDefault(_Surface2);
  
  var _Layer2 = __webpack_require__(65);
  
  var _Layer3 = _interopRequireDefault(_Layer2);
  
  var _Legend2 = __webpack_require__(66);
  
  var _Legend3 = _interopRequireDefault(_Legend2);
  
  var _Tooltip2 = __webpack_require__(79);
  
  var _Tooltip3 = _interopRequireDefault(_Tooltip2);
  
  var _ResponsiveContainer2 = __webpack_require__(82);
  
  var _ResponsiveContainer3 = _interopRequireDefault(_ResponsiveContainer2);
  
  var _Cell2 = __webpack_require__(86);
  
  var _Cell3 = _interopRequireDefault(_Cell2);
  
  var _Text2 = __webpack_require__(87);
  
  var _Text3 = _interopRequireDefault(_Text2);
  
  var _Sector2 = __webpack_require__(90);
  
  var _Sector3 = _interopRequireDefault(_Sector2);
  
  var _Curve2 = __webpack_require__(93);
  
  var _Curve3 = _interopRequireDefault(_Curve2);
  
  var _Rectangle2 = __webpack_require__(94);
  
  var _Rectangle3 = _interopRequireDefault(_Rectangle2);
  
  var _Polygon2 = __webpack_require__(96);
  
  var _Polygon3 = _interopRequireDefault(_Polygon2);
  
  var _Dot2 = __webpack_require__(97);
  
  var _Dot3 = _interopRequireDefault(_Dot2);
  
  var _Cross2 = __webpack_require__(98);
  
  var _Cross3 = _interopRequireDefault(_Cross2);
  
  var _Symbols2 = __webpack_require__(75);
  
  var _Symbols3 = _interopRequireDefault(_Symbols2);
  
  var _PolarGrid2 = __webpack_require__(99);
  
  var _PolarGrid3 = _interopRequireDefault(_PolarGrid2);
  
  var _PolarRadiusAxis2 = __webpack_require__(100);
  
  var _PolarRadiusAxis3 = _interopRequireDefault(_PolarRadiusAxis2);
  
  var _PolarAngleAxis2 = __webpack_require__(102);
  
  var _PolarAngleAxis3 = _interopRequireDefault(_PolarAngleAxis2);
  
  var _Pie2 = __webpack_require__(103);
  
  var _Pie3 = _interopRequireDefault(_Pie2);
  
  var _Radar2 = __webpack_require__(105);
  
  var _Radar3 = _interopRequireDefault(_Radar2);
  
  var _RadialBar2 = __webpack_require__(106);
  
  var _RadialBar3 = _interopRequireDefault(_RadialBar2);
  
  var _Brush2 = __webpack_require__(108);
  
  var _Brush3 = _interopRequireDefault(_Brush2);
  
  var _ReferenceLine2 = __webpack_require__(111);
  
  var _ReferenceLine3 = _interopRequireDefault(_ReferenceLine2);
  
  var _ReferenceDot2 = __webpack_require__(113);
  
  var _ReferenceDot3 = _interopRequireDefault(_ReferenceDot2);
  
  var _ReferenceArea2 = __webpack_require__(114);
  
  var _ReferenceArea3 = _interopRequireDefault(_ReferenceArea2);
  
  var _CartesianAxis2 = __webpack_require__(115);
  
  var _CartesianAxis3 = _interopRequireDefault(_CartesianAxis2);
  
  var _CartesianGrid2 = __webpack_require__(116);
  
  var _CartesianGrid3 = _interopRequireDefault(_CartesianGrid2);
  
  var _Line2 = __webpack_require__(117);
  
  var _Line3 = _interopRequireDefault(_Line2);
  
  var _Area2 = __webpack_require__(118);
  
  var _Area3 = _interopRequireDefault(_Area2);
  
  var _Bar2 = __webpack_require__(119);
  
  var _Bar3 = _interopRequireDefault(_Bar2);
  
  var _Scatter2 = __webpack_require__(120);
  
  var _Scatter3 = _interopRequireDefault(_Scatter2);
  
  var _XAxis2 = __webpack_require__(121);
  
  var _XAxis3 = _interopRequireDefault(_XAxis2);
  
  var _YAxis2 = __webpack_require__(122);
  
  var _YAxis3 = _interopRequireDefault(_YAxis2);
  
  var _ZAxis2 = __webpack_require__(123);
  
  var _ZAxis3 = _interopRequireDefault(_ZAxis2);
  
  var _LineChart2 = __webpack_require__(124);
  
  var _LineChart3 = _interopRequireDefault(_LineChart2);
  
  var _BarChart2 = __webpack_require__(131);
  
  var _BarChart3 = _interopRequireDefault(_BarChart2);
  
  var _PieChart2 = __webpack_require__(132);
  
  var _PieChart3 = _interopRequireDefault(_PieChart2);
  
  var _Treemap2 = __webpack_require__(133);
  
  var _Treemap3 = _interopRequireDefault(_Treemap2);
  
  var _Sankey2 = __webpack_require__(134);
  
  var _Sankey3 = _interopRequireDefault(_Sankey2);
  
  var _RadarChart2 = __webpack_require__(137);
  
  var _RadarChart3 = _interopRequireDefault(_RadarChart2);
  
  var _ScatterChart2 = __webpack_require__(138);
  
  var _ScatterChart3 = _interopRequireDefault(_ScatterChart2);
  
  var _AreaChart2 = __webpack_require__(139);
  
  var _AreaChart3 = _interopRequireDefault(_AreaChart2);
  
  var _RadialBarChart2 = __webpack_require__(140);
  
  var _RadialBarChart3 = _interopRequireDefault(_RadialBarChart2);
  
  var _ComposedChart2 = __webpack_require__(141);
  
  var _ComposedChart3 = _interopRequireDefault(_ComposedChart2);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  exports.Surface = _Surface3.default;
  exports.Layer = _Layer3.default;
  exports.Legend = _Legend3.default;
  exports.Tooltip = _Tooltip3.default;
  exports.ResponsiveContainer = _ResponsiveContainer3.default;
  exports.Cell = _Cell3.default;
  exports.Text = _Text3.default;
  exports.Sector = _Sector3.default;
  exports.Curve = _Curve3.default;
  exports.Rectangle = _Rectangle3.default;
  exports.Polygon = _Polygon3.default;
  exports.Dot = _Dot3.default;
  exports.Cross = _Cross3.default;
  exports.Symbols = _Symbols3.default;
  exports.PolarGrid = _PolarGrid3.default;
  exports.PolarRadiusAxis = _PolarRadiusAxis3.default;
  exports.PolarAngleAxis = _PolarAngleAxis3.default;
  exports.Pie = _Pie3.default;
  exports.Radar = _Radar3.default;
  exports.RadialBar = _RadialBar3.default;
  exports.Brush = _Brush3.default;
  exports.ReferenceLine = _ReferenceLine3.default;
  exports.ReferenceDot = _ReferenceDot3.default;
  exports.ReferenceArea = _ReferenceArea3.default;
  exports.CartesianAxis = _CartesianAxis3.default;
  exports.CartesianGrid = _CartesianGrid3.default;
  exports.Line = _Line3.default;
  exports.Area = _Area3.default;
  exports.Bar = _Bar3.default;
  exports.Scatter = _Scatter3.default;
  exports.XAxis = _XAxis3.default;
  exports.YAxis = _YAxis3.default;
  exports.ZAxis = _ZAxis3.default;
  exports.LineChart = _LineChart3.default;
  exports.BarChart = _BarChart3.default;
  exports.PieChart = _PieChart3.default;
  exports.Treemap = _Treemap3.default;
  exports.Sankey = _Sankey3.default;
  exports.RadarChart = _RadarChart3.default;
  exports.ScatterChart = _ScatterChart3.default;
  exports.AreaChart = _AreaChart3.default;
  exports.RadialBarChart = _RadialBarChart3.default;
  exports.ComposedChart = _ComposedChart3.default;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
  
  /* eslint no-proto: 0 */
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var testObject = {};
  
  if (!(_setPrototypeOf2.default || testObject.__proto__)) {
    (function () {
      var nativeGetPrototypeOf = _getPrototypeOf2.default;
  
      Object.getPrototypeOf = function (object) {
        if (object.__proto__) {
          return object.__proto__;
        }
  
        return nativeGetPrototypeOf.call(Object, object);
      };
    })();
  }

/***/ }),
/* 54 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/object/set-prototype-of");

/***/ }),
/* 55 */
/***/ (function(module, exports) {

  module.exports = require("core-js/es6/math");

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  } /**
     * @fileOverview Surface
     */
  
  var propTypes = {
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired,
    viewBox: _react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      width: _react.PropTypes.number,
      height: _react.PropTypes.number
    }),
    className: _react.PropTypes.string,
    style: _react.PropTypes.object,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node])
  };
  function Surface(props) {
    var children = props.children;
    var width = props.width;
    var height = props.height;
    var viewBox = props.viewBox;
    var className = props.className;
    var style = props.style;
  
    var others = _objectWithoutProperties(props, ['children', 'width', 'height', 'viewBox', 'className', 'style']);
  
    var svgView = viewBox || { width: width, height: height, x: 0, y: 0 };
    var layerClass = (0, _classnames2.default)('recharts-surface', className);
    var attrs = (0, _ReactUtils.getPresentationAttributes)(others);
  
    return _react2.default.createElement('svg', _extends({}, attrs, {
      className: layerClass,
      width: width,
      height: height,
      style: style,
      viewBox: svgView.x + ' ' + svgView.y + ' ' + svgView.width + ' ' + svgView.height,
      version: '1.1'
    }), children);
  }
  
  Surface.propTypes = propTypes;
  
  exports.default = Surface;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _keys = __webpack_require__(58);
  
  var _keys2 = _interopRequireDefault2(_keys);
  
  var _defineProperty2 = __webpack_require__(59);
  
  var _defineProperty3 = _interopRequireDefault2(_defineProperty2);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.filterSvgElements = exports.isSsr = exports.validateWidthHeight = exports.filterEventsOfChild = exports.filterEventAttributes = exports.getPresentationAttributes = exports.withoutType = exports.findChildByType = exports.findAllByType = exports.getDisplayName = exports.PRESENTATION_ATTRIBUTES = undefined;
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isObject2 = __webpack_require__(62);
  
  var _isObject3 = _interopRequireDefault(_isObject2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _isArray2 = __webpack_require__(64);
  
  var _isArray3 = _interopRequireDefault(_isArray2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      (0, _defineProperty3.default)(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }return obj;
  }
  
  var PRESENTATION_ATTRIBUTES = exports.PRESENTATION_ATTRIBUTES = {
    alignmentBaseline: _react.PropTypes.string,
    baselineShift: _react.PropTypes.string,
    clip: _react.PropTypes.string,
    clipPath: _react.PropTypes.string,
    clipRule: _react.PropTypes.string,
    color: _react.PropTypes.string,
    colorInterpolation: _react.PropTypes.string,
    colorInterpolationFilters: _react.PropTypes.string,
    colorProfile: _react.PropTypes.string,
    colorRendering: _react.PropTypes.string,
    cursor: _react.PropTypes.string,
    direction: _react.PropTypes.oneOf(['ltr', 'rtl', 'inherit']),
    display: _react.PropTypes.string,
    dominantBaseline: _react.PropTypes.string,
    enableBackground: _react.PropTypes.string,
    fill: _react.PropTypes.string,
    fillOpacity: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    fillRule: _react.PropTypes.oneOf(['nonzero', 'evenodd', 'inherit']),
    filter: _react.PropTypes.string,
    floodColor: _react.PropTypes.string,
    floodOpacity: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    font: _react.PropTypes.string,
    fontFamily: _react.PropTypes.string,
    fontSize: _react.PropTypes.number,
    fontSizeAdjust: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    fontStretch: _react.PropTypes.oneOf(['normal', 'wider', 'narrower', 'ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded', 'inherit']),
    fontStyle: _react.PropTypes.oneOf(['normal', 'italic', 'oblique', 'inherit']),
    fontVariant: _react.PropTypes.oneOf(['normal', 'small-caps', 'inherit']),
    fontWeight: _react.PropTypes.oneOf(['normal', 'bold', 'bolder', 'lighter', 100, 200, 300, 400, 500, 600, 700, 800, 900, 'inherit']),
    glyphOrientationHorizontal: _react.PropTypes.string,
    glyphOrientationVertical: _react.PropTypes.string,
    imageRendering: _react.PropTypes.oneOf(['auto', 'optimizeSpeed', 'optimizeQuality', 'inherit']),
    kerning: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    letterSpacing: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    lightingColor: _react.PropTypes.string,
    markerEnd: _react.PropTypes.string,
    markerMid: _react.PropTypes.string,
    markerStart: _react.PropTypes.string,
    mask: _react.PropTypes.string,
    opacity: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    overflow: _react.PropTypes.oneOf(['visible', 'hidden', 'scroll', 'auto', 'inherit']),
    pointerEvents: _react.PropTypes.oneOf(['visiblePainted', 'visibleFill', 'visibleStroke', 'visible', 'painted', 'fill', 'stroke', 'all', 'none', 'inherit']),
    shapeRendering: _react.PropTypes.oneOf(['auto', 'optimizeSpeed', 'crispEdges', 'geometricPrecision', 'inherit']),
    stopColor: _react.PropTypes.string,
    stopOpacity: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    stroke: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    strokeDasharray: _react.PropTypes.string,
    strokeDashoffset: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    strokeLinecap: _react.PropTypes.oneOf(['butt', 'round', 'square', 'inherit']),
    strokeLinejoin: _react.PropTypes.oneOf(['miter', 'round', 'bevel', 'inherit']),
    strokeMiterlimit: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    strokeOpacity: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    strokeWidth: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    textAnchor: _react.PropTypes.oneOf(['start', 'middle', 'end', 'inherit']),
    textDecoration: _react.PropTypes.oneOf(['none', 'underline', 'overline', 'line-through', 'blink', 'inherit']),
    textRendering: _react.PropTypes.oneOf(['auto', 'optimizeSpeed', 'optimizeLegibility', 'geometricPrecision', 'inherit']),
    unicodeBidi: _react.PropTypes.oneOf(['normal', 'embed', 'bidi-override', 'inherit']),
    visibility: _react.PropTypes.oneOf(['visible', 'hidden', 'collapse', 'inherit']),
    wordSpacing: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    writingMode: _react.PropTypes.oneOf(['lr-tb', 'rl-tb', 'tb-rl', 'lr', 'rl', 'tb', 'inherit']),
    transform: _react.PropTypes.string,
    style: _react.PropTypes.object,
  
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    dx: _react.PropTypes.number,
    dy: _react.PropTypes.number,
    x: _react.PropTypes.number,
    y: _react.PropTypes.number,
    r: _react.PropTypes.number
  };
  
  var EVENT_ATTRIBUTES = {
    onClick: _react.PropTypes.func,
    onMouseDown: _react.PropTypes.func,
    onMouseUp: _react.PropTypes.func,
    onMouseOver: _react.PropTypes.func,
    onMouseMove: _react.PropTypes.func,
    onMouseOut: _react.PropTypes.func,
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func
  };
  /**
   * Get the display name of a component
   * @param  {Object} Comp Specified Component
   * @return {String}      Display name of Component
   */
  var getDisplayName = exports.getDisplayName = function getDisplayName(Comp) {
    if (!Comp) {
      return '';
    }
    if (typeof Comp === 'string') {
      return Comp;
    }
    return Comp.displayName || Comp.name || 'Component';
  };
  
  /*
   * Find and return all matched children by type. `type` can be a React element class or
   * string
   */
  var findAllByType = exports.findAllByType = function findAllByType(children, type) {
    var result = [];
    var types = [];
  
    if ((0, _isArray3.default)(type)) {
      types = type.map(function (t) {
        return getDisplayName(t);
      });
    } else {
      types = [getDisplayName(type)];
    }
  
    _react2.default.Children.forEach(children, function (child) {
      var childType = child && child.type && (child.type.displayName || child.type.name);
      if (types.indexOf(childType) !== -1) {
        result.push(child);
      }
    });
  
    return result;
  };
  /*
   * Return the first matched child by type, return null otherwise.
   * `type` can be a React element class or string.
   */
  var findChildByType = exports.findChildByType = function findChildByType(children, type) {
    var result = findAllByType(children, type);
  
    return result && result[0];
  };
  
  /*
   * Create a new array of children excluding the ones matched the type
   */
  var withoutType = exports.withoutType = function withoutType(children, type) {
    var newChildren = [];
    var types = void 0;
  
    if ((0, _isArray3.default)(type)) {
      types = type.map(function (t) {
        return getDisplayName(t);
      });
    } else {
      types = [getDisplayName(type)];
    }
  
    _react2.default.Children.forEach(children, function (child) {
      if (child && child.type && child.type.displayName && types.indexOf(child.type.displayName) !== -1) {
        return;
      }
      newChildren.push(child);
    });
  
    return newChildren;
  };
  
  /**
   * get all the presentation attribute of svg element
   * @param  {Object} el A react element or the props of a react element
   * @return {Object}    attributes or null
   */
  var getPresentationAttributes = exports.getPresentationAttributes = function getPresentationAttributes(el) {
    if (!el || (0, _isFunction3.default)(el)) {
      return null;
    }
  
    var props = _react2.default.isValidElement(el) ? el.props : el;
  
    if (!(0, _isObject3.default)(props)) {
      return null;
    }
  
    var keys = (0, _keys2.default)(props).filter(function (k) {
      return PRESENTATION_ATTRIBUTES[k];
    });
  
    return keys && keys.length ? keys.reduce(function (result, k) {
      return _extends({}, result, _defineProperty({}, k, props[k]));
    }, {}) : null;
  };
  
  /**
   * get all the event attribute of svg element
   * @param  {Object} el A react element or the props of a react element
   * @return {Object}    attributes or null
   */
  var filterEventAttributes = exports.filterEventAttributes = function filterEventAttributes(el) {
    if (!el || (0, _isFunction3.default)(el)) {
      return null;
    }
  
    var props = _react2.default.isValidElement(el) ? el.props : el;
  
    if (!(0, _isObject3.default)(props)) {
      return null;
    }
  
    var keys = (0, _keys2.default)(props).filter(function (k) {
      return EVENT_ATTRIBUTES[k];
    });
  
    return keys && keys.length ? keys.reduce(function (result, k) {
      return _extends({}, result, _defineProperty({}, k, props[k]));
    }, {}) : null;
  };
  
  var getEventHandler = function getEventHandler(originalHandler, data, index) {
    return function (e) {
      originalHandler(data, index, e);
  
      return null;
    };
  };
  
  var filterEventsOfChild = exports.filterEventsOfChild = function filterEventsOfChild(props, data, index) {
    if (!(0, _isObject3.default)(props)) {
      return null;
    }
  
    var events = (0, _keys2.default)(props).filter(function (k) {
      return EVENT_ATTRIBUTES[k] && (0, _isFunction3.default)(props[k]);
    });
  
    return events && events.length ? events.reduce(function (result, e) {
      return _extends({}, result, _defineProperty({}, e, getEventHandler(props[e], data, index)));
    }, {}) : null;
  };
  
  /**
   * validate the width and height props of a chart element
   * @param  {Object} el A chart element
   * @return {Boolean}   true If the props width and height are number, and greater than 0
   */
  var validateWidthHeight = exports.validateWidthHeight = function validateWidthHeight(el) {
    if (!el || !el.props) {
      return false;
    }
    var _el$props = el.props;
    var width = _el$props.width;
    var height = _el$props.height;
  
    if (!(0, _isNumber3.default)(width) || width <= 0 || !(0, _isNumber3.default)(height) || height <= 0) {
      return false;
    }
  
    return true;
  };
  
  var isSsr = exports.isSsr = function isSsr() {
    return typeof document === 'undefined';
  };
  
  var SVG_TAGS = ['a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColormatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-url', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'lineGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'];
  /**
   * Filter all the svg elements of children
   * @param  {Array} children The children of a react element
   * @return {Array}          All the svg elements
   */
  var filterSvgElements = exports.filterSvgElements = function filterSvgElements(children) {
    var svgElements = [];
  
    _react2.default.Children.forEach(children, function (entry) {
      if (entry && entry.type && (0, _isString3.default)(entry.type) && SVG_TAGS.indexOf(entry.type) >= 0) {
        svgElements.push(entry);
      }
    });
  
    return svgElements;
  };

/***/ }),
/* 58 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/object/keys");

/***/ }),
/* 59 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/object/define-property");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

  module.exports = require("lodash/isString");

/***/ }),
/* 61 */
/***/ (function(module, exports) {

  module.exports = require("lodash/isNumber");

/***/ }),
/* 62 */
/***/ (function(module, exports) {

  module.exports = require("lodash/isObject");

/***/ }),
/* 63 */
/***/ (function(module, exports) {

  module.exports = require("lodash/isFunction");

/***/ }),
/* 64 */
/***/ (function(module, exports) {

  module.exports = require("lodash/isArray");

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  } /**
     * @fileOverview Layer
     */
  
  var propTypes = {
    className: _react.PropTypes.string,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node])
  };
  
  function Layer(props) {
    var children = props.children;
    var className = props.className;
  
    var others = _objectWithoutProperties(props, ['children', 'className']);
  
    var layerClass = (0, _classnames2.default)('recharts-layer', className);
  
    return _react2.default.createElement('g', _extends({ className: layerClass }, others), children);
  }
  
  Layer.propTypes = propTypes;
  
  exports.default = Layer;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Legend
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _server = __webpack_require__(12);
  
  var _server2 = _interopRequireDefault(_server);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _DefaultLegendContent = __webpack_require__(74);
  
  var _DefaultLegendContent2 = _interopRequireDefault(_DefaultLegendContent);
  
  var _DOMUtils = __webpack_require__(77);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var SIZE = 32;
  
  var renderContent = function renderContent(content, props) {
    if (_react2.default.isValidElement(content)) {
      return _react2.default.cloneElement(content, props);
    } else if ((0, _isFunction3.default)(content)) {
      return content(props);
    }
  
    return _react2.default.createElement(_DefaultLegendContent2.default, props);
  };
  
  var Legend = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Legend, _Component);
  
    function Legend() {
      _classCallCheck(this, Legend);
  
      return _possibleConstructorReturn(this, (Legend.__proto__ || (0, _getPrototypeOf2.default)(Legend)).apply(this, arguments));
    }
  
    _createClass(Legend, [{
      key: 'getDefaultPosition',
      value: function getDefaultPosition(style) {
        var _props = this.props;
        var layout = _props.layout;
        var align = _props.align;
        var verticalAlign = _props.verticalAlign;
        var margin = _props.margin;
        var chartWidth = _props.chartWidth;
        var chartHeight = _props.chartHeight;
  
        var hPos = void 0;
        var vPos = void 0;
  
        if (!style || (style.left === undefined || style.left === null) && (style.right === undefined || style.right === null)) {
          if (align === 'center' && layout === 'vertical') {
            var box = Legend.getLegendBBox(this.props) || { width: 0 };
            hPos = { left: ((chartWidth || 0) - box.width) / 2 };
          } else {
            hPos = align === 'right' ? { right: margin && margin.right || 0 } : { left: margin && margin.left || 0 };
          }
        }
  
        if (!style || (style.top === undefined || style.top === null) && (style.bottom === undefined || style.bottom === null)) {
          if (verticalAlign === 'middle') {
            var _box = Legend.getLegendBBox(this.props) || { height: 0 };
            vPos = { top: ((chartHeight || 0) - _box.height) / 2 };
          } else {
            vPos = verticalAlign === 'bottom' ? { bottom: margin && margin.bottom || 0 } : { top: margin && margin.top || 0 };
          }
        }
  
        return _extends({}, hPos, vPos);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props;
        var content = _props2.content;
        var width = _props2.width;
        var height = _props2.height;
        var layout = _props2.layout;
        var wrapperStyle = _props2.wrapperStyle;
  
        var outerStyle = _extends({
          position: 'absolute',
          width: width || 'auto',
          height: height || 'auto'
        }, this.getDefaultPosition(wrapperStyle), wrapperStyle);
  
        return _react2.default.createElement('div', { className: 'recharts-legend-wrapper', style: outerStyle }, renderContent(content, this.props));
      }
    }], [{
      key: 'getWithHeight',
      value: function getWithHeight(item, chartWidth, chartHeight) {
        var layout = item.props.layout;
  
        if (layout === 'vertical' && (0, _isNumber3.default)(item.props.height)) {
          return {
            height: item.props.height
          };
        } else if (layout === 'horizontal') {
          return {
            width: item.props.width || chartWidth
          };
        }
  
        return null;
      }
    }, {
      key: 'getLegendBBox',
      value: function getLegendBBox(props) {
        if (!(0, _ReactUtils.isSsr)()) {
          var content = props.content;
          var width = props.width;
          var height = props.height;
          var wrapperStyle = props.wrapperStyle;
  
          var contentHtml = _server2.default.renderToStaticMarkup(renderContent(content, props));
          var style = _extends({
            // solve the problem temporarily that the width and height will be affect by the global css
            fontSize: 12,
            position: 'absolute',
            width: width || 'auto',
            height: height || 'auto'
          }, wrapperStyle, {
            top: -20000,
            left: 0,
            display: 'block'
          });
          var wrapper = document.createElement('div');
  
          wrapper.setAttribute('style', (0, _DOMUtils.getStyleString)(style));
          wrapper.innerHTML = contentHtml;
          document.body.appendChild(wrapper);
          var box = wrapper.getBoundingClientRect();
  
          document.body.removeChild(wrapper);
  
          return box;
        }
  
        return null;
      }
    }]);
  
    return Legend;
  }(_react.Component), _class2.displayName = 'Legend', _class2.propTypes = {
    content: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
    wrapperStyle: _react.PropTypes.object,
    chartWidth: _react.PropTypes.number,
    chartHeight: _react.PropTypes.number,
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    iconSize: _react.PropTypes.number,
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    align: _react.PropTypes.oneOf(['center', 'left', 'right']),
    verticalAlign: _react.PropTypes.oneOf(['top', 'bottom', 'middle']),
    margin: _react.PropTypes.shape({
      top: _react.PropTypes.number,
      left: _react.PropTypes.number,
      bottom: _react.PropTypes.number,
      right: _react.PropTypes.number
    }),
    payload: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      value: _react.PropTypes.any,
      id: _react.PropTypes.any,
      type: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    }))
  }, _class2.defaultProps = {
    iconSize: 14,
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom'
  }, _temp)) || _class;
  
  exports.default = Legend;

/***/ }),
/* 67 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/object/create");

/***/ }),
/* 68 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/helpers/typeof");

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _keys = __webpack_require__(58);
  
  var _keys2 = _interopRequireDefault2(_keys);
  
  var _iterator = __webpack_require__(70);
  
  var _iterator2 = _interopRequireDefault2(_iterator);
  
  var _typeof3 = __webpack_require__(68);
  
  var _typeof4 = _interopRequireDefault2(_typeof3);
  
  var _symbol = __webpack_require__(71);
  
  var _symbol2 = _interopRequireDefault2(_symbol);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shallowEqual = undefined;
  
  var _isPlainObject2 = __webpack_require__(72);
  
  var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);
  
  var _isEqual2 = __webpack_require__(73);
  
  var _isEqual3 = _interopRequireDefault(_isEqual2);
  
  var _isArray2 = __webpack_require__(64);
  
  var _isArray3 = _interopRequireDefault(_isArray2);
  
  var _typeof = typeof _symbol2.default === "function" && (0, _typeof4.default)(_iterator2.default) === "symbol" ? function (obj) {
    return typeof obj === 'undefined' ? 'undefined' : (0, _typeof4.default)(obj);
  } : function (obj) {
    return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === 'undefined' ? 'undefined' : (0, _typeof4.default)(obj);
  };
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }
  
    if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
      return false;
    }
  
    var keysA = (0, _keys2.default)(objA);
    var keysB = (0, _keys2.default)(objB);
  
    if (keysA.length !== keysB.length) {
      return false;
    }
  
    var bHasOwnProperty = hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
      var keyA = keysA[i];
  
      if (objA[keyA] === objB[keyA]) {
        continue;
      }
  
      // special diff with Array or Object
      if ((0, _isArray3.default)(objA[keyA])) {
        if (!(0, _isArray3.default)(objB[keyA]) || objA[keyA].length !== objB[keyA].length) {
          return false;
        } else if (!(0, _isEqual3.default)(objA[keyA], objB[keyA])) {
          return false;
        }
      } else if ((0, _isPlainObject3.default)(objA[keyA])) {
        if (!(0, _isPlainObject3.default)(objB[keyA]) || !(0, _isEqual3.default)(objA[keyA], objB[keyA])) {
          return false;
        }
      } else if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }
  
    return true;
  }
  
  function shallowCompare(instance, nextProps, nextState) {
    return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
  }
  
  function shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  /* eslint-disable no-param-reassign */
  function pureRenderDecorator(component) {
    component.prototype.shouldComponentUpdate = shouldComponentUpdate;
  }
  exports.shallowEqual = shallowEqual;
  exports.default = pureRenderDecorator;

/***/ }),
/* 70 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/symbol/iterator");

/***/ }),
/* 71 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/symbol");

/***/ }),
/* 72 */
/***/ (function(module, exports) {

  module.exports = require("lodash/isPlainObject");

/***/ }),
/* 73 */
/***/ (function(module, exports) {

  module.exports = require("lodash/isEqual");

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Default Legend Content
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _Symbols = __webpack_require__(75);
  
  var _Symbols2 = _interopRequireDefault(_Symbols);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var PI = Math.PI;
  var SIZE = 32;
  
  var DefaultLegendContent = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(DefaultLegendContent, _Component);
  
    function DefaultLegendContent() {
      _classCallCheck(this, DefaultLegendContent);
  
      return _possibleConstructorReturn(this, (DefaultLegendContent.__proto__ || (0, _getPrototypeOf2.default)(DefaultLegendContent)).apply(this, arguments));
    }
  
    _createClass(DefaultLegendContent, [{
      key: 'renderIcon',
  
      /**
       * Render the path of icon
       * @param {Object} data Data of each legend item
       * @return {String} Path element
       */
      value: function renderIcon(data) {
        var color = data.color;
  
        var halfSize = SIZE / 2;
        var sixthSize = SIZE / 6;
        var thirdSize = SIZE / 3;
  
        if (data.type === 'line') {
          return _react2.default.createElement('path', {
            strokeWidth: 4,
            fill: 'none',
            stroke: color,
            d: 'M0,' + halfSize + 'h' + thirdSize + '\n            A' + sixthSize + ',' + sixthSize + ',0,1,1,' + 2 * thirdSize + ',' + halfSize + '\n            H' + SIZE + 'M' + 2 * thirdSize + ',' + halfSize + '\n            A' + sixthSize + ',' + sixthSize + ',0,1,1,' + thirdSize + ',' + halfSize,
            className: 'recharts-legend-icon'
          });
        } else if (data.type === 'rect') {
          return _react2.default.createElement('path', {
            stroke: 'none',
            fill: color,
            d: 'M0,' + SIZE / 8 + 'h' + SIZE + 'v' + SIZE * 3 / 4 + 'h' + -SIZE + 'z',
            className: 'recharts-legend-icon'
          });
        }
  
        return _react2.default.createElement(_Symbols2.default, {
          fill: color,
          cx: halfSize,
          cy: halfSize,
          size: SIZE,
          sizeType: 'diameter',
          type: data.type
        });
      }
  
      /**
       * Draw items of legend
       * @return {ReactElement} Items
       */
  
    }, {
      key: 'renderItems',
      value: function renderItems() {
        var _this2 = this;
  
        var _props = this.props;
        var payload = _props.payload;
        var iconSize = _props.iconSize;
        var layout = _props.layout;
  
        var viewBox = { x: 0, y: 0, width: SIZE, height: SIZE };
        var itemStyle = {
          display: layout === 'horizontal' ? 'inline-block' : 'block',
          marginRight: 10
        };
        var svgStyle = { display: 'inline-block', verticalAlign: 'middle', marginRight: 4 };
  
        return payload.map(function (entry, i) {
          return _react2.default.createElement('li', {
            className: 'recharts-legend-item legend-item-' + i,
            style: itemStyle,
            key: 'legend-item-' + i
          }, _react2.default.createElement(_Surface2.default, { width: iconSize, height: iconSize, viewBox: viewBox, style: svgStyle }, _this2.renderIcon(entry, iconSize)), _react2.default.createElement('span', { className: 'recharts-legend-item-text' }, entry.value));
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props;
        var payload = _props2.payload;
        var layout = _props2.layout;
        var align = _props2.align;
  
        if (!payload || !payload.length) {
          return null;
        }
  
        var finalStyle = {
          padding: 0,
          margin: 0,
          textAlign: layout === 'horizontal' ? align : 'left'
        };
  
        return _react2.default.createElement('ul', { className: 'recharts-default-legend', style: finalStyle }, this.renderItems());
      }
    }]);
  
    return DefaultLegendContent;
  }(_react.Component), _class2.displayName = 'Legend', _class2.propTypes = {
    content: _react.PropTypes.element,
    iconSize: _react.PropTypes.number,
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    align: _react.PropTypes.oneOf(['center', 'left', 'right']),
    verticalAlign: _react.PropTypes.oneOf(['top', 'bottom', 'middle']),
    payload: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      value: _react.PropTypes.any,
      id: _react.PropTypes.any,
      type: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    }))
  }, _class2.defaultProps = {
    iconSize: 14,
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'middle'
  }, _temp)) || _class;
  
  exports.default = DefaultLegendContent;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Curve
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _d3Shape = __webpack_require__(76);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var SYMBOL_FACTORIES = {
    symbolCircle: _d3Shape.symbolCircle, symbolCross: _d3Shape.symbolCross, symbolDiamond: _d3Shape.symbolDiamond,
    symbolSquare: _d3Shape.symbolSquare, symbolStar: _d3Shape.symbolStar, symbolTriangle: _d3Shape.symbolTriangle, symbolWye: _d3Shape.symbolWye
  };
  var RADIAN = Math.PI / 180;
  
  var getSymbolFactory = function getSymbolFactory(type) {
    var name = 'symbol' + type.slice(0, 1).toUpperCase() + type.slice(1);
  
    return SYMBOL_FACTORIES[name] || _d3Shape.symbolCircle;
  };
  
  var calculateAreaSize = function calculateAreaSize(size, sizeType, type) {
    if (sizeType === 'area') {
      return size;
    }
  
    switch (type) {
      case 'cross':
        return 5 * size * size / 9;
      case 'diamond':
        return 0.5 * size * size / Math.sqrt(3);
      case 'square':
        return size * size;
      case 'star':
        {
          var angle = 18 * RADIAN;
  
          return 1.25 * size * size * (Math.tan(angle) - Math.tan(angle * 2) * Math.pow(Math.tan(angle), 2));
        }
      case 'triangle':
        return Math.sqrt(3) * size * size / 4;
      case 'wye':
        return (21 - 10 * Math.sqrt(3)) * size * size / 8;
      default:
        return Math.PI * size * size / 4;
    }
  };
  
  var Symbols = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Symbols, _Component);
  
    function Symbols() {
      _classCallCheck(this, Symbols);
  
      return _possibleConstructorReturn(this, (Symbols.__proto__ || (0, _getPrototypeOf2.default)(Symbols)).apply(this, arguments));
    }
  
    _createClass(Symbols, [{
      key: 'getPath',
  
      /**
       * Calculate the path of curve
       * @return {String} path
       */
      value: function getPath() {
        var _props = this.props;
        var size = _props.size;
        var sizeType = _props.sizeType;
        var type = _props.type;
  
        var symbolFactory = getSymbolFactory(type);
        var symbol = (0, _d3Shape.symbol)().type(symbolFactory).size(calculateAreaSize(size, sizeType, type));
  
        return symbol();
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props;
        var className = _props2.className;
        var cx = _props2.cx;
        var cy = _props2.cy;
        var size = _props2.size;
  
        if (cx === +cx && cy === +cy && size === +size) {
  
          return _react2.default.createElement('path', _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), (0, _ReactUtils.filterEventAttributes)(this.props), {
            className: (0, _classnames2.default)('recharts-symbols', className),
            transform: 'translate(' + cx + ', ' + cy + ')',
            d: this.getPath()
          }));
        }
  
        return null;
      }
    }]);
  
    return Symbols;
  }(_react.Component), _class2.displayName = 'Symbols', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    type: _react.PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
    cx: _react.PropTypes.number,
    cy: _react.PropTypes.number,
    size: _react.PropTypes.number,
    sizeType: _react.PropTypes.oneOf(['area', 'diameter'])
  }), _class2.defaultProps = {
    type: 'circle',
    stroke: 'none',
    fill: '#000',
    size: 64,
    sizeType: 'area'
  }, _temp)) || _class;
  
  exports.default = Symbols;

/***/ }),
/* 76 */
/***/ (function(module, exports) {

  module.exports = require("d3-shape");

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _keys = __webpack_require__(58);
  
  var _keys2 = _interopRequireDefault(_keys);
  
  var _from = __webpack_require__(78);
  
  var _from2 = _interopRequireDefault(_from);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault(_assign);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.calculateChartCoordinate = exports.getOffset = exports.getStringSize = exports.getStyleString = undefined;
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _ReactUtils = __webpack_require__(57);
  
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    } else {
      return (0, _from2.default)(arr);
    }
  }
  
  var stringCache = {
    widthCache: {},
    cacheCount: 0
  };
  var MAX_CACHE_NUM = 2000;
  var SPAN_STYLE = {
    position: 'absolute',
    top: '-20000px',
    left: 0,
    padding: 0,
    margin: 0,
    border: 'none',
    whiteSpace: 'pre'
  };
  var STYLE_LIST = ['minWidth', 'maxWidth', 'width', 'minHeight', 'maxHeight', 'height', 'top', 'left', 'fontSize', 'lineHeight', 'padding', 'margin', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom'];
  var MEASUREMENT_SPAN_ID = 'recharts_measurement_span';
  
  function autoCompleteStyle(name, value) {
    if (STYLE_LIST.indexOf(name) >= 0 && value === +value) {
      return value + 'px';
    }
  
    return value;
  }
  
  function camelToMiddleLine(text) {
    var strs = text.split('');
  
    var formatStrs = strs.reduce(function (result, entry) {
      if (entry === entry.toUpperCase()) {
        return [].concat(_toConsumableArray(result), ['-', entry.toLowerCase()]);
      }
  
      return [].concat(_toConsumableArray(result), [entry]);
    }, []);
  
    return formatStrs.join('');
  }
  
  function getComputedStyles(el) {
    return el.ownerDocument.defaultView.getComputedStyle(el, null);
  }
  
  var getStyleString = exports.getStyleString = function getStyleString(style) {
    return (0, _keys2.default)(style).reduce(function (result, s) {
      return '' + result + camelToMiddleLine(s) + ':' + autoCompleteStyle(s, style[s]) + ';';
    }, '');
  };
  
  var getStringSize = exports.getStringSize = function getStringSize(text) {
    var style = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  
    if (text === undefined || text === null || (0, _ReactUtils.isSsr)()) {
      return 0;
    }
  
    var str = '' + text;
    var styleString = getStyleString(style);
    var cacheKey = str + '-' + styleString;
  
    if (stringCache.widthCache[cacheKey]) {
      return stringCache.widthCache[cacheKey];
    }
  
    var measurementSpan = document.getElementById(MEASUREMENT_SPAN_ID);
    if (!measurementSpan) {
      measurementSpan = document.createElement('span');
      measurementSpan.setAttribute('id', MEASUREMENT_SPAN_ID);
      document.body.appendChild(measurementSpan);
    }
  
    measurementSpan.setAttribute('style', getStyleString(_extends({}, SPAN_STYLE, style)));
    measurementSpan.textContent = str;
  
    var rect = measurementSpan.getBoundingClientRect();
    var result = { width: rect.width, height: rect.height };
  
    stringCache.widthCache[cacheKey] = result;
  
    if (++stringCache.cacheCount > MAX_CACHE_NUM) {
      stringCache.cacheCount = 0;
      stringCache.widthCache = {};
    }
  
    return result;
  };
  
  var getOffset = exports.getOffset = function getOffset(el) {
    var html = el.ownerDocument.documentElement;
    var box = { top: 0, left: 0 };
  
    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof el.getBoundingClientRect !== 'undefined') {
      box = el.getBoundingClientRect();
    }
  
    return {
      top: box.top + window.pageYOffset - html.clientTop,
      left: box.left + window.pageXOffset - html.clientLeft
    };
  };
  
  /**
   * Calculate coordinate of cursor in chart
   * @param  {Object} event  Event object
   * @param  {Object} offset The offset of main part in the svg element
   * @return {Object}        {chartX, chartY}
   */
  var calculateChartCoordinate = exports.calculateChartCoordinate = function calculateChartCoordinate(event, offset) {
    return {
      chartX: Math.round(event.pageX - offset.left),
      chartY: Math.round(event.pageY - offset.top)
    };
  };

/***/ }),
/* 78 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/array/from");

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _temp;
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  }; /**
      * @fileOverview Tooltip
      */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _server = __webpack_require__(12);
  
  var _server2 = _interopRequireDefault(_server);
  
  var _DefaultTooltipContent = __webpack_require__(80);
  
  var _DefaultTooltipContent2 = _interopRequireDefault(_DefaultTooltipContent);
  
  var _DOMUtils = __webpack_require__(77);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var propTypes = {
    content: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
    viewBox: _react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      width: _react.PropTypes.number,
      height: _react.PropTypes.number
    }),
  
    active: _react.PropTypes.bool,
    separator: _react.PropTypes.string,
    formatter: _react.PropTypes.func,
    offset: _react.PropTypes.number,
  
    itemStyle: _react.PropTypes.object,
    labelStyle: _react.PropTypes.object,
    wrapperStyle: _react.PropTypes.object,
    cursor: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.element, _react.PropTypes.object]),
  
    coordinate: _react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number
    }),
  
    label: _react.PropTypes.any,
    payload: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      name: _react.PropTypes.any,
      value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
      unit: _react.PropTypes.any
    })),
  
    isAnimationActive: _react.PropTypes.bool,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
    itemSorter: _react.PropTypes.func
  };
  
  var defaultProps = {
    active: false,
    offset: 10,
    viewBox: { x1: 0, x2: 0, y1: 0, y2: 0 },
    coordinate: { x: 0, y: 0 },
    cursorStyle: {},
    separator: ' : ',
    wrapperStyle: {},
    itemStyle: {},
    labelStyle: {},
    cursor: true,
    isAnimationActive: true,
    animationEasing: 'ease',
    animationDuration: 400,
    itemSorter: function itemSorter(item1, item2) {
      return -1;
    }
  };
  
  var getTooltipBBox = function getTooltipBBox(wrapperStyle, contentItem) {
    if (!(0, _ReactUtils.isSsr)()) {
      var contentHtml = _server2.default.renderToStaticMarkup(contentItem);
      var style = _extends({
        // solve the problem temporarily that the width and height will be affect by the global css
        fontSize: 12
      }, wrapperStyle, {
        top: -20000,
        left: 0,
        display: 'block'
      });
  
      var wrapper = document.createElement('div');
  
      wrapper.setAttribute('style', (0, _DOMUtils.getStyleString)(style));
      wrapper.innerHTML = contentHtml;
      document.body.appendChild(wrapper);
      var box = wrapper.getBoundingClientRect();
  
      document.body.removeChild(wrapper);
  
      return box;
    }
  
    return null;
  };
  
  var renderContent = function renderContent(content, props) {
    if (_react2.default.isValidElement(content)) {
      return _react2.default.cloneElement(content, props);
    } else if ((0, _isFunction3.default)(content)) {
      return content(props);
    }
  
    return _react2.default.createElement(_DefaultTooltipContent2.default, props);
  };
  
  var Tooltip = (_temp = _class = function (_Component) {
    _inherits(Tooltip, _Component);
  
    function Tooltip() {
      _classCallCheck(this, Tooltip);
  
      return _possibleConstructorReturn(this, (Tooltip.__proto__ || (0, _getPrototypeOf2.default)(Tooltip)).apply(this, arguments));
    }
  
    _createClass(Tooltip, [{
      key: 'render',
      value: function render() {
        var _props = this.props;
        var payload = _props.payload;
        var isAnimationActive = _props.isAnimationActive;
        var animationDuration = _props.animationDuration;
        var animationEasing = _props.animationEasing;
  
        if (!payload || !payload.length || !payload.filter(function (entry) {
          return (0, _isNumber3.default)(entry.value) || (0, _isString3.default)(entry.value);
        }).length) {
          return null;
        }
  
        var _props2 = this.props;
        var content = _props2.content;
        var viewBox = _props2.viewBox;
        var coordinate = _props2.coordinate;
        var active = _props2.active;
        var offset = _props2.offset;
        var wrapperStyle = _props2.wrapperStyle;
  
        var outerStyle = _extends({
          pointerEvents: 'none',
          display: active ? 'block' : 'none',
          position: 'absolute',
          top: 0
        }, wrapperStyle);
        var contentItem = renderContent(content, this.props);
        var box = getTooltipBBox(outerStyle, contentItem);
  
        if (!box) {
          return null;
        }
        var translateX = Math.max(coordinate.x + box.width + offset > viewBox.x + viewBox.width ? coordinate.x - box.width - offset : coordinate.x + offset, viewBox.x);
  
        var translateY = Math.max(coordinate.y + box.height + offset > viewBox.y + viewBox.height ? coordinate.y - box.height - offset : coordinate.y + offset, viewBox.y);
  
        return _react2.default.createElement(_reactSmooth2.default, {
          from: 'translate(' + translateX + 'px, ' + translateY + 'px)',
          to: 'translate(' + translateX + 'px, ' + translateY + 'px)',
          duration: animationDuration,
          isActive: isAnimationActive,
          easing: animationEasing,
          attributeName: 'transform'
        }, _react2.default.createElement('div', {
          className: 'recharts-tooltip-wrapper',
          style: outerStyle
        }, contentItem));
      }
    }]);
  
    return Tooltip;
  }(_react.Component), _class.displayName = 'Tooltip', _class.propTypes = propTypes, _class.defaultProps = defaultProps, _temp);
  exports.default = Tooltip;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Default Tooltip Content
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var DefaultTooltipContent = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(DefaultTooltipContent, _Component);
  
    function DefaultTooltipContent() {
      _classCallCheck(this, DefaultTooltipContent);
  
      return _possibleConstructorReturn(this, (DefaultTooltipContent.__proto__ || (0, _getPrototypeOf2.default)(DefaultTooltipContent)).apply(this, arguments));
    }
  
    _createClass(DefaultTooltipContent, [{
      key: 'renderContent',
      value: function renderContent() {
        var _props = this.props;
        var payload = _props.payload;
        var separator = _props.separator;
        var formatter = _props.formatter;
        var itemStyle = _props.itemStyle;
        var itemSorter = _props.itemSorter;
  
        if (payload && payload.length) {
          var listStyle = { padding: 0, margin: 0 };
  
          var items = payload.filter(function (entry) {
            return (0, _isNumber3.default)(entry.value) || (0, _isString3.default)(entry.value);
          }).sort(itemSorter).map(function (entry, i) {
            var finalItemStyle = _extends({
              display: 'block',
              paddingTop: 4,
              paddingBottom: 4,
              color: entry.color || '#000'
            }, itemStyle);
            var finalFormatter = entry.formatter || formatter;
  
            return _react2.default.createElement('li', { className: 'recharts-tooltip-item', key: 'tooltip-item-' + i, style: finalItemStyle }, _react2.default.createElement('span', { className: 'recharts-tooltip-item-name' }, entry.name), _react2.default.createElement('span', { className: 'recharts-tooltip-item-separator' }, separator), _react2.default.createElement('span', { className: 'recharts-tooltip-item-value' }, finalFormatter ? finalFormatter(entry.value, entry.name, entry) : entry.value), _react2.default.createElement('span', { className: 'recharts-tooltip-item-unit' }, entry.unit || ''));
          });
  
          return _react2.default.createElement('ul', { className: 'recharts-tooltip-item-list', style: listStyle }, items);
        }
  
        return null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props;
        var labelStyle = _props2.labelStyle;
        var label = _props2.label;
        var labelFormatter = _props2.labelFormatter;
        var wrapperStyle = _props2.wrapperStyle;
  
        var finalStyle = _extends({
          margin: 0,
          padding: 10,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          whiteSpace: 'nowrap'
        }, wrapperStyle);
        var finalLabelStyle = _extends({
          margin: 0
        }, labelStyle);
        var hasLabel = (0, _isNumber3.default)(label) || (0, _isString3.default)(label);
        var finalLabel = hasLabel ? label : '';
  
        if (hasLabel && labelFormatter) {
          finalLabel = labelFormatter(label);
        }
  
        return _react2.default.createElement('div', { className: 'recharts-default-tooltip', style: finalStyle }, _react2.default.createElement('p', { className: 'recharts-tooltip-label', style: finalLabelStyle }, finalLabel), this.renderContent());
      }
    }]);
  
    return DefaultTooltipContent;
  }(_react.Component), _class2.displayName = 'DefaultTooltipContent', _class2.propTypes = {
    separator: _react.PropTypes.string,
    formatter: _react.PropTypes.func,
    wrapperStyle: _react.PropTypes.object,
    itemStyle: _react.PropTypes.object,
    labelStyle: _react.PropTypes.object,
    labelFormatter: _react.PropTypes.func,
    label: _react.PropTypes.any,
    payload: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      name: _react.PropTypes.any,
      value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
      unit: _react.PropTypes.any
    })),
    itemSorter: _react.PropTypes.func
  }, _class2.defaultProps = {
    separator: ' : ',
    itemStyle: {},
    labelStyle: {}
  }, _temp)) || _class;
  
  exports.default = DefaultTooltipContent;

/***/ }),
/* 81 */
/***/ (function(module, exports) {

  module.exports = require("react-smooth");

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  }; /**
      * @fileOverview Wrapper component to make charts adapt to the size of parent * DOM
      */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reactContainerDimensions = __webpack_require__(83);
  
  var _reactContainerDimensions2 = _interopRequireDefault(_reactContainerDimensions);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _DataUtils = __webpack_require__(84);
  
  var _LogUtils = __webpack_require__(85);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  var render = function render(_ref) {
    var aspect = _ref.aspect;
    var width = _ref.width;
    var height = _ref.height;
    var minWidth = _ref.minWidth;
    var minHeight = _ref.minHeight;
    var container = _ref.container;
    var children = _ref.children;
  
    (0, _LogUtils.warn)((0, _DataUtils.isPercent)(width) || (0, _DataUtils.isPercent)(height), 'The width(%s) and height(%s) are both fixed numbers,\n     maybe you don\'t need to use a ResponsiveContainer.', width, height);
  
    (0, _LogUtils.warn)(!aspect || aspect > 0, 'The aspect(%s) must be greater than zero.', aspect);
  
    var calculatedWidth = (0, _DataUtils.isPercent)(width) ? container.width : width;
    var calculatedHeight = (0, _DataUtils.isPercent)(height) ? container.height : height;
  
    if (aspect && aspect > 0) {
      // Preserve the desired aspect ratio
      calculatedHeight = calculatedWidth / aspect;
    }
  
    (0, _LogUtils.warn)(calculatedWidth > 0 && calculatedHeight > 0, 'The width(%s) and height(%s) of chart should be greater than 0,\n     please check the style of container, or the props width(%s) and height(%s),\n     or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n     height and width.', calculatedWidth, calculatedHeight, width, height, minWidth, minHeight, aspect);
  
    return _react2.default.cloneElement(children, {
      width: calculatedWidth,
      height: calculatedHeight
    });
  };
  
  var ResponsiveContainer = function ResponsiveContainer(props) {
    var minWidth = props.minWidth;
    var minHeight = props.minHeight;
    var width = props.width;
    var height = props.height;
  
    var style = { width: width, height: height, minWidth: minWidth, minHeight: minHeight };
    return _react2.default.createElement('div', { className: 'recharts-responsive-container', style: style }, _react2.default.createElement(_reactContainerDimensions2.default, null, function (container) {
      return render(_extends({
        container: container
      }, props));
    }));
  };
  
  ResponsiveContainer.displayName = 'ResponsiveContainer';
  ResponsiveContainer.propTypes = {
    aspect: _react.PropTypes.number,
    width: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    height: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    minHeight: _react.PropTypes.number,
    minWidth: _react.PropTypes.number,
    children: _react.PropTypes.node.isRequired
  };
  
  ResponsiveContainer.defaultProps = {
    width: '100%',
    height: '100%'
  };
  
  exports.default = ResponsiveContainer;

/***/ }),
/* 83 */
/***/ (function(module, exports) {

  module.exports = require("react-container-dimensions");

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _keys = __webpack_require__(58);
  
  var _keys2 = _interopRequireDefault2(_keys);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hasDuplicate = exports.getAnyElementOfObject = exports.getBandSizeOfScale = exports.validateCoordinateInRange = exports.parseSpecifiedDomain = exports.getPercentValue = exports.isPercent = undefined;
  
  var _isArray2 = __webpack_require__(64);
  
  var _isArray3 = _interopRequireDefault(_isArray2);
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  var isPercent = exports.isPercent = function isPercent(value) {
    return (0, _isString3.default)(value) && value.indexOf('%') === value.length - 1;
  };
  /**
   * Get percent value of a total value
   * @param {Number|String} percent A percent
   * @param {Number} totalValue     Total value
   * @param {NUmber} defaultValue   The value returned when percent is undefined or invalid
   * @param {Boolean} validate      If set to be true, the result will be validated
   * @return {Number} value
   */
  var getPercentValue = exports.getPercentValue = function getPercentValue(percent, totalValue) {
    var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var validate = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
  
    if (!(0, _isNumber3.default)(percent) && !(0, _isString3.default)(percent)) {
      return defaultValue;
    }
  
    var value = void 0;
  
    if (isPercent(percent)) {
      var index = percent.indexOf('%');
      value = totalValue * parseFloat(percent.slice(0, index)) / 100;
    } else {
      value = +percent;
    }
  
    if (isNaN(value)) {
      value = defaultValue;
    }
  
    if (validate && value > totalValue) {
      value = totalValue;
    }
  
    return value;
  };
  
  var MIN_VALUE_REG = /^dataMin[\s]*-[\s]*([\d]+)$/;
  var MAX_VALUE_REG = /^dataMax[\s]*\+[\s]*([\d]+)$/;
  
  var parseSpecifiedDomain = exports.parseSpecifiedDomain = function parseSpecifiedDomain(specifiedDomain, dataDomain, allowDataOverflow) {
    if (!(0, _isArray3.default)(specifiedDomain)) {
      return dataDomain;
    }
  
    var domain = [];
  
    if ((0, _isNumber3.default)(specifiedDomain[0])) {
      domain[0] = allowDataOverflow ? specifiedDomain[0] : Math.min(specifiedDomain[0], dataDomain[0]);
    } else if (MIN_VALUE_REG.test(specifiedDomain[0])) {
      var value = +MIN_VALUE_REG.exec(specifiedDomain[0])[1];
  
      domain[0] = dataDomain[0] - value;
    } else {
      domain[0] = dataDomain[0];
    }
  
    if ((0, _isNumber3.default)(specifiedDomain[1])) {
      domain[1] = allowDataOverflow ? specifiedDomain[1] : Math.max(specifiedDomain[1], dataDomain[1]);
    } else if (MAX_VALUE_REG.test(specifiedDomain[1])) {
      var _value = +MAX_VALUE_REG.exec(specifiedDomain[1])[1];
  
      domain[1] = dataDomain[1] + _value;
    } else {
      domain[1] = dataDomain[1];
    }
  
    return domain;
  };
  
  var validateCoordinateInRange = exports.validateCoordinateInRange = function validateCoordinateInRange(coordinate, scale) {
    if (!scale) {
      return false;
    }
  
    var range = scale.range();
    var first = range[0];
    var last = range[range.length - 1];
    var isValidate = first <= last ? coordinate >= first && coordinate <= last : coordinate >= last && coordinate <= first;
  
    return isValidate;
  };
  
  /**
   * Calculate the size between two category
   * @param  {Function} scale Scale function
   * @return {Number} Size
   */
  var getBandSizeOfScale = exports.getBandSizeOfScale = function getBandSizeOfScale(scale) {
    if (scale && scale.bandwidth) {
      return scale.bandwidth();
    }
    return 0;
  };
  
  var getAnyElementOfObject = exports.getAnyElementOfObject = function getAnyElementOfObject(obj) {
    if (!obj) {
      return null;
    }
  
    var keys = (0, _keys2.default)(obj);
  
    if (keys && keys.length) {
      return obj[keys[0]];
    }
  
    return null;
  };
  
  var hasDuplicate = exports.hasDuplicate = function hasDuplicate(ary) {
    if (!(0, _isArray3.default)(ary)) {
      return false;
    }
  
    var len = ary.length;
    var cache = {};
  
    for (var i = 0; i < len; i++) {
      if (!cache[ary[i]]) {
        cache[ary[i]] = true;
      } else {
        return true;
      }
    }
  
    return false;
  };

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* eslint no-console: 0 */
  var isDev = ("development") !== 'production';
  
  var warn = exports.warn = function warn(condition, format, a, b, c, d, e, f) {
    if (isDev && typeof console !== 'undefined' && console.warn) {
      if (format === undefined) {
        console.warn('LogUtils requires an error message argument');
      }
  
      if (!condition) {
        if (format === undefined) {
          console.warn('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
        } else {
          (function () {
            var args = [a, b, c, d, e, f];
            var argIndex = 0;
  
            console.warn(format.replace(/%s/g, function () {
              return args[argIndex++];
            }));
          })();
        }
      }
    }
  };

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Cross
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Cell = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Cell, _Component);
  
    function Cell() {
      _classCallCheck(this, Cell);
  
      return _possibleConstructorReturn(this, (Cell.__proto__ || (0, _getPrototypeOf2.default)(Cell)).apply(this, arguments));
    }
  
    _createClass(Cell, [{
      key: 'render',
      value: function render() {
        return null;
      }
    }]);
  
    return Cell;
  }(_react.Component), _class2.displayName = 'Cell', _temp)) || _class;
  
  exports.default = Cell;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign4 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _assign2 = __webpack_require__(88);
  
  var _assign3 = _interopRequireDefault(_assign2);
  
  var _extends = _assign4.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _temp2;
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reduceCssCalc = __webpack_require__(89);
  
  var _reduceCssCalc2 = _interopRequireDefault(_reduceCssCalc);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Text = (_temp2 = _class = function (_Component) {
    _inherits(Text, _Component);
  
    function Text() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, Text);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Text.__proto__ || (0, _getPrototypeOf2.default)(Text)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        wordsByLines: []
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(Text, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.updateWordsByLines(this.props, true);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var calculateWordWidths = this.props.children !== nextProps.children || this.props.style !== nextProps.style;
        this.updateWordsByLines(nextProps, calculateWordWidths);
      }
    }, {
      key: 'updateWordsByLines',
      value: function updateWordsByLines(props, calculateWordWidths) {
        // Only perform calculations if using features that require them (multiline, scaleToFit)
        if (props.width || props.scaleToFit) {
          if (calculateWordWidths) {
            var _calculateWordWidths = this.calculateWordWidths(props);
  
            var wordsWithComputedWidth = _calculateWordWidths.wordsWithComputedWidth;
            var spaceWidth = _calculateWordWidths.spaceWidth;
  
            this.wordsWithComputedWidth = wordsWithComputedWidth;
            this.spaceWidth = spaceWidth;
          }
  
          var wordsByLines = this.calculateWordsByLines(this.wordsWithComputedWidth, this.spaceWidth, props.width);
          this.setState({ wordsByLines: wordsByLines });
        } else {
          var words = props.children ? props.children.toString().split(/\s+/) : [];
          this.setState({ wordsByLines: [{ words: words }] });
        }
      }
    }, {
      key: 'calculateWordWidths',
      value: function calculateWordWidths(props) {
        // Calculate length of each word to be used to determine number of words per line
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        (0, _assign3.default)(text.style, props.style);
        svg.appendChild(text);
        document.body.appendChild(svg);
  
        var words = props.children ? props.children.toString().split(/\s+/) : [];
        var wordsWithComputedWidth = words.map(function (word) {
          text.textContent = word;
          return { word: word, width: text.getComputedTextLength() };
        });
  
        text.textContent = ' '; // Unicode space
        var spaceWidth = text.getComputedTextLength();
  
        document.body.removeChild(svg);
  
        return { wordsWithComputedWidth: wordsWithComputedWidth, spaceWidth: spaceWidth };
      }
    }, {
      key: 'calculateWordsByLines',
      value: function calculateWordsByLines(wordsWithComputedWidth, spaceWidth, lineWidth) {
        var scaleToFit = this.props.scaleToFit;
  
        return wordsWithComputedWidth.reduce(function (result, _ref2) {
          var word = _ref2.word;
          var width = _ref2.width;
  
          var currentLine = result[result.length - 1];
  
          if (currentLine && (lineWidth == null || scaleToFit || currentLine.width + width + spaceWidth < lineWidth)) {
            // Word can be added to an existing line
            currentLine.words.push(word);
            currentLine.width += width + spaceWidth;
          } else {
            // Add first word to line or word is too long to scaleToFit on existing line
            var newLine = { words: [word], width: width };
            result.push(newLine);
          }
  
          return result;
        }, []);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var textAnchor = _props.textAnchor;
        var verticalAnchor = _props.verticalAnchor;
        var scaleToFit = _props.scaleToFit;
        var angle = _props.angle;
        var lineHeight = _props.lineHeight;
        var capHeight = _props.capHeight;
        var className = _props.className;
  
        var textProps = _objectWithoutProperties(_props, ['textAnchor', 'verticalAnchor', 'scaleToFit', 'angle', 'lineHeight', 'capHeight', 'className']);
  
        var wordsByLines = this.state.wordsByLines;
        var x = textProps.x;
        var y = textProps.y;
  
        var startDy = void 0;
        switch (verticalAnchor) {
          case 'start':
            startDy = (0, _reduceCssCalc2.default)('calc(' + capHeight + ')');
            break;
          case 'middle':
            startDy = (0, _reduceCssCalc2.default)('calc(' + (wordsByLines.length - 1) / 2 + ' * -' + lineHeight + ' + (' + capHeight + ' / 2))');
            break;
          default:
            startDy = (0, _reduceCssCalc2.default)('calc(' + (wordsByLines.length - 1) + ' * -' + lineHeight + ')');
            break;
        }
  
        var transforms = [];
        if (scaleToFit) {
          var lineWidth = wordsByLines[0].width;
          transforms.push('scale(' + this.props.width / lineWidth + ')');
        }
        if (angle) {
          transforms.push('rotate(' + angle + ', ' + x + ', ' + y + ')');
        }
        if (transforms.length) {
          textProps.transform = transforms.join(' ');
        }
  
        return _react2.default.createElement('text', _extends({}, (0, _ReactUtils.getPresentationAttributes)(textProps), {
          className: (0, _classnames2.default)('recharts-text', className),
          textAnchor: textAnchor
        }), wordsByLines.map(function (line, index) {
          return _react2.default.createElement('tspan', { x: x, dy: index === 0 ? startDy : lineHeight, key: index }, line.words.join(' '));
        }));
      }
    }]);
  
    return Text;
  }(_react.Component), _class.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    scaleToFit: _react.PropTypes.bool,
    angle: _react.PropTypes.number,
    textAnchor: _react.PropTypes.oneOf(['start', 'middle', 'end', 'inherit']),
    verticalAnchor: _react.PropTypes.oneOf(['start', 'middle', 'end'])
  }), _class.defaultProps = {
    x: 0,
    y: 0,
    lineHeight: '1em',
    capHeight: '0.71em', // Magic number from d3
    scaleToFit: false,
    textAnchor: 'start',
    verticalAnchor: 'end' }, _temp2);
  exports.default = Text;

/***/ }),
/* 88 */
/***/ (function(module, exports) {

  module.exports = require("lodash/assign");

/***/ }),
/* 89 */
/***/ (function(module, exports) {

  module.exports = require("reduce-css-calc");

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _sign = __webpack_require__(91);
  
  var _sign2 = _interopRequireDefault2(_sign);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Sector
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PolarUtils = __webpack_require__(92);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var getDeltaAngle = function getDeltaAngle(startAngle, endAngle) {
    var sign = (0, _sign2.default)(endAngle - startAngle);
    var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 359.999);
  
    return sign * deltaAngle;
  };
  
  var getSectorPath = function getSectorPath(_ref) {
    var cx = _ref.cx;
    var cy = _ref.cy;
    var innerRadius = _ref.innerRadius;
    var outerRadius = _ref.outerRadius;
    var startAngle = _ref.startAngle;
    var endAngle = _ref.endAngle;
  
    var angle = getDeltaAngle(startAngle, endAngle);
  
    // When the angle of sector equals to 360, star point and end point coincide
    var tempEndAngle = startAngle + angle;
    var outerStartPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, startAngle);
    var outerEndPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, tempEndAngle);
  
    var path = void 0;
  
    if (innerRadius > 0) {
      var innerStartPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, innerRadius, startAngle);
      var innerEndPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, innerRadius, tempEndAngle);
      path = 'M ' + outerStartPoint.x + ',' + outerStartPoint.y + '\n            A ' + outerRadius + ',' + outerRadius + ',0,\n            ' + +(Math.abs(angle) > 180) + ',' + +(startAngle > tempEndAngle) + ',\n            ' + outerEndPoint.x + ',' + outerEndPoint.y + '\n            L ' + innerEndPoint.x + ',' + innerEndPoint.y + '\n            A ' + innerRadius + ',' + innerRadius + ',0,\n            ' + +(Math.abs(angle) > 180) + ',' + +(startAngle <= tempEndAngle) + ',\n            ' + innerStartPoint.x + ',' + innerStartPoint.y + ' Z';
    } else {
      path = 'M ' + outerStartPoint.x + ',' + outerStartPoint.y + '\n            A ' + outerRadius + ',' + outerRadius + ',0,\n            ' + +(Math.abs(angle) > 180) + ',' + +(startAngle > tempEndAngle) + ',\n            ' + outerEndPoint.x + ',' + outerEndPoint.y + '\n            L ' + cx + ',' + cy + ' Z';
    }
  
    return path;
  };
  
  var Sector = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Sector, _Component);
  
    function Sector() {
      _classCallCheck(this, Sector);
  
      return _possibleConstructorReturn(this, (Sector.__proto__ || (0, _getPrototypeOf2.default)(Sector)).apply(this, arguments));
    }
  
    _createClass(Sector, [{
      key: 'render',
      value: function render() {
        var _props = this.props;
        var cx = _props.cx;
        var cy = _props.cy;
        var innerRadius = _props.innerRadius;
        var outerRadius = _props.outerRadius;
        var startAngle = _props.startAngle;
        var endAngle = _props.endAngle;
        var className = _props.className;
  
        if (outerRadius < innerRadius || startAngle === endAngle) {
          return null;
        }
  
        var layerClass = (0, _classnames2.default)('recharts-sector', className);
  
        return _react2.default.createElement('path', _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), (0, _ReactUtils.filterEventAttributes)(this.props), {
          className: layerClass,
          d: getSectorPath({ cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius, startAngle: startAngle, endAngle: endAngle })
        }));
      }
    }]);
  
    return Sector;
  }(_react.Component), _class2.displayName = 'Sector', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    cx: _react.PropTypes.number,
    cy: _react.PropTypes.number,
    innerRadius: _react.PropTypes.number,
    outerRadius: _react.PropTypes.number,
    startAngle: _react.PropTypes.number,
    endAngle: _react.PropTypes.number
  }), _class2.defaultProps = {
    cx: 0,
    cy: 0,
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0
  }, _temp)) || _class;
  
  exports.default = Sector;

/***/ }),
/* 91 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/math/sign");

/***/ }),
/* 92 */
/***/ (function(module, exports) {

  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var RADIAN = Math.PI / 180;
  
  var polarToCartesian = exports.polarToCartesian = function polarToCartesian(cx, cy, radius, angle) {
    return {
      x: cx + Math.cos(-RADIAN * angle) * radius,
      y: cy + Math.sin(-RADIAN * angle) * radius
    };
  };
  
  var getMaxRadius = exports.getMaxRadius = function getMaxRadius(width, height) {
    var margin = arguments.length <= 2 || arguments[2] === undefined ? {
      top: 0, right: 0, bottom: 0, left: 0
    } : arguments[2];
    return Math.min(Math.abs(width - (margin.left || 0) - (margin.right || 0)), Math.abs(height - (margin.left || 0) - (margin.right || 0))) / 2;
  };

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isArray2 = __webpack_require__(64);
  
  var _isArray3 = _interopRequireDefault(_isArray2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Curve
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _d3Shape = __webpack_require__(76);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var CURVE_FACTORIES = {
    curveBasisClosed: _d3Shape.curveBasisClosed, curveBasisOpen: _d3Shape.curveBasisOpen, curveBasis: _d3Shape.curveBasis, curveLinearClosed: _d3Shape.curveLinearClosed, curveLinear: _d3Shape.curveLinear,
    curveMonotoneX: _d3Shape.curveMonotoneX, curveMonotoneY: _d3Shape.curveMonotoneY, curveNatural: _d3Shape.curveNatural, curveStep: _d3Shape.curveStep, curveStepAfter: _d3Shape.curveStepAfter,
    curveStepBefore: _d3Shape.curveStepBefore
  };
  
  var defined = function defined(p) {
    return p.x === +p.x && p.y === +p.y;
  };
  var getX = function getX(p) {
    return p.x;
  };
  var getY = function getY(p) {
    return p.y;
  };
  
  var getCurveFactory = function getCurveFactory(type, layout) {
    if ((0, _isFunction3.default)(type)) {
      return type;
    }
  
    var name = 'curve' + type.slice(0, 1).toUpperCase() + type.slice(1);
  
    if (name === 'curveMonotone' && layout) {
      return CURVE_FACTORIES['' + name + (layout === 'vertical' ? 'Y' : 'X')];
    }
    return CURVE_FACTORIES[name] || _d3Shape.curveLinear;
  };
  
  var Curve = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Curve, _Component);
  
    function Curve() {
      _classCallCheck(this, Curve);
  
      return _possibleConstructorReturn(this, (Curve.__proto__ || (0, _getPrototypeOf2.default)(Curve)).apply(this, arguments));
    }
  
    _createClass(Curve, [{
      key: 'getPath',
  
      /**
       * Calculate the path of curve
       * @return {String} path
       */
      value: function getPath() {
        var _props = this.props;
        var type = _props.type;
        var points = _props.points;
        var baseLine = _props.baseLine;
        var layout = _props.layout;
        var connectNulls = _props.connectNulls;
  
        var curveFactory = getCurveFactory(type, layout);
        var formatPoints = connectNulls ? points.filter(function (entry) {
          return defined(entry);
        }) : points;
        var lineFunction = void 0;
  
        if ((0, _isArray3.default)(baseLine)) {
          var areaPoints = formatPoints.map(function (entry, index) {
            return _extends({}, entry, { base: baseLine[index] });
          });
          if (layout === 'vertical') {
            lineFunction = (0, _d3Shape.area)().y(getY).x1(getX).x0(function (d) {
              return d.base.x;
            });
          } else {
            lineFunction = (0, _d3Shape.area)().x(getX).y1(getY).y0(function (d) {
              return d.base.y;
            });
          }
          lineFunction.defined(defined).curve(curveFactory);
  
          return lineFunction(areaPoints);
        } else if (layout === 'vertical' && (0, _isNumber3.default)(baseLine)) {
          lineFunction = (0, _d3Shape.area)().y(getY).x1(getX).x0(baseLine);
        } else if ((0, _isNumber3.default)(baseLine)) {
          lineFunction = (0, _d3Shape.area)().x(getX).y1(getY).y0(baseLine);
        } else {
          lineFunction = (0, _d3Shape.line)().x(getX).y(getY);
        }
  
        lineFunction.defined(defined).curve(curveFactory);
  
        return lineFunction(formatPoints);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props;
        var className = _props2.className;
        var points = _props2.points;
        var type = _props2.type;
  
        if (!points || !points.length) {
          return null;
        }
  
        return _react2.default.createElement('path', _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), (0, _ReactUtils.filterEventAttributes)(this.props), {
          className: (0, _classnames2.default)('recharts-curve', className),
          d: this.getPath()
        }));
      }
    }]);
  
    return Curve;
  }(_react.Component), _class2.displayName = 'Curve', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    type: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(['basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed', 'natural', 'monotoneX', 'monotoneY', 'monotone', 'step', 'stepBefore', 'stepAfter']), _react.PropTypes.func]),
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    baseLine: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.array]),
    points: _react.PropTypes.arrayOf(_react.PropTypes.object),
    connectNulls: _react.PropTypes.bool
  }), _class2.defaultProps = {
    type: 'linear',
    stroke: '#000',
    fill: 'none',
    strokeWidth: 1,
    strokeDasharray: 'none',
    points: [],
    connectNulls: false
  }, _temp)) || _class;
  
  exports.default = Curve;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Rectangle
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _reactDom = __webpack_require__(95);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var getRectangePath = function getRectangePath(x, y, width, height, radius) {
    var maxRadius = Math.min(width / 2, height / 2);
    var newRadius = [];
    var path = void 0;
  
    if (maxRadius > 0 && radius instanceof Array) {
      for (var i = 0, len = 4; i < len; i++) {
        newRadius[i] = radius[i] > maxRadius ? maxRadius : radius[i];
      }
  
      path = 'M' + x + ',' + (y + newRadius[0]);
  
      if (newRadius[0] > 0) {
        path += 'A ' + newRadius[0] + ',' + newRadius[0] + ',0,0,1,' + (x + newRadius[0]) + ',' + y;
      }
  
      path += 'L ' + (x + width - newRadius[1]) + ',' + y;
  
      if (newRadius[1] > 0) {
        path += 'A ' + newRadius[1] + ',' + newRadius[1] + ',0,0,1,' + (x + width) + ',' + (y + newRadius[1]);
      }
      path += 'L ' + (x + width) + ',' + (y + height - newRadius[2]);
  
      if (newRadius[2] > 0) {
        path += 'A ' + newRadius[2] + ',' + newRadius[2] + ',0,0,1,' + (x + width - newRadius[2]) + ',' + (y + height);
      }
      path += 'L ' + (x + newRadius[3]) + ',' + (y + height);
  
      if (newRadius[3] > 0) {
        path += 'A ' + newRadius[3] + ',' + newRadius[3] + ',0,0,1,' + x + ',' + (y + height - newRadius[3]);
      }
      path += 'Z';
    } else if (maxRadius > 0 && radius === +radius && radius > 0) {
      newRadius = radius > maxRadius ? maxRadius : radius;
  
      path = 'M ' + x + ',' + (y + newRadius) + ' A ' + newRadius + ',' + newRadius + ',0,0,1,' + (x + newRadius) + ',' + y + '\n            L ' + (x + width - newRadius) + ',' + y + '\n            A ' + newRadius + ',' + newRadius + ',0,0,1,' + (x + width) + ',' + (y + newRadius) + '\n            L ' + (x + width) + ',' + (y + height - newRadius) + '\n            A ' + newRadius + ',' + newRadius + ',0,0,1,' + (x + width - newRadius) + ',' + (y + height) + '\n            L ' + (x + newRadius) + ',' + (y + height) + '\n            A ' + newRadius + ',' + newRadius + ',0,0,1,' + x + ',' + (y + height - newRadius) + ' Z';
    } else {
      path = 'M ' + x + ',' + y + ' h ' + width + ' v ' + height + ' h ' + -width + ' Z';
    }
  
    return path;
  };
  
  var Rectangle = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(Rectangle, _Component);
  
    function Rectangle() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, Rectangle);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Rectangle.__proto__ || (0, _getPrototypeOf2.default)(Rectangle)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        totalLength: -1
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(Rectangle, [{
      key: 'componentDidMount',
  
      /* eslint-disable  react/no-did-mount-set-state */
      value: function componentDidMount() {
        var path = (0, _reactDom.findDOMNode)(this);
  
        var totalLength = path && path.getTotalLength && path.getTotalLength();
  
        if (totalLength) {
          this.setState({
            totalLength: totalLength
          });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;
  
        var _props = this.props;
        var x = _props.x;
        var y = _props.y;
        var width = _props.width;
        var height = _props.height;
        var radius = _props.radius;
        var className = _props.className;
        var totalLength = this.state.totalLength;
        var _props2 = this.props;
        var animationEasing = _props2.animationEasing;
        var animationDuration = _props2.animationDuration;
        var animationBegin = _props2.animationBegin;
        var isAnimationActive = _props2.isAnimationActive;
        var isUpdateAnimationActive = _props2.isUpdateAnimationActive;
  
        if (x !== +x || y !== +y || width !== +width || height !== +height) {
          return null;
        }
  
        var layerClass = (0, _classnames2.default)('recharts-rectangle', className);
  
        return _react2.default.createElement(_reactSmooth2.default, {
          canBegin: totalLength > 0,
          from: { width: width, height: height, x: x, y: y },
          to: { width: width, height: height, x: x, y: y },
          duration: animationDuration,
          animationEasing: animationEasing,
          isActive: isUpdateAnimationActive
        }, function (_ref2) {
          var currWidth = _ref2.width;
          var currHeight = _ref2.height;
          var currX = _ref2.x;
          var currY = _ref2.y;
          return _react2.default.createElement(_reactSmooth2.default, {
            canBegin: totalLength > 0,
            from: '0px ' + (totalLength === -1 ? 1 : totalLength) + 'px',
            to: totalLength + 'px 0px',
            attributeName: 'strokeDasharray',
            begin: animationBegin,
            duration: animationDuration,
            isActive: isAnimationActive,
            easing: animationEasing
          }, _react2.default.createElement('path', _extends({}, (0, _ReactUtils.getPresentationAttributes)(_this2.props), (0, _ReactUtils.filterEventAttributes)(_this2.props), {
            className: layerClass,
            d: getRectangePath(currX, currY, currWidth, currHeight, radius)
          })));
        });
      }
    }]);
  
    return Rectangle;
  }(_react.Component), _class2.displayName = 'Rectangle', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    x: _react.PropTypes.number,
    y: _react.PropTypes.number,
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    radius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.array]),
    isAnimationActive: _react.PropTypes.bool,
    isUpdateAnimationActive: _react.PropTypes.bool,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'])
  }), _class2.defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    // The radius of border
    // The radius of four corners when radius is a number
    // The radius of left-top, right-top, right-bottom, left-bottom when radius is an array
    radius: 0,
    stroke: 'none',
    strokeWidth: 1,
    strokeDasharray: 'none',
    fill: '#000',
    isAnimationActive: false,
    isUpdateAnimationActive: false,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease'
  }, _temp2)) || _class;
  
  exports.default = Rectangle;

/***/ }),
/* 95 */
/***/ (function(module, exports) {

  module.exports = require("react-dom");

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Polygon
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var getPolygonPoints = function getPolygonPoints(points) {
    return points.reduce(function (result, entry) {
      if (entry.x === +entry.x && entry.y === +entry.y) {
        result.push([entry.x, entry.y]);
      }
  
      return result;
    }, []).join(' ');
  };
  
  var Polygon = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Polygon, _Component);
  
    function Polygon() {
      _classCallCheck(this, Polygon);
  
      return _possibleConstructorReturn(this, (Polygon.__proto__ || (0, _getPrototypeOf2.default)(Polygon)).apply(this, arguments));
    }
  
    _createClass(Polygon, [{
      key: 'render',
      value: function render() {
        var _props = this.props;
        var points = _props.points;
        var className = _props.className;
  
        if (!points || !points.length) {
          return null;
        }
  
        var layerClass = (0, _classnames2.default)('recharts-polygon', className);
  
        return _react2.default.createElement('polygon', _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), (0, _ReactUtils.filterEventAttributes)(this.props), {
          className: layerClass,
          points: getPolygonPoints(points)
        }));
      }
    }]);
  
    return Polygon;
  }(_react.Component), _class2.displayName = 'Polygon', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    points: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number
    }))
  }), _class2.defaultProps = {
    fill: 'none',
    stroke: '#333',
    strokeWidth: 1
  }, _temp)) || _class;
  
  exports.default = Polygon;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Dot
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Dot = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Dot, _Component);
  
    function Dot() {
      _classCallCheck(this, Dot);
  
      return _possibleConstructorReturn(this, (Dot.__proto__ || (0, _getPrototypeOf2.default)(Dot)).apply(this, arguments));
    }
  
    _createClass(Dot, [{
      key: 'render',
      value: function render() {
        var _props = this.props;
        var cx = _props.cx;
        var cy = _props.cy;
        var r = _props.r;
        var className = _props.className;
  
        var layerClass = (0, _classnames2.default)('recharts-dot', className);
  
        if (cx === +cx && cy === +cy && r === +r) {
          return _react2.default.createElement('circle', _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), {
            className: layerClass,
            cx: cx,
            cy: cy,
            r: r
          }));
        }
  
        return null;
      }
    }]);
  
    return Dot;
  }(_react.Component), _class2.displayName = 'Dot', _class2.propTypes = {
    className: _react.PropTypes.string,
    cx: _react.PropTypes.number,
    cy: _react.PropTypes.number,
    r: _react.PropTypes.number
  }, _temp)) || _class;
  
  exports.default = Dot;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Cross
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Cross = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Cross, _Component);
  
    function Cross() {
      _classCallCheck(this, Cross);
  
      return _possibleConstructorReturn(this, (Cross.__proto__ || (0, _getPrototypeOf2.default)(Cross)).apply(this, arguments));
    }
  
    _createClass(Cross, [{
      key: 'getPath',
      value: function getPath(x, y, width, height, top, left) {
        return 'M' + x + ',' + top + 'v' + height + 'M' + left + ',' + y + 'h' + width;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var x = _props.x;
        var y = _props.y;
        var width = _props.width;
        var height = _props.height;
        var top = _props.top;
        var left = _props.left;
        var className = _props.className;
  
        if (!(0, _isNumber3.default)(x) || !(0, _isNumber3.default)(y) || !(0, _isNumber3.default)(width) || !(0, _isNumber3.default)(height) || !(0, _isNumber3.default)(top) || !(0, _isNumber3.default)(left)) {
          return null;
        }
  
        return _react2.default.createElement('path', _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), {
          className: (0, _classnames2.default)('recharts-cross', className),
          d: this.getPath(x, y, width, height, top, left)
        }));
      }
    }]);
  
    return Cross;
  }(_react.Component), _class2.displayName = 'Cross', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    x: _react.PropTypes.number,
    y: _react.PropTypes.number,
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    top: _react.PropTypes.number,
    left: _react.PropTypes.number,
    className: _react.PropTypes.string
  }), _class2.defaultProps = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    stroke: '#000',
    fill: 'none'
  }, _temp)) || _class;
  
  exports.default = Cross;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Polar Grid
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _PolarUtils = __webpack_require__(92);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var PolarGrid = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(PolarGrid, _Component);
  
    function PolarGrid() {
      _classCallCheck(this, PolarGrid);
  
      return _possibleConstructorReturn(this, (PolarGrid.__proto__ || (0, _getPrototypeOf2.default)(PolarGrid)).apply(this, arguments));
    }
  
    _createClass(PolarGrid, [{
      key: 'renderPolarAngles',
  
      /**
       * Draw axis of radial line
       * @return {[type]} The lines
       */
      value: function renderPolarAngles() {
        var _props = this.props;
        var cx = _props.cx;
        var cy = _props.cy;
        var innerRadius = _props.innerRadius;
        var outerRadius = _props.outerRadius;
        var polarAngles = _props.polarAngles;
  
        if (!polarAngles || !polarAngles.length) {
          return null;
        }
        var props = _extends({
          stroke: '#ccc'
        }, (0, _ReactUtils.getPresentationAttributes)(this.props));
  
        return _react2.default.createElement('g', { className: 'recharts-polar-grid-angle' }, polarAngles.map(function (entry, i) {
          var start = (0, _PolarUtils.polarToCartesian)(cx, cy, innerRadius, entry);
          var end = (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, entry);
  
          return _react2.default.createElement('line', _extends({}, props, {
            key: 'line-' + i,
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y
          }));
        }));
      }
      /**
       * Draw concentric circles
       * @param {Number} radius The radius of circle
       * @param {Number} index  The index of circle
       * @return {ReactElement} circle
       */
  
    }, {
      key: 'renderConcentricCircle',
      value: function renderConcentricCircle(radius, index) {
        var _props2 = this.props;
        var cx = _props2.cx;
        var cy = _props2.cy;
  
        var props = _extends({
          stroke: '#ccc',
          fill: 'none'
        }, (0, _ReactUtils.getPresentationAttributes)(this.props));
  
        return _react2.default.createElement('circle', _extends({}, props, {
          className: 'recharts-polar-grid-concentric-circle',
          key: 'circle-' + index,
          cx: cx,
          cy: cy,
          r: radius
        }));
      }
  
      /**
       * Draw concentric polygons
       * @param {Number} radius The radius of polygon
       * @param {Number} index  The index of polygon
       * @return {ReactElement} polygon
       */
  
    }, {
      key: 'renderConcentricPolygon',
      value: function renderConcentricPolygon(radius, index) {
        var _props3 = this.props;
        var cx = _props3.cx;
        var cy = _props3.cy;
        var polarAngles = _props3.polarAngles;
  
        var props = _extends({
          stroke: '#ccc',
          fill: 'none'
        }, (0, _ReactUtils.getPresentationAttributes)(this.props));
        var path = '';
  
        polarAngles.forEach(function (angle, i) {
          var point = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, angle);
  
          if (i) {
            path += 'L ' + point.x + ',' + point.y;
          } else {
            path += 'M ' + point.x + ',' + point.y;
          }
        });
        path += 'Z';
  
        return _react2.default.createElement('path', _extends({}, props, {
          className: 'recharts-polar-grid-concentric-polygon',
          key: 'path-' + index,
          d: path
        }));
      }
  
      /**
       * Draw concentric axis
       * @return {ReactElement} Concentric axis
       * @todo Optimize the name
       */
  
    }, {
      key: 'renderConcentricPath',
      value: function renderConcentricPath() {
        var _this2 = this;
  
        var _props4 = this.props;
        var polarRadius = _props4.polarRadius;
        var gridType = _props4.gridType;
  
        if (!polarRadius || !polarRadius.length) {
          return null;
        }
  
        return _react2.default.createElement('g', { className: 'recharts-polar-grid-concentric' }, polarRadius.map(function (entry, i) {
          return gridType === 'circle' ? _this2.renderConcentricCircle(entry, i) : _this2.renderConcentricPolygon(entry, i);
        }));
      }
    }, {
      key: 'render',
      value: function render() {
        var outerRadius = this.props.outerRadius;
  
        if (outerRadius <= 0) {
          return null;
        }
  
        return _react2.default.createElement('g', { className: 'recharts-polar-grid' }, this.renderPolarAngles(), this.renderConcentricPath());
      }
    }]);
  
    return PolarGrid;
  }(_react.Component), _class2.displayName = 'PolarGrid', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    cx: _react.PropTypes.number,
    cy: _react.PropTypes.number,
    innerRadius: _react.PropTypes.number,
    outerRadius: _react.PropTypes.number,
  
    polarAngles: _react.PropTypes.arrayOf(_react.PropTypes.number),
    polarRadius: _react.PropTypes.arrayOf(_react.PropTypes.number),
    gridType: _react.PropTypes.oneOf(['polygon', 'circle'])
  }), _class2.defaultProps = {
    cx: 0,
    cy: 0,
    innerRadius: 0,
    outerRadius: 0,
    gridType: 'polygon'
  }, _temp)) || _class;
  
  exports.default = PolarGrid;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _maxBy2 = __webpack_require__(101);
  
  var _maxBy3 = _interopRequireDefault(_maxBy2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview The axis of polar coordinate system
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PolarUtils = __webpack_require__(92);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var PolarRadiusAxis = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(PolarRadiusAxis, _Component);
  
    function PolarRadiusAxis() {
      _classCallCheck(this, PolarRadiusAxis);
  
      return _possibleConstructorReturn(this, (PolarRadiusAxis.__proto__ || (0, _getPrototypeOf2.default)(PolarRadiusAxis)).apply(this, arguments));
    }
  
    _createClass(PolarRadiusAxis, [{
      key: 'getTickValueCoord',
  
      /**
       * Calculate the coordinate of tick
       * @param  {Object} radius The data of a simple tick
       * @return {Object} (x, y)
       */
      value: function getTickValueCoord(_ref) {
        var radius = _ref.radius;
        var _props = this.props;
        var angle = _props.angle;
        var cx = _props.cx;
        var cy = _props.cy;
  
        return (0, _PolarUtils.polarToCartesian)(cx, cy, radius, angle);
      }
    }, {
      key: 'getTickTextAnchor',
      value: function getTickTextAnchor() {
        var orientation = this.props.orientation;
  
        var textAnchor = void 0;
  
        switch (orientation) {
          case 'left':
            textAnchor = 'end';
            break;
          case 'right':
            textAnchor = 'start';
            break;
          default:
            textAnchor = 'middle';
            break;
        }
  
        return textAnchor;
      }
    }, {
      key: 'renderAxisLine',
      value: function renderAxisLine() {
        var _props2 = this.props;
        var cx = _props2.cx;
        var cy = _props2.cy;
        var angle = _props2.angle;
        var ticks = _props2.ticks;
        var axisLine = _props2.axisLine;
  
        var extent = ticks.reduce(function (result, entry) {
          return [Math.min(result[0], entry.radius), Math.max(result[1], entry.radius)];
        }, [Infinity, -Infinity]);
        var point0 = (0, _PolarUtils.polarToCartesian)(cx, cy, extent[0], angle);
        var point1 = (0, _PolarUtils.polarToCartesian)(cx, cy, extent[1], angle);
  
        var props = _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), {
          fill: 'none'
        }, (0, _ReactUtils.getPresentationAttributes)(axisLine), {
          x1: point0.x,
          y1: point0.y,
          x2: point1.x,
          y2: point1.y
        });
  
        return _react2.default.createElement('line', _extends({ className: 'recharts-polar-radius-axis-line' }, props));
      }
    }, {
      key: 'renderTickItem',
      value: function renderTickItem(option, props, value) {
        var tickItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          tickItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          tickItem = option(props);
        } else {
          tickItem = _react2.default.createElement(_Text2.default, _extends({}, props, {
            className: 'recharts-polar-radius-axis-tick-value'
          }), value);
        }
  
        return tickItem;
      }
    }, {
      key: 'renderTicks',
      value: function renderTicks() {
        var _this2 = this;
  
        var _props3 = this.props;
        var ticks = _props3.ticks;
        var tick = _props3.tick;
        var angle = _props3.angle;
        var tickFormatter = _props3.tickFormatter;
        var stroke = _props3.stroke;
  
        var textAnchor = this.getTickTextAnchor();
        var axisProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customTickProps = (0, _ReactUtils.getPresentationAttributes)(tick);
  
        var items = ticks.map(function (entry, i) {
          var coord = _this2.getTickValueCoord(entry);
          var tickProps = _extends({
            textAnchor: textAnchor,
            transform: 'rotate(' + (90 - angle) + ', ' + coord.x + ', ' + coord.y + ')'
          }, axisProps, {
            stroke: 'none', fill: stroke
          }, customTickProps, {
            index: i
          }, coord, {
            payload: entry
          });
  
          return _react2.default.createElement('g', { className: 'recharts-polar-radius-axis-tick', key: 'tick-' + i }, _this2.renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value) : entry.value));
        });
  
        return _react2.default.createElement('g', { className: 'recharts-polar-radius-axis-ticks' }, items);
      }
    }, {
      key: 'renderLabel',
      value: function renderLabel() {
        var label = this.props.label;
        var _props4 = this.props;
        var ticks = _props4.ticks;
        var angle = _props4.angle;
        var stroke = _props4.stroke;
  
        var maxRadiusTick = (0, _maxBy3.default)(ticks, function (entry) {
          return entry.radius || 0;
        });
        var radius = maxRadiusTick.radius || 0;
        var coord = this.getTickValueCoord({ radius: radius + 10 });
        var props = _extends({}, this.props, {
          stroke: 'none',
          fill: stroke
        }, coord, {
          textAnchor: 'middle',
          transform: 'rotate(' + (90 - angle) + ', ' + coord.x + ', ' + coord.y + ')'
        });
  
        if (_react2.default.isValidElement(label)) {
          return _react2.default.cloneElement(label, props);
        } else if ((0, _isFunction3.default)(label)) {
          return label(props);
        } else if ((0, _isString3.default)(label) || (0, _isNumber3.default)(label)) {
          return _react2.default.createElement('g', { className: 'recharts-polar-radius-axis-label' }, _react2.default.createElement(_Text2.default, props, label));
        }
  
        return null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props5 = this.props;
        var ticks = _props5.ticks;
        var axisLine = _props5.axisLine;
        var tick = _props5.tick;
  
        if (!ticks || !ticks.length) {
          return null;
        }
  
        return _react2.default.createElement('g', { className: 'recharts-polar-radius-axis' }, axisLine && this.renderAxisLine(), tick && this.renderTicks(), this.renderLabel());
      }
    }]);
  
    return PolarRadiusAxis;
  }(_react.Component), _class2.displayName = 'PolarRadiusAxis', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    cx: _react.PropTypes.number,
    cy: _react.PropTypes.number,
    hide: _react.PropTypes.bool,
  
    angle: _react.PropTypes.number,
    tickCount: _react.PropTypes.number,
    ticks: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      value: _react.PropTypes.any,
      radius: _react.PropTypes.value
    })),
    orientation: _react.PropTypes.oneOf(['left', 'right', 'middle']),
    axisLine: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
    label: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string, _react.PropTypes.element, _react.PropTypes.func]),
    tick: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object, _react.PropTypes.element, _react.PropTypes.func]),
    stroke: _react.PropTypes.string,
    tickFormatter: _react.PropTypes.func,
    domain: _react.PropTypes.arrayOf(_react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.oneOf(['auto', 'dataMin', 'dataMax'])])),
    allowDataOverflow: _react.PropTypes.bool
  }), _class2.defaultProps = {
    cx: 0,
    cy: 0,
    angle: 0,
    orientation: 'right',
    stroke: '#ccc',
    axisLine: true,
    tick: true,
    tickCount: 5,
    domain: [0, 'auto'],
    allowDataOverflow: false
  }, _temp)) || _class;
  
  exports.default = PolarRadiusAxis;

/***/ }),
/* 101 */
/***/ (function(module, exports) {

  module.exports = require("lodash/maxBy");

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Axis of radial direction
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _Polygon = __webpack_require__(96);
  
  var _Polygon2 = _interopRequireDefault(_Polygon);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _PolarUtils = __webpack_require__(92);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var RADIAN = Math.PI / 180;
  var eps = 1e-5;
  
  var PolarAngleAxis = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(PolarAngleAxis, _Component);
  
    function PolarAngleAxis() {
      _classCallCheck(this, PolarAngleAxis);
  
      return _possibleConstructorReturn(this, (PolarAngleAxis.__proto__ || (0, _getPrototypeOf2.default)(PolarAngleAxis)).apply(this, arguments));
    }
  
    _createClass(PolarAngleAxis, [{
      key: 'getTickLineCoord',
  
      /**
       * Calculate the coordinate of line endpoint
       * @param  {Object} data The Data if ticks
       * @return {Object} (x0, y0): The start point of text,
       *                  (x1, y1): The end point close to text,
       *                  (x2, y2): The end point close to axis
       */
      value: function getTickLineCoord(data) {
        var _props = this.props;
        var cx = _props.cx;
        var cy = _props.cy;
        var radius = _props.radius;
        var orientation = _props.orientation;
        var tickLine = _props.tickLine;
  
        var tickLineSize = tickLine && tickLine.size || 8;
        var p1 = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, data.angle);
        var p2 = (0, _PolarUtils.polarToCartesian)(cx, cy, radius + (orientation === 'inner' ? -1 : 1) * tickLineSize, data.angle);
  
        return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
      }
      /**
       * Get the text-anchor of each tick
       * @param  {Object} data Data of ticks
       * @return {String} text-anchor
       */
  
    }, {
      key: 'getTickTextAnchor',
      value: function getTickTextAnchor(data) {
        var orientation = this.props.orientation;
  
        var cos = Math.cos(-data.angle * RADIAN);
        var textAnchor = void 0;
  
        if (cos > eps) {
          textAnchor = orientation === 'outer' ? 'start' : 'end';
        } else if (cos < -eps) {
          textAnchor = orientation === 'outer' ? 'end' : 'start';
        } else {
          textAnchor = 'middle';
        }
  
        return textAnchor;
      }
    }, {
      key: 'renderAxisLine',
      value: function renderAxisLine() {
        var _props2 = this.props;
        var cx = _props2.cx;
        var cy = _props2.cy;
        var radius = _props2.radius;
        var axisLine = _props2.axisLine;
        var axisLineType = _props2.axisLineType;
  
        var props = _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), {
          fill: 'none'
        }, (0, _ReactUtils.getPresentationAttributes)(axisLine));
  
        if (axisLineType === 'circle') {
          return _react2.default.createElement(_Dot2.default, _extends({
            className: 'recharts-polar-angle-axis-line'
          }, props, {
            cx: cx,
            cy: cy,
            r: radius
          }));
        }
        var ticks = this.props.ticks;
  
        var points = ticks.map(function (entry) {
          return (0, _PolarUtils.polarToCartesian)(cx, cy, radius, entry.angle);
        });
  
        return _react2.default.createElement(_Polygon2.default, _extends({ className: 'recharts-polar-angle-axis-line' }, props, { points: points }));
      }
    }, {
      key: 'renderTickItem',
      value: function renderTickItem(option, props, value) {
        var tickItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          tickItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          tickItem = option(props);
        } else {
          tickItem = _react2.default.createElement(_Text2.default, _extends({}, props, {
            className: 'recharts-polar-angle-axis-tick-value'
          }), value);
        }
  
        return tickItem;
      }
    }, {
      key: 'renderTicks',
      value: function renderTicks() {
        var _this2 = this;
  
        var _props3 = this.props;
        var ticks = _props3.ticks;
        var tick = _props3.tick;
        var tickLine = _props3.tickLine;
        var tickFormatter = _props3.tickFormatter;
        var stroke = _props3.stroke;
  
        var axisProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customTickProps = (0, _ReactUtils.getPresentationAttributes)(tick);
        var tickLineProps = _extends({}, axisProps, { fill: 'none' }, (0, _ReactUtils.getPresentationAttributes)(tickLine));
  
        var items = ticks.map(function (entry, i) {
          var lineCoord = _this2.getTickLineCoord(entry);
          var textAnchor = _this2.getTickTextAnchor(entry);
          var tickProps = _extends({
            textAnchor: textAnchor
          }, axisProps, {
            stroke: 'none', fill: stroke
          }, customTickProps, {
            index: i, payload: entry,
            x: lineCoord.x2, y: lineCoord.y2
          });
  
          return _react2.default.createElement('g', { className: 'recharts-polar-angle-axis-tick', key: 'tick-' + i }, tickLine && _react2.default.createElement('line', _extends({
            className: 'recharts-polar-angle-axis-tick-line'
          }, tickLineProps, lineCoord)), tick && _this2.renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value) : entry.value));
        });
  
        return _react2.default.createElement('g', { className: 'recharts-polar-angle-axis-ticks' }, items);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props4 = this.props;
        var ticks = _props4.ticks;
        var radius = _props4.radius;
        var axisLine = _props4.axisLine;
        var tickLine = _props4.tickLine;
  
        if (radius <= 0 || !ticks || !ticks.length) {
          return null;
        }
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-polar-angle-axis' }, axisLine && this.renderAxisLine(), this.renderTicks());
      }
    }]);
  
    return PolarAngleAxis;
  }(_react.Component), _class2.displayName = 'PolarAngleAxis', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    dataKey: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    cx: _react.PropTypes.number,
    cy: _react.PropTypes.number,
    radius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    hide: _react.PropTypes.bool,
  
    axisLine: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
    axisLineType: _react.PropTypes.oneOf(['polygon', 'circle']),
    tickLine: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
    tick: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func, _react.PropTypes.object, _react.PropTypes.element]),
  
    ticks: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      value: _react.PropTypes.any,
      angle: _react.PropTypes.number
    })),
    stroke: _react.PropTypes.string,
    orientation: _react.PropTypes.oneOf(['inner', 'outer']),
    tickFormatter: _react.PropTypes.func
  }), _class2.defaultProps = {
    cx: 0,
    cy: 0,
    orientation: 'outer',
    fill: '#666',
    stroke: '#ccc',
    axisLine: true,
    tickLine: true,
    tick: true,
    hide: false
  }, _temp)) || _class;
  
  exports.default = PolarAngleAxis;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _sign = __webpack_require__(91);
  
  var _sign2 = _interopRequireDefault2(_sign);
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isPlainObject2 = __webpack_require__(72);
  
  var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Render sectors of a pie
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Sector = __webpack_require__(90);
  
  var _Sector2 = _interopRequireDefault(_Sector);
  
  var _Curve = __webpack_require__(93);
  
  var _Curve2 = _interopRequireDefault(_Curve);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PolarUtils = __webpack_require__(92);
  
  var _AnimationDecorator = __webpack_require__(104);
  
  var _AnimationDecorator2 = _interopRequireDefault(_AnimationDecorator);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Pie = (0, _AnimationDecorator2.default)(_class = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Pie, _Component);
  
    function Pie(props, ctx) {
      _classCallCheck(this, Pie);
  
      var _this = _possibleConstructorReturn(this, (Pie.__proto__ || (0, _getPrototypeOf2.default)(Pie)).call(this, props, ctx));
  
      _this.handleAnimationEnd = function () {
        _this.setState({
          isAnimationFinished: true
        });
      };
  
      _this.state = {
        isAnimationFinished: false
      };
  
      if (!_this.id) {
        _this.id = 'clipPath' + Date.now();
      }
      return _this;
    }
  
    _createClass(Pie, [{
      key: 'getDeltaAngle',
      value: function getDeltaAngle() {
        var _props = this.props;
        var startAngle = _props.startAngle;
        var endAngle = _props.endAngle;
  
        var sign = (0, _sign2.default)(endAngle - startAngle);
        var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  
        return sign * deltaAngle;
      }
    }, {
      key: 'getSectors',
      value: function getSectors(data) {
        var _props2 = this.props;
        var cx = _props2.cx;
        var cy = _props2.cy;
        var innerRadius = _props2.innerRadius;
        var outerRadius = _props2.outerRadius;
        var startAngle = _props2.startAngle;
        var paddingAngle = _props2.paddingAngle;
        var minAngle = _props2.minAngle;
        var endAngle = _props2.endAngle;
        var nameKey = _props2.nameKey;
        var valueKey = _props2.valueKey;
  
        var len = data.length;
        var deltaAngle = this.getDeltaAngle();
        var absDeltaAngle = Math.abs(deltaAngle);
        var totalPadingAngle = (absDeltaAngle >= 360 ? len : len - 1) * paddingAngle;
        var sum = data.reduce(function (result, entry) {
          return result + entry[valueKey];
        }, 0);
  
        var sectors = [];
        var prev = void 0;
  
        if (sum > 0) {
          sectors = data.map(function (entry, i) {
            var percent = entry[valueKey] / sum;
            var tempStartAngle = void 0;
  
            if (i) {
              tempStartAngle = (deltaAngle < 0 ? prev.endAngle : prev.startAngle) + (0, _sign2.default)(deltaAngle) * paddingAngle;
            } else {
              tempStartAngle = startAngle;
            }
  
            var tempEndAngle = tempStartAngle + (0, _sign2.default)(deltaAngle) * (minAngle + percent * (absDeltaAngle - len * minAngle - totalPadingAngle));
  
            prev = _extends({
              percent: percent
            }, entry, {
              cx: cx,
              cy: cy,
              innerRadius: innerRadius,
              outerRadius: outerRadius,
              name: entry[nameKey],
              value: entry[valueKey],
              startAngle: deltaAngle < 0 ? tempStartAngle : tempEndAngle,
              endAngle: deltaAngle < 0 ? tempEndAngle : tempStartAngle,
              payload: entry,
              midAngle: (tempStartAngle + tempEndAngle) / 2
            });
  
            return prev;
          });
        }
  
        return sectors;
      }
    }, {
      key: 'getTextAnchor',
      value: function getTextAnchor(x, cx) {
        if (x > cx) {
          return 'start';
        } else if (x < cx) {
          return 'end';
        }
  
        return 'middle';
      }
    }, {
      key: 'isActiveIndex',
      value: function isActiveIndex(i) {
        var activeIndex = this.props.activeIndex;
  
        if (Array.isArray(activeIndex)) {
          return activeIndex.indexOf(i) !== -1;
        }
  
        return i === activeIndex;
      }
    }, {
      key: 'renderClipPath',
      value: function renderClipPath() {
        var _props3 = this.props;
        var cx = _props3.cx;
        var cy = _props3.cy;
        var maxRadius = _props3.maxRadius;
        var startAngle = _props3.startAngle;
        var isAnimationActive = _props3.isAnimationActive;
        var animationDuration = _props3.animationDuration;
        var animationEasing = _props3.animationEasing;
        var animationBegin = _props3.animationBegin;
        var animationId = _props3.animationId;
  
        return _react2.default.createElement('defs', null, _react2.default.createElement('clipPath', { id: this.id }, _react2.default.createElement(_reactSmooth2.default, {
          easing: animationEasing,
          isActive: isAnimationActive,
          duration: animationDuration,
          key: animationId,
          animationBegin: animationBegin,
          onAnimationEnd: this.handleAnimationEnd,
          from: {
            endAngle: startAngle
          },
          to: {
            outerRadius: Math.max(this.props.outerRadius, maxRadius || 0),
            innerRadius: 0,
            endAngle: this.props.endAngle
          }
        }, function (_ref) {
          var outerRadius = _ref.outerRadius;
          var innerRadius = _ref.innerRadius;
          var endAngle = _ref.endAngle;
          return _react2.default.createElement(_Sector2.default, {
            cx: cx,
            cy: cy,
            outerRadius: outerRadius,
            innerRadius: innerRadius,
            startAngle: startAngle,
            endAngle: endAngle
          });
        })));
      }
    }, {
      key: 'renderLabelLineItem',
      value: function renderLabelLineItem(option, props) {
        if (_react2.default.isValidElement(option)) {
          return _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          return option(props);
        }
  
        return _react2.default.createElement(_Curve2.default, _extends({}, props, { type: 'linear', className: 'recharts-pie-label-line' }));
      }
    }, {
      key: 'renderLabelItem',
      value: function renderLabelItem(option, props, value) {
        if (_react2.default.isValidElement(option)) {
          return _react2.default.cloneElement(option, props);
        }
        var label = value;
        if ((0, _isFunction3.default)(option)) {
          label = option(props);
          if (_react2.default.isValidElement(label)) {
            return label;
          }
        }
  
        return _react2.default.createElement(_Text2.default, _extends({}, props, {
          alignmentBaseline: 'middle',
          className: 'recharts-pie-label-text'
        }), label);
      }
    }, {
      key: 'renderLabels',
      value: function renderLabels(sectors) {
        var _this2 = this;
  
        var isAnimationActive = this.props.isAnimationActive;
  
        if (isAnimationActive && !this.state.isAnimationFinished) {
          return null;
        }
        var _props4 = this.props;
        var label = _props4.label;
        var labelLine = _props4.labelLine;
        var valueKey = _props4.valueKey;
  
        var pieProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customLabelProps = (0, _ReactUtils.getPresentationAttributes)(label);
        var customLabelLineProps = (0, _ReactUtils.getPresentationAttributes)(labelLine);
        var offsetRadius = label && label.offsetRadius || 20;
  
        var labels = sectors.map(function (entry, i) {
          var midAngle = (entry.startAngle + entry.endAngle) / 2;
          var endPoint = (0, _PolarUtils.polarToCartesian)(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
          var labelProps = _extends({}, pieProps, entry, {
            stroke: 'none'
          }, customLabelProps, {
            index: i,
            textAnchor: _this2.getTextAnchor(endPoint.x, entry.cx)
          }, endPoint);
          var lineProps = _extends({}, pieProps, entry, {
            fill: 'none',
            stroke: entry.fill
          }, customLabelLineProps, {
            points: [(0, _PolarUtils.polarToCartesian)(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint]
          });
  
          return _react2.default.createElement(_Layer2.default, { key: 'label-' + i }, labelLine && _this2.renderLabelLineItem(labelLine, lineProps), _this2.renderLabelItem(label, labelProps, entry[valueKey]));
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-pie-labels' }, labels);
      }
    }, {
      key: 'renderSectorItem',
      value: function renderSectorItem(option, props) {
        if (_react2.default.isValidElement(option)) {
          return _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          return option(props);
        } else if ((0, _isPlainObject3.default)(option)) {
          return _react2.default.createElement(_Sector2.default, _extends({}, props, option));
        }
  
        return _react2.default.createElement(_Sector2.default, props);
      }
    }, {
      key: 'renderSectors',
      value: function renderSectors(sectors) {
        var _this3 = this;
  
        var activeShape = this.props.activeShape;
  
        return sectors.map(function (entry, i) {
          return _react2.default.createElement(_Layer2.default, _extends({
            className: 'recharts-pie-sector'
          }, (0, _ReactUtils.filterEventsOfChild)(_this3.props, entry, i), {
            key: 'sector-' + i
          }), _this3.renderSectorItem(_this3.isActiveIndex(i) ? activeShape : null, entry));
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props5 = this.props;
        var data = _props5.data;
        var composedData = _props5.composedData;
        var className = _props5.className;
        var label = _props5.label;
        var cx = _props5.cx;
        var cy = _props5.cy;
        var innerRadius = _props5.innerRadius;
        var outerRadius = _props5.outerRadius;
  
        var pieData = composedData || data;
  
        if (!pieData || !pieData.length || !(0, _isNumber3.default)(cx) || !(0, _isNumber3.default)(cy) || !(0, _isNumber3.default)(innerRadius) || !(0, _isNumber3.default)(outerRadius)) {
          return null;
        }
  
        var sectors = this.getSectors(pieData);
        var layerClass = (0, _classnames2.default)('recharts-pie', className);
  
        return _react2.default.createElement(_Layer2.default, { className: layerClass }, this.renderClipPath(), _react2.default.createElement('g', { clipPath: 'url(#' + this.id + ')' }, this.renderSectors(sectors)), label && this.renderLabels(sectors));
      }
    }]);
  
    return Pie;
  }(_react.Component), _class2.displayName = 'Pie', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    cx: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    cy: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    startAngle: _react.PropTypes.number,
    endAngle: _react.PropTypes.number,
    paddingAngle: _react.PropTypes.number,
    innerRadius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    outerRadius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    nameKey: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    valueKey: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    data: _react.PropTypes.arrayOf(_react.PropTypes.object),
    composedData: _react.PropTypes.arrayOf(_react.PropTypes.object),
    minAngle: _react.PropTypes.number,
    legendType: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
    maxRadius: _react.PropTypes.number,
  
    labelLine: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func, _react.PropTypes.element, _react.PropTypes.bool]),
    label: _react.PropTypes.oneOfType([_react.PropTypes.shape({
      offsetRadius: _react.PropTypes.number
    }), _react.PropTypes.func, _react.PropTypes.element, _react.PropTypes.bool]),
    activeShape: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func, _react.PropTypes.element]),
    activeIndex: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.arrayOf(_react.PropTypes.number)]),
  
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func,
    isAnimationActive: _react.PropTypes.bool,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'spring', 'linear'])
  }), _class2.defaultProps = {
    stroke: '#fff',
    fill: '#808080',
    legendType: 'rect',
    // The abscissa of pole
    cx: '50%',
    // The ordinate of pole
    cy: '50%',
    // The start angle of first sector
    startAngle: 0,
    // The direction of drawing sectors
    endAngle: 360,
    // The inner radius of sectors
    innerRadius: 0,
    // The outer radius of sectors
    outerRadius: '80%',
    paddingAngle: 0,
    nameKey: 'name',
    valueKey: 'value',
    labelLine: true,
    data: [],
    minAngle: 0,
    animationId: _react.PropTypes.number,
    isAnimationActive: true,
    animationBegin: 400,
    animationDuration: 1500,
    animationEasing: 'ease'
  }, _temp)) || _class) || _class;
  
  exports.default = Pie;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  exports.default = function (WrappedComponent) {
    var _class, _temp2;
  
    var AnimationDecorator = (_temp2 = _class = function (_Component) {
      _inherits(AnimationDecorator, _Component);
  
      function AnimationDecorator() {
        var _ref;
  
        var _temp, _this, _ret;
  
        _classCallCheck(this, AnimationDecorator);
  
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
  
        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AnimationDecorator.__proto__ || (0, _getPrototypeOf2.default)(AnimationDecorator)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
          animationId: 0
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }
  
      _createClass(AnimationDecorator, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          var animationId = this.state.animationId;
  
          if (this.props.data !== nextProps.data) {
            this.setState({
              animationId: animationId + 1
            });
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, { animationId: this.state.animationId }));
        }
      }]);
  
      return AnimationDecorator;
    }(_react.Component), _class.displayName = 'AnimationDecorator(' + (0, _ReactUtils.getDisplayName)(WrappedComponent) + ')', _class.propTypes = _extends({}, WrappedComponent.propTypes, {
      data: _react.PropTypes.array
    }), _class.WrappedComponent = WrappedComponent, _class.defaultProps = WrappedComponent.defaultProps, _temp2);
  
    return AnimationDecorator;
  };
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Radar
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _Polygon = __webpack_require__(96);
  
  var _Polygon2 = _interopRequireDefault(_Polygon);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Radar = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(Radar, _Component);
  
    function Radar() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, Radar);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Radar.__proto__ || (0, _getPrototypeOf2.default)(Radar)).call.apply(_ref, [this].concat(args))), _this), _this.handleMouseEnter = function (e) {
        var onMouseEnter = _this.props.onMouseEnter;
  
        if (onMouseEnter) {
          onMouseEnter(_this.props, e);
        }
      }, _this.handleMouseLeave = function (e) {
        var onMouseLeave = _this.props.onMouseLeave;
  
        if (onMouseLeave) {
          onMouseLeave(_this.props, e);
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(Radar, [{
      key: 'renderPolygon',
      value: function renderPolygon() {
        var _props = this.props;
        var shape = _props.shape;
        var points = _props.points;
        var animationDuration = _props.animationDuration;
        var animationEasing = _props.animationEasing;
        var animationBegin = _props.animationBegin;
        var isAnimationActive = _props.isAnimationActive;
        var animationId = _props.animationId;
        var dataKey = _props.dataKey;
        var className = _props.className;
  
        var others = _objectWithoutProperties(_props, ['shape', 'points', 'animationDuration', 'animationEasing', 'animationBegin', 'isAnimationActive', 'animationId', 'dataKey', 'className']);
  
        if (_react2.default.isValidElement(shape)) {
          return _react2.default.cloneElement(shape, _extends({}, others, { points: points }));
        } else if ((0, _isFunction3.default)(shape)) {
          return shape(this.props);
        }
  
        var point = points[0];
        var transformPoints = points.map(function (p) {
          return { x: p.x - point.cx, y: p.y - point.cy };
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-radar-polygon', transform: 'translate(' + point.cx + ', ' + point.cy + ')' }, _react2.default.createElement(_reactSmooth2.default, {
          from: 'scale(0)',
          to: 'scale(1)',
          attributeName: 'transform',
          isActive: isAnimationActive,
          begin: animationBegin,
          easing: animationEasing,
          duration: animationDuration,
          key: animationId
        }, _react2.default.createElement(_Polygon2.default, _extends({
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave
        }, (0, _ReactUtils.getPresentationAttributes)(this.props), {
          points: transformPoints
        }))));
      }
    }, {
      key: 'renderLabelItem',
      value: function renderLabelItem(option, props, value) {
        var labelItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          labelItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          labelItem = option(props);
        } else {
          labelItem = _react2.default.createElement(_Text2.default, _extends({
            key: props.key
          }, props, {
            className: 'recharts-radar-label'
          }), value);
        }
  
        return labelItem;
      }
    }, {
      key: 'renderLabels',
      value: function renderLabels() {
        var _this2 = this;
  
        var _props2 = this.props;
        var points = _props2.points;
        var label = _props2.label;
  
        var baseProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customLabelProps = (0, _ReactUtils.getPresentationAttributes)(label);
  
        var labels = points.map(function (entry, i) {
          var labelProps = _extends({
            textAnchor: 'middle'
          }, baseProps, {
            stroke: 'none',
            fill: baseProps && baseProps.stroke || '#666'
          }, customLabelProps, entry, {
            index: i,
            key: 'label-' + i,
            payload: entry
          });
  
          return _this2.renderLabelItem(label, labelProps, entry.value);
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-radar-labels' }, labels);
      }
    }, {
      key: 'renderDotItem',
      value: function renderDotItem(option, props) {
        var dotItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          dotItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          dotItem = option(props);
        } else {
          dotItem = _react2.default.createElement(_Dot2.default, _extends({}, props, { className: 'recharts-radar-dot' }));
        }
  
        return dotItem;
      }
    }, {
      key: 'renderDots',
      value: function renderDots() {
        var _this3 = this;
  
        var _props3 = this.props;
        var dot = _props3.dot;
        var points = _props3.points;
  
        var baseProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customDotProps = (0, _ReactUtils.getPresentationAttributes)(dot);
  
        var dots = points.map(function (entry, i) {
          var dotProps = _extends({
            key: 'dot-' + i,
            r: 3
          }, baseProps, customDotProps, {
            cx: entry.x,
            cy: entry.y,
            index: i,
            playload: entry
          });
  
          return _this3.renderDotItem(dot, dotProps);
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-radar-dots' }, dots);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props4 = this.props;
        var className = _props4.className;
        var points = _props4.points;
        var label = _props4.label;
        var dot = _props4.dot;
  
        if (!points || !points.length) {
          return null;
        }
  
        var layerClass = (0, _classnames2.default)('recharts-radar', className);
        var transformOrigin = 'center center';
  
        return _react2.default.createElement(_Layer2.default, { className: layerClass }, this.renderPolygon(), label && this.renderLabels(), dot && this.renderDots());
      }
    }]);
  
    return Radar;
  }(_react.Component), _class2.displayName = 'Radar', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    dataKey: _react.PropTypes.string.isRequired,
  
    points: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      cx: _react.PropTypes.number,
      cy: _react.PropTypes.number,
      angle: _react.PropTypes.number,
      radius: _react.PropTypes.number,
      value: _react.PropTypes.number,
      payload: _react.PropTypes.object
    })),
    shape: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
    dot: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func, _react.PropTypes.object, _react.PropTypes.bool]),
    label: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func, _react.PropTypes.object, _react.PropTypes.bool]),
    legendType: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
  
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    isAnimationActive: _react.PropTypes.bool,
    animationId: _react.PropTypes.number,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'])
  }), _class2.defaultProps = {
    dot: false,
    label: false,
    legendType: 'rect',
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease'
  }, _temp2)) || _class;
  
  exports.default = Radar;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _sign = __webpack_require__(91);
  
  var _sign2 = _interopRequireDefault2(_sign);
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _uniqueId2 = __webpack_require__(107);
  
  var _uniqueId3 = _interopRequireDefault(_uniqueId2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Render a group of radial bar
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _Sector = __webpack_require__(90);
  
  var _Sector2 = _interopRequireDefault(_Sector);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _DOMUtils = __webpack_require__(77);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _PolarUtils = __webpack_require__(92);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var RADIAN = Math.PI / 180;
  
  var RadialBar = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(RadialBar, _Component);
  
    function RadialBar() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, RadialBar);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RadialBar.__proto__ || (0, _getPrototypeOf2.default)(RadialBar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        isAnimationFinished: false
      }, _this.handleAnimationEnd = function () {
        _this.setState({ isAnimationFinished: true });
      }, _this.handleAnimationStart = function () {
        _this.setState({ isAnimationFinished: false });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(RadialBar, [{
      key: 'getDeltaAngle',
      value: function getDeltaAngle() {
        var _props = this.props;
        var startAngle = _props.startAngle;
        var endAngle = _props.endAngle;
  
        var sign = (0, _sign2.default)(endAngle - startAngle);
        var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  
        return sign * deltaAngle;
      }
    }, {
      key: 'getSectors',
      value: function getSectors() {
        var _props2 = this.props;
        var cx = _props2.cx;
        var cy = _props2.cy;
        var startAngle = _props2.startAngle;
        var endAngle = _props2.endAngle;
        var data = _props2.data;
        var minAngle = _props2.minAngle;
        var maxAngle = _props2.maxAngle;
  
        var maxValue = Math.max.apply(null, data.map(function (entry) {
          return Math.abs(entry.value);
        }));
        var absMinAngle = Math.abs(minAngle);
        var absMaxAngle = Math.abs(maxAngle);
        var deltaAngle = this.getDeltaAngle();
        var gapAngle = Math.min(Math.abs(absMaxAngle - absMinAngle), 360);
  
        var sectors = data.map(function (entry) {
          var value = entry.value;
          var tempEndAngle = maxValue === 0 ? startAngle : startAngle + (0, _sign2.default)(value * deltaAngle) * (absMinAngle + gapAngle * Math.abs(entry.value) / maxValue);
  
          return _extends({}, entry, {
            cx: cx, cy: cy,
            startAngle: startAngle,
            endAngle: tempEndAngle,
            payload: entry
          });
        });
  
        return sectors;
      }
    }, {
      key: 'getLabelPathArc',
      value: function getLabelPathArc(data, labelContent, style) {
        var label = this.props.label;
  
        var labelProps = _react2.default.isValidElement(label) ? label.props : label;
        var offsetRadius = labelProps.offsetRadius || 2;
        var orientation = labelProps.orientation || 'inner';
        var cx = data.cx;
        var cy = data.cy;
        var innerRadius = data.innerRadius;
        var outerRadius = data.outerRadius;
        var startAngle = data.startAngle;
        var endAngle = data.endAngle;
  
        var clockWise = this.getDeltaAngle() < 0 && data.value > 0;
        var radius = clockWise ? innerRadius + offsetRadius : Math.max(outerRadius - offsetRadius, 0);
  
        if (radius <= 0) {
          return '';
        }
  
        var labelSize = (0, _DOMUtils.getStringSize)(labelContent, style);
        var deltaAngle = labelSize.width / (radius * RADIAN);
        var tempStartAngle = void 0;
        var tempEndAngle = void 0;
  
        if (clockWise) {
          tempStartAngle = orientation === 'inner' ? Math.min(endAngle + deltaAngle, startAngle) : endAngle;
          tempEndAngle = tempStartAngle - deltaAngle;
        } else {
          tempStartAngle = orientation === 'inner' ? Math.max(endAngle - deltaAngle, startAngle) : endAngle;
          tempEndAngle = tempStartAngle + deltaAngle;
        }
  
        var startPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, tempStartAngle);
        var endPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, tempEndAngle);
  
        return 'M' + startPoint.x + ',' + startPoint.y + '\n            A' + radius + ',' + radius + ',0,\n            ' + (deltaAngle >= 180 ? 1 : 0) + ',\n            ' + (clockWise ? 1 : 0) + ',\n            ' + endPoint.x + ',' + endPoint.y;
      }
    }, {
      key: 'renderSectorShape',
      value: function renderSectorShape(shape, props) {
        var sectorShape = void 0;
  
        if (_react2.default.isValidElement(shape)) {
          sectorShape = _react2.default.cloneElement(shape, props);
        } else if ((0, _isFunction3.default)(shape)) {
          sectorShape = shape(props);
        } else {
          sectorShape = _react2.default.createElement(_Sector2.default, props);
        }
  
        return sectorShape;
      }
    }, {
      key: 'renderSectors',
      value: function renderSectors(sectors) {
        var _this2 = this;
  
        var _props3 = this.props;
        var className = _props3.className;
        var shape = _props3.shape;
        var activeShape = _props3.activeShape;
        var activeIndex = _props3.activeIndex;
        var data = _props3.data;
        var _props4 = this.props;
        var animationEasing = _props4.animationEasing;
        var animationDuration = _props4.animationDuration;
        var animationBegin = _props4.animationBegin;
        var isAnimationActive = _props4.isAnimationActive;
  
        var baseProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
  
        return sectors.map(function (entry, i) {
          var startAngle = entry.startAngle;
          var endAngle = entry.endAngle;
  
          return _react2.default.createElement(_reactSmooth2.default, {
            from: { angle: startAngle },
            to: { angle: endAngle },
            begin: animationBegin,
            isActive: isAnimationActive,
            duration: animationDuration,
            easing: animationEasing,
            shouldReAnimate: true,
            key: 'aniamte-' + i,
            onAnimationStart: _this2.handleAnimationStart,
            onAnimationEnd: _this2.handleAnimationEnd
          }, function (_ref2) {
            var angle = _ref2.angle;
  
            var props = _extends({}, baseProps, entry, (0, _ReactUtils.filterEventsOfChild)(_this2.props, entry, i), {
              endAngle: angle,
              key: 'sector-' + i,
              className: 'recharts-radial-bar-sector'
            });
  
            return _this2.renderSectorShape(i === activeIndex ? activeShape : shape, props);
          });
        });
      }
    }, {
      key: 'renderBackground',
      value: function renderBackground(sectors) {
        var _this3 = this;
  
        var _props5 = this.props;
        var startAngle = _props5.startAngle;
        var endAngle = _props5.endAngle;
        var background = _props5.background;
  
        var backgroundProps = (0, _ReactUtils.getPresentationAttributes)(background);
  
        return sectors.map(function (entry, i) {
          var value = entry.value;
  
          var rest = _objectWithoutProperties(entry, ['value']);
  
          var props = _extends({}, rest, {
            fill: '#eee'
          }, backgroundProps, {
            startAngle: startAngle,
            endAngle: endAngle,
            index: i,
            key: 'sector-' + i,
            className: 'recharts-radial-bar-background-sector'
          });
  
          return _this3.renderSectorShape(background, props);
        });
      }
    }, {
      key: 'renderLabels',
      value: function renderLabels(sectors) {
        var _this4 = this;
  
        var isAnimationActive = this.props.isAnimationActive;
  
        if (isAnimationActive && !this.state.isAnimationFinished) {
          return null;
        }
  
        var label = this.props.label;
  
        var isElement = _react2.default.isValidElement(label);
        var formatter = isElement ? label.props.formatter : label.formatter;
        var hasFormatter = (0, _isFunction3.default)(formatter);
  
        return sectors.map(function (entry, i) {
          var content = hasFormatter ? formatter(entry.value) : entry.value;
          var id = (0, _uniqueId3.default)('recharts-defs-');
  
          var style = (0, _ReactUtils.getPresentationAttributes)(label) || { fontSize: 10, fill: '#000' };
          var path = _this4.getLabelPathArc(entry, content, style);
  
          return _react2.default.createElement(_Text2.default, _extends({}, style, { key: 'label-' + i, className: 'recharts-radial-bar-label' }), _react2.default.createElement('defs', null, _react2.default.createElement('path', { id: id, d: path })), _react2.default.createElement('textPath', { xlinkHref: '#' + id }, content));
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props6 = this.props;
        var data = _props6.data;
        var className = _props6.className;
        var background = _props6.background;
        var label = _props6.label;
  
        if (!data || !data.length) {
          return null;
        }
  
        var sectors = this.getSectors();
        var layerClass = (0, _classnames2.default)('recharts-area', className);
  
        return _react2.default.createElement(_Layer2.default, { className: layerClass }, background && _react2.default.createElement(_Layer2.default, { className: 'recharts-radial-bar-background' }, this.renderBackground(sectors)), _react2.default.createElement(_Layer2.default, { className: 'recharts-radial-bar-sectors' }, this.renderSectors(sectors)), label && _react2.default.createElement(_Layer2.default, { className: 'recharts-radial-bar-labels' }, this.renderLabels(sectors)));
      }
    }]);
  
    return RadialBar;
  }(_react.Component), _class2.displayName = 'RadialBar', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    shape: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element]),
    activeShape: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func, _react.PropTypes.element]),
    activeIndex: _react.PropTypes.number,
  
    cx: _react.PropTypes.number,
    cy: _react.PropTypes.number,
    startAngle: _react.PropTypes.number,
    endAngle: _react.PropTypes.number,
    maxAngle: _react.PropTypes.number,
    minAngle: _react.PropTypes.number,
    data: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      cx: _react.PropTypes.number,
      cy: _react.PropTypes.number,
      innerRadius: _react.PropTypes.number,
      outerRadius: _react.PropTypes.number,
      value: _react.PropTypes.value
    })),
    legendType: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
    label: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func, _react.PropTypes.element, _react.PropTypes.object]),
    background: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func, _react.PropTypes.object, _react.PropTypes.element]),
  
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func,
  
    isAnimationActive: _react.PropTypes.bool,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'spring'])
  }), _class2.defaultProps = {
    startAngle: 180,
    endAngle: 0,
    maxAngle: 135,
    minAngle: 0,
    stroke: '#fff',
    fill: '#808080',
    legendType: 'rect',
    data: [],
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease'
  }, _temp2)) || _class;
  
  exports.default = RadialBar;

/***/ }),
/* 107 */
/***/ (function(module, exports) {

  module.exports = require("lodash/uniqueId");

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty2 = __webpack_require__(59);
  
  var _defineProperty3 = _interopRequireDefault2(_defineProperty2);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _range2 = __webpack_require__(109);
  
  var _range3 = _interopRequireDefault(_range2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty3.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Brush
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _d3Scale = __webpack_require__(110);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      (0, _defineProperty3.default)(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }return obj;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Brush = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Brush, _Component);
  
    function Brush(props) {
      _classCallCheck(this, Brush);
  
      var _this = _possibleConstructorReturn(this, (Brush.__proto__ || (0, _getPrototypeOf2.default)(Brush)).call(this, props));
  
      _this.handleMove = function (e) {
        if (_this.leaveTimer) {
          clearTimeout(_this.leaveTimer);
          _this.leaveTimer = null;
        }
  
        if (_this.state.isTravellerMoving) {
          _this.handleTravellerMove(e);
        } else if (_this.state.isSlideMoving) {
          _this.handleSlideMove(e);
        }
      };
  
      _this.handleUp = function () {
        _this.setState({
          isTravellerMoving: false,
          isSlideMoving: false
        });
      };
  
      _this.handleLeaveWrapper = function () {
        if (_this.state.isTravellerMoving || _this.state.isSlideMoving) {
          _this.leaveTimer = setTimeout(_this.handleUp, 1000);
        }
      };
  
      _this.handleEnterSlideOrTraveller = function () {
        _this.setState({
          isTextActive: true
        });
      };
  
      _this.handleLeaveSlideOrTraveller = function () {
        _this.setState({
          isTextActive: false
        });
      };
  
      _this.handleSlideDown = function (e) {
        _this.setState({
          isTravellerMoving: false,
          isSlideMoving: true,
          slideMoveStartX: e.pageX
        });
      };
  
      _this.travellerDownHandlers = {
        startX: _this.handleTravellerDown.bind(_this, 'startX'),
        endX: _this.handleTravellerDown.bind(_this, 'endX')
      };
  
      if (props.data && props.data.length) {
        _this.updateScale(props);
      } else {
        _this.state = {};
      }
      return _this;
    }
  
    _createClass(Brush, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this2 = this;
  
        var _props = this.props;
        var data = _props.data;
        var width = _props.width;
        var x = _props.x;
        var travellerWidth = _props.travellerWidth;
  
        if (nextProps.data !== data) {
          this.updateScale(nextProps);
        } else if (nextProps.width !== width || nextProps.x !== x || nextProps.travellerWidth !== travellerWidth) {
          this.scale.range([nextProps.x, nextProps.x + nextProps.width - nextProps.travellerWidth]);
          this.scaleValues = this.scale.domain().map(function (entry) {
            return _this2.scale(entry);
          });
  
          this.setState({
            startX: this.scale(nextProps.startIndex),
            endX: this.scale(nextProps.endIndex)
          });
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.scale = null;
        this.scaleValues = null;
  
        if (this.leaveTimer) {
          clearTimeout(this.leaveTimer);
          this.leaveTimer = null;
        }
      }
    }, {
      key: 'getIndexInRange',
      value: function getIndexInRange(range, x) {
        var len = range.length;
        var start = 0;
        var end = len - 1;
  
        while (end - start > 1) {
          var middle = Math.floor((start + end) / 2);
  
          if (range[middle] > x) {
            end = middle;
          } else {
            start = middle;
          }
        }
  
        return x >= range[end] ? end : start;
      }
    }, {
      key: 'getIndex',
      value: function getIndex(_ref) {
        var startX = _ref.startX;
        var endX = _ref.endX;
  
        var min = Math.min(startX, endX);
        var max = Math.max(startX, endX);
        var minIndex = this.getIndexInRange(this.scaleValues, min);
        var maxIndex = this.getIndexInRange(this.scaleValues, max);
  
        return {
          startIndex: minIndex,
          endIndex: maxIndex
        };
      }
    }, {
      key: 'getTextOfTick',
      value: function getTextOfTick(index) {
        var _props2 = this.props;
        var data = _props2.data;
        var tickFormatter = _props2.tickFormatter;
        var dataKey = _props2.dataKey;
  
        var text = data[index] && dataKey ? data[index][dataKey] : index;
  
        return (0, _isFunction3.default)(tickFormatter) ? tickFormatter(text) : text;
      }
    }, {
      key: 'handleSlideMove',
      value: function handleSlideMove(e) {
        var _state = this.state;
        var slideMoveStartX = _state.slideMoveStartX;
        var startX = _state.startX;
        var endX = _state.endX;
        var _props3 = this.props;
        var x = _props3.x;
        var width = _props3.width;
        var travellerWidth = _props3.travellerWidth;
        var onChange = _props3.onChange;
  
        var delta = e.pageX - slideMoveStartX;
  
        if (delta > 0) {
          delta = Math.min(delta, x + width - travellerWidth - endX, x + width - travellerWidth - startX);
        } else if (delta < 0) {
          delta = Math.max(delta, x - startX, x - endX);
        }
        var newIndex = this.getIndex({
          startX: startX + delta,
          endX: endX + delta
        });
  
        this.setState({
          startX: startX + delta,
          endX: endX + delta,
          slideMoveStartX: e.pageX
        }, function () {
          if (onChange) {
            onChange(newIndex);
          }
        });
      }
    }, {
      key: 'handleTravellerDown',
      value: function handleTravellerDown(id, e) {
        this.setState({
          isSlideMoving: false,
          isTravellerMoving: true,
          movingTravellerId: id,
          brushMoveStartX: e.pageX
        });
      }
    }, {
      key: 'handleTravellerMove',
      value: function handleTravellerMove(e) {
        var _setState;
  
        var _state2 = this.state;
        var brushMoveStartX = _state2.brushMoveStartX;
        var movingTravellerId = _state2.movingTravellerId;
  
        var prevValue = this.state[movingTravellerId];
        var _props4 = this.props;
        var x = _props4.x;
        var width = _props4.width;
        var travellerWidth = _props4.travellerWidth;
        var onChange = _props4.onChange;
  
        var params = { startX: this.state.startX, endX: this.state.endX };
        var delta = e.pageX - brushMoveStartX;
  
        if (delta > 0) {
          delta = Math.min(delta, x + width - travellerWidth - prevValue);
        } else if (delta < 0) {
          delta = Math.max(delta, x - prevValue);
        }
  
        params[movingTravellerId] = prevValue + delta;
        var newIndex = this.getIndex(params);
  
        this.setState((_setState = {}, _defineProperty(_setState, movingTravellerId, prevValue + delta), _defineProperty(_setState, 'brushMoveStartX', e.pageX), _setState), function () {
          if (onChange) {
            onChange(newIndex);
          }
        });
      }
    }, {
      key: 'updateScale',
      value: function updateScale(props) {
        var _this3 = this;
  
        var data = props.data;
        var startIndex = props.startIndex;
        var endIndex = props.endIndex;
        var x = props.x;
        var width = props.width;
        var travellerWidth = props.travellerWidth;
  
        if (data && data.length) {
          var len = data.length;
          this.scale = (0, _d3Scale.scalePoint)().domain((0, _range3.default)(0, len)).range([x, x + width - travellerWidth]);
          this.scaleValues = this.scale.domain().map(function (entry) {
            return _this3.scale(entry);
          });
          this.state = {
            isTextActive: false,
            isSlideMoving: false,
            isTravellerMoving: false,
            startX: this.scale(startIndex),
            endX: this.scale(endIndex)
          };
        }
      }
    }, {
      key: 'renderBackground',
      value: function renderBackground() {
        var _props5 = this.props;
        var x = _props5.x;
        var y = _props5.y;
        var width = _props5.width;
        var height = _props5.height;
        var fill = _props5.fill;
        var stroke = _props5.stroke;
  
        return _react2.default.createElement('rect', {
          stroke: stroke,
          fill: fill,
          x: x,
          y: y,
          width: width,
          height: height
        });
      }
    }, {
      key: 'renderTraveller',
      value: function renderTraveller(startX, id) {
        var _props6 = this.props;
        var y = _props6.y;
        var travellerWidth = _props6.travellerWidth;
        var height = _props6.height;
        var stroke = _props6.stroke;
  
        var lineY = Math.floor(y + height / 2) - 1;
        var x = Math.max(startX, this.props.x);
  
        return _react2.default.createElement(_Layer2.default, {
          className: 'recharts-brush-traveller',
          onMouseEnter: this.handleEnterSlideOrTraveller,
          onMouseLeave: this.handleLeaveSlideOrTraveller,
          onMouseDown: this.travellerDownHandlers[id],
          style: { cursor: 'col-resize' }
        }, _react2.default.createElement('rect', {
          x: x,
          y: y,
          width: travellerWidth,
          height: height,
          fill: stroke,
          stroke: 'none'
        }), _react2.default.createElement('line', {
          x1: x + 1,
          y1: lineY,
          x2: x + travellerWidth - 1,
          y2: lineY,
          fill: 'none',
          stroke: '#fff'
        }), _react2.default.createElement('line', {
          x1: x + 1,
          y1: lineY + 2,
          x2: x + travellerWidth - 1,
          y2: lineY + 2,
          fill: 'none',
          stroke: '#fff'
        }));
      }
    }, {
      key: 'renderSlide',
      value: function renderSlide(startX, endX) {
        var _props7 = this.props;
        var y = _props7.y;
        var height = _props7.height;
        var stroke = _props7.stroke;
  
        return _react2.default.createElement('rect', {
          className: 'recharts-brush-slide',
          onMouseEnter: this.handleEnterSlideOrTraveller,
          onMouseLeave: this.handleLeaveSlideOrTraveller,
          onMouseDown: this.handleSlideDown,
          style: { cursor: 'move' },
          stroke: 'none',
          fill: stroke,
          fillOpacity: 0.2,
          x: Math.min(startX, endX),
          y: y,
          width: Math.abs(endX - startX),
          height: height
        });
      }
    }, {
      key: 'renderText',
      value: function renderText() {
        var _props8 = this.props;
        var startIndex = _props8.startIndex;
        var endIndex = _props8.endIndex;
        var data = _props8.data;
        var y = _props8.y;
        var height = _props8.height;
        var travellerWidth = _props8.travellerWidth;
        var stroke = _props8.stroke;
        var tickFormatter = _props8.tickFormatter;
        var _state3 = this.state;
        var startX = _state3.startX;
        var endX = _state3.endX;
  
        var offset = 5;
        var style = {
          pointerEvents: 'none',
          fill: stroke
        };
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-brush-texts' }, _react2.default.createElement(_Text2.default, {
          textAnchor: 'end',
          verticalAnchor: 'middle',
          style: style,
          x: Math.min(startX, endX) - offset,
          y: y + height / 2
        }, this.getTextOfTick(startIndex)), _react2.default.createElement(_Text2.default, {
          textAnchor: 'start',
          verticalAnchor: 'middle',
          style: style,
          x: Math.max(startX, endX) + travellerWidth + offset,
          y: y + height / 2
        }, this.getTextOfTick(endIndex)));
      }
    }, {
      key: 'render',
      value: function render() {
        var _props9 = this.props;
        var x = _props9.x;
        var width = _props9.width;
        var travellerWidth = _props9.travellerWidth;
        var data = _props9.data;
        var className = _props9.className;
        var _state4 = this.state;
        var startX = _state4.startX;
        var endX = _state4.endX;
        var isTextActive = _state4.isTextActive;
        var isSlideMoving = _state4.isSlideMoving;
        var isTravellerMoving = _state4.isTravellerMoving;
  
        if (!data || !data.length) {
          return null;
        }
  
        var layerClass = (0, _classnames2.default)('recharts-brush', className);
  
        return _react2.default.createElement(_Layer2.default, {
          className: layerClass,
          onMouseUp: this.handleUp,
          onMouseMove: this.handleMove,
          onMouseLeave: this.handleLeaveWrapper
        }, this.renderBackground(), this.renderSlide(startX, endX), this.renderTraveller(startX, 'startX'), this.renderTraveller(endX, 'endX'), (isTextActive || isSlideMoving || isTravellerMoving) && this.renderText());
      }
    }]);
  
    return Brush;
  }(_react.Component), _class2.displayName = 'Brush', _class2.propTypes = {
    className: _react.PropTypes.string,
  
    fill: _react.PropTypes.string,
    stroke: _react.PropTypes.string,
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired,
    travellerWidth: _react.PropTypes.number,
  
    dataKey: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    data: _react.PropTypes.array,
    startIndex: _react.PropTypes.number,
    endIndex: _react.PropTypes.number,
    tickFormatter: _react.PropTypes.func,
  
    onChange: _react.PropTypes.func
  }, _class2.defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 40,
    travellerWidth: 5,
    fill: '#fff',
    stroke: '#666'
  }, _temp)) || _class;
  
  exports.default = Brush;

/***/ }),
/* 109 */
/***/ (function(module, exports) {

  module.exports = require("lodash/range");

/***/ }),
/* 110 */
/***/ (function(module, exports) {

  module.exports = require("d3-scale");

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  var _isIterable2 = __webpack_require__(112);
  
  var _isIterable3 = _interopRequireDefault2(_isIterable2);
  
  var _getIterator2 = __webpack_require__(26);
  
  var _getIterator3 = _interopRequireDefault2(_getIterator2);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
        for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;_e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }return _arr;
    }return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if ((0, _isIterable3.default)(Object(arr))) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Reference Line
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _DataUtils = __webpack_require__(84);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var ReferenceLine = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(ReferenceLine, _Component);
  
    function ReferenceLine() {
      _classCallCheck(this, ReferenceLine);
  
      return _possibleConstructorReturn(this, (ReferenceLine.__proto__ || (0, _getPrototypeOf2.default)(ReferenceLine)).apply(this, arguments));
    }
  
    _createClass(ReferenceLine, [{
      key: 'getEndPoints',
      value: function getEndPoints(isX, isY) {
        var _props = this.props;
        var xAxis = _props.xAxis;
        var yAxis = _props.yAxis;
        var viewBox = _props.viewBox;
        var x = viewBox.x;
        var y = viewBox.y;
        var width = viewBox.width;
        var height = viewBox.height;
  
        if (isY) {
          var value = this.props.y;
          var scale = yAxis.scale;
  
          var offset = scale.bandwidth ? scale.bandwidth() / 2 : 0;
          var coord = scale(value) + offset;
  
          if ((0, _DataUtils.validateCoordinateInRange)(coord, scale)) {
            return yAxis.orientation === 'left' ? [{ x: x, y: coord }, { x: x + width, y: coord }] : [{ x: x + width, y: coord }, { x: x, y: coord }];
          }
        } else if (isX) {
          var _value = this.props.x;
          var _scale = xAxis.scale;
  
          var _offset = _scale.bandwidth ? _scale.bandwidth() / 2 : 0;
          var _coord = _scale(_value) + _offset;
  
          if ((0, _DataUtils.validateCoordinateInRange)(_coord, _scale)) {
            return xAxis.orientation === 'top' ? [{ x: _coord, y: y }, { x: _coord, y: y + height }] : [{ x: _coord, y: y + height }, { x: _coord, y: y }];
          }
        }
  
        return null;
      }
    }, {
      key: 'getLabelProps',
      value: function getLabelProps(isX, isY) {
        var _props2 = this.props;
        var xAxis = _props2.xAxis;
        var yAxis = _props2.yAxis;
        var labelPosition = _props2.labelPosition;
  
        if (isY) {
          var axis = yAxis;
  
          if (axis.orientation === 'left' && labelPosition === 'end') {
            return { dx: 6, dy: 6, textAnchor: 'start' };
          }
          if (axis.orientation === 'right' && labelPosition === 'start') {
            return { dx: 6, dy: 6, textAnchor: 'start' };
          }
          return { dx: -6, dy: 6, textAnchor: 'end' };
        } else if (isX) {
          var _axis = xAxis;
  
          if (_axis.orientation === 'top') {
            return { dy: 6, textAnchor: 'middle' };
          }
          return { dy: -6, textAnchor: 'middle' };
        }
  
        return null;
      }
    }, {
      key: 'renderLabel',
      value: function renderLabel(isX, isY, end) {
        var _props3 = this.props;
        var label = _props3.label;
        var stroke = _props3.stroke;
  
        var props = _extends({}, (0, _ReactUtils.getPresentationAttributes)(label), {
          stroke: 'none',
          fill: stroke
        }, end, this.getLabelProps(isX, isY));
  
        if (_react2.default.isValidElement(label)) {
          return _react2.default.cloneElement(label, props);
        } else if ((0, _isFunction3.default)(label)) {
          return label(props);
        } else if ((0, _isString3.default)(label) || (0, _isNumber3.default)(label)) {
          return _react2.default.createElement('g', { className: 'recharts-reference-line-label' }, _react2.default.createElement(_Text2.default, props, label));
        }
  
        return null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props4 = this.props;
        var x = _props4.x;
        var y = _props4.y;
        var labelPosition = _props4.labelPosition;
  
        var isX = (0, _isNumber3.default)(x) || (0, _isString3.default)(x);
        var isY = (0, _isNumber3.default)(y) || (0, _isString3.default)(y);
  
        if (!isX && !isY) {
          return null;
        }
  
        var endPoints = this.getEndPoints(isX, isY);
  
        if (!endPoints) {
          return null;
        }
  
        var _endPoints = _slicedToArray(endPoints, 2);
  
        var start = _endPoints[0];
        var end = _endPoints[1];
  
        var props = (0, _ReactUtils.getPresentationAttributes)(this.props);
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-reference-line' }, _react2.default.createElement('line', _extends({}, props, {
          className: 'recharts-reference-line-line',
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y
        })), this.renderLabel(isX, isY, labelPosition === 'start' ? start : end));
      }
    }]);
  
    return ReferenceLine;
  }(_react.Component), _class2.displayName = 'ReferenceLine', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    viewBox: _react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      width: _react.PropTypes.number,
      height: _react.PropTypes.number
    }),
  
    label: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string, _react.PropTypes.element, _react.PropTypes.func]),
  
    xAxis: _react.PropTypes.object,
    yAxis: _react.PropTypes.object,
  
    isFront: _react.PropTypes.bool,
    alwaysShow: _react.PropTypes.bool,
    x: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    y: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  
    yAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    xAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  
    labelPosition: _react.PropTypes.oneOf(['start', 'end'])
  }), _class2.defaultProps = {
    isFront: false,
    alwaysShow: false,
    xAxisId: 0,
    yAxisId: 0,
    fill: 'none',
    stroke: '#ccc',
    fillOpacity: 1,
    strokeWidth: 1,
    labelPosition: 'end'
  }, _temp)) || _class;
  
  exports.default = ReferenceLine;

/***/ }),
/* 112 */
/***/ (function(module, exports) {

  module.exports = require("babel-runtime/core-js/is-iterable");

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Reference Line
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _DataUtils = __webpack_require__(84);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var ReferenceDot = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(ReferenceDot, _Component);
  
    function ReferenceDot() {
      _classCallCheck(this, ReferenceDot);
  
      return _possibleConstructorReturn(this, (ReferenceDot.__proto__ || (0, _getPrototypeOf2.default)(ReferenceDot)).apply(this, arguments));
    }
  
    _createClass(ReferenceDot, [{
      key: 'getCoordinate',
      value: function getCoordinate() {
        var _props = this.props;
        var x = _props.x;
        var y = _props.y;
        var xAxis = _props.xAxis;
        var yAxis = _props.yAxis;
  
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var result = {
          cx: xScale(x) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0),
          cy: yScale(y) + (yScale.bandwidth ? yScale.bandwidth() / 2 : 0)
        };
  
        if ((0, _DataUtils.validateCoordinateInRange)(result.cx, xScale) && (0, _DataUtils.validateCoordinateInRange)(result.cy, yScale)) {
          return result;
        }
  
        return null;
      }
    }, {
      key: 'renderLabel',
      value: function renderLabel(coordinate) {
        var _props2 = this.props;
        var label = _props2.label;
        var stroke = _props2.stroke;
  
        var props = _extends({}, (0, _ReactUtils.getPresentationAttributes)(label), {
          stroke: 'none',
          fill: stroke,
          x: coordinate.cx,
          y: coordinate.cy,
          textAnchor: 'middle'
        });
  
        if (_react2.default.isValidElement(label)) {
          return _react2.default.cloneElement(label, props);
        } else if ((0, _isFunction3.default)(label)) {
          return label(props);
        } else if ((0, _isString3.default)(label) || (0, _isNumber3.default)(label)) {
          return _react2.default.createElement('g', { className: 'recharts-reference-dot-label' }, _react2.default.createElement(_Text2.default, props, label));
        }
  
        return null;
      }
    }, {
      key: 'renderDot',
      value: function renderDot(option, props) {
        var dot = void 0;
  
        if (_react2.default.isValidElement(option)) {
          dot = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          dot = option(props);
        } else {
          dot = _react2.default.createElement(_Dot2.default, _extends({}, props, {
            cx: props.cx,
            cy: props.cy,
            className: 'recharts-reference-dot-dot'
          }));
        }
  
        return dot;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props3 = this.props;
        var x = _props3.x;
        var y = _props3.y;
  
        var isX = (0, _isNumber3.default)(x) || (0, _isString3.default)(x);
        var isY = (0, _isNumber3.default)(y) || (0, _isString3.default)(y);
  
        if (!isX || !isY) {
          return null;
        }
  
        var coordinate = this.getCoordinate();
  
        if (!coordinate) {
          return null;
        }
  
        var shape = this.props.shape;
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-reference-dot' }, this.renderDot(shape, _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), coordinate)), this.renderLabel(coordinate));
      }
    }]);
  
    return ReferenceDot;
  }(_react.Component), _class2.displayName = 'ReferenceDot', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    r: _react.PropTypes.number,
  
    label: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string, _react.PropTypes.func, _react.PropTypes.element]),
  
    xAxis: _react.PropTypes.object,
    yAxis: _react.PropTypes.object,
  
    isFront: _react.PropTypes.bool,
    alwaysShow: _react.PropTypes.bool,
    x: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    y: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  
    yAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    xAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    shape: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element])
  }), _class2.defaultProps = {
    isFront: false,
    alwaysShow: false,
    xAxisId: 0,
    yAxisId: 0,
    r: 10,
    fill: '#fff',
    stroke: '#ccc',
    fillOpacity: 1,
    strokeWidth: 1
  }, _temp)) || _class;
  
  exports.default = ReferenceDot;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Reference Line
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _DataUtils = __webpack_require__(84);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var isValidateValue = function isValidateValue(v) {
    return (0, _isNumber3.default)(v) || (0, _isString3.default)(v);
  };
  
  var ReferenceArea = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(ReferenceArea, _Component);
  
    function ReferenceArea() {
      _classCallCheck(this, ReferenceArea);
  
      return _possibleConstructorReturn(this, (ReferenceArea.__proto__ || (0, _getPrototypeOf2.default)(ReferenceArea)).apply(this, arguments));
    }
  
    _createClass(ReferenceArea, [{
      key: 'getRect',
      value: function getRect(hasX, hasY) {
        var _props = this.props;
        var xValue1 = _props.x1;
        var xValue2 = _props.x2;
        var yValue1 = _props.y1;
        var yValue2 = _props.y2;
        var xAxis = _props.xAxis;
        var yAxis = _props.yAxis;
  
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var xOffset = xScale.bandwidth ? xScale.bandwidth() / 2 : 0;
        var yOffset = yScale.bandwidth ? yScale.bandwidth() / 2 : 0;
        var xRange = xScale.range();
        var yRange = yScale.range();
        var x1 = void 0;
        var x2 = void 0;
        var y1 = void 0;
        var y2 = void 0;
  
        if (hasX && isValidateValue(xValue1)) {
          x1 = xScale(xValue1) + xOffset;
        } else if (hasY) {
          x1 = xRange[0];
        }
        if (hasX && isValidateValue(xValue2)) {
          x2 = xScale(xValue2) + xOffset;
        } else if (hasY) {
          x2 = xRange[1];
        }
        if (hasY && isValidateValue(yValue1)) {
          y1 = yScale(yValue1) + yOffset;
        } else if (hasX) {
          y1 = yRange[0];
        }
        if (hasY && isValidateValue(yValue2)) {
          y2 = yScale(yValue2) + yOffset;
        } else if (hasX) {
          y2 = yRange[1];
        }
  
        if ((0, _DataUtils.validateCoordinateInRange)(x1, xScale) && (0, _DataUtils.validateCoordinateInRange)(x2, xScale) && (0, _DataUtils.validateCoordinateInRange)(y1, yScale) && (0, _DataUtils.validateCoordinateInRange)(y2, yScale)) {
          return {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)
          };
        }
  
        return null;
      }
    }, {
      key: 'renderLabel',
      value: function renderLabel(_ref) {
        var x = _ref.x;
        var y = _ref.y;
        var width = _ref.width;
        var height = _ref.height;
        var _props2 = this.props;
        var label = _props2.label;
        var stroke = _props2.stroke;
  
        var props = _extends({}, label, {
          stroke: 'none',
          fill: stroke,
          x: x + width / 2,
          y: y + height / 2,
          textAnchor: 'middle'
        });
  
        if (_react2.default.isValidElement(label)) {
          return _react2.default.cloneElement(label, props);
        } else if ((0, _isFunction3.default)(label)) {
          return label(props);
        } else if ((0, _isString3.default)(label) || (0, _isNumber3.default)(label)) {
          return _react2.default.createElement('g', { className: 'recharts-reference-area-label' }, _react2.default.createElement(_Text2.default, props, label));
        }
  
        return null;
      }
    }, {
      key: 'renderRect',
      value: function renderRect(option, props) {
        var rect = void 0;
  
        if (_react2.default.isValidElement(option)) {
          rect = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          rect = option(props);
        } else {
          rect = _react2.default.createElement('rect', _extends({}, props, {
            className: 'recharts-reference-area-rect'
          }));
        }
  
        return rect;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props3 = this.props;
        var x1 = _props3.x1;
        var x2 = _props3.x2;
        var y1 = _props3.y1;
        var y2 = _props3.y2;
  
        var hasX = isValidateValue(x1) && isValidateValue(x2);
        var hasY = isValidateValue(y1) && isValidateValue(y2);
  
        if (!hasX && !hasY) {
          return null;
        }
  
        var rect = this.getRect(hasX, hasY);
  
        if (!rect) {
          return null;
        }
  
        var shape = this.props.shape;
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-reference-area' }, this.renderRect(shape, _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), rect)), this.renderLabel(rect));
      }
    }]);
  
    return ReferenceArea;
  }(_react.Component), _class2.displayName = 'ReferenceArea', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    viewBox: _react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      width: _react.PropTypes.number,
      height: _react.PropTypes.number
    }),
  
    label: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string, _react.PropTypes.func, _react.PropTypes.element]),
  
    xAxis: _react.PropTypes.object,
    yAxis: _react.PropTypes.object,
  
    isFront: _react.PropTypes.bool,
    alwaysShow: _react.PropTypes.bool,
    x1: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    x2: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    y1: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    y2: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  
    yAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    xAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    shape: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element])
  }), _class2.defaultProps = {
    isFront: false,
    alwaysShow: false,
    xAxisId: 0,
    yAxisId: 0,
    r: 10,
    fill: '#ccc',
    fillOpacity: 0.5,
    stroke: 'none',
    strokeWidth: 1
  }, _temp)) || _class;
  
  exports.default = ReferenceArea;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _sign = __webpack_require__(91);
  
  var _sign2 = _interopRequireDefault2(_sign);
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Cartesian Axis
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _DOMUtils = __webpack_require__(77);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var CartesianAxis = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(CartesianAxis, _Component);
  
    function CartesianAxis() {
      _classCallCheck(this, CartesianAxis);
  
      return _possibleConstructorReturn(this, (CartesianAxis.__proto__ || (0, _getPrototypeOf2.default)(CartesianAxis)).apply(this, arguments));
    }
  
    _createClass(CartesianAxis, [{
      key: 'getTickLineCoord',
  
      /**
       * Calculate the coordinates of endpoints in ticks
       * @param  {Object} data The data of a simple tick
       * @return {Object} (x1, y1): The coordinate of endpoint close to tick text
       *  (x2, y2): The coordinate of endpoint close to axis
       */
      value: function getTickLineCoord(data) {
        var _props = this.props;
        var x = _props.x;
        var y = _props.y;
        var width = _props.width;
        var height = _props.height;
        var orientation = _props.orientation;
        var tickSize = _props.tickSize;
  
        var x1 = void 0;
        var x2 = void 0;
        var y1 = void 0;
        var y2 = void 0;
  
        var finalTickSize = data.tickSize || tickSize;
  
        switch (orientation) {
          case 'top':
            x1 = x2 = data.coordinate;
            y1 = y + height - finalTickSize;
            y2 = y + height;
            break;
          case 'left':
            y1 = y2 = data.coordinate;
            x1 = x + width - finalTickSize;
            x2 = x + width;
            break;
          case 'right':
            y1 = y2 = data.coordinate;
            x1 = x + finalTickSize;
            x2 = x;
            break;
          default:
            x1 = x2 = data.coordinate;
            y1 = y + finalTickSize;
            y2 = y;
            break;
        }
  
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
      }
    }, {
      key: 'getBaseline',
      value: function getBaseline() {
        var orientation = this.props.orientation;
  
        var baseline = void 0;
  
        switch (orientation) {
          case 'top':
            baseline = 'auto';
            break;
          case 'bottom':
            baseline = 'text-before-edge';
            break;
          default:
            baseline = 'central';
            break;
        }
  
        return baseline;
      }
    }, {
      key: 'getTickTextAnchor',
      value: function getTickTextAnchor() {
        var orientation = this.props.orientation;
  
        var textAnchor = void 0;
  
        switch (orientation) {
          case 'left':
            textAnchor = 'end';
            break;
          case 'right':
            textAnchor = 'start';
            break;
          default:
            textAnchor = 'middle';
            break;
        }
  
        return textAnchor;
      }
    }, {
      key: 'getTickVerticalAnchor',
      value: function getTickVerticalAnchor() {
        var orientation = this.props.orientation;
  
        var verticalAnchor = 'end';
  
        switch (orientation) {
          case 'left':
          case 'right':
            verticalAnchor = 'middle';
            break;
          case 'top':
            verticalAnchor = 'end';
            break;
          default:
            verticalAnchor = 'start';
            break;
        }
  
        return verticalAnchor;
      }
    }, {
      key: 'getLabelProps',
      value: function getLabelProps() {
        var _props2 = this.props;
        var x = _props2.x;
        var y = _props2.y;
        var width = _props2.width;
        var height = _props2.height;
        var orientation = _props2.orientation;
  
        switch (orientation) {
          case 'left':
            return { x: x + width, y: y - 6, textAnchor: 'middle' };
          case 'right':
            return { x: x, y: y - 6, textAnchor: 'middle' };
          case 'top':
            return { x: x + width + 6, y: y + height + 6, textAnchor: 'start' };
          default:
            return { x: x + width + 6, y: y + 6, textAnchor: 'start' };
        }
      }
    }, {
      key: 'renderAxisLine',
      value: function renderAxisLine() {
        var _props3 = this.props;
        var x = _props3.x;
        var y = _props3.y;
        var width = _props3.width;
        var height = _props3.height;
        var orientation = _props3.orientation;
        var axisLine = _props3.axisLine;
  
        var props = _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), {
          fill: 'none'
        }, (0, _ReactUtils.getPresentationAttributes)(axisLine));
  
        switch (orientation) {
          case 'top':
            props = _extends({}, props, { x1: x, y1: y + height, x2: x + width, y2: y + height });
            break;
          case 'left':
            props = _extends({}, props, { x1: x + width, y1: y, x2: x + width, y2: y + height });
            break;
          case 'right':
            props = _extends({}, props, { x1: x, y1: y, x2: x, y2: y + height });
            break;
          default:
            props = _extends({}, props, { x1: x, y1: y, x2: x + width, y2: y });
            break;
        }
  
        return _react2.default.createElement('line', _extends({ className: 'recharts-cartesian-axis-line' }, props));
      }
    }, {
      key: 'renderTickItem',
      value: function renderTickItem(option, props, value) {
        var tickItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          tickItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          tickItem = option(props);
        } else {
          tickItem = _react2.default.createElement(_Text2.default, _extends({}, props, {
            className: 'recharts-cartesian-axis-tick-value'
          }), value);
        }
  
        return tickItem;
      }
    }, {
      key: 'renderTicks',
      value: function renderTicks() {
        var _this2 = this;
  
        var _props4 = this.props;
        var ticks = _props4.ticks;
        var tickLine = _props4.tickLine;
        var stroke = _props4.stroke;
        var tick = _props4.tick;
        var tickFormatter = _props4.tickFormatter;
  
        var finalTicks = CartesianAxis.getTicks(this.props);
        var textAnchor = this.getTickTextAnchor();
        var verticalAnchor = this.getTickVerticalAnchor();
        var axisProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customTickProps = (0, _ReactUtils.getPresentationAttributes)(tick);
        var tickLineProps = _extends({}, axisProps, { fill: 'none' }, (0, _ReactUtils.getPresentationAttributes)(tickLine));
        var items = finalTicks.map(function (entry, i) {
          var lineCoord = _this2.getTickLineCoord(entry);
          var tickProps = _extends({
            textAnchor: textAnchor,
            verticalAnchor: verticalAnchor
          }, axisProps, {
            stroke: 'none', fill: stroke
          }, customTickProps, {
            index: i, x: lineCoord.x1, y: lineCoord.y1, payload: entry
          });
  
          return _react2.default.createElement('g', { className: 'recharts-cartesian-axis-tick', key: 'tick-' + i }, tickLine && _react2.default.createElement('line', _extends({
            className: 'recharts-cartesian-axis-tick-line'
          }, tickLineProps, lineCoord)), tick && _this2.renderTickItem(tick, tickProps, (0, _isFunction3.default)(tickFormatter) ? tickFormatter(entry.value) : entry.value));
        });
  
        return _react2.default.createElement('g', { className: 'recharts-cartesian-axis-ticks' }, items);
      }
    }, {
      key: 'renderLabel',
      value: function renderLabel() {
        var _props5 = this.props;
        var label = _props5.label;
        var stroke = _props5.stroke;
        var orientation = _props5.orientation;
        var viewBox = _props5.viewBox;
  
        var presentation = (0, _ReactUtils.getPresentationAttributes)(this.props);
  
        if (_react2.default.isValidElement(label)) {
          return _react2.default.cloneElement(label, _extends({}, presentation, { orientation: orientation, viewBox: viewBox }));
        } else if ((0, _isFunction3.default)(label)) {
          return label(this.props);
        } else if ((0, _isString3.default)(label) || (0, _isNumber3.default)(label)) {
          var props = _extends({}, presentation, {
            stroke: 'none',
            fill: stroke
          }, this.getLabelProps());
  
          return _react2.default.createElement('g', { className: 'recharts-cartesian-axis-label' }, _react2.default.createElement(_Text2.default, props, label));
        }
  
        return null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props6 = this.props;
        var axisLine = _props6.axisLine;
        var width = _props6.width;
        var height = _props6.height;
        var ticks = _props6.ticks;
        var label = _props6.label;
  
        if (width <= 0 || height <= 0 || !ticks || !ticks.length) {
          return null;
        }
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-cartesian-axis' }, axisLine && this.renderAxisLine(), this.renderTicks(), this.renderLabel());
      }
    }], [{
      key: 'getTicks',
      value: function getTicks(props) {
        var ticks = props.ticks;
        var viewBox = props.viewBox;
        var minTickGap = props.minTickGap;
        var orientation = props.orientation;
        var interval = props.interval;
        var tickFormatter = props.tickFormatter;
  
        if (!ticks || !ticks.length) {
          return [];
        }
  
        return (0, _isNumber3.default)(interval) || (0, _ReactUtils.isSsr)() ? CartesianAxis.getNumberIntervalTicks(ticks, (0, _isNumber3.default)(interval) ? interval : 0) : CartesianAxis.getAutoIntervalTicks(ticks, tickFormatter, viewBox, orientation, minTickGap);
      }
    }, {
      key: 'getNumberIntervalTicks',
      value: function getNumberIntervalTicks(ticks, interval) {
        return ticks.filter(function (entry, i) {
          return i % (interval + 1) === 0;
        });
      }
    }, {
      key: 'getAutoIntervalTicks',
      value: function getAutoIntervalTicks(ticks, tickFormatter, viewBox, orientation, minTickGap) {
        var x = viewBox.x;
        var y = viewBox.y;
        var width = viewBox.width;
        var height = viewBox.height;
  
        var sizeKey = orientation === 'top' || orientation === 'bottom' ? 'width' : 'height';
        var sign = ticks.length >= 2 ? (0, _sign2.default)(ticks[1].coordinate - ticks[0].coordinate) : 1;
  
        var pointer = void 0;
  
        if (sign === 1) {
          pointer = sizeKey === 'width' ? x : y;
        } else {
          pointer = sizeKey === 'width' ? x + width : y + height;
        }
  
        return ticks.filter(function (entry) {
          var tickContent = (0, _isFunction3.default)(tickFormatter) ? tickFormatter(entry.value) : entry.value;
          var tickSize = (0, _DOMUtils.getStringSize)(tickContent)[sizeKey];
          var isShow = sign === 1 ? entry.coordinate - tickSize / 2 >= pointer : entry.coordinate + tickSize / 2 <= pointer;
  
          if (isShow) {
            pointer = entry.coordinate + sign * tickSize / 2 + minTickGap;
          }
  
          return isShow;
        });
      }
    }]);
  
    return CartesianAxis;
  }(_react.Component), _class2.displayName = 'CartesianAxis', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    x: _react.PropTypes.number,
    y: _react.PropTypes.number,
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    orientation: _react.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    viewBox: _react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      width: _react.PropTypes.number,
      height: _react.PropTypes.number
    }),
    label: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string, _react.PropTypes.func, _react.PropTypes.element]),
    tick: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func, _react.PropTypes.object, _react.PropTypes.element]),
    axisLine: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
    tickLine: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
  
    minLabelGap: _react.PropTypes.number,
    ticks: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      value: _react.PropTypes.any,
      coordinate: _react.PropTypes.value
    })),
    tickSize: _react.PropTypes.number,
    stroke: _react.PropTypes.string,
    tickFormatter: _react.PropTypes.func,
    interval: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])
  }), _class2.defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    viewBox: { x: 0, y: 0, width: 0, height: 0 },
    // The orientation of axis
    orientation: 'bottom',
    // The ticks
    ticks: [],
  
    stroke: '#666',
    tickLine: true,
    axisLine: true,
    tick: true,
  
    minTickGap: 5,
    // The width or height of tick
    tickSize: 6,
    interval: 'auto'
  }, _temp)) || _class;
  
  exports.default = CartesianAxis;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Cartesian Grid
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var CartesianGrid = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(CartesianGrid, _Component);
  
    function CartesianGrid() {
      _classCallCheck(this, CartesianGrid);
  
      return _possibleConstructorReturn(this, (CartesianGrid.__proto__ || (0, _getPrototypeOf2.default)(CartesianGrid)).apply(this, arguments));
    }
  
    _createClass(CartesianGrid, [{
      key: 'renderHorizontal',
  
      /**
       * Draw the horizontal grid lines
       * @return {Group} Horizontal lines
       */
      value: function renderHorizontal() {
        var _props = this.props;
        var x = _props.x;
        var width = _props.width;
        var horizontalPoints = _props.horizontalPoints;
  
        if (!horizontalPoints || !horizontalPoints.length) {
          return null;
        }
  
        var props = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var items = horizontalPoints.map(function (entry, i) {
          return _react2.default.createElement('line', _extends({}, props, { key: 'line-' + i, x1: x, y1: entry, x2: x + width, y2: entry }));
        });
  
        return _react2.default.createElement('g', { className: 'recharts-cartesian-grid-horizontal' }, items);
      }
  
      /**
       * Draw vertical grid lines
       * @return {Group} Vertical lines
       */
  
    }, {
      key: 'renderVertical',
      value: function renderVertical() {
        var _props2 = this.props;
        var y = _props2.y;
        var height = _props2.height;
        var verticalPoints = _props2.verticalPoints;
  
        if (!verticalPoints || !verticalPoints.length) {
          return null;
        }
  
        var props = (0, _ReactUtils.getPresentationAttributes)(this.props);
  
        var items = verticalPoints.map(function (entry, i) {
          return _react2.default.createElement('line', _extends({}, props, { key: 'line-' + i, x1: entry, y1: y, x2: entry, y2: y + height }));
        });
  
        return _react2.default.createElement('g', { className: 'recharts-cartesian-grid-vertical' }, items);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props3 = this.props;
        var width = _props3.width;
        var height = _props3.height;
        var horizontal = _props3.horizontal;
        var vertical = _props3.vertical;
  
        if (width <= 0 || height <= 0) {
          return null;
        }
  
        return _react2.default.createElement('g', { className: 'recharts-cartesian-grid' }, horizontal && this.renderHorizontal(), vertical && this.renderVertical());
      }
    }]);
  
    return CartesianGrid;
  }(_react.Component), _class2.displayName = 'CartesianGrid', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    x: _react.PropTypes.number,
    y: _react.PropTypes.number,
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    horizontal: _react.PropTypes.bool,
    vertical: _react.PropTypes.bool,
    horizontalPoints: _react.PropTypes.arrayOf(_react.PropTypes.number),
    verticalPoints: _react.PropTypes.arrayOf(_react.PropTypes.number)
  }), _class2.defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    horizontal: true,
    vertical: true,
    // The ordinates of horizontal grid lines
    horizontalPoints: [],
    // The abscissas of vertical grid lines
    verticalPoints: [],
  
    stroke: '#ccc',
    fill: 'none'
  }, _temp)) || _class;
  
  exports.default = CartesianGrid;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _from = __webpack_require__(78);
  
  var _from2 = _interopRequireDefault2(_from);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  var _iterator = __webpack_require__(70);
  
  var _iterator2 = _interopRequireDefault2(_iterator);
  
  var _typeof3 = __webpack_require__(68);
  
  var _typeof4 = _interopRequireDefault2(_typeof3);
  
  var _symbol = __webpack_require__(71);
  
  var _symbol2 = _interopRequireDefault2(_symbol);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _typeof = typeof _symbol2.default === "function" && (0, _typeof4.default)(_iterator2.default) === "symbol" ? function (obj) {
    return typeof obj === 'undefined' ? 'undefined' : (0, _typeof4.default)(obj);
  } : function (obj) {
    return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === 'undefined' ? 'undefined' : (0, _typeof4.default)(obj);
  };
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Line
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reactDom = __webpack_require__(95);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Curve = __webpack_require__(93);
  
  var _Curve2 = _interopRequireDefault(_Curve);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    } else {
      return (0, _from2.default)(arr);
    }
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof4.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof4.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var FACTOR = 1.0000001;
  
  var Line = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Line, _Component);
  
    function Line(props, ctx) {
      _classCallCheck(this, Line);
  
      var _this = _possibleConstructorReturn(this, (Line.__proto__ || (0, _getPrototypeOf2.default)(Line)).call(this, props, ctx));
  
      _this.handleAnimationEnd = function () {
        _this.setState({ isAnimationFinished: true });
      };
  
      _this.handleAnimationStart = function () {
        _this.setState({ isAnimationFinished: false });
      };
  
      var points = props.points;
  
      _this.state = {
        isAnimationFinished: true,
        totalLength: 0
      };
      return _this;
    }
    /* eslint-disable  react/no-did-mount-set-state */
  
    _createClass(Line, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var isAnimationActive = this.props.isAnimationActive;
  
        if (!isAnimationActive) {
          return;
        }
  
        var totalLength = this.getTotalLength();
  
        this.setState({ totalLength: totalLength });
      }
      /* eslint-disable  react/no-did-update-set-state */
  
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        var _props = this.props;
        var animationId = _props.animationId;
        var points = _props.points;
  
        if (animationId !== prevProps.animationId || points !== prevProps.points) {
          var cur = this.getTotalLength();
          var totalLength = prevState.totalLength;
          // A hack method to trigger animation
  
          this.setState({
            totalLength: cur === totalLength ? cur * FACTOR : cur
          });
        }
      }
    }, {
      key: 'getTotalLength',
      value: function getTotalLength() {
        var curveDom = (0, _reactDom.findDOMNode)(this.refs.animate);
        var totalLength = curveDom && curveDom.getTotalLength && curveDom.getTotalLength() || 0;
  
        return totalLength;
      }
    }, {
      key: 'getStrokeDasharray',
      value: function getStrokeDasharray(length, totalLength, lines) {
        var lineLength = lines.reduce(function (pre, next) {
          return pre + next;
        });
  
        var count = parseInt(length / lineLength, 10);
        var remainLength = length % lineLength;
        var restLength = totalLength - length;
  
        var remainLines = [];
        for (var i = 0, sum = 0;; sum += lines[i], ++i) {
          if (sum + lines[i] > remainLength) {
            remainLines = [].concat(_toConsumableArray(lines.slice(0, i)), [remainLength - sum]);
            break;
          }
        }
  
        var emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];
  
        return [].concat(_toConsumableArray(this.repeat(lines, count)), _toConsumableArray(remainLines), emptyLines).map(function (line) {
          return line + 'px';
        }).join(', ');
      }
    }, {
      key: 'repeat',
      value: function repeat(lines, count) {
        var linesUnit = lines.length % 2 !== 0 ? [].concat(_toConsumableArray(lines), [0]) : lines;
        var result = [];
  
        for (var i = 0; i < count; ++i) {
          result = [].concat(_toConsumableArray(result), _toConsumableArray(linesUnit));
        }
  
        return result;
      }
    }, {
      key: 'renderLabelItem',
      value: function renderLabelItem(option, props, value) {
        var labelItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          labelItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          labelItem = option(props);
        } else {
          labelItem = _react2.default.createElement(_Text2.default, _extends({
            key: props.key
          }, props, {
            className: 'recharts-line-label'
          }), value);
        }
  
        return labelItem;
      }
    }, {
      key: 'renderLabels',
      value: function renderLabels() {
        var _this2 = this;
  
        var isAnimationActive = this.props.isAnimationActive;
  
        if (isAnimationActive && !this.state.isAnimationFinished) {
          return null;
        }
  
        var _props2 = this.props;
        var points = _props2.points;
        var label = _props2.label;
  
        var lineProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customLabelProps = (0, _ReactUtils.getPresentationAttributes)(label);
  
        var labels = points.map(function (entry, i) {
          var x = entry.x + entry.width / 2;
          var y = entry.y;
          var labelProps = _extends({
            textAnchor: 'middle'
          }, entry, lineProps, customLabelProps, {
            index: i,
            key: 'label-' + i,
            payload: entry
          });
  
          return _this2.renderLabelItem(label, labelProps, entry.value);
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-line-labels' }, labels);
      }
    }, {
      key: 'renderDotItem',
      value: function renderDotItem(option, props) {
        var dotItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          dotItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          dotItem = option(props);
        } else {
          dotItem = _react2.default.createElement(_Dot2.default, _extends({}, props, { className: 'recharts-line-dot' }));
        }
  
        return dotItem;
      }
    }, {
      key: 'renderDots',
      value: function renderDots() {
        var _this3 = this;
  
        var isAnimationActive = this.props.isAnimationActive;
  
        if (isAnimationActive && !this.state.isAnimationFinished) {
          return null;
        }
        var _props3 = this.props;
        var dot = _props3.dot;
        var points = _props3.points;
  
        var lineProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customDotProps = (0, _ReactUtils.getPresentationAttributes)(dot);
        var dots = points.map(function (entry, i) {
          var dotProps = _extends({
            key: 'dot-' + i,
            r: 3
          }, lineProps, customDotProps, {
            cx: entry.x, cy: entry.y, index: i, payload: entry
          });
  
          return _this3.renderDotItem(dot, dotProps);
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-line-dots', key: 'dots' }, dots);
      }
    }, {
      key: 'renderCurve',
      value: function renderCurve() {
        var _this4 = this;
  
        var _props4 = this.props;
        var points = _props4.points;
        var className = _props4.className;
        var strokeDasharray = _props4.strokeDasharray;
        var isAnimationActive = _props4.isAnimationActive;
        var animationBegin = _props4.animationBegin;
        var animationDuration = _props4.animationDuration;
        var animationEasing = _props4.animationEasing;
        var onClick = _props4.onClick;
        var onMouseEnter = _props4.onMouseEnter;
        var onMouseLeave = _props4.onMouseLeave;
  
        var other = _objectWithoutProperties(_props4, ['points', 'className', 'strokeDasharray', 'isAnimationActive', 'animationBegin', 'animationDuration', 'animationEasing', 'onClick', 'onMouseEnter', 'onMouseLeave']);
  
        var totalLength = this.state.totalLength;
  
        var animationProps = {
          isActive: isAnimationActive,
          begin: animationBegin,
          canBegin: totalLength > 0,
          easing: animationEasing,
          duration: animationDuration,
          onAnimationEnd: this.handleAnimationEnd,
          onAnimationStart: this.handleAnimationStart,
          ref: 'animate',
          shouldReAnimate: true
        };
        var curveProps = _extends({}, other, { className: 'recharts-line-curve', fill: 'none',
          onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, points: points });
  
        if (strokeDasharray) {
          var _ret = function () {
            var lines = strokeDasharray.split(/[,\s]+/gim).map(function (num) {
              return parseFloat(num);
            });
  
            return {
              v: _react2.default.createElement(_reactSmooth2.default, _extends({}, animationProps, {
                from: { length: 0 },
                to: { length: totalLength }
              }), function (_ref) {
                var length = _ref.length;
                return _react2.default.createElement(_Curve2.default, _extends({}, curveProps, {
                  strokeDasharray: _this4.getStrokeDasharray(length, totalLength, lines)
                }));
              })
            };
          }();
  
          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
  
        return _react2.default.createElement(_reactSmooth2.default, _extends({}, animationProps, {
          from: '0px ' + (totalLength === 0 ? 1 : totalLength) + 'px',
          to: totalLength + 'px 0px',
          attributeName: 'strokeDasharray'
        }), _react2.default.createElement(_Curve2.default, curveProps));
      }
    }, {
      key: 'render',
      value: function render() {
        var _props5 = this.props;
        var dot = _props5.dot;
        var points = _props5.points;
        var label = _props5.label;
        var className = _props5.className;
  
        if (!points || !points.length) {
          return null;
        }
  
        var hasSinglePoint = points.length === 1;
        var layerClass = (0, _classnames2.default)('recharts-line', className);
  
        return _react2.default.createElement(_Layer2.default, { className: layerClass }, !hasSinglePoint && this.renderCurve(), (hasSinglePoint || dot) && this.renderDots(), label && this.renderLabels());
      }
    }]);
  
    return Line;
  }(_react.Component), _class2.displayName = 'Line', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    type: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(['basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed', 'natural', 'monotoneX', 'monotoneY', 'monotone', 'step', 'stepBefore', 'stepAfter']), _react.PropTypes.func]),
    unit: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    dataKey: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
    yAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    xAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    legendType: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    connectNulls: _react.PropTypes.bool,
  
    // whether have dot in line
    activeDot: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.element, _react.PropTypes.func, _react.PropTypes.bool]),
    dot: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.element, _react.PropTypes.func, _react.PropTypes.bool]),
    label: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.element, _react.PropTypes.func, _react.PropTypes.bool]),
  
    points: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      value: _react.PropTypes.value
    })),
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func,
    isAnimationActive: _react.PropTypes.bool,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
    animationId: _react.PropTypes.number
  }), _class2.defaultProps = {
    xAxisId: 0,
    yAxisId: 0,
    connectNulls: false,
    activeDot: true,
    dot: true,
    legendType: 'line',
    stroke: '#3182bd',
    strokeWidth: 1,
    fill: '#fff',
    points: [],
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease'
  }, _temp)) || _class;
  
  exports.default = Line;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isArray2 = __webpack_require__(64);
  
  var _isArray3 = _interopRequireDefault(_isArray2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Area
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _Curve = __webpack_require__(93);
  
  var _Curve2 = _interopRequireDefault(_Curve);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Area = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Area, _Component);
  
    function Area(props, ctx) {
      _classCallCheck(this, Area);
  
      var _this = _possibleConstructorReturn(this, (Area.__proto__ || (0, _getPrototypeOf2.default)(Area)).call(this, props, ctx));
  
      _this.handleAnimationEnd = function () {
        _this.setState({ isAnimationFinished: true });
      };
  
      _this.handleAnimationStart = function () {
        _this.setState({ isAnimationFinished: false });
      };
  
      var points = props.points;
  
      _this.state = { isAnimationFinished: true };
      if (!_this.id) {
        _this.id = 'clipPath' + Date.now();
      }
      return _this;
    }
  
    _createClass(Area, [{
      key: 'renderCurve',
      value: function renderCurve() {
        var _props = this.props;
        var layout = _props.layout;
        var type = _props.type;
        var curve = _props.curve;
        var points = _props.points;
        var connectNulls = _props.connectNulls;
  
        return _react2.default.createElement('g', null, curve && _react2.default.createElement(_Curve2.default, _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), {
          className: 'recharts-area-curve',
          layout: layout,
          type: type,
          connectNulls: connectNulls,
          fill: 'none',
          points: points
        })), _react2.default.createElement(_Curve2.default, _extends({}, this.props, {
          stroke: 'none',
          className: 'recharts-area-area'
        })));
      }
    }, {
      key: 'renderHorizontalRect',
      value: function renderHorizontalRect(alpha) {
        var _props2 = this.props;
        var baseLine = _props2.baseLine;
        var layout = _props2.layout;
        var points = _props2.points;
        var strokeWidth = _props2.strokeWidth;
  
        var startX = points[0].x;
        var endX = points[points.length - 1].x;
        var width = alpha * Math.abs(startX - endX);
        var maxY = Math.max.apply(null, points.map(function (entry) {
          return entry.y || 0;
        }));
  
        if ((0, _isNumber3.default)(baseLine)) {
          maxY = Math.max(baseLine, maxY);
        } else {
          maxY = Math.max(Math.max.apply(null, baseLine.map(function (entry) {
            return entry.y || 0;
          })), maxY);
        }
  
        return _react2.default.createElement('rect', {
          x: startX < endX ? startX : startX - width,
          y: 0,
          width: width,
          height: maxY + (strokeWidth || 1)
        });
      }
    }, {
      key: 'renderVerticalRect',
      value: function renderVerticalRect(alpha) {
        var _props3 = this.props;
        var baseLine = _props3.baseLine;
        var layout = _props3.layout;
        var points = _props3.points;
        var strokeWidth = _props3.strokeWidth;
  
        var startY = points[0].y;
        var endY = points[points.length - 1].y;
        var height = alpha * Math.abs(startY - endY);
        var maxX = Math.max.apply(null, points.map(function (entry) {
          return entry.x || 0;
        }));
  
        if ((0, _isNumber3.default)(baseLine)) {
          maxX = Math.max(baseLine, maxX);
        } else {
          maxX = Math.max(Math.max.apply(null, baseLine.map(function (entry) {
            return entry.x || 0;
          })), maxX);
        }
  
        return _react2.default.createElement('rect', {
          x: 0,
          y: startY < endY ? startY : startY - height,
          width: maxX + (strokeWidth || 1),
          height: height
        });
      }
    }, {
      key: 'renderClipRect',
      value: function renderClipRect(alpha) {
        var layout = this.props.layout;
  
        if (layout === 'vertical') {
          return this.renderVerticalRect(alpha);
        }
  
        return this.renderHorizontalRect(alpha);
      }
    }, {
      key: 'renderClipPath',
      value: function renderClipPath() {
        var _this2 = this;
  
        var _props4 = this.props;
        var isAnimationActive = _props4.isAnimationActive;
        var animationDuration = _props4.animationDuration;
        var animationEasing = _props4.animationEasing;
        var animationBegin = _props4.animationBegin;
        var animationId = _props4.animationId;
  
        return _react2.default.createElement('defs', null, _react2.default.createElement('clipPath', { id: this.id }, _react2.default.createElement(_reactSmooth2.default, {
          easing: animationEasing,
          isActive: isAnimationActive,
          duration: animationDuration,
          key: animationId,
          animationBegin: animationBegin,
          onAnimationStart: this.handleAnimationStart,
          onAnimationEnd: this.handleAnimationEnd,
          from: { alpha: 0 },
          to: { alpha: 1 }
        }, function (_ref) {
          var alpha = _ref.alpha;
          return _this2.renderClipRect(alpha);
        })));
      }
    }, {
      key: 'renderDotItem',
      value: function renderDotItem(option, props) {
        var dotItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          dotItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          dotItem = option(props);
        } else {
          dotItem = _react2.default.createElement(_Dot2.default, _extends({}, props, { className: 'recharts-area-dot' }));
        }
  
        return dotItem;
      }
    }, {
      key: 'renderDots',
      value: function renderDots() {
        var _this3 = this;
  
        var isAnimationActive = this.props.isAnimationActive;
  
        if (isAnimationActive && !this.state.isAnimationFinished) {
          return null;
        }
  
        var _props5 = this.props;
        var dot = _props5.dot;
        var points = _props5.points;
  
        var areaProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customDotProps = (0, _ReactUtils.getPresentationAttributes)(dot);
  
        var dots = points.map(function (entry, i) {
          var dotProps = _extends({
            key: 'dot-' + i,
            r: 3
          }, areaProps, customDotProps, {
            cx: entry.x,
            cy: entry.y,
            index: i,
            playload: entry
          });
  
          return _this3.renderDotItem(dot, dotProps);
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-area-dots' }, dots);
      }
    }, {
      key: 'renderLabelItem',
      value: function renderLabelItem(option, props, value) {
        var labelItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          labelItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          labelItem = option(props);
        } else {
          labelItem = _react2.default.createElement(_Text2.default, _extends({
            key: props.key
          }, props, {
            className: 'recharts-area-label'
          }), (0, _isArray3.default)(value) ? value[1] : value);
        }
  
        return labelItem;
      }
    }, {
      key: 'renderLabels',
      value: function renderLabels() {
        var _this4 = this;
  
        var isAnimationActive = this.props.isAnimationActive;
  
        if (isAnimationActive && !this.state.isAnimationFinished) {
          return null;
        }
  
        var _props6 = this.props;
        var points = _props6.points;
        var label = _props6.label;
  
        var areaProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customLabelProps = (0, _ReactUtils.getPresentationAttributes)(label);
  
        var labels = points.map(function (entry, i) {
          var labelProps = _extends({
            textAnchor: 'middle'
          }, entry, areaProps, customLabelProps, {
            index: i,
            key: 'label-' + i,
            payload: entry
          });
  
          return _this4.renderLabelItem(label, labelProps, entry.value);
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-area-labels' }, labels);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props7 = this.props;
        var dot = _props7.dot;
        var label = _props7.label;
        var points = _props7.points;
        var className = _props7.className;
  
        if (!points || !points.length) {
          return null;
        }
  
        var hasSinglePoint = points.length === 1;
        var layerClass = (0, _classnames2.default)('recharts-area', className);
  
        return _react2.default.createElement(_Layer2.default, { className: layerClass }, !hasSinglePoint ? this.renderClipPath() : null, !hasSinglePoint ? _react2.default.createElement('g', { clipPath: 'url(#' + this.id + ')' }, this.renderCurve()) : null, (dot || hasSinglePoint) && this.renderDots(), label && this.renderLabels());
      }
    }]);
  
    return Area;
  }(_react.Component), _class2.displayName = 'Area', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    dataKey: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
    type: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(['basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed', 'natural', 'monotoneX', 'monotoneY', 'monotone', 'step', 'stepBefore', 'stepAfter']), _react.PropTypes.func]),
    unit: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    yAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    xAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    stackId: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    legendType: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
    connectNulls: _react.PropTypes.bool,
  
    activeDot: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.element, _react.PropTypes.func, _react.PropTypes.bool]),
    // dot configuration
    dot: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element, _react.PropTypes.object, _react.PropTypes.bool]),
    label: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element, _react.PropTypes.object, _react.PropTypes.bool]),
    // have curve configuration
    curve: _react.PropTypes.bool,
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    baseLine: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.array]),
    points: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.array])
    })),
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func,
  
    animationId: _react.PropTypes.number,
    isAnimationActive: _react.PropTypes.bool,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'])
  }), _class2.defaultProps = {
    strokeWidth: 1,
    stroke: '#3182bd',
    fill: '#3182bd',
    fillOpacity: 0.6,
    xAxisId: 0,
    yAxisId: 0,
    legendType: 'line',
    connectNulls: false,
    // points of area
    points: [],
    dot: false,
    label: false,
    curve: true,
    activeDot: true,
  
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease'
  }, _temp)) || _class;
  
  exports.default = Area;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isArray2 = __webpack_require__(64);
  
  var _isArray3 = _interopRequireDefault(_isArray2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Render a group of bar
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _Rectangle = __webpack_require__(94);
  
  var _Rectangle2 = _interopRequireDefault(_Rectangle);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Text = __webpack_require__(87);
  
  var _Text2 = _interopRequireDefault(_Text);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var Bar = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(Bar, _Component);
  
    function Bar() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, Bar);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Bar.__proto__ || (0, _getPrototypeOf2.default)(Bar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        isAnimationFinished: false
      }, _this.handleAnimationEnd = function () {
        _this.setState({ isAnimationFinished: true });
      }, _this.handleAnimationStart = function () {
        _this.setState({ isAnimationFinished: false });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(Bar, [{
      key: 'renderRectangle',
      value: function renderRectangle(option, props) {
        var rectangle = void 0;
  
        if (_react2.default.isValidElement(option)) {
          rectangle = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          rectangle = option(props);
        } else {
          rectangle = _react2.default.createElement(_Rectangle2.default, _extends({}, props, { className: 'recharts-bar-rectangle' }));
        }
  
        return rectangle;
      }
    }, {
      key: 'renderRectangles',
      value: function renderRectangles() {
        var _this2 = this;
  
        var _props = this.props;
        var data = _props.data;
        var shape = _props.shape;
        var layout = _props.layout;
        var isAnimationActive = _props.isAnimationActive;
        var animationBegin = _props.animationBegin;
        var animationDuration = _props.animationDuration;
        var animationEasing = _props.animationEasing;
        var animationId = _props.animationId;
  
        var baseProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var getStyle = function getStyle(isBegin) {
          return {
            transform: 'scale' + (layout === 'vertical' ? 'X' : 'Y') + '(' + (isBegin ? 0 : 1) + ')'
          };
        };
  
        return data.map(function (entry, index) {
          var width = entry.width;
          var height = entry.height;
  
          var props = _extends({}, baseProps, entry, { index: index }, (0, _ReactUtils.filterEventsOfChild)(_this2.props, entry, index));
          var transformOrigin = '';
  
          if (layout === 'vertical') {
            transformOrigin = width > 0 ? 'left center' : 'right center';
          } else {
            transformOrigin = height > 0 ? 'center bottom' : 'center top';
          }
  
          return _react2.default.createElement(_reactSmooth2.default, {
            begin: animationBegin,
            duration: animationDuration,
            isActive: isAnimationActive,
            easing: animationEasing,
            from: getStyle(true),
            to: getStyle(false),
            key: 'rectangle-' + index + '-' + animationId,
            onAnimationEnd: _this2.handleAnimationEnd,
            onAnimationStart: _this2.handleAnimationStart
          }, _react2.default.createElement('g', { style: { transformOrigin: transformOrigin } }, _this2.renderRectangle(shape, props)));
        });
      }
    }, {
      key: 'renderLabelItem',
      value: function renderLabelItem(option, props, value) {
        var labelItem = void 0;
  
        if (_react2.default.isValidElement(option)) {
          labelItem = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          labelItem = option(props);
        } else {
          labelItem = _react2.default.createElement(_Text2.default, _extends({}, props, {
            key: props.key,
            className: 'recharts-bar-label'
          }), (0, _isArray3.default)(value) ? value[1] : value);
        }
  
        return labelItem;
      }
    }, {
      key: 'renderLabels',
      value: function renderLabels() {
        var _this3 = this;
  
        var isAnimationActive = this.props.isAnimationActive;
  
        if (isAnimationActive && !this.state.isAnimationFinished) {
          return null;
        }
  
        var _props2 = this.props;
        var data = _props2.data;
        var label = _props2.label;
        var layout = _props2.layout;
  
        var barProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customLabelProps = (0, _ReactUtils.getPresentationAttributes)(label);
        var textAnchor = layout === 'vertical' ? 'start' : 'middle';
        var labels = data.map(function (entry, i) {
          var x = 0;
          var y = 0;
  
          if (layout === 'vertical') {
            x = 5 + entry.x + entry.width;
            y = 5 + entry.y + entry.height / 2;
          } else {
            x = entry.x + entry.width / 2;
            y = entry.y - 5;
          }
  
          var labelProps = _extends({
            textAnchor: textAnchor
          }, barProps, entry, customLabelProps, {
            x: x,
            y: y,
            index: i,
            key: 'label-' + i,
            payload: entry
          });
  
          var labelValue = entry.value;
          if (label === true && entry.value && labelProps.label) {
            labelValue = labelProps.label;
          }
          return _this3.renderLabelItem(label, labelProps, labelValue);
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-bar-labels' }, labels);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props3 = this.props;
        var data = _props3.data;
        var className = _props3.className;
        var label = _props3.label;
  
        if (!data || !data.length) {
          return null;
        }
  
        var layerClass = (0, _classnames2.default)('recharts-bar', className);
  
        return _react2.default.createElement(_Layer2.default, { className: layerClass }, _react2.default.createElement(_Layer2.default, { className: 'recharts-bar-rectangles' }, this.renderRectangles()), label && _react2.default.createElement(_Layer2.default, { className: 'recharts-bar-rectangle-labels' }, this.renderLabels()));
      }
    }]);
  
    return Bar;
  }(_react.Component), _class2.displayName = 'Bar', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
    className: _react.PropTypes.string,
    layout: _react.PropTypes.oneOf(['vertical', 'horizontal']),
    xAxisId: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    yAxisId: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    stackId: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    barSize: _react.PropTypes.number,
    unit: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    dataKey: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
    legendType: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
    minPointSize: _react.PropTypes.number,
  
    shape: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element]),
    label: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func, _react.PropTypes.object, _react.PropTypes.element]),
    data: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      width: _react.PropTypes.number,
      height: _react.PropTypes.number,
      radius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.array]),
      value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.array])
    })),
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func,
  
    animationId: _react.PropTypes.number,
    isAnimationActive: _react.PropTypes.bool,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'])
  }), _class2.defaultProps = {
    fill: '#000',
    xAxisId: 0,
    yAxisId: 0,
    legendType: 'rect',
    minPointSize: 0,
    // data of bar
    data: [],
    layout: 'vertical',
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease'
  }, _temp2)) || _class;
  
  exports.default = Bar;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Render a group of scatters
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _Curve = __webpack_require__(93);
  
  var _Curve2 = _interopRequireDefault(_Curve);
  
  var _Symbols = __webpack_require__(75);
  
  var _Symbols2 = _interopRequireDefault(_Symbols);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _AnimationDecorator = __webpack_require__(104);
  
  var _AnimationDecorator2 = _interopRequireDefault(_AnimationDecorator);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var PI = Math.PI;
  var SYMBOL_STYLE = { transformOrigin: 'center center' };
  
  var Scatter = (0, _AnimationDecorator2.default)(_class = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(Scatter, _Component);
  
    function Scatter() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, Scatter);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Scatter.__proto__ || (0, _getPrototypeOf2.default)(Scatter)).call.apply(_ref, [this].concat(args))), _this), _this.state = { activeIndex: -1 }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(Scatter, [{
      key: 'renderSymbolItem',
      value: function renderSymbolItem(option, props) {
        var symbol = void 0;
  
        if (_react2.default.isValidElement(option)) {
          symbol = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          symbol = option(props);
        } else {
          symbol = _react2.default.createElement(_Symbols2.default, _extends({}, props, { type: option }));
        }
  
        return symbol;
      }
    }, {
      key: 'renderSymbols',
      value: function renderSymbols() {
        var _this2 = this;
  
        var _props = this.props;
        var points = _props.points;
        var shape = _props.shape;
        var activeShape = _props.activeShape;
        var activeIndex = _props.activeIndex;
        var animationBegin = _props.animationBegin;
        var animationDuration = _props.animationDuration;
        var isAnimationActive = _props.isAnimationActive;
        var animationEasing = _props.animationEasing;
        var animationId = _props.animationId;
  
        var baseProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
  
        return points.map(function (entry, i) {
          var props = _extends({
            key: 'symbol-' + i
          }, baseProps, entry);
          return _react2.default.createElement(_Layer2.default, _extends({
            className: 'recharts-scatter-symbol'
          }, (0, _ReactUtils.filterEventsOfChild)(_this2.props, entry, i), {
            key: 'symbol-' + i
          }), _react2.default.createElement(_reactSmooth2.default, {
            from: { size: 0 },
            to: { size: props.size },
            duration: animationDuration,
            begin: animationBegin,
            isActive: isAnimationActive,
            key: animationId,
            easing: animationEasing
          }, function (_ref2) {
            var size = _ref2.size;
  
            var finalProps = _extends({}, props, { size: size });
  
            return _this2.renderSymbolItem(activeIndex === i ? activeShape : shape, finalProps);
          }));
        });
      }
    }, {
      key: 'renderLine',
      value: function renderLine() {
        var _props2 = this.props;
        var points = _props2.points;
        var line = _props2.line;
        var lineType = _props2.lineType;
        var lineJointType = _props2.lineJointType;
  
        var scatterProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        var customLineProps = (0, _ReactUtils.getPresentationAttributes)(line);
        var linePoints = void 0;
  
        if (lineType === 'joint') {
          linePoints = points.map(function (entry) {
            return { x: entry.cx, y: entry.cy };
          });
        }
        var lineProps = _extends({}, scatterProps, {
          fill: 'none',
          stroke: scatterProps.fill
        }, customLineProps, {
          points: linePoints
        });
        var lineItem = void 0;
        if (_react2.default.isValidElement(line)) {
          lineItem = _react2.default.cloneElement(line, lineProps);
        } else if ((0, _isFunction3.default)(line)) {
          lineItem = line(lineProps);
        } else {
          lineItem = _react2.default.createElement(_Curve2.default, _extends({}, lineProps, { type: lineJointType }));
        }
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-scatter-line', key: 'recharts-scatter-line' }, lineItem);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props3 = this.props;
        var points = _props3.points;
        var line = _props3.line;
        var className = _props3.className;
  
        if (!points || !points.length) {
          return null;
        }
  
        var layerClass = (0, _classnames2.default)('recharts-scatter', className);
  
        return _react2.default.createElement(_Layer2.default, { className: layerClass }, line && this.renderLine(), _react2.default.createElement(_Layer2.default, { key: 'recharts-scatter-symbols' }, this.renderSymbols()));
      }
    }]);
  
    return Scatter;
  }(_react.Component), _class2.displayName = 'Scatter', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
  
    xAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    yAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    zAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    line: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object, _react.PropTypes.func, _react.PropTypes.element]),
    lineType: _react.PropTypes.oneOf(['fitting', 'joint']),
    lineJointType: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(['basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed', 'natural', 'monotoneX', 'monotoneY', 'monotone', 'step', 'stepBefore', 'stepAfter']), _react.PropTypes.func]),
    legendType: _react.PropTypes.oneOf(['line', 'square', 'rect', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
    className: _react.PropTypes.string,
  
    activeIndex: _react.PropTypes.number,
    activeShape: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func, _react.PropTypes.element]),
    shape: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']), _react.PropTypes.element, _react.PropTypes.func]),
    points: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      cx: _react.PropTypes.number,
      cy: _react.PropTypes.number,
      size: _react.PropTypes.number,
      payload: _react.PropTypes.shape({
        x: _react.PropTypes.number,
        y: _react.PropTypes.number,
        z: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])
      })
    })),
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func,
  
    isAnimationActive: _react.PropTypes.bool,
    animationId: _react.PropTypes.number,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'])
  }), _class2.defaultProps = {
    fill: '#fff',
    xAxisId: 0,
    yAxisId: 0,
    zAxisId: 0,
    legendType: 'circle',
    lineType: 'joint',
    lineJointType: 'linear',
    data: [],
    shape: 'circle',
  
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 400,
    animationEasing: 'linear'
  }, _temp2)) || _class) || _class;
  
  exports.default = Scatter;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview X Axis
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var XAxis = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(XAxis, _Component);
  
    function XAxis() {
      _classCallCheck(this, XAxis);
  
      return _possibleConstructorReturn(this, (XAxis.__proto__ || (0, _getPrototypeOf2.default)(XAxis)).apply(this, arguments));
    }
  
    _createClass(XAxis, [{
      key: 'render',
      value: function render() {
        return null;
      }
    }]);
  
    return XAxis;
  }(_react.Component), _class2.displayName = 'XAxis', _class2.propTypes = {
    allowDecimals: _react.PropTypes.bool,
    hide: _react.PropTypes.bool,
    // The name of data displayed in the axis
    name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The unit of data displayed in the axis
    unit: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The unique id of x-axis
    xAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    domain: _react.PropTypes.arrayOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.oneOf(['auto', 'dataMin', 'dataMax'])])),
    // The key of data displayed in the axis
    dataKey: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The width of axis which is usually calculated internally
    width: _react.PropTypes.number,
    // The height of axis, which need to be setted by user
    height: _react.PropTypes.number,
    // The orientation of axis
    orientation: _react.PropTypes.oneOf(['top', 'bottom']),
    type: _react.PropTypes.oneOf(['number', 'category']),
    // Ticks can be any type when the axis is the type of category
    // Ticks must be numbers when the axis is the type of number
    ticks: _react.PropTypes.array,
    // The count of ticks
    tickCount: _react.PropTypes.number,
    // The formatter function of tick
    tickFormatter: _react.PropTypes.func,
    padding: _react.PropTypes.shape({
      left: _react.PropTypes.number,
      right: _react.PropTypes.number
    }),
    allowDataOverflow: _react.PropTypes.bool
  }, _class2.defaultProps = {
    allowDecimals: true,
    hide: false,
    orientation: 'bottom',
    width: 0,
    height: 30,
    xAxisId: 0,
    tickCount: 5,
    type: 'category',
    domain: [0, 'auto'],
    padding: { left: 0, right: 0 },
    allowDataOverflow: false
  }, _temp)) || _class;
  
  exports.default = XAxis;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Y Axis
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var YAxis = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(YAxis, _Component);
  
    function YAxis() {
      _classCallCheck(this, YAxis);
  
      return _possibleConstructorReturn(this, (YAxis.__proto__ || (0, _getPrototypeOf2.default)(YAxis)).apply(this, arguments));
    }
  
    _createClass(YAxis, [{
      key: 'render',
      value: function render() {
        return null;
      }
    }]);
  
    return YAxis;
  }(_react.Component), _class2.displayName = 'YAxis', _class2.propTypes = {
    allowDecimals: _react.PropTypes.bool,
    hide: _react.PropTypes.bool,
    // The name of data displayed in the axis
    name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The unit of data displayed in the axis
    unit: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The unique id of y-axis
    yAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    domain: _react.PropTypes.arrayOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.oneOf(['auto', 'dataMin', 'dataMax'])])),
    // The key of data displayed in the axis
    dataKey: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // Ticks can be any type when the axis is the type of category
    // Ticks must be numbers when the axis is the type of number
    ticks: _react.PropTypes.array,
    // The count of ticks
    tickCount: _react.PropTypes.number,
    // The formatter function of tick
    tickFormatter: _react.PropTypes.func,
    // The width of axis, which need to be setted by user
    width: _react.PropTypes.number,
    // The height of axis which is usually calculated in Chart
    height: _react.PropTypes.number,
    // The orientation of axis
    orientation: _react.PropTypes.oneOf(['left', 'right']),
    type: _react.PropTypes.oneOf(['number', 'category']),
    padding: _react.PropTypes.shape({
      top: _react.PropTypes.number,
      bottom: _react.PropTypes.number
    }),
    allowDataOverflow: _react.PropTypes.bool
  }, _class2.defaultProps = {
    allowDecimals: true,
    hide: false,
    orientation: 'left',
    width: 60,
    height: 0,
    yAxisId: 0,
    tickCount: 5,
    type: 'number',
    domain: [0, 'auto'],
    padding: { top: 0, bottom: 0 },
    allowDataOverflow: false
  }, _temp)) || _class;
  
  exports.default = YAxis;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Z Axis
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var ZAxis = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(ZAxis, _Component);
  
    function ZAxis() {
      _classCallCheck(this, ZAxis);
  
      return _possibleConstructorReturn(this, (ZAxis.__proto__ || (0, _getPrototypeOf2.default)(ZAxis)).apply(this, arguments));
    }
  
    _createClass(ZAxis, [{
      key: 'render',
      value: function render() {
        return null;
      }
    }]);
  
    return ZAxis;
  }(_react.Component), _class2.displayName = 'ZAxis', _class2.propTypes = {
    // The name of data displayed in the axis
    name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The unit of data displayed in the axis
    unit: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The unique id of z-axis
    zAxisId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The key of data displayed in the axis
    dataKey: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    // The range of axis
    range: _react.PropTypes.arrayOf(_react.PropTypes.number)
  }, _class2.defaultProps = {
    zAxisId: 0,
    range: [64, 64]
  }, _temp)) || _class;
  
  exports.default = ZAxis;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LineChart = undefined;
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _isNil2 = __webpack_require__(125);
  
  var _isNil3 = _interopRequireDefault(_isNil2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Line Chart
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Curve = __webpack_require__(93);
  
  var _Curve2 = _interopRequireDefault(_Curve);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _generateCategoricalChart = __webpack_require__(126);
  
  var _generateCategoricalChart2 = _interopRequireDefault(_generateCategoricalChart);
  
  var _Line = __webpack_require__(117);
  
  var _Line2 = _interopRequireDefault(_Line);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _CartesianUtils = __webpack_require__(127);
  
  var _DataUtils = __webpack_require__(84);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _AnimationDecorator = __webpack_require__(104);
  
  var _AnimationDecorator2 = _interopRequireDefault(_AnimationDecorator);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var LineChart = (0, _AnimationDecorator2.default)(_class = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(LineChart, _Component);
  
    function LineChart() {
      _classCallCheck(this, LineChart);
  
      return _possibleConstructorReturn(this, (LineChart.__proto__ || (0, _getPrototypeOf2.default)(LineChart)).apply(this, arguments));
    }
  
    _createClass(LineChart, [{
      key: 'getComposedData',
  
      /**
       * Compose the data of each group
       * @param  {Object} xAxis   The configuration of x-axis
       * @param  {Object} yAxis   The configuration of y-axis
       * @param  {String} dataKey The unique key of a group
       * @return {Array}  Composed data
       */
      value: function getComposedData(xAxis, yAxis, dataKey) {
        var _props = this.props;
        var layout = _props.layout;
        var dataStartIndex = _props.dataStartIndex;
        var dataEndIndex = _props.dataEndIndex;
        var isComposed = _props.isComposed;
  
        var data = this.props.data.slice(dataStartIndex, dataEndIndex + 1);
        var bandSize = (0, _DataUtils.getBandSizeOfScale)(layout === 'horizontal' ? xAxis.scale : yAxis.scale);
        var xTicks = (0, _CartesianUtils.getTicksOfAxis)(xAxis);
        var yTicks = (0, _CartesianUtils.getTicksOfAxis)(yAxis);
  
        return data.map(function (entry, index) {
          var value = entry[dataKey];
  
          if (layout === 'horizontal') {
            return {
              x: xTicks[index].coordinate + bandSize / 2,
              y: (0, _isNil3.default)(value) ? null : yAxis.scale(value),
              value: value
            };
          }
  
          return {
            x: (0, _isNil3.default)(value) ? null : xAxis.scale(value),
            y: yTicks[index].coordinate + bandSize / 2,
            value: value
          };
        });
      }
    }, {
      key: 'renderCursor',
      value: function renderCursor(xAxisMap, yAxisMap, offset) {
        var _props2 = this.props;
        var children = _props2.children;
        var isTooltipActive = _props2.isTooltipActive;
        var layout = _props2.layout;
        var activeTooltipIndex = _props2.activeTooltipIndex;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem || !tooltipItem.props.cursor || !isTooltipActive || activeTooltipIndex < 0) {
          return null;
        }
  
        var axisMap = layout === 'horizontal' ? xAxisMap : yAxisMap;
        var axis = (0, _DataUtils.getAnyElementOfObject)(axisMap);
        var ticks = (0, _CartesianUtils.getTicksOfAxis)(axis);
  
        if (!ticks || !ticks[activeTooltipIndex]) {
          return null;
        }
  
        var start = ticks[activeTooltipIndex].coordinate;
        var x1 = layout === 'horizontal' ? start : offset.left;
        var y1 = layout === 'horizontal' ? offset.top : start;
        var x2 = layout === 'horizontal' ? start : offset.left + offset.width;
        var y2 = layout === 'horizontal' ? offset.top + offset.height : start;
        var cursorProps = _extends({
          stroke: '#ccc'
        }, (0, _ReactUtils.getPresentationAttributes)(tooltipItem.props.cursor), {
          points: [{ x: x1, y: y1 }, { x: x2, y: y2 }]
        });
  
        return _react2.default.isValidElement(tooltipItem.props.cursor) ? _react2.default.cloneElement(tooltipItem.props.cursor, cursorProps) : _react2.default.createElement(_Curve2.default, _extends({}, cursorProps, { type: 'linear', className: 'recharts-tooltip-cursor' }));
      }
    }, {
      key: 'renderActiveDot',
      value: function renderActiveDot(option, props, index) {
        var dot = void 0;
  
        if (_react2.default.isValidElement(option)) {
          dot = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          dot = option(props);
        } else {
          dot = _react2.default.createElement(_Dot2.default, _extends({}, props, { className: 'recharts-line-active-dot' }));
        }
  
        return _react2.default.createElement(_reactSmooth2.default, {
          from: 'scale(0)',
          to: 'scale(1)',
          duration: 400,
          key: 'dot-' + props.dataKey,
          attributeName: 'transform'
        }, _react2.default.createElement(_Layer2.default, { style: { transformOrigin: 'center center' } }, dot));
      }
      /**
       * Draw the main part of line chart
       * @param  {Array} items     All the instance of Line
       * @param  {Object} xAxisMap The configuration of all x-axes
       * @param  {Object} yAxisMap The configuration of all y-axes
       * @param  {Object} offset   The offset of main part in the svg element
       * @return {ReactComponent}  All the instances of Line
       */
  
    }, {
      key: 'renderItems',
      value: function renderItems(items, xAxisMap, yAxisMap, offset) {
        var _this2 = this;
  
        var _props3 = this.props;
        var children = _props3.children;
        var layout = _props3.layout;
        var isTooltipActive = _props3.isTooltipActive;
        var activeTooltipIndex = _props3.activeTooltipIndex;
        var animationId = _props3.animationId;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
        var hasDot = tooltipItem && isTooltipActive;
        var dotItems = [];
  
        var lineItems = items.map(function (child, i) {
          var _child$props = child.props;
          var xAxisId = _child$props.xAxisId;
          var yAxisId = _child$props.yAxisId;
          var dataKey = _child$props.dataKey;
          var stroke = _child$props.stroke;
          var activeDot = _child$props.activeDot;
  
          var points = _this2.getComposedData(xAxisMap[xAxisId], yAxisMap[yAxisId], dataKey);
          var activePoint = points[activeTooltipIndex];
  
          if (hasDot && activeDot && activePoint) {
            var dotProps = _extends({
              index: i,
              dataKey: dataKey,
              cx: activePoint.x, cy: activePoint.y, r: 4,
              fill: stroke, strokeWidth: 2, stroke: '#fff'
            }, (0, _ReactUtils.getPresentationAttributes)(activeDot));
            dotItems.push(_this2.renderActiveDot(activeDot, dotProps, i));
          }
  
          return _react2.default.cloneElement(child, _extends({
            key: 'line-' + i
          }, offset, {
            layout: layout,
            points: points,
            animationId: animationId
          }));
        }, this);
  
        return _react2.default.createElement('g', { key: 'recharts-line-wrapper' }, _react2.default.createElement('g', { key: 'recharts-line' }, lineItems), _react2.default.createElement('g', { key: 'recharts-line-dot' }, dotItems));
      }
    }, {
      key: 'render',
      value: function render() {
        var _props4 = this.props;
        var isComposed = _props4.isComposed;
        var xAxisMap = _props4.xAxisMap;
        var yAxisMap = _props4.yAxisMap;
        var offset = _props4.offset;
        var graphicalItems = _props4.graphicalItems;
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-line-graphical' }, !isComposed && this.renderCursor(xAxisMap, yAxisMap, offset), this.renderItems(graphicalItems, xAxisMap, yAxisMap, offset));
      }
    }]);
  
    return LineChart;
  }(_react.Component), _class2.displayName = 'LineChart', _class2.propTypes = {
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    dataStartIndex: _react.PropTypes.number,
    dataEndIndex: _react.PropTypes.number,
    data: _react.PropTypes.array,
    isTooltipActive: _react.PropTypes.bool,
    activeTooltipIndex: _react.PropTypes.number,
    xAxisMap: _react.PropTypes.object,
    yAxisMap: _react.PropTypes.object,
    offset: _react.PropTypes.object,
    graphicalItems: _react.PropTypes.array,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
    // used internally
    isComposed: _react.PropTypes.bool,
    animationId: _react.PropTypes.number
  }, _temp)) || _class) || _class;
  
  exports.default = (0, _generateCategoricalChart2.default)(LineChart, _Line2.default);
  exports.LineChart = LineChart;

/***/ }),
/* 125 */
/***/ (function(module, exports) {

  module.exports = require("lodash/isNil");

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _keys = __webpack_require__(58);
  
  var _keys2 = _interopRequireDefault2(_keys);
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty2 = __webpack_require__(59);
  
  var _defineProperty3 = _interopRequireDefault2(_defineProperty2);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _range2 = __webpack_require__(109);
  
  var _range3 = _interopRequireDefault(_range2);
  
  var _isNil2 = __webpack_require__(125);
  
  var _isNil3 = _interopRequireDefault(_isNil2);
  
  var _uniqueId2 = __webpack_require__(107);
  
  var _uniqueId3 = _interopRequireDefault(_uniqueId2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty3.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reactDom = __webpack_require__(95);
  
  var _reactDom2 = _interopRequireDefault(_reactDom);
  
  var _d3Scale = __webpack_require__(110);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Legend = __webpack_require__(66);
  
  var _Legend2 = _interopRequireDefault(_Legend);
  
  var _LogUtils = __webpack_require__(85);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _CartesianAxis = __webpack_require__(115);
  
  var _CartesianAxis2 = _interopRequireDefault(_CartesianAxis);
  
  var _CartesianGrid = __webpack_require__(116);
  
  var _CartesianGrid2 = _interopRequireDefault(_CartesianGrid);
  
  var _ReferenceLine = __webpack_require__(111);
  
  var _ReferenceLine2 = _interopRequireDefault(_ReferenceLine);
  
  var _ReferenceDot = __webpack_require__(113);
  
  var _ReferenceDot2 = _interopRequireDefault(_ReferenceDot);
  
  var _ReferenceArea = __webpack_require__(114);
  
  var _ReferenceArea2 = _interopRequireDefault(_ReferenceArea);
  
  var _XAxis = __webpack_require__(121);
  
  var _XAxis2 = _interopRequireDefault(_XAxis);
  
  var _YAxis = __webpack_require__(122);
  
  var _YAxis2 = _interopRequireDefault(_YAxis);
  
  var _Brush = __webpack_require__(108);
  
  var _Brush2 = _interopRequireDefault(_Brush);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _DOMUtils = __webpack_require__(77);
  
  var _DataUtils = __webpack_require__(84);
  
  var _CartesianUtils = __webpack_require__(127);
  
  var _Events = __webpack_require__(129);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      (0, _defineProperty3.default)(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }return obj;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var ORIENT_MAP = {
    xAxis: ['bottom', 'top'],
    yAxis: ['left', 'right']
  };
  
  var generateCategoricalChart = function generateCategoricalChart(ChartComponent, GraphicalChild) {
    var _class, _temp;
  
    var CategoricalChartWrapper = (_temp = _class = function (_Component) {
      _inherits(CategoricalChartWrapper, _Component);
  
      function CategoricalChartWrapper(props) {
        _classCallCheck(this, CategoricalChartWrapper);
  
        var _this = _possibleConstructorReturn(this, (CategoricalChartWrapper.__proto__ || (0, _getPrototypeOf2.default)(CategoricalChartWrapper)).call(this, props));
  
        _this.handleReceiveSyncEvent = function (cId, chartId, data) {
          var syncId = _this.props.syncId;
  
          if (syncId === cId && chartId !== _this.chartId) {
            _this.setState(data);
          }
        };
  
        _this.handleBrushChange = function (_ref) {
          var startIndex = _ref.startIndex;
          var endIndex = _ref.endIndex;
  
          _this.setState({
            dataStartIndex: startIndex,
            dataEndIndex: endIndex
          });
  
          _this.triggerSyncEvent({
            dataStartIndex: startIndex,
            dataEndIndex: endIndex
          });
        };
  
        _this.handleMouseLeave = function () {
          var nextState = { isTooltipActive: false };
  
          _this.setState(nextState);
          _this.triggerSyncEvent(nextState);
        };
  
        _this.state = _this.createDefaultState(_this.props);
        _this.validateAxes();
        _this.uniqueChartId = (0, _uniqueId3.default)('recharts');
        return _this;
      }
  
      _createClass(CategoricalChartWrapper, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          if (!(0, _isNil3.default)(this.props.syncId)) {
            this.addListener();
          }
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (nextProps.data !== this.props.data) {
            this.setState(this.createDefaultState(nextProps));
          }
          // add syncId
          if ((0, _isNil3.default)(this.props.syncId) && !(0, _isNil3.default)(nextProps.syncId)) {
            this.addListener();
          }
          // remove syncId
          if (!(0, _isNil3.default)(this.props.syncId) && (0, _isNil3.default)(nextProps.syncId)) {
            this.removeListener();
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (!(0, _isNil3.default)(this.props.syncId)) {
            this.removeListener();
          }
        }
        /**
        * Get the configuration of all x-axis or y-axis
        * @param  {String} axisType    The type of axis
        * @param  {Array} items        The instances of item
        * @param  {Object} stackGroups The items grouped by axisId and stackId
        * @return {Object}          Configuration
        */
  
      }, {
        key: 'getAxisMap',
        value: function getAxisMap() {
          var axisType = arguments.length <= 0 || arguments[0] === undefined ? 'xAxis' : arguments[0];
          var items = arguments[1];
          var stackGroups = arguments[2];
          var children = this.props.children;
  
          var Axis = axisType === 'xAxis' ? _XAxis2.default : _YAxis2.default;
          var axisIdKey = axisType === 'xAxis' ? 'xAxisId' : 'yAxisId';
          // Get all the instance of Axis
          var axes = (0, _ReactUtils.findAllByType)(children, Axis);
  
          var axisMap = {};
  
          if (axes && axes.length) {
            axisMap = this.getAxisMapByAxes(axes, items, axisType, axisIdKey, stackGroups);
          } else if (items && items.length) {
            axisMap = this.getAxisMapByItems(items, Axis, axisType, axisIdKey, stackGroups);
          }
  
          return axisMap;
        }
  
        /**
         * Get the configuration of axis by the options of axis instance
         * @param {Array}  axes  The instance of axes
         * @param  {Array} items The instances of item
         * @param  {String} axisType The type of axis, xAxis - x-axis, yAxis - y-axis
         * @param  {String} axisIdKey The unique id of an axis
         * @param  {Object} stackGroups The items grouped by axisId and stackId
         * @return {Object}      Configuration
         */
  
      }, {
        key: 'getAxisMapByAxes',
        value: function getAxisMapByAxes(axes, items, axisType, axisIdKey, stackGroups) {
          var _props = this.props;
          var layout = _props.layout;
          var children = _props.children;
          var data = _props.data;
          var _state = this.state;
          var dataEndIndex = _state.dataEndIndex;
          var dataStartIndex = _state.dataStartIndex;
  
          var displayedData = data.slice(dataStartIndex, dataEndIndex + 1);
          var len = displayedData.length;
          var isCategorial = (0, _CartesianUtils.isCategorialAxis)(layout, axisType);
  
          // Eliminate duplicated axes
          var axisMap = axes.reduce(function (result, child) {
            var _child$props = child.props;
            var type = _child$props.type;
            var dataKey = _child$props.dataKey;
            var allowDataOverflow = _child$props.allowDataOverflow;
  
            var axisId = child.props[axisIdKey];
  
            if (!result[axisId]) {
              var domain = void 0;
              var duplicateDomain = void 0;
  
              if (dataKey) {
                domain = (0, _CartesianUtils.getDomainOfDataByKey)(displayedData, dataKey, type);
                var duplicate = (0, _DataUtils.hasDuplicate)(domain);
  
                duplicateDomain = duplicate ? domain : null;
                // When axis has duplicated text, serial numbers are used to generate scale
                domain = duplicate ? (0, _range3.default)(0, len) : domain;
              } else if (stackGroups && stackGroups[axisId] && stackGroups[axisId].hasStack && type === 'number') {
                domain = (0, _CartesianUtils.getDomainOfStackGroups)(stackGroups[axisId].stackGroups, dataStartIndex, dataEndIndex);
              } else if (isCategorial) {
                domain = (0, _range3.default)(0, len);
              } else {
                domain = (0, _CartesianUtils.getDomainOfItemsWithSameAxis)(displayedData, items.filter(function (entry) {
                  return entry.props[axisIdKey] === axisId;
                }), type);
              }
              if (type === 'number') {
                // To detect wether there is any reference lines whose props alwaysShow is true
                domain = (0, _CartesianUtils.detectReferenceElementsDomain)(children, domain, axisId, axisType);
  
                if (child.props.domain) {
                  domain = (0, _DataUtils.parseSpecifiedDomain)(child.props.domain, domain, allowDataOverflow);
                }
              }
  
              return _extends({}, result, _defineProperty({}, axisId, _extends({}, child.props, {
                axisType: axisType,
                domain: domain,
                duplicateDomain: duplicateDomain,
                originalDomain: child.props.domain
              })));
            }
  
            return result;
          }, {});
          return axisMap;
        }
  
        /**
         * Get the configuration of axis by the options of item,
         * this kind of axis does not display in chart
         * @param  {Array} items       The instances of item
         * @param  {ReactElement} Axis Axis Component
         * @param  {String} axisType   The type of axis, xAxis - x-axis, yAxis - y-axis
         * @param  {String} axisIdKey  The unique id of an axis
         * @param  {Object} stackGroups The items grouped by axisId and stackId
         * @return {Object}            Configuration
         */
  
      }, {
        key: 'getAxisMapByItems',
        value: function getAxisMapByItems(items, Axis, axisType, axisIdKey, stackGroups) {
          var _props2 = this.props;
          var layout = _props2.layout;
          var children = _props2.children;
          var data = _props2.data;
          var _state2 = this.state;
          var dataEndIndex = _state2.dataEndIndex;
          var dataStartIndex = _state2.dataStartIndex;
  
          var displayedData = data.slice(dataStartIndex, dataEndIndex + 1);
          var len = displayedData.length;
          var isCategorial = (0, _CartesianUtils.isCategorialAxis)(layout, axisType);
          var index = -1;
  
          // The default type of x-axis is category axis,
          // The default contents of x-axis is the serial numbers of data
          // The default type of y-axis is number axis
          // The default contents of y-axis is the domain of data
          var axisMap = items.reduce(function (result, child) {
            var axisId = child.props[axisIdKey];
  
            if (!result[axisId]) {
              index++;
              var domain = void 0;
  
              if (isCategorial) {
                domain = (0, _range3.default)(0, len);
              } else if (stackGroups && stackGroups[axisId] && stackGroups[axisId].hasStack) {
                domain = (0, _CartesianUtils.getDomainOfStackGroups)(stackGroups[axisId].stackGroups, dataStartIndex, dataEndIndex);
                domain = (0, _CartesianUtils.detectReferenceElementsDomain)(children, domain, axisId, axisType);
              } else {
                domain = (0, _DataUtils.parseSpecifiedDomain)(Axis.defaultProps.domain, (0, _CartesianUtils.getDomainOfItemsWithSameAxis)(displayedData, items.filter(function (entry) {
                  return entry.props[axisIdKey] === axisId;
                }), 'number'), Axis.defaultProps.allowDataOverflow);
                domain = (0, _CartesianUtils.detectReferenceElementsDomain)(children, domain, axisId, axisType);
              }
  
              return _extends({}, result, _defineProperty({}, axisId, _extends({
                axisType: axisType
              }, Axis.defaultProps, {
                hide: true,
                orientation: ORIENT_MAP[axisType][index % 2],
                domain: domain,
                originalDomain: Axis.defaultProps.domain
              })));
            }
  
            return result;
          }, {});
  
          return axisMap;
        }
        /**
         * Calculate the scale function, position, width, height of axes
         * @param  {Object} axisMap  The configuration of axes
         * @param  {Object} offset   The offset of main part in the svg element
         * @param  {Object} axisType The type of axes, x-axis or y-axis
         * @return {Object} Configuration
         */
  
      }, {
        key: 'getFormatAxisMap',
        value: function getFormatAxisMap(axisMap, offset, axisType) {
          var _props3 = this.props;
          var width = _props3.width;
          var height = _props3.height;
          var layout = _props3.layout;
  
          var displayName = this.constructor.displayName;
          var ids = (0, _keys2.default)(axisMap);
          var steps = {
            left: offset.left,
            right: width - offset.right,
            top: offset.top,
            bottom: height - offset.bottom
          };
  
          return ids.reduce(function (result, id) {
            var axis = axisMap[id];
            var orientation = axis.orientation;
            var type = axis.type;
            var domain = axis.domain;
            var _axis$padding = axis.padding;
            var padding = _axis$padding === undefined ? {} : _axis$padding;
  
            var range = void 0;
  
            if (axisType === 'xAxis') {
              range = [offset.left + (padding.left || 0), offset.left + offset.width - (padding.right || 0)];
            } else {
              range = layout === 'horizontal' ? [offset.top + offset.height - (padding.bottom || 0), offset.top + (padding.top || 0)] : [offset.top + (padding.top || 0), offset.top + offset.height - (padding.bottom || 0)];
            }
            var scale = void 0;
  
            if (type === 'number') {
              scale = (0, _d3Scale.scaleLinear)().domain(domain).range(range);
            } else if (displayName.indexOf('LineChart') >= 0 || displayName.indexOf('AreaChart') >= 0) {
              scale = (0, _d3Scale.scalePoint)().domain(domain).range(range);
            } else {
              scale = (0, _d3Scale.scaleBand)().domain(domain).range(range);
            }
  
            var ticks = (0, _CartesianUtils.getTicksOfScale)(scale, axis);
  
            var x = void 0;
            var y = void 0;
  
            if (axisType === 'xAxis') {
              x = offset.left;
              y = orientation === 'top' ? steps[orientation] - axis.height : steps[orientation];
            } else {
              x = orientation === 'left' ? steps[orientation] - axis.width : steps[orientation];
              y = offset.top;
            }
  
            var finalAxis = _extends({}, axis, ticks, {
              x: x, y: y, scale: scale,
              width: axisType === 'xAxis' ? offset.width : axis.width,
              height: axisType === 'yAxis' ? offset.height : axis.height
            });
  
            if (!axis.hide && axisType === 'xAxis') {
              steps[orientation] += (orientation === 'top' ? -1 : 1) * finalAxis.height;
            } else if (!axis.hide) {
              steps[orientation] += (orientation === 'left' ? -1 : 1) * finalAxis.width;
            }
  
            return _extends({}, result, _defineProperty({}, id, finalAxis));
          }, {});
        }
        /**
         * Get the information of mouse in chart, return null when the mouse is not in the chart
         * @param  {Object}  xAxisMap The configuration of all x-axes
         * @param  {Object}  yAxisMap The configuration of all y-axes
         * @param  {Object}  offset   The offset of main part in the svg element
         * @param  {Object}  e        The event object
         * @return {Object}           Mouse data
         */
  
      }, {
        key: 'getMouseInfo',
        value: function getMouseInfo(xAxisMap, yAxisMap, offset, e) {
          var isIn = e.chartX >= offset.left && e.chartX <= offset.left + offset.width && e.chartY >= offset.top && e.chartY <= offset.top + offset.height;
  
          if (!isIn) {
            return null;
          }
  
          var layout = this.props.layout;
  
          var axisMap = layout === 'horizontal' ? xAxisMap : yAxisMap;
          var pos = layout === 'horizontal' ? e.chartX : e.chartY;
          var axis = (0, _DataUtils.getAnyElementOfObject)(axisMap);
          var ticks = (0, _CartesianUtils.getTicksOfAxis)(axis, false, true);
          var activeIndex = (0, _CartesianUtils.calculateActiveTickIndex)(pos, ticks);
  
          if (activeIndex >= 0) {
            return _extends({}, e, {
              activeTooltipIndex: activeIndex
            });
          }
  
          return null;
        }
        /**
         * Get the content to be displayed in the tooltip
         * @param  {Array} items The instances of item
         * @return {Array}       The content of tooltip
         */
  
      }, {
        key: 'getTooltipContent',
        value: function getTooltipContent(items) {
          var _state3 = this.state;
          var activeTooltipIndex = _state3.activeTooltipIndex;
          var dataStartIndex = _state3.dataStartIndex;
          var dataEndIndex = _state3.dataEndIndex;
  
          var data = this.props.data.slice(dataStartIndex, dataEndIndex + 1);
  
          if (activeTooltipIndex < 0 || !items || !items.length || activeTooltipIndex >= data.length) {
            return null;
          }
  
          return items.map(function (child) {
            var _child$props2 = child.props;
            var dataKey = _child$props2.dataKey;
            var name = _child$props2.name;
            var unit = _child$props2.unit;
            var formatter = _child$props2.formatter;
  
            return _extends({}, (0, _ReactUtils.getPresentationAttributes)(child), {
              dataKey: dataKey, unit: unit, formatter: formatter,
              name: name || dataKey,
              color: (0, _CartesianUtils.getMainColorOfGraphicItem)(child),
              value: data[activeTooltipIndex][dataKey],
              payload: data[activeTooltipIndex]
            });
          });
        }
        /* eslint-disable  no-underscore-dangle */
  
      }, {
        key: 'addListener',
        value: function addListener() {
          _Events.eventCenter.on(_Events.SYNC_EVENT, this.handleReceiveSyncEvent);
  
          if (_Events.eventCenter.setMaxListeners && _Events.eventCenter._maxListeners) {
            _Events.eventCenter.setMaxListeners(_Events.eventCenter._maxListeners + 1);
          }
        }
      }, {
        key: 'removeListener',
        value: function removeListener() {
          _Events.eventCenter.removeListener(_Events.SYNC_EVENT, this.handleReceiveSyncEvent);
  
          if (_Events.eventCenter.setMaxListeners && _Events.eventCenter._maxListeners) {
            _Events.eventCenter.setMaxListeners(_Events.eventCenter._maxListeners - 1);
          }
        }
        /**
         * Returns default, reset state for the categorical chart.
         * @param {Object} props Props object to use when creating the default state
         * @return {Object} Whole new state
         */
  
      }, {
        key: 'createDefaultState',
        value: function createDefaultState(props) {
          return {
            chartX: 0,
            chartY: 0,
            dataStartIndex: 0,
            dataEndIndex: props.data && props.data.length - 1 || 0,
            activeTooltipIndex: -1,
            isTooltipActive: false
          };
        }
        /**
         * Calculate the offset of main part in the svg element
         * @param  {Array} items       The instances of item
         * @param  {Object} xAxisMap  The configuration of x-axis
         * @param  {Object} yAxisMap  The configuration of y-axis
         * @return {Object} The offset of main part in the svg element
         */
  
      }, {
        key: 'calculateOffset',
        value: function calculateOffset(items, xAxisMap, yAxisMap) {
          var _props4 = this.props;
          var width = _props4.width;
          var height = _props4.height;
          var margin = _props4.margin;
          var children = _props4.children;
  
          var brushItem = (0, _ReactUtils.findChildByType)(children, _Brush2.default);
  
          var offsetH = (0, _keys2.default)(yAxisMap).reduce(function (result, id) {
            var entry = yAxisMap[id];
            var orientation = entry.orientation;
  
            return _extends({}, result, _defineProperty({}, orientation, result[orientation] + (entry.hide ? 0 : entry.width)));
          }, { left: margin.left || 0, right: margin.right || 0 });
  
          var offsetV = (0, _keys2.default)(xAxisMap).reduce(function (result, id) {
            var entry = xAxisMap[id];
            var orientation = entry.orientation;
  
            return _extends({}, result, _defineProperty({}, orientation, result[orientation] + (entry.hide ? 0 : entry.height)));
          }, { top: margin.top || 0, bottom: margin.bottom || 0 });
  
          var brushBottom = offsetV.bottom;
  
          if (brushItem) {
            offsetV.bottom += brushItem.props.height || _Brush2.default.defaultProps.height;
          }
  
          var legendProps = (0, _CartesianUtils.getLegendProps)(children, items, width, height);
          if (legendProps) {
            var box = _Legend2.default.getLegendBBox(legendProps, width, height) || {};
            if (legendProps.layout === 'horizontal' && (0, _isNumber3.default)(offsetV[legendProps.verticalAlign])) {
              offsetV[legendProps.verticalAlign] += box.height || 0;
            } else if (legendProps.layout === 'vertical' && (0, _isNumber3.default)(offsetH[legendProps.align])) {
              offsetH[legendProps.align] += box.width || 0;
            }
          }
  
          return _extends({
            brushBottom: brushBottom
          }, offsetH, offsetV, {
            width: width - offsetH.left - offsetH.right,
            height: height - offsetV.top - offsetV.bottom
          });
        }
      }, {
        key: 'handleMouseEnter',
  
        /**
         * The handler of mouse entering chart
         * @param  {Object} offset   The offset of main part in the svg element
         * @param  {Object} xAxisMap The configuration of all x-axes
         * @param  {Object} yAxisMap The configuration of all y-axes
         * @param  {Object} e        Event object
         * @return {Null}            null
         */
        value: function handleMouseEnter(offset, xAxisMap, yAxisMap, e) {
          var container = _reactDom2.default.findDOMNode(this);
          var containerOffset = (0, _DOMUtils.getOffset)(container);
          var ne = (0, _DOMUtils.calculateChartCoordinate)(e, containerOffset);
          var mouse = this.getMouseInfo(xAxisMap, yAxisMap, offset, ne);
  
          if (mouse) {
            var nextState = _extends({}, mouse, { isTooltipActive: true });
            this.setState(nextState);
            this.triggerSyncEvent(nextState);
          }
        }
  
        /**
         * The handler of mouse moving in chart
         * @param  {Object} offset   The offset of main part in the svg element
         * @param  {Object} xAxisMap The configuration of all x-axes
         * @param  {Object} yAxisMap The configuration of all y-axes
         * @param  {Object} e        Event object
         * @return {Null} no return
         */
  
      }, {
        key: 'handleMouseMove',
        value: function handleMouseMove(offset, xAxisMap, yAxisMap, e) {
          var container = _reactDom2.default.findDOMNode(this);
          var containerOffset = (0, _DOMUtils.getOffset)(container);
          var ne = (0, _DOMUtils.calculateChartCoordinate)(e, containerOffset);
          var mouse = this.getMouseInfo(xAxisMap, yAxisMap, offset, ne);
          var nextState = mouse ? _extends({}, mouse, { isTooltipActive: true }) : { isTooltipActive: false };
  
          this.setState(nextState);
          this.triggerSyncEvent(nextState);
        }
        /**
         * The handler if mouse leaving chart
         * @return {Null} no return
         */
  
      }, {
        key: 'validateAxes',
        value: function validateAxes() {
          var _props5 = this.props;
          var layout = _props5.layout;
          var children = _props5.children;
  
          var xAxes = (0, _ReactUtils.findAllByType)(children, _XAxis2.default);
          var yAxes = (0, _ReactUtils.findAllByType)(children, _YAxis2.default);
  
          if (layout === 'horizontal' && xAxes && xAxes.length) {
            xAxes.forEach(function (axis) {
              (0, _LogUtils.warn)(axis.props.type === 'category', 'x-axis should be category axis when the layout is horizontal');
            });
          } else if (layout === 'vertical') {
            var displayName = this.constructor.displayName;
  
            (0, _LogUtils.warn)(yAxes && yAxes.length, 'You should add <YAxis type="number" /> in ' + displayName + '.\n           The layout is vertical now, y-axis should be category axis,\n           but y-axis is number axis when no YAxis is added.');
            (0, _LogUtils.warn)(xAxes && xAxes.length, 'You should add <XAxis /> in ' + displayName + '.\n          The layout is vertical now, x-axis is category when no XAxis is added.');
  
            if (yAxes && yAxes.length) {
              yAxes.forEach(function (axis) {
                (0, _LogUtils.warn)(axis.props.type === 'category', 'y-axis should be category axis when the layout is vertical');
              });
            }
          }
  
          return null;
        }
      }, {
        key: 'triggerSyncEvent',
        value: function triggerSyncEvent(data) {
          var syncId = this.props.syncId;
  
          if (!(0, _isNil3.default)(syncId)) {
            _Events.eventCenter.emit(_Events.SYNC_EVENT, syncId, this.uniqueChartId, data);
          }
        }
        /**
         * Draw axes
         * @param {Object} axisMap The configuration of all x-axes or y-axes
         * @param {String} name    The name of axes
         * @return {ReactElement}  The instance of x-axes
         */
  
      }, {
        key: 'renderAxes',
        value: function renderAxes(axisMap, name) {
          var _props6 = this.props;
          var width = _props6.width;
          var height = _props6.height;
  
          var ids = axisMap && (0, _keys2.default)(axisMap);
  
          if (ids && ids.length) {
            var axes = [];
  
            for (var i = 0, len = ids.length; i < len; i++) {
              var axis = axisMap[ids[i]];
  
              if (!axis.hide) {
                axes.push(_react2.default.createElement(_CartesianAxis2.default, _extends({}, axis, {
                  key: name + '-' + ids[i],
                  viewBox: { x: 0, y: 0, width: width, height: height },
                  ticks: (0, _CartesianUtils.getTicksOfAxis)(axis, true)
                })));
              }
            }
  
            return axes.length ? _react2.default.createElement(_Layer2.default, { key: name + '-layer', className: 'recharts-' + name }, axes) : null;
          }
  
          return null;
        }
        /**
         * Draw grid
         * @param  {Object} xAxisMap The configuration of all x-axes
         * @param  {Object} yAxisMap The configuration of all y-axes
         * @param  {Object} offset   The offset of main part in the svg element
         * @return {ReactElement} The instance of grid
         */
  
      }, {
        key: 'renderGrid',
        value: function renderGrid(xAxisMap, yAxisMap, offset) {
          var _props7 = this.props;
          var children = _props7.children;
          var width = _props7.width;
          var height = _props7.height;
  
          var gridItem = (0, _ReactUtils.findChildByType)(children, _CartesianGrid2.default);
  
          if (!gridItem) {
            return null;
          }
  
          var xAxis = (0, _DataUtils.getAnyElementOfObject)(xAxisMap);
          var yAxis = (0, _DataUtils.getAnyElementOfObject)(yAxisMap);
  
          var verticalPoints = (0, _CartesianUtils.getCoordinatesOfGrid)(_CartesianAxis2.default.getTicks(_extends({}, _CartesianAxis2.default.defaultProps, xAxis, {
            ticks: (0, _CartesianUtils.getTicksOfAxis)(xAxis, true),
            viewBox: { x: 0, y: 0, width: width, height: height }
          })), offset.left, offset.left + offset.width);
  
          var horizontalPoints = (0, _CartesianUtils.getCoordinatesOfGrid)(_CartesianAxis2.default.getTicks(_extends({}, _CartesianAxis2.default.defaultProps, yAxis, {
            ticks: (0, _CartesianUtils.getTicksOfAxis)(yAxis, true),
            viewBox: { x: 0, y: 0, width: width, height: height }
          })), offset.top, offset.top + offset.height);
  
          return _react2.default.cloneElement(gridItem, {
            key: 'grid',
            x: offset.left,
            y: offset.top,
            width: offset.width,
            height: offset.height,
            verticalPoints: verticalPoints, horizontalPoints: horizontalPoints
          });
        }
        /**
         * Draw legend
         * @param  {Array} items             The instances of item
         * @return {ReactElement}            The instance of Legend
         */
  
      }, {
        key: 'renderLegend',
        value: function renderLegend(items) {
          var _props8 = this.props;
          var children = _props8.children;
          var width = _props8.width;
          var height = _props8.height;
          var margin = _props8.margin;
  
          var legendWidth = width - margin.left - margin.right;
          var legendHeight = height - margin.top - margin.bottom;
          var props = (0, _CartesianUtils.getLegendProps)(children, items, legendWidth, legendHeight);
  
          if (!props) {
            return null;
          }
  
          return _react2.default.createElement(_Legend2.default, _extends({}, props, {
            chartWidth: width,
            chartHeight: height,
            margin: margin
          }));
        }
  
        /**
         * Draw Tooltip
         * @param  {Object} xAxisMap The configuration of all x-axes
         * @param  {Object} yAxisMap The configuration of all y-axes
         * @param  {ReactElement} tooltipItem  The instance of Tooltip
         * @param  {Array}  items  The instances of GraphicalChild
         * @param  {Object} offset The offset of main part in the svg element
         * @return {ReactElement}  The instance of Tooltip
         */
  
      }, {
        key: 'renderTooltip',
        value: function renderTooltip(xAxisMap, yAxisMap, tooltipItem, items, offset) {
          var layout = this.props.layout;
          var _state4 = this.state;
          var isTooltipActive = _state4.isTooltipActive;
          var activeTooltipIndex = _state4.activeTooltipIndex;
          var chartX = _state4.chartX;
          var chartY = _state4.chartY;
  
          var axisMap = layout === 'horizontal' ? xAxisMap : yAxisMap;
          var pos = layout === 'horizontal' ? chartX : chartY;
          var axis = (0, _DataUtils.getAnyElementOfObject)(axisMap);
          var ticks = (0, _CartesianUtils.getTicksOfAxis)(axis, false, true);
          var viewBox = _extends({}, offset, { x: offset.left, y: offset.top });
          // When a categotical chart is combined with another chart, the value of chartX
          // and chartY may beyond the boundaries.
          var validateChartX = Math.min(chartX, viewBox.x + viewBox.width);
          var validateChartY = Math.min(chartY, viewBox.y + viewBox.height);
  
          return _react2.default.cloneElement(tooltipItem, {
            viewBox: viewBox,
            active: isTooltipActive,
            label: ticks[activeTooltipIndex] && ticks[activeTooltipIndex].value,
            payload: isTooltipActive ? this.getTooltipContent(items) : [],
            coordinate: ticks[activeTooltipIndex] ? {
              x: layout === 'horizontal' ? ticks[activeTooltipIndex].coordinate : validateChartX,
              y: layout === 'horizontal' ? validateChartY : ticks[activeTooltipIndex].coordinate
            } : { x: 0, y: 0 }
          });
        }
      }, {
        key: 'renderBrush',
        value: function renderBrush(xAxisMap, yAxisMap, offset) {
          var _props9 = this.props;
          var children = _props9.children;
          var margin = _props9.margin;
          var data = _props9.data;
          var _state5 = this.state;
          var dataStartIndex = _state5.dataStartIndex;
          var dataEndIndex = _state5.dataEndIndex;
  
          var brushItem = (0, _ReactUtils.findChildByType)(children, _Brush2.default);
  
          if (!brushItem) {
            return null;
          }
  
          return _react2.default.cloneElement(brushItem, {
            onChange: this.handleBrushChange,
            data: data,
            x: offset.left,
            y: offset.top + offset.height + offset.brushBottom - (margin.bottom || 0),
            width: offset.width,
            startIndex: dataStartIndex,
            endIndex: dataEndIndex
          });
        }
      }, {
        key: 'renderReferenceElements',
        value: function renderReferenceElements(xAxisMap, yAxisMap, offset, isFront, Compt) {
          var children = this.props.children;
  
          var elements = (0, _ReactUtils.findAllByType)(children, Compt);
  
          if (!elements || !elements.length) {
            return null;
          }
  
          var keyPrefix = (0, _ReactUtils.getDisplayName)(Compt) + '-' + (isFront ? 'front' : 'back');
  
          return elements.filter(function (entry) {
            return isFront === entry.props.isFront;
          }).map(function (entry, i) {
            var _entry$props = entry.props;
            var xAxisId = _entry$props.xAxisId;
            var yAxisId = _entry$props.yAxisId;
  
            return _react2.default.cloneElement(entry, {
              key: keyPrefix + '-' + i,
              xAxis: xAxisMap[xAxisId],
              yAxis: yAxisMap[yAxisId],
              viewBox: {
                x: offset.left,
                y: offset.top,
                width: offset.width,
                height: offset.height
              }
            });
          });
        }
      }, {
        key: 'render',
        value: function render() {
          var data = this.props.data;
  
          if (!(0, _ReactUtils.validateWidthHeight)(this) || !data || !data.length) {
            return null;
          }
  
          var _props10 = this.props;
          var children = _props10.children;
          var layout = _props10.layout;
          var className = _props10.className;
          var width = _props10.width;
          var height = _props10.height;
          var stackOffset = _props10.stackOffset;
          var style = _props10.style;
  
          var others = _objectWithoutProperties(_props10, ['children', 'layout', 'className', 'width', 'height', 'stackOffset', 'style']);
  
          var numericIdName = layout === 'horizontal' ? 'yAxis' : 'xAxis';
          var cateIdName = layout === 'horizontal' ? 'xAxis' : 'yAxis';
          var items = (0, _ReactUtils.findAllByType)(children, GraphicalChild);
          var stackGroups = (0, _CartesianUtils.getStackGroupsByAxisId)(data, items, numericIdName + 'Id', cateIdName + 'Id', stackOffset);
  
          var xAxisMap = this.getAxisMap('xAxis', items, numericIdName === 'xAxis' && stackGroups);
          var yAxisMap = this.getAxisMap('yAxis', items, numericIdName === 'yAxis' && stackGroups);
  
          var offset = this.calculateOffset(items, xAxisMap, yAxisMap);
  
          xAxisMap = this.getFormatAxisMap(xAxisMap, offset, 'xAxis');
          yAxisMap = this.getFormatAxisMap(yAxisMap, offset, 'yAxis');
  
          var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
          var events = tooltipItem ? {
            onMouseEnter: this.handleMouseEnter.bind(this, offset, xAxisMap, yAxisMap),
            onMouseMove: this.handleMouseMove.bind(this, offset, xAxisMap, yAxisMap),
            onMouseLeave: this.handleMouseLeave
          } : null;
          var attrs = (0, _ReactUtils.getPresentationAttributes)(others);
  
          return _react2.default.createElement('div', _extends({
            className: (0, _classnames2.default)('recharts-wrapper', className),
            style: _extends({}, style, { position: 'relative', cursor: 'default', width: width, height: height })
          }, events), _react2.default.createElement(_Surface2.default, _extends({}, attrs, { width: width, height: height }), this.renderGrid(xAxisMap, yAxisMap, offset), this.renderReferenceElements(xAxisMap, yAxisMap, offset, false, _ReferenceArea2.default), this.renderReferenceElements(xAxisMap, yAxisMap, offset, false, _ReferenceLine2.default), this.renderReferenceElements(xAxisMap, yAxisMap, offset, false, _ReferenceDot2.default), this.renderAxes(xAxisMap, 'x-axis'), this.renderAxes(yAxisMap, 'y-axis'), _react2.default.createElement(ChartComponent, _extends({}, this.props, this.state, {
            graphicalItems: items,
            xAxisMap: xAxisMap,
            yAxisMap: yAxisMap,
            offset: offset,
            stackGroups: stackGroups
          })), this.renderReferenceElements(xAxisMap, yAxisMap, offset, true, _ReferenceArea2.default), this.renderReferenceElements(xAxisMap, yAxisMap, offset, true, _ReferenceLine2.default), this.renderReferenceElements(xAxisMap, yAxisMap, offset, true, _ReferenceDot2.default), this.renderBrush(xAxisMap, yAxisMap, offset), (0, _ReactUtils.filterSvgElements)(children)), this.renderLegend(items), tooltipItem && this.renderTooltip(xAxisMap, yAxisMap, tooltipItem, items, offset));
        }
      }]);
  
      return CategoricalChartWrapper;
    }(_react.Component), _class.displayName = (0, _ReactUtils.getDisplayName)(ChartComponent), _class.propTypes = {
      syncId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
      width: _react.PropTypes.number,
      height: _react.PropTypes.number,
      data: _react.PropTypes.arrayOf(_react.PropTypes.object),
      layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
      stackOffset: _react.PropTypes.oneOf(['sign', 'expand', 'none', 'wiggle', 'silhouette']),
      margin: _react.PropTypes.shape({
        top: _react.PropTypes.number,
        right: _react.PropTypes.number,
        bottom: _react.PropTypes.number,
        left: _react.PropTypes.number
      }),
      style: _react.PropTypes.object,
      className: _react.PropTypes.string,
      children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node])
    }, _class.defaultProps = {
      layout: 'horizontal',
      stackOffset: 'none',
      margin: { top: 5, right: 5, bottom: 5, left: 5 }
    }, _temp);
  
    return CategoricalChartWrapper;
  };
  
  exports.default = generateCategoricalChart;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _keys = __webpack_require__(58);
  
  var _keys2 = _interopRequireDefault2(_keys);
  
  var _defineProperty2 = __webpack_require__(59);
  
  var _defineProperty3 = _interopRequireDefault2(_defineProperty2);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getTicksOfScale = exports.getLegendProps = exports.getMainColorOfGraphicItem = exports.calculateActiveTickIndex = exports.getTicksOfAxis = exports.getCoordinatesOfGrid = exports.isCategorialAxis = exports.getDomainOfItemsWithSameAxis = exports.getDomainOfStackGroups = exports.getDomainOfDataByKey = exports.calculateDomainOfTicks = exports.getStackedDataOfItem = exports.getStackGroupsByAxisId = exports.getStackedData = exports.detectReferenceElementsDomain = undefined;
  
  var _uniqueId2 = __webpack_require__(107);
  
  var _uniqueId3 = _interopRequireDefault(_uniqueId2);
  
  var _isString2 = __webpack_require__(60);
  
  var _isString3 = _interopRequireDefault(_isString2);
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _ReactUtils = __webpack_require__(57);
  
  var _ReferenceDot = __webpack_require__(113);
  
  var _ReferenceDot2 = _interopRequireDefault(_ReferenceDot);
  
  var _ReferenceLine = __webpack_require__(111);
  
  var _ReferenceLine2 = _interopRequireDefault(_ReferenceLine);
  
  var _ReferenceArea = __webpack_require__(114);
  
  var _ReferenceArea2 = _interopRequireDefault(_ReferenceArea);
  
  var _Legend = __webpack_require__(66);
  
  var _Legend2 = _interopRequireDefault(_Legend);
  
  var _rechartsScale = __webpack_require__(128);
  
  var _d3Shape = __webpack_require__(76);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      (0, _defineProperty3.default)(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }return obj;
  }
  
  /* eslint no-param-reassign: 0 */
  var offsetSign = function offsetSign(series, order) {
    var n = series.length;
    if (n <= 0) {
      return;
    }
  
    for (var j = 0, m = series[0].length; j < m; ++j) {
      var positive = 0;
      var negative = 0;
  
      for (var i = 0; i < n; ++i) {
        var value = isNaN(series[i][j][1]) ? series[i][j][0] : series[i][j][1];
  
        if (value >= 0) {
          series[i][j][0] = positive;
          series[i][j][1] = positive + value;
          positive = series[i][j][1];
        } else {
          series[i][j][0] = negative;
          series[i][j][1] = negative + value;
          negative = series[i][j][1];
        }
      }
    }
  };
  
  var STACK_OFFSET_MAP = {
    sign: offsetSign,
    expand: _d3Shape.stackOffsetExpand,
    none: _d3Shape.stackOffsetNone,
    silhouette: _d3Shape.stackOffsetSilhouette,
    wiggle: _d3Shape.stackOffsetWiggle
  };
  
  var detectReferenceElementsDomain = exports.detectReferenceElementsDomain = function detectReferenceElementsDomain(children, domain, axisId, axisType) {
    var lines = (0, _ReactUtils.findAllByType)(children, _ReferenceLine2.default);
    var dots = (0, _ReactUtils.findAllByType)(children, _ReferenceDot2.default);
    var elements = lines.concat(dots);
    var areas = (0, _ReactUtils.findAllByType)(children, _ReferenceArea2.default);
    var idKey = axisType + 'Id';
    var valueKey = axisType[0];
    var finalDomain = domain;
  
    if (elements.length) {
      finalDomain = elements.reduce(function (result, el) {
        if (el.props[idKey] === axisId && el.props.alwaysShow && (0, _isNumber3.default)(el.props[valueKey])) {
          var value = el.props[valueKey];
  
          return [Math.min(result[0], value), Math.max(result[1], value)];
        }
        return result;
      }, finalDomain);
    }
  
    if (areas.length) {
      (function () {
        var key1 = valueKey + '1';
        var key2 = valueKey + '2';
  
        finalDomain = areas.reduce(function (result, el) {
          if (el.props[idKey] === axisId && el.props.alwaysShow && (0, _isNumber3.default)(el.props[key1]) && (0, _isNumber3.default)(el.props[key2])) {
            var value1 = el.props[key1];
            var value2 = el.props[key2];
  
            return [Math.min(result[0], value1, value2), Math.max(result[1], value1, value2)];
          }
          return result;
        }, finalDomain);
      })();
    }
  
    return finalDomain;
  };
  
  var getStackedData = exports.getStackedData = function getStackedData(data, stackItems, offsetType) {
    var dataKeys = stackItems.map(function (item) {
      return item.props.dataKey;
    });
    var stack = (0, _d3Shape.stack)().keys(dataKeys).value(function (d, key) {
      return +d[key] || 0;
    }).order(_d3Shape.stackOrderNone).offset(STACK_OFFSET_MAP[offsetType]);
  
    return stack(data);
  };
  
  var getStackGroupsByAxisId = exports.getStackGroupsByAxisId = function getStackGroupsByAxisId(data, items, numericAxisId, cateAxisId, offsetType) {
    var stackGroups = items.reduce(function (result, item) {
      var _item$props = item.props;
      var stackId = _item$props.stackId;
      var dataKey = _item$props.dataKey;
  
      var axisId = item.props[numericAxisId];
      var parentGroup = result[axisId] || { hasStack: false, stackGroups: {} };
  
      if ((0, _isNumber3.default)(stackId) || (0, _isString3.default)(stackId)) {
        var childGroup = parentGroup.stackGroups[stackId] || { items: [] };
  
        childGroup.items.push(item);
  
        if (childGroup.items.length >= 2) {
          parentGroup.hasStack = true;
        }
  
        parentGroup.stackGroups[stackId] = childGroup;
      } else {
        parentGroup.stackGroups[(0, _uniqueId3.default)('_stackId_')] = {
          numericAxisId: numericAxisId, cateAxisId: cateAxisId, items: [item]
        };
      }
  
      return _extends({}, result, _defineProperty({}, axisId, parentGroup));
    }, {});
  
    return (0, _keys2.default)(stackGroups).reduce(function (result, axisId) {
      var group = stackGroups[axisId];
  
      if (group.hasStack) {
        group.stackGroups = (0, _keys2.default)(group.stackGroups).reduce(function (res, stackId) {
          var g = group.stackGroups[stackId];
  
          return _extends({}, res, _defineProperty({}, stackId, {
            numericAxisId: numericAxisId,
            cateAxisId: cateAxisId,
            items: g.items,
            stackedData: getStackedData(data, g.items, offsetType)
          }));
        }, {});
      }
  
      return _extends({}, result, _defineProperty({}, axisId, group));
    }, {});
  };
  
  var getStackedDataOfItem = exports.getStackedDataOfItem = function getStackedDataOfItem(item, stackGroups) {
    var stackId = item.props.stackId;
  
    if ((0, _isNumber3.default)(stackId) || (0, _isString3.default)(stackId)) {
      var group = stackGroups[stackId];
  
      if (group && group.items.length) {
        var itemIndex = -1;
  
        for (var i = 0, len = group.items.length; i < len; i++) {
          if (group.items[i] === item) {
            itemIndex = i;
            break;
          }
        }
        return itemIndex >= 0 ? group.stackedData[itemIndex] : null;
      }
    }
  
    return null;
  };
  /**
   * get domain of ticks
   * @param  {Array} ticks Ticks of axis
   * @param  {String} type  The type of axis
   * @return {Array} domain
   */
  var calculateDomainOfTicks = exports.calculateDomainOfTicks = function calculateDomainOfTicks(ticks, type) {
    if (type === 'number') {
      return [Math.min.apply(null, ticks), Math.max.apply(null, ticks)];
    }
  
    return ticks;
  };
  
  /**
   * Get domain of data by key
   * @param  {Array} data   The data displayed in the chart
   * @param  {String} key  The unique key of a group of data
   * @param  {String} type The type of axis
   * @return {Array} Domain of data
   */
  var getDomainOfDataByKey = exports.getDomainOfDataByKey = function getDomainOfDataByKey(data, key, type) {
    if (type === 'number') {
      var domain = data.map(function (entry) {
        return entry[key];
      }).filter(_isNumber3.default);
  
      return [Math.min.apply(null, domain), Math.max.apply(null, domain)];
    }
  
    return data.map(function (entry) {
      var value = entry[key];
  
      return (0, _isNumber3.default)(value) || (0, _isString3.default)(value) ? value : '';
    });
  };
  
  var getDomainOfSingle = function getDomainOfSingle(data) {
    return data.reduce(function (result, entry) {
      return [Math.min.apply(null, entry.concat([result[0]]).filter(_isNumber3.default)), Math.max.apply(null, entry.concat([result[1]]).filter(_isNumber3.default))];
    }, [Infinity, -Infinity]);
  };
  
  var getDomainOfStackGroups = exports.getDomainOfStackGroups = function getDomainOfStackGroups(stackGroups, startIndex, endIndex) {
    return (0, _keys2.default)(stackGroups).reduce(function (result, stackId) {
      var group = stackGroups[stackId];
      var stackedData = group.stackedData;
  
      var domain = stackedData.reduce(function (res, entry) {
        var s = getDomainOfSingle(entry.slice(startIndex, endIndex + 1));
  
        return [Math.min(res[0], s[0]), Math.max(res[1], s[1])];
      }, [Infinity, -Infinity]);
  
      return [Math.min(domain[0], result[0]), Math.max(domain[1], result[1])];
    }, [Infinity, -Infinity]).map(function (result) {
      return result === Infinity || result === -Infinity ? 0 : result;
    });
  };
  
  /**
   * Get domain of data by the configuration of item element
   * @param  {Array} data   The data displayed in the chart
   * @param  {Array} items  The instances of item
   * @param  {String} type  The type of axis, number - Number Axis, category - Category Axis
   * @return {Array}        Domain
   */
  var getDomainOfItemsWithSameAxis = exports.getDomainOfItemsWithSameAxis = function getDomainOfItemsWithSameAxis(data, items, type) {
    var domains = items.map(function (item) {
      return getDomainOfDataByKey(data, item.props.dataKey, type);
    });
  
    if (type === 'number') {
      // Calculate the domain of number axis
      return domains.reduce(function (result, entry) {
        return [Math.min(result[0], entry[0]), Math.max(result[1], entry[1])];
      }, [Infinity, -Infinity]);
    }
  
    var tag = {};
    // Get the union set of category axis
    return domains.reduce(function (result, entry) {
      for (var i = 0, len = entry.length; i < len; i++) {
        if (!tag[entry[i]]) {
          tag[entry[i]] = true;
  
          result.push(entry[i]);
        }
      }
      return result;
    }, []);
  };
  
  var isCategorialAxis = exports.isCategorialAxis = function isCategorialAxis(layout, axisType) {
    return layout === 'horizontal' && axisType === 'xAxis' || layout === 'vertical' && axisType === 'yAxis';
  };
  /**
  * Calculate the Coordinates of grid
  * @param  {Array} ticks The ticks in axis
  * @param {Number} min   The minimun value of axis
  * @param {Number} max   The maximun value of axis
  * @return {Array}       Coordinates
  */
  var getCoordinatesOfGrid = exports.getCoordinatesOfGrid = function getCoordinatesOfGrid(ticks, min, max) {
    var hasMin = void 0;
    var hasMax = void 0;
  
    var values = ticks.map(function (entry) {
      if (entry.coordinate === min) {
        hasMin = true;
      }
      if (entry.coordinate === max) {
        hasMax = true;
      }
  
      return entry.coordinate;
    });
  
    if (!hasMin) {
      values.push(min);
    }
    if (!hasMax) {
      values.push(max);
    }
  
    return values;
  };
  
  /**
   * Get the ticks of an axis
   * @param  {Object}  axis The configuration of an axis
   * @param {Boolean} isGrid Whether or not are the ticks in grid
   * @param {Boolean} isAll Return the ticks of all the points or not
   * @return {Array}  Ticks
   */
  var getTicksOfAxis = exports.getTicksOfAxis = function getTicksOfAxis(axis, isGrid, isAll) {
    var scale = axis.scale;
    var duplicateDomain = axis.duplicateDomain;
    var type = axis.type;
  
    var offset = (isGrid || isAll) && type === 'category' ? scale.bandwidth() / 2 : 0;
  
    // The ticks setted by user should only affect the ticks adjacent to axis line
    if (isGrid && (axis.ticks || axis.niceTicks)) {
      return (axis.ticks || axis.niceTicks).map(function (entry) {
        var scaleContent = duplicateDomain ? duplicateDomain.indexOf(entry) : entry;
  
        return {
          coordinate: scale(scaleContent) + offset,
          value: entry
        };
      });
    }
  
    if (scale.ticks && !isAll) {
      return scale.ticks(axis.tickCount).map(function (entry) {
        return { coordinate: scale(entry) + offset, value: entry };
      });
    }
  
    // When axis has duplicated text, serial numbers are used to generate scale
    return scale.domain().map(function (entry) {
      return {
        coordinate: scale(entry) + offset,
        value: duplicateDomain ? duplicateDomain[entry] : entry
      };
    });
  };
  
  var calculateActiveTickIndex = exports.calculateActiveTickIndex = function calculateActiveTickIndex(coordinate, ticks) {
    var index = -1;
    var len = ticks.length;
  
    if (len > 1) {
      for (var i = 0; i < len; i++) {
        if (i === 0 && coordinate <= (ticks[i].coordinate + ticks[i + 1].coordinate) / 2 || i > 0 && i < len - 1 && coordinate > (ticks[i].coordinate + ticks[i - 1].coordinate) / 2 && coordinate <= (ticks[i].coordinate + ticks[i + 1].coordinate) / 2 || i === len - 1 && coordinate > (ticks[i].coordinate + ticks[i - 1].coordinate) / 2) {
          index = i;
          break;
        }
      }
    } else {
      index = 0;
    }
  
    return index;
  };
  
  /**
   * Get the main color of each graphic item
   * @param  {ReactElement} item A graphic item
   * @return {String}            Color
   */
  var getMainColorOfGraphicItem = exports.getMainColorOfGraphicItem = function getMainColorOfGraphicItem(item) {
    var displayName = item.type.displayName;
    var result = void 0;
  
    switch (displayName) {
      case 'Line':
      case 'Area':
        result = item.props.stroke;
        break;
      default:
        result = item.props.fill;
        break;
    }
  
    return result;
  };
  
  var getLegendProps = exports.getLegendProps = function getLegendProps(children, graphicItems, width, height) {
    var legendItem = (0, _ReactUtils.findChildByType)(children, _Legend2.default);
  
    if (!legendItem) {
      return null;
    }
  
    var legendData = legendItem.props && legendItem.props.payload || graphicItems.map(function (child) {
      var _child$props = child.props;
      var dataKey = _child$props.dataKey;
      var name = _child$props.name;
      var legendType = _child$props.legendType;
  
      return {
        dataKey: dataKey,
        type: legendType || 'square',
        color: getMainColorOfGraphicItem(child),
        value: name || dataKey
      };
    }, undefined);
  
    return _extends({}, legendItem.props, _Legend2.default.getWithHeight(legendItem, width, height), {
      payload: legendData
    });
  };
  /**
   * Configure the scale function of axis
   * @param {Object} scale The scale function
   * @param {Object} opts  The configuration of axis
   * @return {Object}      null
   */
  var getTicksOfScale = exports.getTicksOfScale = function getTicksOfScale(scale, opts) {
    var type = opts.type;
    var tickCount = opts.tickCount;
    var ticks = opts.ticks;
    var originalDomain = opts.originalDomain;
    var allowDecimals = opts.allowDecimals;
  
    if (tickCount && type === 'number' && originalDomain && (originalDomain[0] === 'auto' || originalDomain[1] === 'auto')) {
      // Calculate the ticks by the number of grid when the axis is a number axis
      var domain = scale.domain();
      var tickValues = (0, _rechartsScale.getNiceTickValues)(domain, tickCount, allowDecimals);
  
      scale.domain(calculateDomainOfTicks(tickValues, type));
  
      return { niceTicks: tickValues };
    } else if (tickCount && type === 'number') {
      var _domain = scale.domain();
      var _tickValues = (0, _rechartsScale.getTickValues)(_domain, tickCount, allowDecimals);
  
      return { niceTicks: _tickValues };
    }
  
    return null;
  };

/***/ }),
/* 128 */
/***/ (function(module, exports) {

  module.exports = require("recharts-scale");

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SYNC_EVENT = exports.eventCenter = undefined;
  
  var _events = __webpack_require__(130);
  
  var _events2 = _interopRequireDefault(_events);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  var eventCenter = new _events2.default();
  
  if (eventCenter.setMaxListeners) {
    eventCenter.setMaxListeners(10);
  }
  
  exports.eventCenter = eventCenter;
  var SYNC_EVENT = exports.SYNC_EVENT = 'recharts.syncMouseEvents';

/***/ }),
/* 130 */
/***/ (function(module, exports) {

  module.exports = require("events");

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _keys = __webpack_require__(58);
  
  var _keys2 = _interopRequireDefault2(_keys);
  
  var _sign = __webpack_require__(91);
  
  var _sign2 = _interopRequireDefault2(_sign);
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty2 = __webpack_require__(59);
  
  var _defineProperty3 = _interopRequireDefault2(_defineProperty2);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BarChart = undefined;
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty3.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Bar Chart
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Rectangle = __webpack_require__(94);
  
  var _Rectangle2 = _interopRequireDefault(_Rectangle);
  
  var _DataUtils = __webpack_require__(84);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _generateCategoricalChart = __webpack_require__(126);
  
  var _generateCategoricalChart2 = _interopRequireDefault(_generateCategoricalChart);
  
  var _Cell = __webpack_require__(86);
  
  var _Cell2 = _interopRequireDefault(_Cell);
  
  var _Bar = __webpack_require__(119);
  
  var _Bar2 = _interopRequireDefault(_Bar);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _CartesianUtils = __webpack_require__(127);
  
  var _AnimationDecorator = __webpack_require__(104);
  
  var _AnimationDecorator2 = _interopRequireDefault(_AnimationDecorator);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      (0, _defineProperty3.default)(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }return obj;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var BarChart = (0, _AnimationDecorator2.default)(_class = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(BarChart, _Component);
  
    function BarChart() {
      _classCallCheck(this, BarChart);
  
      return _possibleConstructorReturn(this, (BarChart.__proto__ || (0, _getPrototypeOf2.default)(BarChart)).apply(this, arguments));
    }
  
    _createClass(BarChart, [{
      key: 'getComposedData',
  
      /**
       * Compose the data of each group
       * @param  {Object} item        An instance of Bar
       * @param  {Array}  barPosition The offset and size of each bar
       * @param  {Object} xAxis       The configuration of x-axis
       * @param  {Object} yAxis       The configuration of y-axis
       * @param  {Object} offset      The offset of main part in the svg element
       * @param  {Array} stackedData  The stacked data of a bar item
       * @return {Array} Composed data
       */
      value: function getComposedData(item, barPosition, xAxis, yAxis, offset, stackedData) {
        var _props = this.props;
        var layout = _props.layout;
        var dataStartIndex = _props.dataStartIndex;
        var dataEndIndex = _props.dataEndIndex;
        var _item$props = item.props;
        var dataKey = _item$props.dataKey;
        var children = _item$props.children;
        var minPointSize = _item$props.minPointSize;
  
        var pos = barPosition[dataKey];
        var data = this.props.data.slice(dataStartIndex, dataEndIndex + 1);
        var xTicks = (0, _CartesianUtils.getTicksOfAxis)(xAxis);
        var yTicks = (0, _CartesianUtils.getTicksOfAxis)(yAxis);
        var baseValue = this.getBaseValue(xAxis, yAxis);
        var hasStack = stackedData && stackedData.length;
        var cells = (0, _ReactUtils.findAllByType)(children, _Cell2.default);
  
        return data.map(function (entry, index) {
          var value = stackedData ? stackedData[dataStartIndex + index] : [baseValue, entry[dataKey]];
          var x = void 0;
          var y = void 0;
          var width = void 0;
          var height = void 0;
  
          if (layout === 'horizontal') {
            x = xTicks[index].coordinate + pos.offset;
            y = yAxis.scale(xAxis.orientation === 'top' ? value[0] : value[1]);
            width = pos.size;
            height = xAxis.orientation === 'top' ? yAxis.scale(value[1]) - yAxis.scale(value[0]) : yAxis.scale(value[0]) - yAxis.scale(value[1]);
            if (Math.abs(minPointSize) > 0 && Math.abs(height) < Math.abs(minPointSize)) {
              var delta = (0, _sign2.default)(height || minPointSize) * (Math.abs(minPointSize) - Math.abs(height));
  
              y -= delta;
              height += delta;
            }
          } else {
            x = xAxis.scale(yAxis.orientation === 'left' ? value[0] : value[1]);
            y = yTicks[index].coordinate + pos.offset;
            width = yAxis.orientation === 'left' ? xAxis.scale(value[1]) - xAxis.scale(value[0]) : xAxis.scale(value[0]) - xAxis.scale(value[1]);
            height = pos.size;
  
            if (Math.abs(minPointSize) > 0 && Math.abs(width) < Math.abs(minPointSize)) {
              var _delta = (0, _sign2.default)(width || minPointSize) * (Math.abs(minPointSize) - Math.abs(width));
              width += _delta;
            }
          }
  
          return _extends({}, entry, {
            x: x, y: y, width: width, height: height, value: stackedData ? value : value[1]
          }, cells && cells[index] && cells[index].props);
        });
      }
    }, {
      key: 'getBaseValue',
      value: function getBaseValue(xAxis, yAxis) {
        var layout = this.props.layout;
  
        var numberAxis = layout === 'horizontal' ? yAxis : xAxis;
        var domain = numberAxis.scale.domain();
  
        if (numberAxis.type === 'number') {
          return Math.max(Math.min(domain[0], domain[1]), 0);
        }
  
        return domain[0];
      }
  
      /**
       * Calculate the size of each bar and the gap between two bars
       * @param  {Number}   bandSize  The size of each category
       * @param  {sizeList} sizeList  The size of all groups
       * @return {Number} The size of each bar and the gap between two bars
       */
  
    }, {
      key: 'getBarPosition',
      value: function getBarPosition(bandSize, sizeList) {
        var _props2 = this.props;
        var barGap = _props2.barGap;
        var barCategoryGap = _props2.barCategoryGap;
  
        var len = sizeList.length;
        var result = void 0;
  
        // whether or not is barSize setted by user
        if (sizeList[0].barSize === +sizeList[0].barSize) {
          (function () {
            var sum = sizeList.reduce(function (res, entry) {
              return res + entry.barSize || 0;
            }, 0);
            sum += (len - 1) * barGap;
            var offset = (bandSize - sum) / 2 >> 0;
            var prev = { offset: offset - barGap, size: 0 };
  
            result = sizeList.reduce(function (res, entry) {
              var newRes = _extends({}, res, _defineProperty({}, entry.dataKey, {
                offset: prev.offset + prev.size + barGap,
                size: entry.barSize
              }));
  
              prev = newRes[entry.dataKey];
  
              if (entry.stackList && entry.stackList.length) {
                entry.stackList.forEach(function (key) {
                  newRes[key] = newRes[entry.dataKey];
                });
              }
              return newRes;
            }, {});
          })();
        } else {
          (function () {
            var offset = (0, _DataUtils.getPercentValue)(barCategoryGap, bandSize, 0, true);
            var size = (bandSize - 2 * offset - (len - 1) * barGap) / len >> 0;
  
            result = sizeList.reduce(function (res, entry, i) {
              var newRes = _extends({}, res, _defineProperty({}, entry.dataKey, {
                offset: offset + (size + barGap) * i,
                size: size
              }));
  
              if (entry.stackList && entry.stackList.length) {
                entry.stackList.forEach(function (key) {
                  newRes[key] = newRes[entry.dataKey];
                });
              }
              return newRes;
            }, {});
          })();
        }
  
        return result;
      }
  
      /**
       * Calculate the size of all groups
       * @param  {Object} stackGroups The items grouped by axisId and stackId
       * @return {Object} The size of all groups
       */
  
    }, {
      key: 'getSizeList',
      value: function getSizeList(stackGroups) {
        var _props3 = this.props;
        var layout = _props3.layout;
        var barSize = _props3.barSize;
  
        var result = {};
        var numericAxisIds = (0, _keys2.default)(stackGroups);
  
        for (var i = 0, len = numericAxisIds.length; i < len; i++) {
          var sgs = stackGroups[numericAxisIds[i]].stackGroups;
          var stackIds = (0, _keys2.default)(sgs);
  
          for (var j = 0, sLen = stackIds.length; j < sLen; j++) {
            var _sgs$stackIds$j = sgs[stackIds[j]];
            var items = _sgs$stackIds$j.items;
            var numericAxisId = _sgs$stackIds$j.numericAxisId;
            var cateAxisId = _sgs$stackIds$j.cateAxisId;
  
            var barItems = items.filter(function (item) {
              return item.type.displayName === 'Bar';
            });
  
            if (barItems && barItems.length) {
              var dataKey = barItems[0].props.dataKey;
  
              var cateId = barItems[0].props[cateAxisId];
  
              if (!result[cateId]) {
                result[cateId] = [];
              }
  
              result[cateId].push({
                dataKey: dataKey,
                stackList: barItems.slice(1).map(function (item) {
                  return item.props.dataKey;
                }),
                barSize: barItems[0].props.barSize || barSize
              });
            }
          }
        }
  
        return result;
      }
    }, {
      key: 'renderCursor',
      value: function renderCursor(xAxisMap, yAxisMap, offset) {
        var _props4 = this.props;
        var children = _props4.children;
        var isTooltipActive = _props4.isTooltipActive;
        var layout = _props4.layout;
        var activeTooltipIndex = _props4.activeTooltipIndex;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem || !tooltipItem.props.cursor || !isTooltipActive || activeTooltipIndex < 0) {
          return null;
        }
  
        var axisMap = layout === 'horizontal' ? xAxisMap : yAxisMap;
        var axis = (0, _DataUtils.getAnyElementOfObject)(axisMap);
        var ticks = (0, _CartesianUtils.getTicksOfAxis)(axis);
  
        if (!ticks || !ticks[activeTooltipIndex]) {
          return null;
        }
  
        var start = ticks[activeTooltipIndex].coordinate;
        var bandSize = axis.scale.bandwidth();
        var cursorProps = _extends({
          fill: '#f1f1f1'
        }, (0, _ReactUtils.getPresentationAttributes)(tooltipItem.props.cursor), {
          x: layout === 'horizontal' ? start : offset.left + 0.5,
          y: layout === 'horizontal' ? offset.top + 0.5 : start,
          width: layout === 'horizontal' ? bandSize : offset.width - 1,
          height: layout === 'horizontal' ? offset.height - 1 : bandSize
        });
  
        return _react2.default.isValidElement(tooltipItem.props.cursor) ? _react2.default.cloneElement(tooltipItem.props.cursor, cursorProps) : _react2.default.createElement(_Rectangle2.default, _extends({}, cursorProps, { className: 'recharts-bar-cursor' }));
      }
  
      /**
       * Draw the main part of bar chart
       * @param  {Array} items     All the instance of Bar
       * @param  {Object} xAxisMap The configuration of all x-axis
       * @param  {Object} yAxisMap The configuration of all y-axis
       * @param  {Object} offset   The offset of main part in the svg element
       * @param  {Object} stackGroups The items grouped by axisId and stackId
       * @return {ReactComponent}  All the instances of Bar
       */
  
    }, {
      key: 'renderItems',
      value: function renderItems(items, xAxisMap, yAxisMap, offset, stackGroups) {
        var _this2 = this;
  
        if (!items || !items.length) {
          return null;
        }
  
        var layout = this.props.layout;
  
        var sizeList = this.getSizeList(stackGroups);
        var animationId = this.props.animationId;
  
        var barPositionMap = {};
  
        return items.map(function (child, i) {
          var _child$props = child.props;
          var xAxisId = _child$props.xAxisId;
          var yAxisId = _child$props.yAxisId;
  
          var numericAxisId = layout === 'horizontal' ? yAxisId : xAxisId;
          var cateAxisId = layout === 'horizontal' ? xAxisId : yAxisId;
          var cateAxis = layout === 'horizontal' ? xAxisMap[xAxisId] : yAxisMap[yAxisId];
          var bandSize = (0, _DataUtils.getBandSizeOfScale)(cateAxis.scale);
          var barPosition = barPositionMap[cateAxisId] || _this2.getBarPosition(bandSize, sizeList[cateAxisId]);
          var stackedData = stackGroups && stackGroups[numericAxisId] && stackGroups[numericAxisId].hasStack && (0, _CartesianUtils.getStackedDataOfItem)(child, stackGroups[numericAxisId].stackGroups);
  
          return _react2.default.cloneElement(child, _extends({
            key: 'bar-' + i
          }, (0, _ReactUtils.filterEventAttributes)(_this2.props), {
            layout: layout,
            animationId: animationId,
            data: _this2.getComposedData(child, barPosition, xAxisMap[xAxisId], yAxisMap[yAxisId], offset, stackedData)
          }));
        }, this);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props5 = this.props;
        var isComposed = _props5.isComposed;
        var graphicalItems = _props5.graphicalItems;
        var xAxisMap = _props5.xAxisMap;
        var yAxisMap = _props5.yAxisMap;
        var offset = _props5.offset;
        var stackGroups = _props5.stackGroups;
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-bar-graphical' }, !isComposed && this.renderCursor(xAxisMap, yAxisMap, offset), this.renderItems(graphicalItems, xAxisMap, yAxisMap, offset, stackGroups));
      }
    }]);
  
    return BarChart;
  }(_react.Component), _class2.displayName = 'BarChart', _class2.propTypes = {
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    dataStartIndex: _react.PropTypes.number,
    dataEndIndex: _react.PropTypes.number,
    data: _react.PropTypes.array,
    isTooltipActive: _react.PropTypes.bool,
    activeTooltipIndex: _react.PropTypes.number,
    xAxisMap: _react.PropTypes.object,
    yAxisMap: _react.PropTypes.object,
    offset: _react.PropTypes.object,
    graphicalItems: _react.PropTypes.array,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
    stackGroups: _react.PropTypes.object,
    barCategoryGap: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    barGap: _react.PropTypes.number,
    barSize: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    // used internally
    isComposed: _react.PropTypes.bool,
    animationId: _react.PropTypes.number
  }, _class2.defaultProps = {
    barCategoryGap: '10%',
    barGap: 4
  }, _temp)) || _class) || _class;
  
  exports.default = (0, _generateCategoricalChart2.default)(BarChart, _Bar2.default);
  exports.BarChart = BarChart;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Pie Chart
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _Legend = __webpack_require__(66);
  
  var _Legend2 = _interopRequireDefault(_Legend);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Pie = __webpack_require__(103);
  
  var _Pie2 = _interopRequireDefault(_Pie);
  
  var _Cell = __webpack_require__(86);
  
  var _Cell2 = _interopRequireDefault(_Cell);
  
  var _DataUtils = __webpack_require__(84);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PolarUtils = __webpack_require__(92);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var PieChart = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(PieChart, _Component);
  
    function PieChart() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, PieChart);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PieChart.__proto__ || (0, _getPrototypeOf2.default)(PieChart)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        activeTooltipLabel: '',
        activeTooltipCoord: { x: 0, y: 0 },
        activeTooltipPayload: [],
        isTooltipActive: false
      }, _this.handleMouseEnter = function (el, index, e) {
        var _this$props = _this.props;
        var children = _this$props.children;
        var onMouseEnter = _this$props.onMouseEnter;
        var cx = el.cx;
        var cy = el.cy;
        var outerRadius = el.outerRadius;
        var midAngle = el.midAngle;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          _this.setState({
            isTooltipActive: true,
            activeTooltipCoord: (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, midAngle),
            activeTooltipPayload: [el]
          }, function () {
            if (onMouseEnter) {
              onMouseEnter(el, index, e);
            }
          });
        } else if (onMouseEnter) {
          onMouseEnter(el, index, e);
        }
      }, _this.handleMouseLeave = function (el, index, e) {
        var _this$props2 = _this.props;
        var children = _this$props2.children;
        var onMouseLeave = _this$props2.onMouseLeave;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          _this.setState({
            isTooltipActive: false
          }, function () {
            if (onMouseLeave) {
              onMouseLeave(el, index, e);
            }
          });
        } else if (onMouseLeave) {
          onMouseLeave(el, index, e);
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(PieChart, [{
      key: 'getComposedData',
      value: function getComposedData(item) {
        var _item$props = item.props;
        var data = _item$props.data;
        var children = _item$props.children;
  
        var props = (0, _ReactUtils.getPresentationAttributes)(item.props);
        var cells = (0, _ReactUtils.findAllByType)(children, _Cell2.default);
  
        if (data && data.length) {
          return data.map(function (entry, index) {
            return _extends({}, props, entry, cells && cells[index] && cells[index].props);
          });
        }
  
        if (cells && cells.length) {
          return cells.map(function (cell) {
            return _extends({}, props, cell.props);
          });
        }
  
        return [];
      }
    }, {
      key: 'renderLegend',
  
      /**
       * Draw legend
       * @param  {Array} items             The instances of Pie
       * @return {ReactElement}            The instance of Legend
       */
      value: function renderLegend(items) {
        var _this2 = this;
  
        var children = this.props.children;
  
        var legendItem = (0, _ReactUtils.findChildByType)(children, _Legend2.default);
        if (!legendItem) {
          return null;
        }
  
        var _props = this.props;
        var width = _props.width;
        var height = _props.height;
        var margin = _props.margin;
  
        var legendData = legendItem.props && legendItem.props.payload || items.reduce(function (result, child) {
          var nameKey = child.props.nameKey;
  
          var data = _this2.getComposedData(child);
  
          return result.concat(data.map(function (entry) {
            return _extends({}, entry, { type: child.props.legendType, value: entry[nameKey],
              color: entry.fill
            });
          }));
        }, []);
  
        return _react2.default.cloneElement(legendItem, _extends({}, _Legend2.default.getWithHeight(legendItem, width, height), {
          payload: legendData,
          chartWidth: width,
          chartHeight: height,
          margin: margin
        }));
      }
    }, {
      key: 'renderTooltip',
      value: function renderTooltip() {
        var children = this.props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem) {
          return null;
        }
  
        var _props2 = this.props;
        var width = _props2.width;
        var height = _props2.height;
        var _state = this.state;
        var isTooltipActive = _state.isTooltipActive;
        var activeTooltipLabel = _state.activeTooltipLabel;
        var activeTooltipCoord = _state.activeTooltipCoord;
        var activeTooltipPayload = _state.activeTooltipPayload;
  
        var viewBox = { x: 0, y: 0, width: width, height: height };
  
        return _react2.default.cloneElement(tooltipItem, {
          viewBox: viewBox,
          active: isTooltipActive,
          label: activeTooltipLabel,
          payload: activeTooltipPayload,
          coordinate: activeTooltipCoord
        });
      }
  
      /**
       * Draw the main part of bar chart
       * @param  {Array} items    All the instance of Pie
       * @return {ReactComponent} All the instance of Pie
       */
  
    }, {
      key: 'renderItems',
      value: function renderItems(items) {
        var _this3 = this;
  
        var _props3 = this.props;
        var width = _props3.width;
        var height = _props3.height;
        var margin = _props3.margin;
        var onClick = _props3.onClick;
  
        return items.map(function (child, i) {
          var _child$props = child.props;
          var innerRadius = _child$props.innerRadius;
          var outerRadius = _child$props.outerRadius;
          var data = _child$props.data;
  
          var cx = (0, _DataUtils.getPercentValue)(child.props.cx, width, width / 2);
          var cy = (0, _DataUtils.getPercentValue)(child.props.cy, height, height / 2);
          var maxRadius = (0, _PolarUtils.getMaxRadius)(width, height, margin);
  
          return _react2.default.cloneElement(child, {
            key: 'recharts-pie-' + i,
            cx: cx,
            cy: cy,
            maxRadius: child.props.maxRadius || Math.sqrt(width * width + height * height) / 2,
            innerRadius: (0, _DataUtils.getPercentValue)(innerRadius, maxRadius, 0),
            outerRadius: (0, _DataUtils.getPercentValue)(outerRadius, maxRadius, maxRadius * 0.8),
            composedData: _this3.getComposedData(child),
            onMouseEnter: _this3.handleMouseEnter,
            onMouseLeave: _this3.handleMouseLeave,
            onClick: onClick
          });
        });
      }
    }, {
      key: 'render',
      value: function render() {
        if (!(0, _ReactUtils.validateWidthHeight)(this)) {
          return null;
        }
  
        var _props4 = this.props;
        var style = _props4.style;
        var children = _props4.children;
        var className = _props4.className;
        var width = _props4.width;
        var height = _props4.height;
  
        var others = _objectWithoutProperties(_props4, ['style', 'children', 'className', 'width', 'height']);
  
        var items = (0, _ReactUtils.findAllByType)(children, _Pie2.default);
        var attrs = (0, _ReactUtils.getPresentationAttributes)(others);
  
        return _react2.default.createElement('div', {
          className: (0, _classnames2.default)('recharts-wrapper', className),
          style: _extends({}, style, { position: 'relative', cursor: 'default', width: width, height: height })
        }, _react2.default.createElement(_Surface2.default, _extends({}, attrs, { width: width, height: height }), this.renderItems(items), (0, _ReactUtils.filterSvgElements)(children)), this.renderLegend(items), this.renderTooltip());
      }
    }]);
  
    return PieChart;
  }(_react.Component), _class2.displayName = 'PieChart', _class2.propTypes = {
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    margin: _react.PropTypes.shape({
      top: _react.PropTypes.number,
      right: _react.PropTypes.number,
      bottom: _react.PropTypes.number,
      left: _react.PropTypes.number
    }),
    title: _react.PropTypes.string,
    style: _react.PropTypes.object,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
    className: _react.PropTypes.string,
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func
  }, _class2.defaultProps = {
    style: {},
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  }, _temp2)) || _class;
  
  exports.default = PieChart;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2;
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  }; /**
      * @fileOverview TreemapChart
      */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Rectangle = __webpack_require__(94);
  
  var _Rectangle2 = _interopRequireDefault(_Rectangle);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var computeNode = function computeNode(_ref) {
    var depth = _ref.depth;
    var node = _ref.node;
    var index = _ref.index;
    var valueKey = _ref.valueKey;
    var children = node.children;
  
    var childDepth = depth + 1;
    var computedChildren = children && children.length ? children.map(function (child, i) {
      return computeNode({ depth: childDepth, node: child, index: i, valueKey: valueKey });
    }) : null;
    var value = void 0;
  
    if (children && children.length) {
      value = computedChildren.reduce(function (result, child) {
        return result + child.value;
      }, 0);
    } else {
      value = isNaN(node[valueKey]) || node[valueKey] <= 0 ? 0 : node[valueKey];
    }
  
    return _extends({}, node, {
      children: computedChildren,
      value: value, depth: depth, index: index
    });
  };
  
  var filterRect = function filterRect(node) {
    return { x: node.x, y: node.y, width: node.width, height: node.height };
  };
  
  // Compute the area for each child based on value & scale.
  var getAreaOfChildren = function getAreaOfChildren(children, areaValueRatio) {
    var ratio = areaValueRatio < 0 ? 0 : areaValueRatio;
  
    return children.map(function (child) {
      var area = child.value * ratio;
  
      return _extends({}, child, {
        area: isNaN(area) || area <= 0 ? 0 : area
      });
    });
  };
  
  // Computes the score for the specified row, as the worst aspect ratio.
  var getWorstScore = function getWorstScore(row, parentSize, aspectRatio) {
    var parentArea = parentSize * parentSize;
    var rowArea = row.area * row.area;
  
    var _row$reduce = row.reduce(function (result, child) {
      return {
        min: Math.min(result.min, child.area),
        max: Math.max(result.max, child.area)
      };
    }, { min: Infinity, max: 0 });
  
    var min = _row$reduce.min;
    var max = _row$reduce.max;
  
    return rowArea ? Math.max(parentArea * max * aspectRatio / rowArea, rowArea / (parentArea * min * aspectRatio)) : Infinity;
  };
  
  var horizontalPosition = function horizontalPosition(row, parentSize, parentRect, isFlush) {
    var rowHeight = parentSize ? Math.round(row.area / parentSize) : 0;
  
    if (isFlush || rowHeight > parentRect.height) {
      rowHeight = parentRect.height;
    }
  
    var curX = parentRect.x;
    var child = void 0;
    for (var i = 0, len = row.length; i < len; i++) {
      child = row[i];
      child.x = curX;
      child.y = parentRect.y;
      child.height = rowHeight;
      child.width = Math.min(rowHeight ? Math.round(child.area / rowHeight) : 0, parentRect.x + parentRect.width - curX);
      curX += child.width;
    }
    // what's z
    child.z = true;
    // add the remain x to the last one of row
    child.width += parentRect.x + parentRect.width - curX;
  
    return _extends({}, parentRect, {
      y: parentRect.y + rowHeight,
      height: parentRect.height - rowHeight
    });
  };
  
  var verticalPosition = function verticalPosition(row, parentSize, parentRect, isFlush) {
    var rowWidth = parentSize ? Math.round(row.area / parentSize) : 0;
  
    if (isFlush || rowWidth > parentRect.width) {
      rowWidth = parentRect.width;
    }
  
    var curY = parentRect.y;
    var child = void 0;
    for (var i = 0, len = row.length; i < len; i++) {
      child = row[i];
      child.x = parentRect.x;
      child.y = curY;
      child.width = rowWidth;
      child.height = Math.min(rowWidth ? Math.round(child.area / rowWidth) : 0, parentRect.y + parentRect.height - curY);
      curY += child.height;
    }
    child.z = false;
    child.height += parentRect.y + parentRect.height - curY;
  
    return _extends({}, parentRect, {
      x: parentRect.x + rowWidth,
      width: parentRect.width - rowWidth
    });
  };
  
  var position = function position(row, parentSize, parentRect, isFlush) {
    if (parentSize === parentRect.width) {
      return horizontalPosition(row, parentSize, parentRect, isFlush);
    }
  
    return verticalPosition(row, parentSize, parentRect, isFlush);
  };
  
  // Recursively arranges the specified node's children into squarified rows.
  var squarify = function squarify(node, aspectRatio) {
    var children = node.children;
  
    if (children && children.length) {
      var rect = filterRect(node);
      var row = [];
      var best = Infinity; // the best row score so far
      var score = void 0; // the current row score
      var size = Math.min(rect.width, rect.height); // initial orientation
      var scaleChildren = getAreaOfChildren(children, rect.width * rect.height / node.value);
      var tempChildren = scaleChildren.slice();
  
      row.area = 0;
  
      var child = void 0;
  
      while (tempChildren.length > 0) {
        // row first
        row.push(child = tempChildren[0]);
        row.area += child.area;
  
        score = getWorstScore(row, size, aspectRatio);
        if (score <= best) {
          // continue with this orientation
          tempChildren.shift();
          best = score;
        } else {
          // abort, and try a different orientation
          row.area -= row.pop().area;
          rect = position(row, size, rect, false);
          size = Math.min(rect.width, rect.height);
          row.length = row.area = 0;
          best = Infinity;
        }
      }
  
      if (row.length) {
        rect = position(row, size, rect, true);
        row.length = row.area = 0;
      }
  
      return _extends({}, node, { children: scaleChildren.map(function (c) {
          return squarify(c, aspectRatio);
        }) });
    }
  
    return node;
  };
  
  var Treemap = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(Treemap, _Component);
  
    function Treemap() {
      var _ref2;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, Treemap);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Treemap.__proto__ || (0, _getPrototypeOf2.default)(Treemap)).call.apply(_ref2, [this].concat(args))), _this), _this.state = _this.createDefaultState(), _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(Treemap, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
          this.setState(this.createDefaultState());
        }
      }
      /**
       * Returns default, reset state for the treemap chart.
       * @return {Object} Whole new state
       */
  
    }, {
      key: 'createDefaultState',
      value: function createDefaultState() {
        return {
          isTooltipActive: false,
          activeNode: null
        };
      }
    }, {
      key: 'handleMouseEnter',
      value: function handleMouseEnter(node, e) {
        var _props = this.props;
        var onMouseEnter = _props.onMouseEnter;
        var children = _props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          this.setState({
            isTooltipActive: true,
            activeNode: node
          }, function () {
            if (onMouseEnter) {
              onMouseEnter(node, e);
            }
          });
        } else if (onMouseEnter) {
          onMouseEnter(node, e);
        }
      }
    }, {
      key: 'handleMouseLeave',
      value: function handleMouseLeave(node, e) {
        var _props2 = this.props;
        var onMouseLeave = _props2.onMouseLeave;
        var children = _props2.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          this.setState({
            isTooltipActive: false,
            activeNode: null
          }, function () {
            if (onMouseLeave) {
              onMouseLeave(node, e);
            }
          });
        } else if (onMouseLeave) {
          onMouseLeave(node, e);
        }
      }
    }, {
      key: 'handleClick',
      value: function handleClick(node) {
        var onClick = this.props.onClick;
  
        if (onClick) {
          onClick(node);
        }
      }
    }, {
      key: 'renderAnimatedItem',
      value: function renderAnimatedItem(content, nodeProps, isLeaf) {
        var _this2 = this;
  
        var _props3 = this.props;
        var isAnimationActive = _props3.isAnimationActive;
        var animationBegin = _props3.animationBegin;
        var animationDuration = _props3.animationDuration;
        var animationEasing = _props3.animationEasing;
        var isUpdateAnimationActive = _props3.isUpdateAnimationActive;
        var width = nodeProps.width;
        var height = nodeProps.height;
        var x = nodeProps.x;
        var y = nodeProps.y;
  
        var translateX = parseInt((Math.random() * 2 - 1) * width, 10);
        var translateY = parseInt((Math.random() * 2 - 1) * height, 10);
        var event = {};
  
        if (isLeaf) {
          event = {
            onMouseEnter: this.handleMouseEnter.bind(this, nodeProps),
            onMouseLeave: this.handleMouseLeave.bind(this, nodeProps),
            onClick: this.handleClick.bind(this, nodeProps)
          };
        }
  
        return _react2.default.createElement(_reactSmooth2.default, {
          from: { x: x, y: y, width: width, height: height },
          to: { x: x, y: y, width: width, height: height },
          duration: animationDuration,
          easing: animationEasing,
          isActive: isUpdateAnimationActive
        }, function (_ref3) {
          var currX = _ref3.x;
          var currY = _ref3.y;
          var currWidth = _ref3.width;
          var currHeight = _ref3.height;
          return _react2.default.createElement(_reactSmooth2.default, {
            from: 'translate(' + translateX + 'px, ' + translateX + 'px)',
            to: 'translate(0, 0)',
            attributeName: 'transform',
            begin: animationBegin,
            easing: animationEasing,
            isActive: isAnimationActive,
            duration: animationDuration
          }, _react2.default.createElement(_Layer2.default, event, _this2.renderContentItem(content, _extends({}, nodeProps, {
            isAnimationActive: isAnimationActive,
            isUpdateAnimationActive: !isUpdateAnimationActive,
            width: currWidth,
            height: currHeight,
            x: currX,
            y: currY
          }))));
        });
      }
    }, {
      key: 'renderContentItem',
      value: function renderContentItem(content, nodeProps) {
        if (_react2.default.isValidElement(content)) {
          return _react2.default.cloneElement(content, nodeProps);
        } else if ((0, _isFunction3.default)(content)) {
          return content(nodeProps);
        }
  
        return _react2.default.createElement(_Rectangle2.default, nodeProps);
      }
    }, {
      key: 'renderNode',
      value: function renderNode(root, node, i) {
        var _this3 = this;
  
        var content = this.props.content;
  
        var nodeProps = _extends({}, (0, _ReactUtils.getPresentationAttributes)(this.props), node, { root: root });
        var isLeaf = !node.children || !node.children.length;
  
        return _react2.default.createElement(_Layer2.default, { key: 'recharts-treemap-node-' + i }, this.renderAnimatedItem(content, nodeProps, isLeaf), node.children && node.children.length ? node.children.map(function (child, index) {
          return _this3.renderNode(node, child, index);
        }) : null);
      }
    }, {
      key: 'renderAllNodes',
      value: function renderAllNodes() {
        var _props4 = this.props;
        var width = _props4.width;
        var height = _props4.height;
        var data = _props4.data;
        var dataKey = _props4.dataKey;
        var aspectRatio = _props4.aspectRatio;
  
        var root = computeNode({
          depth: 0,
          node: { children: data, x: 0, y: 0, width: width, height: height },
          index: 0,
          valueKey: dataKey
        });
  
        var formatRoot = squarify(root, aspectRatio);
  
        return this.renderNode(formatRoot, formatRoot, 0);
      }
    }, {
      key: 'renderTooltip',
      value: function renderTooltip(items, offset) {
        var children = this.props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem) {
          return null;
        }
  
        var _props5 = this.props;
        var width = _props5.width;
        var height = _props5.height;
        var dataKey = _props5.dataKey;
        var _state = this.state;
        var isTooltipActive = _state.isTooltipActive;
        var activeNode = _state.activeNode;
  
        var viewBox = { x: 0, y: 0, width: width, height: height };
        var coordinate = activeNode ? {
          x: activeNode.x + activeNode.width / 2,
          y: activeNode.y + activeNode.height / 2
        } : null;
        var payload = isTooltipActive && activeNode ? [{
          name: '', value: activeNode[dataKey]
        }] : [];
  
        return _react2.default.cloneElement(tooltipItem, {
          viewBox: viewBox,
          active: isTooltipActive,
          coordinate: coordinate,
          label: '',
          payload: payload,
          separator: ''
        });
      }
    }, {
      key: 'render',
      value: function render() {
        if (!(0, _ReactUtils.validateWidthHeight)(this)) {
          return null;
        }
  
        var _props6 = this.props;
        var width = _props6.width;
        var height = _props6.height;
        var className = _props6.className;
        var style = _props6.style;
        var children = _props6.children;
  
        var others = _objectWithoutProperties(_props6, ['width', 'height', 'className', 'style', 'children']);
  
        var attrs = (0, _ReactUtils.getPresentationAttributes)(others);
  
        return _react2.default.createElement('div', {
          className: (0, _classnames2.default)('recharts-wrapper', className),
          style: _extends({}, style, { position: 'relative', cursor: 'default', width: width, height: height })
        }, _react2.default.createElement(_Surface2.default, _extends({}, attrs, { width: width, height: height }), this.renderAllNodes(), (0, _ReactUtils.filterSvgElements)(children)), this.renderTooltip());
      }
    }]);
  
    return Treemap;
  }(_react.Component), _class2.displayName = 'Treemap', _class2.propTypes = {
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    data: _react.PropTypes.array,
    style: _react.PropTypes.object,
    aspectRatio: _react.PropTypes.number,
    content: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
    fill: _react.PropTypes.string,
    stroke: _react.PropTypes.string,
    className: _react.PropTypes.string,
    dataKey: _react.PropTypes.string,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
  
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func,
  
    isAnimationActive: _react.PropTypes.bool,
    isUpdateAnimationActive: _react.PropTypes.bool,
    animationBegin: _react.PropTypes.number,
    animationDuration: _react.PropTypes.number,
    animationEasing: _react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'])
  }, _class2.defaultProps = {
    fill: '#fff',
    stroke: '#000',
    dataKey: 'value',
    aspectRatio: 0.5 * (1 + Math.sqrt(5)),
    isAnimationActive: true,
    isUpdateAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'linear'
  }, _temp2)) || _class;
  
  exports.default = Treemap;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isObject2 = __webpack_require__(62);
  
  var _isObject3 = _interopRequireDefault(_isObject2);
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _sumBy2 = __webpack_require__(135);
  
  var _sumBy3 = _interopRequireDefault(_sumBy2);
  
  var _min2 = __webpack_require__(136);
  
  var _min3 = _interopRequireDefault(_min2);
  
  var _maxBy2 = __webpack_require__(101);
  
  var _maxBy3 = _interopRequireDefault(_maxBy2);
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2;
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  }; /**
      * @file TreemapChart
      */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Rectangle = __webpack_require__(94);
  
  var _Rectangle2 = _interopRequireDefault(_Rectangle);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _ReactUtils = __webpack_require__(57);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var interpolationGenerator = function interpolationGenerator(a, b) {
    var ka = +a;
    var kb = b - ka;
    return function (t) {
      return ka + kb * t;
    };
  };
  var centerY = function centerY(node) {
    return node.y + node.dy / 2;
  };
  var getValue = function getValue(entry) {
    return entry && entry.value || 0;
  };
  var getSumOfIds = function getSumOfIds(links, ids) {
    return ids.reduce(function (result, id) {
      return result + getValue(links[id]);
    }, 0);
  };
  var getSumWithWeightedSource = function getSumWithWeightedSource(tree, links, ids) {
    return ids.reduce(function (result, id) {
      var link = links[id];
      var sourceNode = tree[link.source];
  
      return result + centerY(sourceNode) * getValue(links[id]);
    }, 0);
  };
  var getSumWithWeightedTarget = function getSumWithWeightedTarget(tree, links, ids) {
    return ids.reduce(function (result, id) {
      var link = links[id];
      var targetNode = tree[link.target];
  
      return result + centerY(targetNode) * getValue(links[id]);
    }, 0);
  };
  var ascendingY = function ascendingY(a, b) {
    return a.y - b.y;
  };
  
  var searchTargetsAndSources = function searchTargetsAndSources(links, id) {
    var sourceNodes = [];
    var sourceLinks = [];
    var targetNodes = [];
    var targetLinks = [];
  
    for (var i = 0, len = links.length; i < len; i++) {
      var link = links[i];
  
      if (link.source === id) {
        targetNodes.push(link.target);
        targetLinks.push(i);
      }
  
      if (link.target === id) {
        sourceNodes.push(link.source);
        sourceLinks.push(i);
      }
    }
  
    return { sourceNodes: sourceNodes, sourceLinks: sourceLinks, targetLinks: targetLinks, targetNodes: targetNodes };
  };
  
  var updateDepthOfTargets = function updateDepthOfTargets(tree, curNode) {
    var targetNodes = curNode.targetNodes;
  
    for (var i = 0, len = targetNodes.length; i < len; i++) {
      var target = tree[targetNodes[i]];
  
      if (target) {
        target.depth = Math.max(curNode.depth + 1, target.depth);
  
        updateDepthOfTargets(tree, target);
      }
    }
  };
  
  var getNodesTree = function getNodesTree(_ref, width, nodeWidth) {
    var nodes = _ref.nodes;
    var links = _ref.links;
  
    var tree = nodes.map(function (entry, index) {
      var result = searchTargetsAndSources(links, index);
  
      return _extends({}, entry, result, {
        value: Math.max(getSumOfIds(links, result.sourceLinks), getSumOfIds(links, result.targetLinks)),
        depth: 0
      });
    });
  
    for (var i = 0, len = tree.length; i < len; i++) {
      var node = tree[i];
  
      if (!node.sourceNodes.length) {
        updateDepthOfTargets(tree, node);
      }
    }
    var maxDepth = (0, _maxBy3.default)(tree, function (entry) {
      return entry.depth;
    }).depth;
  
    if (maxDepth >= 1) {
      var childWidth = (width - nodeWidth) / maxDepth;
      for (var _i = 0, _len = tree.length; _i < _len; _i++) {
        var _node = tree[_i];
  
        if (!_node.targetNodes.length) {
          _node.depth = maxDepth;
        }
        _node.x = _node.depth * childWidth;
        _node.dx = nodeWidth;
      }
    }
  
    return { tree: tree, maxDepth: maxDepth };
  };
  
  var getDepthTree = function getDepthTree(tree, maxDepth) {
    var result = [];
  
    for (var i = 0, len = tree.length; i < len; i++) {
      var node = tree[i];
  
      if (!result[node.depth]) {
        result[node.depth] = [];
      }
  
      result[node.depth].push(node);
    }
  
    return result;
  };
  
  var updateYOfTree = function updateYOfTree(depthTree, height, nodePadding, links) {
    var yRatio = (0, _min3.default)(depthTree.map(function (nodes) {
      return (height - (nodes.length - 1) * nodePadding) / (0, _sumBy3.default)(nodes, getValue);
    }));
  
    for (var d = 0, maxDepth = depthTree.length; d < maxDepth; d++) {
      for (var i = 0, len = depthTree[d].length; i < len; i++) {
        var node = depthTree[d][i];
  
        node.y = i;
        node.dy = node.value * yRatio;
      }
    }
  
    return links.map(function (link) {
      return _extends({}, link, { dy: getValue(link) * yRatio });
    });
  };
  
  var resolveCollisions = function resolveCollisions(depthTree, height, nodePadding) {
    for (var i = 0, len = depthTree.length; i < len; i++) {
      var nodes = depthTree[i];
      var n = nodes.length;
  
      // Sort by the value of y
      nodes.sort(ascendingY);
  
      var y0 = 0;
      for (var j = 0; j < n; j++) {
        var node = nodes[j];
        var dy = y0 - node.y;
  
        if (dy > 0) {
          node.y += dy;
        }
  
        y0 = node.y + node.dy + nodePadding;
      }
  
      y0 = height + nodePadding;
      for (var _j = n - 1; _j >= 0; _j--) {
        var _node2 = nodes[_j];
        var _dy = _node2.y + _node2.dy + nodePadding - y0;
  
        if (_dy > 0) {
          _node2.y -= _dy;
          y0 = _node2.y;
        } else {
          break;
        }
      }
    }
  };
  
  var relaxLeftToRight = function relaxLeftToRight(tree, depthTree, links, alpha) {
    for (var i = 0, maxDepth = depthTree.length; i < maxDepth; i++) {
      var nodes = depthTree[i];
  
      for (var j = 0, len = nodes.length; j < len; j++) {
        var node = nodes[j];
  
        if (node.sourceLinks.length) {
          var sourceSum = getSumOfIds(links, node.sourceLinks);
          var weightedSum = getSumWithWeightedSource(tree, links, node.sourceLinks);
          var y = weightedSum / sourceSum;
  
          node.y += (y - centerY(node)) * alpha;
        }
      }
    }
  };
  var relaxRightToLeft = function relaxRightToLeft(tree, depthTree, links, alpha) {
    for (var i = depthTree.length - 1; i >= 0; i--) {
      var nodes = depthTree[i];
  
      for (var j = 0, len = nodes.length; j < len; j++) {
        var node = nodes[j];
  
        if (node.targetLinks.length) {
          var targetSum = getSumOfIds(links, node.targetLinks);
          var weightedSum = getSumWithWeightedTarget(tree, links, node.targetLinks);
          var y = weightedSum / targetSum;
  
          node.y += (y - centerY(node)) * alpha;
        }
      }
    }
  };
  var updateYOfLinks = function updateYOfLinks(tree, links) {
    for (var i = 0, len = tree.length; i < len; i++) {
      var node = tree[i];
      var sy = 0;
      var ty = 0;
  
      node.targetLinks.sort(function (a, b) {
        return tree[links[a].target].y - tree[links[b].target].y;
      });
      node.sourceLinks.sort(function (a, b) {
        return tree[links[a].source].y - tree[links[b].source].y;
      });
  
      for (var j = 0, tLen = node.targetLinks.length; j < tLen; j++) {
        var link = links[node.targetLinks[j]];
  
        if (link) {
          link.sy = sy;
          sy += link.dy;
        }
      }
  
      for (var _j2 = 0, sLen = node.sourceLinks.length; _j2 < sLen; _j2++) {
        var _link = links[node.sourceLinks[_j2]];
  
        if (_link) {
          _link.ty = ty;
          ty += _link.dy;
        }
      }
    }
  };
  
  var computeData = function computeData(_ref2) {
    var data = _ref2.data;
    var width = _ref2.width;
    var height = _ref2.height;
    var iterations = _ref2.iterations;
    var nodeWidth = _ref2.nodeWidth;
    var nodePadding = _ref2.nodePadding;
    var nodes = data.nodes;
    var links = data.links;
  
    var _getNodesTree = getNodesTree(data, width, nodeWidth);
  
    var tree = _getNodesTree.tree;
    var maxDepth = _getNodesTree.maxDepth;
  
    var depthTree = getDepthTree(tree, maxDepth);
    var newLinks = updateYOfTree(depthTree, height, nodePadding, links);
  
    resolveCollisions(depthTree, height, nodePadding);
  
    var alpha = 1;
    for (var i = 1; i <= iterations; i++) {
      relaxRightToLeft(tree, depthTree, newLinks, alpha *= 0.99);
  
      resolveCollisions(depthTree, height, nodePadding);
  
      relaxLeftToRight(tree, depthTree, newLinks, alpha);
  
      resolveCollisions(depthTree, height, nodePadding);
    }
  
    updateYOfLinks(tree, newLinks);
  
    return { nodes: tree, links: newLinks };
  };
  
  var Sankey = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(Sankey, _Component);
  
    function Sankey() {
      var _ref3;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, Sankey);
  
      for (var _len2 = arguments.length, args = Array(_len2), _key = 0; _key < _len2; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = Sankey.__proto__ || (0, _getPrototypeOf2.default)(Sankey)).call.apply(_ref3, [this].concat(args))), _this), _this.state = _this.createDefaultState(), _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(Sankey, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
          this.setState(this.createDefaultState());
        }
      }
      /**
       * Returns default, reset state for the sankey chart.
       * @return {Object} Whole new state
       */
  
    }, {
      key: 'createDefaultState',
      value: function createDefaultState() {
        return {
          isTooltipActive: false
        };
      }
    }, {
      key: 'handleMouseEnter',
      value: function handleMouseEnter(el, index, e) {
        var _props = this.props;
        var onMouseEnter = _props.onMouseEnter;
        var children = _props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          this.setState({
            activeLink: el,
            isTooltipActive: true
          }, function () {
            if (onMouseEnter) {
              onMouseEnter(el, index, e);
            }
          });
        } else if (onMouseEnter) {
          onMouseEnter(el, index, e);
        }
      }
    }, {
      key: 'handleMouseLeave',
      value: function handleMouseLeave(el, index, e) {
        var _props2 = this.props;
        var onMouseLeave = _props2.onMouseLeave;
        var children = _props2.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          this.setState({
  
            isTooltipActive: false
          }, function () {
            if (onMouseLeave) {
              onMouseLeave(el, index, e);
            }
          });
        } else if (onMouseLeave) {
          onMouseLeave(el, index, e);
        }
      }
    }, {
      key: 'handleClick',
      value: function handleClick(el, index, e) {
        var onClick = this.props.onClick;
  
        if (onClick) {
          onClick(el, index, e);
        }
      }
    }, {
      key: 'renderLinks',
      value: function renderLinks(links, nodes) {
        var _props3 = this.props;
        var linkCurvature = _props3.linkCurvature;
        var linkContent = _props3.link;
        var margin = _props3.margin;
  
        var top = margin.top || 0;
        var left = margin.left || 0;
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-sankey-links', key: 'recharts-sankey-links' }, links.map(function (link, i) {
          var sourceRelativeY = link.sy;
          var targetRelativeY = link.ty;
          var linkWidth = link.dy;
  
          var source = nodes[link.source];
          var target = nodes[link.target];
          var sourceX = source.x + source.dx + left;
          var targetX = target.x + left;
          var interpolationFunc = interpolationGenerator(sourceX, targetX);
          var sourceControlX = interpolationFunc(linkCurvature);
          var targetControlX = interpolationFunc(1 - linkCurvature);
  
          var sourceY = source.y + sourceRelativeY + linkWidth / 2 + top;
          var targetY = target.y + targetRelativeY + linkWidth / 2 + top;
  
          var linkProps = {
            sourceX: sourceX, targetX: targetX,
            sourceY: sourceY, targetY: targetY,
            sourceControlX: sourceControlX, targetControlX: targetControlX,
            sourceRelativeY: sourceRelativeY, targetRelativeY: targetRelativeY,
            linkWidth: linkWidth,
            index: i,
            payload: link
          };
          var linkPresentationAttributes = {};
  
          if (_react2.default.isValidElement(linkContent)) {
            return _react2.default.createElement(_Layer2.default, { key: 'link' + i }, _react2.default.cloneElement(linkContent, linkProps));
          } else if ((0, _isFunction3.default)(linkContent)) {
            return _react2.default.createElement(_Layer2.default, { key: 'link' + i }, linkContent(linkProps));
          } else if ((0, _isObject3.default)(linkContent)) {
            linkPresentationAttributes = (0, _ReactUtils.getPresentationAttributes)(linkContent);
          }
  
          return _react2.default.createElement(_Layer2.default, { key: 'link' + i }, _react2.default.createElement('path', _extends({
            className: 'recharts-sankey-link',
            d: '\n                    M' + sourceX + ',' + sourceY + '\n                    C' + sourceControlX + ',' + sourceY + ' ' + targetControlX + ',' + targetY + ' ' + targetX + ',' + targetY + '\n                  ',
            fill: 'none',
            stroke: '#333',
            strokeWidth: linkWidth,
            strokeOpacity: '0.2'
          }, linkPresentationAttributes)));
        }));
      }
    }, {
      key: 'renderNodes',
      value: function renderNodes(nodes) {
        var _props4 = this.props;
        var nodeContent = _props4.node;
        var margin = _props4.margin;
  
        var top = margin.top || 0;
        var left = margin.left || 0;
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-sankey-nodes', key: 'recharts-sankey-nodes' }, nodes.map(function (node, i) {
          var x = node.x;
          var y = node.y;
          var dx = node.dx;
          var dy = node.dy;
  
          var nodeProps = {
            x: x + left,
            y: y + top,
            width: dx,
            height: dy,
            index: i,
            payload: node
          };
          var nodePresentationAttributes = {};
  
          if (_react2.default.isValidElement(nodeContent)) {
            return _react2.default.createElement(_Layer2.default, { key: 'node' + i }, _react2.default.cloneElement(nodeContent, nodeProps));
          } else if ((0, _isFunction3.default)(nodeContent)) {
            return _react2.default.createElement(_Layer2.default, { key: 'node' + i }, nodeContent(nodeProps));
          } else if ((0, _isObject3.default)(nodeContent)) {
            nodePresentationAttributes = (0, _ReactUtils.getPresentationAttributes)(nodeContent);
          }
  
          return _react2.default.createElement(_Layer2.default, { key: 'node' + i }, _react2.default.createElement(_Rectangle2.default, _extends({
            className: 'recharts-sankey-node',
            fill: '#0088fe',
            fillOpacity: '0.8'
          }, nodeProps, nodePresentationAttributes)));
        }));
      }
    }, {
      key: 'renderTooltip',
      value: function renderTooltip(links, nodes) {
        var children = this.props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem) {
          return null;
        }
  
        var _state = this.state;
        var isTooltipActive = _state.isTooltipActive;
        var activeLink = _state.activeLink;
  
        var viewBox = { x: 0, y: 0, width: 100, height: 100 };
        var coordinate = {
          x: 0,
          y: 0
        };
        var payload = isTooltipActive ? [{
          name: 'hh', value: 'aa'
        }] : [];
  
        return _react2.default.cloneElement(tooltipItem, {
          viewBox: viewBox,
          active: isTooltipActive,
          coordinate: coordinate,
          label: 'bb',
          payload: payload,
          separator: 'cc'
        });
      }
    }, {
      key: 'render',
      value: function render() {
        if (!(0, _ReactUtils.validateWidthHeight)(this)) {
          return null;
        }
  
        var _props5 = this.props;
        var data = _props5.data;
        var iterations = _props5.iterations;
        var nodeWidth = _props5.nodeWidth;
        var nodePadding = _props5.nodePadding;
        var width = _props5.width;
        var height = _props5.height;
        var className = _props5.className;
        var style = _props5.style;
        var children = _props5.children;
        var margin = _props5.margin;
  
        var others = _objectWithoutProperties(_props5, ['data', 'iterations', 'nodeWidth', 'nodePadding', 'width', 'height', 'className', 'style', 'children', 'margin']);
  
        var contentWidth = width - (margin.left || 0) - (margin.right || 0);
        var contentHeight = height - (margin.top || 0) - (margin.bottom || 0);
  
        var _computeData = computeData({
          data: data,
          width: contentWidth,
          height: contentHeight,
          iterations: iterations, nodeWidth: nodeWidth, nodePadding: nodePadding
        });
  
        var links = _computeData.links;
        var nodes = _computeData.nodes;
  
        var attrs = (0, _ReactUtils.getPresentationAttributes)(others);
  
        return _react2.default.createElement('div', {
          className: (0, _classnames2.default)('recharts-wrapper', className),
          style: _extends({}, style, { position: 'relative', cursor: 'default', width: width, height: height })
        }, _react2.default.createElement(_Surface2.default, _extends({}, attrs, { width: width, height: height }), (0, _ReactUtils.filterSvgElements)(children), this.renderLinks(links, nodes), this.renderNodes(nodes)), this.renderTooltip(links, nodes));
      }
    }]);
  
    return Sankey;
  }(_react.Component), _class2.displayName = 'Sankey', _class2.propTypes = _extends({}, _ReactUtils.PRESENTATION_ATTRIBUTES, _ReactUtils.EVENT_ATTRIBUTES, {
  
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    data: _react.PropTypes.shape({
      nodes: _react.PropTypes.array,
      links: _react.PropTypes.arrayOf(_react.PropTypes.shape({
        target: _react.PropTypes.number,
        source: _react.PropTypes.number,
        value: _react.PropTypes.number
      }))
    }),
  
    nodePadding: _react.PropTypes.number,
    nodeWidth: _react.PropTypes.number,
    linkCurvature: _react.PropTypes.number,
    iterations: _react.PropTypes.number,
  
    node: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.element, _react.PropTypes.func]),
    link: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.element, _react.PropTypes.func]),
  
    style: _react.PropTypes.object,
    className: _react.PropTypes.string,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
    margin: _react.PropTypes.shape({
      top: _react.PropTypes.number,
      right: _react.PropTypes.number,
      bottom: _react.PropTypes.number,
      left: _react.PropTypes.number
    })
  }), _class2.defaultProps = {
    nodePadding: 10,
    nodeWidth: 10,
    linkCurvature: 0.5,
    iterations: 32,
    margin: { top: 5, right: 5, bottom: 5, left: 5 }
  }, _temp2)) || _class;
  
  exports.default = Sankey;

/***/ }),
/* 135 */
/***/ (function(module, exports) {

  module.exports = require("lodash/sumBy");

/***/ }),
/* 136 */
/***/ (function(module, exports) {

  module.exports = require("lodash/min");

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _range2 = __webpack_require__(109);
  
  var _range3 = _interopRequireDefault(_range2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Radar Chart
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reactDom = __webpack_require__(95);
  
  var _reactDom2 = _interopRequireDefault(_reactDom);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _d3Scale = __webpack_require__(110);
  
  var _rechartsScale = __webpack_require__(128);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Legend = __webpack_require__(66);
  
  var _Legend2 = _interopRequireDefault(_Legend);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Radar = __webpack_require__(105);
  
  var _Radar2 = _interopRequireDefault(_Radar);
  
  var _PolarGrid = __webpack_require__(99);
  
  var _PolarGrid2 = _interopRequireDefault(_PolarGrid);
  
  var _PolarAngleAxis = __webpack_require__(102);
  
  var _PolarAngleAxis2 = _interopRequireDefault(_PolarAngleAxis);
  
  var _PolarRadiusAxis = __webpack_require__(100);
  
  var _PolarRadiusAxis2 = _interopRequireDefault(_PolarRadiusAxis);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _DOMUtils = __webpack_require__(77);
  
  var _PolarUtils = __webpack_require__(92);
  
  var _DataUtils = __webpack_require__(84);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _AnimationDecorator = __webpack_require__(104);
  
  var _AnimationDecorator2 = _interopRequireDefault(_AnimationDecorator);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var RadarChart = (0, _AnimationDecorator2.default)(_class = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(RadarChart, _Component);
  
    function RadarChart() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, RadarChart);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RadarChart.__proto__ || (0, _getPrototypeOf2.default)(RadarChart)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.createDefaultState(), _this.handleMouseEnter = function (itemProps, e) {
        var _this$props = _this.props;
        var children = _this$props.children;
        var onMouseEnter = _this$props.onMouseEnter;
        var points = itemProps.points;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem && points.length) {
          var container = _reactDom2.default.findDOMNode(_this);
          var containerOffset = (0, _DOMUtils.getOffset)(container);
          var ne = (0, _DOMUtils.calculateChartCoordinate)(e, containerOffset);
  
          _this.setState({
            isTooltipActive: true,
            activeTooltipLabel: itemProps.name || itemProps.dataKey,
            activeTooltipCoord: { x: ne.chartX, y: ne.chartY },
            activeTooltipPayload: _this.getTooltipContent(itemProps)
          }, function () {
            if (onMouseEnter) {
              onMouseEnter(points, e);
            }
          });
        } else if (onMouseEnter) {
          onMouseEnter(points, e);
        }
      }, _this.handleMouseLeave = function (itemProps, e) {
        var _this$props2 = _this.props;
        var children = _this$props2.children;
        var onMouseLeave = _this$props2.onMouseLeave;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          _this.setState({
            isTooltipActive: false
          }, function () {
            if (onMouseLeave) {
              onMouseLeave(itemProps, e);
            }
          });
        } else if (onMouseLeave) {
          onMouseLeave(itemProps, e);
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(RadarChart, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
          this.setState(this.createDefaultState());
        }
      }
    }, {
      key: 'getTooltipContent',
      value: function getTooltipContent(itemProps) {
        var points = itemProps.points;
        var dataKey = itemProps.dataKey;
        var unit = itemProps.unit;
  
        return points.map(function (entry) {
          var name = entry.name;
          var value = entry.value;
          var payload = entry.payload;
  
          return _extends({}, (0, _ReactUtils.getPresentationAttributes)(itemProps), {
            dataKey: dataKey, unit: unit, name: name, value: value, payload: payload
          });
        });
      }
    }, {
      key: 'getRadiusAxisCfg',
      value: function getRadiusAxisCfg(radiusAxis, innerRadius, outerRadius) {
        var children = this.props.children;
  
        var domain = void 0;
        var tickCount = void 0;
        var ticks = void 0;
  
        if (radiusAxis && radiusAxis.props.ticks) {
          ticks = radiusAxis.props.ticks;
  
          tickCount = ticks.length;
          domain = [Math.min.apply(null, ticks), Math.max.apply(null, ticks)];
        } else {
          tickCount = Math.max(radiusAxis && radiusAxis.props.tickCount || _PolarRadiusAxis2.default.defaultProps.tickCount, 2);
          ticks = this.getTicksByItems(radiusAxis, tickCount);
  
          domain = [Math.min.apply(null, ticks), Math.max.apply(null, ticks)];
        }
  
        return {
          tickCount: tickCount,
          ticks: ticks,
          scale: (0, _d3Scale.scaleLinear)().domain(domain).range([innerRadius, outerRadius])
        };
      }
    }, {
      key: 'getTicksByItems',
      value: function getTicksByItems(axisItem, tickCount) {
        var _props = this.props;
        var data = _props.data;
        var children = _props.children;
  
        var _ref2 = axisItem ? axisItem.props : _PolarRadiusAxis2.default.defaultProps;
  
        var domain = _ref2.domain;
        var allowDataOverflow = _ref2.allowDataOverflow;
  
        var radarItems = (0, _ReactUtils.findAllByType)(children, _Radar2.default);
        var dataKeys = radarItems.map(function (item) {
          return item.props.dataKey;
        });
        var extent = data.reduce(function (prev, current) {
          var values = dataKeys.map(function (v) {
            return current[v] || 0;
          });
          var currentMax = Math.max.apply(null, values);
          var currentMin = Math.min.apply(null, values);
  
          return [Math.min(prev[0], currentMin), Math.max(prev[1], currentMax)];
        }, [Infinity, -Infinity]);
        var finalDomain = (0, _DataUtils.parseSpecifiedDomain)(domain, extent, allowDataOverflow);
  
        if (domain && (domain[0] === 'auto' || domain[1] === 'auto')) {
          return (0, _rechartsScale.getNiceTickValues)(finalDomain, tickCount);
        }
  
        return finalDomain;
      }
    }, {
      key: 'getGridRadius',
      value: function getGridRadius(gridCount, innerRadius, outerRadius) {
        var domain = (0, _range3.default)(0, gridCount);
        var scale = (0, _d3Scale.scalePoint)().domain(domain).range([innerRadius, outerRadius]);
  
        return domain.map(function (v) {
          return scale(v);
        });
      }
    }, {
      key: 'getAngle',
      value: function getAngle(index, dataLength, startAngle, clockWise) {
        var sign = clockWise ? -1 : 1;
        var angleInterval = 360 / dataLength;
  
        return startAngle + index * sign * angleInterval;
      }
    }, {
      key: 'getAngleTicks',
      value: function getAngleTicks(dataLength, startAngle, clockWise) {
        var angles = [];
  
        for (var i = 0; i < dataLength; i++) {
          angles.push(this.getAngle(i, dataLength, startAngle, clockWise));
        }
  
        return angles;
      }
    }, {
      key: 'getRadiusTicks',
      value: function getRadiusTicks(axisCfg) {
        var ticks = axisCfg.ticks;
        var scale = axisCfg.scale;
  
        if (ticks && ticks.length) {
          return ticks.map(function (entry) {
            return {
              radius: scale(entry),
              value: entry
            };
          });
        }
        var tickCount = axisCfg.tickCount;
  
        var domain = scale.domain();
  
        return (0, _range3.default)(0, tickCount).map(function (v, i) {
          var value = domain[0] + i * (domain[1] - domain[0]) / (tickCount - 1);
          return {
            value: value,
            radius: scale(value)
          };
        });
      }
    }, {
      key: 'getComposedData',
      value: function getComposedData(item, scale, cx, cy, innerRadius, outerRadius) {
        var _this2 = this;
  
        var dataKey = item.props.dataKey;
        var _props2 = this.props;
        var data = _props2.data;
        var startAngle = _props2.startAngle;
        var clockWise = _props2.clockWise;
        var children = _props2.children;
  
        var angleAxis = (0, _ReactUtils.findChildByType)(children, _PolarAngleAxis2.default);
        var nameKey = angleAxis && angleAxis.props.dataKey;
        var len = data.length;
  
        return data.map(function (entry, i) {
          var value = entry[dataKey] || 0;
          var angle = _this2.getAngle(i, len, startAngle, clockWise);
          var radius = scale(value);
  
          return _extends({}, (0, _PolarUtils.polarToCartesian)(cx, cy, radius, angle), {
            value: value,
            name: nameKey ? entry[nameKey] || i : i,
            cx: cx, cy: cy, radius: radius, angle: angle,
            payload: entry
          });
        });
      }
      /**
       * Returns default, reset state for the radar chart.
       * @return {Object} Whole new state
       */
  
    }, {
      key: 'createDefaultState',
      value: function createDefaultState() {
        return {
          activeTooltipLabel: '',
          activeTooltipCoord: { x: 0, y: 0 },
          isTooltipActive: false
        };
      }
    }, {
      key: 'renderRadars',
      value: function renderRadars(items, scale, cx, cy, innerRadius, outerRadius) {
        var _this3 = this;
  
        if (!items || !items.length) {
          return null;
        }
  
        var baseProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
        return items.map(function (el, index) {
          return _react2.default.cloneElement(el, _extends({}, baseProps, (0, _ReactUtils.getPresentationAttributes)(el), {
            animationId: _this3.props.animationId,
            points: _this3.getComposedData(el, scale, cx, cy, innerRadius, outerRadius),
            key: 'radar-' + index,
            onMouseEnter: _this3.handleMouseEnter,
            onMouseLeave: _this3.handleMouseLeave
          }));
        });
      }
    }, {
      key: 'renderGrid',
      value: function renderGrid(radiusAxisCfg, cx, cy, innerRadius, outerRadius) {
        var children = this.props.children;
  
        var grid = (0, _ReactUtils.findChildByType)(children, _PolarGrid2.default);
  
        if (!grid) {
          return null;
        }
  
        var _props3 = this.props;
        var startAngle = _props3.startAngle;
        var clockWise = _props3.clockWise;
        var data = _props3.data;
  
        var len = data.length;
        var gridCount = radiusAxisCfg.tickCount;
  
        return _react2.default.cloneElement(grid, {
          polarAngles: this.getAngleTicks(len, startAngle, clockWise),
          polarRadius: this.getGridRadius(gridCount, innerRadius, outerRadius),
          cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius,
          key: 'layer-grid'
        });
      }
    }, {
      key: 'renderAngleAxis',
      value: function renderAngleAxis(cx, cy, outerRadius, maxRadius) {
        var _this4 = this;
  
        var children = this.props.children;
  
        var angleAxis = (0, _ReactUtils.findChildByType)(children, _PolarAngleAxis2.default);
  
        if (!angleAxis || angleAxis.props.hide) {
          return null;
        }
  
        var _props4 = this.props;
        var data = _props4.data;
        var width = _props4.width;
        var height = _props4.height;
        var startAngle = _props4.startAngle;
        var clockWise = _props4.clockWise;
  
        var len = data.length;
        var grid = (0, _ReactUtils.findChildByType)(children, _PolarGrid2.default);
        var radius = (0, _DataUtils.getPercentValue)(angleAxis.props.radius, maxRadius, outerRadius);
        var dataKey = angleAxis.props.dataKey;
  
        return _react2.default.cloneElement(angleAxis, {
          ticks: data.map(function (v, i) {
            return {
              value: dataKey ? v[dataKey] : i,
              angle: _this4.getAngle(i, len, startAngle, clockWise)
            };
          }),
          cx: cx, cy: cy, radius: radius,
          axisLineType: grid && grid.props && grid.props.gridType || _PolarGrid2.default.defaultProps.gridType,
          key: 'layer-angle-axis'
        });
      }
    }, {
      key: 'renderRadiusAxis',
      value: function renderRadiusAxis(radiusAxis, radiusAxisCfg, cx, cy) {
        if (!radiusAxis || radiusAxis.props.hide) {
          return null;
        }
  
        var startAngle = this.props.startAngle;
  
        return _react2.default.cloneElement(radiusAxis, {
          angle: radiusAxis.props.angle || startAngle,
          ticks: this.getRadiusTicks(radiusAxisCfg),
          cx: cx, cy: cy
        });
      }
    }, {
      key: 'renderTooltip',
      value: function renderTooltip() {
        var children = this.props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem) {
          return null;
        }
  
        var _props5 = this.props;
        var width = _props5.width;
        var height = _props5.height;
        var _state = this.state;
        var isTooltipActive = _state.isTooltipActive;
        var activeTooltipLabel = _state.activeTooltipLabel;
        var activeTooltipCoord = _state.activeTooltipCoord;
        var activeTooltipPayload = _state.activeTooltipPayload;
  
        var viewBox = { x: 0, y: 0, width: width, height: height };
  
        return _react2.default.cloneElement(tooltipItem, {
          viewBox: viewBox,
          active: isTooltipActive,
          label: activeTooltipLabel,
          payload: activeTooltipPayload,
          coordinate: activeTooltipCoord
        });
      }
  
      /**
       * Draw legend
       * @param  {Array} items             The instances of item
       * @return {ReactElement}            The instance of Legend
       */
  
    }, {
      key: 'renderLegend',
      value: function renderLegend(items) {
        var children = this.props.children;
  
        var legendItem = (0, _ReactUtils.findChildByType)(children, _Legend2.default);
        if (!legendItem) {
          return null;
        }
  
        var _props6 = this.props;
        var width = _props6.width;
        var height = _props6.height;
        var margin = _props6.margin;
  
        var legendData = legendItem.props && legendItem.props.payload || items.map(function (child) {
          var _child$props = child.props;
          var dataKey = _child$props.dataKey;
          var name = _child$props.name;
          var legendType = _child$props.legendType;
  
          return {
            dataKey: dataKey,
            type: legendType || 'square',
            color: child.props.stroke || child.props.fill,
            value: name || dataKey
          };
        }, this);
  
        return _react2.default.cloneElement(legendItem, _extends({}, _Legend2.default.getWithHeight(legendItem, width, height), {
          payload: legendData,
          chartWidth: width,
          chartHeight: height,
          margin: margin
        }));
      }
    }, {
      key: 'render',
      value: function render() {
        if (!(0, _ReactUtils.validateWidthHeight)(this)) {
          return null;
        }
        var _props7 = this.props;
        var className = _props7.className;
        var data = _props7.data;
        var width = _props7.width;
        var height = _props7.height;
        var margin = _props7.margin;
        var children = _props7.children;
        var style = _props7.style;
  
        var others = _objectWithoutProperties(_props7, ['className', 'data', 'width', 'height', 'margin', 'children', 'style']);
  
        var cx = (0, _DataUtils.getPercentValue)(this.props.cx, width, width / 2);
        var cy = (0, _DataUtils.getPercentValue)(this.props.cy, height, height / 2);
        var maxRadius = (0, _PolarUtils.getMaxRadius)(width, height, margin);
        var innerRadius = (0, _DataUtils.getPercentValue)(this.props.innerRadius, maxRadius, 0);
        var outerRadius = (0, _DataUtils.getPercentValue)(this.props.outerRadius, maxRadius, maxRadius * 0.8);
  
        if (outerRadius <= 0 || !data || !data.length) {
          return null;
        }
  
        var items = (0, _ReactUtils.findAllByType)(children, _Radar2.default);
        var radiusAxis = (0, _ReactUtils.findChildByType)(children, _PolarRadiusAxis2.default);
        var radiusAxisCfg = this.getRadiusAxisCfg(radiusAxis, innerRadius, outerRadius);
        var attrs = (0, _ReactUtils.getPresentationAttributes)(others);
  
        return _react2.default.createElement('div', {
          className: (0, _classnames2.default)('recharts-wrapper', className),
          style: _extends({}, style, { position: 'relative', cursor: 'default', width: width, height: height })
        }, _react2.default.createElement(_Surface2.default, _extends({}, attrs, { width: width, height: height }), this.renderGrid(radiusAxisCfg, cx, cy, innerRadius, outerRadius), this.renderRadiusAxis(radiusAxis, radiusAxisCfg, cx, cy), this.renderAngleAxis(cx, cy, outerRadius, maxRadius), this.renderRadars(items, radiusAxisCfg.scale, cx, cy, innerRadius, outerRadius), (0, _ReactUtils.filterSvgElements)(children)), this.renderLegend(items), this.renderTooltip());
      }
    }]);
  
    return RadarChart;
  }(_react.Component), _class2.displayName = 'RadarChart', _class2.propTypes = {
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    margin: _react.PropTypes.shape({
      top: _react.PropTypes.number,
      right: _react.PropTypes.number,
      bottom: _react.PropTypes.number,
      left: _react.PropTypes.number
    }),
  
    cx: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    cy: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    startAngle: _react.PropTypes.number,
    innerRadius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    outerRadius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    clockWise: _react.PropTypes.bool,
  
    data: _react.PropTypes.array,
    style: _react.PropTypes.object,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
    className: _react.PropTypes.string,
    animationId: _react.PropTypes.number,
  
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func
  }, _class2.defaultProps = {
    width: 0,
    height: 0,
    cx: '50%',
    cy: '50%',
    innerRadius: 0,
    outerRadius: '80%',
  
    startAngle: 90,
    clockWise: true,
    data: [],
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  }, _temp2)) || _class) || _class;
  
  exports.default = RadarChart;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _isNumber2 = __webpack_require__(61);
  
  var _isNumber3 = _interopRequireDefault(_isNumber2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Scatter Chart
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _d3Scale = __webpack_require__(110);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Cell = __webpack_require__(86);
  
  var _Cell2 = _interopRequireDefault(_Cell);
  
  var _Legend = __webpack_require__(66);
  
  var _Legend2 = _interopRequireDefault(_Legend);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Cross = __webpack_require__(98);
  
  var _Cross2 = _interopRequireDefault(_Cross);
  
  var _CartesianAxis = __webpack_require__(115);
  
  var _CartesianAxis2 = _interopRequireDefault(_CartesianAxis);
  
  var _CartesianGrid = __webpack_require__(116);
  
  var _CartesianGrid2 = _interopRequireDefault(_CartesianGrid);
  
  var _Scatter = __webpack_require__(120);
  
  var _Scatter2 = _interopRequireDefault(_Scatter);
  
  var _XAxis = __webpack_require__(121);
  
  var _XAxis2 = _interopRequireDefault(_XAxis);
  
  var _YAxis = __webpack_require__(122);
  
  var _YAxis2 = _interopRequireDefault(_YAxis);
  
  var _ZAxis = __webpack_require__(123);
  
  var _ZAxis2 = _interopRequireDefault(_ZAxis);
  
  var _ReferenceLine = __webpack_require__(111);
  
  var _ReferenceLine2 = _interopRequireDefault(_ReferenceLine);
  
  var _ReferenceDot = __webpack_require__(113);
  
  var _ReferenceDot2 = _interopRequireDefault(_ReferenceDot);
  
  var _ReferenceArea = __webpack_require__(114);
  
  var _ReferenceArea2 = _interopRequireDefault(_ReferenceArea);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _DataUtils = __webpack_require__(84);
  
  var _LogUtils = __webpack_require__(85);
  
  var _CartesianUtils = __webpack_require__(127);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var ScatterChart = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(ScatterChart, _Component);
  
    function ScatterChart() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, ScatterChart);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ScatterChart.__proto__ || (0, _getPrototypeOf2.default)(ScatterChart)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        activeTooltipCoord: { x: 0, y: 0 },
        isTooltipActive: false,
        activeItem: null
      }, _this.handleScatterMouseEnter = function (el, e) {
        _this.setState({
          isTooltipActive: true,
          activeItem: el,
          activeTooltipCoord: { x: el.cx, y: el.cy }
        });
      }, _this.handleScatterMouseLeave = function () {
        _this.setState({
          isTooltipActive: false
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(ScatterChart, [{
      key: 'getComposedData',
  
      /**
       * Compose the data of each group
       * @param  {Object} item        An instance of Scatter
       * @param  {Array}  data        The original data
       * @param  {Object} xAxis       The configuration of x-axis
       * @param  {Object} yAxis       The configuration of y-axis
       * @param  {Object} zAxis       The configuration of z-axis
       * @return {Array} Composed data
       */
      value: function getComposedData(item, data, xAxis, yAxis, zAxis) {
        var children = item.props.children;
  
        var xAxisDataKey = xAxis.dataKey;
        var yAxisDataKey = yAxis.dataKey;
        var zAxisDataKey = zAxis.dataKey;
        var cells = (0, _ReactUtils.findAllByType)(children, _Cell2.default);
  
        return data.map(function (entry, index) {
          return _extends({}, entry, {
            cx: (0, _isNumber3.default)(entry[xAxisDataKey]) ? xAxis.scale(entry[xAxisDataKey]) : null,
            cy: (0, _isNumber3.default)(entry[yAxisDataKey]) ? yAxis.scale(entry[yAxisDataKey]) : null,
            size: zAxisDataKey !== undefined && (0, _isNumber3.default)(entry[zAxisDataKey]) ? zAxis.scale(entry[zAxisDataKey]) : zAxis.range[0],
            payload: {
              x: entry[xAxisDataKey],
              y: entry[yAxisDataKey],
              z: zAxisDataKey !== undefined && entry[zAxisDataKey] || '-'
            }
          }, cells && cells[index] && cells[index].props);
        });
      }
    }, {
      key: 'getDomain',
      value: function getDomain(items, dataKey, axisId, axisType) {
        var domain = items.reduce(function (result, item) {
          return result.concat(item.props.data.map(function (entry) {
            return entry[dataKey];
          }));
        }, []);
  
        if (axisType === 'xAxis' || axisType === 'yAxis') {
          domain = (0, _CartesianUtils.detectReferenceElementsDomain)(this.props.children, domain, axisId, axisType);
        }
  
        return [Math.min.apply(null, domain), Math.max.apply(null, domain)];
      }
  
      /**
       * Get the configuration of x-axis or y-axis
       * @param  {String} axisType The type of axis
       * @param  {Array} items     The instances of item
       * @return {Object}          Configuration
       */
  
    }, {
      key: 'getAxis',
      value: function getAxis() {
        var axisType = arguments.length <= 0 || arguments[0] === undefined ? 'xAxis' : arguments[0];
        var items = arguments[1];
        var children = this.props.children;
  
        var Axis = axisType === 'xAxis' ? _XAxis2.default : _YAxis2.default;
        var axis = (0, _ReactUtils.findChildByType)(children, Axis);
  
        (0, _LogUtils.warn)(axis, 'recharts: ScatterChart must has %s', Axis.displayName);
  
        if (axis) {
          var domain = (0, _DataUtils.parseSpecifiedDomain)(axis.props.domain, this.getDomain(items, axis.props.dataKey, axis.props[axisType + 'Id'], axisType), axis.props.allowDataOverflow);
  
          return _extends({}, axis.props, {
            axisType: axisType,
            domain: domain,
            type: 'number',
            originalDomain: axis.props.domain
          });
        }
  
        return null;
      }
  
      /**
       * Get the configuration of z-axis
       * @param  {Array} items The instances of item
       * @return {Object}      Configuration
       */
  
    }, {
      key: 'getZAxis',
      value: function getZAxis(items) {
        var children = this.props.children;
  
        var axisItem = (0, _ReactUtils.findChildByType)(children, _ZAxis2.default);
        var axisProps = axisItem && axisItem.props || _ZAxis2.default.defaultProps;
        var domain = axisProps.dataKey ? this.getDomain(items, axisProps.dataKey) : [-1, 1];
  
        return _extends({}, axisProps, {
          domain: domain,
          scale: (0, _d3Scale.scaleLinear)().domain(domain).range(axisProps.range)
        });
      }
    }, {
      key: 'getOffset',
      value: function getOffset(items, xAxis, yAxis) {
        var _props = this.props;
        var children = _props.children;
        var width = _props.width;
        var height = _props.height;
        var margin = _props.margin;
  
        var offset = _extends({}, margin);
        var legendProps = (0, _CartesianUtils.getLegendProps)(children, items, width, height);
  
        offset[xAxis.orientation] += xAxis.height;
        offset[yAxis.orientation] += yAxis.width;
  
        if (legendProps) {
          var box = _Legend2.default.getLegendBBox(legendProps, width, height) || {};
          if (legendProps.layout === 'horizontal' && (0, _isNumber3.default)(offset[legendProps.verticalAlign])) {
            offset[legendProps.verticalAlign] += box.height || 0;
          } else if (legendProps.layout === 'vertical' && (0, _isNumber3.default)(offset[legendProps.align])) {
            offset[legendProps.align] += box.width || 0;
          }
        }
  
        return _extends({}, offset, {
          width: width - offset.left - offset.right,
          height: height - offset.top - offset.bottom
        });
      }
      /**
       * Calculate the scale function, position, width, height of axes
       * @param  {Object} axis     The configuration of axis
       * @param  {Object} offset   The offset of main part in the svg element
       * @param  {Object} axisType The type of axis, x-axis or y-axis
       * @return {Object} Configuration
       */
  
    }, {
      key: 'getFormatAxis',
      value: function getFormatAxis(axis, offset, axisType) {
        var orientation = axis.orientation;
        var domain = axis.domain;
        var tickFormat = axis.tickFormat;
        var _axis$padding = axis.padding;
        var padding = _axis$padding === undefined ? {} : _axis$padding;
  
        var range = axisType === 'xAxis' ? [offset.left + (padding.left || 0), offset.left + offset.width - (padding.right || 0)] : [offset.top + offset.height - (padding.bottom || 0), offset.top + (padding.top || 0)];
  
        var scale = (0, _d3Scale.scaleLinear)().domain(domain).range(range);
  
        var ticks = (0, _CartesianUtils.getTicksOfScale)(scale, axis);
  
        if (tickFormat) {
          scale.tickFormat(tickFormat);
        }
  
        var x = void 0;
        var y = void 0;
  
        if (axisType === 'xAxis') {
          x = offset.left;
          y = orientation === 'top' ? offset.top - axis.height : offset.top + offset.height;
        } else {
          x = orientation === 'left' ? offset.left - axis.width : offset.right;
          y = offset.top;
        }
  
        return _extends({}, axis, ticks, {
          scale: scale,
          width: axisType === 'xAxis' ? offset.width : axis.width,
          height: axisType === 'yAxis' ? offset.height : axis.height,
          x: x, y: y
        });
      }
  
      /**
       * Get the content to be displayed in the tooltip
       * @param  {Object} data  The data of active item
       * @param  {Object} xAxis The configuration of x-axis
       * @param  {Object} yAxis The configuration of y-axis
       * @param  {Object} zAxis The configuration of z-axis
       * @return {Array}        The content of tooltip
       */
  
    }, {
      key: 'getTooltipContent',
      value: function getTooltipContent(data, xAxis, yAxis, zAxis) {
        if (!data) {
          return null;
        }
  
        var content = [{
          name: xAxis.name || xAxis.dataKey,
          unit: xAxis.unit || '',
          value: data.x
        }, {
          name: yAxis.name || yAxis.dataKey,
          unit: yAxis.unit || '',
          value: data.y
        }];
  
        if (data.z && data.z !== '-') {
          content.push({
            name: zAxis.name || zAxis.dataKey,
            unit: zAxis.unit || '',
            value: data.z
          });
        }
  
        return content;
      }
      /**
       * The handler of mouse entering a scatter
       * @param {Object} el The active scatter
       * @param {Object} e  Event object
       * @return {Object} no return
       */
  
      /**
       * The handler of mouse leaving a scatter
       * @return {Object} no return
       */
  
    }, {
      key: 'renderTooltip',
  
      /**
       * Draw Tooltip
       * @param  {Array} items   The instances of Scatter
       * @param  {Object} xAxis  The configuration of x-axis
       * @param  {Object} yAxis  The configuration of y-axis
       * @param  {Object} zAxis  The configuration of z-axis
       * @param  {Object} offset The offset of main part in the svg element
       * @return {ReactElement}  The instance of Tooltip
       */
      value: function renderTooltip(items, xAxis, yAxis, zAxis, offset) {
        var children = this.props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem || !tooltipItem.props.cursor || !this.state.isTooltipActive) {
          return null;
        }
  
        var _state = this.state;
        var isTooltipActive = _state.isTooltipActive;
        var activeItem = _state.activeItem;
        var activeTooltipCoord = _state.activeTooltipCoord;
  
        var viewBox = {
          x: offset.left,
          y: offset.top,
          width: offset.width,
          height: offset.height
        };
  
        return _react2.default.cloneElement(tooltipItem, {
          viewBox: viewBox,
          active: isTooltipActive,
          label: '',
          payload: this.getTooltipContent(activeItem && activeItem.payload, xAxis, yAxis, zAxis),
          coordinate: activeTooltipCoord
        });
      }
  
      /**
       * Draw grid
       * @param  {Object} xAxis  The configuration of x-axis
       * @param  {Object} yAxis  The configuration of y-axis
       * @param  {Object} offset The offset of main part in the svg element
       * @return {ReactElement} The instance of grid
       */
  
    }, {
      key: 'renderGrid',
      value: function renderGrid(xAxis, yAxis, offset) {
        var _props2 = this.props;
        var children = _props2.children;
        var width = _props2.width;
        var height = _props2.height;
  
        var gridItem = (0, _ReactUtils.findChildByType)(children, _CartesianGrid2.default);
  
        if (!gridItem) {
          return null;
        }
  
        var verticalPoints = (0, _CartesianUtils.getCoordinatesOfGrid)(_CartesianAxis2.default.getTicks(_extends({}, _CartesianAxis2.default.defaultProps, xAxis, {
          ticks: (0, _CartesianUtils.getTicksOfAxis)(xAxis, true),
          viewBox: { x: 0, y: 0, width: width, height: height }
        })), offset.left, offset.left + offset.width);
  
        var horizontalPoints = (0, _CartesianUtils.getCoordinatesOfGrid)(_CartesianAxis2.default.getTicks(_extends({}, _CartesianAxis2.default.defaultProps, yAxis, {
          ticks: (0, _CartesianUtils.getTicksOfAxis)(yAxis, true),
          viewBox: { x: 0, y: 0, width: width, height: height }
        })), offset.top, offset.top + offset.height);
  
        return _react2.default.cloneElement(gridItem, {
          key: 'grid',
          x: offset.left,
          y: offset.top,
          width: offset.width,
          height: offset.height,
          verticalPoints: verticalPoints,
          horizontalPoints: horizontalPoints
        });
      }
      /**
       * Draw legend
       * @param  {Array} items     The instances of Scatters
       * @return {ReactElement}    The instance of Legend
       */
  
    }, {
      key: 'renderLegend',
      value: function renderLegend(items) {
        var _props3 = this.props;
        var children = _props3.children;
        var width = _props3.width;
        var height = _props3.height;
        var margin = _props3.margin;
  
        var legendWidth = width - margin.left - margin.right;
        var legendHeight = height - margin.top - margin.bottom;
        var props = (0, _CartesianUtils.getLegendProps)(children, items, legendWidth, legendHeight);
  
        if (!props) {
          return null;
        }
  
        return _react2.default.createElement(_Legend2.default, _extends({}, props, {
          chartWidth: width,
          chartHeight: height,
          margin: margin
        }));
      }
  
      /**
       * Draw axis
       * @param {Object} axis     The configuration of axis
       * @param {String} layerKey The key of layer
       * @return {ReactElement}   The instance of axis
       */
  
    }, {
      key: 'renderAxis',
      value: function renderAxis(axis, layerKey) {
        var _props4 = this.props;
        var width = _props4.width;
        var height = _props4.height;
  
        if (axis && !axis.hide) {
          return _react2.default.createElement(_Layer2.default, { key: layerKey, className: layerKey }, _react2.default.createElement(_CartesianAxis2.default, _extends({}, axis, {
            viewBox: { x: 0, y: 0, width: width, height: height },
            ticks: (0, _CartesianUtils.getTicksOfAxis)(axis, true)
          })));
        }
  
        return null;
      }
    }, {
      key: 'renderCursor',
      value: function renderCursor(xAxis, yAxis, offset) {
        var children = this.props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem || !this.state.isTooltipActive) {
          return null;
        }
        var activeItem = this.state.activeItem;
  
        var cursorProps = _extends({
          fill: '#f1f1f1'
        }, (0, _ReactUtils.getPresentationAttributes)(tooltipItem.props.cursor), offset, {
          x: activeItem.cx,
          y: activeItem.cy,
          payload: activeItem
        });
  
        return _react2.default.isValidElement(tooltipItem.props.cursor) ? _react2.default.cloneElement(tooltipItem.props.cursor, cursorProps) : _react2.default.createElement(_Cross2.default, cursorProps);
      }
  
      /**
       * Draw the main part of scatter chart
       * @param  {Array} items   All the instance of Scatter
       * @param  {Object} xAxis  The configuration of all x-axis
       * @param  {Object} yAxis  The configuration of all y-axis
       * @param  {Object} zAxis  The configuration of all z-axis
       * @return {ReactComponent}  All the instances of Scatter
       */
  
    }, {
      key: 'renderItems',
      value: function renderItems(items, xAxis, yAxis, zAxis) {
        var _this2 = this;
  
        var activeGroupId = this.state.activeGroupId;
  
        return items.map(function (child, i) {
          var _child$props = child.props;
          var strokeWidth = _child$props.strokeWidth;
          var data = _child$props.data;
  
          var finalStrokeWidth = strokeWidth === +strokeWidth ? strokeWidth : 1;
          finalStrokeWidth = activeGroupId === 'scatter-' + i ? finalStrokeWidth + 2 : finalStrokeWidth;
  
          return _react2.default.cloneElement(child, {
            key: 'scatter-' + i,
            groupId: 'scatter-' + i,
            strokeWidth: finalStrokeWidth,
            onMouseLeave: _this2.handleScatterMouseLeave,
            onMouseEnter: _this2.handleScatterMouseEnter,
            points: _this2.getComposedData(child, data, xAxis, yAxis, zAxis)
          });
        }, this);
      }
    }, {
      key: 'renderReferenceElements',
      value: function renderReferenceElements(xAxis, yAxis, offset, isFront, Compt) {
        var children = this.props.children;
  
        var elements = (0, _ReactUtils.findAllByType)(children, Compt);
  
        if (!elements || !elements.length) {
          return null;
        }
  
        var keyPrefix = (0, _ReactUtils.getDisplayName)(Compt) + '-' + (isFront ? 'front' : 'back');
  
        return elements.filter(function (entry) {
          return isFront === entry.props.isFront;
        }).map(function (entry, i) {
          return _react2.default.cloneElement(entry, {
            key: keyPrefix + '-' + i,
            xAxis: xAxis, yAxis: yAxis,
            viewBox: {
              x: offset.left,
              y: offset.top,
              width: offset.width,
              height: offset.height
            }
          });
        });
      }
    }, {
      key: 'render',
      value: function render() {
        if (!(0, _ReactUtils.validateWidthHeight)(this)) {
          return null;
        }
  
        var _props5 = this.props;
        var style = _props5.style;
        var children = _props5.children;
        var className = _props5.className;
        var width = _props5.width;
        var height = _props5.height;
  
        var others = _objectWithoutProperties(_props5, ['style', 'children', 'className', 'width', 'height']);
  
        var items = (0, _ReactUtils.findAllByType)(children, _Scatter2.default);
        var zAxis = this.getZAxis(items);
        var xAxis = this.getAxis('xAxis', items);
        var yAxis = this.getAxis('yAxis', items);
  
        var offset = this.getOffset(items, xAxis, yAxis);
        xAxis = this.getFormatAxis(xAxis, offset, 'xAxis');
        yAxis = this.getFormatAxis(yAxis, offset, 'yAxis');
        var events = (0, _ReactUtils.filterEventAttributes)(this.props);
        var attrs = (0, _ReactUtils.getPresentationAttributes)(others);
  
        return _react2.default.createElement('div', _extends({
          className: (0, _classnames2.default)('recharts-wrapper', className),
          style: { position: 'relative', cursor: 'default', width: width, height: height }
        }, events), _react2.default.createElement(_Surface2.default, _extends({}, attrs, { width: width, height: height }), this.renderGrid(xAxis, yAxis, offset), this.renderReferenceElements(xAxis, yAxis, offset, false, _ReferenceArea2.default), this.renderReferenceElements(xAxis, yAxis, offset, false, _ReferenceLine2.default), this.renderReferenceElements(xAxis, yAxis, offset, false, _ReferenceDot2.default), this.renderAxis(xAxis, 'recharts-x-axis'), this.renderAxis(yAxis, 'recharts-y-axis'), this.renderCursor(xAxis, yAxis, offset), this.renderItems(items, xAxis, yAxis, zAxis, offset), this.renderReferenceElements(xAxis, yAxis, offset, true, _ReferenceArea2.default), this.renderReferenceElements(xAxis, yAxis, offset, true, _ReferenceLine2.default), this.renderReferenceElements(xAxis, yAxis, offset, true, _ReferenceDot2.default), (0, _ReactUtils.filterSvgElements)(children)), this.renderLegend(items), this.renderTooltip(items, xAxis, yAxis, zAxis, offset));
      }
    }]);
  
    return ScatterChart;
  }(_react.Component), _class2.displayName = 'ScatterChart', _class2.propTypes = {
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    margin: _react.PropTypes.shape({
      top: _react.PropTypes.number,
      right: _react.PropTypes.number,
      bottom: _react.PropTypes.number,
      left: _react.PropTypes.number
    }),
    title: _react.PropTypes.string,
    style: _react.PropTypes.object,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
    className: _react.PropTypes.string
  }, _class2.defaultProps = {
    style: {},
    margin: { top: 5, right: 5, bottom: 5, left: 5 }
  }, _temp2)) || _class;
  
  exports.default = ScatterChart;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _from = __webpack_require__(78);
  
  var _from2 = _interopRequireDefault2(_from);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AreaChart = undefined;
  
  var _isFunction2 = __webpack_require__(63);
  
  var _isFunction3 = _interopRequireDefault(_isFunction2);
  
  var _isNil2 = __webpack_require__(125);
  
  var _isNil3 = _interopRequireDefault(_isNil2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Area Chart
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _Curve = __webpack_require__(93);
  
  var _Curve2 = _interopRequireDefault(_Curve);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _CartesianUtils = __webpack_require__(127);
  
  var _generateCategoricalChart = __webpack_require__(126);
  
  var _generateCategoricalChart2 = _interopRequireDefault(_generateCategoricalChart);
  
  var _Area = __webpack_require__(118);
  
  var _Area2 = _interopRequireDefault(_Area);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _DataUtils = __webpack_require__(84);
  
  var _reactSmooth = __webpack_require__(81);
  
  var _reactSmooth2 = _interopRequireDefault(_reactSmooth);
  
  var _AnimationDecorator = __webpack_require__(104);
  
  var _AnimationDecorator2 = _interopRequireDefault(_AnimationDecorator);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    } else {
      return (0, _from2.default)(arr);
    }
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var AreaChart = (0, _AnimationDecorator2.default)(_class = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(AreaChart, _Component);
  
    function AreaChart() {
      _classCallCheck(this, AreaChart);
  
      return _possibleConstructorReturn(this, (AreaChart.__proto__ || (0, _getPrototypeOf2.default)(AreaChart)).apply(this, arguments));
    }
  
    _createClass(AreaChart, [{
      key: 'getComposedData',
  
      /**
       * Compose the data of each area
       * @param  {Object} xAxis       The configuration of x-axis
       * @param  {Object} yAxis       The configuration of y-axis
       * @param  {String} dataKey     The unique key of a group
       * @param  {Array}  stackedData If the area is stacked,
       * the stackedData is an array of min value and max value
       * @return {Array} Composed data
       */
      value: function getComposedData(xAxis, yAxis, dataKey, stackedData) {
        var _props = this.props;
        var layout = _props.layout;
        var dataStartIndex = _props.dataStartIndex;
        var dataEndIndex = _props.dataEndIndex;
  
        var data = this.props.data.slice(dataStartIndex, dataEndIndex + 1);
        var xTicks = (0, _CartesianUtils.getTicksOfAxis)(xAxis);
        var yTicks = (0, _CartesianUtils.getTicksOfAxis)(yAxis);
        var bandSize = (0, _DataUtils.getBandSizeOfScale)(layout === 'horizontal' ? xAxis.scale : yAxis.scale);
        var hasStack = stackedData && stackedData.length;
        var baseValue = this.getBaseValue(xAxis, yAxis);
  
        var points = data.map(function (entry, index) {
          var value = hasStack ? stackedData[dataStartIndex + index] : [baseValue, entry[dataKey]];
  
          if (layout === 'horizontal') {
            return {
              x: xTicks[index].coordinate + bandSize / 2,
              y: (0, _isNil3.default)(value[1]) ? null : yAxis.scale(value[1]),
              value: value
            };
          }
  
          return {
            x: (0, _isNil3.default)(value[1]) ? null : xAxis.scale(value[1]),
            y: yTicks[index].coordinate + bandSize / 2,
            value: value
          };
        });
  
        var baseLine = void 0;
        if (hasStack) {
          baseLine = stackedData.slice(dataStartIndex, dataEndIndex + 1).map(function (entry, index) {
            return {
              x: layout === 'horizontal' ? xTicks[index].coordinate + bandSize / 2 : xAxis.scale(entry[0]),
              y: layout === 'horizontal' ? yAxis.scale(entry[0]) : yTicks[index].coordinate + bandSize / 2
            };
          });
        } else if (layout === 'horizontal') {
          baseLine = yAxis.scale(baseValue);
        } else {
          baseLine = xAxis.scale(baseValue);
        }
  
        return { points: points, baseLine: baseLine, layout: layout };
      }
    }, {
      key: 'getBaseValue',
      value: function getBaseValue(xAxis, yAxis) {
        var layout = this.props.layout;
  
        var numberAxis = layout === 'horizontal' ? yAxis : xAxis;
        var domain = numberAxis.scale.domain();
  
        if (numberAxis.type === 'number') {
          var max = Math.max(domain[0], domain[1]);
          return max < 0 ? max : Math.max(Math.min(domain[0], domain[1]), 0);
        }
  
        return domain[0];
      }
    }, {
      key: 'renderCursor',
      value: function renderCursor(xAxisMap, yAxisMap, offset) {
        var _props2 = this.props;
        var children = _props2.children;
        var isTooltipActive = _props2.isTooltipActive;
        var layout = _props2.layout;
        var activeTooltipIndex = _props2.activeTooltipIndex;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem || !tooltipItem.props.cursor || !isTooltipActive || activeTooltipIndex < 0) {
          return null;
        }
  
        var axisMap = layout === 'horizontal' ? xAxisMap : yAxisMap;
        var axis = (0, _DataUtils.getAnyElementOfObject)(axisMap);
        var ticks = (0, _CartesianUtils.getTicksOfAxis)(axis);
  
        if (!ticks || !ticks[activeTooltipIndex]) {
          return null;
        }
  
        var start = ticks[activeTooltipIndex].coordinate;
        var x1 = layout === 'horizontal' ? start : offset.left;
        var y1 = layout === 'horizontal' ? offset.top : start;
        var x2 = layout === 'horizontal' ? start : offset.left + offset.width;
        var y2 = layout === 'horizontal' ? offset.top + offset.height : start;
        var cursorProps = _extends({
          stroke: '#ccc'
        }, (0, _ReactUtils.getPresentationAttributes)(tooltipItem.props.cursor), {
          points: [{ x: x1, y: y1 }, { x: x2, y: y2 }]
        });
  
        return _react2.default.isValidElement(tooltipItem.props.cursor) ? _react2.default.cloneElement(tooltipItem.props.cursor, cursorProps) : _react2.default.createElement(_Curve2.default, _extends({}, cursorProps, { type: 'linear', className: 'recharts-tooltip-cursor' }));
      }
    }, {
      key: 'renderActiveDot',
      value: function renderActiveDot(option, props) {
        var dot = void 0;
  
        if (_react2.default.isValidElement(option)) {
          dot = _react2.default.cloneElement(option, props);
        } else if ((0, _isFunction3.default)(option)) {
          dot = option(props);
        } else {
          dot = _react2.default.createElement(_Dot2.default, props);
        }
  
        return _react2.default.createElement(_reactSmooth2.default, {
          from: 'scale(0)',
          to: 'scale(1)',
          duration: 400,
          key: 'dot-' + props.dataKey,
          attributeName: 'transform'
        }, _react2.default.createElement(_Layer2.default, { style: { transformOrigin: 'center center' } }, dot));
      }
  
      /**
       * Draw the main part of area chart
       * @param  {Array} items     React elements of Area
       * @param  {Object} xAxisMap The configuration of all x-axis
       * @param  {Object} yAxisMap The configuration of all y-axis
       * @param  {Object} offset   The offset of main part in the svg element
       * @param  {Object} stackGroups The items grouped by axisId and stackId
       * @return {ReactComponent} The instances of Area
       */
  
    }, {
      key: 'renderItems',
      value: function renderItems(items, xAxisMap, yAxisMap, offset, stackGroups) {
        var _this2 = this;
  
        var _props3 = this.props;
        var children = _props3.children;
        var layout = _props3.layout;
        var isTooltipActive = _props3.isTooltipActive;
        var activeTooltipIndex = _props3.activeTooltipIndex;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
        var hasDot = tooltipItem && isTooltipActive;
        var dotItems = [];
        var animationId = this.props.animationId;
  
        var areaItems = items.reduce(function (result, child, i) {
          var _child$props = child.props;
          var xAxisId = _child$props.xAxisId;
          var yAxisId = _child$props.yAxisId;
          var dataKey = _child$props.dataKey;
          var fillOpacity = _child$props.fillOpacity;
          var fill = _child$props.fill;
          var activeDot = _child$props.activeDot;
  
          var numericAxisId = layout === 'horizontal' ? yAxisId : xAxisId;
          var stackedData = stackGroups && stackGroups[numericAxisId] && stackGroups[numericAxisId].hasStack && (0, _CartesianUtils.getStackedDataOfItem)(child, stackGroups[numericAxisId].stackGroups);
          var composeData = _this2.getComposedData(xAxisMap[xAxisId], yAxisMap[yAxisId], dataKey, stackedData);
          var activePoint = composeData.points && composeData.points[activeTooltipIndex];
  
          if (hasDot && activeDot && activePoint) {
            var dotProps = _extends({
              index: i,
              dataKey: dataKey,
              animationId: animationId,
              cx: activePoint.x, cy: activePoint.y, r: 4,
              fill: (0, _CartesianUtils.getMainColorOfGraphicItem)(child),
              strokeWidth: 2, stroke: '#fff'
            }, (0, _ReactUtils.getPresentationAttributes)(activeDot));
            dotItems.push(_react2.default.createElement(_Layer2.default, { key: 'dot-' + dataKey }, _this2.renderActiveDot(activeDot, dotProps)));
          }
  
          var area = _react2.default.cloneElement(child, _extends({
            key: 'area-' + i
          }, offset, composeData, {
            animationId: animationId,
            layout: layout
          }));
  
          return [].concat(_toConsumableArray(result), [area]);
        }, []);
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-area-chart-group' }, _react2.default.createElement(_Layer2.default, { className: 'recharts-area-chart-shapes' }, areaItems), _react2.default.createElement(_Layer2.default, { className: 'recharts-area-chart-dots' }, dotItems));
      }
    }, {
      key: 'render',
      value: function render() {
        var _props4 = this.props;
        var isComposed = _props4.isComposed;
        var graphicalItems = _props4.graphicalItems;
        var xAxisMap = _props4.xAxisMap;
        var yAxisMap = _props4.yAxisMap;
        var offset = _props4.offset;
        var stackGroups = _props4.stackGroups;
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-area-graphical' }, !isComposed && this.renderCursor(xAxisMap, yAxisMap, offset), this.renderItems(graphicalItems, xAxisMap, yAxisMap, offset, stackGroups));
      }
    }]);
  
    return AreaChart;
  }(_react.Component), _class2.displayName = 'AreaChart', _class2.propTypes = {
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    dataStartIndex: _react.PropTypes.number,
    dataEndIndex: _react.PropTypes.number,
    data: _react.PropTypes.array,
    isTooltipActive: _react.PropTypes.bool,
    activeTooltipIndex: _react.PropTypes.number,
    xAxisMap: _react.PropTypes.object,
    yAxisMap: _react.PropTypes.object,
    offset: _react.PropTypes.object,
    graphicalItems: _react.PropTypes.array,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
    stackGroups: _react.PropTypes.object,
    // used internally
    isComposed: _react.PropTypes.bool,
    animationId: _react.PropTypes.number
  }, _temp)) || _class) || _class;
  
  exports.default = (0, _generateCategoricalChart2.default)(AreaChart, _Area2.default);
  exports.AreaChart = AreaChart;

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty2 = __webpack_require__(59);
  
  var _defineProperty3 = _interopRequireDefault2(_defineProperty2);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _range2 = __webpack_require__(109);
  
  var _range3 = _interopRequireDefault(_range2);
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty3.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp2; /**
                                * @fileOverview Radar Bar Chart
                                */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _d3Scale = __webpack_require__(110);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _RadialBar = __webpack_require__(106);
  
  var _RadialBar2 = _interopRequireDefault(_RadialBar);
  
  var _DataUtils = __webpack_require__(84);
  
  var _Cell = __webpack_require__(86);
  
  var _Cell2 = _interopRequireDefault(_Cell);
  
  var _Legend = __webpack_require__(66);
  
  var _Legend2 = _interopRequireDefault(_Legend);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PolarUtils = __webpack_require__(92);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _AnimationDecorator = __webpack_require__(104);
  
  var _AnimationDecorator2 = _interopRequireDefault(_AnimationDecorator);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _objectWithoutProperties(obj, keys) {
    var target = {};for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
    }return target;
  }
  
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      (0, _defineProperty3.default)(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }return obj;
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var RadialBarChart = (0, _PureRender2.default)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(RadialBarChart, _Component);
  
    function RadialBarChart() {
      var _ref;
  
      var _temp, _this, _ret;
  
      _classCallCheck(this, RadialBarChart);
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RadialBarChart.__proto__ || (0, _getPrototypeOf2.default)(RadialBarChart)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.createDefaultState(), _this.handleMouseEnter = function (el, index, e) {
        var _this$props = _this.props;
        var children = _this$props.children;
        var onMouseEnter = _this$props.onMouseEnter;
        var cx = el.cx;
        var cy = el.cy;
        var endAngle = el.endAngle;
        var outerRadius = el.outerRadius;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          _this.setState({
            isTooltipActive: true,
            activeTooltipCoord: (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, endAngle),
            activeTooltipPayload: [el.payload]
          }, function () {
            if (onMouseEnter) {
              onMouseEnter(el, index, e);
            }
          });
        } else if (onMouseEnter) {
          onMouseEnter(el, index, e);
        }
      }, _this.handleMouseLeave = function (el, index, e) {
        var _this$props2 = _this.props;
        var children = _this$props2.children;
        var onMouseLeave = _this$props2.onMouseLeave;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (tooltipItem) {
          _this.setState({
            isTooltipActive: false
          }, function () {
            if (onMouseLeave) {
              onMouseLeave(el, index, e);
            }
          });
        } else if (onMouseLeave) {
          onMouseLeave(el, index, e);
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
  
    _createClass(RadialBarChart, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
          this.setState(this.createDefaultState());
        }
      }
      /**
       * Compose the data of each group
       * @param  {Object} item        An instance of RadialBar
       * @param  {Array}  barPosition The offset and size of each bar
       * @param  {Object} radiusScale The scale function of radius of bars
       * @param  {Object} center      The coordinate of center
       * @param  {String} dataKey     The unique key of a group
       * @return {Array}              Composed data
       */
  
    }, {
      key: 'getComposedData',
      value: function getComposedData(item, barPosition, radiusScale, center, dataKey) {
        var data = this.props.data;
  
        var pos = barPosition[dataKey];
        var cells = (0, _ReactUtils.findAllByType)(item.props.children, _Cell2.default);
  
        return data.map(function (entry, index) {
          var value = entry[dataKey];
          var radius = radiusScale(index);
  
          return _extends({}, entry, center, {
            value: value,
            innerRadius: radius - pos.offset,
            outerRadius: radius - pos.offset + pos.radius
          }, cells && cells[index] && cells[index].props);
        });
      }
      /**
       * Calculate the size of all groups
       * @param  {Array} items All the instance of RadialBar
       * @return {Object} The size of all groups
       */
  
    }, {
      key: 'getRadiusList',
      value: function getRadiusList(items) {
        var barSize = this.props.barSize;
  
        return items.map(function (child) {
          return _extends({}, child.props, {
            barSize: child.props.barSize || barSize
          });
        });
      }
  
      /**
       * Calculate the scale function of radius
       * @param {Number} innerRadius The outer radius
       * @param {Number} outerRadius The inner radius
       * @return {Object}            A scale function
       */
  
    }, {
      key: 'getRadiusScale',
      value: function getRadiusScale(innerRadius, outerRadius) {
        var data = this.props.data;
  
        var bandCount = Math.max(data.length, 1);
        var range = [outerRadius, innerRadius];
        var scale = (0, _d3Scale.scaleBand)().domain((0, _range3.default)(0, bandCount)).range(range);
  
        return scale;
      }
  
      /**
       * Calculate the size of each bar and the gap between two bars
       * @param  {Number} bandRadius  The radius of each category
       * @param  {Array} radiusList   The radius of all groups
       * @return {Number} The size of each bar and the gap between two bars
       */
  
    }, {
      key: 'getBarPosition',
      value: function getBarPosition(bandRadius, radiusList) {
        var _props = this.props;
        var barGap = _props.barGap;
        var barCategoryGap = _props.barCategoryGap;
  
        var len = radiusList.length;
        var result = void 0;
  
        // whether or not is barSize setted by user
        if (len && radiusList[0].barSize === +radiusList[0].barSize) {
          (function () {
            var sum = radiusList.reduce(function (res, entry) {
              return res + entry.barSize;
            }, 0);
            sum += (len - 1) * barGap;
            var offset = -sum / 2 >> 0;
            var prev = { offset: offset - barGap, radius: 0 };
  
            result = radiusList.reduce(function (res, entry) {
              prev = {
                offset: prev.offset + prev.radius + barGap,
                radius: entry.barSize
              };
  
              return _extends({}, res, _defineProperty({}, entry.dataKey, prev));
            }, {});
          })();
        } else {
          (function () {
            var offset = (0, _DataUtils.getPercentValue)(barCategoryGap, bandRadius);
            var radius = (bandRadius - 2 * offset - (len - 1) * barGap) / len >> 0;
            offset = -Math.max((radius * len + (len - 1) * barGap) / 2 >> 0, 0);
  
            result = radiusList.reduce(function (res, entry, i) {
              return _extends({}, res, _defineProperty({}, entry.dataKey, {
                offset: offset + (radius + barGap) * i,
                radius: radius
              }));
            }, {});
          })();
        }
  
        return result;
      }
      /**
       * Returns default, reset state for the radial bar chart.
       * @return {Object} Whole new state
       */
  
    }, {
      key: 'createDefaultState',
      value: function createDefaultState() {
        return {
          activeTooltipLabel: '',
          activeTooltipPayload: [],
          activeTooltipCoord: { x: 0, y: 0 },
          isTooltipActive: false
        };
      }
    }, {
      key: 'renderLegend',
  
      /**
       * Draw legend
       * @param  {ReactElement} legendItem The instance of Legend
       * @return {ReactElement}            The instance of Legend
       */
      value: function renderLegend() {
        var children = this.props.children;
  
        var legendItem = (0, _ReactUtils.findChildByType)(children, _Legend2.default);
        if (!legendItem) {
          return null;
        }
  
        var _props2 = this.props;
        var data = _props2.data;
        var width = _props2.width;
        var height = _props2.height;
        var margin = _props2.margin;
  
        var legendData = legendItem.props && legendItem.props.payload || data.map(function (entry) {
          return {
            type: 'square',
            color: entry.fill || '#000',
            value: entry.name
          };
        });
  
        return _react2.default.cloneElement(legendItem, _extends({}, _Legend2.default.getWithHeight(legendItem, width, height), {
          payload: legendData,
          chartWidth: width,
          chartHeight: height,
          margin: margin
        }));
      }
    }, {
      key: 'renderTooltip',
      value: function renderTooltip() {
        var children = this.props.children;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
  
        if (!tooltipItem) {
          return null;
        }
  
        var _props3 = this.props;
        var width = _props3.width;
        var height = _props3.height;
        var _state = this.state;
        var isTooltipActive = _state.isTooltipActive;
        var activeTooltipLabel = _state.activeTooltipLabel;
        var activeTooltipCoord = _state.activeTooltipCoord;
        var activeTooltipPayload = _state.activeTooltipPayload;
  
        var viewBox = { x: 0, y: 0, width: width, height: height };
  
        return _react2.default.cloneElement(tooltipItem, {
          viewBox: viewBox,
          active: isTooltipActive,
          label: activeTooltipLabel,
          payload: activeTooltipPayload,
          coordinate: activeTooltipCoord
        });
      }
  
      /**
       * Draw the main part of bar chart
       * @param  {Array} items     All the instance of RadialBar
       * @param  {Object} radiusScale The scale function of radius of bars
       * @param  {Object} center      The coordinate of center
       * @return {ReactComponent}  All the instances of RadialBar
       */
  
    }, {
      key: 'renderItems',
      value: function renderItems(items, radiusScale, center) {
        var _this2 = this;
  
        if (!items || !items.length) {
          return null;
        }
  
        var onClick = this.props.onClick;
  
        var radiusList = this.getRadiusList(items);
        var bandRadius = radiusScale.bandwidth();
        var barPosition = this.getBarPosition(bandRadius, radiusList);
  
        return items.map(function (child, i) {
          var dataKey = child.props.dataKey;
  
          return _react2.default.cloneElement(child, _extends({}, center, {
            key: 'radial-bar-' + i,
            onMouseEnter: _this2.handleMouseEnter,
            onMouseLeave: _this2.handleMouseLeave,
            onClick: onClick,
            data: _this2.getComposedData(child, barPosition, radiusScale, center, dataKey)
          }));
        }, this);
      }
    }, {
      key: 'render',
      value: function render() {
        var data = this.props.data;
  
        if (!(0, _ReactUtils.validateWidthHeight)(this) || !data || !data.length) {
          return null;
        }
  
        var _props4 = this.props;
        var style = _props4.style;
        var children = _props4.children;
        var className = _props4.className;
        var width = _props4.width;
        var height = _props4.height;
        var margin = _props4.margin;
  
        var others = _objectWithoutProperties(_props4, ['style', 'children', 'className', 'width', 'height', 'margin']);
  
        var items = (0, _ReactUtils.findAllByType)(children, _RadialBar2.default);
        var cx = (0, _DataUtils.getPercentValue)(this.props.cx, width, width / 2);
        var cy = (0, _DataUtils.getPercentValue)(this.props.cy, height, height / 2);
        var maxRadius = (0, _PolarUtils.getMaxRadius)(width, height, margin);
        var innerRadius = (0, _DataUtils.getPercentValue)(this.props.innerRadius, maxRadius, 0);
        var outerRadius = (0, _DataUtils.getPercentValue)(this.props.outerRadius, maxRadius, maxRadius * 0.8);
        var radiusScale = this.getRadiusScale(innerRadius, outerRadius);
        var attrs = (0, _ReactUtils.getPresentationAttributes)(others);
  
        return _react2.default.createElement('div', {
          className: (0, _classnames2.default)('recharts-wrapper', className),
          style: _extends({}, style, { cursor: 'default', position: 'relative', width: width, height: height })
        }, _react2.default.createElement(_Surface2.default, _extends({}, attrs, { width: width, height: height }), this.renderItems(items, radiusScale, { cx: cx, cy: cy }), (0, _ReactUtils.filterSvgElements)(children)), this.renderLegend(), this.renderTooltip(items));
      }
    }]);
  
    return RadialBarChart;
  }(_react.Component), _class2.displayName = 'RadialBarChart', _class2.propTypes = {
    width: _react.PropTypes.number,
    height: _react.PropTypes.number,
    margin: _react.PropTypes.shape({
      top: _react.PropTypes.number,
      right: _react.PropTypes.number,
      bottom: _react.PropTypes.number,
      left: _react.PropTypes.number
    }),
    cy: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    cx: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  
    data: _react.PropTypes.array,
    innerRadius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    outerRadius: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    // The offset radius between two categorys
    barCategoryGap: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    // The gap radius of two radial bar in one category
    barGap: _react.PropTypes.number,
    // The radius of each radial bar
    barSize: _react.PropTypes.number,
    title: _react.PropTypes.string,
    style: _react.PropTypes.object,
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onClick: _react.PropTypes.func,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node]),
    className: _react.PropTypes.string
  }, _class2.defaultProps = {
    cx: '50%',
    cy: '50%',
    innerRadius: '30%',
    outerRadius: '90%',
    barGap: 2,
    barCategoryGap: '10%',
    style: {},
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  }, _temp2)) || _class;
  
  exports.default = RadialBarChart;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

  'use strict';
  
  var _getPrototypeOf = __webpack_require__(29);
  
  var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);
  
  var _setPrototypeOf = __webpack_require__(54);
  
  var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);
  
  var _create = __webpack_require__(67);
  
  var _create2 = _interopRequireDefault2(_create);
  
  var _typeof2 = __webpack_require__(68);
  
  var _typeof3 = _interopRequireDefault2(_typeof2);
  
  var _defineProperty = __webpack_require__(59);
  
  var _defineProperty2 = _interopRequireDefault2(_defineProperty);
  
  var _assign = __webpack_require__(23);
  
  var _assign2 = _interopRequireDefault2(_assign);
  
  function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };
  
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();
  
  var _class, _class2, _temp; /**
                               * @fileOverview Composed Chart
                               */
  
  var _react = __webpack_require__(11);
  
  var _react2 = _interopRequireDefault(_react);
  
  var _classnames = __webpack_require__(46);
  
  var _classnames2 = _interopRequireDefault(_classnames);
  
  var _Surface = __webpack_require__(56);
  
  var _Surface2 = _interopRequireDefault(_Surface);
  
  var _Layer = __webpack_require__(65);
  
  var _Layer2 = _interopRequireDefault(_Layer);
  
  var _Tooltip = __webpack_require__(79);
  
  var _Tooltip2 = _interopRequireDefault(_Tooltip);
  
  var _Line = __webpack_require__(117);
  
  var _Line2 = _interopRequireDefault(_Line);
  
  var _Bar = __webpack_require__(119);
  
  var _Bar2 = _interopRequireDefault(_Bar);
  
  var _Area = __webpack_require__(118);
  
  var _Area2 = _interopRequireDefault(_Area);
  
  var _Curve = __webpack_require__(93);
  
  var _Curve2 = _interopRequireDefault(_Curve);
  
  var _Dot = __webpack_require__(97);
  
  var _Dot2 = _interopRequireDefault(_Dot);
  
  var _Rectangle = __webpack_require__(94);
  
  var _Rectangle2 = _interopRequireDefault(_Rectangle);
  
  var _generateCategoricalChart = __webpack_require__(126);
  
  var _generateCategoricalChart2 = _interopRequireDefault(_generateCategoricalChart);
  
  var _DataUtils = __webpack_require__(84);
  
  var _ReactUtils = __webpack_require__(57);
  
  var _PureRender = __webpack_require__(69);
  
  var _PureRender2 = _interopRequireDefault(_PureRender);
  
  var _CartesianUtils = __webpack_require__(127);
  
  var _AreaChart = __webpack_require__(139);
  
  var _LineChart = __webpack_require__(124);
  
  var _BarChart = __webpack_require__(131);
  
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }
  
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }
  
  var ComposedChart = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(ComposedChart, _Component);
  
    function ComposedChart() {
      _classCallCheck(this, ComposedChart);
  
      return _possibleConstructorReturn(this, (ComposedChart.__proto__ || (0, _getPrototypeOf2.default)(ComposedChart)).apply(this, arguments));
    }
  
    _createClass(ComposedChart, [{
      key: 'renderCursor',
      value: function renderCursor(xAxisMap, yAxisMap, offset) {
        var _props = this.props;
        var children = _props.children;
        var isTooltipActive = _props.isTooltipActive;
        var layout = _props.layout;
        var activeTooltipIndex = _props.activeTooltipIndex;
  
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip2.default);
        if (!tooltipItem || !tooltipItem.props.cursor || !isTooltipActive || activeTooltipIndex < 0) {
          return null;
        }
  
        var axisMap = layout === 'horizontal' ? xAxisMap : yAxisMap;
        var axis = (0, _DataUtils.getAnyElementOfObject)(axisMap);
        var ticks = (0, _CartesianUtils.getTicksOfAxis)(axis);
  
        if (!ticks || !ticks[activeTooltipIndex]) {
          return null;
        }
  
        var bandSize = (0, _DataUtils.getBandSizeOfScale)(axis.scale);
        var start = ticks[activeTooltipIndex].coordinate;
        var cursorProps = _extends({
          fill: '#f1f1f1'
        }, (0, _ReactUtils.getPresentationAttributes)(tooltipItem.props.cursor), {
          x: layout === 'horizontal' ? start : offset.left + 0.5,
          y: layout === 'horizontal' ? offset.top + 0.5 : start,
          width: layout === 'horizontal' ? bandSize : offset.width - 1,
          height: layout === 'horizontal' ? offset.height - 1 : bandSize
        });
  
        return _react2.default.isValidElement(tooltipItem.props.cursor) ? _react2.default.cloneElement(tooltipItem.props.cursor, cursorProps) : _react2.default.createElement(_Rectangle2.default, cursorProps);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props;
        var xAxisMap = _props2.xAxisMap;
        var yAxisMap = _props2.yAxisMap;
        var offset = _props2.offset;
        var graphicalItems = _props2.graphicalItems;
        var stackGroups = _props2.stackGroups;
  
        var areaItems = graphicalItems.filter(function (item) {
          return item.type.displayName === 'Area';
        });
        var lineItems = graphicalItems.filter(function (item) {
          return item.type.displayName === 'Line';
        });
        var barItems = graphicalItems.filter(function (item) {
          return item.type.displayName === 'Bar';
        });
  
        return _react2.default.createElement(_Layer2.default, { className: 'recharts-composed' }, this.renderCursor(xAxisMap, yAxisMap, offset), _react2.default.createElement(_AreaChart.AreaChart, _extends({}, this.props, { graphicalItems: areaItems, isComposed: true })), _react2.default.createElement(_BarChart.BarChart, _extends({}, this.props, { graphicalItems: barItems, isComposed: true })), _react2.default.createElement(_LineChart.LineChart, _extends({}, this.props, { graphicalItems: lineItems, isComposed: true })));
      }
    }]);
  
    return ComposedChart;
  }(_react.Component), _class2.displayName = 'ComposedChart', _class2.propTypes = {
    layout: _react.PropTypes.oneOf(['horizontal', 'vertical']),
    dataStartIndex: _react.PropTypes.number,
    dataEndIndex: _react.PropTypes.number,
    isTooltipActive: _react.PropTypes.bool,
    activeTooltipIndex: _react.PropTypes.number,
    xAxisMap: _react.PropTypes.object,
    yAxisMap: _react.PropTypes.object,
    offset: _react.PropTypes.object,
    graphicalItems: _react.PropTypes.array,
    stackGroups: _react.PropTypes.object,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node])
  }, _temp)) || _class;
  
  exports.default = (0, _generateCategoricalChart2.default)(ComposedChart, [_Line2.default, _Area2.default, _Bar2.default]);

/***/ }),
/* 142 */
/***/ (function(module, exports) {

  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var data = "<?xml version=\"1.0\"?>\n" + "<bobMonData>\n" + "<api>[\"10\"]</api>\n" + "<configHash>[\"06b0a12db5aae2aecc80902b64c9e836b5e756f9\"]</configHash>\n" + "<timeStamp>[\"Mon, 12 Feb 2018 03:33:40 +0000\",10]</timeStamp>\n" + "<netloads>[]</netloads>\n" + "<cpuBar>[[\"sstar117_u\",96],[\"sstar117_s\",2],[\"sstar117_w\",0],[\"sstar117_i\",2],[\"sstar116_u\",91],[\"sstar116_s\",2],[\"sstar116_w\",0],[\"sstar116_i\",7],[\"sstar115_u\",0],[\"sstar115_s\",0],[\"sstar115_w\",0],[\"sstar115_i\",100],[\"sstar114_u\",0],[\"sstar114_s\",0],[\"sstar114_w\",0],[\"sstar114_i\",100],[\"sstar113_u\",0],[\"sstar113_s\",0],[\"sstar113_w\",0],[\"sstar113_i\",100],[\"sstar112_u\",0],[\"sstar112_s\",0],[\"sstar112_w\",0],[\"sstar112_i\",100],[\"sstar111_u\",87],[\"sstar111_s\",0],[\"sstar111_w\",0],[\"sstar111_i\",13],[\"sstar110_u\",0],[\"sstar110_s\",0],[\"sstar110_w\",0],[\"sstar110_i\",100],[\"sstar119_u\",96],[\"sstar119_s\",3],[\"sstar119_w\",0],[\"sstar119_i\",1],[\"sstar118_u\",97],[\"sstar118_s\",2],[\"sstar118_w\",0],[\"sstar118_i\",1],[\"gstar029_u\",10],[\"gstar029_s\",6],[\"gstar029_w\",0],[\"gstar029_i\",84],[\"gstar028_u\",5],[\"gstar028_s\",3],[\"gstar028_w\",0],[\"gstar028_i\",92],[\"gstar023_u\",9],[\"gstar023_s\",7],[\"gstar023_w\",0],[\"gstar023_i\",84],[\"gstar022_u\",77],[\"gstar022_s\",0],[\"gstar022_w\",0],[\"gstar022_i\",23],[\"gstar021_u\",9],[\"gstar021_s\",7],[\"gstar021_w\",0],[\"gstar021_i\",84],[\"gstar020_u\",45],[\"gstar020_s\",0],[\"gstar020_w\",0],[\"gstar020_i\",55],[\"gstar027_u\",9],[\"gstar027_s\",7],[\"gstar027_w\",0],[\"gstar027_i\",84],[\"gstar026_u\",4],[\"gstar026_s\",3],[\"gstar026_w\",0],[\"gstar026_i\",93],[\"gstar025_u\",59],[\"gstar025_s\",0],[\"gstar025_w\",0],[\"gstar025_i\",41],[\"gstar024_u\",5],[\"gstar024_s\",3],[\"gstar024_w\",0],[\"gstar024_i\",92],[\"sstar128_u\",92],[\"sstar128_s\",1],[\"sstar128_w\",0],[\"sstar128_i\",7],[\"sstar129_u\",68],[\"sstar129_s\",0],[\"sstar129_w\",0],[\"sstar129_i\",32],[\"g2_u\",1],[\"g2_s\",0],[\"g2_w\",0],[\"g2_i\",99],[\"sstar122_u\",85],[\"sstar122_s\",2],[\"sstar122_w\",0],[\"sstar122_i\",13],[\"sstar123_u\",98],[\"sstar123_s\",1],[\"sstar123_w\",0],[\"sstar123_i\",1],[\"sstar120_u\",93],[\"sstar120_s\",0],[\"sstar120_w\",0],[\"sstar120_i\",7],[\"sstar121_u\",100],[\"sstar121_s\",0],[\"sstar121_w\",0],[\"sstar121_i\",0],[\"sstar126_u\",99],[\"sstar126_s\",0],[\"sstar126_w\",0],[\"sstar126_i\",1],[\"sstar127_u\",98],[\"sstar127_s\",1],[\"sstar127_w\",0],[\"sstar127_i\",1],[\"sstar124_u\",92],[\"sstar124_s\",1],[\"sstar124_w\",0],[\"sstar124_i\",7],[\"sstar125_u\",99],[\"sstar125_s\",0],[\"sstar125_w\",0],[\"sstar125_i\",1],[\"pbs_u\",0],[\"pbs_s\",0],[\"pbs_w\",0],[\"pbs_i\",100],[\"gstar053_u\",84],[\"gstar053_s\",7],[\"gstar053_w\",0],[\"gstar053_i\",9],[\"gstar018_u\",0],[\"gstar018_s\",0],[\"gstar018_w\",0],[\"gstar018_i\",100],[\"gstar019_u\",65],[\"gstar019_s\",0],[\"gstar019_w\",0],[\"gstar019_i\",35],[\"gstar016_u\",6],[\"gstar016_s\",0],[\"gstar016_w\",0],[\"gstar016_i\",94],[\"gstar017_u\",1],[\"gstar017_s\",0],[\"gstar017_w\",0],[\"gstar017_i\",99],[\"gstar014_u\",86],[\"gstar014_s\",0],[\"gstar014_w\",0],[\"gstar014_i\",14],[\"gstar015_u\",83],[\"gstar015_s\",0],[\"gstar015_w\",0],[\"gstar015_i\",17],[\"gstar012_u\",83],[\"gstar012_s\",0],[\"gstar012_w\",0],[\"gstar012_i\",17],[\"gstar013_u\",75],[\"gstar013_s\",0],[\"gstar013_w\",0],[\"gstar013_i\",25],[\"gstar011_u\",41],[\"gstar011_s\",0],[\"gstar011_w\",0],[\"gstar011_i\",59],[\"gstar050_u\",85],[\"gstar050_s\",6],[\"gstar050_w\",0],[\"gstar050_i\",9],[\"metadata01_u\",0],[\"metadata01_s\",0],[\"metadata01_w\",0],[\"metadata01_i\",100],[\"sstar138_u\",50],[\"sstar138_s\",0],[\"sstar138_w\",0],[\"sstar138_i\",50],[\"metadata02_u\",0],[\"metadata02_s\",0],[\"metadata02_w\",0],[\"metadata02_i\",100],[\"sstar135_u\",0],[\"sstar135_s\",0],[\"sstar135_w\",0],[\"sstar135_i\",100],[\"sstar134_u\",100],[\"sstar134_s\",0],[\"sstar134_w\",0],[\"sstar134_i\",0],[\"sstar137_u\",100],[\"sstar137_s\",0],[\"sstar137_w\",0],[\"sstar137_i\",0],[\"sstar136_u\",56],[\"sstar136_s\",0],[\"sstar136_w\",0],[\"sstar136_i\",44],[\"sstar131_u\",70],[\"sstar131_s\",0],[\"sstar131_w\",0],[\"sstar131_i\",30],[\"sstar130_u\",68],[\"sstar130_s\",0],[\"sstar130_w\",0],[\"sstar130_i\",32],[\"sstar133_u\",93],[\"sstar133_s\",0],[\"sstar133_w\",0],[\"sstar133_i\",7],[\"sstar132_u\",75],[\"sstar132_s\",0],[\"sstar132_w\",0],[\"sstar132_i\",25],[\"sstar152_u\",82],[\"sstar152_s\",1],[\"sstar152_w\",0],[\"sstar152_i\",17],[\"gstar001_u\",0],[\"gstar001_s\",0],[\"gstar001_w\",0],[\"gstar001_i\",100],[\"gstar002_u\",0],[\"gstar002_s\",0],[\"gstar002_w\",0],[\"gstar002_i\",100],[\"rm02_u\",0],[\"rm02_s\",0],[\"rm02_w\",0],[\"rm02_i\",100],[\"rm01_u\",0],[\"rm01_s\",0],[\"rm01_w\",0],[\"rm01_i\",100],[\"data-mover01_u\",0],[\"data-mover01_s\",0],[\"data-mover01_w\",0],[\"data-mover01_i\",100],[\"data-mover02_u\",0],[\"data-mover02_s\",0],[\"data-mover02_w\",0],[\"data-mover02_i\",100],[\"sstar204_u\",0],[\"sstar204_s\",0],[\"sstar204_w\",0],[\"sstar204_i\",100],[\"sstar203_u\",0],[\"sstar203_s\",0],[\"sstar203_w\",0],[\"sstar203_i\",100],[\"sstar202_u\",0],[\"sstar202_s\",0],[\"sstar202_w\",0],[\"sstar202_i\",100],[\"sstar201_u\",0],[\"sstar201_s\",0],[\"sstar201_w\",0],[\"sstar201_i\",100],[\"sstar301_u\",0],[\"sstar301_s\",0],[\"sstar301_w\",0],[\"sstar301_i\",100],[\"sstar148_u\",36],[\"sstar148_s\",28],[\"sstar148_w\",0],[\"sstar148_i\",36],[\"sstar149_u\",69],[\"sstar149_s\",0],[\"sstar149_w\",0],[\"sstar149_i\",31],[\"sstar025_u\",0],[\"sstar025_s\",0],[\"sstar025_w\",0],[\"sstar025_i\",100],[\"sstar024_u\",0],[\"sstar024_s\",0],[\"sstar024_w\",0],[\"sstar024_i\",100],[\"sstar023_u\",0],[\"sstar023_s\",0],[\"sstar023_w\",0],[\"sstar023_i\",100],[\"sstar022_u\",87],[\"sstar022_s\",0],[\"sstar022_w\",0],[\"sstar022_i\",13],[\"sstar021_u\",0],[\"sstar021_s\",0],[\"sstar021_w\",0],[\"sstar021_i\",100],[\"sstar020_u\",0],[\"sstar020_s\",0],[\"sstar020_w\",0],[\"sstar020_i\",100],[\"sstar140_u\",0],[\"sstar140_s\",0],[\"sstar140_w\",0],[\"sstar140_i\",100],[\"sstar141_u\",96],[\"sstar141_s\",0],[\"sstar141_w\",0],[\"sstar141_i\",4],[\"sstar142_u\",48],[\"sstar142_s\",0],[\"sstar142_w\",0],[\"sstar142_i\",52],[\"sstar143_u\",87],[\"sstar143_s\",0],[\"sstar143_w\",0],[\"sstar143_i\",13],[\"sstar144_u\",94],[\"sstar144_s\",0],[\"sstar144_w\",0],[\"sstar144_i\",6],[\"sstar145_u\",6],[\"sstar145_s\",0],[\"sstar145_w\",0],[\"sstar145_i\",94],[\"tao03_u\",10],[\"tao03_s\",5],[\"tao03_w\",1],[\"tao03_i\",84],[\"tao02_u\",0],[\"tao02_s\",0],[\"tao02_w\",0],[\"tao02_i\",100],[\"sstar027_u\",87],[\"sstar027_s\",0],[\"sstar027_w\",0],[\"sstar027_i\",13],[\"sstar026_u\",0],[\"sstar026_s\",0],[\"sstar026_w\",0],[\"sstar026_i\",100],[\"object102_u\",0],[\"object102_s\",0],[\"object102_w\",0],[\"object102_i\",100],[\"object101_u\",0],[\"object101_s\",0],[\"object101_w\",1],[\"object101_i\",99],[\"rsldap1_u\",0],[\"rsldap1_s\",0],[\"rsldap1_w\",0],[\"rsldap1_i\",100],[\"rsldap2_u\",0],[\"rsldap2_s\",0],[\"rsldap2_w\",0],[\"rsldap2_i\",100],[\"tapeserv01_u\",0],[\"tapeserv01_s\",0],[\"tapeserv01_w\",0],[\"tapeserv01_i\",100],[\"sstar018_u\",0],[\"sstar018_s\",0],[\"sstar018_w\",0],[\"sstar018_i\",100],[\"sstar019_u\",87],[\"sstar019_s\",0],[\"sstar019_w\",0],[\"sstar019_i\",13],[\"sstar012_u\",0],[\"sstar012_s\",0],[\"sstar012_w\",0],[\"sstar012_i\",100],[\"sstar013_u\",0],[\"sstar013_s\",0],[\"sstar013_w\",0],[\"sstar013_i\",100],[\"sstar011_u\",0],[\"sstar011_s\",0],[\"sstar011_w\",0],[\"sstar011_i\",100],[\"sstar016_u\",0],[\"sstar016_s\",0],[\"sstar016_w\",0],[\"sstar016_i\",100],[\"sstar017_u\",87],[\"sstar017_s\",0],[\"sstar017_w\",0],[\"sstar017_i\",13],[\"sstar014_u\",0],[\"sstar014_s\",0],[\"sstar014_w\",0],[\"sstar014_i\",100],[\"sstar015_u\",87],[\"sstar015_s\",0],[\"sstar015_w\",0],[\"sstar015_i\",13],[\"sstar159_u\",93],[\"sstar159_s\",0],[\"sstar159_w\",0],[\"sstar159_i\",7],[\"sstar158_u\",93],[\"sstar158_s\",0],[\"sstar158_w\",0],[\"sstar158_i\",7],[\"sstar153_u\",75],[\"sstar153_s\",0],[\"sstar153_w\",0],[\"sstar153_i\",25],[\"sstar139_u\",68],[\"sstar139_s\",0],[\"sstar139_w\",0],[\"sstar139_i\",32],[\"sstar151_u\",91],[\"sstar151_s\",0],[\"sstar151_w\",0],[\"sstar151_i\",9],[\"sstar150_u\",0],[\"sstar150_s\",0],[\"sstar150_w\",0],[\"sstar150_i\",100],[\"sstar157_u\",90],[\"sstar157_s\",0],[\"sstar157_w\",0],[\"sstar157_i\",10],[\"sstar156_u\",99],[\"sstar156_s\",0],[\"sstar156_w\",0],[\"sstar156_i\",1],[\"sstar155_u\",93],[\"sstar155_s\",0],[\"sstar155_w\",0],[\"sstar155_i\",7],[\"sstar154_u\",87],[\"sstar154_s\",0],[\"sstar154_w\",0],[\"sstar154_i\",13],[\"tao01_u\",0],[\"tao01_s\",0],[\"tao01_w\",1],[\"tao01_i\",99],[\"sstar146_u\",100],[\"sstar146_s\",0],[\"sstar146_w\",0],[\"sstar146_i\",0],[\"sstar028_u\",0],[\"sstar028_s\",0],[\"sstar028_w\",0],[\"sstar028_i\",100],[\"gstar104_u\",0],[\"gstar104_s\",0],[\"gstar104_w\",0],[\"gstar104_i\",100],[\"sstar001_u\",0],[\"sstar001_s\",0],[\"sstar001_w\",0],[\"sstar001_i\",100],[\"sstar003_u\",1],[\"sstar003_s\",1],[\"sstar003_w\",0],[\"sstar003_i\",98],[\"sstar002_u\",0],[\"sstar002_s\",0],[\"sstar002_w\",0],[\"sstar002_i\",100],[\"gstar101_u\",0],[\"gstar101_s\",0],[\"gstar101_w\",0],[\"gstar101_i\",100],[\"sstar166_u\",0],[\"sstar166_s\",0],[\"sstar166_w\",0],[\"sstar166_i\",100],[\"sstar164_u\",99],[\"sstar164_s\",0],[\"sstar164_w\",0],[\"sstar164_i\",1],[\"sstar165_u\",87],[\"sstar165_s\",0],[\"sstar165_w\",0],[\"sstar165_i\",13],[\"sstar162_u\",84],[\"sstar162_s\",2],[\"sstar162_w\",0],[\"sstar162_i\",14],[\"sstar163_u\",84],[\"sstar163_s\",2],[\"sstar163_w\",0],[\"sstar163_i\",14],[\"sstar160_u\",84],[\"sstar160_s\",2],[\"sstar160_w\",0],[\"sstar160_i\",14],[\"sstar161_u\",84],[\"sstar161_s\",2],[\"sstar161_w\",0],[\"sstar161_i\",14],[\"gstar058_u\",0],[\"gstar058_s\",0],[\"gstar058_w\",0],[\"gstar058_i\",100],[\"gstar103_u\",0],[\"gstar103_s\",0],[\"gstar103_w\",0],[\"gstar103_i\",100],[\"gstar052_u\",84],[\"gstar052_s\",7],[\"gstar052_w\",0],[\"gstar052_i\",9],[\"lnet02_u\",0],[\"lnet02_s\",0],[\"lnet02_w\",0],[\"lnet02_i\",100],[\"lnet01_u\",0],[\"lnet01_s\",0],[\"lnet01_w\",0],[\"lnet01_i\",100],[\"gstar051_u\",17],[\"gstar051_s\",7],[\"gstar051_w\",0],[\"gstar051_i\",76],[\"gstar056_u\",92],[\"gstar056_s\",7],[\"gstar056_w\",0],[\"gstar056_i\",1],[\"gstar057_u\",76],[\"gstar057_s\",7],[\"gstar057_w\",0],[\"gstar057_i\",17],[\"gstar054_u\",67],[\"gstar054_s\",7],[\"gstar054_w\",0],[\"gstar054_i\",26],[\"gstar055_u\",93],[\"gstar055_s\",6],[\"gstar055_w\",0],[\"gstar055_i\",1],[\"object12_u\",0],[\"object12_s\",0],[\"object12_w\",0],[\"object12_i\",100],[\"object10_u\",0],[\"object10_s\",0],[\"object10_w\",0],[\"object10_i\",100],[\"object11_u\",0],[\"object11_s\",0],[\"object11_w\",0],[\"object11_i\",100],[\"gstar049_u\",87],[\"gstar049_s\",12],[\"gstar049_w\",0],[\"gstar049_i\",1],[\"gstar048_u\",92],[\"gstar048_s\",7],[\"gstar048_w\",0],[\"gstar048_i\",1],[\"hpc-mgmt_u\",1],[\"hpc-mgmt_s\",1],[\"hpc-mgmt_w\",0],[\"hpc-mgmt_i\",98],[\"gstar045_u\",93],[\"gstar045_s\",6],[\"gstar045_w\",0],[\"gstar045_i\",1],[\"gstar044_u\",93],[\"gstar044_s\",7],[\"gstar044_w\",0],[\"gstar044_i\",0],[\"gstar047_u\",43],[\"gstar047_s\",6],[\"gstar047_w\",0],[\"gstar047_i\",51],[\"gstar046_u\",53],[\"gstar046_s\",6],[\"gstar046_w\",0],[\"gstar046_i\",41],[\"gstar041_u\",93],[\"gstar041_s\",6],[\"gstar041_w\",0],[\"gstar041_i\",1],[\"gstar040_u\",84],[\"gstar040_s\",7],[\"gstar040_w\",0],[\"gstar040_i\",9],[\"gstar043_u\",92],[\"gstar043_s\",7],[\"gstar043_w\",0],[\"gstar043_i\",1],[\"gstar042_u\",93],[\"gstar042_s\",6],[\"gstar042_w\",0],[\"gstar042_i\",1],[\"object09_u\",0],[\"object09_s\",0],[\"object09_w\",0],[\"object09_i\",100],[\"object08_u\",0],[\"object08_s\",0],[\"object08_w\",0],[\"object08_i\",100],[\"object05_u\",0],[\"object05_s\",0],[\"object05_w\",0],[\"object05_i\",100],[\"object04_u\",0],[\"object04_s\",0],[\"object04_w\",0],[\"object04_i\",100],[\"object07_u\",0],[\"object07_s\",2],[\"object07_w\",0],[\"object07_i\",98],[\"object06_u\",0],[\"object06_s\",0],[\"object06_w\",0],[\"object06_i\",100],[\"object01_u\",0],[\"object01_s\",0],[\"object01_w\",0],[\"object01_i\",100],[\"object03_u\",0],[\"object03_s\",0],[\"object03_w\",0],[\"object03_i\",100],[\"object02_u\",0],[\"object02_s\",8],[\"object02_w\",0],[\"object02_i\",92],[\"sstar104_u\",0],[\"sstar104_s\",0],[\"sstar104_w\",0],[\"sstar104_i\",100],[\"sstar105_u\",87],[\"sstar105_s\",0],[\"sstar105_w\",0],[\"sstar105_i\",13],[\"sstar106_u\",87],[\"sstar106_s\",0],[\"sstar106_w\",0],[\"sstar106_i\",13],[\"sstar107_u\",87],[\"sstar107_s\",0],[\"sstar107_w\",0],[\"sstar107_i\",13],[\"sstar101_u\",87],[\"sstar101_s\",0],[\"sstar101_w\",0],[\"sstar101_i\",13],[\"sstar102_u\",87],[\"sstar102_s\",0],[\"sstar102_w\",0],[\"sstar102_i\",13],[\"sstar103_u\",87],[\"sstar103_s\",0],[\"sstar103_w\",0],[\"sstar103_i\",13],[\"sstar108_u\",0],[\"sstar108_s\",0],[\"sstar108_w\",0],[\"sstar108_i\",100],[\"sstar109_u\",0],[\"sstar109_s\",0],[\"sstar109_w\",0],[\"sstar109_i\",100],[\"metadata101_u\",0],[\"metadata101_s\",0],[\"metadata101_w\",0],[\"metadata101_i\",100],[\"gstar038_u\",9],[\"gstar038_s\",6],[\"gstar038_w\",0],[\"gstar038_i\",85],[\"gstar039_u\",93],[\"gstar039_s\",7],[\"gstar039_w\",0],[\"gstar039_i\",0],[\"gstar036_u\",83],[\"gstar036_s\",7],[\"gstar036_w\",0],[\"gstar036_i\",10],[\"gstar030_u\",9],[\"gstar030_s\",7],[\"gstar030_w\",0],[\"gstar030_i\",84],[\"gstar031_u\",84],[\"gstar031_s\",7],[\"gstar031_w\",0],[\"gstar031_i\",9],[\"gstar032_u\",75],[\"gstar032_s\",8],[\"gstar032_w\",0],[\"gstar032_i\",17],[\"gstar033_u\",62],[\"gstar033_s\",4],[\"gstar033_w\",0],[\"gstar033_i\",34],[\"gstar034_u\",71],[\"gstar034_s\",3],[\"gstar034_w\",0],[\"gstar034_i\",26],[\"gstar035_u\",88],[\"gstar035_s\",3],[\"gstar035_w\",0],[\"gstar035_i\",9],[\"sstar147_u\",100],[\"sstar147_s\",0],[\"sstar147_w\",0],[\"sstar147_i\",0],[\"gstar037_u\",9],[\"gstar037_s\",6],[\"gstar037_w\",0],[\"gstar037_i\",85]]</cpuBar>\n" + "<gmondGroup>[[\"sstar117\",1],[\"sstar116\",1],[\"sstar115\",1],[\"sstar114\",1],[\"sstar113\",1],[\"sstar112\",1],[\"sstar111\",1],[\"sstar110\",1],[\"sstar119\",1],[\"sstar118\",1],[\"gstar029\",1],[\"gstar028\",1],[\"gstar023\",1],[\"gstar022\",1],[\"gstar021\",1],[\"gstar020\",1],[\"gstar027\",1],[\"gstar026\",1],[\"gstar025\",1],[\"gstar024\",1],[\"sstar128\",1],[\"sstar129\",1],[\"g2\",1],[\"sstar122\",1],[\"sstar123\",1],[\"sstar120\",1],[\"sstar121\",1],[\"sstar126\",1],[\"sstar127\",1],[\"sstar124\",1],[\"sstar125\",1],[\"pbs\",1],[\"gstar053\",1],[\"gstar018\",1],[\"gstar019\",1],[\"gstar016\",1],[\"gstar017\",1],[\"gstar014\",1],[\"gstar015\",1],[\"gstar012\",1],[\"gstar013\",1],[\"gstar011\",1],[\"gstar050\",1],[\"metadata01\",0],[\"sstar138\",1],[\"metadata02\",0],[\"sstar135\",1],[\"sstar134\",1],[\"sstar137\",1],[\"sstar136\",1],[\"sstar131\",1],[\"sstar130\",1],[\"sstar133\",1],[\"sstar132\",1],[\"sstar152\",1],[\"gstar001\",1],[\"gstar002\",1],[\"rm02\",1],[\"rm01\",1],[\"data-mover01\",1],[\"data-mover02\",1],[\"sstar204\",1],[\"sstar203\",1],[\"sstar202\",1],[\"sstar201\",1],[\"sstar301\",1],[\"sstar148\",1],[\"sstar149\",1],[\"sstar025\",1],[\"sstar024\",1],[\"sstar023\",1],[\"sstar022\",1],[\"sstar021\",1],[\"sstar020\",1],[\"sstar140\",1],[\"sstar141\",1],[\"sstar142\",1],[\"sstar143\",1],[\"sstar144\",1],[\"sstar145\",1],[\"tao03\",1],[\"tao02\",1],[\"sstar027\",1],[\"sstar026\",1],[\"object102\",1],[\"object101\",1],[\"rsldap1\",1],[\"rsldap2\",1],[\"tapeserv01\",1],[\"sstar018\",1],[\"sstar019\",1],[\"sstar012\",1],[\"sstar013\",1],[\"sstar011\",1],[\"sstar016\",1],[\"sstar017\",1],[\"sstar014\",1],[\"sstar015\",1],[\"sstar159\",1],[\"sstar158\",1],[\"sstar153\",1],[\"sstar139\",1],[\"sstar151\",1],[\"sstar150\",1],[\"sstar157\",1],[\"sstar156\",1],[\"sstar155\",1],[\"sstar154\",1],[\"tao01\",1],[\"sstar146\",1],[\"sstar028\",1],[\"gstar104\",1],[\"sstar001\",1],[\"sstar003\",1],[\"sstar002\",1],[\"gstar101\",1],[\"sstar166\",1],[\"sstar164\",1],[\"sstar165\",1],[\"sstar162\",1],[\"sstar163\",1],[\"sstar160\",1],[\"sstar161\",1],[\"gstar058\",1],[\"gstar103\",1],[\"gstar052\",1],[\"lnet02\",1],[\"lnet01\",1],[\"gstar051\",1],[\"gstar056\",1],[\"gstar057\",1],[\"gstar054\",1],[\"gstar055\",1],[\"object12\",0],[\"object10\",0],[\"object11\",0],[\"gstar049\",1],[\"gstar048\",1],[\"hpc-mgmt\",0],[\"gstar045\",1],[\"gstar044\",1],[\"gstar047\",1],[\"gstar046\",1],[\"gstar041\",1],[\"gstar040\",1],[\"gstar043\",1],[\"gstar042\",1],[\"object09\",0],[\"object08\",0],[\"object05\",0],[\"object04\",0],[\"object07\",0],[\"object06\",0],[\"object01\",0],[\"object03\",0],[\"object02\",0],[\"sstar104\",1],[\"sstar105\",1],[\"sstar106\",1],[\"sstar107\",1],[\"sstar101\",1],[\"sstar102\",1],[\"sstar103\",1],[\"sstar108\",1],[\"sstar109\",1],[\"metadata101\",1],[\"gstar038\",1],[\"gstar039\",1],[\"gstar036\",1],[\"gstar030\",1],[\"gstar031\",1],[\"gstar032\",1],[\"gstar033\",1],[\"gstar034\",1],[\"gstar035\",1],[\"sstar147\",1],[\"gstar037\",1]]</gmondGroup>\n" + "<mem>[[\"sstar117_m\",55,64531,0],[\"sstar116_m\",90,64526,0],[\"sstar115_m\",2,64531,0],[\"sstar114_m\",2,64526,0],[\"sstar113_m\",2,64531,0],[\"sstar112_m\",2,64531,0],[\"sstar111_m\",3,64526,0],[\"sstar110_m\",2,64531,0],[\"sstar119_m\",58,64526,0],[\"sstar118_m\",91,64531,0],[\"gstar029_m\",5,48389,0],[\"gstar028_m\",4,48389,0],[\"gstar023_m\",5,48389,0],[\"gstar022_m\",6,48389,0],[\"gstar021_m\",5,48389,0],[\"gstar020_m\",5,48389,0],[\"gstar027_m\",5,48389,0],[\"gstar026_m\",4,48389,0],[\"gstar025_m\",59,48389,0],[\"gstar024_m\",4,48389,0],[\"sstar128_m\",21,64531,0],[\"sstar129_m\",16,64531,0],[\"g2_m\",17,48257,0],[\"sstar122_m\",56,64531,0],[\"sstar123_m\",55,64531,0],[\"sstar120_m\",31,64526,0],[\"sstar121_m\",33,64531,0],[\"sstar126_m\",46,64526,0],[\"sstar127_m\",25,64526,0],[\"sstar124_m\",10,64531,0],[\"sstar125_m\",41,64526,0],[\"pbs_m\",13,24020,0],[\"gstar018_m\",3,48389,0],[\"gstar019_m\",62,48389,0],[\"gstar016_m\",13,48389,0],[\"gstar017_m\",14,48389,0],[\"gstar014_m\",13,48389,0],[\"gstar015_m\",13,48389,0],[\"gstar012_m\",10,48389,0],[\"gstar013_m\",13,48389,0],[\"gstar011_m\",53,48389,0],[\"metadata01_m\",42,290642,0],[\"sstar138_m\",7,64531,0],[\"metadata02_m\",1,72496,0],[\"sstar135_m\",2,64531,0],[\"sstar134_m\",7,64531,0],[\"sstar137_m\",49,64531,0],[\"sstar136_m\",3,64531,0],[\"sstar131_m\",8,64531,0],[\"sstar130_m\",42,64526,0],[\"sstar133_m\",3,64531,0],[\"sstar132_m\",3,64531,0],[\"gstar001_m\",5,48257,0],[\"gstar002_m\",5,48257,0],[\"rm02_m\",5,64444,0],[\"rm01_m\",5,64444,0],[\"data-mover01_m\",22,3791,0],[\"data-mover02_m\",12,7822,0],[\"sstar204_m\",0,484591,0],[\"sstar203_m\",0,452273,0],[\"sstar202_m\",0,516911,0],[\"sstar201_m\",0,516912,0],[\"sstar106_m\",3,64527,0],[\"sstar301_m\",1,258360,0],[\"sstar148_m\",10,64531,0],[\"sstar149_m\",9,64531,0],[\"sstar025_m\",9,64535,0],[\"sstar024_m\",9,64535,0],[\"sstar023_m\",9,64535,0],[\"sstar022_m\",9,64535,0],[\"sstar021_m\",9,64535,0],[\"sstar020_m\",8,64535,0],[\"sstar140_m\",2,64531,0],[\"sstar141_m\",39,64524,0],[\"sstar142_m\",8,64531,0],[\"sstar143_m\",3,64531,0],[\"sstar144_m\",21,64531,0],[\"sstar145_m\",14,64526,0],[\"tao03_m\",9,64452,0],[\"tao02_m\",8,129171,0],[\"lnet01_m\",9,31896,0],[\"sstar027_m\",3,64535,0],[\"sstar026_m\",9,64535,0],[\"object102_m\",58,257674,0],[\"object101_m\",14,257674,0],[\"rsldap1_m\",27,1839,0],[\"rsldap2_m\",22,1839,0],[\"tapeserv01_m\",12,5970,0],[\"sstar018_m\",9,64535,0],[\"sstar019_m\",9,64535,0],[\"sstar012_m\",9,64535,0],[\"sstar013_m\",2,64535,0],[\"sstar011_m\",9,64535,0],[\"sstar016_m\",2,64535,0],[\"sstar017_m\",9,64535,0],[\"sstar014_m\",8,64535,0],[\"sstar015_m\",9,64535,0],[\"sstar159_m\",53,64531,0],[\"sstar158_m\",85,64531,0],[\"sstar153_m\",10,64531,0],[\"sstar152_m\",12,64531,0],[\"sstar151_m\",32,64526,0],[\"sstar150_m\",2,64531,0],[\"sstar157_m\",27,64531,0],[\"sstar156_m\",30,64531,0],[\"sstar155_m\",85,64531,0],[\"sstar154_m\",3,64526,0],[\"tao01_m\",8,129171,0],[\"sstar146_m\",10,64527,0],[\"sstar028_m\",2,64535,0],[\"gstar104_m\",4,24149,0],[\"sstar001_m\",12,64402,0],[\"sstar003_m\",14,129027,0],[\"sstar002_m\",38,64402,0],[\"gstar101_m\",3,48385,0],[\"sstar166_m\",9,64526,0],[\"sstar164_m\",10,64531,0],[\"sstar165_m\",9,64526,0],[\"sstar162_m\",9,64531,0],[\"sstar163_m\",3,64526,0],[\"sstar160_m\",3,64526,0],[\"sstar161_m\",9,64526,0],[\"gstar058_m\",9,48389,0],[\"gstar103_m\",3,48389,0],[\"gstar052_m\",5,48389,0],[\"gstar053_m\",5,48389,0],[\"gstar050_m\",5,48389,0],[\"gstar051_m\",6,48389,0],[\"gstar056_m\",9,48389,0],[\"gstar057_m\",5,48389,0],[\"gstar054_m\",5,48389,0],[\"gstar055_m\",5,48389,0],[\"sstar147_m\",3,64531,0],[\"object12_m\",21,145211,0],[\"object10_m\",22,145211,0],[\"object11_m\",21,145211,0],[\"lnet02_m\",7,31896,0],[\"gstar049_m\",7,48389,0],[\"gstar048_m\",9,48389,0],[\"hpc-mgmt_m\",12,48389,0],[\"gstar045_m\",5,48389,0],[\"gstar044_m\",5,48389,0],[\"gstar047_m\",59,48389,0],[\"gstar046_m\",44,48389,0],[\"gstar041_m\",14,48389,0],[\"gstar040_m\",14,48389,0],[\"gstar043_m\",9,48389,0],[\"gstar042_m\",15,48389,0],[\"object09_m\",26,145211,0],[\"object08_m\",25,145211,0],[\"object05_m\",20,145211,0],[\"object04_m\",20,145211,0],[\"object07_m\",25,145211,0],[\"object06_m\",22,145211,0],[\"object01_m\",20,145211,0],[\"object03_m\",20,145211,0],[\"object02_m\",20,145211,0],[\"sstar104_m\",2,64531,0],[\"sstar105_m\",3,64531,0],[\"sstar139_m\",26,64531,0],[\"sstar107_m\",3,64531,0],[\"sstar101_m\",10,64526,0],[\"sstar102_m\",9,64526,0],[\"sstar103_m\",10,64531,0],[\"sstar108_m\",2,64531,0],[\"sstar109_m\",2,64531,0],[\"metadata101_m\",39,31896,0],[\"gstar038_m\",11,48389,0],[\"gstar039_m\",11,48389,0],[\"gstar030_m\",5,48389,0],[\"gstar031_m\",5,48389,0],[\"gstar032_m\",11,48389,0],[\"gstar033_m\",4,48389,0],[\"gstar034_m\",11,48389,0],[\"gstar035_m\",11,48389,0],[\"gstar036_m\",12,48389,0],[\"gstar037_m\",11,48389,0]]</mem>\n" + "<disk>[[\"sstar117_d\",5,0],[\"sstar116_d\",5,0],[\"sstar115_d\",5,0],[\"sstar114_d\",5,0],[\"sstar113_d\",5,0],[\"sstar112_d\",5,0],[\"sstar111_d\",5,0],[\"sstar110_d\",5,0],[\"sstar119_d\",5,0],[\"sstar118_d\",5,0],[\"gstar029_d\",5,0],[\"gstar028_d\",8,0],[\"gstar023_d\",5,0],[\"gstar022_d\",5,0],[\"gstar021_d\",5,0],[\"gstar020_d\",10,0],[\"gstar027_d\",5,0],[\"gstar026_d\",8,0],[\"gstar025_d\",5,0],[\"gstar024_d\",5,0],[\"sstar128_d\",5,0],[\"sstar129_d\",5,0],[\"g2_d\",37,0],[\"sstar122_d\",5,0],[\"sstar123_d\",5,0],[\"sstar120_d\",5,0],[\"sstar121_d\",5,0],[\"sstar126_d\",5,0],[\"sstar127_d\",5,0],[\"sstar124_d\",5,0],[\"sstar125_d\",5,0],[\"pbs_d\",19,0],[\"gstar018_d\",5,0],[\"gstar019_d\",5,0],[\"gstar016_d\",5,0],[\"gstar017_d\",5,0],[\"gstar014_d\",12,0],[\"gstar015_d\",5,0],[\"gstar012_d\",5,0],[\"gstar013_d\",5,0],[\"gstar011_d\",5,0],[\"sstar139_d\",5,0],[\"sstar138_d\",5,0],[\"sstar135_d\",5,0],[\"sstar134_d\",5,0],[\"sstar137_d\",5,0],[\"sstar136_d\",5,0],[\"sstar131_d\",5,0],[\"sstar130_d\",5,0],[\"sstar133_d\",5,0],[\"sstar132_d\",5,0],[\"gstar001_d\",74,0],[\"gstar002_d\",35,0],[\"rm02_d\",11,0],[\"rm01_d\",29,0],[\"data-mover01_d\",18,0],[\"data-mover02_d\",17,0],[\"sstar204_d\",5,0],[\"sstar203_d\",5,0],[\"sstar202_d\",5,0],[\"sstar201_d\",5,0],[\"sstar301_d\",5,0],[\"sstar148_d\",5,0],[\"sstar149_d\",5,0],[\"sstar025_d\",6,0],[\"sstar024_d\",8,0],[\"sstar023_d\",5,0],[\"sstar022_d\",5,0],[\"sstar021_d\",5,0],[\"sstar020_d\",6,0],[\"sstar140_d\",5,0],[\"sstar141_d\",5,0],[\"sstar142_d\",5,0],[\"sstar143_d\",5,0],[\"sstar144_d\",6,0],[\"sstar145_d\",5,0],[\"tao03_d\",6,0],[\"tao02_d\",5,0],[\"lnet01_d\",8,0],[\"sstar027_d\",5,0],[\"sstar026_d\",5,0],[\"object102_d\",9,0],[\"object101_d\",7,0],[\"rsldap1_d\",32,0],[\"rsldap2_d\",23,0],[\"tapeserv01_d\",5,0],[\"sstar018_d\",6,0],[\"sstar019_d\",5,0],[\"sstar012_d\",5,0],[\"sstar013_d\",5,0],[\"sstar011_d\",5,0],[\"sstar016_d\",6,0],[\"sstar017_d\",5,0],[\"sstar014_d\",7,0],[\"sstar015_d\",5,0],[\"sstar159_d\",5,0],[\"sstar158_d\",7,0],[\"sstar153_d\",5,0],[\"sstar152_d\",5,0],[\"sstar151_d\",5,0],[\"sstar150_d\",5,0],[\"sstar157_d\",6,0],[\"sstar156_d\",5,0],[\"sstar155_d\",5,0],[\"sstar154_d\",5,0],[\"tao01_d\",41,0],[\"sstar146_d\",5,0],[\"sstar028_d\",5,0],[\"gstar104_d\",5,0],[\"sstar001_d\",59,0],[\"sstar003_d\",8,0],[\"sstar002_d\",39,0],[\"gstar101_d\",5,0],[\"sstar166_d\",5,0],[\"sstar164_d\",5,0],[\"sstar165_d\",5,0],[\"sstar162_d\",6,0],[\"sstar163_d\",5,0],[\"sstar160_d\",28,0],[\"sstar161_d\",28,0],[\"gstar058_d\",19,0],[\"gstar103_d\",5,0],[\"gstar052_d\",5,0],[\"gstar053_d\",5,0],[\"gstar050_d\",5,0],[\"gstar051_d\",5,0],[\"gstar056_d\",5,0],[\"gstar057_d\",5,0],[\"gstar054_d\",5,0],[\"gstar055_d\",5,0],[\"sstar147_d\",5,0],[\"lnet02_d\",13,0],[\"gstar049_d\",7,0],[\"gstar048_d\",5,0],[\"hpc-mgmt_d\",83,0],[\"gstar045_d\",22,0],[\"gstar044_d\",5,0],[\"gstar047_d\",5,0],[\"gstar046_d\",5,0],[\"gstar041_d\",5,0],[\"gstar040_d\",5,0],[\"gstar043_d\",5,0],[\"gstar042_d\",5,0],[\"sstar104_d\",5,0],[\"sstar105_d\",5,0],[\"sstar106_d\",5,0],[\"sstar107_d\",5,0],[\"sstar101_d\",7,0],[\"sstar102_d\",5,0],[\"sstar103_d\",5,0],[\"sstar108_d\",17,0],[\"sstar109_d\",5,0],[\"metadata101_d\",10,0],[\"gstar038_d\",5,0],[\"gstar039_d\",5,0],[\"gstar030_d\",5,0],[\"gstar031_d\",5,0],[\"gstar032_d\",5,0],[\"gstar033_d\",5,0],[\"gstar034_d\",5,0],[\"gstar035_d\",5,0],[\"gstar036_d\",5,0],[\"gstar037_d\",5,0]]</disk>\n" + "<temp>[[\"sstar117\",[61,54,26,26]],[\"sstar116\",[60,61,31,31]],[\"sstar115\",[41,37,27,27]],[\"sstar114\",[36,42,25,25]],[\"sstar113\",[42,36,26,26]],[\"sstar112\",[38,36,26,26]],[\"sstar111\",[55,55,26,26]],[\"sstar110\",[34,34,22,22]],[\"sstar119\",[57,54,28,28]],[\"sstar118\",[59,56,29,29]],[\"gstar029\",[31,29,22,22]],[\"gstar028\",[35,28,21,21]],[\"gstar023\",[27,35,24,24]],[\"gstar022\",[44,43,22,22]],[\"gstar021\",[32,27,22,22]],[\"gstar020\",[38,36,22,22]],[\"gstar027\",[34,29,23,23]],[\"gstar026\",[28,26,22,22]],[\"gstar025\",[32,39,22,22]],[\"gstar024\",[35,31,23,23]],[\"sstar128\",[58,56,28,28]],[\"sstar129\",[62,56,26,26]],[\"g2\",[30,31,21,21]],[\"sstar122\",[63,52,26,26]],[\"sstar123\",[60,53,26,26]],[\"sstar120\",[61,55,25,25]],[\"sstar121\",[57,57,24,24]],[\"sstar126\",[61,60,30,30]],[\"sstar127\",[61,58,28,28]],[\"sstar124\",[57,52,26,26]],[\"sstar125\",[58,55,27,27]],[\"gstar018\",[26,26,21,21]],[\"gstar019\",[38,39,21,21]],[\"gstar016\",[29,31,25,25]],[\"gstar017\",[25,25,21,21]],[\"gstar014\",[39,41,23,23]],[\"gstar015\",[42,40,23,23]],[\"gstar012\",[51,44,23,23]],[\"gstar013\",[37,44,22,22]],[\"gstar011\",[42,38,24,24]],[\"metadata01\",[28,33,20,20]],[\"sstar138\",[56,34,22,22]],[\"metadata02\",[27,29,19,19]],[\"sstar135\",[42,31,24,24]],[\"sstar134\",[58,58,26,26]],[\"sstar137\",[48,41,23,23]],[\"sstar136\",[53,55,27,27]],[\"sstar131\",[71,55,30,30]],[\"sstar130\",[59,53,30,30]],[\"sstar133\",[57,50,26,26]],[\"sstar132\",[55,52,24,24]],[\"gstar001\",[28,27,21,21]],[\"gstar002\",[25,25,20,20]],[\"sstar204\",[40,35,22,22]],[\"sstar203\",[40,40,25,25]],[\"sstar202\",[40,37,24,24]],[\"sstar201\",[32,29,24,24]],[\"sstar106\",[60,55,27,27]],[\"sstar301\",[36,36,17,17]],[\"sstar148\",[45,43,22,22]],[\"sstar149\",[50,43,22,22]],[\"sstar025\",[38,38,26,26]],[\"sstar024\",[41,35,28,28]],[\"sstar023\",[40,32,28,28]],[\"sstar022\",[57,51,28,28]],[\"sstar021\",[36,39,24,24]],[\"sstar020\",[34,34,22,22]],[\"sstar140\",[30,29,22,22]],[\"sstar141\",[46,47,23,23]],[\"sstar142\",[44,39,23,23]],[\"sstar143\",[48,46,23,23]],[\"sstar144\",[50,43,22,22]],[\"sstar145\",[44,42,21,21]],[\"tao03\",[43,46,27,27]],[\"tao02\",[36,30,23,23]],[\"sstar027\",[58,46,24,24]],[\"sstar026\",[38,37,25,25]],[\"tapeserv01\",[25,25,21,21]],[\"sstar018\",[37,35,25,25]],[\"sstar019\",[54,48,23,23]],[\"sstar012\",[38,37,27,27]],[\"sstar013\",[38,40,28,28]],[\"sstar011\",[40,38,27,27]],[\"sstar016\",[41,37,25,25]],[\"sstar017\",[53,52,26,26]],[\"sstar014\",[42,38,28,28]],[\"sstar015\",[56,52,28,28]],[\"sstar159\",[49,48,22,22]],[\"sstar158\",[49,51,23,23]],[\"sstar153\",[46,44,23,23]],[\"sstar152\",[47,39,23,23]],[\"sstar151\",[56,54,26,26]],[\"sstar150\",[29,32,20,20]],[\"sstar157\",[57,57,27,27]],[\"sstar156\",[51,48,24,24]],[\"sstar155\",[57,52,26,26]],[\"sstar154\",[57,51,25,25]],[\"tao01\",[41,33,24,24]],[\"sstar146\",[47,43,22,22]],[\"sstar028\",[36,34,23,23]],[\"gstar104\",[20,19,28,28]],[\"sstar001\",[39,38,28,28]],[\"sstar003\",[57,44,32,32]],[\"sstar002\",[39,40,28,28]],[\"gstar101\",[17,18,30,30]],[\"sstar166\",[36,41,27,27]],[\"sstar164\",[49,48,23,23]],[\"sstar165\",[52,50,24,24]],[\"sstar162\",[53,47,21,21]],[\"sstar163\",[57,52,27,27]],[\"sstar160\",[49,45,21,21]],[\"sstar161\",[47,43,22,22]],[\"gstar058\",[32,35,22,22]],[\"gstar103\",[16,20,31,31]],[\"gstar052\",[47,41,25,25]],[\"gstar053\",[44,43,24,24]],[\"gstar050\",[41,43,22,22]],[\"gstar051\",[30,35,23,23]],[\"gstar056\",[47,42,24,24]],[\"gstar057\",[41,37,22,22]],[\"gstar054\",[41,40,25,25]],[\"gstar055\",[46,45,25,25]],[\"sstar147\",[52,49,23,23]],[\"object12\",[30,31,24,24]],[\"object10\",[30,30,23,23]],[\"object11\",[27,34,23,23]],[\"gstar049\",[52,46,23,23]],[\"gstar048\",[43,42,22,22]],[\"gstar045\",[41,42,22,22]],[\"gstar044\",[41,44,23,23]],[\"gstar047\",[38,38,23,23]],[\"gstar046\",[41,41,23,23]],[\"gstar041\",[42,47,21,21]],[\"gstar040\",[45,40,21,21]],[\"gstar043\",[41,39,22,22]],[\"gstar042\",[42,46,23,23]],[\"object09\",[31,29,22,22]],[\"object08\",[28,30,23,23]],[\"object05\",[28,30,23,23]],[\"object04\",[27,32,21,21]],[\"object07\",[35,28,23,23]],[\"object06\",[29,29,23,23]],[\"object01\",[28,29,21,21]],[\"object03\",[0,0,22,22]],[\"object02\",[30,28,21,21]],[\"sstar104\",[39,36,27,27]],[\"sstar105\",[62,54,29,29]],[\"sstar139\",[55,47,24,24]],[\"sstar107\",[57,51,25,25]],[\"sstar101\",[60,57,29,29]],[\"sstar102\",[55,54,27,27]],[\"sstar103\",[58,55,28,28]],[\"sstar108\",[38,39,24,24]],[\"sstar109\",[44,38,24,24]],[\"gstar038\",[31,30,21,21]],[\"gstar039\",[49,43,21,21]],[\"gstar030\",[37,31,23,23]],[\"gstar031\",[44,42,25,25]],[\"gstar032\",[41,44,23,23]],[\"gstar033\",[39,35,23,23]],[\"gstar034\",[46,40,23,23]],[\"gstar035\",[41,39,21,21]],[\"gstar036\",[46,44,24,24]],[\"gstar037\",[36,26,22,22]]]</temp>\n" + "<diskWarn></diskWarn>\n" + "<tempWarn></tempWarn>\n" + "<power>[[\"sstar204\",[660]],[\"sstar203\",[624]],[\"sstar202\",[652]],[\"sstar201\",[780]],[\"tao03\",[168]],[\"gstar104\",[416]],[\"gstar101\",[432]],[\"gstar103\",[496]]]</power>\n" + "<fans>[]</fans>\n" + "<pbsnodes>[[\"gstar058\",\"down, sweep\"], [\"gstar102\",\"down\"], [\"gstar104\",\"noraid\"], [\"gstar105\",\"down, noraid\"], [\"sstar165\",\"toCut\"], [\"sstar150\",\"disk/psu, het\"], [\"sstar140\",\"disk/psu, het\"], [\"sstar104\",\"disk/psu, het\"], [\"sstar024\",\"mces\"], [\"sstar020\",\"ib\"], ]</pbsnodes>\n" + "<loads>[[\"sstar117_l\",14.8,16],[\"sstar116_l\",15.8,16],[\"sstar115_l\",0.0,16],[\"sstar114_l\",0.0,16],[\"sstar113_l\",0.0,16],[\"sstar112_l\",0.0,16],[\"sstar111_l\",14.0,16],[\"sstar110_l\",0.0,16],[\"sstar119_l\",15.7,16],[\"sstar118_l\",16.0,16],[\"gstar029_l\",2.0,12],[\"gstar028_l\",1.0,12],[\"gstar023_l\",2.0,12],[\"gstar022_l\",7.7,12],[\"gstar021_l\",2.0,12],[\"gstar020_l\",4.8,12],[\"gstar027_l\",2.0,12],[\"gstar026_l\",1.0,12],[\"gstar025_l\",5.7,12],[\"gstar024_l\",1.0,12],[\"sstar128_l\",15.7,16],[\"sstar129_l\",11.9,16],[\"g2_l\",0.3,12],[\"sstar122_l\",13.2,16],[\"sstar123_l\",15.7,16],[\"sstar120_l\",16.0,16],[\"sstar121_l\",16.1,16],[\"sstar126_l\",15.4,16],[\"sstar127_l\",15.6,16],[\"sstar124_l\",15.2,16],[\"sstar125_l\",16.0,16],[\"pbs_l\",0.1,12],[\"gstar053_l\",11.0,12],[\"gstar018_l\",0.0,12],[\"gstar019_l\",7.1,12],[\"gstar016_l\",0.7,12],[\"gstar017_l\",0.7,12],[\"gstar014_l\",10.0,12],[\"gstar015_l\",9.8,12],[\"gstar012_l\",10.0,12],[\"gstar013_l\",8.2,12],[\"gstar011_l\",4.2,12],[\"gstar050_l\",11.0,12],[\"metadata01_l\",0.0,12],[\"sstar138_l\",8.0,16],[\"metadata02_l\",0.0,12],[\"sstar135_l\",3.1,16],[\"sstar134_l\",16.0,16],[\"sstar137_l\",12.0,16],[\"sstar136_l\",9.0,16],[\"sstar131_l\",11.3,16],[\"sstar130_l\",12.0,16],[\"sstar133_l\",15.0,16],[\"sstar132_l\",12.0,16],[\"sstar152_l\",10.6,16],[\"gstar001_l\",0.0,12],[\"gstar002_l\",0.0,12],[\"rm02_l\",0.1,32],[\"rm01_l\",0.0,32],[\"data-mover01_l\",0.0,2],[\"data-mover02_l\",0.0,8],[\"sstar204_l\",0.0,32],[\"sstar203_l\",0.0,32],[\"sstar202_l\",0.0,32],[\"sstar201_l\",0.0,32],[\"sstar301_l\",0.0,32],[\"sstar148_l\",6.2,16],[\"sstar149_l\",11.0,16],[\"sstar025_l\",0.0,16],[\"sstar024_l\",0.0,16],[\"sstar023_l\",0.0,16],[\"sstar022_l\",14.0,16],[\"sstar021_l\",0.0,16],[\"sstar020_l\",0.0,16],[\"sstar140_l\",0.0,16],[\"sstar141_l\",9.5,16],[\"sstar142_l\",5.7,16],[\"sstar143_l\",14.0,16],[\"sstar144_l\",14.8,16],[\"sstar145_l\",4.6,16],[\"tao03_l\",1.6,12],[\"tao02_l\",0.0,12],[\"sstar027_l\",14.0,16],[\"sstar026_l\",0.0,16],[\"object102_l\",0.0,48],[\"object101_l\",0.0,48],[\"rsldap1_l\",0.0,1],[\"rsldap2_l\",0.0,1],[\"tapeserv01_l\",0.0,8],[\"sstar018_l\",0.0,16],[\"sstar019_l\",14.0,16],[\"sstar012_l\",0.0,16],[\"sstar013_l\",0.0,16],[\"sstar011_l\",0.0,16],[\"sstar016_l\",0.0,16],[\"sstar017_l\",14.0,16],[\"sstar014_l\",0.0,16],[\"sstar015_l\",14.0,16],[\"sstar159_l\",15.0,16],[\"sstar158_l\",15.0,16],[\"sstar153_l\",10.2,16],[\"sstar139_l\",12.0,16],[\"sstar151_l\",16.2,16],[\"sstar150_l\",0.0,16],[\"sstar157_l\",15.5,16],[\"sstar156_l\",15.5,16],[\"sstar155_l\",15.0,16],[\"sstar154_l\",14.0,16],[\"tao01_l\",0.4,12],[\"sstar146_l\",14.7,16],[\"sstar028_l\",0.0,16],[\"gstar104_l\",0.0,12],[\"sstar001_l\",0.0,16],[\"sstar003_l\",1.1,32],[\"sstar002_l\",0.0,16],[\"gstar101_l\",0.0,12],[\"sstar166_l\",0.0,16],[\"sstar164_l\",16.0,16],[\"sstar165_l\",14.0,16],[\"sstar162_l\",14.0,16],[\"sstar163_l\",14.0,16],[\"sstar160_l\",14.1,16],[\"sstar161_l\",14.0,16],[\"gstar058_l\",0.0,12],[\"gstar103_l\",0.0,12],[\"gstar052_l\",11.0,12],[\"lnet01_l\",0.0,32],[\"gstar051_l\",3.0,12],[\"gstar056_l\",12.0,12],[\"gstar057_l\",10.0,12],[\"gstar054_l\",9.0,12],[\"gstar055_l\",12.1,12],[\"object12_l\",0.0,12],[\"object10_l\",0.0,12],[\"object11_l\",0.0,12],[\"gstar049_l\",40.5,12],[\"gstar048_l\",12.0,12],[\"hpc-mgmt_l\",0.7,24],[\"gstar045_l\",12.0,12],[\"gstar044_l\",12.0,12],[\"gstar047_l\",5.5,12],[\"gstar046_l\",7.7,12],[\"gstar041_l\",12.1,12],[\"gstar040_l\",11.0,12],[\"gstar043_l\",12.1,12],[\"gstar042_l\",12.0,12],[\"object09_l\",0.0,12],[\"object08_l\",0.0,12],[\"object05_l\",0.0,12],[\"object04_l\",0.0,12],[\"object07_l\",0.0,12],[\"object06_l\",0.0,12],[\"object01_l\",0.0,12],[\"object03_l\",0.0,12],[\"object02_l\",0.0,12],[\"sstar104_l\",0.0,16],[\"sstar105_l\",14.0,16],[\"sstar106_l\",14.0,16],[\"sstar107_l\",14.0,16],[\"sstar101_l\",14.0,16],[\"sstar102_l\",14.0,16],[\"sstar103_l\",13.9,16],[\"sstar108_l\",0.0,16],[\"sstar109_l\",4.7,16],[\"metadata101_l\",0.0,40],[\"gstar038_l\",2.1,12],[\"gstar039_l\",12.0,12],[\"gstar036_l\",11.0,12],[\"gstar030_l\",2.0,12],[\"gstar031_l\",11.0,12],[\"gstar032_l\",10.1,12],[\"gstar033_l\",8.0,12],[\"gstar034_l\",9.2,12],[\"gstar035_l\",11.0,12],[\"sstar147_l\",16.0,16],[\"gstar037_l\",2.0,12]]</loads>\n" + "<gpuloads>[[\"sstar117_g\",0,2],[\"sstar116_g\",0,2],[\"sstar115_g\",0,2],[\"sstar114_g\",0,2],[\"sstar113_g\",0,2],[\"sstar112_g\",0,2],[\"sstar111_g\",0,2],[\"sstar110_g\",0,2],[\"sstar119_g\",0,2],[\"sstar118_g\",0,2],[\"gstar029_g\",98,2],[\"gstar028_g\",49,2],[\"gstar023_g\",98,2],[\"gstar022_g\",0,2],[\"gstar021_g\",98,2],[\"gstar020_g\",0,2],[\"gstar027_g\",98,2],[\"gstar026_g\",49,2],[\"gstar025_g\",0,2],[\"gstar024_g\",49,2],[\"sstar128_g\",0,2],[\"sstar129_g\",0,2],[\"sstar122_g\",0,2],[\"sstar123_g\",0,2],[\"sstar120_g\",0,2],[\"sstar121_g\",0,2],[\"sstar126_g\",0,2],[\"sstar127_g\",0,2],[\"sstar124_g\",0,2],[\"sstar125_g\",0,2],[\"gstar018_g\",0,2],[\"gstar019_g\",0,2],[\"gstar016_g\",0,2],[\"gstar017_g\",0,2],[\"gstar014_g\",0,2],[\"gstar015_g\",0,2],[\"gstar012_g\",0,2],[\"gstar013_g\",0,2],[\"gstar011_g\",0,2],[\"sstar138_g\",0,2],[\"sstar135_g\",0,2],[\"sstar134_g\",0,2],[\"sstar137_g\",0,2],[\"sstar136_g\",0,2],[\"sstar131_g\",0,2],[\"sstar130_g\",0,2],[\"sstar133_g\",0,2],[\"sstar132_g\",0,2],[\"gstar001_g\",0,1],[\"gstar002_g\",0,1],[\"sstar106_g\",0,2],[\"sstar301_g\",0,12],[\"sstar148_g\",0,2],[\"sstar149_g\",0,2],[\"sstar140_g\",0,2],[\"sstar141_g\",0,2],[\"sstar142_g\",0,2],[\"sstar143_g\",0,2],[\"sstar144_g\",0,2],[\"sstar145_g\",0,2],[\"sstar159_g\",0,2],[\"sstar158_g\",0,2],[\"sstar153_g\",0,2],[\"sstar152_g\",0,2],[\"sstar151_g\",0,2],[\"sstar150_g\",0,2],[\"sstar157_g\",0,2],[\"sstar156_g\",0,2],[\"sstar155_g\",0,2],[\"sstar154_g\",0,2],[\"sstar146_g\",0,2],[\"gstar104_g\",0,4],[\"sstar001_g\",0,1],[\"sstar002_g\",0,1],[\"gstar101_g\",0,7],[\"sstar166_g\",0,2],[\"sstar164_g\",0,2],[\"sstar165_g\",0,2],[\"sstar162_g\",0,2],[\"sstar163_g\",0,2],[\"sstar160_g\",0,2],[\"sstar161_g\",0,2],[\"gstar058_g\",0,2],[\"gstar103_g\",0,7],[\"gstar052_g\",98,2],[\"gstar053_g\",98,2],[\"gstar050_g\",96,2],[\"gstar051_g\",98,2],[\"gstar056_g\",97,2],[\"gstar057_g\",96,2],[\"gstar054_g\",97,2],[\"gstar055_g\",98,2],[\"sstar147_g\",0,2],[\"gstar049_g\",98,2],[\"gstar048_g\",98,2],[\"gstar045_g\",98,2],[\"gstar044_g\",98,2],[\"gstar047_g\",94,2],[\"gstar046_g\",96,2],[\"gstar041_g\",98,2],[\"gstar040_g\",98,2],[\"gstar043_g\",98,2],[\"gstar042_g\",95,2],[\"sstar104_g\",0,2],[\"sstar105_g\",0,2],[\"sstar139_g\",0,2],[\"sstar107_g\",0,2],[\"sstar101_g\",0,2],[\"sstar102_g\",0,2],[\"sstar103_g\",0,2],[\"sstar108_g\",0,2],[\"sstar109_g\",0,2],[\"gstar038_g\",95,2],[\"gstar039_g\",97,2],[\"gstar030_g\",98,2],[\"gstar031_g\",99,2],[\"gstar032_g\",98,2],[\"gstar033_g\",49,2],[\"gstar034_g\",49,2],[\"gstar035_g\",48,2],[\"gstar036_g\",98,2],[\"gstar037_g\",94,2]]</gpuloads>\n" + "<text><stats>\"106 nodes used, 1304 cores used = 68.3% of available_br_64 gpus used = 28.3% of available_br_25 nodes idle, 604 cpus idle, 162 gpus idle_br_1582 jobs queued for 33115 cpus 449 gpus or 208.1 machine hours\"</stats></text>\n" + "<reservations>[[\"dwf_sml.11\",[\"sstar011\",\"sstar012\"]],[\"het617_sstar104.3\",[\"sstar104\"]],[\"het617_sstar150.1\",[\"sstar150\"]],[\"rmfailure.20\",[\"sstar108\"]],[\"het617_sstar140.2\",[\"sstar140\"]]]</reservations>\n" + "<usage>[\"pbs_running_cores\",1304,\"pbs_avail_cores\",1908,\"pbs_running_gpus\",64,\"pbs_avail_gpus\",226]</usage>\n" + "<network>[[\"sstar117_n\",877.1,\"k\",719.8,\"b\",0],[\"sstar116_n\",1.6,\"m\",1.2,\"k\",0],[\"sstar115_n\",16.9,\"k\",98.9,\"b\",0],[\"sstar114_n\",5.7,\"k\",33.6,\"b\",0],[\"sstar113_n\",14.5,\"k\",90.9,\"b\",0],[\"sstar112_n\",6.2,\"k\",34.1,\"b\",0],[\"sstar111_n\",2.5,\"k\",14.7,\"b\",0],[\"sstar110_n\",17.4,\"k\",100.9,\"b\",0],[\"sstar119_n\",3.5,\"k\",18.3,\"b\",0],[\"sstar118_n\",13.9,\"k\",50.2,\"b\",0],[\"gstar029_n\",15.3,\"k\",86.0,\"b\",0],[\"gstar028_n\",13.8,\"k\",83.8,\"b\",0],[\"gstar023_n\",2.6,\"k\",14.5,\"b\",0],[\"gstar022_n\",5.3,\"k\",31.0,\"b\",0],[\"gstar021_n\",4.0,\"k\",21.9,\"b\",0],[\"gstar020_n\",16.8,\"k\",100.2,\"b\",0],[\"gstar027_n\",14.0,\"k\",83.4,\"b\",0],[\"gstar026_n\",16.2,\"k\",92.6,\"b\",0],[\"gstar025_n\",15.1,\"k\",93.6,\"b\",0],[\"gstar024_n\",16.9,\"k\",96.5,\"b\",0],[\"sstar128_n\",8.2,\"k\",39.7,\"b\",0],[\"sstar129_n\",16.1,\"k\",88.2,\"b\",0],[\"g2_n\",10.3,\"m\",7.9,\"k\",0],[\"sstar122_n\",3.6,\"k\",27.2,\"b\",0],[\"sstar123_n\",7.8,\"k\",39.3,\"b\",0],[\"sstar120_n\",6.2,\"k\",35.2,\"b\",0],[\"sstar121_n\",148.1,\"k\",186.3,\"b\",0],[\"sstar126_n\",7.6,\"k\",39.0,\"b\",0],[\"sstar127_n\",16.2,\"k\",93.2,\"b\",0],[\"sstar124_n\",3.4,\"k\",25.4,\"b\",0],[\"sstar125_n\",56.0,\"k\",137.7,\"b\",0],[\"pbs_n\",1.3,\"k\",6.9,\"b\",0],[\"gstar053_n\",17.4,\"k\",96.8,\"b\",0],[\"gstar018_n\",16.5,\"k\",97.2,\"b\",0],[\"gstar019_n\",15.2,\"k\",83.7,\"b\",0],[\"gstar016_n\",16.2,\"k\",93.6,\"b\",0],[\"gstar017_n\",4.5,\"k\",27.5,\"b\",0],[\"gstar014_n\",14.4,\"k\",84.7,\"b\",0],[\"gstar015_n\",14.2,\"k\",85.9,\"b\",0],[\"gstar012_n\",1.4,\"k\",11.3,\"b\",0],[\"gstar013_n\",4.5,\"k\",26.8,\"b\",0],[\"gstar011_n\",19.9,\"k\",101.1,\"b\",0],[\"gstar050_n\",14.5,\"k\",85.0,\"b\",0],[\"metadata01_n\",133.0,\"k\",432.0,\"b\",0],[\"sstar138_n\",16.0,\"k\",89.2,\"b\",0],[\"metadata02_n\",2.0,\"k\",32.0,\"b\",0],[\"sstar135_n\",13.4,\"k\",82.3,\"b\",0],[\"sstar134_n\",14.9,\"k\",94.6,\"b\",0],[\"sstar137_n\",15.1,\"k\",92.3,\"b\",0],[\"sstar136_n\",213.3,\"k\",228.2,\"b\",0],[\"sstar131_n\",32.6,\"k\",95.2,\"b\",0],[\"sstar130_n\",14.9,\"k\",85.1,\"b\",0],[\"sstar133_n\",218.5,\"k\",253.6,\"b\",0],[\"sstar132_n\",114.1,\"k\",168.4,\"b\",0],[\"sstar152_n\",14.6,\"k\",89.8,\"b\",0],[\"gstar001_n\",1.6,\"k\",12.1,\"b\",0],[\"gstar002_n\",1.5,\"k\",11.0,\"b\",0],[\"rm02_n\",6.8,\"k\",39.4,\"b\",0],[\"rm01_n\",5.9,\"k\",35.6,\"b\",0],[\"data-mover01_n\",0.0,\"b\",0.0,\"b\",0],[\"data-mover02_n\",0.0,\"b\",0.0,\"b\",0],[\"sstar204_n\",21.0,\"k\",120.7,\"b\",0],[\"sstar203_n\",18.9,\"k\",102.7,\"b\",0],[\"sstar202_n\",20.9,\"k\",120.5,\"b\",0],[\"sstar201_n\",21.2,\"k\",121.6,\"b\",0],[\"sstar301_n\",19.4,\"k\",128.3,\"b\",0],[\"sstar148_n\",5.7,\"k\",33.8,\"b\",0],[\"sstar149_n\",17.1,\"k\",96.9,\"b\",0],[\"sstar025_n\",1.6,\"k\",13.0,\"b\",0],[\"sstar024_n\",5.7,\"k\",33.1,\"b\",0],[\"sstar023_n\",13.4,\"k\",79.3,\"b\",0],[\"sstar022_n\",13.7,\"k\",83.8,\"b\",0],[\"sstar021_n\",14.5,\"k\",90.2,\"b\",0],[\"sstar020_n\",13.9,\"k\",86.4,\"b\",0],[\"sstar140_n\",15.5,\"k\",85.2,\"b\",0],[\"sstar141_n\",2.2,\"k\",15.9,\"b\",0],[\"sstar142_n\",7.1,\"k\",40.6,\"b\",0],[\"sstar143_n\",57.6,\"k\",56.8,\"b\",0],[\"sstar144_n\",5.3,\"k\",31.6,\"b\",0],[\"sstar145_n\",2.0,\"k\",14.5,\"b\",0],[\"tao03_n\",408.3,\"m\",304.4,\"k\",0],[\"tao02_n\",61.9,\"k\",125.8,\"b\",0],[\"sstar027_n\",84.4,\"k\",152.2,\"b\",0],[\"sstar026_n\",13.5,\"k\",80.1,\"b\",0],[\"object102_n\",4.3,\"k\",22.7,\"b\",0],[\"object101_n\",4.4,\"k\",23.4,\"b\",0],[\"rsldap1_n\",0.0,\"b\",0.0,\"b\",0],[\"rsldap2_n\",0.0,\"b\",0.0,\"b\",0],[\"tapeserv01_n\",2.2,\"k\",15.9,\"b\",0],[\"sstar018_n\",6.2,\"k\",35.7,\"b\",0],[\"sstar019_n\",130.1,\"k\",131.4,\"b\",0],[\"sstar012_n\",13.2,\"k\",77.8,\"b\",0],[\"sstar013_n\",6.5,\"k\",35.3,\"b\",0],[\"sstar011_n\",2.0,\"k\",14.9,\"b\",0],[\"sstar016_n\",2.4,\"k\",16.1,\"b\",0],[\"sstar017_n\",77.2,\"k\",140.7,\"b\",0],[\"sstar014_n\",4.3,\"k\",22.4,\"b\",0],[\"sstar015_n\",3.1,\"k\",23.4,\"b\",0],[\"sstar159_n\",16.1,\"k\",91.4,\"b\",0],[\"sstar158_n\",18.9,\"k\",102.2,\"b\",0],[\"sstar153_n\",16.4,\"k\",92.2,\"b\",0],[\"sstar139_n\",19.8,\"k\",104.0,\"b\",0],[\"sstar151_n\",4.8,\"k\",24.7,\"b\",0],[\"sstar150_n\",3.1,\"k\",24.3,\"b\",0],[\"sstar157_n\",15.2,\"k\",97.6,\"b\",0],[\"sstar156_n\",2.7,\"k\",22.9,\"b\",0],[\"sstar155_n\",17.7,\"k\",100.8,\"b\",0],[\"sstar154_n\",5.5,\"k\",33.0,\"b\",0],[\"tao01_n\",648.1,\"k\",1.0,\"k\",0],[\"sstar146_n\",16.9,\"k\",95.5,\"b\",0],[\"sstar028_n\",5.3,\"k\",28.2,\"b\",0],[\"gstar104_n\",3.3,\"k\",25.3,\"b\",0],[\"sstar001_n\",5.8,\"k\",27.7,\"b\",0],[\"sstar003_n\",8.9,\"k\",58.7,\"b\",0],[\"sstar002_n\",7.9,\"k\",49.0,\"b\",0],[\"gstar101_n\",16.0,\"k\",92.2,\"b\",0],[\"sstar166_n\",17.6,\"k\",99.9,\"b\",0],[\"sstar164_n\",14.0,\"k\",90.0,\"b\",0],[\"sstar165_n\",135.9,\"k\",123.2,\"b\",0],[\"sstar162_n\",21.2,\"k\",46.4,\"b\",0],[\"sstar163_n\",14.6,\"k\",89.7,\"b\",0],[\"sstar160_n\",5.0,\"k\",25.8,\"b\",0],[\"sstar161_n\",15.2,\"k\",91.6,\"b\",0],[\"gstar058_n\",15.3,\"k\",86.8,\"b\",0],[\"gstar103_n\",15.1,\"k\",87.5,\"b\",0],[\"gstar052_n\",13.8,\"k\",83.8,\"b\",0],[\"lnet02_n\",0.0,\"b\",0.0,\"b\",0],[\"lnet01_n\",33.7,\"k\",195.1,\"b\",0],[\"gstar051_n\",7.8,\"m\",5.8,\"k\",0],[\"gstar056_n\",6.2,\"k\",23.2,\"b\",0],[\"gstar057_n\",16.6,\"k\",91.4,\"b\",0],[\"gstar054_n\",3.5,\"k\",25.1,\"b\",0],[\"gstar055_n\",17.6,\"k\",104.3,\"b\",0],[\"object12_n\",569.0,\"k\",1.0,\"k\",0],[\"object10_n\",273.0,\"k\",856.0,\"b\",0],[\"object11_n\",1.3,\"m\",1.9,\"k\",0],[\"gstar049_n\",16.7,\"k\",95.1,\"b\",0],[\"gstar048_n\",3.5,\"k\",15.7,\"b\",0],[\"hpc-mgmt_n\",0.0,\"b\",0.0,\"b\",0],[\"gstar045_n\",2.2,\"k\",15.2,\"b\",0],[\"gstar044_n\",14.4,\"k\",90.5,\"b\",0],[\"gstar047_n\",9.1,\"k\",38.2,\"b\",0],[\"gstar046_n\",25.4,\"k\",106.7,\"b\",0],[\"gstar041_n\",20.0,\"k\",102.2,\"b\",0],[\"gstar040_n\",7.3,\"k\",35.0,\"b\",0],[\"gstar043_n\",13.6,\"k\",83.9,\"b\",0],[\"gstar042_n\",13.1,\"k\",75.5,\"b\",0],[\"object09_n\",635.0,\"k\",1.5,\"k\",0],[\"object08_n\",22.8,\"m\",19.1,\"k\",0],[\"object05_n\",471.0,\"k\",1.1,\"k\",0],[\"object04_n\",4.7,\"m\",2.9,\"k\",0],[\"object07_n\",99.5,\"m\",98.7,\"k\",0],[\"object06_n\",6.1,\"m\",3.7,\"k\",0],[\"object01_n\",10.6,\"m\",11.1,\"k\",0],[\"object03_n\",4.0,\"m\",2.6,\"k\",0],[\"object02_n\",280.5,\"m\",276.3,\"k\",0],[\"sstar104_n\",6.0,\"k\",36.3,\"b\",0],[\"sstar105_n\",112.6,\"k\",106.1,\"b\",0],[\"sstar106_n\",130.5,\"k\",189.3,\"b\",0],[\"sstar107_n\",17.9,\"k\",100.8,\"b\",0],[\"sstar101_n\",14.9,\"k\",92.3,\"b\",0],[\"sstar102_n\",69.5,\"k\",73.7,\"b\",0],[\"sstar103_n\",18.2,\"k\",101.8,\"b\",0],[\"sstar108_n\",6.6,\"k\",38.1,\"b\",0],[\"sstar109_n\",5.2,\"k\",27.1,\"b\",0],[\"metadata101_n\",8.6,\"k\",45.9,\"b\",0],[\"gstar038_n\",13.5,\"k\",79.2,\"b\",0],[\"gstar039_n\",17.3,\"k\",98.0,\"b\",0],[\"gstar036_n\",4.9,\"k\",30.1,\"b\",0],[\"gstar030_n\",15.7,\"k\",89.8,\"b\",0],[\"gstar031_n\",2.4,\"k\",14.7,\"b\",0],[\"gstar032_n\",16.2,\"k\",92.9,\"b\",0],[\"gstar033_n\",5.9,\"k\",34.3,\"b\",0],[\"gstar034_n\",17.2,\"k\",99.1,\"b\",0],[\"gstar035_n\",13.2,\"k\",76.6,\"b\",0],[\"sstar147_n\",17.5,\"k\",103.3,\"b\",0],[\"gstar037_n\",4.8,\"k\",29.4,\"b\",0]]</network>\n" + "<fs>[[\"sstar117_fs\",0.0,\"b\",724.2,\"k\",0.4],[\"sstar116_fs\",0.0,\"b\",1.8,\"m\",2.4],[\"sstar115_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar114_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"sstar113_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar112_fs\",614.4,\"b\",0.0,\"b\",0.0],[\"sstar111_fs\",0.0,\"b\",79.8,\"k\",0.2],[\"sstar110_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar119_fs\",819.1,\"b\",102.4,\"k\",0.8],[\"sstar118_fs\",0.0,\"b\",439.6,\"b\",2.2],[\"gstar029_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar028_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"gstar023_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"gstar022_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar021_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar020_fs\",0.0,\"b\",368.9,\"b\",0.0],[\"gstar027_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar026_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar025_fs\",0.0,\"b\",0.0,\"b\",0.5],[\"gstar024_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar128_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"sstar129_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"g2_fs\",0.0,\"b\",18.0,\"m\",4.1],[\"sstar122_fs\",0.0,\"b\",0.0,\"b\",0.6],[\"sstar123_fs\",0.0,\"b\",0.0,\"b\",0.4],[\"sstar120_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar121_fs\",0.0,\"b\",0.0,\"b\",0.5],[\"sstar126_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"sstar127_fs\",0.0,\"b\",0.0,\"b\",0.4],[\"sstar124_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar125_fs\",0.0,\"b\",13.5,\"k\",0.6],[\"pbs_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar053_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar018_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar019_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar016_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar017_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar014_fs\",0.0,\"b\",0.0,\"b\",0.3],[\"gstar015_fs\",0.0,\"b\",0.0,\"b\",0.3],[\"gstar012_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"gstar013_fs\",0.0,\"b\",0.0,\"b\",3.1],[\"gstar011_fs\",0.0,\"b\",0.0,\"b\",0.6],[\"gstar050_fs\",614.4,\"b\",0.0,\"b\",0.2],[\"sstar138_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar135_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar134_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar137_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar136_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar131_fs\",0.0,\"b\",6.9,\"k\",0.0],[\"sstar130_fs\",0.0,\"b\",241.6,\"b\",0.4],[\"sstar133_fs\",0.0,\"b\",102.3,\"k\",0.3],[\"sstar132_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar152_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"gstar001_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar002_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"rm02_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"rm01_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar204_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar203_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar202_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar201_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar301_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar148_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"sstar149_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar025_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar024_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar023_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar022_fs\",0.0,\"b\",51.1,\"k\",0.3],[\"sstar021_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar020_fs\",0.0,\"b\",0.0,\"b\",2.6],[\"sstar140_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar141_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"sstar142_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar143_fs\",0.0,\"b\",42.1,\"k\",0.3],[\"sstar144_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"sstar145_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"tao03_fs\",390.6,\"m\",4.8,\"m\",0.0],[\"tao02_fs\",0.0,\"b\",0.0,\"b\",0.4],[\"sstar027_fs\",0.0,\"b\",51.1,\"k\",0.3],[\"sstar026_fs\",0.0,\"b\",0.0,\"b\",2.6],[\"tapeserv01_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar018_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar019_fs\",0.0,\"b\",0.0,\"b\",2.7],[\"sstar012_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar013_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar011_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar016_fs\",204.8,\"b\",0.0,\"b\",0.1],[\"sstar017_fs\",0.0,\"b\",0.0,\"b\",0.5],[\"sstar014_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar015_fs\",0.0,\"b\",42.1,\"k\",0.5],[\"sstar159_fs\",614.4,\"b\",0.0,\"b\",0.4],[\"sstar158_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar153_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar139_fs\",0.0,\"b\",185.0,\"b\",0.7],[\"sstar151_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"sstar150_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar157_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"sstar156_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"sstar155_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar154_fs\",0.0,\"b\",102.3,\"k\",0.3],[\"tao01_fs\",748.7,\"k\",0.0,\"b\",0.0],[\"sstar146_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar028_fs\",614.4,\"b\",0.0,\"b\",0.0],[\"gstar104_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar001_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar003_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar002_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar101_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar166_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar164_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar165_fs\",0.0,\"b\",102.3,\"k\",0.3],[\"sstar162_fs\",0.0,\"b\",6.2,\"k\",0.0],[\"sstar163_fs\",0.0,\"b\",405.7,\"b\",0.0],[\"sstar160_fs\",0.0,\"b\",33.4,\"k\",0.1],[\"sstar161_fs\",0.0,\"b\",74.4,\"b\",0.0],[\"gstar058_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar103_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar052_fs\",0.0,\"b\",0.0,\"b\",0.3],[\"gstar051_fs\",409.6,\"b\",7.7,\"m\",0.1],[\"gstar056_fs\",0.0,\"b\",0.0,\"b\",0.3],[\"gstar057_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar054_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar055_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar049_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar048_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar045_fs\",409.6,\"b\",0.0,\"b\",0.1],[\"gstar044_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"gstar047_fs\",0.0,\"b\",0.0,\"b\",1.7],[\"gstar046_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar041_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar040_fs\",0.0,\"b\",0.0,\"b\",2.6],[\"gstar043_fs\",0.0,\"b\",0.0,\"b\",0.8],[\"gstar042_fs\",0.0,\"b\",0.0,\"b\",1.1],[\"sstar104_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar105_fs\",0.0,\"b\",0.0,\"b\",0.3],[\"sstar106_fs\",0.0,\"b\",88.5,\"k\",0.3],[\"sstar107_fs\",0.0,\"b\",470.6,\"b\",0.2],[\"sstar101_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"sstar102_fs\",0.0,\"b\",113.3,\"k\",0.3],[\"sstar103_fs\",0.0,\"b\",89.0,\"k\",0.3],[\"sstar108_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"sstar109_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar038_fs\",0.0,\"b\",0.0,\"b\",0.1],[\"gstar039_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar036_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar030_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar031_fs\",0.0,\"b\",0.0,\"b\",0.3],[\"gstar032_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar033_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"gstar034_fs\",0.0,\"b\",0.0,\"b\",1.4],[\"gstar035_fs\",0.0,\"b\",0.0,\"b\",0.2],[\"sstar147_fs\",0.0,\"b\",0.0,\"b\",0.0],[\"gstar037_fs\",0.0,\"b\",0.0,\"b\",0.2]]</fs>\n" + "<averages>[[\"6551082.pbs.hpc.swin.edu.au\",[[\"sstar124\",[95,1,0,4,0,6706,28.4,\"k\",95.7,\"b\",0.000],[100,0,6706,971.9,\"k\",1.6,\"k\"],64531,0],[\"ave\",[95,1,0,4,0,6706,28.4,\"k\",95.7,\"b\",0.000],[100,0,6706,971.9,\"k\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6411,393546]],[\"write\",[0,64,858]],[\"ops\",[0,1,73]]]]]]],[\"6552491.pbs.hpc.swin.edu.au\",[[\"sstar117\",[93,2,0,5,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0],[\"ave\",[93,2,0,4,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6045,365698]],[\"write\",[741589,809411,1048624]],[\"ops\",[0,1,73]]]]]]],[\"6552492.pbs.hpc.swin.edu.au\",[[\"sstar117\",[93,2,0,5,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0],[\"ave\",[93,2,0,4,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6045,365698]],[\"write\",[741589,809411,1048624]],[\"ops\",[0,1,73]]]]]]],[\"6552495.pbs.hpc.swin.edu.au\",[[\"sstar117\",[93,2,0,5,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0],[\"ave\",[93,2,0,4,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6045,365698]],[\"write\",[741589,809411,1048624]],[\"ops\",[0,1,73]]]]]]],[\"6552496.pbs.hpc.swin.edu.au\",[[\"sstar118\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6796,439821]],[\"write\",[439,453,1348]],[\"ops\",[2,3,75]]]]]]],[\"6552497.pbs.hpc.swin.edu.au\",[[\"sstar118\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6796,439821]],[\"write\",[439,453,1348]],[\"ops\",[2,3,75]]]]]]],[\"6552498.pbs.hpc.swin.edu.au\",[[\"sstar117\",[93,2,0,5,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0],[\"ave\",[93,2,0,4,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6045,365698]],[\"write\",[741589,809411,1048624]],[\"ops\",[0,1,73]]]]]]],[\"6552501.pbs.hpc.swin.edu.au\",[[\"sstar118\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6796,439821]],[\"write\",[439,453,1348]],[\"ops\",[2,3,75]]]]]]],[\"6552502.pbs.hpc.swin.edu.au\",[[\"sstar118\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6796,439821]],[\"write\",[439,453,1348]],[\"ops\",[2,3,75]]]]]]],[\"6552504.pbs.hpc.swin.edu.au\",[[\"sstar117\",[93,2,0,5,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0],[\"ave\",[93,2,0,4,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6045,365698]],[\"write\",[741589,809411,1048624]],[\"ops\",[0,1,73]]]]]]],[\"6552505.pbs.hpc.swin.edu.au\",[[\"sstar116\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5711,437569]],[\"write\",[1840504,1730129,2052825]],[\"ops\",[2,3,76]]]]]]],[\"6552506.pbs.hpc.swin.edu.au\",[[\"sstar116\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5711,437569]],[\"write\",[1840504,1730129,2052825]],[\"ops\",[2,3,76]]]]]]],[\"6552507.pbs.hpc.swin.edu.au\",[[\"sstar119\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[819,6572,449445]],[\"write\",[104849,5777,104881]],[\"ops\",[0,1,73]]]]]]],[\"6552508.pbs.hpc.swin.edu.au\",[[\"sstar123\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0],[\"ave\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7782,376051]],[\"write\",[0,4775,104873]],[\"ops\",[0,3,100]]]]]]],[\"6552509.pbs.hpc.swin.edu.au\",[[\"sstar126\",[95,2,0,3,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0],[\"ave\",[95,2,0,2,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5703,333346]],[\"write\",[0,13136,157427]],[\"ops\",[0,1,72]]]]]]],[\"6552511.pbs.hpc.swin.edu.au\",[[\"sstar120\",[97,1,0,2,0,19801,30.8,\"k\",101.7,\"b\",0.000],[99,0,24297,746.5,\"k\",1.3,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,19801,30.8,\"k\",101.7,\"b\",0.000],[99,0,24297,746.5,\"k\",1.3,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,8264,339279]],[\"write\",[0,4,437]],[\"ops\",[0,2,99]]]]]]],[\"6552512.pbs.hpc.swin.edu.au\",[[\"sstar120\",[97,1,0,2,0,19801,30.8,\"k\",101.7,\"b\",0.000],[99,0,24297,746.5,\"k\",1.3,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,19801,30.8,\"k\",101.7,\"b\",0.000],[99,0,24297,746.5,\"k\",1.3,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,8264,339279]],[\"write\",[0,4,437]],[\"ops\",[0,2,99]]]]]]],[\"6552513.pbs.hpc.swin.edu.au\",[[\"sstar126\",[95,2,0,3,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0],[\"ave\",[95,2,0,2,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5703,333346]],[\"write\",[0,13136,157427]],[\"ops\",[0,1,72]]]]]]],[\"6552514.pbs.hpc.swin.edu.au\",[[\"sstar126\",[95,2,0,3,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0],[\"ave\",[95,2,0,2,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5703,333346]],[\"write\",[0,13136,157427]],[\"ops\",[0,1,72]]]]]]],[\"6552515.pbs.hpc.swin.edu.au\",[[\"sstar126\",[95,2,0,3,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0],[\"ave\",[95,2,0,2,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5703,333346]],[\"write\",[0,13136,157427]],[\"ops\",[0,1,72]]]]]]],[\"6552516.pbs.hpc.swin.edu.au\",[[\"sstar120\",[97,1,0,2,0,19801,30.8,\"k\",101.7,\"b\",0.000],[99,0,24297,746.5,\"k\",1.3,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,19801,30.8,\"k\",101.7,\"b\",0.000],[99,0,24297,746.5,\"k\",1.3,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,8264,339279]],[\"write\",[0,4,437]],[\"ops\",[0,2,99]]]]]]],[\"6552517.pbs.hpc.swin.edu.au\",[[\"sstar127\",[97,1,0,2,0,15600,34.4,\"k\",100.5,\"b\",0.000],[99,0,18659,932.6,\"k\",1.6,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,15600,34.4,\"k\",100.5,\"b\",0.000],[99,0,18659,932.6,\"k\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,6103,315737]],[\"write\",[0,6056,104889]],[\"ops\",[0,1,72]]]]]]],[\"6552518.pbs.hpc.swin.edu.au\",[[\"sstar125\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5746,404111]],[\"write\",[13861,4544,104862]],[\"ops\",[0,2,100]]]]]]],[\"6552519.pbs.hpc.swin.edu.au\",[[\"sstar118\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6796,439821]],[\"write\",[439,453,1348]],[\"ops\",[2,3,75]]]]]]],[\"6552520.pbs.hpc.swin.edu.au\",[[\"sstar118\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6796,439821]],[\"write\",[439,453,1348]],[\"ops\",[2,3,75]]]]]]],[\"6552521.pbs.hpc.swin.edu.au\",[[\"sstar119\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[819,6572,449445]],[\"write\",[104849,5777,104881]],[\"ops\",[0,1,73]]]]]]],[\"6552522.pbs.hpc.swin.edu.au\",[[\"sstar125\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5746,404111]],[\"write\",[13861,4544,104862]],[\"ops\",[0,2,100]]]]]]],[\"6552523.pbs.hpc.swin.edu.au\",[[\"sstar119\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[819,6572,449445]],[\"write\",[104849,5777,104881]],[\"ops\",[0,1,73]]]]]]],[\"6552524.pbs.hpc.swin.edu.au\",[[\"sstar127\",[97,1,0,2,0,15600,34.4,\"k\",100.5,\"b\",0.000],[99,0,18659,932.6,\"k\",1.6,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,15600,34.4,\"k\",100.5,\"b\",0.000],[99,0,18659,932.6,\"k\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,6103,315737]],[\"write\",[0,6056,104889]],[\"ops\",[0,1,72]]]]]]],[\"6552525.pbs.hpc.swin.edu.au\",[[\"sstar127\",[97,1,0,2,0,15600,34.4,\"k\",100.5,\"b\",0.000],[99,0,18659,932.6,\"k\",1.6,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,15600,34.4,\"k\",100.5,\"b\",0.000],[99,0,18659,932.6,\"k\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,6103,315737]],[\"write\",[0,6056,104889]],[\"ops\",[0,1,72]]]]]]],[\"6552526.pbs.hpc.swin.edu.au\",[[\"sstar129\",[73,0,0,27,0,11155,26.7,\"k\",93.4,\"b\",0.000],[75,0,13829,926.3,\"k\",1.5,\"k\"],64531,0],[\"ave\",[73,0,0,26,0,11155,26.7,\"k\",93.4,\"b\",0.000],[75,0,13829,926.3,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5749,316038]],[\"write\",[0,5,459]],[\"ops\",[0,1,73]]]]]]],[\"6552527.pbs.hpc.swin.edu.au\",[[\"sstar122\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0],[\"ave\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5941,322085]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6552528.pbs.hpc.swin.edu.au\",[[\"sstar122\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0],[\"ave\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5941,322085]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6552529.pbs.hpc.swin.edu.au\",[[\"sstar122\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0],[\"ave\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5941,322085]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6552530.pbs.hpc.swin.edu.au\",[[\"sstar122\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0],[\"ave\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5941,322085]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6552531.pbs.hpc.swin.edu.au\",[[\"sstar122\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0],[\"ave\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5941,322085]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6552532.pbs.hpc.swin.edu.au\",[[\"sstar122\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0],[\"ave\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5941,322085]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6552533.pbs.hpc.swin.edu.au\",[[\"sstar125\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5746,404111]],[\"write\",[13861,4544,104862]],[\"ops\",[0,2,100]]]]]]],[\"6552534.pbs.hpc.swin.edu.au\",[[\"sstar129\",[73,0,0,27,0,11155,26.7,\"k\",93.4,\"b\",0.000],[75,0,13829,926.3,\"k\",1.5,\"k\"],64531,0],[\"ave\",[73,0,0,26,0,11155,26.7,\"k\",93.4,\"b\",0.000],[75,0,13829,926.3,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5749,316038]],[\"write\",[0,5,459]],[\"ops\",[0,1,73]]]]]]],[\"6552535.pbs.hpc.swin.edu.au\",[[\"sstar125\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5746,404111]],[\"write\",[13861,4544,104862]],[\"ops\",[0,2,100]]]]]]],[\"6552536.pbs.hpc.swin.edu.au\",[[\"sstar125\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5746,404111]],[\"write\",[13861,4544,104862]],[\"ops\",[0,2,100]]]]]]],[\"6552537.pbs.hpc.swin.edu.au\",[[\"sstar123\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0],[\"ave\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7782,376051]],[\"write\",[0,4775,104873]],[\"ops\",[0,3,100]]]]]]],[\"6552538.pbs.hpc.swin.edu.au\",[[\"sstar123\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0],[\"ave\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7782,376051]],[\"write\",[0,4775,104873]],[\"ops\",[0,3,100]]]]]]],[\"6552539.pbs.hpc.swin.edu.au\",[[\"sstar126\",[95,2,0,3,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0],[\"ave\",[95,2,0,2,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5703,333346]],[\"write\",[0,13136,157427]],[\"ops\",[0,1,72]]]]]]],[\"6552540.pbs.hpc.swin.edu.au\",[[\"sstar119\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[819,6572,449445]],[\"write\",[104849,5777,104881]],[\"ops\",[0,1,73]]]]]]],[\"6552541.pbs.hpc.swin.edu.au\",[[\"sstar126\",[95,2,0,3,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0],[\"ave\",[95,2,0,2,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5703,333346]],[\"write\",[0,13136,157427]],[\"ops\",[0,1,72]]]]]]],[\"6552542.pbs.hpc.swin.edu.au\",[[\"sstar119\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[819,6572,449445]],[\"write\",[104849,5777,104881]],[\"ops\",[0,1,73]]]]]]],[\"6552543.pbs.hpc.swin.edu.au\",[[\"sstar126\",[95,2,0,3,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0],[\"ave\",[95,2,0,2,0,33003,44.3,\"k\",106.3,\"b\",0.000],[99,0,37939,936.1,\"k\",1.5,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5703,333346]],[\"write\",[0,13136,157427]],[\"ops\",[0,1,72]]]]]]],[\"6552544.pbs.hpc.swin.edu.au\",[[\"sstar119\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[819,6572,449445]],[\"write\",[104849,5777,104881]],[\"ops\",[0,1,73]]]]]]],[\"6552545.pbs.hpc.swin.edu.au\",[[\"sstar128\",[98,1,0,1,0,15654,42.7,\"k\",108.0,\"b\",0.000],[100,0,18103,1.2,\"m\",1.6,\"k\"],64531,0],[\"ave\",[98,1,0,1,0,15654,42.7,\"k\",108.0,\"b\",0.000],[100,0,18103,1.2,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5901,428895]],[\"write\",[0,16874,157345]],[\"ops\",[0,1,72]]]]]]],[\"6552546.pbs.hpc.swin.edu.au\",[[\"sstar128\",[98,1,0,1,0,15654,42.7,\"k\",108.0,\"b\",0.000],[100,0,18103,1.2,\"m\",1.6,\"k\"],64531,0],[\"ave\",[98,1,0,1,0,15654,42.7,\"k\",108.0,\"b\",0.000],[100,0,18103,1.2,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5901,428895]],[\"write\",[0,16874,157345]],[\"ops\",[0,1,72]]]]]]],[\"6552547.pbs.hpc.swin.edu.au\",[[\"sstar128\",[98,1,0,1,0,15654,42.7,\"k\",108.0,\"b\",0.000],[100,0,18103,1.2,\"m\",1.6,\"k\"],64531,0],[\"ave\",[98,1,0,1,0,15654,42.7,\"k\",108.0,\"b\",0.000],[100,0,18103,1.2,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5901,428895]],[\"write\",[0,16874,157345]],[\"ops\",[0,1,72]]]]]]],[\"6552548.pbs.hpc.swin.edu.au\",[[\"sstar119\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33810,37.6,\"k\",102.9,\"b\",0.000],[99,0,39614,1.1,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[819,6572,449445]],[\"write\",[104849,5777,104881]],[\"ops\",[0,1,73]]]]]]],[\"6552549.pbs.hpc.swin.edu.au\",[[\"sstar125\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0],[\"ave\",[95,2,0,3,0,33397,39.7,\"k\",109.3,\"b\",0.000],[99,0,37746,1.0,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5746,404111]],[\"write\",[13861,4544,104862]],[\"ops\",[0,2,100]]]]]]],[\"6552550.pbs.hpc.swin.edu.au\",[[\"sstar123\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0],[\"ave\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7782,376051]],[\"write\",[0,4775,104873]],[\"ops\",[0,3,100]]]]]]],[\"6552551.pbs.hpc.swin.edu.au\",[[\"sstar123\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0],[\"ave\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7782,376051]],[\"write\",[0,4775,104873]],[\"ops\",[0,3,100]]]]]]],[\"6552552.pbs.hpc.swin.edu.au\",[[\"sstar123\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0],[\"ave\",[95,2,0,3,0,33390,37.4,\"k\",108.5,\"b\",0.000],[98,0,37940,820.7,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7782,376051]],[\"write\",[0,4775,104873]],[\"ops\",[0,3,100]]]]]]],[\"6552553.pbs.hpc.swin.edu.au\",[[\"sstar122\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0],[\"ave\",[83,2,0,15,0,33396,27.6,\"k\",94.4,\"b\",0.000],[87,0,41226,889.3,\"k\",1.4,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5941,322085]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6552554.pbs.hpc.swin.edu.au\",[[\"sstar116\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5711,437569]],[\"write\",[1840504,1730129,2052825]],[\"ops\",[2,3,76]]]]]]],[\"6552555.pbs.hpc.swin.edu.au\",[[\"sstar116\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5711,437569]],[\"write\",[1840504,1730129,2052825]],[\"ops\",[2,3,76]]]]]]],[\"6552556.pbs.hpc.swin.edu.au\",[[\"sstar117\",[93,2,0,5,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0],[\"ave\",[93,2,0,4,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6045,365698]],[\"write\",[741589,809411,1048624]],[\"ops\",[0,1,73]]]]]]],[\"6552557.pbs.hpc.swin.edu.au\",[[\"sstar117\",[93,2,0,5,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0],[\"ave\",[93,2,0,4,0,32989,841.7,\"k\",696.8,\"b\",0.000],[99,0,39035,1.6,\"m\",2.1,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6045,365698]],[\"write\",[741589,809411,1048624]],[\"ops\",[0,1,73]]]]]]],[\"6552558.pbs.hpc.swin.edu.au\",[[\"sstar123\",[94,2,0,4,0,33918,29.9,\"k\",95.1,\"b\",0.000],[98,0,37940,727.8,\"k\",1.3,\"k\"],64531,0],[\"ave\",[94,2,0,3,0,33918,29.9,\"k\",95.1,\"b\",0.000],[98,0,37940,727.8,\"k\",1.3,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5175,376051]],[\"write\",[0,5458,104873]],[\"ops\",[0,1,73]]]]]]],[\"6552559.pbs.hpc.swin.edu.au\",[[\"sstar120\",[97,1,0,2,0,19374,27.0,\"k\",94.0,\"b\",0.000],[99,0,22968,701.7,\"k\",1.3,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,19374,27.0,\"k\",94.0,\"b\",0.000],[99,0,22968,701.7,\"k\",1.3,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5829,271592]],[\"write\",[0,5,437]],[\"ops\",[0,1,72]]]]]]],[\"6552560.pbs.hpc.swin.edu.au\",[[\"sstar125\",[95,2,0,3,0,33228,37.9,\"k\",106.1,\"b\",0.000],[99,0,37746,752.6,\"k\",1.3,\"k\"],64526,0],[\"ave\",[95,2,0,2,0,33228,37.9,\"k\",106.1,\"b\",0.000],[99,0,37746,752.6,\"k\",1.3,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,9011,404111]],[\"write\",[13861,2411,104862]],[\"ops\",[0,1,73]]]]]]],[\"6552631.pbs.hpc.swin.edu.au\",[[\"sstar145\",[30,0,0,70,0,9034,29.0,\"k\",94.5,\"b\",0.000],[100,0,9037,926.3,\"k\",1.5,\"k\"],64526,0],[\"ave\",[30,0,0,70,0,9034,29.0,\"k\",94.5,\"b\",0.000],[100,0,9037,926.3,\"k\",1.5,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,7246,381874]],[\"write\",[0,3,209]],[\"ops\",[0,1,73]]]]]]],[\"6552634.pbs.hpc.swin.edu.au\",[[\"sstar142\",[43,0,0,57,0,5315,29.0,\"k\",95.5,\"b\",0.000],[49,0,5316,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[43,0,0,56,0,5315,29.0,\"k\",95.5,\"b\",0.000],[49,0,5316,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6576,388017]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6553729.pbs.hpc.swin.edu.au\",[[\"gstar051\",[17,7,0,76,98,3167,7.8,\"m\",5.8,\"k\",0.000],[17,99,3774,8.3,\"m\",6.8,\"k\"],48389,0],[\"ave\",[17,7,0,75,98,3167,7.8,\"m\",5.8,\"k\",0.000],[17,99,3774,8.3,\"m\",6.8,\"k\"],48389,0,[[\"lustre\",[\"read\",[409,5938,420369]],[\"write\",[8028032,7934996,8073711]],[\"ops\",[0,1,73]]]]]]],[\"6553733.pbs.hpc.swin.edu.au\",[[\"gstar022\",[75,0,0,25,0,3239,117.1,\"k\",159.2,\"b\",0.000],[80,0,3244,3.4,\"m\",2.6,\"k\"],48389,0],[\"ave\",[75,0,0,24,0,3239,117.1,\"k\",159.2,\"b\",0.000],[80,0,3244,3.4,\"m\",2.6,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,6306,487678]],[\"write\",[0,59035,2726649]],[\"ops\",[0,0,72]]]]]]],[\"6553861.pbs.hpc.swin.edu.au\",[[\"sstar155\",[93,0,0,7,0,55130,27.9,\"k\",95.5,\"b\",0.000],[93,0,55727,956.5,\"k\",1.5,\"k\"],64531,0],[\"ave\",[93,0,0,7,0,55130,27.9,\"k\",95.5,\"b\",0.000],[93,0,55727,956.5,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6084,373479]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6553862.pbs.hpc.swin.edu.au\",[[\"sstar158\",[93,0,0,7,0,55704,52.6,\"k\",117.1,\"b\",0.000],[93,0,56010,3.2,\"m\",2.6,\"k\"],64531,0],[\"ave\",[93,0,0,7,0,55704,52.6,\"k\",117.1,\"b\",0.000],[93,0,56010,3.2,\"m\",2.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,11788,1507776]],[\"write\",[0,4203,1043892]],[\"ops\",[0,1,72]]]]]]],[\"6553863.pbs.hpc.swin.edu.au\",[[\"sstar159\",[93,0,0,7,0,34555,38.5,\"k\",103.6,\"b\",0.000],[93,0,34597,2.7,\"m\",2.1,\"k\"],64531,0],[\"ave\",[93,0,0,7,0,34555,38.5,\"k\",103.6,\"b\",0.000],[93,0,34597,2.7,\"m\",2.1,\"k\"],64531,0,[[\"lustre\",[\"read\",[614,21336,1259231]],[\"write\",[0,10068,887483]],[\"ops\",[0,1,73]]]]]]],[\"6553864.pbs.hpc.swin.edu.au\",[[\"sstar121\",[99,0,0,1,0,21908,40.1,\"k\",107.0,\"b\",0.000],[100,0,21942,2.1,\"m\",1.7,\"k\"],64531,0],[\"ave\",[99,0,0,1,0,21908,40.1,\"k\",107.0,\"b\",0.000],[100,0,21942,2.1,\"m\",1.7,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,13594,996725]],[\"write\",[0,8108,730795]],[\"ops\",[0,1,73]]]]]]],[\"6554242.pbs.hpc.swin.edu.au\",[[\"sstar146\",[95,1,0,4,0,6695,215.0,\"k\",237.1,\"b\",0.000],[100,0,6778,48.9,\"m\",36.3,\"k\"],64527,0],[\"ave\",[95,1,0,4,0,6695,215.0,\"k\",237.1,\"b\",0.000],[100,0,6778,48.9,\"m\",36.3,\"k\"],64527,0,[[\"lustre\",[\"read\",[0,7188,420164]],[\"write\",[0,292448,39434728]],[\"ops\",[0,1,72]]]]]]],[\"6554251.pbs.hpc.swin.edu.au\",[[\"sstar116\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,58139,1.7,\"m\",1.4,\"k\",0.000],[99,0,62130,2.7,\"m\",2.9,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,5711,437569]],[\"write\",[1840504,1730129,2052825]],[\"ops\",[2,3,76]]]]]]],[\"6554254.pbs.hpc.swin.edu.au\",[[\"sstar118\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[96,2,0,2,0,59473,36.1,\"k\",109.7,\"b\",0.000],[99,0,64249,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6796,439821]],[\"write\",[439,453,1348]],[\"ops\",[2,3,75]]]]]]],[\"6554257.pbs.hpc.swin.edu.au\",[[\"sstar130\",[68,0,0,32,0,27056,413.9,\"k\",395.2,\"b\",0.000],[68,0,27297,21.8,\"m\",16.6,\"k\"],64526,0],[\"ave\",[68,0,0,32,0,27056,413.9,\"k\",395.2,\"b\",0.000],[68,0,27297,21.8,\"m\",16.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,445859,25481182]],[\"write\",[241,440,13514]],[\"ops\",[0,3,291]]]]]]],[\"6554264.pbs.hpc.swin.edu.au\",[[\"sstar139\",[68,0,0,32,0,16838,28.4,\"k\",96.8,\"b\",0.000],[68,0,16906,939.6,\"k\",1.5,\"k\"],64531,0],[\"ave\",[68,0,0,32,0,16838,28.4,\"k\",96.8,\"b\",0.000],[68,0,16906,939.6,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5557,432654]],[\"write\",[184,306,727]],[\"ops\",[0,1,73]]]]]]],[\"6554977.pbs.hpc.swin.edu.au\",[[\"sstar131\",[71,0,0,29,0,5170,437.1,\"k\",410.0,\"b\",0.000],[80,0,5379,21.0,\"m\",16.0,\"k\"],64531,0],[\"ave\",[71,0,0,29,0,5170,437.1,\"k\",410.0,\"b\",0.000],[80,0,5379,21.0,\"m\",16.0,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,441424,24747361]],[\"write\",[7080,32123,269524]],[\"ops\",[0,3,223]]]]]]],[\"6554980.pbs.hpc.swin.edu.au\",[[\"sstar149\",[68,0,0,32,0,5851,78.4,\"k\",132.7,\"b\",0.000],[71,0,5872,13.2,\"m\",9.8,\"k\"],64531,0],[\"ave\",[68,0,0,32,0,5851,78.4,\"k\",132.7,\"b\",0.000],[71,0,5872,13.2,\"m\",9.8,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6472,479749]],[\"write\",[0,79223,10695210]],[\"ops\",[0,1,73]]]]]]],[\"6554981.pbs.hpc.swin.edu.au\",[[\"sstar153\",[70,0,0,30,0,6615,74.9,\"k\",129.4,\"b\",0.000],[76,0,6637,12.4,\"m\",9.2,\"k\"],64531,0],[\"ave\",[70,0,0,30,0,6615,74.9,\"k\",129.4,\"b\",0.000],[76,0,6637,12.4,\"m\",9.2,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6210,322494]],[\"write\",[0,77653,10483216]],[\"ops\",[0,1,72]]]]]]],[\"6554984.pbs.hpc.swin.edu.au\",[[\"sstar156\",[95,0,0,5,0,19747,230.3,\"k\",244.7,\"b\",0.000],[100,0,19838,53.0,\"m\",39.3,\"k\"],64531,0],[\"ave\",[95,0,0,5,0,19747,230.3,\"k\",244.7,\"b\",0.000],[100,0,19838,53.0,\"m\",39.3,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7283,385765]],[\"write\",[0,158450,42781669]],[\"ops\",[0,0,72]]]]]]],[\"6554987.pbs.hpc.swin.edu.au\",[[\"sstar157\",[94,0,0,6,0,17534,29.5,\"k\",99.8,\"b\",0.000],[98,0,17540,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[94,0,0,6,0,17534,29.5,\"k\",99.8,\"b\",0.000],[98,0,17540,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6166,481124]],[\"write\",[0,0,0]],[\"ops\",[0,0,73]]]]]]],[\"6554988.pbs.hpc.swin.edu.au\",[[\"sstar144\",[88,0,0,12,0,13843,29.4,\"k\",96.3,\"b\",0.000],[97,0,13934,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[88,0,0,12,0,13843,29.4,\"k\",96.3,\"b\",0.000],[97,0,13934,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6391,499610]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6554989.pbs.hpc.swin.edu.au\",[[\"sstar148\",[46,18,0,36,0,6851,129.5,\"k\",170.8,\"b\",0.000],[73,0,6872,13.3,\"m\",9.8,\"k\"],64531,0],[\"ave\",[46,18,0,36,0,6851,129.5,\"k\",170.8,\"b\",0.000],[73,0,6872,13.3,\"m\",9.8,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6458,444735]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6554990.pbs.hpc.swin.edu.au\",[[\"sstar151\",[96,0,0,4,0,20957,28.8,\"k\",94.6,\"b\",0.000],[100,0,20958,1.0,\"m\",1.6,\"k\"],64526,0],[\"ave\",[96,0,0,4,0,20957,28.8,\"k\",94.6,\"b\",0.000],[100,0,20958,1.0,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,7247,410540]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6554992.pbs.hpc.swin.edu.au\",[[\"sstar141\",[67,4,0,29,0,25514,27.4,\"k\",93.3,\"b\",0.000],[99,0,25518,966.8,\"k\",1.6,\"k\"],64524,0],[\"ave\",[67,4,0,28,0,25514,27.4,\"k\",93.3,\"b\",0.000],[99,0,25518,966.8,\"k\",1.6,\"k\"],64524,0,[[\"lustre\",[\"read\",[0,6317,333448]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6554993.pbs.hpc.swin.edu.au\",[[\"sstar152\",[68,4,0,28,0,7776,128.3,\"k\",170.6,\"b\",0.000],[93,0,7793,13.2,\"m\",9.8,\"k\"],64531,0],[\"ave\",[68,4,0,27,0,7776,128.3,\"k\",170.6,\"b\",0.000],[93,0,7793,13.2,\"m\",9.8,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6659,503910]],[\"write\",[0,0,0]],[\"ops\",[0,0,72]]]]]]],[\"6555129.pbs.hpc.swin.edu.au\",[[\"gstar036\",[84,7,0,9,97,5876,11.6,\"k\",64.6,\"b\",0.000],[84,98,5877,28.3,\"k\",119.7,\"b\"],48389,0],[\"ave\",[84,7,0,9,97,5876,11.6,\"k\",64.6,\"b\",0.000],[84,98,5877,28.3,\"k\",119.7,\"b\"],48389,0,[[\"lustre\",[\"read\",[0,0,0]],[\"write\",[0,0,0]],[\"ops\",[0,0,3]]]]]]],[\"6555130.pbs.hpc.swin.edu.au\",[[\"gstar033\",[63,3,0,34,49,2234,28.9,\"k\",93.7,\"b\",0.000],[63,49,2236,904.1,\"k\",1.5,\"k\"],48389,0],[\"ave\",[63,3,0,34,49,2234,28.9,\"k\",93.7,\"b\",0.000],[63,49,2236,904.1,\"k\",1.5,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,6134,449172]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6555131.pbs.hpc.swin.edu.au\",[[\"gstar052\",[84,6,0,10,97,2656,27.8,\"k\",94.1,\"b\",0.000],[85,98,2657,909.0,\"k\",1.5,\"k\"],48389,0],[\"ave\",[84,6,0,9,97,2656,27.8,\"k\",94.1,\"b\",0.000],[85,98,2657,909.0,\"k\",1.5,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,7021,349424]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6555132.pbs.hpc.swin.edu.au\",[[\"gstar054\",[67,7,0,26,97,2645,28.5,\"k\",92.9,\"b\",0.000],[68,98,2648,879.7,\"k\",1.5,\"k\"],48389,0],[\"ave\",[67,7,0,25,97,2645,28.5,\"k\",92.9,\"b\",0.000],[68,98,2648,879.7,\"k\",1.5,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,7804,351882]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6555133.pbs.hpc.swin.edu.au\",[[\"gstar032\",[75,8,0,17,97,5738,11.9,\"k\",65.5,\"b\",0.000],[75,98,5739,27.4,\"k\",116.2,\"b\"],48389,0],[\"ave\",[75,8,0,17,97,5738,11.9,\"k\",65.5,\"b\",0.000],[75,98,5739,27.4,\"k\",116.2,\"b\"],48389,0,[[\"lustre\",[\"read\",[0,0,0]],[\"write\",[0,0,0]],[\"ops\",[0,0,3]]]]]]],[\"6555134.pbs.hpc.swin.edu.au\",[[\"gstar050\",[86,6,0,8,96,2672,138.7,\"k\",189.8,\"b\",0.000],[94,98,2722,28.6,\"m\",23.8,\"k\"],48389,0],[\"ave\",[86,6,0,7,96,2672,138.7,\"k\",189.8,\"b\",0.000],[94,98,2722,28.6,\"m\",23.8,\"k\"],48389,0,[[\"lustre\",[\"read\",[614,12997,1669777]],[\"write\",[0,1221,159459]],[\"ops\",[0,3,254]]]]]]],[\"6555135.pbs.hpc.swin.edu.au\",[[\"gstar013\",[78,0,0,22,0,6602,30.7,\"k\",96.3,\"b\",0.000],[91,0,6605,904.5,\"k\",1.5,\"k\"],48389,0],[\"ave\",[78,0,0,22,0,6602,30.7,\"k\",96.3,\"b\",0.000],[91,0,6605,904.5,\"k\",1.5,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,8215,499558]],[\"write\",[0,0,0]],[\"ops\",[3,1,77]]]]]]],[\"6555136.pbs.hpc.swin.edu.au\",[[\"gstar055\",[93,6,0,1,98,2663,29.1,\"k\",97.1,\"b\",0.000],[93,99,2664,947.0,\"k\",1.6,\"k\"],48389,0],[\"ave\",[93,6,0,1,98,2663,29.1,\"k\",97.1,\"b\",0.000],[93,99,2664,947.0,\"k\",1.6,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,8372,432040]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6555137.pbs.hpc.swin.edu.au\",[[\"gstar053\",[84,7,0,9,98,2658,28.6,\"k\",95.9,\"b\",0.000],[85,99,2661,882.3,\"k\",1.5,\"k\"],48389,0],[\"ave\",[84,7,0,9,98,2658,28.6,\"k\",95.9,\"b\",0.000],[85,99,2661,882.3,\"k\",1.5,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,6374,333142]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6555138.pbs.hpc.swin.edu.au\",[[\"gstar034\",[71,3,0,26,49,5367,11.6,\"k\",64.7,\"b\",0.000],[72,49,5368,22.4,\"k\",108.0,\"b\"],48389,0],[\"ave\",[71,3,0,25,49,5367,11.6,\"k\",64.7,\"b\",0.000],[72,49,5368,22.4,\"k\",108.0,\"b\"],48389,0,[[\"lustre\",[\"read\",[0,0,0]],[\"write\",[0,0,0]],[\"ops\",[1,0,2]]]]]]],[\"6555139.pbs.hpc.swin.edu.au\",[[\"gstar015\",[82,0,0,18,0,6601,28.0,\"k\",92.3,\"b\",0.000],[91,0,6603,862.6,\"k\",1.4,\"k\"],48389,0],[\"ave\",[82,0,0,18,0,6601,28.0,\"k\",92.3,\"b\",0.000],[91,0,6603,862.6,\"k\",1.4,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,8097,383103]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6555140.pbs.hpc.swin.edu.au\",[[\"gstar012\",[83,0,0,17,0,4925,11.1,\"k\",62.5,\"b\",0.000],[83,0,4925,27.2,\"k\",116.8,\"b\"],48389,0],[\"ave\",[83,0,0,17,0,4925,11.1,\"k\",62.5,\"b\",0.000],[83,0,4925,27.2,\"k\",116.8,\"b\"],48389,0,[[\"lustre\",[\"read\",[0,0,0]],[\"write\",[0,0,0]],[\"ops\",[0,0,2]]]]]]],[\"6555141.pbs.hpc.swin.edu.au\",[[\"gstar035\",[88,3,0,9,48,5318,195.1,\"k\",200.0,\"b\",0.000],[90,48,5342,24.2,\"m\",17.9,\"k\"],48389,0],[\"ave\",[88,3,0,9,48,5318,195.1,\"k\",200.0,\"b\",0.000],[90,48,5342,24.2,\"m\",17.9,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,1,204]],[\"write\",[0,148128,19972703]],[\"ops\",[0,0,3]]]]]]],[\"6555142.pbs.hpc.swin.edu.au\",[[\"gstar057\",[76,7,0,17,96,2683,132.3,\"k\",178.4,\"b\",0.000],[76,98,2715,24.5,\"m\",18.2,\"k\"],48389,0],[\"ave\",[76,7,0,17,96,2683,132.3,\"k\",178.4,\"b\",0.000],[76,98,2715,24.5,\"m\",18.2,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,13873,983250]],[\"write\",[0,148148,19975290]],[\"ops\",[0,3,148]]]]]]],[\"6555143.pbs.hpc.swin.edu.au\",[[\"gstar044\",[92,7,0,1,98,2663,31.2,\"k\",100.0,\"b\",0.000],[93,99,2664,1.2,\"m\",2.0,\"k\"],48389,0],[\"ave\",[92,7,0,1,98,2663,31.2,\"k\",100.0,\"b\",0.000],[93,99,2664,1.2,\"m\",2.0,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,8479,666284]],[\"write\",[0,0,0]],[\"ops\",[0,1,77]]]]]]],[\"6555144.pbs.hpc.swin.edu.au\",[[\"gstar045\",[92,7,0,1,98,2662,30.2,\"k\",99.4,\"b\",0.000],[93,99,2663,875.1,\"k\",1.5,\"k\"],48389,0],[\"ave\",[92,7,0,1,98,2662,30.2,\"k\",99.4,\"b\",0.000],[93,99,2663,875.1,\"k\",1.5,\"k\"],48389,0,[[\"lustre\",[\"read\",[409,8443,277737]],[\"write\",[0,0,0]],[\"ops\",[0,1,72]]]]]]],[\"6555145.pbs.hpc.swin.edu.au\",[[\"gstar014\",[82,0,0,18,0,6596,29.1,\"k\",91.5,\"b\",0.000],[91,0,6597,938.3,\"k\",1.5,\"k\"],48389,0],[\"ave\",[82,0,0,18,0,6596,29.1,\"k\",91.5,\"b\",0.000],[91,0,6597,938.3,\"k\",1.5,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,7686,414636]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6555146.pbs.hpc.swin.edu.au\",[[\"gstar039\",[92,7,0,1,96,5784,139.6,\"k\",162.9,\"b\",0.000],[93,97,5787,16.3,\"m\",12.2,\"k\"],48389,0],[\"ave\",[92,7,0,1,96,5784,139.6,\"k\",162.9,\"b\",0.000],[93,97,5787,16.3,\"m\",12.2,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,1,204]],[\"write\",[0,148016,19982166]],[\"ops\",[0,0,2]]]]]]],[\"6555147.pbs.hpc.swin.edu.au\",[[\"gstar031\",[84,6,0,10,98,2664,27.9,\"k\",91.7,\"b\",0.000],[85,99,2665,923.0,\"k\",1.6,\"k\"],48389,0],[\"ave\",[84,6,0,9,98,2664,27.9,\"k\",91.7,\"b\",0.000],[85,99,2665,923.0,\"k\",1.6,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,6016,352389]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6556756.pbs.hpc.swin.edu.au\",[[\"sstar132\",[74,0,0,26,0,2085,52.2,\"k\",113.9,\"b\",0.000],[75,0,2088,941.5,\"k\",1.5,\"k\"],64531,0],[\"ave\",[74,0,0,25,0,2085,52.2,\"k\",113.9,\"b\",0.000],[75,0,2088,941.5,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5926,445349]],[\"write\",[0,30545,157345]],[\"ops\",[0,1,73]]]]]]],[\"6556757.pbs.hpc.swin.edu.au\",[[\"sstar136\",[56,0,0,44,0,2008,34.9,\"k\",97.1,\"b\",0.000],[56,0,2010,1.1,\"m\",1.7,\"k\"],64531,0],[\"ave\",[56,0,0,44,0,2008,34.9,\"k\",97.1,\"b\",0.000],[56,0,2010,1.1,\"m\",1.7,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6513,306523]],[\"write\",[0,7449,157296]],[\"ops\",[0,1,72]]]]]]],[\"6556758.pbs.hpc.swin.edu.au\",[[\"sstar139\",[68,0,0,32,0,16838,28.4,\"k\",96.8,\"b\",0.000],[68,0,16906,939.6,\"k\",1.5,\"k\"],64531,0],[\"ave\",[68,0,0,32,0,16838,28.4,\"k\",96.8,\"b\",0.000],[68,0,16906,939.6,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5557,432654]],[\"write\",[184,306,727]],[\"ops\",[0,1,73]]]]]]],[\"6556759.pbs.hpc.swin.edu.au\",[[\"sstar129\",[73,0,0,27,0,11155,26.7,\"k\",93.4,\"b\",0.000],[75,0,13829,926.3,\"k\",1.5,\"k\"],64531,0],[\"ave\",[73,0,0,26,0,11155,26.7,\"k\",93.4,\"b\",0.000],[75,0,13829,926.3,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5749,316038]],[\"write\",[0,5,459]],[\"ops\",[0,1,73]]]]]]],[\"6556760.pbs.hpc.swin.edu.au\",[[\"sstar127\",[97,1,0,2,0,15600,34.4,\"k\",100.5,\"b\",0.000],[99,0,18659,932.6,\"k\",1.6,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,15600,34.4,\"k\",100.5,\"b\",0.000],[99,0,18659,932.6,\"k\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,6103,315737]],[\"write\",[0,6056,104889]],[\"ops\",[0,1,72]]]]]]],[\"6556761.pbs.hpc.swin.edu.au\",[[\"sstar120\",[97,1,0,2,0,19801,30.8,\"k\",101.7,\"b\",0.000],[99,0,24297,746.5,\"k\",1.3,\"k\"],64526,0],[\"ave\",[97,1,0,2,0,19801,30.8,\"k\",101.7,\"b\",0.000],[99,0,24297,746.5,\"k\",1.3,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,8264,339279]],[\"write\",[0,4,437]],[\"ops\",[0,2,99]]]]]]],[\"6556762.pbs.hpc.swin.edu.au\",[[\"sstar128\",[98,1,0,1,0,15654,42.7,\"k\",108.0,\"b\",0.000],[100,0,18103,1.2,\"m\",1.6,\"k\"],64531,0],[\"ave\",[98,1,0,1,0,15654,42.7,\"k\",108.0,\"b\",0.000],[100,0,18103,1.2,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5901,428895]],[\"write\",[0,16874,157345]],[\"ops\",[0,1,72]]]]]]],[\"6556763.pbs.hpc.swin.edu.au\",[[\"sstar147\",[99,0,0,1,0,2000,29.1,\"k\",99.1,\"b\",0.000],[100,0,2004,930.5,\"k\",1.5,\"k\"],64531,0],[\"ave\",[99,0,0,1,0,2000,29.1,\"k\",99.1,\"b\",0.000],[100,0,2004,930.5,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5911,439821]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6556764.pbs.hpc.swin.edu.au\",[[\"sstar147\",[99,0,0,1,0,2000,29.1,\"k\",99.1,\"b\",0.000],[100,0,2004,930.5,\"k\",1.5,\"k\"],64531,0],[\"ave\",[99,0,0,1,0,2000,29.1,\"k\",99.1,\"b\",0.000],[100,0,2004,930.5,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,5911,439821]],[\"write\",[0,0,0]],[\"ops\",[0,1,73]]]]]]],[\"6556765.pbs.hpc.swin.edu.au\",[[\"sstar134\",[99,0,0,1,0,4592,396.7,\"k\",380.5,\"b\",0.000],[100,0,4930,20.5,\"m\",15.6,\"k\"],64531,0],[\"ave\",[99,0,0,1,0,4592,396.7,\"k\",380.5,\"b\",0.000],[100,0,4930,20.5,\"m\",15.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,438619,24117992]],[\"write\",[0,3,893]],[\"ops\",[0,3,223]]]]]]],[\"6559532.pbs.hpc.swin.edu.au\",[[\"sstar019\",[87,0,0,13,0,6300,77.2,\"k\",116.1,\"b\",0.000],[87,0,6305,402.7,\"k\",398.5,\"b\"],64535,0],[\"ave\",[87,0,0,13,0,6300,77.2,\"k\",116.1,\"b\",0.000],[87,0,6305,402.7,\"k\",398.5,\"b\"],64535,0,[[\"lustre\",[\"read\",[0,20,614]],[\"write\",[0,66966,294378]],[\"ops\",[2,0,5]]]]]]],[\"6559533.pbs.hpc.swin.edu.au\",[[\"sstar101\",[87,0,0,13,0,6861,65.4,\"k\",109.1,\"b\",0.000],[87,0,6864,381.1,\"k\",392.8,\"b\"],64526,0],[\"ave\",[87,0,0,13,0,6861,65.4,\"k\",109.1,\"b\",0.000],[87,0,6864,381.1,\"k\",392.8,\"b\"],64526,0,[[\"lustre\",[\"read\",[0,20,613]],[\"write\",[0,68374,294333]],[\"ops\",[0,0,5]]]]]]],[\"6559553.pbs.hpc.swin.edu.au\",[[\"gstar020\",[50,0,0,50,0,2812,650.4,\"k\",551.3,\"b\",0.000],[76,0,2984,12.3,\"m\",10.0,\"k\"],48389,0],[\"ave\",[50,0,0,50,0,2812,650.4,\"k\",551.3,\"b\",0.000],[76,0,2984,12.3,\"m\",10.0,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,7087,514919]],[\"write\",[368,657625,9181017]],[\"ops\",[0,1,73]]]]]]],[\"6559574.pbs.hpc.swin.edu.au\",[[\"sstar165\",[87,0,0,13,0,6264,84.0,\"k\",123.4,\"b\",0.000],[87,0,6266,162.6,\"k\",226.1,\"b\"],64526,0],[\"ave\",[87,0,0,13,0,6264,84.0,\"k\",123.4,\"b\",0.000],[87,0,6266,162.6,\"k\",226.1,\"b\"],64526,0,[[\"lustre\",[\"read\",[0,14,409]],[\"write\",[104748,74659,150739]],[\"ops\",[0,0,3]]]]]]],[\"6559575.pbs.hpc.swin.edu.au\",[[\"sstar154\",[87,0,0,13,0,2304,104.5,\"k\",151.4,\"b\",0.000],[87,0,2307,1.1,\"m\",1.6,\"k\"],64526,0],[\"ave\",[87,0,0,13,0,2304,104.5,\"k\",151.4,\"b\",0.000],[87,0,2307,1.1,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,6906,467054]],[\"write\",[104748,67311,182667]],[\"ops\",[0,1,72]]]]]]],[\"6559576.pbs.hpc.swin.edu.au\",[[\"sstar133\",[93,0,0,7,0,2389,103.7,\"k\",150.6,\"b\",0.000],[93,0,2392,964.6,\"k\",1.5,\"k\"],64531,0],[\"ave\",[93,0,0,7,0,2389,103.7,\"k\",150.6,\"b\",0.000],[93,0,2392,964.6,\"k\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7717,267414]],[\"write\",[104748,72233,235471]],[\"ops\",[0,1,72]]]]]]],[\"6559577.pbs.hpc.swin.edu.au\",[[\"sstar022\",[87,0,0,13,0,5997,76.5,\"k\",116.6,\"b\",0.000],[87,0,6006,192.4,\"k\",238.8,\"b\"],64535,0],[\"ave\",[87,0,0,13,0,5997,76.5,\"k\",116.6,\"b\",0.000],[87,0,6006,192.4,\"k\",238.8,\"b\"],64535,0,[[\"lustre\",[\"read\",[0,16,409]],[\"write\",[52323,58634,116835]],[\"ops\",[0,0,3]]]]]]],[\"6559578.pbs.hpc.swin.edu.au\",[[\"sstar027\",[87,0,0,13,0,2120,90.6,\"k\",140.7,\"b\",0.000],[87,0,2122,969.8,\"k\",1.5,\"k\"],64535,0],[\"ave\",[87,0,0,13,0,2120,90.6,\"k\",140.7,\"b\",0.000],[87,0,2122,969.8,\"k\",1.5,\"k\"],64535,0,[[\"lustre\",[\"read\",[0,7328,346042]],[\"write\",[52323,63933,134052]],[\"ops\",[0,1,73]]]]]]],[\"6559579.pbs.hpc.swin.edu.au\",[[\"sstar102\",[87,0,0,13,0,6398,75.1,\"k\",116.3,\"b\",0.000],[87,0,6398,191.6,\"k\",233.8,\"b\"],64526,0],[\"ave\",[87,0,0,13,0,6398,75.1,\"k\",116.3,\"b\",0.000],[87,0,6398,191.6,\"k\",233.8,\"b\"],64526,0,[[\"lustre\",[\"read\",[0,16,409]],[\"write\",[116052,67101,133623]],[\"ops\",[0,0,5]]]]]]],[\"6559581.pbs.hpc.swin.edu.au\",[[\"sstar160\",[84,2,0,14,0,2069,63.3,\"k\",126.1,\"b\",0.000],[85,0,2170,2.5,\"m\",2.6,\"k\"],64526,0],[\"sstar161\",[84,2,0,14,0,6192,13.2,\"k\",68.8,\"b\",0.000],[85,0,6294,142.5,\"k\",333.5,\"b\"],64526,0],[\"sstar162\",[84,2,0,14,0,5828,13.7,\"k\",71.3,\"b\",0.000],[84,0,5927,146.1,\"k\",347.3,\"b\"],64531,0],[\"sstar163\",[84,2,0,14,0,2068,40.1,\"k\",108.1,\"b\",0.000],[85,0,2172,1.8,\"m\",2.0,\"k\"],64526,0],[\"ave\",[84,2,0,14,0,4039,32.6,\"k\",93.6,\"b\",0.000],[85,0,4141,1.1,\"m\",1.3,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,41359,3065845]],[\"write\",[41050,23462,70376]],[\"ops\",[0,3,146]]]]]]],[\"6559590.pbs.hpc.swin.edu.au\",[[\"gstar019\",[58,0,0,42,0,30138,26.9,\"k\",88.5,\"b\",0.000],[100,0,30139,906.6,\"k\",1.5,\"k\"],48389,0],[\"ave\",[58,0,0,42,0,30138,26.9,\"k\",88.5,\"b\",0.000],[100,0,30139,906.6,\"k\",1.5,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,6150,401653]],[\"write\",[0,5,290]],[\"ops\",[0,1,73]]]]]]],[\"6559598.pbs.hpc.swin.edu.au\",[[\"sstar164\",[99,0,0,1,0,6648,12.4,\"k\",73.1,\"b\",0.000],[100,0,6648,28.9,\"k\",130.8,\"b\"],64531,0],[\"ave\",[99,0,0,0,0,6648,12.4,\"k\",73.1,\"b\",0.000],[100,0,6648,28.9,\"k\",130.8,\"b\"],64531,0,[[\"lustre\",[\"read\",[0,0,204]],[\"write\",[0,0,0]],[\"ops\",[0,0,2]]]]]]],[\"6559601.pbs.hpc.swin.edu.au\",[[\"sstar107\",[87,0,0,13,0,2104,70.6,\"k\",127.5,\"b\",0.000],[87,0,2107,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[87,0,0,13,0,2104,70.6,\"k\",127.5,\"b\",0.000],[87,0,2107,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6254,460502]],[\"write\",[470,39125,82341]],[\"ops\",[0,1,74]]]]]]],[\"6559602.pbs.hpc.swin.edu.au\",[[\"sstar111\",[87,0,0,13,0,2119,69.3,\"k\",126.0,\"b\",0.000],[87,0,2120,1.0,\"m\",1.6,\"k\"],64526,0],[\"ave\",[87,0,0,13,0,2119,69.3,\"k\",126.0,\"b\",0.000],[87,0,2120,1.0,\"m\",1.6,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,7476,329661]],[\"write\",[81722,42589,98199]],[\"ops\",[0,1,72]]]]]]],[\"6559603.pbs.hpc.swin.edu.au\",[[\"sstar017\",[87,0,0,13,0,5908,56.0,\"k\",103.2,\"b\",0.000],[87,0,5913,132.9,\"k\",203.6,\"b\"],64535,0],[\"ave\",[87,0,0,13,0,5908,56.0,\"k\",103.2,\"b\",0.000],[87,0,5913,132.9,\"k\",203.6,\"b\"],64535,0,[[\"lustre\",[\"read\",[0,16,409]],[\"write\",[0,45285,82340]],[\"ops\",[0,0,3]]]]]]],[\"6559607.pbs.hpc.swin.edu.au\",[[\"sstar137\",[74,0,0,26,0,32041,28.3,\"k\",94.9,\"b\",0.000],[100,0,32042,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[74,0,0,26,0,32041,28.3,\"k\",94.9,\"b\",0.000],[100,0,32042,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6836,490136]],[\"write\",[0,19,309]],[\"ops\",[0,0,73]]]]]]],[\"6559613.pbs.hpc.swin.edu.au\",[[\"sstar143\",[87,0,0,13,0,2082,73.6,\"k\",129.0,\"b\",0.000],[87,0,2085,1.0,\"m\",1.5,\"k\"],64531,0],[\"ave\",[87,0,0,13,0,2082,73.6,\"k\",129.0,\"b\",0.000],[87,0,2085,1.0,\"m\",1.5,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,7514,348908]],[\"write\",[43137,43162,115447]],[\"ops\",[0,1,73]]]]]]],[\"6559614.pbs.hpc.swin.edu.au\",[[\"sstar015\",[87,0,0,13,0,5903,53.6,\"k\",98.6,\"b\",0.000],[87,0,5907,126.2,\"k\",177.4,\"b\"],64535,0],[\"ave\",[87,0,0,13,0,5903,53.6,\"k\",98.6,\"b\",0.000],[87,0,5907,126.2,\"k\",177.4,\"b\"],64535,0,[[\"lustre\",[\"read\",[0,6,204]],[\"write\",[43137,40810,86784]],[\"ops\",[0,0,5]]]]]]],[\"6559615.pbs.hpc.swin.edu.au\",[[\"sstar105\",[87,0,0,13,0,2083,73.1,\"k\",130.8,\"b\",0.000],[87,0,2085,1.0,\"m\",1.6,\"k\"],64531,0],[\"ave\",[87,0,0,13,0,2083,73.1,\"k\",130.8,\"b\",0.000],[87,0,2085,1.0,\"m\",1.6,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,6396,426307]],[\"write\",[0,44275,115878]],[\"ops\",[0,1,73]]]]]]],[\"6559621.pbs.hpc.swin.edu.au\",[[\"gstar049\",[87,12,0,1,98,3648,29.8,\"k\",96.9,\"b\",0.000],[89,99,3649,958.1,\"k\",1.6,\"k\"],48389,0],[\"ave\",[87,12,0,1,98,3648,29.8,\"k\",96.9,\"b\",0.000],[89,99,3649,958.1,\"k\",1.6,\"k\"],48389,0,[[\"lustre\",[\"read\",[0,7963,444326]],[\"write\",[0,0,0]],[\"ops\",[0,1,74]]]]]]],[\"6559821[19002].pbs.hpc.swin.edu.au\",[[\"sstar130\",[68,0,0,32,0,27108,623.6,\"k\",549.0,\"b\",0.000],[68,0,27297,21.8,\"m\",16.6,\"k\"],64526,0],[\"sstar131\",[72,0,0,28,0,5265,641.6,\"k\",556.9,\"b\",0.000],[76,0,5361,21.0,\"m\",16.0,\"k\"],64531,0],[\"sstar134\",[99,0,0,1,0,4843,588.3,\"k\",523.4,\"b\",0.000],[100,0,4924,20.5,\"m\",15.6,\"k\"],64531,0],[\"sstar138\",[49,0,0,51,0,4767,587.1,\"k\",522.0,\"b\",0.000],[50,0,4847,20.5,\"m\",15.6,\"k\"],64531,0],[\"ave\",[72,0,0,28,0,10496,610.1,\"k\",537.8,\"b\",0.000],[73,0,10607,21.0,\"m\",16.0,\"k\"],64531,0,[[\"lustre\",[\"read\",[0,2899910,98464528]],[\"write\",[7322,41422,269608]],[\"ops\",[0,8,285]]]]]]],[\"6559822.pbs.hpc.swin.edu.au\",[[\"sstar106\",[87,0,0,13,0,2098,99.7,\"k\",149.0,\"b\",0.000],[87,0,2099,869.9,\"k\",1.4,\"k\"],64527,0],[\"ave\",[87,0,0,13,0,2098,99.7,\"k\",149.0,\"b\",0.000],[87,0,2099,869.9,\"k\",1.4,\"k\"],64527,0,[[\"lustre\",[\"read\",[0,8800,403906]],[\"write\",[90578,68270,91357]],[\"ops\",[0,1,73]]]]]]],[\"6559823.pbs.hpc.swin.edu.au\",[[\"sstar103\",[87,0,0,13,0,6988,90.9,\"k\",126.6,\"b\",0.000],[87,0,6988,132.3,\"k\",176.3,\"b\"],64531,0],[\"ave\",[87,0,0,13,0,6988,90.9,\"k\",126.6,\"b\",0.000],[87,0,6988,132.3,\"k\",176.3,\"b\"],64531,0,[[\"lustre\",[\"read\",[0,0,0]],[\"write\",[91172,60079,91172]],[\"ops\",[0,0,1]]]]]]],[\"6559825.pbs.hpc.swin.edu.au\",[[\"sstar114\",[0,0,0,100,0,1871,200.5,\"k\",289.0,\"b\",0.000],[0,0,1875,6.2,\"m\",6.7,\"k\"],64526,0],[\"ave\",[0,0,0,100,0,1871,200.5,\"k\",289.0,\"b\",0.000],[0,0,1875,6.2,\"m\",6.7,\"k\"],64526,0,[[\"lustre\",[\"read\",[0,88101,2994051]],[\"write\",[0,0,0]],[\"ops\",[0,6,417]]]]]]]]</averages>\n" + "<jobs>[[\"6551082.pbs.hpc.swin.edu.au\",\"dme\",\"none\",[\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\",\"sstar124\"],[\"Job 6551082.pbs.hpc.swin.edu.au\",\"twhya\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 4G/247G\",\"Wall Time 166:01:00\",\"Remaining 01:59:00\"],[4842.9,253148.7,16,1,9217647,597660,604800,96.4,\"R\",\"1:ppn=16\"]],[\"6552491.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar117\",\"sstar117\"],[\"Job 6552491.pbs.hpc.swin.edu.au\",\"XY_18_0.5_18\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 47:54:53\",\"Remaining 52:05:07\"],[5946.5,6671.8,2,1,334166,172493,360000,96.9,\"R\",\"1:ppn=2\"]],[\"6552492.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar117\",\"sstar117\"],[\"Job 6552492.pbs.hpc.swin.edu.au\",\"XY_18_0.5_18\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 47:33:37\",\"Remaining 52:26:23\"],[5946.5,6671.8,2,1,333686,171217,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552495.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar117\",\"sstar117\"],[\"Job 6552495.pbs.hpc.swin.edu.au\",\"XY_18_0.5_18\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 44:41:22\",\"Remaining 55:18:38\"],[5946.5,6671.8,2,1,314278,160882,360000,97.7,\"R\",\"1:ppn=2\"]],[\"6552496.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar118\",\"sstar118\"],[\"Job 6552496.pbs.hpc.swin.edu.au\",\"XY_18_0.5_18\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 44:39:14\",\"Remaining 55:20:46\"],[5946.3,6671.8,2,1,313097,160754,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552497.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar118\",\"sstar118\"],[\"Job 6552497.pbs.hpc.swin.edu.au\",\"XY_18_0.5_18\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 44:10:18\",\"Remaining 55:49:42\"],[5946.2,6671.8,2,1,309396,159018,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552498.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar117\",\"sstar117\"],[\"Job 6552498.pbs.hpc.swin.edu.au\",\"XY_18_0.5_18\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 43:01:42\",\"Remaining 56:58:18\"],[5946.5,6671.8,2,1,301479,154902,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552501.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar118\",\"sstar118\"],[\"Job 6552501.pbs.hpc.swin.edu.au\",\"XY_18_0.5_19\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 42:47:35\",\"Remaining 57:12:25\"],[5946.2,6671.8,2,1,300157,154055,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552502.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar118\",\"sstar118\"],[\"Job 6552502.pbs.hpc.swin.edu.au\",\"XY_18_0.5_19\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 38:38:01\",\"Remaining 61:21:59\"],[5942.3,6671.8,2,1,270896,139081,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552504.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar117\",\"sstar117\"],[\"Job 6552504.pbs.hpc.swin.edu.au\",\"XY_18_0.5_19\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 33:56:57\",\"Remaining 66:03:03\"],[5946.5,6671.8,2,1,238069,122217,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552505.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar116\",\"sstar116\"],[\"Job 6552505.pbs.hpc.swin.edu.au\",\"XY_18_0.5_19\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 33:27:49\",\"Remaining 66:32:11\"],[5942.3,6671.8,2,1,234484,120469,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552506.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar116\",\"sstar116\"],[\"Job 6552506.pbs.hpc.swin.edu.au\",\"XY_18_0.5_19\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 33:11:42\",\"Remaining 66:48:18\"],[5942.3,6671.8,2,1,232744,119502,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552507.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar119\",\"sstar119\"],[\"Job 6552507.pbs.hpc.swin.edu.au\",\"XY_18_0.5_19\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 32:49:23\",\"Remaining 67:10:37\"],[5946.5,6671.8,2,1,230338,118163,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552508.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar123\",\"sstar123\"],[\"Job 6552508.pbs.hpc.swin.edu.au\",\"XY_18_0.5_19\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 31:38:34\",\"Remaining 68:21:26\"],[5946.5,6671.8,2,1,223893,113914,360000,98.3,\"R\",\"1:ppn=2\"]],[\"6552509.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar126\",\"sstar126\"],[\"Job 6552509.pbs.hpc.swin.edu.au\",\"XY_18_0.5_19\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 31:37:26\",\"Remaining 68:22:34\"],[5946.5,6671.8,2,1,221765,113846,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552511.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar120\",\"sstar120\"],[\"Job 6552511.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 31:24:12\",\"Remaining 68:35:48\"],[5946.5,6671.8,2,1,220324,113052,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552512.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar120\",\"sstar120\"],[\"Job 6552512.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 31:20:33\",\"Remaining 68:39:27\"],[5946.5,6671.8,2,1,219902,112833,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552513.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar126\",\"sstar126\"],[\"Job 6552513.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 31:10:55\",\"Remaining 68:49:05\"],[5946.5,6671.8,2,1,218909,112255,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552514.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar126\",\"sstar126\"],[\"Job 6552514.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 31:04:09\",\"Remaining 68:55:51\"],[5946.5,6671.8,2,1,218061,111849,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552515.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar126\",\"sstar126\"],[\"Job 6552515.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 30:45:53\",\"Remaining 69:14:07\"],[5946.5,6671.8,2,1,215749,110753,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552516.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar120\",\"sstar120\"],[\"Job 6552516.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 28:36:07\",\"Remaining 71:23:53\"],[5946.5,6671.8,2,1,200955,102967,360000,97.6,\"R\",\"1:ppn=2\"]],[\"6552517.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar127\",\"sstar127\"],[\"Job 6552517.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 23:19:21\",\"Remaining 76:40:39\"],[5946.5,6671.8,2,1,163698,83961,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552518.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar125\",\"sstar125\"],[\"Job 6552518.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 21:23:28\",\"Remaining 78:36:32\"],[5946.4,6671.8,2,1,150405,77008,360000,97.7,\"R\",\"1:ppn=2\"]],[\"6552519.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar118\",\"sstar118\"],[\"Job 6552519.pbs.hpc.swin.edu.au\",\"XY_18_0.5_20\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 20:31:23\",\"Remaining 79:28:37\"],[5942.9,6671.8,2,1,143761,73883,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552520.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar118\",\"sstar118\"],[\"Job 6552520.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 20:30:20\",\"Remaining 79:29:40\"],[5942.7,6671.8,2,1,143838,73820,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552521.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar119\",\"sstar119\"],[\"Job 6552521.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 20:06:38\",\"Remaining 79:53:22\"],[5946.4,6671.8,2,1,140896,72398,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552522.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar125\",\"sstar125\"],[\"Job 6552522.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 19:33:36\",\"Remaining 80:26:24\"],[5946.3,6671.8,2,1,137460,70416,360000,97.6,\"R\",\"1:ppn=2\"]],[\"6552523.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar119\",\"sstar119\"],[\"Job 6552523.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 19:29:24\",\"Remaining 80:30:36\"],[5946.4,6671.8,2,1,136656,70164,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552524.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar127\",\"sstar127\"],[\"Job 6552524.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 19:15:26\",\"Remaining 80:44:34\"],[5946.5,6671.8,2,1,134975,69326,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552525.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar127\",\"sstar127\"],[\"Job 6552525.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 17:50:47\",\"Remaining 82:09:13\"],[5946.5,6671.8,2,1,125116,64247,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552526.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar129\",\"sstar129\"],[\"Job 6552526.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 17:38:55\",\"Remaining 82:21:05\"],[5946.4,6671.8,2,1,124016,63535,360000,97.6,\"R\",\"1:ppn=2\"]],[\"6552527.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar122\",\"sstar122\"],[\"Job 6552527.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 15:55:32\",\"Remaining 84:04:28\"],[5946.4,6671.8,2,1,111800,57332,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552528.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar122\",\"sstar122\"],[\"Job 6552528.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 15:50:51\",\"Remaining 84:09:09\"],[5946.5,6671.8,2,1,111068,57051,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552529.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar122\",\"sstar122\"],[\"Job 6552529.pbs.hpc.swin.edu.au\",\"XY_18_0.5_21\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 14:42:41\",\"Remaining 85:17:19\"],[5946.4,6671.8,2,1,103438,52961,360000,97.7,\"R\",\"1:ppn=2\"]],[\"6552530.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar122\",\"sstar122\"],[\"Job 6552530.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 14:24:23\",\"Remaining 85:35:37\"],[5946.4,6671.8,2,1,101269,51863,360000,97.6,\"R\",\"1:ppn=2\"]],[\"6552531.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar122\",\"sstar122\"],[\"Job 6552531.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 14:15:02\",\"Remaining 85:44:58\"],[5946.5,6671.8,2,1,100068,51302,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552532.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar122\",\"sstar122\"],[\"Job 6552532.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 12:41:51\",\"Remaining 87:18:09\"],[5946.4,6671.8,2,1,89172,45711,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552533.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar125\",\"sstar125\"],[\"Job 6552533.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 12:38:01\",\"Remaining 87:21:59\"],[5946.5,6671.8,2,1,88599,45481,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552534.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar129\",\"sstar129\"],[\"Job 6552534.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 12:34:00\",\"Remaining 87:26:00\"],[5946.5,6671.8,2,1,88336,45240,360000,97.6,\"R\",\"1:ppn=2\"]],[\"6552535.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar125\",\"sstar125\"],[\"Job 6552535.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 11:34:37\",\"Remaining 88:25:23\"],[5946.4,6671.8,2,1,81222,41677,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552536.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar125\",\"sstar125\"],[\"Job 6552536.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 11:24:14\",\"Remaining 88:35:46\"],[5946.4,6671.8,2,1,79941,41054,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552537.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar123\",\"sstar123\"],[\"Job 6552537.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 10:48:07\",\"Remaining 89:11:53\"],[5946.4,6671.8,2,1,75814,38887,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552538.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar123\",\"sstar123\"],[\"Job 6552538.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 10:33:35\",\"Remaining 89:26:25\"],[5946.4,6671.8,2,1,74005,38015,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552539.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar126\",\"sstar126\"],[\"Job 6552539.pbs.hpc.swin.edu.au\",\"XY_18_0.5_22\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 10:27:17\",\"Remaining 89:32:43\"],[5946.3,6671.8,2,1,73377,37637,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552540.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar119\",\"sstar119\"],[\"Job 6552540.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 10:22:14\",\"Remaining 89:37:46\"],[5946.4,6671.8,2,1,72856,37334,360000,97.6,\"R\",\"1:ppn=2\"]],[\"6552541.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar126\",\"sstar126\"],[\"Job 6552541.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 10:11:38\",\"Remaining 89:48:22\"],[5946.3,6671.8,2,1,71573,36698,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552542.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar119\",\"sstar119\"],[\"Job 6552542.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 10:10:46\",\"Remaining 89:49:14\"],[5946.4,6671.8,2,1,71248,36646,360000,97.2,\"R\",\"1:ppn=2\"]],[\"6552543.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar126\",\"sstar126\"],[\"Job 6552543.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 09:53:27\",\"Remaining 90:06:33\"],[5946.3,6671.8,2,1,69335,35607,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552544.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar119\",\"sstar119\"],[\"Job 6552544.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 08:36:37\",\"Remaining 91:23:23\"],[5946.4,6671.8,2,1,60422,30997,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552545.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar128\",\"sstar128\"],[\"Job 6552545.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 08:26:34\",\"Remaining 91:33:26\"],[5946.4,6671.8,2,1,59346,30394,360000,97.6,\"R\",\"1:ppn=2\"]],[\"6552546.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar128\",\"sstar128\"],[\"Job 6552546.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 08:17:24\",\"Remaining 91:42:36\"],[5946.4,6671.8,2,1,58256,29844,360000,97.6,\"R\",\"1:ppn=2\"]],[\"6552547.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar128\",\"sstar128\"],[\"Job 6552547.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 08:07:33\",\"Remaining 91:52:27\"],[5946.4,6671.8,2,1,57003,29253,360000,97.4,\"R\",\"1:ppn=2\"]],[\"6552548.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar119\",\"sstar119\"],[\"Job 6552548.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 07:50:54\",\"Remaining 92:09:06\"],[5946.3,6671.8,2,1,54896,28254,360000,97.1,\"R\",\"1:ppn=2\"]],[\"6552549.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar125\",\"sstar125\"],[\"Job 6552549.pbs.hpc.swin.edu.au\",\"XY_18_0.5_23\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 06:50:47\",\"Remaining 93:09:13\"],[5946.3,6671.8,2,1,47916,24647,360000,97.2,\"R\",\"1:ppn=2\"]],[\"6552550.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar123\",\"sstar123\"],[\"Job 6552550.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 06:04:17\",\"Remaining 93:55:43\"],[5946.3,6671.8,2,1,42622,21857,360000,97.5,\"R\",\"1:ppn=2\"]],[\"6552551.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar123\",\"sstar123\"],[\"Job 6552551.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 05:09:10\",\"Remaining 94:50:50\"],[5946.3,6671.8,2,1,36067,18550,360000,97.2,\"R\",\"1:ppn=2\"]],[\"6552552.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar123\",\"sstar123\"],[\"Job 6552552.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 04:43:12\",\"Remaining 95:16:48\"],[5946.2,6671.8,2,1,33028,16992,360000,97.2,\"R\",\"1:ppn=2\"]],[\"6552553.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar122\",\"sstar122\"],[\"Job 6552553.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 03:44:18\",\"Remaining 96:15:42\"],[5946.2,6671.8,2,1,26158,13458,360000,97.2,\"R\",\"1:ppn=2\"]],[\"6552554.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar116\",\"sstar116\"],[\"Job 6552554.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 02:27:38\",\"Remaining 97:32:22\"],[5946.2,6671.8,2,1,17225,8858,360000,97.2,\"R\",\"1:ppn=2\"]],[\"6552555.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar116\",\"sstar116\"],[\"Job 6552555.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 02:20:09\",\"Remaining 97:39:51\"],[5946.2,6671.8,2,1,16368,8409,360000,97.3,\"R\",\"1:ppn=2\"]],[\"6552556.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar117\",\"sstar117\"],[\"Job 6552556.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 01:23:17\",\"Remaining 98:36:43\"],[5946.2,6671.8,2,1,9712,4997,360000,97.2,\"R\",\"1:ppn=2\"]],[\"6552557.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar117\",\"sstar117\"],[\"Job 6552557.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 01:15:29\",\"Remaining 98:44:31\"],[5946.2,6671.8,2,1,8791,4529,360000,97.1,\"R\",\"1:ppn=2\"]],[\"6552558.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar123\",\"sstar123\"],[\"Job 6552558.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 00:46:02\",\"Remaining 99:13:58\"],[5686.8,6649.3,2,1,5032,2762,360000,91.1,\"R\",\"1:ppn=2\"]],[\"6552559.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar120\",\"sstar120\"],[\"Job 6552559.pbs.hpc.swin.edu.au\",\"XY_18_0.5_24\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 00:43:07\",\"Remaining 99:16:53\"],[5923.9,6671.8,2,1,5016,2587,360000,96.9,\"R\",\"1:ppn=2\"]],[\"6552560.pbs.hpc.swin.edu.au\",\"ssc\",\"none\",[\"sstar125\",\"sstar125\"],[\"Job 6552560.pbs.hpc.swin.edu.au\",\"XY_18_0.5_25\",\"R\",\"Nodes 1\",\"Cpus 2\",\"Mem/VM 5G/6G\",\"Wall Time 00:32:52\",\"Remaining 99:27:08\"],[5686.7,6649.3,2,1,3792,1972,360000,96.1,\"R\",\"1:ppn=2\"]],[\"6552631.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\",\"sstar145\"],[\"Job 6552631.pbs.hpc.swin.edu.au\",\"hydrocomp256\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 7G/127G\",\"Wall Time 131:30:17\",\"Remaining 36:29:43\"],[7171.3,130835.0,16,1,2921442,473417,604800,38.6,\"R\",\"1:ppn=16\"]],[\"6552634.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\",\"sstar142\"],[\"Job 6552634.pbs.hpc.swin.edu.au\",\"multidust128n20\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 3G/124G\",\"Wall Time 130:35:01\",\"Remaining 37:24:59\"],[3458.2,127399.7,16,1,3303070,470101,604800,43.9,\"R\",\"1:ppn=16\"]],[\"6552988.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar126\"],[\"Job 6552988.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:09:17\",\"Remaining 51:50:43\"],[0.0,0.0,1,1,417559,418157,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552989.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar126\"],[\"Job 6552989.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:09:16\",\"Remaining 51:50:44\"],[0.0,0.0,1,1,417574,418156,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552990.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar128\"],[\"Job 6552990.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:08:07\",\"Remaining 51:51:53\"],[0.0,0.0,1,1,417496,418087,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552991.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar128\"],[\"Job 6552991.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:08:06\",\"Remaining 51:51:54\"],[0.0,0.0,1,1,417470,418086,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552992.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar131\"],[\"Job 6552992.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:08:35\",\"Remaining 51:51:25\"],[0.0,0.0,1,1,417609,418115,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552993.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar131\"],[\"Job 6552993.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:08:34\",\"Remaining 51:51:26\"],[0.0,0.0,1,1,417585,418114,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552994.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar133\"],[\"Job 6552994.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:08:10\",\"Remaining 51:51:50\"],[0.0,0.0,1,1,417595,418090,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552995.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar136\"],[\"Job 6552995.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:08:09\",\"Remaining 51:51:51\"],[0.0,0.0,1,1,417612,418089,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552996.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar132\"],[\"Job 6552996.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/423M\",\"Wall Time 116:07:48\",\"Remaining 51:52:12\"],[0.0,0.0,1,1,416908,418068,604800,99.7,\"R\",\"1:ppn=1\"]],[\"6552997.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar132\"],[\"Job 6552997.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:07:48\",\"Remaining 51:52:12\"],[0.0,0.0,1,1,417506,418068,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552998.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar132\"],[\"Job 6552998.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:06:45\",\"Remaining 51:53:15\"],[0.0,0.0,1,1,417462,418005,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6552999.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar132\"],[\"Job 6552999.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 83M/415M\",\"Wall Time 116:06:45\",\"Remaining 51:53:15\"],[0.0,0.0,1,1,417442,418005,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6553729.pbs.hpc.swin.edu.au\",\"mca\",\"none\",[\"gstar051\",\"gstar051\",\"gstar051\",\"gstar051\",\"gstar051\",\"gstar051\",\"gstar051\",\"gstar051\",\"gstar051\",\"gstar051\"],[\"Job 6553729.pbs.hpc.swin.edu.au\",\"loop_CPU6.qsub\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 5M/230M\",\"Wall Time 108:59:14\",\"Remaining 59:00:46\"],[5.4,230.4,10,1,375142,392354,604800,9.6,\"R\",\"1:ppn=10\"]],[\"6553733.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\",\"gstar022\"],[\"Job 6553733.pbs.hpc.swin.edu.au\",\"kh512nonic\",\"R\",\"Nodes 1\",\"Cpus 12\",\"Mem/VM 1489M/89G\",\"Wall Time 102:03:51\",\"Remaining 65:56:09\"],[1489.8,91925.5,12,1,3629752,367431,604800,82.3,\"R\",\"1:ppn=12\"]],[\"6553861.pbs.hpc.swin.edu.au\",\"smu\",\"p124_astro\",[\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\",\"sstar155\"],[\"Job 6553861.pbs.hpc.swin.edu.au\",\"zmulti\",\"R\",\"Nodes 1\",\"Cpus 15\",\"Mem/VM 53G/72G\",\"Wall Time 97:29:17\",\"Remaining 22:30:43\"],[54392.6,74213.8,15,1,5256547,350957,432000,99.9,\"R\",\"1:ppn=15\"]],[\"6553862.pbs.hpc.swin.edu.au\",\"smu\",\"p124_astro\",[\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\",\"sstar158\"],[\"Job 6553862.pbs.hpc.swin.edu.au\",\"z5-single\",\"R\",\"Nodes 1\",\"Cpus 15\",\"Mem/VM 53G/72G\",\"Wall Time 97:28:51\",\"Remaining 22:31:09\"],[54376.1,74213.3,15,1,5256289,350931,432000,99.9,\"R\",\"1:ppn=15\"]],[\"6553863.pbs.hpc.swin.edu.au\",\"smu\",\"p124_astro\",[\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\",\"sstar159\"],[\"Job 6553863.pbs.hpc.swin.edu.au\",\"z6-single\",\"R\",\"Nodes 1\",\"Cpus 15\",\"Mem/VM 32G/51G\",\"Wall Time 97:28:47\",\"Remaining 22:31:13\"],[32999.1,52595.7,15,1,5256451,350927,432000,99.9,\"R\",\"1:ppn=15\"]],[\"6553864.pbs.hpc.swin.edu.au\",\"smu\",\"p124_astro\",[\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\",\"sstar121\"],[\"Job 6553864.pbs.hpc.swin.edu.au\",\"z7-single\",\"R\",\"Nodes 1\",\"Cpus 15\",\"Mem/VM 19G/39G\",\"Wall Time 97:25:09\",\"Remaining 22:34:51\"],[20343.9,39939.3,15,1,5252362,350709,432000,99.8,\"R\",\"1:ppn=15\"]],[\"6554242.pbs.hpc.swin.edu.au\",\"dme\",\"none\",[\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\",\"sstar146\"],[\"Job 6554242.pbs.hpc.swin.edu.au\",\"twhya\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 4G/247G\",\"Wall Time 87:49:59\",\"Remaining 80:10:01\"],[4829.9,253148.7,16,1,4881710,316199,604800,96.5,\"R\",\"1:ppn=16\"]],[\"6554251.pbs.hpc.swin.edu.au\",\"jle\",\"none\",[\"sstar116\",\"sstar116\",\"sstar116\",\"sstar116\"],[\"Job 6554251.pbs.hpc.swin.edu.au\",\"f0.180A0.100\",\"R\",\"Nodes 1\",\"Cpus 4\",\"Mem/VM 37G/66G\",\"Wall Time 86:40:02\",\"Remaining 13:19:58\"],[38050.4,68018.5,4,1,1244700,312002,360000,99.7,\"R\",\"1:ppn=4\"]],[\"6554254.pbs.hpc.swin.edu.au\",\"jle\",\"none\",[\"sstar118\",\"sstar118\",\"sstar118\",\"sstar118\"],[\"Job 6554254.pbs.hpc.swin.edu.au\",\"f0.180A0.400\",\"R\",\"Nodes 1\",\"Cpus 4\",\"Mem/VM 34G/66G\",\"Wall Time 86:39:53\",\"Remaining 13:20:07\"],[35661.1,67957.4,4,1,1245286,311993,360000,99.8,\"R\",\"1:ppn=4\"]],[\"6554257.pbs.hpc.swin.edu.au\",\"jle\",\"none\",[\"sstar130\",\"sstar130\",\"sstar130\",\"sstar130\"],[\"Job 6554257.pbs.hpc.swin.edu.au\",\"f0.180A0.700\",\"R\",\"Nodes 1\",\"Cpus 4\",\"Mem/VM 21G/23G\",\"Wall Time 86:40:13\",\"Remaining 13:19:47\"],[22439.4,24121.5,4,1,934904,312013,360000,74.9,\"R\",\"1:ppn=4\"]],[\"6554264.pbs.hpc.swin.edu.au\",\"jle\",\"none\",[\"sstar139\",\"sstar139\",\"sstar139\",\"sstar139\"],[\"Job 6554264.pbs.hpc.swin.edu.au\",\"fully_pas060\",\"R\",\"Nodes 1\",\"Cpus 4\",\"Mem/VM 14G/16G\",\"Wall Time 86:09:37\",\"Remaining 13:50:23\"],[14972.8,16639.7,4,1,929334,310177,360000,74.9,\"R\",\"1:ppn=4\"]],[\"6554281.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar053\"],[\"Job 6554281.pbs.hpc.swin.edu.au\",\"gerlumph_88947\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 84:32:44\",\"Remaining 83:27:16\"],[0.0,0.0,1,1,303916,304364,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554289.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar049\"],[\"Job 6554289.pbs.hpc.swin.edu.au\",\"gerlumph_88955\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 84:32:45\",\"Remaining 83:27:15\"],[0.0,0.0,1,1,303547,304365,604800,99.7,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554290.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar049\"],[\"Job 6554290.pbs.hpc.swin.edu.au\",\"gerlumph_88956\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 84:32:44\",\"Remaining 83:27:16\"],[0.0,0.0,1,1,304107,304364,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554296.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar046\"],[\"Job 6554296.pbs.hpc.swin.edu.au\",\"gerlumph_88962\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 84:32:30\",\"Remaining 83:27:30\"],[0.0,0.0,1,1,304101,304350,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554297.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar045\"],[\"Job 6554297.pbs.hpc.swin.edu.au\",\"gerlumph_88963\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 84:32:31\",\"Remaining 83:27:29\"],[0.0,0.0,1,1,303887,304351,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554298.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar045\"],[\"Job 6554298.pbs.hpc.swin.edu.au\",\"gerlumph_88964\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 84:32:30\",\"Remaining 83:27:30\"],[0.0,0.0,1,1,304227,304350,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554299.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar044\"],[\"Job 6554299.pbs.hpc.swin.edu.au\",\"gerlumph_88965\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:17\",\"Remaining 83:27:43\"],[0.0,0.0,1,1,304197,304337,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554304.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar042\"],[\"Job 6554304.pbs.hpc.swin.edu.au\",\"gerlumph_88970\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:20\",\"Remaining 83:27:40\"],[0.0,0.0,1,1,304068,304340,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554305.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar041\"],[\"Job 6554305.pbs.hpc.swin.edu.au\",\"gerlumph_88971\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 423M/64G\",\"Wall Time 84:31:35\",\"Remaining 83:28:25\"],[0.0,0.0,1,1,303643,304295,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554306.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar041\"],[\"Job 6554306.pbs.hpc.swin.edu.au\",\"gerlumph_88972\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 423M/64G\",\"Wall Time 84:31:34\",\"Remaining 83:28:26\"],[0.0,0.0,1,1,304114,304294,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554307.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar040\"],[\"Job 6554307.pbs.hpc.swin.edu.au\",\"gerlumph_88973\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:31:38\",\"Remaining 83:28:22\"],[0.0,0.0,1,1,303725,304298,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554312.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar037\"],[\"Job 6554312.pbs.hpc.swin.edu.au\",\"gerlumph_88978\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:10\",\"Remaining 83:27:50\"],[0.0,0.0,1,1,304153,304330,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554313.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar036\"],[\"Job 6554313.pbs.hpc.swin.edu.au\",\"gerlumph_88979\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:10\",\"Remaining 83:27:50\"],[0.0,0.0,1,1,304242,304330,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554316.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar033\"],[\"Job 6554316.pbs.hpc.swin.edu.au\",\"gerlumph_88982\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:02\",\"Remaining 83:27:58\"],[0.0,0.0,1,1,304196,304322,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554317.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar032\"],[\"Job 6554317.pbs.hpc.swin.edu.au\",\"gerlumph_88983\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:31:49\",\"Remaining 83:28:11\"],[0.0,0.0,1,1,304211,304309,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554321.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar030\"],[\"Job 6554321.pbs.hpc.swin.edu.au\",\"gerlumph_88987\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:11\",\"Remaining 83:27:49\"],[0.0,0.0,1,1,303611,304331,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554322.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar030\"],[\"Job 6554322.pbs.hpc.swin.edu.au\",\"gerlumph_88988\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:10\",\"Remaining 83:27:50\"],[0.0,0.0,1,1,304077,304330,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554326.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar028\"],[\"Job 6554326.pbs.hpc.swin.edu.au\",\"gerlumph_88992\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:21\",\"Remaining 83:27:39\"],[0.0,0.0,1,1,304050,304341,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554327.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar027\"],[\"Job 6554327.pbs.hpc.swin.edu.au\",\"gerlumph_88993\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:23\",\"Remaining 83:27:37\"],[0.0,0.0,1,1,303623,304343,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554332.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar024\"],[\"Job 6554332.pbs.hpc.swin.edu.au\",\"gerlumph_88998\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:23\",\"Remaining 83:27:37\"],[0.0,0.0,1,1,304060,304343,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554333.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar023\"],[\"Job 6554333.pbs.hpc.swin.edu.au\",\"gerlumph_88999\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 84:32:23\",\"Remaining 83:27:37\"],[0.0,0.0,1,1,304151,304343,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554339.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar051\"],[\"Job 6554339.pbs.hpc.swin.edu.au\",\"gerlumph_89005\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 69:52:52\",\"Remaining 98:07:08\"],[0.0,0.0,1,1,251516,251572,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554340.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar043\"],[\"Job 6554340.pbs.hpc.swin.edu.au\",\"gerlumph_89006\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 69:17:45\",\"Remaining 98:42:15\"],[0.0,0.0,1,1,248868,249465,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554346.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar043\"],[\"Job 6554346.pbs.hpc.swin.edu.au\",\"gerlumph_89012\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 65:20:02\",\"Remaining 102:39:58\"],[0.0,0.0,1,1,234948,235202,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554347.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar036\"],[\"Job 6554347.pbs.hpc.swin.edu.au\",\"gerlumph_89013\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 64:32:48\",\"Remaining 103:27:12\"],[0.0,0.0,1,1,232291,232368,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554352.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar026\"],[\"Job 6554352.pbs.hpc.swin.edu.au\",\"gerlumph_89018\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 56:27:49\",\"Remaining 111:32:11\"],[0.0,0.0,1,1,202846,203269,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554353.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar055\"],[\"Job 6554353.pbs.hpc.swin.edu.au\",\"gerlumph_89019\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 54:49:42\",\"Remaining 113:10:18\"],[0.0,0.0,1,1,197306,197382,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554361.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar031\"],[\"Job 6554361.pbs.hpc.swin.edu.au\",\"gerlumph_89027\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 45:09:44\",\"Remaining 122:50:16\"],[0.0,0.0,1,1,162508,162584,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554362.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar039\"],[\"Job 6554362.pbs.hpc.swin.edu.au\",\"gerlumph_89028\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 45:04:13\",\"Remaining 122:55:47\"],[0.0,0.0,1,1,162207,162253,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554370.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar047\"],[\"Job 6554370.pbs.hpc.swin.edu.au\",\"gerlumph_89036\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 36:20:32\",\"Remaining 131:39:28\"],[0.0,0.0,1,1,130540,130832,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554371.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar050\"],[\"Job 6554371.pbs.hpc.swin.edu.au\",\"gerlumph_89037\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 36:06:55\",\"Remaining 131:53:05\"],[0.0,0.0,1,1,129800,130015,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554375.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar038\"],[\"Job 6554375.pbs.hpc.swin.edu.au\",\"gerlumph_89041\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 32:23:48\",\"Remaining 135:36:12\"],[0.0,0.0,1,1,116349,116628,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554376.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar039\"],[\"Job 6554376.pbs.hpc.swin.edu.au\",\"gerlumph_89042\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 28:27:50\",\"Remaining 139:32:10\"],[0.0,0.0,1,1,102428,102470,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554382.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar046\"],[\"Job 6554382.pbs.hpc.swin.edu.au\",\"gerlumph_89048\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 27:05:31\",\"Remaining 140:54:29\"],[0.0,0.0,1,1,97309,97531,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554383.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar054\"],[\"Job 6554383.pbs.hpc.swin.edu.au\",\"gerlumph_89049\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 26:31:25\",\"Remaining 141:28:35\"],[0.0,0.0,1,1,95437,95485,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554384.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar040\"],[\"Job 6554384.pbs.hpc.swin.edu.au\",\"gerlumph_89050\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 26:18:08\",\"Remaining 141:41:52\"],[0.0,0.0,1,1,94650,94688,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554390.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar057\"],[\"Job 6554390.pbs.hpc.swin.edu.au\",\"gerlumph_89056\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 416M/64G\",\"Wall Time 22:11:50\",\"Remaining 145:48:10\"],[0.0,0.0,1,1,79855,79910,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554391.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar032\"],[\"Job 6554391.pbs.hpc.swin.edu.au\",\"gerlumph_89057\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 22:00:37\",\"Remaining 145:59:23\"],[0.0,0.0,1,1,79202,79237,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554392.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar034\"],[\"Job 6554392.pbs.hpc.swin.edu.au\",\"gerlumph_89058\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 21:57:34\",\"Remaining 146:02:26\"],[0.0,0.0,1,1,79016,79054,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554393.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar044\"],[\"Job 6554393.pbs.hpc.swin.edu.au\",\"gerlumph_89059\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 21:28:21\",\"Remaining 146:31:39\"],[0.0,0.0,1,1,77149,77301,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554398.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar021\"],[\"Job 6554398.pbs.hpc.swin.edu.au\",\"gerlumph_89064\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 17:25:24\",\"Remaining 150:34:36\"],[0.0,0.0,1,1,62586,62724,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554399.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar052\"],[\"Job 6554399.pbs.hpc.swin.edu.au\",\"gerlumph_89065\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 416M/64G\",\"Wall Time 16:54:01\",\"Remaining 151:05:59\"],[0.0,0.0,1,1,60804,60841,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554400.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar029\"],[\"Job 6554400.pbs.hpc.swin.edu.au\",\"gerlumph_89066\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 16:27:13\",\"Remaining 151:32:47\"],[0.0,0.0,1,1,59175,59233,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554401.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar031\"],[\"Job 6554401.pbs.hpc.swin.edu.au\",\"gerlumph_89067\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 15:51:25\",\"Remaining 152:08:35\"],[0.0,0.0,1,1,57055,57085,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554402.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar029\"],[\"Job 6554402.pbs.hpc.swin.edu.au\",\"gerlumph_89068\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 15:48:43\",\"Remaining 152:11:17\"],[0.0,0.0,1,1,56784,56923,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554405.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar042\"],[\"Job 6554405.pbs.hpc.swin.edu.au\",\"gerlumph_89071\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 13:30:43\",\"Remaining 154:29:17\"],[0.0,0.0,1,1,48532,48643,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554406.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar056\"],[\"Job 6554406.pbs.hpc.swin.edu.au\",\"gerlumph_89072\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 13:18:20\",\"Remaining 154:41:40\"],[0.0,0.0,1,1,47865,47900,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554407.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar051\"],[\"Job 6554407.pbs.hpc.swin.edu.au\",\"gerlumph_89073\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 12:01:45\",\"Remaining 155:58:15\"],[0.0,0.0,1,1,43293,43305,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554408.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar052\"],[\"Job 6554408.pbs.hpc.swin.edu.au\",\"gerlumph_89074\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 11:52:41\",\"Remaining 156:07:19\"],[0.0,0.0,1,1,42697,42761,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554409.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar021\"],[\"Job 6554409.pbs.hpc.swin.edu.au\",\"gerlumph_89075\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 422M/64G\",\"Wall Time 10:21:20\",\"Remaining 157:38:40\"],[0.0,0.0,1,1,37239,37280,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554410.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar027\"],[\"Job 6554410.pbs.hpc.swin.edu.au\",\"gerlumph_89076\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 09:41:51\",\"Remaining 158:18:09\"],[0.0,0.0,1,1,34871,34911,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554411.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar035\"],[\"Job 6554411.pbs.hpc.swin.edu.au\",\"gerlumph_89077\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 09:15:03\",\"Remaining 158:44:57\"],[0.0,0.0,1,1,33288,33303,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554412.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar037\"],[\"Job 6554412.pbs.hpc.swin.edu.au\",\"gerlumph_89078\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 08:18:28\",\"Remaining 159:41:32\"],[0.0,0.0,1,1,29838,29908,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554413.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar038\"],[\"Job 6554413.pbs.hpc.swin.edu.au\",\"gerlumph_89079\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 05:05:08\",\"Remaining 162:54:52\"],[0.0,0.0,1,1,18303,18308,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554414.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar054\"],[\"Job 6554414.pbs.hpc.swin.edu.au\",\"gerlumph_89080\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 04:57:04\",\"Remaining 163:02:56\"],[0.0,0.0,1,1,17818,17824,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554415.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar023\"],[\"Job 6554415.pbs.hpc.swin.edu.au\",\"gerlumph_89081\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 03:37:23\",\"Remaining 164:22:37\"],[0.0,0.0,1,1,13037,13043,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554416.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar057\"],[\"Job 6554416.pbs.hpc.swin.edu.au\",\"gerlumph_89082\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 79:35:50\",\"Remaining 88:24:10\"],[0.0,0.0,1,1,286116,286550,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554419.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar053\"],[\"Job 6554419.pbs.hpc.swin.edu.au\",\"gerlumph_89085\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 77:54:30\",\"Remaining 90:05:30\"],[0.0,0.0,1,1,280336,280470,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554420.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar056\"],[\"Job 6554420.pbs.hpc.swin.edu.au\",\"gerlumph_89086\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 77:27:03\",\"Remaining 90:32:57\"],[0.0,0.0,1,1,278099,278823,604800,99.7,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554424.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar048\"],[\"Job 6554424.pbs.hpc.swin.edu.au\",\"gerlumph_89090\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 75:04:53\",\"Remaining 92:55:07\"],[0.0,0.0,1,1,269684,270293,604800,99.8,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554425.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar048\"],[\"Job 6554425.pbs.hpc.swin.edu.au\",\"gerlumph_89091\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 74:06:49\",\"Remaining 93:53:11\"],[0.0,0.0,1,1,266587,266809,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554428.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar047\"],[\"Job 6554428.pbs.hpc.swin.edu.au\",\"gerlumph_89094\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 420M/64G\",\"Wall Time 03:10:40\",\"Remaining 164:49:20\"],[0.0,0.0,1,1,11435,11440,604800,100.0,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554429.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar055\"],[\"Job 6554429.pbs.hpc.swin.edu.au\",\"gerlumph_89095\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 01:14:34\",\"Remaining 166:45:26\"],[0.0,0.0,1,1,4462,4474,604800,99.7,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554430.pbs.hpc.swin.edu.au\",\"gve\",\"p008_astro\",[\"gstar050\"],[\"Job 6554430.pbs.hpc.swin.edu.au\",\"gerlumph_89096\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Gpus 1\",\"Mem/VM 421M/64G\",\"Wall Time 00:46:18\",\"Remaining 167:13:42\"],[0.0,0.0,1,1,2775,2778,604800,99.9,\"R\",\"1:ppn=1:gpus=1\"]],[\"6554977.pbs.hpc.swin.edu.au\",\"TAO\",\"none\",[\"sstar131\",\"sstar131\",\"sstar131\",\"sstar131\"],[\"Job 6554977.pbs.hpc.swin.edu.au\",\"tao_mari_1663\",\"R\",\"Nodes 1\",\"Cpus 4\",\"Mem/VM 483M/1832M\",\"Wall Time 84:01:42\",\"Remaining 83:58:18\"],[483.7,1832.4,4,1,473415,302502,604800,39.1,\"R\",\"1:ppn=4\"]],[\"6554980.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\",\"sstar149\"],[\"Job 6554980.pbs.hpc.swin.edu.au\",\"kh1024sextic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 3G/124G\",\"Wall Time 79:52:03\",\"Remaining 88:07:57\"],[4003.9,127141.1,16,1,3204219,287523,604800,69.7,\"R\",\"1:ppn=16\"]],[\"6554981.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\",\"sstar153\"],[\"Job 6554981.pbs.hpc.swin.edu.au\",\"kh1024heptic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 4G/125G\",\"Wall Time 79:51:58\",\"Remaining 88:08:02\"],[4756.9,128158.9,16,1,3351472,287518,604800,72.9,\"R\",\"1:ppn=16\"]],[\"6554984.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\",\"sstar156\"],[\"Job 6554984.pbs.hpc.swin.edu.au\",\"kh2048heptic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 17G/137G\",\"Wall Time 79:50:49\",\"Remaining 88:09:11\"],[17850.7,141261.7,16,1,4399634,287449,604800,95.7,\"R\",\"1:ppn=16\"]],[\"6554987.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\",\"sstar157\"],[\"Job 6554987.pbs.hpc.swin.edu.au\",\"kh2048sextic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 15G/135G\",\"Wall Time 79:49:32\",\"Remaining 88:10:28\"],[15659.3,138909.2,16,1,4342684,287372,604800,94.4,\"R\",\"1:ppn=16\"]],[\"6554988.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\",\"sstar144\"],[\"Job 6554988.pbs.hpc.swin.edu.au\",\"kh2048quintic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 11G/132G\",\"Wall Time 78:28:42\",\"Remaining 89:31:18\"],[11961.6,135637.0,16,1,4057673,282522,604800,89.8,\"R\",\"1:ppn=16\"]],[\"6554989.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\",\"sstar148\"],[\"Job 6554989.pbs.hpc.swin.edu.au\",\"kh1024octic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 4G/125G\",\"Wall Time 71:21:47\",\"Remaining 96:38:13\"],[4989.7,128142.5,16,1,2663571,256907,604800,64.8,\"R\",\"1:ppn=16\"]],[\"6554990.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\",\"sstar151\"],[\"Job 6554990.pbs.hpc.swin.edu.au\",\"kh2048octic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 18G/139G\",\"Wall Time 69:18:11\",\"Remaining 98:41:49\"],[19070.7,142604.6,16,1,3841022,249491,604800,96.2,\"R\",\"1:ppn=16\"]],[\"6554992.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\",\"sstar141\"],[\"Job 6554992.pbs.hpc.swin.edu.au\",\"kh2048nonic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 23G/143G\",\"Wall Time 68:27:32\",\"Remaining 99:32:28\"],[23610.9,146763.6,16,1,2868342,246452,604800,72.7,\"R\",\"1:ppn=16\"]],[\"6554993.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\",\"sstar152\"],[\"Job 6554993.pbs.hpc.swin.edu.au\",\"kh1024nonic\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 5G/126G\",\"Wall Time 67:33:01\",\"Remaining 100:26:59\"],[5913.4,129404.5,16,1,2891164,243181,604800,74.3,\"R\",\"1:ppn=16\"]],[\"6555129.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar036\",\"gstar036\",\"gstar036\",\"gstar036\",\"gstar036\",\"gstar036\",\"gstar036\",\"gstar036\",\"gstar036\",\"gstar036\"],[\"Job 6555129.pbs.hpc.swin.edu.au\",\"res_sig_m32_19\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 27:45:21\",\"Remaining 140:14:39\"],[467.4,7623.3,10,1,980546,99921,604800,98.1,\"R\",\"1:ppn=10\"]],[\"6555130.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar033\",\"gstar033\",\"gstar033\",\"gstar033\",\"gstar033\",\"gstar033\",\"gstar033\",\"gstar033\",\"gstar033\",\"gstar033\"],[\"Job 6555130.pbs.hpc.swin.edu.au\",\"res_sig_m32_20\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 26:54:55\",\"Remaining 141:05:05\"],[467.4,7623.3,10,1,923307,96895,604800,95.3,\"R\",\"1:ppn=10\"]],[\"6555131.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar052\",\"gstar052\",\"gstar052\",\"gstar052\",\"gstar052\",\"gstar052\",\"gstar052\",\"gstar052\",\"gstar052\",\"gstar052\"],[\"Job 6555131.pbs.hpc.swin.edu.au\",\"res_sig_m32_21\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 26:38:18\",\"Remaining 141:21:42\"],[467.4,7623.3,10,1,924383,95898,604800,96.4,\"R\",\"1:ppn=10\"]],[\"6555132.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar054\",\"gstar054\",\"gstar054\",\"gstar054\",\"gstar054\",\"gstar054\",\"gstar054\",\"gstar054\",\"gstar054\",\"gstar054\"],[\"Job 6555132.pbs.hpc.swin.edu.au\",\"res_sig_m32_22\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 26:32:47\",\"Remaining 141:27:13\"],[467.6,7629.2,10,1,903666,95567,604800,94.6,\"R\",\"1:ppn=10\"]],[\"6555133.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar032\",\"gstar032\",\"gstar032\",\"gstar032\",\"gstar032\",\"gstar032\",\"gstar032\",\"gstar032\",\"gstar032\",\"gstar032\"],[\"Job 6555133.pbs.hpc.swin.edu.au\",\"res_sig_m32_23\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 26:31:44\",\"Remaining 141:28:16\"],[467.7,7629.3,10,1,938767,95504,604800,98.3,\"R\",\"1:ppn=10\"]],[\"6555134.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar050\",\"gstar050\",\"gstar050\",\"gstar050\",\"gstar050\",\"gstar050\",\"gstar050\",\"gstar050\",\"gstar050\",\"gstar050\"],[\"Job 6555134.pbs.hpc.swin.edu.au\",\"res_sig_m32_24\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 26:25:52\",\"Remaining 141:34:08\"],[467.4,7623.3,10,1,947520,95152,604800,99.6,\"R\",\"1:ppn=10\"]],[\"6555135.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar013\",\"gstar013\",\"gstar013\",\"gstar013\",\"gstar013\",\"gstar013\",\"gstar013\",\"gstar013\",\"gstar013\",\"gstar013\"],[\"Job 6555135.pbs.hpc.swin.edu.au\",\"res_sig_m32_25\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 26:11:43\",\"Remaining 141:48:17\"],[467.4,7623.3,10,1,922245,94303,604800,97.8,\"R\",\"1:ppn=10\"]],[\"6555136.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar055\",\"gstar055\",\"gstar055\",\"gstar055\",\"gstar055\",\"gstar055\",\"gstar055\",\"gstar055\",\"gstar055\",\"gstar055\"],[\"Job 6555136.pbs.hpc.swin.edu.au\",\"res_sig_m32_26\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 26:08:36\",\"Remaining 141:51:24\"],[467.4,7623.3,10,1,939932,94116,604800,99.9,\"R\",\"1:ppn=10\"]],[\"6555137.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar053\",\"gstar053\",\"gstar053\",\"gstar053\",\"gstar053\",\"gstar053\",\"gstar053\",\"gstar053\",\"gstar053\",\"gstar053\"],[\"Job 6555137.pbs.hpc.swin.edu.au\",\"res_sig_m32_27\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 25:53:16\",\"Remaining 142:06:44\"],[467.4,7623.4,10,1,902002,93196,604800,96.8,\"R\",\"1:ppn=10\"]],[\"6555138.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar034\",\"gstar034\",\"gstar034\",\"gstar034\",\"gstar034\",\"gstar034\",\"gstar034\",\"gstar034\",\"gstar034\",\"gstar034\"],[\"Job 6555138.pbs.hpc.swin.edu.au\",\"res_sig_m32_28\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 25:46:40\",\"Remaining 142:13:20\"],[467.4,7623.4,10,1,904582,92800,604800,97.5,\"R\",\"1:ppn=10\"]],[\"6555139.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar015\",\"gstar015\",\"gstar015\",\"gstar015\",\"gstar015\",\"gstar015\",\"gstar015\",\"gstar015\",\"gstar015\",\"gstar015\"],[\"Job 6555139.pbs.hpc.swin.edu.au\",\"res_sig_m32_29\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 25:43:03\",\"Remaining 142:16:57\"],[467.4,7623.4,10,1,909856,92583,604800,98.3,\"R\",\"1:ppn=10\"]],[\"6555140.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar012\",\"gstar012\",\"gstar012\",\"gstar012\",\"gstar012\",\"gstar012\",\"gstar012\",\"gstar012\",\"gstar012\",\"gstar012\"],[\"Job 6555140.pbs.hpc.swin.edu.au\",\"res_sig_m32_30\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 25:42:22\",\"Remaining 142:17:38\"],[467.5,7623.5,10,1,924157,92542,604800,99.9,\"R\",\"1:ppn=10\"]],[\"6555141.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar035\",\"gstar035\",\"gstar035\",\"gstar035\",\"gstar035\",\"gstar035\",\"gstar035\",\"gstar035\",\"gstar035\",\"gstar035\"],[\"Job 6555141.pbs.hpc.swin.edu.au\",\"res_sig_m32_31\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 25:22:25\",\"Remaining 142:37:35\"],[467.5,7623.4,10,1,912227,91345,604800,99.9,\"R\",\"1:ppn=10\"]],[\"6555142.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar057\",\"gstar057\",\"gstar057\",\"gstar057\",\"gstar057\",\"gstar057\",\"gstar057\",\"gstar057\",\"gstar057\",\"gstar057\"],[\"Job 6555142.pbs.hpc.swin.edu.au\",\"res_sig_m32_32\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 25:09:09\",\"Remaining 142:50:51\"],[467.7,7629.2,10,1,869122,90549,604800,96.0,\"R\",\"1:ppn=10\"]],[\"6555143.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar044\",\"gstar044\",\"gstar044\",\"gstar044\",\"gstar044\",\"gstar044\",\"gstar044\",\"gstar044\",\"gstar044\",\"gstar044\"],[\"Job 6555143.pbs.hpc.swin.edu.au\",\"res_sig_m32_33\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 24:55:50\",\"Remaining 143:04:10\"],[467.4,7623.3,10,1,896185,89750,604800,99.9,\"R\",\"1:ppn=10\"]],[\"6555144.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar045\",\"gstar045\",\"gstar045\",\"gstar045\",\"gstar045\",\"gstar045\",\"gstar045\",\"gstar045\",\"gstar045\",\"gstar045\"],[\"Job 6555144.pbs.hpc.swin.edu.au\",\"res_sig_m32_34\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 24:34:45\",\"Remaining 143:25:15\"],[467.4,7623.4,10,1,883589,88485,604800,99.9,\"R\",\"1:ppn=10\"]],[\"6555145.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar014\",\"gstar014\",\"gstar014\",\"gstar014\",\"gstar014\",\"gstar014\",\"gstar014\",\"gstar014\",\"gstar014\",\"gstar014\"],[\"Job 6555145.pbs.hpc.swin.edu.au\",\"res_sig_m32_35\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 24:12:27\",\"Remaining 143:47:33\"],[467.7,7629.2,10,1,850177,87147,604800,97.6,\"R\",\"1:ppn=10\"]],[\"6555146.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar039\",\"gstar039\",\"gstar039\",\"gstar039\",\"gstar039\",\"gstar039\",\"gstar039\",\"gstar039\",\"gstar039\",\"gstar039\"],[\"Job 6555146.pbs.hpc.swin.edu.au\",\"res_sig_m32_36\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 24:00:41\",\"Remaining 143:59:19\"],[467.7,7629.2,10,1,863071,86441,604800,99.8,\"R\",\"1:ppn=10\"]],[\"6555147.pbs.hpc.swin.edu.au\",\"mag\",\"p015_swin\",[\"gstar031\",\"gstar031\",\"gstar031\",\"gstar031\",\"gstar031\",\"gstar031\",\"gstar031\",\"gstar031\",\"gstar031\",\"gstar031\"],[\"Job 6555147.pbs.hpc.swin.edu.au\",\"res_sig_m32_37\",\"R\",\"Nodes 1\",\"Cpus 10\",\"Mem/VM 467M/7G\",\"Wall Time 23:42:59\",\"Remaining 144:17:01\"],[467.5,7623.4,10,1,840622,85379,604800,98.5,\"R\",\"1:ppn=10\"]],[\"6556756.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar132\",\"sstar132\",\"sstar132\",\"sstar132\",\"sstar132\",\"sstar132\",\"sstar132\",\"sstar132\"],[\"Job 6556756.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 147M/1954M\",\"Wall Time 50:23:35\",\"Remaining 93:36:25\"],[147.6,1954.6,8,1,1449266,181415,518400,99.9,\"R\",\"1:ppn=8\"]],[\"6556757.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar136\",\"sstar136\",\"sstar136\",\"sstar136\",\"sstar136\",\"sstar136\",\"sstar136\",\"sstar136\"],[\"Job 6556757.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 145M/1954M\",\"Wall Time 50:23:23\",\"Remaining 93:36:37\"],[145.6,1954.4,8,1,1449552,181403,518400,99.9,\"R\",\"1:ppn=8\"]],[\"6556758.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar139\",\"sstar139\",\"sstar139\",\"sstar139\",\"sstar139\",\"sstar139\",\"sstar139\",\"sstar139\"],[\"Job 6556758.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 145M/1954M\",\"Wall Time 50:23:39\",\"Remaining 93:36:21\"],[145.9,1954.4,8,1,1449331,181419,518400,99.9,\"R\",\"1:ppn=8\"]],[\"6556759.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar129\",\"sstar129\",\"sstar129\",\"sstar129\",\"sstar129\",\"sstar129\",\"sstar129\",\"sstar129\"],[\"Job 6556759.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 148M/1954M\",\"Wall Time 48:30:02\",\"Remaining 95:29:58\"],[148.6,1954.9,8,1,1394935,174602,518400,99.9,\"R\",\"1:ppn=8\"]],[\"6556760.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar127\",\"sstar127\",\"sstar127\",\"sstar127\",\"sstar127\",\"sstar127\",\"sstar127\",\"sstar127\"],[\"Job 6556760.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 147M/1954M\",\"Wall Time 33:56:49\",\"Remaining 110:03:11\"],[147.2,1954.6,8,1,976012,122209,518400,99.8,\"R\",\"1:ppn=8\"]],[\"6556761.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar120\",\"sstar120\",\"sstar120\",\"sstar120\",\"sstar120\",\"sstar120\",\"sstar120\",\"sstar120\"],[\"Job 6556761.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 148M/1955M\",\"Wall Time 31:26:47\",\"Remaining 112:33:13\"],[148.5,1955.4,8,1,903947,113207,518400,99.8,\"R\",\"1:ppn=8\"]],[\"6556762.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar128\",\"sstar128\",\"sstar128\",\"sstar128\",\"sstar128\",\"sstar128\",\"sstar128\",\"sstar128\"],[\"Job 6556762.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 147M/1954M\",\"Wall Time 31:11:08\",\"Remaining 112:48:52\"],[147.4,1954.6,8,1,896549,112268,518400,99.8,\"R\",\"1:ppn=8\"]],[\"6556763.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\"],[\"Job 6556763.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 147M/1954M\",\"Wall Time 19:33:54\",\"Remaining 124:26:06\"],[147.5,1954.6,8,1,562354,70434,518400,99.8,\"R\",\"1:ppn=8\"]],[\"6556764.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\",\"sstar147\"],[\"Job 6556764.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 147M/1954M\",\"Wall Time 19:33:53\",\"Remaining 124:26:07\"],[147.6,1954.5,8,1,562217,70433,518400,99.8,\"R\",\"1:ppn=8\"]],[\"6556765.pbs.hpc.swin.edu.au\",\"dos\",\"none\",[\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\"],[\"Job 6556765.pbs.hpc.swin.edu.au\",\"lmp.run\",\"R\",\"Nodes 1\",\"Cpus 8\",\"Mem/VM 147M/1954M\",\"Wall Time 17:51:18\",\"Remaining 126:08:42\"],[147.4,1954.6,8,1,513417,64278,518400,99.8,\"R\",\"1:ppn=8\"]],[\"6558523.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558523.pbs.hpc.swin.edu.au\",\"match_22.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:06:46\",\"Remaining 106:53:14\"],[0.0,0.0,1,1,52803,65206,450000,81.0,\"R\",\"1:ppn=1\"]],[\"6558524.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558524.pbs.hpc.swin.edu.au\",\"match_23.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:06:45\",\"Remaining 106:53:15\"],[0.0,0.0,1,1,51591,65205,450000,79.1,\"R\",\"1:ppn=1\"]],[\"6558525.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558525.pbs.hpc.swin.edu.au\",\"match_24.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:06:45\",\"Remaining 106:53:15\"],[0.0,0.0,1,1,52353,65205,450000,80.3,\"R\",\"1:ppn=1\"]],[\"6558526.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558526.pbs.hpc.swin.edu.au\",\"match_25.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:06:44\",\"Remaining 106:53:16\"],[0.0,0.0,1,1,52904,65204,450000,81.1,\"R\",\"1:ppn=1\"]],[\"6558527.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558527.pbs.hpc.swin.edu.au\",\"match_26.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:05:58\",\"Remaining 106:54:02\"],[0.0,0.0,1,1,52698,65158,450000,80.9,\"R\",\"1:ppn=1\"]],[\"6558528.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558528.pbs.hpc.swin.edu.au\",\"match_27.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:05:58\",\"Remaining 106:54:02\"],[0.0,0.0,1,1,52960,65158,450000,81.3,\"R\",\"1:ppn=1\"]],[\"6558529.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558529.pbs.hpc.swin.edu.au\",\"match_28.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:05:57\",\"Remaining 106:54:03\"],[0.0,0.0,1,1,52476,65157,450000,80.5,\"R\",\"1:ppn=1\"]],[\"6558530.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558530.pbs.hpc.swin.edu.au\",\"match_29.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:05:57\",\"Remaining 106:54:03\"],[0.0,0.0,1,1,53104,65157,450000,81.5,\"R\",\"1:ppn=1\"]],[\"6558532.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558532.pbs.hpc.swin.edu.au\",\"match_31.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:05:55\",\"Remaining 106:54:05\"],[0.0,0.0,1,1,52771,65155,450000,81.0,\"R\",\"1:ppn=1\"]],[\"6558533.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558533.pbs.hpc.swin.edu.au\",\"match_32.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:05:55\",\"Remaining 106:54:05\"],[0.0,0.0,1,1,53360,65155,450000,81.9,\"R\",\"1:ppn=1\"]],[\"6558534.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar025\"],[\"Job 6558534.pbs.hpc.swin.edu.au\",\"match_33.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 18:05:54\",\"Remaining 106:54:06\"],[0.0,0.0,1,1,52598,65154,450000,80.7,\"R\",\"1:ppn=1\"]],[\"6558535.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar016\"],[\"Job 6558535.pbs.hpc.swin.edu.au\",\"match_34.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 09:45:24\",\"Remaining 115:14:36\"],[0.0,0.0,1,1,24162,35124,450000,68.8,\"R\",\"1:ppn=1\"]],[\"6558536.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar014\"],[\"Job 6558536.pbs.hpc.swin.edu.au\",\"match_35.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 09:22:40\",\"Remaining 115:37:20\"],[0.0,0.0,1,1,22412,33760,450000,66.4,\"R\",\"1:ppn=1\"]],[\"6558537.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar015\"],[\"Job 6558537.pbs.hpc.swin.edu.au\",\"match_36.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 09:10:51\",\"Remaining 115:49:09\"],[0.0,0.0,1,1,22531,33051,450000,68.2,\"R\",\"1:ppn=1\"]],[\"6558538.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar015\"],[\"Job 6558538.pbs.hpc.swin.edu.au\",\"match_37.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 09:04:05\",\"Remaining 115:55:55\"],[0.0,0.0,1,1,22494,32645,450000,68.9,\"R\",\"1:ppn=1\"]],[\"6558539.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar013\"],[\"Job 6558539.pbs.hpc.swin.edu.au\",\"match_38.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 09:03:11\",\"Remaining 115:56:49\"],[0.0,0.0,1,1,21644,32591,450000,66.4,\"R\",\"1:ppn=1\"]],[\"6558540.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar014\"],[\"Job 6558540.pbs.hpc.swin.edu.au\",\"match_39.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 09:02:51\",\"Remaining 115:57:09\"],[0.0,0.0,1,1,22563,32571,450000,69.3,\"R\",\"1:ppn=1\"]],[\"6558541.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar017\"],[\"Job 6558541.pbs.hpc.swin.edu.au\",\"match_40.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 09:00:05\",\"Remaining 115:59:55\"],[0.0,0.0,1,1,22320,32405,450000,68.9,\"R\",\"1:ppn=1\"]],[\"6558542.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar017\"],[\"Job 6558542.pbs.hpc.swin.edu.au\",\"match_41.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 08:41:38\",\"Remaining 116:18:22\"],[0.0,0.0,1,1,21014,31298,450000,67.1,\"R\",\"1:ppn=1\"]],[\"6558543.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar016\"],[\"Job 6558543.pbs.hpc.swin.edu.au\",\"match_42.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 08:39:02\",\"Remaining 116:20:58\"],[0.0,0.0,1,1,20958,31142,450000,67.3,\"R\",\"1:ppn=1\"]],[\"6558544.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar013\"],[\"Job 6558544.pbs.hpc.swin.edu.au\",\"match_43.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 08:17:54\",\"Remaining 116:42:06\"],[0.0,0.0,1,1,19109,29874,450000,64.0,\"R\",\"1:ppn=1\"]],[\"6558545.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558545.pbs.hpc.swin.edu.au\",\"match_44.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 06:28:34\",\"Remaining 118:31:26\"],[0.0,0.0,1,1,15055,23314,450000,64.6,\"R\",\"1:ppn=1\"]],[\"6558546.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558546.pbs.hpc.swin.edu.au\",\"match_45.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 05:59:21\",\"Remaining 119:00:39\"],[0.0,0.0,1,1,13882,21561,450000,64.4,\"R\",\"1:ppn=1\"]],[\"6558547.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558547.pbs.hpc.swin.edu.au\",\"match_46.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 05:21:22\",\"Remaining 119:38:38\"],[0.0,0.0,1,1,11283,19282,450000,58.5,\"R\",\"1:ppn=1\"]],[\"6558548.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558548.pbs.hpc.swin.edu.au\",\"match_47.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 04:24:16\",\"Remaining 120:35:44\"],[0.0,0.0,1,1,9071,15856,450000,57.2,\"R\",\"1:ppn=1\"]],[\"6558549.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558549.pbs.hpc.swin.edu.au\",\"match_48.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 04:18:01\",\"Remaining 120:41:59\"],[0.0,0.0,1,1,8792,15481,450000,56.8,\"R\",\"1:ppn=1\"]],[\"6558550.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558550.pbs.hpc.swin.edu.au\",\"match_49.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:33:37\",\"Remaining 121:26:23\"],[0.0,0.0,1,1,6649,12817,450000,51.9,\"R\",\"1:ppn=1\"]],[\"6558551.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558551.pbs.hpc.swin.edu.au\",\"match_50.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:15:56\",\"Remaining 121:44:04\"],[0.0,0.0,1,1,5798,11756,450000,49.3,\"R\",\"1:ppn=1\"]],[\"6558552.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558552.pbs.hpc.swin.edu.au\",\"match_51.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:13:50\",\"Remaining 121:46:10\"],[0.0,0.0,1,1,5947,11630,450000,51.1,\"R\",\"1:ppn=1\"]],[\"6558553.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar011\"],[\"Job 6558553.pbs.hpc.swin.edu.au\",\"match_52.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:03:56\",\"Remaining 121:56:04\"],[0.0,0.0,1,1,5865,11036,450000,53.1,\"R\",\"1:ppn=1\"]],[\"6558554.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558554.pbs.hpc.swin.edu.au\",\"match_53.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:21\",\"Remaining 121:57:39\"],[0.0,0.0,1,1,5420,10941,450000,49.5,\"R\",\"1:ppn=1\"]],[\"6558555.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558555.pbs.hpc.swin.edu.au\",\"match_54.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:20\",\"Remaining 121:57:40\"],[0.0,0.0,1,1,4750,10940,450000,43.4,\"R\",\"1:ppn=1\"]],[\"6558556.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558556.pbs.hpc.swin.edu.au\",\"match_55.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:20\",\"Remaining 121:57:40\"],[0.0,0.0,1,1,4905,10940,450000,44.8,\"R\",\"1:ppn=1\"]],[\"6558557.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558557.pbs.hpc.swin.edu.au\",\"match_56.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:19\",\"Remaining 121:57:41\"],[0.0,0.0,1,1,4553,10939,450000,41.6,\"R\",\"1:ppn=1\"]],[\"6558558.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558558.pbs.hpc.swin.edu.au\",\"match_57.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:19\",\"Remaining 121:57:41\"],[0.0,0.0,1,1,4732,10939,450000,43.3,\"R\",\"1:ppn=1\"]],[\"6558559.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558559.pbs.hpc.swin.edu.au\",\"match_58.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:18\",\"Remaining 121:57:42\"],[0.0,0.0,1,1,4728,10938,450000,43.2,\"R\",\"1:ppn=1\"]],[\"6558560.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558560.pbs.hpc.swin.edu.au\",\"match_59.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:17\",\"Remaining 121:57:43\"],[0.0,0.0,1,1,4974,10937,450000,45.5,\"R\",\"1:ppn=1\"]],[\"6558561.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558561.pbs.hpc.swin.edu.au\",\"match_60.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:17\",\"Remaining 121:57:43\"],[0.0,0.0,1,1,4591,10937,450000,42.0,\"R\",\"1:ppn=1\"]],[\"6558562.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558562.pbs.hpc.swin.edu.au\",\"match_61.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:16\",\"Remaining 121:57:44\"],[0.0,0.0,1,1,4796,10936,450000,43.9,\"R\",\"1:ppn=1\"]],[\"6558563.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar047\"],[\"Job 6558563.pbs.hpc.swin.edu.au\",\"match_62.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:16\",\"Remaining 121:57:44\"],[0.0,0.0,1,1,4766,10936,450000,43.6,\"R\",\"1:ppn=1\"]],[\"6558564.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar046\"],[\"Job 6558564.pbs.hpc.swin.edu.au\",\"match_63.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:16\",\"Remaining 121:57:44\"],[0.0,0.0,1,1,4922,10936,450000,45.0,\"R\",\"1:ppn=1\"]],[\"6558565.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar046\"],[\"Job 6558565.pbs.hpc.swin.edu.au\",\"match_64.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:15\",\"Remaining 121:57:45\"],[0.0,0.0,1,1,5457,10935,450000,49.9,\"R\",\"1:ppn=1\"]],[\"6558566.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar046\"],[\"Job 6558566.pbs.hpc.swin.edu.au\",\"match_65.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:15\",\"Remaining 121:57:45\"],[0.0,0.0,1,1,4531,10935,450000,41.4,\"R\",\"1:ppn=1\"]],[\"6558567.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar046\"],[\"Job 6558567.pbs.hpc.swin.edu.au\",\"match_66.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:14\",\"Remaining 121:57:46\"],[0.0,0.0,1,1,4647,10934,450000,42.5,\"R\",\"1:ppn=1\"]],[\"6558568.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar046\"],[\"Job 6558568.pbs.hpc.swin.edu.au\",\"match_67.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:14\",\"Remaining 121:57:46\"],[0.0,0.0,1,1,4438,10934,450000,40.6,\"R\",\"1:ppn=1\"]],[\"6558569.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar046\"],[\"Job 6558569.pbs.hpc.swin.edu.au\",\"match_68.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:13\",\"Remaining 121:57:47\"],[0.0,0.0,1,1,4954,10933,450000,45.3,\"R\",\"1:ppn=1\"]],[\"6558570.pbs.hpc.swin.edu.au\",\"aco\",\"none\",[\"gstar046\"],[\"Job 6558570.pbs.hpc.swin.edu.au\",\"match_69.sh\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 2G/3G\",\"Wall Time 03:02:12\",\"Remaining 121:57:48\"],[0.0,0.0,1,1,5004,10932,450000,45.8,\"R\",\"1:ppn=1\"]],[\"6558571.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar116\"],[\"Job 6558571.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 50M/361M\",\"Wall Time 23:53:17\",\"Remaining 144:06:43\"],[0.0,0.0,1,1,85839,85997,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6558572.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar116\"],[\"Job 6558572.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 50M/361M\",\"Wall Time 23:50:53\",\"Remaining 144:09:07\"],[0.0,0.0,1,1,85686,85853,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6558573.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar116\"],[\"Job 6558573.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 51M/361M\",\"Wall Time 23:48:47\",\"Remaining 144:11:13\"],[0.0,0.0,1,1,85561,85727,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6558574.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar116\"],[\"Job 6558574.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 51M/361M\",\"Wall Time 23:47:44\",\"Remaining 144:12:16\"],[0.0,0.0,1,1,85509,85664,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6558575.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar117\"],[\"Job 6558575.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 50M/361M\",\"Wall Time 23:45:34\",\"Remaining 144:14:26\"],[0.0,0.0,1,1,85380,85534,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6558576.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar117\"],[\"Job 6558576.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 50M/361M\",\"Wall Time 23:44:31\",\"Remaining 144:15:29\"],[0.0,0.0,1,1,85309,85471,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6558577.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar119\"],[\"Job 6558577.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:30:49\",\"Remaining 144:29:11\"],[0.0,0.0,1,1,84524,84649,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6558578.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar119\"],[\"Job 6558578.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:30:17\",\"Remaining 144:29:43\"],[0.0,0.0,1,1,84508,84617,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6558579.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar121\"],[\"Job 6558579.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:30:27\",\"Remaining 144:29:33\"],[0.0,0.0,1,1,84485,84627,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6558580.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar123\"],[\"Job 6558580.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:29:54\",\"Remaining 144:30:06\"],[0.0,0.0,1,1,84471,84594,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6558581.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar123\"],[\"Job 6558581.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:29:53\",\"Remaining 144:30:07\"],[0.0,0.0,1,1,84471,84593,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6558582.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar125\"],[\"Job 6558582.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:30:15\",\"Remaining 144:29:45\"],[0.0,0.0,1,1,84499,84615,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6558583.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar125\"],[\"Job 6558583.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:30:13\",\"Remaining 144:29:47\"],[0.0,0.0,1,1,84498,84613,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6558584.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar127\"],[\"Job 6558584.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:29:13\",\"Remaining 144:30:47\"],[0.0,0.0,1,1,84314,84553,604800,99.7,\"R\",\"1:ppn=1\"]],[\"6558585.pbs.hpc.swin.edu.au\",\"kpr\",\"none\",[\"sstar127\"],[\"Job 6558585.pbs.hpc.swin.edu.au\",\"POS_12\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 49M/365M\",\"Wall Time 23:29:57\",\"Remaining 144:30:03\"],[0.0,0.0,1,1,84475,84597,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559532.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\",\"sstar019\"],[\"Job 6559532.pbs.hpc.swin.edu.au\",\"test_712_01_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 1033M/23G\",\"Wall Time 14:14:04\",\"Remaining 02:45:56\"],[1033.8,23784.2,14,1,716418,51244,61200,99.9,\"R\",\"1:ppn=14\"]],[\"6559533.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\",\"sstar101\"],[\"Job 6559533.pbs.hpc.swin.edu.au\",\"test_974_01_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 1031M/23G\",\"Wall Time 14:06:35\",\"Remaining 02:53:25\"],[1031.9,23785.4,14,1,710044,50795,61200,99.8,\"R\",\"1:ppn=14\"]],[\"6559537.pbs.hpc.swin.edu.au\",\"aha\",\"p133_swin\",[\"gstar025\"],[\"Job 6559537.pbs.hpc.swin.edu.au\",\"Cgo_pca_log_11_005095\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 214M/1027M\",\"Wall Time 04:01:07\",\"Remaining 19:58:53\"],[0.0,0.0,1,1,14455,14467,86400,99.9,\"R\",\"1:ppn=1\"]],[\"6559538.pbs.hpc.swin.edu.au\",\"aha\",\"p133_swin\",[\"gstar011\"],[\"Job 6559538.pbs.hpc.swin.edu.au\",\"Cgo_pca_log_12_005095\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 216M/1027M\",\"Wall Time 04:00:22\",\"Remaining 43:59:38\"],[0.0,0.0,1,1,14412,14422,172800,99.9,\"R\",\"1:ppn=1\"]],[\"6559539.pbs.hpc.swin.edu.au\",\"aha\",\"p133_swin\",[\"gstar049\"],[\"Job 6559539.pbs.hpc.swin.edu.au\",\"Cgo_pca_log_21_005095\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 215M/1027M\",\"Wall Time 03:02:21\",\"Remaining 44:57:39\"],[0.0,0.0,1,1,10933,10941,172800,99.9,\"R\",\"1:ppn=1\"]],[\"6559540.pbs.hpc.swin.edu.au\",\"aha\",\"p133_swin\",[\"gstar049\"],[\"Job 6559540.pbs.hpc.swin.edu.au\",\"Cgo_pca_log_31_005095\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 214M/1027M\",\"Wall Time 03:02:20\",\"Remaining 44:57:40\"],[0.0,0.0,1,1,10933,10940,172800,99.9,\"R\",\"1:ppn=1\"]],[\"6559553.pbs.hpc.swin.edu.au\",\"ttr\",\"none\",[\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\",\"gstar020\"],[\"Job 6559553.pbs.hpc.swin.edu.au\",\"jetcubic\",\"R\",\"Nodes 1\",\"Cpus 12\",\"Mem/VM 1006M/90G\",\"Wall Time 02:21:49\",\"Remaining 165:38:11\"],[1006.3,92619.3,12,1,51517,8509,604800,50.5,\"R\",\"1:ppn=12\"]],[\"6559574.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\",\"sstar165\"],[\"Job 6559574.pbs.hpc.swin.edu.au\",\"test_593_06_pH3_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 730M/22G\",\"Wall Time 03:50:18\",\"Remaining 06:09:42\"],[730.5,23041.4,14,1,193171,13818,36000,99.9,\"R\",\"1:ppn=14\"]],[\"6559575.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\",\"sstar154\"],[\"Job 6559575.pbs.hpc.swin.edu.au\",\"test_712_06_pH3_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 727M/22G\",\"Wall Time 03:44:33\",\"Remaining 06:15:27\"],[727.7,23040.7,14,1,188282,13473,36000,99.8,\"R\",\"1:ppn=14\"]],[\"6559576.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\",\"sstar133\"],[\"Job 6559576.pbs.hpc.swin.edu.au\",\"test_974_06_pH3_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 724M/22G\",\"Wall Time 03:16:47\",\"Remaining 06:43:13\"],[724.4,23040.4,14,1,164898,11807,36000,99.8,\"R\",\"1:ppn=14\"]],[\"6559577.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\",\"sstar022\"],[\"Job 6559577.pbs.hpc.swin.edu.au\",\"test_593_07_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 552M/22G\",\"Wall Time 03:14:03\",\"Remaining 02:45:57\"],[552.9,22649.0,14,1,162765,11643,21600,99.9,\"R\",\"1:ppn=14\"]],[\"6559578.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\",\"sstar027\"],[\"Job 6559578.pbs.hpc.swin.edu.au\",\"test_712_07_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 552M/22G\",\"Wall Time 03:11:38\",\"Remaining 02:48:22\"],[552.0,22649.1,14,1,160700,11498,21600,99.8,\"R\",\"1:ppn=14\"]],[\"6559579.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\",\"sstar102\"],[\"Job 6559579.pbs.hpc.swin.edu.au\",\"test_974_07_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 552M/22G\",\"Wall Time 02:39:20\",\"Remaining 03:20:40\"],[552.4,22648.4,14,1,133618,9560,21600,99.8,\"R\",\"1:ppn=14\"]],[\"6559581.pbs.hpc.swin.edu.au\",\"sjo\",\"none\",[\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar160\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar161\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar162\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\",\"sstar163\"],[\"Job 6559581.pbs.hpc.swin.edu.au\",\"cosmomc\",\"R\",\"Nodes 4\",\"Cpus 56\",\"Mem/VM per node 551M/4G\",\"Wall Time 05:11:28\",\"Remaining 162:48:32\"],[2205.0,17367.2,56,4,532345,18688,604800,50.9,\"R\",\"4:ppn=14\"]],[\"6559590.pbs.hpc.swin.edu.au\",\"jwu\",\"none\",[\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\",\"gstar019\"],[\"Job 6559590.pbs.hpc.swin.edu.au\",\"fourhundred_si\",\"R\",\"Nodes 1\",\"Cpus 12\",\"Mem/VM 27G/39G\",\"Wall Time 02:13:26\",\"Remaining 165:46:34\"],[28328.9,40097.7,12,1,61047,8006,604800,63.5,\"R\",\"1:ppn=12\"]],[\"6559598.pbs.hpc.swin.edu.au\",\"jwu\",\"none\",[\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\",\"sstar164\"],[\"Job 6559598.pbs.hpc.swin.edu.au\",\"log_h9999\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 138M/16G\",\"Wall Time 03:53:35\",\"Remaining 08:06:25\"],[138.8,16822.2,16,1,222348,14015,43200,99.2,\"R\",\"1:ppn=16\"]],[\"6559601.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\",\"sstar107\"],[\"Job 6559601.pbs.hpc.swin.edu.au\",\"test_593_03_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 503M/22G\",\"Wall Time 02:18:55\",\"Remaining 02:41:05\"],[503.6,22555.2,14,1,116481,8335,18000,99.8,\"R\",\"1:ppn=14\"]],[\"6559602.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\",\"sstar111\"],[\"Job 6559602.pbs.hpc.swin.edu.au\",\"test_712_03_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 527M/22G\",\"Wall Time 02:20:49\",\"Remaining 02:39:11\"],[527.9,22557.2,14,1,118022,8449,18000,99.8,\"R\",\"1:ppn=14\"]],[\"6559603.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\",\"sstar017\"],[\"Job 6559603.pbs.hpc.swin.edu.au\",\"test_974_03_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 505M/22G\",\"Wall Time 02:18:09\",\"Remaining 02:41:51\"],[505.3,22555.7,14,1,115869,8289,18000,99.8,\"R\",\"1:ppn=14\"]],[\"6559607.pbs.hpc.swin.edu.au\",\"jwu\",\"none\",[\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\",\"sstar137\"],[\"Job 6559607.pbs.hpc.swin.edu.au\",\"fourhundred_sgs\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 29G/41G\",\"Wall Time 01:34:45\",\"Remaining 166:25:15\"],[30123.1,42589.4,16,1,67081,5685,604800,73.7,\"R\",\"1:ppn=16\"]],[\"6559613.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\",\"sstar143\"],[\"Job 6559613.pbs.hpc.swin.edu.au\",\"test_593_05_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 485M/21G\",\"Wall Time 02:06:54\",\"Remaining 02:53:06\"],[485.2,22491.1,14,1,106416,7614,18000,99.8,\"R\",\"1:ppn=14\"]],[\"6559614.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\",\"sstar015\"],[\"Job 6559614.pbs.hpc.swin.edu.au\",\"test_712_05_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 485M/21G\",\"Wall Time 01:34:04\",\"Remaining 03:25:56\"],[485.4,22490.9,14,1,78885,5644,18000,99.8,\"R\",\"1:ppn=14\"]],[\"6559615.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\",\"sstar105\"],[\"Job 6559615.pbs.hpc.swin.edu.au\",\"test_974_05_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 484M/21G\",\"Wall Time 01:37:03\",\"Remaining 03:22:57\"],[484.2,22490.9,14,1,81355,5823,18000,99.8,\"R\",\"1:ppn=14\"]],[\"6559621.pbs.hpc.swin.edu.au\",\"jas\",\"none\",[\"gstar049\",\"gstar049\",\"gstar049\",\"gstar049\",\"gstar049\",\"gstar049\"],[\"Job 6559621.pbs.hpc.swin.edu.au\",\"5par_fit_snlens_cosmo\",\"R\",\"Nodes 1\",\"Cpus 6\",\"Mem/VM 1038M/6G\",\"Wall Time 02:42:37\",\"Remaining 13:37:23\"],[1039.0,6773.2,6,1,57781,9757,58800,98.7,\"R\",\"1:ppn=6\"]],[\"6559628.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559628.pbs.hpc.swin.edu.au\",\"IT_SQP_1MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 284M/1155M\",\"Wall Time 02:16:03\",\"Remaining 165:43:57\"],[0.0,0.0,1,1,8148,8163,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559629.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559629.pbs.hpc.swin.edu.au\",\"IT_SQP_2MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 284M/1155M\",\"Wall Time 02:16:02\",\"Remaining 165:43:58\"],[0.0,0.0,1,1,8153,8162,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559630.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559630.pbs.hpc.swin.edu.au\",\"IT_SQP_3MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 282M/1147M\",\"Wall Time 02:16:02\",\"Remaining 165:43:58\"],[0.0,0.0,1,1,8149,8162,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559631.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559631.pbs.hpc.swin.edu.au\",\"IT_SQP_4MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 282M/1155M\",\"Wall Time 02:16:01\",\"Remaining 165:43:59\"],[0.0,0.0,1,1,8156,8161,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559632.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559632.pbs.hpc.swin.edu.au\",\"IT_SQP_5MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 282M/1147M\",\"Wall Time 02:16:01\",\"Remaining 165:43:59\"],[0.0,0.0,1,1,8149,8161,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559633.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559633.pbs.hpc.swin.edu.au\",\"IT_SQP_6MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 280M/1147M\",\"Wall Time 02:16:00\",\"Remaining 165:44:00\"],[0.0,0.0,1,1,8155,8160,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559634.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559634.pbs.hpc.swin.edu.au\",\"IT_SQP_7MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 284M/1155M\",\"Wall Time 02:15:59\",\"Remaining 165:44:01\"],[0.0,0.0,1,1,8146,8159,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559635.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559635.pbs.hpc.swin.edu.au\",\"IT_SQP_8MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 281M/1147M\",\"Wall Time 02:15:59\",\"Remaining 165:44:01\"],[0.0,0.0,1,1,8152,8159,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559636.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559636.pbs.hpc.swin.edu.au\",\"IT_SQP_9MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 281M/1147M\",\"Wall Time 02:15:58\",\"Remaining 165:44:02\"],[0.0,0.0,1,1,8153,8158,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559637.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar056\"],[\"Job 6559637.pbs.hpc.swin.edu.au\",\"IT_SQP_10MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 283M/1155M\",\"Wall Time 02:15:58\",\"Remaining 165:44:02\"],[0.0,0.0,1,1,8152,8158,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559638.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar049\"],[\"Job 6559638.pbs.hpc.swin.edu.au\",\"IT_SQP_11MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 281M/1147M\",\"Wall Time 02:16:04\",\"Remaining 165:43:56\"],[0.0,0.0,1,1,8135,8164,604800,99.6,\"R\",\"1:ppn=1\"]],[\"6559639.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar049\"],[\"Job 6559639.pbs.hpc.swin.edu.au\",\"IT_SQP_12MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 281M/1147M\",\"Wall Time 02:16:02\",\"Remaining 165:43:58\"],[0.0,0.0,1,1,8151,8162,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559640.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559640.pbs.hpc.swin.edu.au\",\"IT_SQP_13MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 312M/1219M\",\"Wall Time 02:16:11\",\"Remaining 165:43:49\"],[0.0,0.0,1,1,8136,8171,604800,99.6,\"R\",\"1:ppn=1\"]],[\"6559641.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559641.pbs.hpc.swin.edu.au\",\"IT_SQP_14MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 302M/1155M\",\"Wall Time 02:16:10\",\"Remaining 165:43:50\"],[0.0,0.0,1,1,8153,8170,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559642.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559642.pbs.hpc.swin.edu.au\",\"IT_SQP_15MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 297M/1155M\",\"Wall Time 02:16:09\",\"Remaining 165:43:51\"],[0.0,0.0,1,1,8159,8169,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559643.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559643.pbs.hpc.swin.edu.au\",\"IT_SQP_16MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 292M/1155M\",\"Wall Time 02:16:09\",\"Remaining 165:43:51\"],[0.0,0.0,1,1,8160,8169,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559644.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559644.pbs.hpc.swin.edu.au\",\"IT_SQP_17MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 288M/1155M\",\"Wall Time 02:16:08\",\"Remaining 165:43:52\"],[0.0,0.0,1,1,8152,8168,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559645.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559645.pbs.hpc.swin.edu.au\",\"IT_SQP_18MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 285M/1155M\",\"Wall Time 02:16:08\",\"Remaining 165:43:52\"],[0.0,0.0,1,1,8161,8168,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559646.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559646.pbs.hpc.swin.edu.au\",\"IT_SQP_19MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 313M/1219M\",\"Wall Time 02:16:07\",\"Remaining 165:43:53\"],[0.0,0.0,1,1,8142,8167,604800,99.7,\"R\",\"1:ppn=1\"]],[\"6559647.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559647.pbs.hpc.swin.edu.au\",\"IT_SQP_20MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 307M/1219M\",\"Wall Time 02:16:06\",\"Remaining 165:43:54\"],[0.0,0.0,1,1,8154,8166,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559648.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559648.pbs.hpc.swin.edu.au\",\"IT_SQP_21MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 298M/1155M\",\"Wall Time 02:16:06\",\"Remaining 165:43:54\"],[0.0,0.0,1,1,8157,8166,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559649.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar048\"],[\"Job 6559649.pbs.hpc.swin.edu.au\",\"IT_SQP_22MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 293M/1155M\",\"Wall Time 02:16:05\",\"Remaining 165:43:55\"],[0.0,0.0,1,1,8159,8165,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559650.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar046\"],[\"Job 6559650.pbs.hpc.swin.edu.au\",\"IT_SQP_23MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 289M/1155M\",\"Wall Time 02:15:46\",\"Remaining 165:44:14\"],[0.0,0.0,1,1,8137,8146,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559651.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar046\"],[\"Job 6559651.pbs.hpc.swin.edu.au\",\"IT_SQP_24MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 285M/1155M\",\"Wall Time 02:15:45\",\"Remaining 165:44:15\"],[0.0,0.0,1,1,8138,8145,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559652.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar046\"],[\"Job 6559652.pbs.hpc.swin.edu.au\",\"IT_SQP_25MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 311M/1219M\",\"Wall Time 02:14:59\",\"Remaining 165:45:01\"],[0.0,0.0,1,1,8076,8099,604800,99.7,\"R\",\"1:ppn=1\"]],[\"6559653.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559653.pbs.hpc.swin.edu.au\",\"IT_SQP_26MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 303M/1155M\",\"Wall Time 02:15:39\",\"Remaining 165:44:21\"],[0.0,0.0,1,1,8124,8139,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559654.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559654.pbs.hpc.swin.edu.au\",\"IT_SQP_27MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 295M/1155M\",\"Wall Time 02:15:39\",\"Remaining 165:44:21\"],[0.0,0.0,1,1,8127,8139,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559655.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559655.pbs.hpc.swin.edu.au\",\"IT_SQP_28MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 290M/1155M\",\"Wall Time 02:15:38\",\"Remaining 165:44:22\"],[0.0,0.0,1,1,8128,8138,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559656.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559656.pbs.hpc.swin.edu.au\",\"IT_SQP_29MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 288M/1155M\",\"Wall Time 02:15:37\",\"Remaining 165:44:23\"],[0.0,0.0,1,1,8129,8137,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559657.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559657.pbs.hpc.swin.edu.au\",\"IT_SQP_30MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 284M/1155M\",\"Wall Time 02:15:37\",\"Remaining 165:44:23\"],[0.0,0.0,1,1,8128,8137,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559658.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559658.pbs.hpc.swin.edu.au\",\"IT_SQP_31MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 314M/1219M\",\"Wall Time 02:15:36\",\"Remaining 165:44:24\"],[0.0,0.0,1,1,8101,8136,604800,99.6,\"R\",\"1:ppn=1\"]],[\"6559659.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559659.pbs.hpc.swin.edu.au\",\"IT_SQP_32MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 306M/1155M\",\"Wall Time 02:15:36\",\"Remaining 165:44:24\"],[0.0,0.0,1,1,8122,8136,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559660.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559660.pbs.hpc.swin.edu.au\",\"IT_SQP_33MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 299M/1155M\",\"Wall Time 02:15:35\",\"Remaining 165:44:25\"],[0.0,0.0,1,1,8124,8135,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559661.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559661.pbs.hpc.swin.edu.au\",\"IT_SQP_34MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 296M/1155M\",\"Wall Time 02:15:34\",\"Remaining 165:44:26\"],[0.0,0.0,1,1,8127,8134,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559662.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar043\"],[\"Job 6559662.pbs.hpc.swin.edu.au\",\"IT_SQP_35MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 292M/1155M\",\"Wall Time 02:15:34\",\"Remaining 165:44:26\"],[0.0,0.0,1,1,8127,8134,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559663.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559663.pbs.hpc.swin.edu.au\",\"IT_SQP_36MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 288M/1155M\",\"Wall Time 02:15:33\",\"Remaining 165:44:27\"],[0.0,0.0,1,1,8125,8133,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559664.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559664.pbs.hpc.swin.edu.au\",\"IT_SQP_37MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 285M/1155M\",\"Wall Time 02:15:32\",\"Remaining 165:44:28\"],[0.0,0.0,1,1,8098,8132,604800,99.6,\"R\",\"1:ppn=1\"]],[\"6559665.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559665.pbs.hpc.swin.edu.au\",\"IT_SQP_38MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 286M/1155M\",\"Wall Time 02:15:32\",\"Remaining 165:44:28\"],[0.0,0.0,1,1,8118,8132,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559666.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559666.pbs.hpc.swin.edu.au\",\"IT_SQP_39MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 284M/1155M\",\"Wall Time 02:15:31\",\"Remaining 165:44:29\"],[0.0,0.0,1,1,8123,8131,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559667.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559667.pbs.hpc.swin.edu.au\",\"IT_SQP_40MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 282M/1155M\",\"Wall Time 02:15:31\",\"Remaining 165:44:29\"],[0.0,0.0,1,1,8122,8131,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559668.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559668.pbs.hpc.swin.edu.au\",\"IT_SQP_41MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 282M/1147M\",\"Wall Time 02:15:30\",\"Remaining 165:44:30\"],[0.0,0.0,1,1,8124,8130,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559669.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559669.pbs.hpc.swin.edu.au\",\"IT_SQP_42MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 282M/1147M\",\"Wall Time 02:15:30\",\"Remaining 165:44:30\"],[0.0,0.0,1,1,8125,8130,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559670.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559670.pbs.hpc.swin.edu.au\",\"IT_SQP_43MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 287M/1155M\",\"Wall Time 02:15:29\",\"Remaining 165:44:31\"],[0.0,0.0,1,1,8097,8129,604800,99.6,\"R\",\"1:ppn=1\"]],[\"6559671.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559671.pbs.hpc.swin.edu.au\",\"IT_SQP_44MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 284M/1155M\",\"Wall Time 02:15:28\",\"Remaining 165:44:32\"],[0.0,0.0,1,1,8111,8128,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559672.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar042\"],[\"Job 6559672.pbs.hpc.swin.edu.au\",\"IT_SQP_45MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 283M/1155M\",\"Wall Time 02:15:28\",\"Remaining 165:44:32\"],[0.0,0.0,1,1,8116,8128,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559673.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559673.pbs.hpc.swin.edu.au\",\"IT_SQP_46MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 284M/1155M\",\"Wall Time 02:15:28\",\"Remaining 165:44:32\"],[0.0,0.0,1,1,8118,8128,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559674.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559674.pbs.hpc.swin.edu.au\",\"IT_SQP_47MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 281M/1147M\",\"Wall Time 02:15:27\",\"Remaining 165:44:33\"],[0.0,0.0,1,1,8119,8127,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559675.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559675.pbs.hpc.swin.edu.au\",\"IT_SQP_48MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 281M/1147M\",\"Wall Time 02:15:27\",\"Remaining 165:44:33\"],[0.0,0.0,1,1,8121,8127,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559676.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559676.pbs.hpc.swin.edu.au\",\"IT_SQP_49MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 311M/1219M\",\"Wall Time 02:15:26\",\"Remaining 165:44:34\"],[0.0,0.0,1,1,8087,8126,604800,99.5,\"R\",\"1:ppn=1\"]],[\"6559677.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559677.pbs.hpc.swin.edu.au\",\"IT_SQP_50MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 305M/1155M\",\"Wall Time 02:15:26\",\"Remaining 165:44:34\"],[0.0,0.0,1,1,8109,8126,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559678.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559678.pbs.hpc.swin.edu.au\",\"IT_SQP_51MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 299M/1155M\",\"Wall Time 02:15:25\",\"Remaining 165:44:35\"],[0.0,0.0,1,1,8113,8125,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559679.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559679.pbs.hpc.swin.edu.au\",\"IT_SQP_52MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 292M/1155M\",\"Wall Time 02:15:24\",\"Remaining 165:44:36\"],[0.0,0.0,1,1,8117,8124,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559680.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559680.pbs.hpc.swin.edu.au\",\"IT_SQP_53MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 288M/1155M\",\"Wall Time 02:15:24\",\"Remaining 165:44:36\"],[0.0,0.0,1,1,8118,8124,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559681.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559681.pbs.hpc.swin.edu.au\",\"IT_SQP_54MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 287M/1155M\",\"Wall Time 02:15:23\",\"Remaining 165:44:37\"],[0.0,0.0,1,1,8119,8123,604800,100.0,\"R\",\"1:ppn=1\"]],[\"6559682.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar041\"],[\"Job 6559682.pbs.hpc.swin.edu.au\",\"IT_SQP_55MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 316M/1219M\",\"Wall Time 02:15:23\",\"Remaining 165:44:37\"],[0.0,0.0,1,1,8092,8123,604800,99.6,\"R\",\"1:ppn=1\"]],[\"6559683.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559683.pbs.hpc.swin.edu.au\",\"IT_SQP_56MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 309M/1219M\",\"Wall Time 02:15:27\",\"Remaining 165:44:33\"],[0.0,0.0,1,1,8114,8127,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559684.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559684.pbs.hpc.swin.edu.au\",\"IT_SQP_57MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 302M/1155M\",\"Wall Time 02:15:26\",\"Remaining 165:44:34\"],[0.0,0.0,1,1,8119,8126,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559685.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559685.pbs.hpc.swin.edu.au\",\"IT_SQP_58MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 298M/1155M\",\"Wall Time 02:15:26\",\"Remaining 165:44:34\"],[0.0,0.0,1,1,8118,8126,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559686.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559686.pbs.hpc.swin.edu.au\",\"IT_SQP_59MPC5\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 293M/1155M\",\"Wall Time 02:15:25\",\"Remaining 165:44:35\"],[0.0,0.0,1,1,8120,8125,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559687.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559687.pbs.hpc.swin.edu.au\",\"IT_SQP_60MPC6\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 291M/1155M\",\"Wall Time 02:15:25\",\"Remaining 165:44:35\"],[0.0,0.0,1,1,8119,8125,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559688.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559688.pbs.hpc.swin.edu.au\",\"IT_SQP_61MPC1\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 312M/1219M\",\"Wall Time 02:15:24\",\"Remaining 165:44:36\"],[0.0,0.0,1,1,8104,8124,604800,99.8,\"R\",\"1:ppn=1\"]],[\"6559689.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559689.pbs.hpc.swin.edu.au\",\"IT_SQP_62MPC2\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 304M/1155M\",\"Wall Time 02:15:23\",\"Remaining 165:44:37\"],[0.0,0.0,1,1,8114,8123,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559690.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559690.pbs.hpc.swin.edu.au\",\"IT_SQP_63MPC3\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 298M/1155M\",\"Wall Time 02:15:23\",\"Remaining 165:44:37\"],[0.0,0.0,1,1,8116,8123,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559691.pbs.hpc.swin.edu.au\",\"pts\",\"p135_swin\",[\"gstar040\"],[\"Job 6559691.pbs.hpc.swin.edu.au\",\"IT_SQP_64MPC4\",\"R\",\"Nodes 1\",\"Cpus 1\",\"Mem/VM 291M/1155M\",\"Wall Time 02:15:22\",\"Remaining 165:44:38\"],[0.0,0.0,1,1,8117,8122,604800,99.9,\"R\",\"1:ppn=1\"]],[\"6559821[19002].pbs.hpc.swin.edu.au\",\"cho\",\"p128_astro\",[\"sstar130\",\"sstar130\",\"sstar130\",\"sstar130\",\"sstar130\",\"sstar130\",\"sstar130\",\"sstar130\",\"sstar131\",\"sstar131\",\"sstar131\",\"sstar131\",\"sstar131\",\"sstar131\",\"sstar131\",\"sstar131\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar134\",\"sstar138\",\"sstar138\",\"sstar138\",\"sstar138\",\"sstar138\",\"sstar138\",\"sstar138\",\"sstar138\"],[\"Job 6559821[19002].pbs.hpc.swin.edu.au\",\"corr_taipan_mock-19002\",\"R\",\"Nodes 4\",\"Cpus 32\",\"Mem/VM per node 2G/16G\",\"Wall Time 00:15:58\",\"Remaining 05:44:02\"],[11968.9,69255.1,32,4,28371,958,21600,92.5,\"R\",\"4:ppn=8\"]],[\"6559822.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\",\"sstar106\"],[\"Job 6559822.pbs.hpc.swin.edu.au\",\"test_593_08_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 512M/22G\",\"Wall Time 00:36:58\",\"Remaining 04:23:02\"],[512.8,22568.5,14,1,30940,2218,18000,99.6,\"R\",\"1:ppn=14\"]],[\"6559823.pbs.hpc.swin.edu.au\",\"jzh\",\"none\",[\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\",\"sstar103\"],[\"Job 6559823.pbs.hpc.swin.edu.au\",\"test_712_08_pH7_300K\",\"R\",\"Nodes 1\",\"Cpus 14\",\"Mem/VM 524M/22G\",\"Wall Time 00:04:03\",\"Remaining 04:55:57\"],[524.6,22575.2,14,1,3351,243,18000,98.5,\"R\",\"1:ppn=14\"]],[\"6559825.pbs.hpc.swin.edu.au\",\"eth\",\"p041_swin\",[\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\",\"sstar114\"],[\"Job 6559825.pbs.hpc.swin.edu.au\",\"STDIN\",\"R\",\"Nodes 1\",\"Cpus 16\",\"Mem/VM 90M/604M\",\"Wall Time 00:15:46\",\"Remaining 03:44:14\"],[90.0,604.2,16,1,0,946,14400,0.0,\"R\",\"1:ppn=16\"]]]</jobs>\n" + "<pies><colours>[[\"kpr\",\"blue\"],[\"aha\",\"darkseagreen\"],[\"dme\",\"darkorchid\"],[\"jzh\",\"red\"],[\"ttr\",\"blue\"],[\"smu\",\"#7f7f7f\"],[\"aco\",\"yellow\"],[\"jas\",\"darkorchid\"],[\"mca\",\"green\"],[\"gve\",\"red\"],[\"jle\",\"goldenrod\"],[\"cho\",\"green\"],[\"idle\",\"green\"],[\"sjo\",\"green\"],[\"mag\",\"#b2b2b2\"],[\"jwu\",\"darkseagreen\"],[\"dos\",\"#7f7f7f\"],[\"eth\",\"#333333\"],[\"TAO\",\"#7effd4\"],[\"pts\",\"brown\"],[\"ssc\",\"yellow\"]]</colours><cached>[\"yup\"]</cached><running>[\"9fdf4514aeccfbf54d7fa425a0fc19c7.0000.png\"]</running><queued>[\"b029a25f9e08caedd4915f4fb9e1d159.0000.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0001.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0002.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0003.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0004.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0005.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0006.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0007.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0008.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0009.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0010.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0011.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0012.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0013.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0014.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0015.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0016.png\",\"b029a25f9e08caedd4915f4fb9e1d159.0017.png\"]</queued></pies>\n" + "</bobMonData>\n";
  
  exports.data = data;

/***/ }),
/* 143 */
/***/ (function(module, exports) {

  module.exports = require("xmltojson");

/***/ }),
/* 144 */
/***/ (function(module, exports) {

  module.exports = require("./assets");

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map