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

// var controller = {
// registrar: (req, res) => {
//     var nombre = req.body.nombre;
//     var apellido = req.body.apellido;
//     var email = req.body.email;
//     var direccion = req.body.direccion;
//     var password = req.body.password;

//     var attributeList = [];
//     attributeList.push(
//       new AmazonCognitoIdentity.CognitoUserAttribute({
//         Name: "given_name",
//         Value: nombre,
//       })
//     );
//     attributeList.push(
//       new AmazonCognitoIdentity.CognitoUserAttribute({
//         Name: "family_name",
//         Value: apellido,
//       })
//     );
//     attributeList.push(
//         new AmazonCognitoIdentity.CognitoUserAttribute({
//           Name: "address",
//           Value: direccion,
//         })
//       );
//     attributeList.push(
//       new AmazonCognitoIdentity.CognitoUserAttribute({
//         Name: "email",
//         Value: email,
//       })
//     );

//     userPool.signUp(email, password, attributeList, null, (err, result) => {
//         if (err) {
//           return res.status(404).send({
//             status: "Error",
//             message: "El usuario no pudo registrar" + err,
//           });
//         } else {
//           var cognitoUser = result.user;
//           return res.status(200).send({
//             status: "Success",
//             message:
//               "El usuario " +
//               cognitoUser.getUsername() +
//               " se ha  podido registrar",
//           });
//         }
//       });
//     },

//     verificar: (req, res) => {
//       let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
//       const email = req.body.email.trim(); //saca espacios finales e iniciales
//       const code = req.body.code;
  
//       var userData = {
//           Username : email,
//           Pool : userPool
//       };
//       var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
//       cognitoUser.confirmRegistration(code, true, function(err, result) {
//           if (err) {
//               console.log(err);
//               return res.status(500).json({
//                   mensajeMostrar: 'Error verificar usuario'
//               });
//           }
//           console.log('callresult' + result);
//           return res.status(200).json({
//               mensajeMostrar: 'usuario verificado'
//           });
//       });
  
 
//       // const { Username, ConfirmationCode } = req.body;
//       // //agregar validaciones
//       // // if(Username !== undefined && ConfirmationCode !== undefined){}
    
//       // var userData = {
//       //   Username: Username,
//       //   Pool: userPool,
//       // };
//       // var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
//       // cognitoUser.confirmRegistration(
//       //   ConfirmationCode,
//       //   true,
//       //   function (err, result) {
//       //     if (err) {
//       //       res.status(500).send(err);
//       //       return;
//       //     }
//       //     res.status(200).jsonp(result);
//       //   }
//       // );
//     },

//     login: (req, res) => {
//       var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
//         Username: req.body.email,
//         Password: req.body.password,
//       });

//       var userData = {
//         Username: req.body.email,
//         Pool: userPool,
//       };
//       var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
//       cognitoUser.authenticateUser(authenticationDetails, {
//         onSuccess: function (result) {
//           console.log("access token + " + result.getAccessToken().getJwtToken());
//           console.log("id token + " + result.getIdToken().getJwtToken());
//           console.log("refresh token + " + result.getRefreshToken().getToken());
//           //respuesta del post, puse para que devuelva el token, hay que ver como traer los datos del usuario
//           res.status(200).jsonp(result.getAccessToken().getJwtToken());
//         },
//         onFailure: function (err) {
//           const error = {
//             message: err.message,
//             code: err.code,
//           };
//           console.log(error);
//           res.status(500).send(error);
//         },
//       });
//     },
// };

   /* function validarEmail(email){
        let err = "";
        if(!(email.match(regEmail))){
            err = "\nEmail no valido.";
        }
        return err;
    }
    */

  /*confirmarRegistro: (req, res) => {
    var codigo = req.body.codigo;
    var username = req.body.username;
    var userData = {
      Username: username,
      Pool: userPool,
    };
    //validar que el username exista
    var user = new AmazonCognitoIdentity.CognitoUser(userData);
    user.confirmRegistration(codigo, true, (err, result) => {
      if (err) {
        return res.status(404).send({
          status: "Error",
          message: err,
        });
      } else {
        return res.status(200).send({
          status: "Success",
          message: "El registro se ha confirmado con exito!",
        });
      }
    });
  },*/

  /*resendCodeConfirmation: (req, res) => {
    var username = req.body.username;
    var userData = {
      Username: username,
      Pool: userPool,
    };
    var user = new AmazonCognitoIdentity.CognitoUser(userData);
    user.resendConfirmationCode((err, result) => {
      if (err) {
        return res.status(404).send({
          status: "Error",
          message: err,
        });
      } else {
        return res.status(200).send({
          status: "Success",
          message: "El codigo de verificacion se ha enviado con exito",
        });
      }
    });
  },*/

// module.exports = controller;
//crearcuenta();