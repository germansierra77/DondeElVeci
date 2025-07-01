
export async function enviarAjax(info){
    let {url,method, param, fresp}= info 

    if(param!==undefined && method==="GET") url += "?"+new URLSearchParams(param).toString()
    
    if(method==="POST" || method==="PUT" || method==="DELETE") method= {method,headers:
        {"Content-type":"applicaction/json"}, body: JSON.stringify(param)} 
    else method= {method,headers:{"Content-type":"application/json"}}
    
    try {
        let resp = await fetch(url,method)
        if(!resp.ok) throw new Error("Error en la respuesta del servidor")
        let data = await resp.json()
    fresp(data)
    }catch (error){
        console.error("Error en la solicitud",error)
        fresp({code:500, msg: "Error en la solicitud"})
    }
    //console.log("Ok despues de que se ejecuta el fecth")
}