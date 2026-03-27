let carrito = [];
const telefonoWhatsApp = "541158980778";

function agregarAlCarrito(nombre, precio, idTalle) {
    const talle = document.getElementById(idTalle).value;
    const producto = { nombre, precio, talle };
    
    carrito.push(producto);
    document.getElementById('cart-count').innerText = carrito.length;
    alert("¡Producto agregado!");
}

function abrirCarrito() {
    const modal = document.getElementById('cart-modal');
    const lista = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    
    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        lista.innerHTML += `<p>✅ ${item.nombre} (Talle: ${item.talle}) - $${item.precio}</p>`;
    });

    totalDisplay.innerText = total;
    modal.style.display = "block";
}

function cerrarCarrito() {
    document.getElementById('cart-modal').style.display = "none";
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) return alert("El carrito está vacío");

    let mensaje = "¡Hola Crazy Clothes! 👋 Me interesa este pedido:\n\n";
    let total = 0;

    carrito.forEach((item) => {
        mensaje += `- ${item.nombre} (Talle: ${item.talle}) - $${item.precio}\n`;
        total += item.precio;
    });

    mensaje += `\n💰 *Total: $${total}*`;
    const url = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}