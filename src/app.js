const express = require('express');
const app = express();

//const morgan = require('morgan');
const bodyParser = require('body-parser');


// configuracion
app.set('port', process.env.PORT || 3000);

// middleware
//app.use(morgan('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// rutas
require('./routes/userRoutes')(app);

app.listen(app.get('port'), () => {
    console.log('Servidor corriendo en el puerto 3000');
});