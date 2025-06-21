export function validarLogin() {
    const ExReg_mail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const ExRegContraseña = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,18}$/;

    console.log("Entró a validarLogin()");

    const $msg_log = document.querySelector("#msg_log");
    let msg = "";
    $msg_log.innerHTML = "Procesando...";

    let usuario = username.value,
        pass = password.value;

    console.log("user:", usuario, "Password:", pass);

    if (!ExReg_mail.test(usuario)) {
        msg = "Correo inválido";
        if (pass === "") {
            msg = "Correo y Contraseña inválidos";
        }
    } else if (pass === "") {
        msg = "Contraseña requerida";
    }
    // else if (!ExRegContraseña.test(pass)) {
    //     msg = "Contraseña inválida";
    // }

    if (msg !== "") {
        $msg_log.innerHTML = `<b class="text-red">${msg}</b>`;
        setTimeout(() => {
            $msg_log.innerHTML = "";
        }, 3000);
        return false;
    }

    $msg_log.innerHTML = "Datos ingresados correctamente";
}


