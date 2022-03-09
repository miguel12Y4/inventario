//enviar formulario de agregar Persona


const button = document.getElementById('enviar');

button.addEventListener('click', async (e)=>{
    e.preventDefault();
    
    const nombre = document.getElementById("Nombre").value;
    const rut = document.getElementById("rut").value;

    if(nombre==='' || rut===''){
        alert('Ingrese información antes de agregar');
        return;
    }
    const data = {nombre, rut};

    const res = await fetch('/addPersona', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const exito = await res.text();

    alert(exito);

    window.location.href = '/addPersona'
})  