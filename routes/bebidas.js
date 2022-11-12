const { Router } = require("express");
const {
	getBebida,
	getBebidas,
} = require("../repository/bebidaRepository");
const router = Router();

router.get("/", async (req, res) => {
	const bebidasLista = await getBebidas();
	return res.status(200).json({ bebidas: bebidasLista });
});

router.get("/:id", async (req, res) => {
	let id = parseInt(req.params.id);
	const bebida = await getBebida(id);
	if (!bebida) {
		return res
			.status(404)
			.json({ error: true, mensaje: "No existe la bebida con el id " + id });
	}
	return res.json(bebida);
});

module.exports = router;
