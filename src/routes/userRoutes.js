const mysql = require('mysql');
const bd = require('../../config/dbConeccion');
var connection = mysql.createConnection(bd);

module.exports = function (app) {

    // obtener todos los usuarios
    app.get('/users', (req, res) => {
        var query = "";
        query += "select * from users ";

        connection.query(query, (error, result) => {
            if (error) {
                logger.error(error);
                res.status(500).send({ error: true, total: 0, users: [], mensaje: "Error al obtener los usuarios" });
            } else {
                if (!result) {
                    res.status(404).send({ error: false, total: 0, users: [], mensaje: "No se han encontrado usuarios" });
                } else {
                    res.status(200).json({ error: false, total: result.length, users: result, mensaje: 'OK' });
                }
            }
        });
    });

    // obtencion de un usuario en particular
    app.get('/users/:id', (req, res) => {
        var id = req.params.id;

        var query = "";
        query += "select * from users where id = " + id;

        connection.query(query, (error, result) => {

            if (error) {
                logger.error(error);
                res.status(500).send({ error: true, total: 0, users: [], mensaje: "Error al obtener los usuarios" });
            } else {
                if (!result) {
                    res.status(404).send({ error: false, total: 0, users: [], mensaje: "No se han encontrado usuario" });
                } else {
                    res.status(200).send({ error: false, total: result.length, users: result, mensaje: 'OK' });
                }
            }
        });
    });

    // creacion de usuarios
    app.post('/users', function (req, res, next) {
        let params = req.body;
        let username = params.username;
        let password = params.password;
        let email = params.email;

        var queryInsert = "";
        queryInsert += "START TRANSACTION; ";

        queryInsert += "insert into users (username, password,email) ";
        queryInsert += "values ('" + username + "','" + password + "', '" + email + "'); ";

        queryInsert += "COMMIT; ";

        connection.beginTransaction(function (errorBegin) {
            if (errorBegin) {
                console.log('Error en begin transaction: ', JSON.stringify(errorBegin));
                res.status(500).send({ error: true, mensaje: "Error al iniciar la transacción." });
            }

            connection.query(queryInsert, (error, result) => {
                if (error) {
                    res.status(500).send({ error: true, mensaje: "Error al crear: " + error });
                } else {
                    if (result) {
                        var iIDCreated = result.insertId;
                        console.log(iIDCreated);
                        res.status(201).send({ error: false, mensaje: 'Usuario creado existosamente ' + iIDCreated });
                    }
                }
            });
        });
    });

    // editar un usuario
    app.put('/users/:id', function (req, res, next) {
        let id = req.params.id;
        let params = req.body;

        let username = params.username;
        let password = params.password;
        let email = params.email;

        let queryUpdate = "";
        queryUpdate += "START TRANSACTION; ";

        queryUpdate += "update users ";
        queryUpdate += "set email = '" + email + "', ";
        queryUpdate += "username = '" + username + "', ";
        queryUpdate += "password = '" + password + "' ";
        queryUpdate += "where id = " + id + "; ";

        queryUpdate += "COMMIT; ";

        connection.beginTransaction(function (errorBegin) {
            if (errorBegin) {
                console.log('Error en begin transaction: ', JSON.stringify(errorBegin));
                res.json({ code: 500, error: "Error al iniciar la transacción." });
            }

            connection.query(queryUpdate, (error, result) => {
                if (error) {
                    console.log('queryUpdate', queryUpdate);
                    res.status(500).send({ error: true, mensaje: "Error al actualizar" });
                } else {
                    if (!result) {
                        res.status(404).send({ error: false, mensaje: "No se ha encontrado o actualizado la entidad" });
                    } else {
                        res.status(200).send({ error: false, mensaje: 'OK', body: params });
                    }
                }
            });
        });
    });

    // borrar un usuario
    app.delete('/users/:id', function (req, res, next) {
        var id = req.params.id;

        var query = "";
        query += "delete from users where id = " + id + "; ";

        connection.beginTransaction(function (errorBegin) {
            if (errorBegin) {
                console.log('Error en begin transaction: ', JSON.stringify(errorBegin));
                res.json({ code: 500, error: "Error al iniciar la transacción." });
            }

            connection.query(query, (error, result) => {
                if (error) {
                    res.status(500).send({ error: true, mensaje: "Error al borrar el usuario" });
                } else {
                    if (!result) {
                        res.status(404).send({ error: false, mensaje: "No se ha encontrado el usuario para borrar" });
                    } else {
                        res.status(200).send({ error: false, mensaje: 'OK' });
                    }
                }
            });
        });
    });

}