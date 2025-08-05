<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../configbd/db.php';
require_once __DIR__ . '/../../vendor/autoload.php'; // Para Twilio
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['code' => 405, 'msg' => 'Método no permitido']);
        exit;
    }

    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);

    if (empty($datos['numero']) || empty($datos['codigo'])) {
        http_response_code(400);
        echo json_encode(['code' => 400, 'msg' => 'Datos incompletos']);
        exit;
    }

    // Configuración para Twilio (reemplaza con tus credenciales)
    $account_sid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    $auth_token = 'your_auth_token';
    $twilio_number = 'whatsapp:+14155238886'; // Número de Twilio Sandbox
    
    // Formatear número para WhatsApp
    $numero_whatsapp = 'whatsapp:+57' . $datos['numero']; // +57 para Colombia
    
    // Mensaje personalizado
    $mensaje = "Hola " . ($datos['nombre'] ?? 'Usuario') . ",\n";
    $mensaje .= "Tu código de verificación para DONDE EL VECI es: *" . $datos['codigo'] . "*\n";
    $mensaje .= "Por favor ingrésalo en la aplicación para continuar.";
    
    // Enviar usando Twilio
    $client = new Twilio\Rest\Client($account_sid, $auth_token);
    
    try {
        $message = $client->messages->create(
            $numero_whatsapp,
            [
                'from' => $twilio_number,
                'body' => $mensaje
            ]
        );

        echo json_encode([
            'code' => 200,
            'msg' => 'Código enviado por WhatsApp',
            'data' => [
                'numero' => $datos['numero'],
                'status' => 'enviado'
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'code' => 500,
            'msg' => 'Error al enviar por WhatsApp',
            'error' => $e->getMessage()
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'code' => 500,
        'msg' => 'Error en el servidor',
        'error' => $e->getMessage()
    ]);
}
?>