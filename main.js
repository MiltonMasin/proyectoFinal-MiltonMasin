let carritoVisible = false;

// Esperamos a que todos los elementos de la página carguen para ejecutar el script
$(document).ready(function () {
    $('.btn-eliminar').click(eliminarItemCarrito);
    $('.sumar-cantidad').click(sumarCantidad);
    $('.restar-cantidad').click(restarCantidad);
    $('.boton-item').click(agregarAlCarritoClicked);
    $('.btn-pagar').click(pagarClicked);

    cargarProductosDesdeLocalStorage();
});
// Eliminar todos los elementos del carrito y ocultarlo
function pagarClicked() {
    // Elimino todos los elementos del carrito
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild)
    }
    actualizarTotalCarrito();
    ocultarCarrito();

    // Limpio el carrito en localStorage
    localStorage.removeItem('carritoProductos');
}

// Función que controla el botón clickeado de agregar al carrito
function agregarAlCarritoClicked(event) {
    let button = event.target;
    let item = button.parentElement;
    let titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    let precio = item.getElementsByClassName('precio-item')[0].innerText;
    let imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);

    hacerVisibleCarrito();
}

// Función que hace visible el carrito
function hacerVisibleCarrito() {
    carritoVisible = true;
    let carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    let items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}


function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    let item = document.createElement('div');
    item.classList.add('item');
    let itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    // Controlamos que el item que intenta ingresar no se encuentre en el carrito
    let nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (let i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText == titulo) {
            return; // No agregamos duplicados
        }
    }

    let itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <p class="carrito-item-titulo">${titulo}</p>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <p class="carrito-item-precio">${precio}</p>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

  
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    
    let botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);

  
    let botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    
    actualizarTotalCarrito();

    // Guardar el carrito actualizado en localStorage
    guardarCarritoEnLocalStorage();
}

// Aumento en uno la cantidad del elemento seleccionado
function sumarCantidad(event) {
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();

    // Guardar el carrito actualizado en localStorage
    guardarCarritoEnLocalStorage();
}

// Resto en uno la cantidad del elemento seleccionado
function restarCantidad(event) {
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    } else {
        // Eliminar el elemento del carrito si la cantidad es 0
        eliminarItemCarrito(event);
    }
}

// Eliminar el item seleccionado del carrito
function eliminarItemCarrito(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    // Actualizamos el total del carrito
    actualizarTotalCarrito();

    // La siguiente función controla si hay elementos en el carrito, si no hay lo oculto
    ocultarCarrito();

    // Guardar el carrito actualizado en localStorage
    guardarCarritoEnLocalStorage();
}

// Función que controla si hay elementos en el carrito. Si no hay, oculta el carrito.
function ocultarCarrito() {
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        let carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        let items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

// Actualizamos el total de Carrito
function actualizarTotalCarrito() {
    // Seleccionamos el contenedor carrito
    let carritoContenedor = document.getElementsByClassName('carrito')[0];
    let carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    let total = 0;
    // Recorremos cada elemento del carrito para actualizar el total
    for (let i = 0; i < carritoItems.length; i++) {
        let item = carritoItems[i];
        let precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        // Quitamos el símbolo peso y el punto de milesimos.
        let precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        let cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        let cantidad = cantidadItem.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100) / 100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ",00";

    // Guardar el total del carrito en localStorage (opcional)
    localStorage.setItem('carritoTotal', total);
}

function cargarProductosDesdeAPI() {
    fetch('productos.json') // Ajusta la ruta de la API según la ubicación de tu archivo productos.json
        .then(response => response.json())
        .then(data => {
            // Limpia el carrito actual
            let carritoItems = document.getElementsByClassName('carrito-items')[0];
            while (carritoItems.hasChildNodes()) {
                carritoItems.removeChild(carritoItems.firstChild);
            }

            // Agrega los productos desde la API al carrito
            data.forEach(producto => {
                agregarItemAlCarrito(producto.titulo, producto.precio, producto.imagenSrc);
            });

            // Actualiza el total del carrito
            actualizarTotalCarrito();
        })
        .catch(error => {
            console.error('Error al cargar productos desde la API:', error);
        });
}

// Cargar productos desde localStorage al cargar la página
function cargarProductosDesdeLocalStorage() {
    const carritoProductos = JSON.parse(localStorage.getItem('carritoProductos'));
    if (carritoProductos && carritoProductos.length > 0) {
        carritoProductos.forEach(producto => {
            agregarItemAlCarrito(producto.titulo, producto.precio, producto.imagenSrc);
        });
    } else {
        // Si no hay datos en el almacenamiento local, cargar desde la API
        cargarProductosDesdeAPI();
    }

    const carritoTotal = localStorage.getItem('carritoTotal');
    if (carritoTotal) {
        document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + parseFloat(carritoTotal).toLocaleString("es") + ",00";
    }
}


// Guardar el carrito actualizado en localStorage
function guardarCarritoEnLocalStorage() {
    const carritoItems = document.getElementsByClassName('carrito-items')[0].children;
    const carritoProductos = [];

    for (let i = 0; i < carritoItems.length; i++) {
        const item = carritoItems[i];
        const titulo = item.querySelector('.carrito-item-titulo').textContent;
        const precio = parseFloat(item.querySelector('.carrito-item-precio').textContent.replace('$', ''));
        const imagenSrc = item.querySelector('img').src;

        carritoProductos.push({ titulo, precio, imagenSrc });
    }

    localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos));
}

// Obtener elementos del DOM
const inputBusqueda = document.getElementById('busqueda-input');
const botonBusqueda = document.getElementById('buscar-btn');
const contenedorItems = document.querySelector('.contenedor-items');
const items = contenedorItems.getElementsByClassName('item');

// Función para mostrar todos los productos
function mostrarTodosLosProductos() {
    for (const item of items) {
        item.style.display = 'block';
    }
}

// Manejar la búsqueda cuando se hace clic en el botón
botonBusqueda.addEventListener('click', () => {
    const textoBusqueda = inputBusqueda.value.toLowerCase();

    // Recorrer los elementos y mostrar solo los que coincidan con la búsqueda
    for (const item of items) {
        const tituloItem = item.querySelector('.titulo-item').textContent.toLowerCase();
        if (tituloItem.includes(textoBusqueda)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    }
});

// Manejar la búsqueda en tiempo real mientras se escribe en el campo
inputBusqueda.addEventListener('input', () => {
    const textoBusqueda = inputBusqueda.value.toLowerCase();

    if (textoBusqueda === '') {
        mostrarTodosLosProductos();
    } else {
        // Recorrer los elementos y mostrar solo los que coincidan con la búsqueda
        for (const item of items) {
            const tituloItem = item.querySelector('.titulo-item').textContent.toLowerCase();
            if (tituloItem.includes(textoBusqueda)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    }
});

