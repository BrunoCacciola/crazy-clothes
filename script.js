let carrito = [];
const telefonoWhatsApp = "541158980778";
let notificationTimeout;

// 1. CARGA DINÁMICA: Dibuja los productos en el index.html desde el JSON
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return; // Si no estamos en el index, no hace nada

    fetch('productos.json')
        .then(response => response.json())
        .then(productos => {
            contenedor.innerHTML = ""; 
            productos.forEach(p => {
                contenedor.innerHTML += `
                    <div class="product-card">
                        <a href="producto.html?id=${p.id}" style="text-decoration:none; color:inherit;">
                            <div class="img-container">
                                <img src="${p.imagen}" alt="${p.nombre}">
                            </div>
                            <h3>${p.nombre}</h3>
                        </a>
                        <p class="price">$${p.precio}</p>
                        <select id="talle-${p.id}">
                            ${p.talles.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                        <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio}, 'talle-${p.id}')" class="btn-add">
                            Agregar al carrito
                        </button>
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
});

// 2. LÓGICA DEL CARRITO
function agregarAlCarrito(nombre, precio, idTalle) {
    const selectTalle = document.getElementById(idTalle);
    const talle = selectTalle ? selectTalle.value : "Único";
    
    const producto = { nombre, precio, talle };
    carrito.push(producto);
    
    document.getElementById('cart-count').innerText = carrito.length;
    mostrarNotificacion(`¡${nombre} agregado!`);
}

function mostrarNotificacion(mensaje) {
    const notice = document.getElementById('notification-container');
    if (!notice) return;
    
    notice.innerText = mensaje;
    notice.style.display = 'block';

    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notice.style.display = 'none';
    }, 3000);
}

function abrirCarrito() {
    const modal = document.getElementById('cart-modal');
    const lista = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    
    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((item) => {
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