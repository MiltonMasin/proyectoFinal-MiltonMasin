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

function pagarClicked() {
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    ocultarCarrito();

    localStorage.removeItem('carritoProductos');
}

function agregarAlCarritoClicked(event) {
    let button = event.target;
    let item = button.parentElement;
    let titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    let precio = item.getElementsByClassName('precio-item')[0].innerText;
    let imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
}

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

    let nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (let i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText === titulo) {
            return;
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
    item.getElementsByClassName('restar-cantidad')[0].addEventListener('click', restarCantidad);
    item.getElementsByClassName('sumar-cantidad')[0].addEventListener('click', sumarCantidad);

    actualizarTotalCarrito();
    guardarCarritoEnLocalStorage();
}

function sumarCantidad(event) {
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
    guardarCarritoEnLocalStorage();
}

function restarCantidad(event) {
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    } else {
        eliminarItemCarrito(event);
    }
}

function eliminarItemCarrito(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
    guardarCarritoEnLocalStorage();
}

function ocultarCarrito() {
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount === 0) {
        let carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        let items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

function actualizarTotalCarrito() {
    let carritoContenedor = document.getElementsByClassName('carrito')[0];
    let carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    let total = 0;
    for (let i = 0; i < carritoItems.length; i++) {
        let item = carritoItems[i];
        let precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        let precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        let cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        let cantidad = cantidadItem.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100) / 100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ",00";
    localStorage.setItem('carritoTotal', total);
}

function cargarProductosDesdeLocalStorage() {
    const carritoProductos = JSON.parse(localStorage.getItem('carritoProductos'));
    if (carritoProductos && carritoProductos.length > 0) {
        console.log('Cargando productos desde localStorage:', carritoProductos); // Mensaje de depuración
        carritoProductos.forEach(producto => {
            agregarItemAlCarrito(producto.titulo, producto.precio, producto.imagenSrc);
        });
    } else {
        console.log('No hay productos en localStorage'); // Mensaje de depuración
    }

    const carritoTotal = localStorage.getItem('carritoTotal');
    if (carritoTotal) {
        document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + parseFloat(carritoTotal).toLocaleString("es") + ",00";
    }
}

function guardarCarritoEnLocalStorage() {
    const carritoItems = document.getElementsByClassName('carrito-items')[0].children;
    const carritoProductos = [];

    for (let i = 0; i < carritoItems.length; i++) {
        const item = carritoItems[i];
        const titulo = item.querySelector('.carrito-item-titulo').textContent;
        const precio = parseFloat(item.querySelector('.carrito-item-precio').textContent.replace('$', '').replace(',', ''));
        const imagenSrc = item.querySelector('img').src;

        carritoProductos.push({ titulo, precio, imagenSrc });
    }

    console.log('Guardando productos en localStorage:', carritoProductos); // Mensaje de depuración
    localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos));
}

// Obtener elementos del DOM
const inputBusqueda = document.getElementById('busqueda-input');
const botonBusqueda = document.getElementById('buscar-btn');
const contenedorItems = document.querySelector('.contenedor-items');
const items = contenedorItems.getElementsByClassName('item');

function mostrarTodosLosProductos() {
    for (const item of items) {
        item.style.display = 'block';
    }
}

botonBusqueda.addEventListener('click', () => {
    const textoBusqueda = inputBusqueda.value.toLowerCase();

    for (const item of items) {
        const tituloItem = item.querySelector('.titulo-item').textContent.toLowerCase();
        if (tituloItem.includes(textoBusqueda)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    }
});

inputBusqueda.addEventListener('input', () => {
    const textoBusqueda = inputBusqueda.value.toLowerCase();

    if (textoBusqueda === '') {
        mostrarTodosLosProductos();
    } else {
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
