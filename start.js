require("@babel/register")({
  presets: ["@babel/preset-env"],
  plugins: [
    ["@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ]
});

// Import the rest of our application.
module.exports = require('./server.js')
