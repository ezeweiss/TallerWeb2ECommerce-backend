const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
require("./config/bd");

//se crea una nueva instancia de express q será nuestra aplicación
const app = express();

//este es el puerto en el q la api está disponible
const puerto = 3000;

app.use(cors());
app.use(express.json());

//express se queda escuchando en el puerto declarado
app.listen(puerto, () => {
	console.log("Example app listening on port 3000!");
});

// Cargar ficheros rutas

var cognito = require('./routes/cognito');
var bebidas = require('./routes/bebidas');

// Middlewares
app.use(bodyParser.urlencoded({extended : false}));

// convierte cualquier petición en un objeto json que sea mas simple de leer

app.use(bodyParser.json());

// Añadir prefijos a las rutas / Cargar rutas
app.use('/api', cognito);
app.use('/bebidas', bebidas);

// Exportar modulo (fichero actual)
module.exports = app;