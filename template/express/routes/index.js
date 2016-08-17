var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var router = express.Router();

var controllerDirName = './controller';
var controllerDir = path.resolve(__dirname, controllerDirName);

var jsFileRegExp = /\.js$/;

var loadController = {
    'object': function (router,controllerName, controllers) {
        for (var routerName in controllers) {
            if (controllers.hasOwnProperty(routerName)) {
                controller = controllers[routerName];
                var route = "/" + controllerName + "/" + routerName;
                [].concat(controller)
                  .forEach(function (fn) {
                      router.get(route, fn);
                      router.post(route, fn);
                  });
            }
        }
        return router;
    },
    'function': function (router,controllerName, controller) {
        var route = "/" + controllerName;
        [].concat(controller)
          .forEach(function (fn) {
              router.get(route, fn);
              router.post(route, fn);
          });

        return router;
    }
};

//加载一个controllers下的所有路由
var loadAllRoutes = function (dir) {
    fs.readdirSync(dir).filter(function (controllerName) {
        return jsFileRegExp.test(controllerName);

    }).forEach(function (controllerName) {
        controllerName = controllerName.replace(/\.js$/, '');

        try {
            var controllers = require(path.resolve(__dirname, dir, controllerName));
            var controllersType = typeof controllers;

            router = loadController[controllersType](router,controllerName, controllers);

        } catch (_error) {
            console.log(_error);
        }
    });
};
//验证
[controllerDir].forEach(loadAllRoutes);

module.exports = router;