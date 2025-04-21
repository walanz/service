// This file is the serverless entry point for Vercel
let app;

module.exports = async (req, res) => {
  if (!app) {
    // Import the built NestJS application
    app = await require('../dist/main').default;
  }
  
  // Forward the request to the NestJS/Express app
  return app(req, res);
}; 