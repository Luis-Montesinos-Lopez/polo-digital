const host=`http://localhost:8000`;
let mostrarBoton=false;
let showBoton=false;
let editBoton=false;
let user=localStorage.getItem('nombre');
let permisos=localStorage.getItem('permisos');
/*--------------------------------------------------Mostrar clientes------------------------------------------------------------------------------------------------------- */
let mostrarClientes=()=>{
fetch(`${host}/clientes`)
.then((response)=>{
    return response.json();
}).then((json)=>{
    if(permisos==1){
        console.log(json)
    let clientes=document.getElementById('container');
    for(let i=0;i<json.length;i++){
        clientes.innerHTML+=`<tr><td>${json[i].razon_social}</td><td>${json[i].cif}</td><td>${json[i].sector}</td>
        <td>${json[i].telefono}</td><td>${json[i].numero_empleados}</td>
        <td><button id="shw${json[i].id}"class="btn btn-sm btn-primary" onclick="showOptions(${json[i].id})"><i class="bi bi-three-dots-vertical"></i></button></td>
        <td><button id="upd${json[i].id}" class="btn btn-sm btn-primary d-none" onclick="showClient(${json[i].id})"><i class="bi bi-pencil"></i></button>
        <button id="del${json[i].id}" class="btn btn-sm btn-primary d-none" onclick="deleteClient(${json[i].id})"><i class="bi bi-trash3"></i></buttom></td></tr>`
    };
    let add=document.getElementById('add');
    add.innerHTML=`<button class="btn btn-primary btn-sm" onclick="addClient()"><i class="bi bi-plus-square"></i></button>`
    }else{
        let clientes=document.getElementById('container');
    for(let i=0;i<json.length;i++){
        clientes.innerHTML+=`<tr><td>${json[i].razon_social}</td><td>${json[i].cif}</td><td>${json[i].sector}</td>
        <td>${json[i].telefono}</td><td>${json[i].numero_empleados}</td>
        <td></td><td></td></tr>`
    };
    }
    
}).catch((error)=>{
    console.error(error);
});
};
if(localStorage.length!=0){
    window.addEventListener('load',mostrarClientes);
};
/*----------------------------------------------------Añadir cliente-------------------------------------------------------------------*/
let addClient=()=>{
    if(!showBoton){
    let edit =document.getElementById('edit');
    edit.classList.remove('d-none');
    let btn=document.getElementById('btn');
    btn.innerHTML=`<button  class="btn btn-primary btn-sm" onclick="regClient()"><i class="bi bi-send"></i></button>`
    document.getElementById('empresa').value="";
    document.getElementById('cif').value="";
    document.getElementById('sector').value="";
    document.getElementById('telefono').value="";
    document.getElementById('empleados').value="";
    showBoton=true;
    }else{
        edit.classList.add('d-none');
        showBoton=false;
    }
    
};
/*----------------------------------------------------Registrar cliente--------------------------------------------------------------------*/
let regClient=()=>{
    let empresa=document.getElementById('empresa').value;
    let cif=document.getElementById('cif').value;
    let sector=document.getElementById('sector').value;
    let telefono= document.getElementById('telefono').value;
    let empleados= document.getElementById('empleados').value;
       fetch(`${host}/clientes`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({razon_social:empresa,cif:cif,sector:sector,telefono:telefono,numero_empleados:empleados}),
    })
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        alert(json.message);
        if(json.message==`Cliente registrado correctamente`){
            let edit =document.getElementById('edit');
            edit.classList.add('d-none');
            window.location.href='/html/clientes.html';
        };
    });
};
/*----------------------------------------------------Editar cliente-------------------------------------------------------------------*/
let showClient=(clienteID)=>{
    let edit=document.getElementById('edit');
    if(!editBoton){
          console.log(clienteID);
   fetch(`${host}/clientes/${clienteID}`)
   .then((response)=>{
    return response.json();
   }).then((json)=>{
    edit.classList.remove('d-none');
    let btn=document.getElementById('btn');
    btn.innerHTML=`<button  class="btn btn-primary btn-sm" onclick="updateClient()"><i class="bi bi-send"></i></button>`
    
    document.getElementById('id').value=json.id;
    document.getElementById('empresa').value=json.razon_social;
    document.getElementById('cif').value=json.cif;
    document.getElementById('sector').value=json.sector;
    document.getElementById('telefono').value=json.telefono;
    document.getElementById('empleados').value=json.numero_empleados;
   }).catch((error)=>{
    console.error(error);
   });
   editBoton=true;
    }else{
        edit.classList.add('d-none');
        editBoton=false;
    }
 
};
let updateClient=()=>{
    let id=document.getElementById('id').value;
    let empresa=document.getElementById('empresa').value;
    let cif=document.getElementById('cif').value;
    let sector=document.getElementById('sector').value;
    let telefono= document.getElementById('telefono').value;
    let empleados= document.getElementById('empleados').value;
   
    
    fetch(`${host}/clientes/${id}`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({razon_social:empresa,cif:cif,sector:sector,telefono:telefono,numero_empleados:empleados}),
    })
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        alert(json.message);
        if(json.message==`Cliente actualizado con éxito.`){
            let edit =document.getElementById('edit');
            edit.classList.add('d-none');      
            window.location.href='/html/clientes.html';
        };
    });
};

/*-----------------------------------------------------Eliminar cliente--------------------------------------------------------------*/
let deleteClient=(clienteID)=>{
    let respuesta=confirm(`¿Seguro que quieres eliminar el cliente?`);
    console.log(respuesta);
    if(confirm==true){
    fetch(`${host}/eliminarclientes/${clienteID}`,{
        method:'POST',        
    })
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        console.log(json)
        alert(json.message);
          if(json.message==`El cliente ha sido eliminado.`){
            window.location.href=`/html/clientes.html`;
        }window.location.href=`/html/clientes.html`;
    }).catch((error)=>{
        console.error(error);
    });
    };  
};
/*-------------------------------------------------Funciones útiles----------------------------------------------------------------- */
let showOptions=(valorid)=>{

let valor=valorid;
let btnupd=document.getElementById(`upd${valor}`);
let delbtn=document.getElementById(`del${valor}`);
if(!mostrarBoton){
btnupd.classList.remove('d-none');
delbtn.classList.remove('d-none');
mostrarBoton=true;
}else{
btnupd.classList.add('d-none');
delbtn.classList.add('d-none');
mostrarBoton=false;
};
};

 console.log(localStorage)
if(localStorage.length !=0){   
let usuarioLogin=document.getElementById('usuarioLogin');
usuarioLogin.innerHTML=`<a href="/html/usuarios.html" class="text-white m-0 text-decoration-none">${user}</a>
 <buttom class="btn btn-primary" onclick="logout()">Logout</buttom>`;
};
let logout=()=>{
    localStorage.clear();
    window.location.href="/html/index.html";
    };