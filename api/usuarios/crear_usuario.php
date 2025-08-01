<?php
header('Content-Type: application/json');

require_once '../configbd/db.php';

$response = ['success' => false, 'message' => ''];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    // Obtener y validar datos
    $requiredFields = ['Nombres', 'Apellidos', 'Correo', 'Cedula', 'Contrasena', 'TipoUsuario'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("El campo $field es obligatorio");
        }
    }

    // Asignar y sanitizar datos
    $nombres = htmlspecialchars(trim($_POST['Nombres']));
    $apellidos = htmlspecialchars(trim($_POST['Apellidos']));
    $correo = htmlspecialchars(trim($_POST['Correo']));
    $cedula = filter_var($_POST['Cedula'], FILTER_SANITIZE_NUMBER_INT);
    $contrasena = htmlspecialchars(trim($_POST['Contrasena']));
    $celular = isset($_POST['Celular']) ? filter_var($_POST['Celular'], FILTER_SANITIZE_NUMBER_INT) : null;
    $tipoUsuario = htmlspecialchars(trim($_POST['TipoUsuario']));

    // Validaciones adicionales
    if (strlen($nombres) > 60) {
        throw new Exception('El nombre no puede exceder los 60 caracteres');
    }
    
    if (strlen($apellidos) > 20) {
        throw new Exception('Los apellidos no pueden exceder los 20 caracteres');
    }
    
    if (strlen($correo) > 150) {
        throw new Exception('El correo no puede exceder los 150 caracteres');
    }
    
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('El correo electrónico no es válido');
    }

    // Encriptar la contraseña (usando SHA1 como en la estructura de la tabla)
    $contrasenaHash = sha1($contrasena);

    // Conectar a la base de datos
    $db = new Db();
    $conn = $db->conectar();

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare("INSERT INTO tbusuarios 
                          (Nombres, Apellidos, Cedula, Contrasena, Correo, Celular, Tipousuario) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([$nombres, $apellidos, $cedula, $contrasenaHash, $correo, $celular, $tipoUsuario]);

    $response = [
        'success' => true,
        'message' => 'Usuario registrado exitosamente',
        'id' => $conn->lastInsertId()
    ];

} catch (PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);

?>
