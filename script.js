const inventoryUrl = "inventory.json";

// ----- SHOP VIEW -----
async function loadShop() {
    const response = await fetch(inventoryUrl);
    const products = await response.json();
    const grid = document.getElementById("productGrid");
    const searchInput = document.getElementById("search");

    function displayProducts(filteredProducts) {
        grid.innerHTML = "";
        filteredProducts.forEach(p => {
            if (p.stock > 0) { // only show in-stock
                const card = document.createElement("div");
                card.className = "product-card";
                card.style.cursor = "pointer"; // make whole card look clickable

                // Click anywhere on card to go to product.html with ID
                card.onclick = () => {
                    window.location.href = `product.html?id=${p.id}`;
                }

                const img = document.createElement("img");
                img.src = p.image;
                img.alt = p.name;

                const name = document.createElement("h3");
                name.textContent = p.name;

                const price = document.createElement("p");
                price.textContent = `$${p.price.toFixed(2)}`;

                const stock = document.createElement("p");
                stock.textContent = `In Stock: ${p.stock}`;

                const cash = document.createElement("p");
                cash.textContent = "Cash Only";

                card.appendChild(img);
                card.appendChild(name);
                card.appendChild(price);
                card.appendChild(stock);
                card.appendChild(cash);

                grid.appendChild(card);
            }
        });
    }

    displayProducts(products);

    searchInput.addEventListener("input", () => {
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchInput.value.toLowerCase()) && p.stock > 0
        );
        displayProducts(filtered);
    });
}

// ----- MANAGER LOGIN -----
const managerAccount = { username: "admin", password: "GojoSatoruTheGoat" };

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === managerAccount.username && password === managerAccount.password) {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("inventoryContainer").style.display = "block";
        loadInventory();
    } else {
        alert("Invalid credentials");
    }
}

async function loadInventory() {
    const response = await fetch(inventoryUrl);
    let products = await response.json();
    const grid = document.getElementById("managerGrid");

    function render() {
        grid.innerHTML = "";

        products.forEach((p, index) => {
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>

                <label>Price:</label>
                <input type="number" value="${p.price}" step="0.01" id="price-${index}">

                <label>Stock:</label>
                <input type="number" value="${p.stock}" id="stock-${index}">

                <button onclick="updateProduct(${index})">Save</button>
                <button onclick="deleteProduct(${index})" style="background:red;">Delete</button>
            `;

            grid.appendChild(card);
        });
    }

    // Make functions global
    window.updateProduct = (index) => {
        const newPrice = parseFloat(document.getElementById(`price-${index}`).value);
        const newStock = parseInt(document.getElementById(`stock-${index}`).value);

        products[index].price = newPrice;
        products[index].stock = newStock;

        alert("Updated!");
        render();
    };

    window.deleteProduct = (index) => {
        products.splice(index, 1);
        alert("Deleted!");
        render();
    };

    render();
}

// ----- INIT -----
if (document.getElementById("productGrid")) {
    loadShop();
}