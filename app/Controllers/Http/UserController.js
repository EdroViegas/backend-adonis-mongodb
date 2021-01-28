"use strict";


const Env = use('Env')
const User = use("App/Models/User");
const Hash = use("Hash");
const jwt = require("jsonwebtoken");

class UserController {
    async create({ request, response, auth }) {
        console.log(auth);

        const { username, email, password } = request.all();



        const result = await User.findBy("email", email);
        // console.log(result)

        if (result) {
            return response.status(200).send({
                code: "203",
                status: "error",
                message: "E-mail já existente",

            });
        }
        const user = await User.create({ username, email, password });
        const token = await auth.authenticator("jwt").generate(user);
        response.status(200).send({
            code: "204",
            status: "success",
            data: { user, token: token.token },
        });

        // return response.redirect('/');
    }


    async login({ request, response, auth, session }) {
        const { email, password } = request.all();

        const apiKey = Env.getOrFail('APP_KEY')

        try {
            const user = await User.findBy("email", email);

            if (!user) {
                return response.status(202).send({
                    code: "000",
                    status: "Login failed",
                    message: "E-mail ou senha incorrecto!",
                });
            }

            const passwordMatch = await Hash.verify(password, user.password);

            console.log(passwordMatch);
            if (!passwordMatch) {
                return response.status(202).send({
                    code: "000",
                    status: "failed",
                    message: "E-mail ou senha incorrecto!",
                });
            }

            //  const token = await auth.authenticator("jwt").generate(user);

            let token = await jwt.sign(
                { sub: user._id }, apiKey,
                { expiresIn: "24h" }
            ); //gera o token

            return response.status(202).send({
                code: "204",
                status: "success",
                message: "Login efectuado com sucesso!",
                user: user,
                token: token,
            });
        } catch (error) {
            console.log(error);
            return response.status(405).send({
                code: "000", status: "Login failed",
                message: "Erro ao efectuar o login ",
                error: error,
            });
        }
    }


    async show({ response, request, params }) {
        try {

            const { id } = request.user
            const user = await User.find(id);


            if (!user) {
                return response.send({
                    code: "000",
                    status: "failed",
                    message: "Usuário não encontrado!",
                    user: user,
                });

            }

            user.password = null

            return response.send({
                code: "204",
                status: "success",
                message: "User found",
                user: user,
            });

        } catch (e) {
            console.log(e);
            return response.send("Ocorreu um erro ao obter os dados.");
        }
    }

    async logout({ auth, response }) {
        await auth.logout();
        return response.send({ status: "Logged out", message: "Logout efectuado" });
    }
}

module.exports = UserController;
