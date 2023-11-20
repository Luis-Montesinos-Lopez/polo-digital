const host='http://localhost:8000';
let user=localStorage.getItem('nombre');
let userId=localStorage.getItem('id');
/**Funciones útiles */
if(localStorage.length !=0){   
    let usuarioLogin=document.getElementById('usuarioLogin');
    usuarioLogin.innerHTML=`<a href="/html/usuarios.html" class="text-white m-0 text-decoration-none">${user}</a> <buttom class="btn btn-primary" onclick="logout()">Logout</buttom>`;
    };
    let logout=()=>{
    localStorage.clear();
    window.location.href="/html/index.html";
    };
    /**Mostrar datos usuario */
let mostrarDatos=(userID)=>{
    fetch(`${host}/empleado/${userID}`)
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        let name=document.getElementById('nombre');
        name.innerHTML=`${json.nombre}`;
        let apellido=document.getElementById('apellidos');
        apellido.innerHTML=`${json.apellidos}`;
        let dni=document.getElementById('dni');
        dni.innerHTML=`${json.dni}`;
        let tel=document.getElementById('telefono');
        tel.innerHTML=`${json.telefono}`;
        let email=document.getElementById('email');
        email.innerHTML=`${json.email}`;
        let pass=document.getElementById('password');
        pass.innerHTML=`${json.password}`;
        let empresa=document.getElementById('empresa');
        empresa.innerHTML=`${json.empresa}`;
        let puesto=document.getElementById('puesto');
        puesto.innerHTML=`${json.puesto}`;
        let foto=document.getElementById('foto');
        foto.innerHTML=`<img class="border rounded-circle overflow-hidden text-center" src="${json.foto}" alt="foto usuario" width="180px" height="200px">`
    }).catch((error)=>{
        response.error(error)
    });
};
window.addEventListener('load',mostrarDatos(userId));