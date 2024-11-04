import { Carrito } from './Carrito.js';

document.addEventListener('DOMContentLoaded', function (event) {
    const carrito = new Carrito();

    const cTabla = document.getElementById("cuerpoTabla");
    const tCarrito = document.getElementById('totalCarrito');
    const contenedorCesta = document.getElementById('cesta');

    function cargarTabla(stock) {
        cTabla.innerHTML = '';
        stock.productos.forEach(producto => {
            const nombre = document.createElement('td');
            nombre.innerText = producto.nombre;

            const cantidad = document.createElement('td');
            const bMas = document.createElement('button');
            bMas.innerText = '+';
            bMas.dataset.sku = producto.sku;
            bMas.addEventListener('click', function () {
                carrito.pUpdate(producto.sku, 1);
                actualizarCesta();
                actualizarTabla();
            });

            const bMenos = document.createElement('button');
            bMenos.innerText = '-';
            bMenos.dataset.sku = producto.sku;
            bMenos.addEventListener('click', function () {
                carrito.pUpdate(producto.sku, -1);
                actualizarCesta();
                actualizarTabla();
            });

            const cantidadTexto = document.createElement('span');
            cantidadTexto.id = `cantidad-${producto.sku}`;
            cantidadTexto.classList.add('cantidad');
            cantidadTexto.innerText = '0';

            cantidad.appendChild(bMenos);
            cantidad.appendChild(cantidadTexto);
            cantidad.appendChild(bMas);

            const prUnidad = document.createElement('td');
            prUnidad.innerText = producto.precio;

            const totalUnidad = document.createElement('td');
            totalUnidad.classList.add('total');
            totalUnidad.innerText = '0.00 €';

            const tr = document.createElement('tr');
            tr.setAttribute('data-sku', producto.sku);
            tr.append(nombre, cantidad, prUnidad, totalUnidad);
            cTabla.append(tr);
        });
    }

    function actualizarCesta() {
        tCarrito.innerText = carrito.cTotal();
        const productosEnCesta = carrito.productos.filter(producto => producto.cantidad > 0);
        const cestaProductos = document.createElement('div');
        
        productosEnCesta.forEach(producto => {
            const itemCesta = document.createElement('p');
            itemCesta.innerText = `${producto.nombre} x${producto.cantidad}`;
            cestaProductos.appendChild(itemCesta);
        });

        const contenedorProductosCesta = contenedorCesta.querySelector('#productosCesta');
        if (contenedorProductosCesta) {
            contenedorCesta.removeChild(contenedorProductosCesta);
        }
        
        cestaProductos.id = 'productosCesta';
        contenedorCesta.insertBefore(cestaProductos, tCarrito.parentElement);
    }

    function actualizarTabla() {
        const filas = cTabla.querySelectorAll('tr[data-sku]');
        filas.forEach(fila => {
            const sku = fila.getAttribute('data-sku');
            const pInfo = carrito.pInfo(sku);
            if (pInfo) {
                fila.querySelector('.cantidad').innerText = pInfo.cantidad;
                fila.querySelector('.total').innerText = `${pInfo.total.toFixed(2)} €`;
            } else {
                fila.querySelector('.cantidad').innerText = '0';
                fila.querySelector('.total').innerText = '0.00 €';
            }
        });
    }

    fetch('https://jsonblob.com/api/1297225606348267520')
    .then(response => response.json())
    .then(stock => {
        carrito.cargarProductos(stock.productos);
        cargarTabla(stock);
    });

})
