export async function enviarAjax({url, method = 'GET', param = null, headers = {}}) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (param) {
            options.body = typeof param === 'object' ? JSON.stringify(param) : param;
        }

        const response = await fetch(url, options);
        
        // Verificar si la respuesta es JSON válido
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(text || 'Respuesta no JSON del servidor');
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `Error ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Error en enviarAjax:', error);
        throw new Error(error.message || 'Error en la solicitud');
    }
}