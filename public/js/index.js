const host='http://localhost:8000';
/*--------------------Hacemos una llamada a base de datos y pintamos el html con los datos de eventos-------------------------------*/

window.addEventListener('load',(eventos)=>{
});
let eventos=()=>{
    fetch(`${host}/eventos`)
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        
        const containerDiv=document.getElementById('container');
        containerDiv.innerHTML='<ul>';
        for(let i=0; i<json.length; i++){
            containerDiv.innerHTML+=`<li class="w-100 text-center padding-5 my-5 border-bottom border-primary"><div class="my-3"><img src="${json[i].evento_imagen}" alt="imagen evento" width="720" ></div><h2>${json[i].nombre}</h2><h3 class="text-success">${json[i].fecha_inicio}</h3><h4>${json[i].organizador}</h4><div><button onclick="carruselClick(${json[i].id})" class=" btn btn-primary my-3" id="btn-${[i]}">More info plis</button></div></li>`
        };
        containerDiv.innerHTML+='</ul>';
    }).catch((response)=>{
        console.log(response);
    });    
};
/*------------Seleccionamos un solo evento y en base de datos recogemos sus datos y volvemos a pintar el html----------------------*/
let carruselClick=(eventoId)=>{
    console.log(eventoId);
    fetch(`${host}/eventos/${eventoId}`)
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        console.log(json);
        const containerDiv=document.getElementById('container');
        containerDiv.innerHTML =
        `<div class="text-center">
                <h2 class ="my-3">${json.nombre} by ${json.organizador}</h2>
            <div class ="my-3">
                <img src="${json.evento_imagen}">
            </div>
            <div class="d-flex padding-3 justify-content-evenly align-items-center my-3">
                <h4 class="text-success">${json.fecha_inicio}</h4>
                <h4 class="text-success">${json.fecha_fin}</h4>
                <h4 class="text-success ">Aforo: ${json.aforo}</h4>
            </div>
            <h4 class ="my-3">${json.descripcion}</h4>
            <buttom onclick="eventos()" class="btn btn-primary">Volver a Eventos</buttom>
        </div>`
    }).catch((response)=>{
        console.log(response);
    });

};
eventos();


let user=localStorage.getItem('nombre');
 console.log(localStorage)
if(localStorage.length !=0){   
let usuarioLogin=document.getElementById('usuarioLogin');
usuarioLogin.innerHTML=`<p class="text-white m-0">${user}</p> <buttom class="btn btn-primary" onclick="logout()">Logout</buttom>`;
}


let logout=()=>{
localStorage.clear();
window.location.href="/html/index.html";
};
