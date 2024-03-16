const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_auto_gen.json'
const endpointsFiles = ['./server.js']


swaggerAutogen(outputFile, endpointsFiles);