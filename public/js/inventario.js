const host='http://localhost:8000';
let añadirBoton=false;
let mostrarBoton=false;
let updateBoton=false;
let user=localStorage.getItem('nombre');
let permisos=localStorage.getItem('permisos');
/*--------------------------------------------------Funciones Útiles-------------------------------------------------------------------------------*/
let showOptions=(value)=>{
    let valueBtn=value;
    let updBtn=document.getElementById(`upd${valueBtn}`);
    let delBtn=document.getElementById(`del${valueBtn}`);
    if(!mostrarBoton){
        updBtn.classList.remove('d-none');
        delBtn.classList.remove('d-none');
        mostrarBoton=true;
    }else{
        updBtn.classList.add('d-none');
        delBtn.classList.add('d-none');
        mostrarBoton=false;
    };
};
if(localStorage.length !=0){   
let usuarioLogin=document.getElementById('usuarioLogin');
usuarioLogin.innerHTML=`<a href="/html/usuarios.html" class="text-white m-0 text-decoration-none">${user}</a> <buttom class="btn btn-primary" onclick="logout()">Logout</buttom>`;
};
let logout=()=>{
localStorage.clear();
window.location.href="/html/index.html";
};
/*-----------------------------------------------------Mostrar Inventario--------------------------------------------------------------------*/
let enseñarInventario=()=>{
    fetch(`${host}/inventarios`)
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        let inventario=document.getElementById('container');
        if(permisos==1){
       for(let i=0;i<json.length;i++){
        inventario.innerHTML+=`<tr><td>${json[i].nombre}</td><td>${json[i].referencia}</td><td>${json[i].tipo}</td>
        <td>${json[i].estado}</td><td>${json[i].marca}</td><td>${json[i].asignado}</td>
        <td><button id="shw${json[i].id}"class="btn btn-sm btn-primary" onclick="showOptions(${json[i].id})"><i class="bi bi-three-dots-vertical"></i></button></td>
        <td><buttom id="upd${json[i].id}" onclick="updInventario(${json[i].id})" class="btn btn-sm btn-primary d-none"><i class="bi bi-pencil"></i></buttom>
        <buttom id="del${json[i].id}" onclick="remInventario(${json[i].id})" class="btn btn-sm btn-primary d-none"><i class="bi bi-trash3"></i></buttom></td></tr>`
       };
       let add=document.getElementById('add');
        add.innerHTML=`<button class="btn btn-primary btn-sm" onclick="showInventario()"><i class="bi bi-plus-square"></i></button>`
        }else{
       for(let i=0;i<json.length;i++){
        inventario.innerHTML+=`<tr><td>${json[i].nombre}</td><td>${json[i].referencia}</td><td>${json[i].tipo}</td>
        <td>${json[i].estado}</td><td>${json[i].marca}</td><td>${json[i].asignado}</td>
        <td><td></td></td></tr>`
       };
        };   
       }).catch((error)=>{
        console.error(error);
    });
};
if(localStorage.length!=0){
    window.addEventListener('load',enseñarInventario);
};
/*-------------------------------------------------Mostrar formulario añadir Inventario--------------------------------------------------------------------------*/
const showInventario=()=>{
    let add=document.getElementById('edit');
    let btn=document.getElementById('btn');
    document.getElementById('nombre').value="";
    document.getElementById('referencia').value="";
    document.getElementById('tipo').value="";
    document.getElementById('estado').value="";
    document.getElementById('marca').value="";
    document.getElementById('asignado').value="";   
    if(!añadirBoton){
        add.classList.remove('d-none');
        btn.innerHTML=`<button class="btn btn-primary btn-sm" onclick="addInventario()"><i class="bi bi-send"></i></button>`
        añadirBoton=true;
    }else{
        add.classList.add('d-none');
        añadirBoton=false;
    }
};
/*-------------------------------------------------------Añadir Inventario----------------------------------------------------------------*/
let addInventario=()=>{
    const nombre=document.getElementById('nombre').value;
    const ref=document.getElementById('referencia').value;
    const tipo=document.getElementById('tipo').value;
    const estado=document.getElementById('estado').value;
    const marca=document.getElementById('marca').value;
    const asignado=document.getElementById('asignado').value;
    fetch(`${host}/inventarios`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({nombre:nombre,referencia:ref,tipo:tipo,estado:estado,marca:marca,cliente:asignado}),
    }).then((response)=>{
        return response.json()
    }).then((json)=>{
            alert(json.message);
            if(json.message==`El item  ha sido registrado con éxito en el inventario.`){
                window.location.href='/html/inventario.html';
            };
        }).catch((error)=>{
            console.error(error);
        });
};
/*-------------------------------------------------Mostrar inventario para Actualizar-------------------------------------------------------*/
let updInventario=(inventarioID)=>{
    let invId=inventarioID;
    let edit=document.getElementById('edit');
    let btn=document.getElementById('btn');
    if(!updateBoton){
        fetch(`${host}/inventarios/${invId}`)
        .then((response)=>{
            return response.json();
        }).then((json)=>{
            document.getElementById('id').value=json.id;
            document.getElementById('nombre').value=json.nombre;
            document.getElementById('referencia').value=json.referencia;
            document.getElementById('tipo').value=json.tipo;
            document.getElementById('estado').value=json.estado;
            document.getElementById('marca').value=json.marca;
            document.getElementById('asignado').value=json.cliente;
            btn.innerHTML=`<button class="btn btn-primary btn-sm" onclick="sendUpdate()"><i class="bi bi-send"></i></button>`
            edit.classList.remove('d-none');
            updateBoton=true;
        }).catch((error)=>{
            console.error(error);
        });        
    }else{
        edit.classList.add('d-none');
        updateBoton=false;
    };
};
/*-----------------------------------------------------------Actualizar Inventario-------------------------------------------------------------*/
let sendUpdate=()=>{
    const id =document.getElementById('id').value;
    const nombre=document.getElementById('nombre').value;
    const ref=document.getElementById('referencia').value;
    const tipo=document.getElementById('tipo').value;
    const estado=document.getElementById('estado').value;
    const marca=document.getElementById('marca').value;
    const asignado=document.getElementById('asignado').value;
    fetch(`${host}/inventarios/${id}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({id:id,nombre:nombre,referencia:ref,tipo:tipo,estado:estado,marca:marca,cliente:asignado}),
    }).then((response)=>{
        return response.json();
    }).then((json)=>{
        alert(json.message);
        if(json.message==`El inventario ha sido actualizado`){
            window.location.href='/html/inventario.html';
        }
    }).catch((error)=>{
        console.error(error);
    });
};
/*-------------------------------------------------------Eliminar Inventario--------------------------------------------------------------------------*/
let remInventario=(valor)=>{
    let invId=valor;
    let respuesta=confirm('¿Seguro que quieres eliminar este inventario?');
    if(respuesta==true){
        fetch(`${host}/eliminarInventarios/${invId}`,{
            method:'POST'
        }).then((response)=>{
            return response.json();
        }).then((json)=>{
            alert(json.message);
            if(json.message==`El producto ha sido eliminado.`){
                window.location.href='/html/inventario.html';
            }
        }).catch((error)=>{
            console.error(error);
        });
    }else{
        window.location.href='/html/inventario.html';
    };
};