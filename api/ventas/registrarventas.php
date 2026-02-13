<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../configbd/db.php';

try {
    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception("No se recibieron datos de la venta");
    }

    // Validar que tenga cliente
    if (!isset($input['id_cliente']) || empty($input['id_cliente'])) {
        throw new Exception("Debe seleccionar un cliente para la venta");
    }

    $db = new Db();
    $conn = $db->conectar();
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    // Iniciar transacción
    $conn->beginTransaction();

    // Obtener ID del tendero (sesión)
    session_start();
    $idTendero = $_SESSION['user_id'] ?? 4; // Cambiar por lógica de sesión real

    // Insertar la venta con Id_Cliente
    $sqlVenta = "INSERT INTO tbventas (Fecha, Estado, Total_Venta, Id_Tendero, Id_Cliente) 
                 VALUES (NOW(), 'COMPLETADA', :total, :id_tendero, :id_cliente)";
    
    $stmtVenta = $conn->prepare($sqlVenta);
    $stmtVenta->bindValue(':total', $input['total']);
    $stmtVenta->bindValue(':id_tendero', $idTendero);
    $stmtVenta->bindValue(':id_cliente', $input['id_cliente']);
    
    if (!$stmtVenta->execute()) {
        throw new Exception("Error al registrar la venta");
    }
    
    $idVenta = $conn->lastInsertId();

    // Insertar detalles de la venta
    $sqlDetalle = "INSERT INTO tbdetalleventa (Id_Venta, Id_Producto, Cantidad, Precio_Unitario, Subtotal) 
                   VALUES (:id_venta, :id_producto, :cantidad, :precio, :subtotal)";
    
    $stmtDetalle = $conn->prepare($sqlDetalle);
    
    foreach ($input['productos'] as $producto) {
        // Verificar stock
        $sqlStock = "SELECT Stock FROM tbproductos WHERE Id_Producto = :id_producto";
        $stmtStock = $conn->prepare($sqlStock);
        $stmtStock->bindValue(':id_producto', $producto['id']);
        $stmtStock->execute();
        $stockActual = $stmtStock->fetchColumn();
        
        if ($stockActual < $producto['cantidad']) {
            throw new Exception("Stock insuficiente para: " . $producto['nombre']);
        }
        
        $stmtDetalle->bindValue(':id_venta', $idVenta);
        $stmtDetalle->bindValue(':id_producto', $producto['id']);
        $stmtDetalle->bindValue(':cantidad', $producto['cantidad']);
        $stmtDetalle->bindValue(':precio', $producto['precio_unitario']);
        $stmtDetalle->bindValue(':subtotal', $producto['subtotal']);
        
        if (!$stmtDetalle->execute()) {
            throw new Exception("Error al registrar detalle de producto: " . $producto['nombre']);
        }
        
        // Actualizar stock
        $sqlUpdateStock = "UPDATE tbproductos SET Stock = Stock - :cantidad WHERE Id_Producto = :id_producto";
        $stmtUpdate = $conn->prepare($sqlUpdateStock);
        $stmtUpdate->bindValue(':cantidad', $producto['cantidad']);
        $stmtUpdate->bindValue(':id_producto', $producto['id']);
        
        if (!$stmtUpdate->execute()) {
            throw new Exception("Error al actualizar stock de: " . $producto['nombre']);
        }
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Venta registrada exitosamente',
        'id_venta' => $idVenta,
        'total' => $input['total'],
        'cliente' => $input['id_cliente']
    ]);

} catch (PDOException $e) {
    if (isset($conn)) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>