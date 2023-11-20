/**-----------------------------------------Hacer un login------------------------------------------------------------------------*/
const host='http://localhost:8000';
const login=()=>{
    const email=document.getElementById('emailUsuario').value;
    const password=document.getElementById('passwordUsuario').value;
    console.log(email,password);
    fetch(`${host}/usuario/${email}`)
    .then((response)=>{
        return response.json();
    }).then((json)=>{
        console.log(json)
        let nombre=json.nombre;
        let permisos=json.permisos;
        let id=json.id
        localStorage.setItem('nombre',nombre);
        localStorage.setItem('permisos',permisos);
        localStorage.setItem('id',id);
    }).catch((error)=>{
        console.error(error);
    });

    fetch(`${host}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email:email, password: password }),
    }).then((response)=>{
        console.log(response)
        return response.json();
        
    }).then((json)=>{
        console.log(json);
        alert(json.message);
        if(json.message==='Usuario logueado'){
            // localStorage.setItem('emailUsuario',email);
            window.location.href="/html/index.html";
             
        }else{
            
            window.location.href="/html/login.html";
        }
       
    }).catch((error)=>{
        console.error(error);
    });
};

const register=()=>{
    const nombre=document.getElementById('nombreNuevo').value;
    const apellidos=document.getElementById('apellidosNuevo').value;
    const dni=document.getElementById('dni').value;
    const telefono=document.getElementById('telefono').value;
    const empresa=document.getElementById('empresa').value;
    const email=document.getElementById('emailNuevo').value;
    const password=document.getElementById('passwordNuevo').value;
    const passwordRepeat=document.getElementById('passwordRepeat').value;
    const foto='/img/icono-de-camara-gris.png';
    const check=document.getElementById('Check').checked;
    const puesto="";
    console.log(nombre,apellidos,dni,telefono,empresa,email,password,passwordRepeat,check);
 if(password===passwordRepeat&&check){
    fetch(`${host}/registro`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({nombre:nombre,apellidos:apellidos,dni:dni,telefono:telefono,empresa:empresa,foto:foto,puesto:puesto,email:email,password:password}),
    }).then((response)=>{
        return response.json();
    }).then((json)=>{
        alert(json.message);
        if(json.message===`Usuario registrado correctamente`){
             window.location.href="/html/index.html";
        }else{
            window.location.href="/html/login.html";
        };       
    }).catch((error)=>{
        console.error(error);
    }); 
    }else{
        alert(`Las contraseñas no coinciden o debe aceptar las políticas`);
        window.location.href="/html/login.html";
    }};

