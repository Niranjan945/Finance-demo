const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'CryptoTrade API', version: '1.0' },
  components: {
    securitySchemes: { 
      BearerAuth: { type: 'http', scheme: 'bearer' } 
    }
  },
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { 
                  name: { type: 'string' }, 
                  email: { type: 'string' }, 
                  password: { type: 'string' } 
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Success' } }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: { 
                type: 'object', 
                properties: { 
                  email: { type: 'string' }, 
                  password: { type: 'string' } 
                } 
              }
            }
          }
        },
        responses: { '200': { description: 'Success' } }
      }
    },
    '/api/v1/trades': {
      get: {
        tags: ['Trades'],
        security: [{ BearerAuth: [] }],
        responses: { '200': { description: 'Success' } }
      },
      post: {
        tags: ['Trades'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  symbol: { type: 'string' },
                  tradeType: { type: 'string', enum: ['BUY', 'SELL'] },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                  fee: { type: 'number' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Success' } }
      }
    },
    '/api/v1/trades/dashboard/summary': {
      get: {
        tags: ['Trades'],
        security: [{ BearerAuth: [] }],
        responses: { '200': { description: 'Success' } }
      }
    },
    '/api/v1/trades/export/csv': {
      get: {
        tags: ['Trades'],
        summary: 'Download all trades as a CSV file',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'CSV file downloaded successfully',
            content: {
              'text/csv': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          }
        }
      }
    },
    
    '/api/v1/trades/{id}': {
      get: {
        tags: ['Trades'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Success' } }
      },
      patch: {
        tags: ['Trades'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  symbol: { type: 'string' },
                  tradeType: { type: 'string', enum: ['BUY', 'SELL'] },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                  fee: { type: 'number' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Success' } }
      },
      delete: {
        tags: ['Trades'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Success' } }
      }
    }
  }
};

const swaggerOptions = {
  swaggerOptions: {
    defaultModelsExpandDepth: -1, // Hides the "Models" section at the bottom of the page
    tryItOutEnabled: true         // Automatically opens the inputs for editing
  },
  customCss: `
    .swagger-ui .topbar { display: none !important; } /* Hides top green bar */
    .swagger-ui .info { display: none !important; } /* Hides the massive title/info block */
  `
};

module.exports = { swaggerUi, swaggerDocument, swaggerOptions };