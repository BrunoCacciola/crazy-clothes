let carrito = [];
const telefonoWhatsApp = "541158980778";

function agregarAlCarrito(nombre, precio, idTalle) {
    const talleSeleccionado = document.getElementById(idTalle).value;
    
    const producto = {
        nombre: nombre,
        precio: precio,
        talle: talleSeleccionado,
        cantidad: 1
    };

    carrito.push(producto);
    actualizarContador();
    alert(`¡${nombre} (Talle ${talleSeleccionado}) agregado al carrito!`);
}

function actualizarContador() {
    document.getElementById('cart-count').innerText = carrito.length;
}

function abrirCarrito() {
    const modal = document.getElementById('cart-modal');
    const listaItems = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    
    modal.style.display = "block";
    listaItems.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        listaItems.innerHTML += `
            <div class="cart-item">
                <p><strong>${item.nombre}</strong> (Talle: ${item.talle}) - $${item.precio}</p>
            </div>
        `;
    });

    totalDisplay.innerText = total;
}

function cerrarCarrito() {
    document.getElementById('cart-modal').style.display = "none";
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let mensaje = "¡Hola Crazy Clothes! 👋 Me interesa este pedido:\n\n";
    let total = 0;

    carrito.forEach((item) => {
        mensaje += `- ${item.nombre} (Talle: ${item.talle}) - $${item.precio}\n`;
        total += item.precio;
    });

    mensaje += `\n💰 *Total: $${total}*`;
    mensaje += `\n\n¿Tienen stock para coordinar la entrega?`;

    const url = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

window.onclick = function(event) {
    let modal = document.getElementById('cart-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}