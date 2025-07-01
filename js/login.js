import {enviarAjax} from "../js/tools.js"

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

    enviarAjax({
    url: "../api/login/login.php",
    method: "POST",
    param: {
        usuario: usuario,
        clave: pass
    },
    fresp: (data)=>{
        if(data.code==200){
            // Cambia esta línea para incluir el ID del usuario en la URL
            location.href=`seleccionusuario?id=${data.idUser}`;
        }else{
            $msg_log.innerHTML = data.msg
        }
    }
    });
    //console.log ("OK DESPUES DEL FETCH")
}
