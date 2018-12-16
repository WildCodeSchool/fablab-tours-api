const express = require('express');

const bodyParser = require('body-parser');

const port = 3000;

const app = express();
app.use(bodyParser.json());




// Start Server
app.listen(port, () => {
    console.log('Server started on port '+ port)
});