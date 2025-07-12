<?php
header('Content-Type: application/json');

require_once '../configbd/db.php';

$response = ['success' => false, 'message' => ''];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    // Obtener y validar datos
    $requiredFields = ['nombre', 'medida', 'precio', 'categoria'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("El campo $field es obligatorio");
        }
    }

    // Asignar y sanitizar datos
    $nombre = htmlspecialchars(trim($_POST['nombre']));
    $marca = isset($_POST['marca']) ? htmlspecialchars(trim($_POST['marca'])) : null;
    $medida = htmlspecialchars(trim($_POST['medida']));
    $precio = filter_var($_POST['precio'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $categoria = htmlspecialchars(trim($_POST['categoria']));

    // Validaciones adicionales
    if (strlen($nombre) > 60) {
        throw new Exception('El nombre no puede exceder los 60 caracteres');
    }
    
    if ($precio <= 0) {
        throw new Exception('El precio debe ser mayor que cero');
    }

    // Conectar a la base de datos
    $db = new Db();
    $conn = $db->conectar();

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare("INSERT INTO tbproductos 
                          (Nombre, Medida, Precio, Marca, Categoria) 
                          VALUES (?, ?, ?, ?, ?)");
    
    $stmt->execute([$nombre, $medida, $precio, $marca, $categoria]);

    $response = [
        'success' => true,
        'message' => 'Producto registrado exitosamente',
        'id' => $conn->lastInsertId()
    ];

} catch (PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>