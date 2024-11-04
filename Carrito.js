export class Carrito {
    constructor() {
        this.productos = [];
        this.pOriginal = [];
    }

    cargarProductos(productos) {
        this.pOriginal = productos;
        this.productos = productos.map(producto => ({
            ...producto,
            cantidad: 0,
            total: 0
        }));
    }

    pUpdate(sku, unidades) {
        const pExistente = this.productos.find(producto => producto.sku === sku);
        if (pExistente) {
            pExistente.cantidad = Math.max(pExistente.cantidad + unidades, 0);
            if (pExistente.cantidad === 0) {
                this.productos = this.productos.filter(producto => producto.sku !== sku);
            } else {
                pExistente.total = pExistente.cantidad * pExistente.precio;
            }
        } else if (unidades > 0) {
            const pOrig = this.pOriginal.find(producto => producto.sku === sku);
            if (pOrig) {
                this.productos.push({
                    ...pOrig,
                    cantidad: unidades,
                    total: unidades * pOrig.precio
                });
            }
        }
        this.updateDOM();
    }

    pInfo(sku) {
        return this.productos.find(producto => producto.sku === sku);
    }

    cTotal() {
        let total = 0;
        this.productos.forEach(producto => {
            total += producto.total;
        });
        return `${total.toFixed(2)} €`;
    }

    updateDOM() {
        const tabla = document.getElementById('cuerpoTabla');
        this.productos.forEach(producto => {
            const fila = tabla.querySelector(`[data-sku="${producto.sku}"]`);
            if (fila) {
                fila.querySelector('.cantidad').innerText = producto.cantidad;
                fila.querySelector('.total').innerText = `${producto.total.toFixed(2)} €`;
            }
        });
        document.getElementById('totalCarrito').innerText = this.cTotal();
    }
}
