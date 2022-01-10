const {app} = require('./app.js');
const server = require("http");

const PORT = 4000;
server.createServer(
    app
).listen(PORT, () => console.log(`Serving on port: ${PORT}`));
