const inventoryUrl = "inventory.json";

// ----- STORAGE SYSTEM -----
async function getProducts() {
    const saved = localStorage.getItem("products");
    if (saved) return JSON.parse(saved);

    const response = await fetch(inventoryUrl);
    const data = await response.json();
    localStorage.setItem("products", JSON.stringify(data));
    return data;
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// ----- SHOP VIEW -----
async function loadShop() {
    const products = await getProducts();
    const grid = document.getElementById("productGrid");
    const searchInput = document.getElementById("search");

    function displayProducts(filteredProducts) {
        grid.innerHTML = "";
        filteredProducts.forEach(p => {
            if (p.stock > 0) {
                const card = document.createElement("div");
                card.className = "product-card";
                card.style.cursor = "pointer";

                card.onclick = () => {
                    window.location.href = `product.html?id=${p.id}`;
                };

                card.innerHTML = `
                    <img src="${p.image}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <p>$${p.price.toFixed(2)}</p>
                    <p>In Stock: ${p.stock}</p>
                    <p>Cash Only</p>
                `;

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

// ----- MANAGER PANEL -----
async function loadInventory() {
    let products = await getProducts();
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

    window.updateProduct = (index) => {
        const newPrice = parseFloat(document.getElementById(`price-${index}`).value);
        const newStock = parseInt(document.getElementById(`stock-${index}`).value);

        products[index].price = newPrice;
        products[index].stock = newStock;

        saveProducts(products); // 🔥 THIS IS THE MAGIC
        alert("Saved!");
        render();
    };

    window.deleteProduct = (index) => {
        products.splice(index, 1);

        saveProducts(products); // 🔥 SAVE AFTER DELETE
        alert("Deleted!");
        render();
    };

    render();
}

// ----- INIT -----
if (document.getElementById("productGrid")) {
    loadShop();
}
