var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require("aws-sdk");
const { jwk } = require("../helpers/jwk");
var jwt = require("jsonwebtoken");
var jwkToPem = require("jwk-to-pem");

const poolData = {
    UserPoolId : "us-east-1_4v00HFNpW", // Your user pool id here   
    ClientId : "42r33g56im4a8dhsqkddr6chdq" // Your client id here
}
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const registrar = (req = request, res = response) => {
	const { nombre, apellido, direccion, email, password } = req.body;

	var attributeList = [];
	attributeList.push(
		new AmazonCognitoIdentity.CognitoUserAttribute({
			Name: "given_name",
			Value: nombre,
		})
	);
	attributeList.push(
		new AmazonCognitoIdentity.CognitoUserAttribute({
			Name: "family_name",
			Value: apellido,
		})
	);
	attributeList.push(
		new AmazonCognitoIdentity.CognitoUserAttribute({
			Name: "address",
			Value: direccion,
		})
	);

  attributeList.push(
		new AmazonCognitoIdentity.CognitoUserAttribute({
			Name: "email",
			Value: email,
		})
	);

	userPool.signUp(email, password, attributeList, null, function (err, result) {
		if (err) {
			return res.status(401).json({
				msg: err,
				ok: false,
			});
		}

		cognitoUser = result.user;
		return res.status(200).json({
			ok: true,
			user: cognitoUser.getUsername(),
		});
	});
};

const login = (req = request, res = response) => {
	const { email, password } = req.body;

	var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
		Username: email,
		Password: password,
	});

	var userData = {
		Username: email,
		Pool: userPool,
	};

	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			res.status(200).json(result.getAccessToken().getJwtToken());
		},
		onFailure: function (err) {
			res.status(401).json({
				ok: false,
				err,
			});
		},
	});
};

const verificar = (req = request, res = response) => {
	const { codigo, email } = req.body;

	var userData = {
		Username: email,
		Pool: userPool,
	};

	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.confirmRegistration(
		JSON.stringify(codigo),
		true,
		function (err, result) {
			if (err) {
				return res.status(401).json({
					ok: false,
					err,
				});
			}
			if (!!result) {
				return res.status(200).json({
					ok: true,
					result,
				});
			}
		}
	);
};

const leerDataToken = (req = request, res = response) => {
	var pem = jwkToPem(jwk.keys[1]);

	const { token } = req.body;

	jwt.verify(JSON.parse(token), pem, function (err, decoded) {
		if (err) {
			return res.status(401).json({
				ok: false,
				msg: err,
			});
		} else {
			res.status(200).json(decoded.sub);
		}
	});
};

module.exports = {
	registrar,
	login,
	verificar,
	leerDataToken,
};