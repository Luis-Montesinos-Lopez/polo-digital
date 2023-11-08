const express = require('express');
const mysql= require('mysql2');
const app=express();

app.use(express.static('public'));

const connection =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'W3llc0m3@',
    database: 'polo_digital'
});
connection.connect((error)=>{
    if(error){
        return console.error(`error: ${error.message}`);
    }
    console.log(`Conect to MYSQL!!`)
});

app.get(`/carrusel`, (request, response)=>{
    connection.query('select * from eventos',(error,result,fields)=>{
        if(error){
            return console.error(`error: ${error.message}`);
        }
        let listaEventos=[];
        for(let i=0; i<3;i++){
            listaEventos[i]=result[i];
        }
        response.send(listaEventos);
    })
    
});

app.get(`/loging`, (request,response)=>{

    connection.query(`select * from usuarios where email="${request.query.email}" and password="${request.query.password}"`, (error,result,fields)=>{
        if(error){
            return console.error(`error: ${error.message}`);
        }
        if (result.length == 0) {
            response.send({message: `Email o password no validos: ${request.query.email}`});
        } else {
            response.send({message: `Usuario logueado: ${request.query.email}`});
        }
        
        
       
    })
})
app.listen(8000,()=>{
    console.log(`Server up and running!!`);
})