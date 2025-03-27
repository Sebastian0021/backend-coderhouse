const socket = io();
const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  socket.emit("addProduct", {
    title,
    description,
    price,
    code,
    stock,
    category,
  });
  form.reset();
});

const deleteForm = document.getElementById("deleteForm");
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const productId = document.getElementById("productId").value;
  socket.emit("deleteProduct", productId);
  deleteForm.reset();
});

socket.on("products", (products) => {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add(
      "m-4",
      "p-6",
      "max-w-sm",
      "bg-gray-800",
      "rounded-lg",
      "border",
      "border-gray-700",
      "shadow-md"
    );
    productDiv.innerHTML = ` <h5 class="text-xl font-bold
  text-white">${product.title}</h5> <p class="mt-2
  text-gray-400">${product.description}</p> <p class="mt-2
  text-gray-400">Código: ${product.code}</p> <p class="mt-2
  text-gray-400">Precio: ${product.price}</p> <p class="mt-2
  text-gray-400">Estado: ${product.status ? "Disponible" : "Agotado"}</p> <p
  class="mt-2 text-gray-400">Stock: ${product.stock}</p> <p class="mt-2
  text-gray-400">Categoría: ${product.category}</p> `;
    productsContainer.appendChild(productDiv);
  });
});
