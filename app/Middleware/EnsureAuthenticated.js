
'use strict'

const jwt = require("jsonwebtoken");
const Env = use('Env')

class EnsureAuthenticated {

    async handle({ request, response, auth }, next) {

        const apiKey = Env.getOrFail('APP_KEY')

        let errorResponse = {
            code: 400,
            error: "error",
            message: "Authorization error "

        }


        let { authorization } = request.request.headers;

        if (!authorization) {

            errorResponse.code = 401
            errorResponse.message = "Auth Token is missing"
            return response.status(401).json(errorResponse);

        }

        const [, token] = authorization.split(" ");

        try {
            let decoded = await jwt.verify(token, apiKey); //gera o token
            let { sub } = decoded;

            request.user = {
                id: sub,
            };

            return next();
        } catch (err) {

            return response.status(401).json("Auth error in middleware")

        }





    }

}

module.exports = EnsureAuthenticated
