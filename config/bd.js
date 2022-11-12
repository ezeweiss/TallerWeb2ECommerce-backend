const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb://localhost/angubar");

connection
  .then(() => console.log("Conexión realizada exitosamente"))
  .catch((err) => console.log("Hubo un error en la conexión", err));
