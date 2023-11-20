const host=`http://localhost:8000`;
let mostrarBoton=false;
let showBoton=false;
let editBoton=false;
let user=localStorage.getItem('nombre');
let permisos=localStorage.getItem('permisos');

/*-------------------------------------------------------Mostrar Mobiliario------------------------------------------------------------------*/
let mostrarMobiliario=()=>{
    fetch(`${host}/mobiliarios`)
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        let mobiliario=document.getElementById('container');
        if(permisos==1){
            
            for(let i=0;i<json.length;i++){
                mobiliario.innerHTML+=`<tr><td>${json[i].nombre}</td><td>${json[i].tipo}</td><td>${json[i].referencia}</td>
                <td>${json[i].estado}</td><td>${json[i].sala}</td>
                <td><buttom id="shw${json[i].id}"class="btn btn-sm btn-primary" onclick="showOptions(${json[i].id})"><i class="bi bi-three-dots-vertical"></i></buttom></td>
                <td><buttom id="upd${json[i].id}" class="btn btn-sm btn-primary d-none" onclick="editMobiliario(${json[i].id})"><i class="bi bi-pencil"></i></buttom>
                <buttom id="del${json[i].id}" class="btn btn-sm btn-primary d-none" onclick="deleteMobiliario(${json[i].id})"><i class="bi bi-trash3"></i></buttom></td></tr>`
            };
            let add=document.getElementById('add');
            add.innerHTML=`<button class="btn btn-primary btn-sm" onclick="showMobiliario()"><i class="bi bi-plus-square"></i></button>`
        }else{
            
        for(let i=0;i<json.length;i++){
            mobiliario.innerHTML+=`<tr><td>${json[i].nombre}</td><td>${json[i].tipo}</td><td>${json[i].referencia}</td>
            <td>${json[i].estado}</td><td>${json[i].sala}</td>
            <td><td></td></td></tr>`
        };
        };       
       }).catch((error)=>{
        console.error(error);
    });
};
if(localStorage.length!=0){
    window.addEventListener('load',mostrarMobiliario);
}

/*---------------------------------------------------------Registrar Mobiliario---------------------------------------------------------*/
let showMobiliario=()=>{
    let edit=document.getElementById('edit');
    let btn=document.getElementById('btn')
if(!mostrarBoton){
    edit.classList.remove('d-none');
    document.getElementById('nombre').value="";
    document.getElementById('tipo').value="";
    document.getElementById('referencia').value="";
    document.getElementById('estado').value="";
    document.getElementById('sala').value="";
    btn.innerHTML=`<button class="btn btn-primary btn-sm" onclick="addMobiliario()"><i class="bi bi-send"></i></button>`
    mostrarBoton=true;
}else{
    edit.classList.add('d-none');
    mostrarBoton=false;
};
};
let addMobiliario=()=>{
    let nombre=document.getElementById('nombre').value;
    let tipo=document.getElementById('tipo').value;
    let ref=document.getElementById('referencia').value;
    let estado=document.getElementById('estado').value;
    let sala=document.getElementById('sala').value;
    fetch(`${host}/mobiliarios`,{
        method:`POST`,
        headers:{
           'Content-Type':'application/json'
        },
        body: JSON.stringify({nombre:nombre,tipo:tipo,referencia:ref,estado:estado,sala:sala}),
    }).then((response)=>{
        return response.json();
    }).then((json)=>{
        alert(json.message);
        if(json.message==`El item ha sido creado con éxito en mobiliario.`){
            let edit =document.getElementById('edit');
            edit.classList.add('d-none');
            window.location.href=`/html/mobiliario.html`;
        };
    }).catch((error)=>{
        console.error(error);
    });
};
/*----------------------------------------------------Actualizar mobiliario--------------------------------------------------------------*/
let editMobiliario=(mobiliarioID)=>{
    let edit=document.getElementById(`edit`);
    if(!editBoton){
        edit.classList.remove('d-none');
        editBoton=true;
        fetch(`${host}/mobiliarios/${mobiliarioID}`)
        .then((response)=>{
            return response.json();
        }).then((json)=>{
            let btn=document.getElementById('btn');
            document.getElementById('id').value=json.id;
            document.getElementById('nombre').value=json.nombre;
            document.getElementById('tipo').value=json.tipo;
            document.getElementById('referencia').value=json.referencia;
            document.getElementById('estado').value=json.estado;
            document.getElementById('sala').value=json.sala;
            btn.innerHTML=`<button class="btn btn-primary btn-sm" onclick="updMobiliario()"><i class="bi bi-send"></i></button>`
        }).catch((error)=>{
            console.error(error);
        });
    }else{
        edit.classList.add('d-none');
        editBoton=false;
        };
};
let updMobiliario=()=>{
    let id=document.getElementById('id').value;
    let nombre=document.getElementById('nombre').value;
    let tipo=document.getElementById('tipo').value;
    let referencia=document.getElementById('referencia').value;
    let estado=document.getElementById('estado').value;
    let sala=document.getElementById('sala').value;
    fetch(`${host}/mobiliarios/${id}`,{
        method:'Post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({id:id,nombre:nombre,tipo:tipo,referencia:referencia,estado:estado,sala:sala}),
    }).then((response)=>{
        return response.json();
    }).then((json)=>{
        alert(json.message);
        if(json.message==`El mobiliario ha sido actualizado con éxito.`){
            let edit =document.getElementById('edit');
            edit.classList.add('d-none'); 
            window.location.href='/html/mobiliario.html';
        };
    }).catch((error)=>{
        console.error(error);
    });
};
/*----------------------------------------------------Eliminar mobiliario-------------------------------------------------------------------*/
let deleteMobiliario=(mobiliarioID)=>{
    
    let respuesta=confirm(`¿Seguro que quieres eliminar el item?`);
    if(respuesta==true){
        fetch(`${host}/deleteMobiliario/${mobiliarioID}`,{
        method:'post',
    }).then((response)=>{
        return response.json();
    }).then((json)=>{
        alert(json.message);
        if(json.message==`El item ha sido eliminado con éxito`){
            window.location.href='/html/mobiliario.html';
        }
    }).catch((error)=>{
        console.error(error);
    });
    }else{
        window.location.href='/html/mobiliario.html';
    }; 
};
/*----------------------------------------------------Funciones Útiles------------------------------------------------------------------*/
let showOptions=(valorID)=>{
    let valor=valorID;
    let updbtn=document.getElementById(`upd${valor}`);
    let delbtn=document.getElementById(`del${valor}`);
    if(!showBoton){
        updbtn.classList.remove(`d-none`);
        delbtn.classList.remove(`d-none`);
        showBoton=true;
    }else{
        updbtn.classList.add(`d-none`);
        delbtn.classList.add(`d-none`);
        showBoton=false;
    };
};
 console.log(localStorage)
if(localStorage.length !=0){   
let usuarioLogin=document.getElementById('usuarioLogin');
usuarioLogin.innerHTML=`<a href="/html/usuarios.html" class="text-white m-0 text-decoration-none">${user}</a> <buttom class="btn btn-primary" onclick="logout()">Logout</buttom>`;
};
let logout=()=>{
localStorage.clear();
window.location.href="/html/index.html";
};