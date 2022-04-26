let cliente = {
    mesa: ``,
    hora: ``,
    pedido: []
};

const categorias = {
    1: `Comidas`,
    2: `Bebidas`,
    3: `Postres`
};

const btnGuardarCliente = document.querySelector(`#guardar-cliente`);
btnGuardarCliente.addEventListener(`click`, guardarCliente);

function guardarCliente() {
    
    const mesa = document.querySelector(`#mesa`).value;
    const hora = document.querySelector(`#hora`).value;

    //Verificar campos vacíos.
    const camposVacios = [ mesa, hora ].some(campo => campo === ``);

    if(camposVacios) {

        //Verificar alerta existente.
        const existeAlerta = document.querySelector(`.invalid-feedback`);

        if(!existeAlerta) {
            const alerta = document.createElement(`div`);
            alerta.classList.add(`invalid-feedback`, `d-block`, `text-center`);
            alerta.textContent = `Todos los campos son obligatorios`;
            document.querySelector(`.modal-body form`).appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 3000);
        };
        
        return;
    };
    
    //Asignar datos del formulario al cliente.
    cliente = { ...cliente, mesa, hora };

    //Ocultar Modal.
    const modalFormulario = document.querySelector(`#formulario`);
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Mostrar secciones.
    mostrarSecciones();

    //Obtener platos de la API de JSON-Server.
    obtenerPlatos();
};

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll(`.d-none`);
    seccionesOcultas.forEach(seccion => seccion.classList.remove(`d-none`));
};

function obtenerPlatos() {
    const url = `http://localhost:4000/platillos`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatos(resultado))
        .catch(error => console.log(error));
};

function mostrarPlatos(platos) {

    const contenido = document.querySelector(`#platillos .contenido`);

    platos.forEach(plato => {
        
        const row = document.createElement(`div`);
        row.classList.add(`row`, `py-3`, `border-top`);
        
        const nombre = document.createElement(`div`);
        nombre.classList.add(`col-md-4`);
        nombre.textContent = plato.nombre;

        const precio = document.createElement(`div`);
        precio.classList.add(`col-md-3`, `fw-bold`);
        precio.textContent = `$${plato.precio}`;

        const categoria = document.createElement(`div`);
        categoria.classList.add(`col-md-3`);
        categoria.textContent = categorias[plato.categoria]; 

        const inputCantidad = document.createElement(`input`);
        inputCantidad.type = `number`;
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${plato.id}`;
        inputCantidad.classList.add(`form-control`);

        //Detectar canmtidades y platos agregados.
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlato({...plato, cantidad});
        };

        const agregar = document.createElement(`div`);
        agregar.classList.add(`col-md-2`);
        agregar.appendChild(inputCantidad);
        
        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);

    });

};

function agregarPlato(producto) {

    //Extraer pedido actual.
    let { pedido } = cliente;

    //Verificar cantidad mayor a cero.
    if(producto.cantidad > 0) {

        //Comprobar elemento existente en el array.
        if(pedido.some(articulo => articulo.id === producto.id)) {
            
            const pedidoActualizado = pedido.map(articulo => {

                if(articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });

            cliente.pedido = [...pedidoActualizado];

        } else {
            cliente.pedido = [...pedido, producto];
        };
        
    } else {

        //Eliminar elementos cuando la cantidad sea cero.
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];

    };

    //Limpiar HTML previo.
    limpiarHTML();

    if(cliente.pedido.length) {
        //Mostrar el resumen.
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    };

};

function actualizarResumen(){

    const contenido = document.querySelector(`#resumen .contenido`);
    const resumen = document.createElement(`div`);
    resumen.classList.add(`col-md-6`, `card`, `py-2`, `px-3`, `shadow`);

    //Información de la mesa.
    const mesa = document.createElement(`p`);
    mesa.textContent = `Mesa: `;
    mesa.classList.add(`fw-bold`);

    const mesaSpan = document.createElement(`span`);
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add(`fw-normal`);
    

    //Información de la hora.
    const hora = document.createElement(`p`);
    hora.textContent = `Mesa: `;
    hora.classList.add(`fw-bold`);

    const horaSpan = document.createElement(`span`);
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add(`fw-normal`);

    //Agregar al elemento padre.
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la sección.
    const heading = document.createElement(`h3`);
    heading.textContent = `Platos consumidos`;
    heading.classList.add(`my-4`, `text-center`);

    //Iterar sobre el array de pedidos.
    const grupo = document.createElement(`ul`);
    grupo.classList.add(`list-group`);

    const {pedido} = cliente;
    pedido.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo;
        const lista = document.createElement(`li`);
        lista.classList.add(`list-group-item`);

        //Nombre del artículo.
        const nombreEl = document.createElement(`h4`);
        nombreEl.classList.add(`my-4`);
        nombreEl.textContent = nombre;

        //Cantidad del artículo.
        const cantidadEl = document.createElement(`p`);
        cantidadEl.classList.add(`fw-bold`);
        cantidadEl.textContent = `Cantidad: `;

        const cantidadValor = document.createElement(`span`);
        cantidadValor.classList.add(`fw-normal`);
        cantidadValor.textContent = cantidad;

        //Precio del artículo.
        const precioEl = document.createElement(`p`);
        precioEl.classList.add(`fw-bold`);
        precioEl.textContent = `Precio: `;

        const precioValor = document.createElement(`span`);
        precioValor.classList.add(`fw-normal`);
        precioValor.textContent = `$${precio}`;

        //Subtotal del artículo.
        const subtotalEl = document.createElement(`p`);
        subtotalEl.classList.add(`fw-bold`);
        subtotalEl.textContent = `Subtotal: `;

        const subtotalValor = document.createElement(`span`);
        subtotalValor.classList.add(`fw-normal`);
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        //Boton para eliminar.
        const btnEliminar = document.createElement(`button`);
        btnEliminar.classList.add(`btn`, `btn-danger`);
        btnEliminar.textContent = `Eliminar del pedido`;

        //Agregar valores a sus contenedores.
        cantidadEl.appendChild(cantidadValor);3
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        //Funcion para eliminar del pedido.
        btnEliminar.onclick = function() {
            eliminarProducto(id)
        };

        //Agregar elementos al LI.
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        //Agregar lista al grupo principal.
        grupo.appendChild(lista);
    });

    //Agregar el contenido.
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar formulario de propinas.
    formularioPropinas();

};

function limpiarHTML() {

    const contenido = document.querySelector(`#resumen .contenido`);

    while(contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    };

};

function calcularSubtotal(precio, cantidad){
    return `$${precio * cantidad}`;
};

function eliminarProducto(id) {
    
    const {pedido} = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];
    limpiarHTML();
    
    if(cliente.pedido.length) {
        //Mostrar el resumen.
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    };

    //Regresar a 0 los inputs del formulario.
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;

};

function mensajePedidoVacio() {
    
    const contenido = document.querySelector(`#resumen .contenido`);

    const texto = document.createElement(`p`);
    texto.classList.add(`text-center`);
    texto.textContent = `Añade platos al pedido`;

    contenido.appendChild(texto);

};

function formularioPropinas() {

    const contenido = document.querySelector(`#resumen .contenido`);

    const formulario = document.createElement(`div`);
    formulario.classList.add(`col-md-6`, `formulario`);

    const divFormulario = document.createElement(`div`);
    divFormulario.classList.add(`card`, `py-2`, `px-3`, `shadow`)

    const heading = document.createElement(`h3`);
    heading.classList.add(`my-4`, `text-center`);
    heading.textContent = `Propina`;

    //Radio button 10%
    const radio10 = document.createElement(`input`);
    radio10.type = `radio`;
    radio10.name = `propina`;
    radio10.value = "10";
    radio10.classList.add(`form-check-input`);
    radio10.onclick = calcularPropina;

    const radio10label = document.createElement(`label`);
    radio10label.textContent = `10%`;
    radio10label.classList.add(`crom-check-label`);

    const radio10div = document.createElement(`div`);
    radio10div.classList.add(`form-check`);

    radio10div.appendChild(radio10);
    radio10div.appendChild(radio10label);

    //Radio button 25%
    const radio25 = document.createElement(`input`);
    radio25.type = `radio`;
    radio25.name = `propina`;
    radio25.value = "25";
    radio25.classList.add(`form-check-input`);
    radio25.onclick = calcularPropina;

    const radio25label = document.createElement(`label`);
    radio25label.textContent = `25%`;
    radio25label.classList.add(`crom-check-label`);

    const radio25div = document.createElement(`div`);
    radio25div.classList.add(`form-check`);

    radio25div.appendChild(radio25);
    radio25div.appendChild(radio25label);

    //Radio button 50%
    const radio50 = document.createElement(`input`);
    radio50.type = `radio`;
    radio50.name = `propina`;
    radio50.value = "50";
    radio50.classList.add(`form-check-input`);
    radio50.onclick = calcularPropina;

    const radio50label = document.createElement(`label`);
    radio50label.textContent = `50%`;
    radio50label.classList.add(`crom-check-label`);

    const radio50div = document.createElement(`div`);
    radio50div.classList.add(`form-check`);

    radio50div.appendChild(radio50);
    radio50div.appendChild(radio50label);


    //Agregar al Div principal.
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10div);
    divFormulario.appendChild(radio25div);
    divFormulario.appendChild(radio50div);

    //Agregarlo al formulario.
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);

};

function calcularPropina() {

    const {pedido} = cliente;
    let subtotal = 0;

    //Calcular el subtotal a pagar.
    pedido.forEach(articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    //Seleccionar el radio button con la propina.
    const propinaSeleccionada = document.querySelector(`[name="propina"]:checked`).value;

    //Calcular la propina.
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);

    //Calcular el total a pagar.
    const total = subtotal + propina;

    mostrarTotalHTML(subtotal, total, propina);

};

function mostrarTotalHTML(subtotal, total, propina) {

    const divTotales = document.createElement(`div`);
    divTotales.classList.add(`total-pagar`, `my-5`);

    //Subtotal
    const subtotalParrafo = document.createElement(`p`);
    subtotalParrafo.classList.add(`fs-4`, `fw-bold`, `mt-2`);
    subtotalParrafo.textContent = `Subtotal consumo: `;

    const subtotalSpan = document.createElement(`span`);
    subtotalSpan.classList.add(`fw-normal`);
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina
    const propinaParrafo = document.createElement(`p`);
    propinaParrafo.classList.add(`fs-4`, `fw-bold`, `mt-2`);
    propinaParrafo.textContent = `Propina: `;

    const propinaSpan = document.createElement(`span`);
    propinaSpan.classList.add(`fw-normal`);
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    //Total
    const totalParrafo = document.createElement(`p`);
    totalParrafo.classList.add(`fs-4`, `fw-bold`, `mt-2`);
    totalParrafo.textContent = `Total: `;

    const totalSpan = document.createElement(`span`);
    totalSpan.classList.add(`fw-normal`);
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);


    //Eliminar último resultado.
    const totalPagarDiv = document.querySelector(`.total-pagar`);
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector(`.formulario`);
    formulario.appendChild(divTotales);

};