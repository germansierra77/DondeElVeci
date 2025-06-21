export function validarLogin() {
    const ExReg_mail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const ExRegContraseña = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,18}$/;

    const $msg_log = document.querySelector("#msg_log");
    let msg = "";
    $msg_log.innerHTML = "Procesando...";

    let usuario = username.value,
        pass = password.value;

    //console.log("user:", usuario, "Password:", pass);

    if (!ExReg_mail.test(usuario)) {
        msg = "Correo inválido";
        if (pass === "") {
            msg = "Correo y Contraseña inválidos";
            setTimeout(() => {
            $msg_log.innerHTML = "";
        }, 3000);
        return false;
        }
    } else if (pass === "") {
        msg = "Contraseña requerida";
    }
    if (msg !== "") {
        $msg_log.innerHTML = `<b class="text-red">${msg}</b>`;
        setTimeout(() => {
            $msg_log.innerHTML = "";
        }, 3000);
        return false;
    }
    
    enviarAjax(usuario, pass);
}
 function enviarAjax(user , pass){ 
 //console.log(user,pass)

 const $msg_log = document.querySelector("#msg_log");
 //PETICION FETCH
 let header = {
    headers: {
        "content-type":"application/json"},
        method: "POST",
        body: JSON.stringify({
            "usuario": user,
            "clave": pass
        })
 }
 fetch("../api/login/login.php",header)
    .then(resp=>resp.json())
    .then((data)=>{
        console.log(data)
        if(data.code==200){
            location.href="seleccionusuario"
        }else{
            $msg_log.innerHTML = data.msg
        }
    })
    .catch((error)=>{})
 
}