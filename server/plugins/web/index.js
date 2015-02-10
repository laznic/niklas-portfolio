var path       = require('path'),
    Behance    = require('node-behance'),
    _          = require('lodash')
    config     = require('../../config'),
    projects   = require('../../projects'),
    publicPath = path.join(__dirname, '../../../client/'),
    imgPath    = path.join(__dirname, '../../../client/media'),
    baseUrl    = '/';

exports.register = function (plugin, options, next) {

  var behance = new Behance({client_id: config.behance.apiKey});
  
  plugin.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
          return reply.view('index');
      }
  });

  // Template partials
  plugin.route({
    path: baseUrl + 'views/{name}',
    method: 'GET',
    handler: function(request, reply) {
      reply.view('views/' + request.params.name);
    }
  });

  plugin.route({
    method: 'GET',
    path: baseUrl + 'public/{path*}',
    handler: {
      directory: {
          path: publicPath
      }
    }
  });

  plugin.route({
    method: 'GET',
    path: baseUrl + 'img/{path*}',
    handler: {
      directory: {
          path: imgPath
      }
    }
  });

  plugin.route({
    method: 'GET',
    path: baseUrl + 'projects',
    handler: function(request, reply) {
      return reply(projects);

      // var list = [];
      // behance.get('users/niklaslepisto/projects', {"per_page": "25"}, function(result) {
          
      //     behance.get('users/niklaslepisto/projects', {"per_page": "25", "page": "2"}, function(result2) {
      //         for(i = 0; i < result.projects.length; i++) {
      //           list.push(result.projects[i]);
      //         }
      //         for(i = 0; i < result2.projects.length; i++) {
      //           list.push(result2.projects[i]);
      //         }
      //         return reply(list);
      //     });
      // });
    }
  });

  plugin.route({
    method: 'GET',
    path: baseUrl + 'projects/{id}',
    handler: function(request, reply) {
      return reply(_.find(projects, {id: parseInt(request.params.id)}));
      // behance.get('projects/' + request.params.id, {}, function(result) {
      //   return reply(result);
      // });
    }
  });

  next();
};

exports.register.attributes = {
  name: 'index'
};
