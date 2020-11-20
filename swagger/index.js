let options = {
    swaggerDefinition: {
      info: {
        description: 'This is a sample server',
        title: '搞事情？',
        version: '1.0.0'
      },
      host: '127.0.0.1:3000',
      basePath: '/',
      produces: ['application/json', 'application/xml'],
      schemes: ['http', 'https'],
      // securityDefinitions: {
      //   JWT: {
      //     type: 'apiKey',
      //     in: 'header',
      //     name: 'Authorization',
      //     description: ''
      //   }
      // }
    },
    route: {
      url: '/swagger',
      docs: '/swagger.json' //swagger文件 api
    },
    basedir: __dirname, //app absolute path
    files: ['../routes/*.js','../routes/login/*.js','../routes/admin/*.js'] //Path to the API handle folder
}

module.exports = options;