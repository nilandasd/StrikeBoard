const {app} = require('./app.js');
const server = require("https");
const path = require("path");
const fs = require("fs");

require("dotenv").config({ path: path.join(__dirname, './private/.env') });

const PORT = process.env.PORT || 4000;
server.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, '/private/key.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, './private/server.crt'), 'utf8')
    },
    app
).listen(PORT, () => console.log(`Serving on port: ${PORT}`));
