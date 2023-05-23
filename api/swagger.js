const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swaggerOutput.json'
const endpointsFiles = ['./routes/learningModules.js']

swaggerAutogen(outputFile, endpointsFiles)