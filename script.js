// Inicializamos el carrito leyendo el localStorage si existe, sino un array vacío
let carrito = JSON.parse(localStorage.getItem('crazy_cart')) || [];
const telefonoWhatsApp = "541158980778";
let notificationTimeout;

// Al cargar cualquier página, actualizamos el numerito del carrito en el header
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorInterfaz();
    
    // Si estamos en el index, cargamos los productos
    const contenedor = document.getElementById('contenedor-productos');
    if (contenedor) {
        cargarProductosIndex(contenedor);
    }
});

function cargarProductosIndex(contenedor) {
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
        });
}

// --- LÓGICA DE PERSISTENCIA (LocalStorage) ---

function guardarCarrito() {
    localStorage.setItem('crazy_cart', JSON.stringify(carrito));
    actualizarContadorInterfaz();
}

function actualizarContadorInterfaz() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = carrito.length;
}

// --- ACCIONES DEL CARRITO ---

function agregarAlCarrito(nombre, precio, idTalle) {
    const selectTalle = document.getElementById(idTalle);
    const talle = selectTalle ? selectTalle.value : "Único";
    
    // Generamos un ID único temporal para poder borrarlo después sin errores
    const producto = { 
        idTemp: Date.now() + Math.random(), 
        nombre, 
        precio, 
        talle 
    };
    
    carrito.push(producto);
    guardarCarrito(); // Persistimos los datos
    mostrarNotificacion(`¡${nombre} agregado!`);
}

function eliminarDelCarrito(idTemp) {
    // Filtramos el array para quitar el producto con ese ID
    carrito = carrito.filter(item => item.idTemp !== idTemp);
    guardarCarrito(); // Guardamos el cambio
    abrirCarrito();   // Refrescamos la vista del modal
}

function abrirCarrito() {
    const modal = document.getElementById('cart-modal');
    const lista = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    
    lista.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = "<p style='text-align:center; padding:20px;'>El carrito está vacío 💨</p>";
    } else {
        carrito.forEach((item) => {
            total += item.precio;
            lista.innerHTML += `
                <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <div>
                        <p><strong>${item.nombre}</strong></p>
                        <small>Talle: ${item.talle} - $${item.precio}</small>
                    </div>
                    <button onclick="eliminarDelCarrito(${item.idTemp})" style="background:none; border:none; color:red; cursor:pointer; font-size:1.2rem;">🗑️</button>
                </div>
            `;
        });
    }

    totalDisplay.innerText = total;
    modal.style.display = "block";
}

// --- NOTIFICACIONES Y WHATSAPP ---

function mostrarNotificacion(mensaje) {
    const notice = document.getElementById('notification-container');
    if (!notice) return;
    notice.innerText = mensaje;
    notice.style.display = 'block';
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => { notice.style.display = 'none'; }, 3000);
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