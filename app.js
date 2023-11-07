const express = require('express');
const app=express();

app.use(express.static('public'));

app.get(`/hola`, (request, response)=>{
    response.send({menssage:`Holakhase`});
});
app.listen(8000,()=>{
    console.log(`Server up and running!!`);
})