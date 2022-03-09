//enviar formulario de agregar Rubro


const button = document.getElementById('enviar');

button.addEventListener('click', async (e)=>{
    e.preventDefault();
    
    const nombre = document.getElementById("Nombre").value;
    
    if(nombre===''){
        alert('Ingrese información antes de agregar');
        return;
    }
    const data = {nombre};


    const res = await fetch('/addRubro', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const exito = await res.text();

    alert(exito);

    window.location.href = '/addRubro'
})  
