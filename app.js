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
    connection.query("select * from eventos", (error, result, fields) => {
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
 * Termina Index-------------------------------------------------------------------------------------------------------
 */
/**
 * Endpoints para Registros/login-----------------------------------------------------------------------------
 */

app.get(`/login`, (request, response) => {
    connection.query(
        `select * from usuarios where email="${request.query.email}" and password="${request.query.password}"`,
        (error, result, fields) => {
            handleSQLError(response, error, result, (result) => {
                if (result.length == 0) {
                    response.send({
                        message: `Email o password no validos: ${request.query.email}`,
                    });
                } else {
                    response.send({
                        message: `Usuario logueado: ${request.query.email}`,
                    });
                }
            });
        }
    );
});

// app.post(`/registro`, (request, response) => {
//   console.log(request.body);
//   /**
//    * hacer un connection.query insert into usuarios y un insert into empleadosclientes
//    */
//   let nuevoEmail = request.body.email;
//   let nuevoUsuario_Id = 0;
//   let cliente_Id=0;
//   connection.query(`select * from usuarios`, (error, result, fields) => {
//     handleSQLError(response, error, result, (result) => {
//       for (let i = 0; i < result.length; i++) {
//         if (result[i].email == nuevoEmail) {
//           return response.send(`El email ya está en uso`);
//         }; 
//       } connection.query(
//             `insert into usuarios (email,password) values ('${request.body.email}', '${request.body.password}')`,
//             (error, result, fields) => {
//               handleSQLError(response, error, result, (result) => {});
//             }
//           );
//       nuevoUsuario_Id = result[result.lenght-1].id+1;

//     });
//   });
//   connection.query(`select * from empleadosclientes`,(error, result, fields) => {
//       handleSQLError(response, error, result, (result) => {
//         for (let i = 0; i < result.length; i++) {
//           if (result[i].nombre == request.body.nombre &&
//             result[i].apellidos == request.body.apellidos &
//               result[i].dni == request.body.dni){
//                 return response.send(`Este empleado ya está registrado en la base de datos`);
//           };
//         }

//         for(let i=0;i<result.length;i++){
//             if(result[i].razon_social==request.body.empresa){
//                 cliente_Id=result[i].id;
//               } else{
//                 return response.send(`El cliente introducido no existe`);
//               }
//         }
//         connection.query(`insert into empleadosclientes (nombre, apellidos, dni, telefono, usuario_id, cliente_id) values ('${request.body.nombre}','${request.body.apellidos}','${request.body.dni}','${request.body.telefono}', '${nuevoUsuario_Id}', '${cliente_Id}')`,
//               (error, result, fields) => {
//                 handleSQLError(request, error, result, (result) => {
//                  return response.send({ message: `Registro realizado` });
//                 });
//               }
//             );
//       });
//         }
//     );
// });
app.post(`/registro`, (request, response) => {
    console.log(request.body);
    /**
     * hacer un connection.query insert into usuarios y un insert into empleadosclientes
     */
    let nuevoEmail = request.body.email;
    let nuevoPassword = request.body.password;
    let nuevoUsuario_Id = 0;
    let cliente_Id = 0;
    /**
     * comprobar si el email está en uso
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
                        handleSQLError(response,error,result,(result)=>{
                            console.log(result);
                            cliente_Id = result[0].id;
                            console.log(cliente_Id);
                            connection.query(`insert into empleadosclientes (nombre,apellidos,usuario_id,cliente_id,dni,telefono) values ('${request.body.nombre}','${request.body.apellidos}','${nuevoUsuario_Id}','${cliente_Id}','${request.body.dni}','${request.body.telefono}')`, (error,result,fields)=>{
                                handleSQLError(response,error,result,(result)=>{
                                    response.send({message: `Usuario registrado correctamente`});
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
app.listen(8000, () => {
    console.log(`Server up and running!!`);
});
