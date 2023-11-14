const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.static("public"));
app.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "W3llc0m3@",
    database: "polo_digital",
});
connection.connect((error) => {
    if (error) {
        return console.error(`error: ${error.message}`);
    }
    console.log(`Conect to MYSQL!!`);
});
/**
 * Funciones útiles--------------------------------------------------------------------------------------------
 */
let = handleSQLError = (response, error, result, callback) => {
    if (error) {
        response.status(400).send(`error: ${error.message}`);
        return;
    }
    callback(result);
};

/**
 * Fin funciones útiles----------------------------------------------------------------------------------------
 */
/**
 * Endpoints para index-----------------------------------------------------------------------------------------
 */
app.get(`/carrusel`, (request, response) => {
    connection.query(`select eventos.id,eventos.nombre,eventos.tipo,eventos.fecha_inicio,eventos.fecha_fin,eventos.aforo,eventos.evento_imagen,eventos.descripcion,clientes.razon_social as organizador,salas.nombre as sala from eventos,clientes,salas where clientes.id=(select id from clientes where id=eventos.cliente_id) and salas.id=(select id from salas where id =eventos.sala_id)`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            let total = request.query.total;
            let listaEventos = [];
            for (let i = 0; i < total; i++) {
                listaEventos[i] = result[i];
            }
            response.send(listaEventos);
        });
    });
});
// app.get(`/carrusel`, (request, response) => {
//     connection.query("select * from eventos", (error, result, fields) => {
//         handleSQLError(response, error, result, (result) => {
//             let total = request.query.total;
//             let listaEventos = [];
//             for (let i = 0; i < total; i++) {
//                 listaEventos[i] = result[i];
//             }
//             response.send(listaEventos);
//         });
//     });
// });

app.get(`/evento/:IdE`, (request, response) => {
    const eventoId = request.params.IdE;
    connection.query(
        `select * from eventos where id="${eventoId}"`,
        (error, result, fields) => {
            handleSQLError(response, error, result, (result) => {
                response.send(result[0]);
            });
        }
    );
});
/**
 * Termina Index-----------------------------------------------------------------------------------------------------------------------
 */
/**
 * Endpoint para usuarios--------------------------------------------------------------------------------------------------------------
 */
app.get(`/usuarios`,(request,response)=>{
    connection.query(`select * from usuarios`,(error,result,fields)=>{
        handleSQLError(response,error,result,(result)=>{
            response.send(result);
            console.log(result.length);
        });
    });
});
/**
 * Endpoints para Registros/login-----------------------------------------------------------------------------------------------------
 */

app.post(`/login`, (request, response) => {
    connection.query(
        `select * from usuarios where email="${request.body.email}" and password="${request.body.password}"`,
        (error, result, fields) => {
            handleSQLError(response, error, result, (result) => {
                if (result.length == 0) {
                    response.send({
                        message: `Email o password no validos.`,
                    });
                } else {
                    response.send({
                        message: `Usuario logueado: ${request.body.email}`,
                    });
                }
            });
        }
    );
});

app.post(`/registro`, (request, response) => {
    console.log(request.body);
    /**
     * hacer un connection.query insert into usuarios y un insert into empleadosclientes
     */
    let nuevoEmail = request.body.email.toLowerCase();
    let nuevoPassword = request.body.password;
    let nuevoUsuario_Id = 0;
    let cliente_Id = 0;
    /**
     * comprobar si el email o el dni está en uso
     */
    connection.query(`select email, dni from usuarios, empleadosclientes where usuarios.email='${nuevoEmail}' or empleadosclientes.dni='${request.body.dni}'`, (error, result, fields) => {
        if (result.length == 0) {
            connection.query(`insert into usuarios (email,password) values ('${nuevoEmail}', '${nuevoPassword}')`, (error, result, fields) => {
                handleSQLError(response, error, result, (result) => {
                })
            })
            connection.promise().query(`select id from usuarios where email='${nuevoEmail}'`).then((result) => {
                handleSQLError(response, error, result, (result) => {
                    console.log(result);
                    nuevoUsuario_Id = result[0][0].id;
                    console.log(nuevoUsuario_Id);
                    connection.query(`select id from clientes where razon_social='${request.body.empresa}'`, (error, result, fields) => {
                        handleSQLError(response, error, result, (result) => {
                            console.log(result);
                            cliente_Id = result[0].id;
                            console.log(cliente_Id);
                            connection.query(`insert into empleadosclientes (nombre,apellidos,usuario_id,cliente_id,dni,telefono) values ('${request.body.nombre}','${request.body.apellidos}','${nuevoUsuario_Id}','${cliente_Id}','${request.body.dni}','${request.body.telefono}')`, (error, result, fields) => {
                                handleSQLError(response, error, result, (result) => {
                                    response.send({ message: `Usuario registrado correctamente` });
                                })
                            })
                        })

                    })
                })

            });
        } else {
            response.send({ message: `El email o el dni introducido ya está en uso.` });
            return;
        }

    });
});
/**
 * Termina Registros/login--------------------------------------------------------------------------------------------
 */
/**
 * Endpoints para Clientes------------------------------------------------------------------------------------------
 */

/**Hacer una query para recibir listado clientes */
app.get(`/clientes`, (request, response) => {
    connection.query(`select * from clientes`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            response.send(result);
        });
    });
});
/**Hacer un query para modificar la tabla de clientes */
app.post(`/clientes/:id`, (request, response) => {
    let clienteId = request.params.id;
    console.log(clienteId);
    connection.query(`update clientes set razon_social='${request.body.razon_social}',cif='${request.body.cif}',sector='${request.body.sector}', telefono='${request.body.telefono}', numero_empleados='${request.body.numero_empleados}' where id='${clienteId}'`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            response.send({ message: `Cliente ${request.body.razon_social} actualizado con éxito.` });
        })
    });
});
/**Hacer una query para introducir un nuevo cliente */
app.post(`/clientes`, (request, response) => {
    connection.query(`select cif from clientes where cif ='${request.body.cif}'`, (error, result, fields) => {
        handleSQLError(result, error, result, (result) => {
            console.log(result)
            if (result.length == 0) {
                connection.query(`insert into clientes (razon_social,cif, sector, telefono, numero_empleados) values ('${request.body.razon_social}','${request.body.cif}','${request.body.sector}','${request.body.telefono}','${request.body.numero_empleados}')`, (error, result, fields) => {
                    handleSQLError(response, error, result, (result) => {
                        response.send({ message: `Cliente ${request.body.razon_social} registrado correctamente` })
                    })
                });
            } else {
                response.send({ message: `El cliente ${request.body.razon_social} ya se encuentra registrado` })
            }
        });
    });
});
/**Extra Hacer una query que enseñe un cliente con un id determinado */
app.get(`/clientes/:id`, (request, response) => {
    let clienteId = request.params.id;
    connection.query(`select * from clientes where id='${clienteId}'`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            response.send(result[0]);
        });
    });
});
/**
 * Final endpoints clientes--------------------------------------------------------------------------------------
 */
/**
 * Endpoints Mobiliario--------------------------------------------------------------------------------------------
 */
/**Hacer una query para recibir listado mobiliario */
app.get(`/mobiliario`, (request, response) => {
    connection.query(`select mobiliario.id,mobiliario.nombre,mobiliario.tipo,mobiliario.referencia,mobiliario.estado,salas.nombre as sala from mobiliario,salas where salas.id=(select id from salas where id=mobiliario.sala_id)`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            response.send(result);
        });
    });
});
/**Hacer un query para modificar la tabla de mobiliario */
app.post(`/mobiliario/:id`, (request, response) => {
    let mobiliarioId = request.params.id;
    let salaId = 0;

    connection.query(`select id from salas where nombre='${request.body.sala}'`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            salaId = result[0].id;
            connection.query(`update mobiliario set nombre='${request.body.nombre}',tipo='${request.body.tipo}',referencia='${request.body.referencia}', estado='${request.body.estado}', sala_id='${salaId}' where id='${mobiliarioId}'`, (error, result, fields) => {
                handleSQLError(response, error, result, (result) => {
                    response.send({ message: `El mobiliario ${request.body.nombre} ha sido actualizado con éxito.` });
                });
            });
        });
    });
});
/**Hacer un query para registrar un nuevo mobiliario */
app.post(`/mobiliario`, (request, response) => {
    let salaId = 0;
    connection.query(`select referencia from mobiliario where referencia='${request.body.referencia}'`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            if (result.length == 0) {
                connection.query(`select id from salas where nombre='${request.body.sala}'`, (error, result, fields) => {
                    handleSQLError(response, error, result, (result) => {
                        salaId = result[0].id;
                        connection.query(`insert into mobiliario (nombre,tipo,referencia,estado, sala_id) values ('${request.body.nombre}','${request.body.tipo}','${request.body.referencia}','${request.body.estado}','${salaId}')`, (error, result, fields) => {
                            handleSQLError(response, error, result, (result) => {
                                response.send({ message: `El item ${request.body.nombre}'ha sido creado con éxito en mobiliario.` });
                            })
                        })
                    })
                })
            } else {
                response.send({ message: `El item ${request.body.nombre} ya existe en mobiliario.` });
            }
        });
    });
});
/**Hacer un query para obtener los datos de un mobiliario concreto por id */
app.get(`/mobiliario/:id`, (request, response) => {
    let mobiliarioId = request.params.id;
    connection.query(`select mobiliario.id,mobiliario.nombre, mobiliario.tipo, mobiliario.referencia,mobiliario.estado,salas.nombre as sala from mobiliario,salas where mobiliario.id ='${mobiliarioId}' and salas.id=(select sala_id from mobiliario where id='${mobiliarioId}')`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            response.send(result[0]);
        });
    });
});
/**
 * Fin endpoints mobiliario-----------------------------------------------------------------------------------------
 */
/**
 * Endpoints para inventario---------------------------------------------------------------------------------------
 */

/**Hacer un query que seleccione los inventarios */
app.get(`/inventario`, (request, response) => {
    connection.query(`select inventario.id,inventario.nombre,inventario.referencia,inventario.tipo,inventario.estado,inventario.marca,clientes.razon_social as asignado from inventario,clientes where clientes.id=(select id from clientes where id=inventario.cliente_id)`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            response.send(result);
        });
    });
});
/**Hacer una query para updatear un inventario */
app.post(`/inventario/:id`, (request, response) => {
    let inventarioId = request.params.id;
    let clienteId = 0;

    connection.query(`select id from clientes where razon_social='${request.body.cliente}'`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            clienteId = result[0].id;
            connection.query(`update inventario set nombre='${request.body.nombre}', referencia='${request.body.referencia}',tipo='${request.body.tipo}',estado='${request.body.estado}', marca='${request.body.marca}', cliente_id='${clienteId}' where id ='${inventarioId}'`, (error, result, fields) => {
                handleSQLError(response, error, result, (result) => {
                    response.send({ message: `El inventario ${request.body.nombre} ha sido actualizado` });
                });
            });
        });
    });
});
/**Hacer un query que ingrese un nuevo item en inventario */

app.post(`/inventario`, (request, response) => {
    let clienteId = 0;
    connection.query(`Select referencia from inventario where referencia='${request.body.referencia}'`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            if (result.length == 0) {
                connection.query(`select id from clientes where razon_social='${request.body.cliente}'`, (error, result, fields) => {
                    handleSQLError(response, error, result, (result) => {
                        clienteId = result[0].id;
                        connection.query(`insert into inventario (nombre, referencia, tipo, estado,marca, cliente_id) values ('${request.body.nombre}','${request.body.referencia}','${request.body.tipo}','${request.body.estado}','${request.body.marca}','${clienteId}')`, (error, result, fields) => {
                            handleSQLError(response, error, result, (result) => {
                                response.send({ message: `El item ${request.body.nombre} ha sido registrado con éxito en el inventario.` });
                            });
                        });
                    });
                });
            } else {
                response.send({ message: `El item ${request.body.nombre} ya se encuentra registrado en inventario` })
            };
        });
    });
});
/**Hacer un query para seleccionar un inventario en concreto y mostrarlo */

app.get(`/inventario/:id`, (request, response) => {
    let inventarioId = request.params.id;
    connection.query(`select inventario.id,inventario.nombre, inventario.referencia, inventario.tipo, inventario.estado, inventario.marca,clientes.razon_social as cliente from inventario,clientes where inventario.id='${inventarioId}' and clientes.id=(select cliente_id from inventario where id ='${inventarioId}')`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            response.send(result[0]);
        });
    });
});
/**
 * Final Endpoints Inventario---------------------------------------------------------------------------------------------------------
 */
/**
 * Endpoints Eventos-------------------------------------------------------------------------------------------------------------------
 */
/**Hacer una query que muestre todos los eventos */
app.get(`/eventos`, (request, response) => {
    connection.query(`select eventos.id,eventos.nombre,eventos.tipo,eventos.fecha_inicio,eventos.fecha_fin,eventos.aforo,eventos.evento_imagen,eventos.descripcion,clientes.razon_social as organizador,salas.nombre as sala from eventos,clientes,salas where clientes.id=(select id from clientes where id=eventos.cliente_id) and salas.id=(select id from salas where id =eventos.sala_id)`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            console.log(result)
            response.send(result);
        });
    });
});
/**Hacer un query que nos modifique un evento en concreto */
app.post(`/eventos/:id`, (request, response) => {
    let eventoId = request.params.id;
    let clienteId = 0;
    let salaId = 0;

    connection.query(`select id from clientes where razon_social='${request.body.organizador}'`, (error, result, fields) => {
        handleSQLError(response, error, result, (result) => {
            clienteId = result[0].id;
            console.log(clienteId)
            connection.query(`select id from salas where nombre='${request.body.sala}'`, (error, result, fields) => {
                handleSQLError(response, error, result, (result) => {
                    salaId = result[0].id;
                    console.log(salaId)
                    connection.query(`select eventos.nombre, eventos.tipo,eventos.fecha_inicio,eventos.fecha_fin,eventos.aforo,eventos.evento_imagen as imagen,eventos.descripcion,clientes.razon_social as organizador,salas.nombre as sala from eventos,clientes,salas where eventos.id='${eventoId}' and clientes.id=(select id from clientes where id=eventos.cliente_id)and salas.id=(select id from salas where id=eventos.sala_id)`, (error, result, fields) => {
                        handleSQLError(response, error, result, (result) => {
                            connection.query(`update eventos set nombre='${request.body.nombre}',tipo='${request.body.tipo}',fecha_inicio='${request.body.fecha_inicio}',fecha_fin='${request.body.fecha_fin}',aforo='${request.body.aforo}',evento_imagen='${request.body.imagen}',descripcion='${request.body.descripcion}',cliente_id='${clienteId}',sala_id='${salaId}' where id='${eventoId}'`,(error, result,fields)=>{
                                handleSQLError(response,error,result,(result)=>{
                                    response.send({message:`El evento ${request.body.nombre}, ha sido actualizado con éxito`});
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
/**Hacer una query para añadir un nuevo evento */
app.post(`/eventos`,(request,response)=>{
    let clienteId=0;
    let salaId=0;
    connection.query(`select id from salas where nombre='${request.body.sala}'`,(error, result,fields)=>{
        handleSQLError(response,error,result,(result)=>{
            salaId=result[0].id;
            console.log(salaId);
            connection.query(`select id from eventos where fecha_inicio='${request.body.fecha_inicio}' and sala_id='${salaId}'`,(error,result,fields)=>{
                handleSQLError(response,error,result,(result)=>{
                    if(result.length==0){
                    connection.query(`select id from clientes where razon_social='${request.body.organizador}'`,(error,result,fields)=>{
                        handleSQLError(response,error,result,(result=>{
                            clienteId=result[0].id;
                            console.log(clienteId);
                            connection.query(`insert into eventos (nombre,tipo,fecha_inicio,fecha_fin,aforo,evento_imagen,descripcion,cliente_id,sala_id) values ('${request.body.nombre}','${request.body.tipo}','${request.body.fecha_inicio}','${request.body.fecha_fin}','${request.body.aforo}','${request.body.imagen}','${request.body.descripcion}','${clienteId}','${salaId}')`,(error,result,fields)=>{
                                handleSQLError(response,error,result,(result)=>{
                                    response.send({message:`El evento ${request.body.nombre} ha sido creado con éxito.`});
                                });
                            });
                        }));
                    });
                }else{
                    response.send({message:`La sala ${salaId} ya se encuentra reservada el ${request.body.fecha_inicio}`});
                };
                });
                
            });
        });
    });
});
/**Hacer una query para observar un evento en concreto */
app.get(`/eventos/:id`,(request,response)=>{
    let eventoId=request.params.id;
    connection.query(`select eventos.id,eventos.nombre,eventos.tipo,eventos.fecha_inicio,eventos.fecha_fin,eventos.aforo,eventos.evento_imagen,eventos.descripcion,clientes.razon_social as organizador,salas.nombre as sala from eventos,clientes,salas where eventos.id='${eventoId}' and clientes.id=(select id from clientes where id=eventos.cliente_id) and salas.id=(select id from salas where id=eventos.sala_id)`,(error,result,fields)=>{
        handleSQLError(response,error,result,(result)=>{
            response.send(result[0]);
        });
    });
});
/**
 * Final endpoints Eventos----------------------------------------------------------------------------------------------------------------
 */




















app.listen(8000, () => {
    console.log(`Server up and running!!`);
});
