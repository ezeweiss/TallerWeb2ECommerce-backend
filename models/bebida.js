const { model, Schema } = require("mongoose");

const bebidaSchema = new Schema({
	id: {
		type: Number,
		unique: true,
	},
	nombre: {
		type: String,
		unique: true,
	},
	img: String,
	precio: String,
	clasificacion: String,
	descripcion: String
});

const bebidaModel = model("bebidas", bebidaSchema);

module.exports = bebidaModel;
