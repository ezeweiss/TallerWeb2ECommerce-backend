const Model = require("../models/bebida");

const getBebidas = () => {
	const response = Model.find({}, { _id: 0, __v: 0 }).sort({ titulo: 1 });
	return response;
};

const getBebida= async (id) => {
	const response = await Model.findOne({ id }, { _id: 0, __v: 0 });
	return response;
};

module.exports ={
    getBebidas,
    getBebida
}