// =====================================
// 1. MAHSULOTLAR BAZASI
// =====================================

let mahsulotlar = [
  {
    id: 1,
    nom: "Samsung S24",
    narx: 800,
    category: "Telefon",
    stock: true,
    icon: "📱",
  },
  {
    id: 2,
    nom: "iPhone 15",
    narx: 1200,
    category: "Telefon",
    stock: true,
    icon: "📱",
  },
  {
    id: 3,
    nom: "HP Pavilion",
    narx: 950,
    category: "Noutbuk",
    stock: false,
    icon: "💻",
  },
  {
    id: 4,
    nom: "Lenovo IdeaPad",
    narx: 700,
    category: "Noutbuk",
    stock: true,
    icon: "💻",
  },
  {
    id: 5,
    nom: "LG Monitor",
    narx: 300,
    category: "Monitor",
    stock: true,
    icon: "🖥️",
  },
  {
    id: 6,
    nom: "Mechanical Keyboard",
    narx: 150,
    category: "Aksessuar",
    stock: true,
    icon: "⌨️",
  },
  {
    id: 7,
    nom: "Gaming Mouse",
    narx: 80,
    category: "Aksessuar",
    stock: false,
    icon: "🖱️",
  },
  {
    id: 8,
    nom: "AirPods Pro",
    narx: 250,
    category: "Aksessuar",
    stock: true,
    icon: "🎧",
  },
];

// =====================================
// 2. O'ZGARUVCHILAR
// =====================================

let savatcha = [];

let searchInput = document.querySelector("#searchInput");
let categoryFilter = document.querySelector("#categoryFilter");
let sortFilter = document.querySelector("#sortFilter");
let stockFilter = document.querySelector("#stockFilter");

let productsList = document.querySelector("#productsList");
let productCount = document.querySelector("#productCount");
let emptyMessage = document.querySelector("#emptyMessage");

let cartCount = document.querySelector("#cartCount");
let cartModal = document.querySelector("#cartModal");
let cartItems = document.querySelector("#cartItems");
let cartTotal = document.querySelector("#cartTotal");

// =====================================
// 3. KATEGORIYALARNI CHIQARISH
// =====================================

function kategoriyalarniChiqar() {
  let kategoriyalar = [...new Set(mahsulotlar.map((m) => m.category))];

  categoryFilter.innerHTML = `
    <option value="all">Barcha kategoriyalar</option>

    ${kategoriyalar
      .map(
        (category) => `
          <option value="${category}">
            ${category}
          </option>
        `,
      )
      .join("")}
  `;
}

// =====================================
// 4. MAHSULOTLARNI EKRANGA CHIQARISH
// =====================================

function mahsulotlarniChiqar(data) {
  productCount.textContent = `${data.length} ta mahsulot`;

  emptyMessage.style.display = data.length === 0 ? "block" : "none";

  productsList.innerHTML = data
    .map(
      (m) => `
        <div class="product-card">

          <div class="product-image">
            ${m.icon}
          </div>

          <div class="product-info">

            <p class="product-category">
              ${m.category}
            </p>

            <h3>${m.nom}</h3>

            <div class="product-bottom">

              <span class="product-price">
                $${m.narx}
              </span>

              <button
                class="add-button"
                data-id="${m.id}"
                ${!m.stock ? "disabled" : ""}
              >
                ${m.stock ? "🛒 Qo'shish" : "Mavjud emas"}
              </button>

            </div>

            <p class="stock-text ${!m.stock ? "out" : ""}">
              ${m.stock ? "● Omborda mavjud" : "● Omborda yo'q"}
            </p>

          </div>

        </div>
      `,
    )
    .join("");
}

// =====================================
// 5. QIDIRUV VA FILTER
// =====================================

function filterlash() {
  let natija = [...mahsulotlar];

  // Qidiruv
  let qidiruvSozi = searchInput.value.toLowerCase().trim();

  natija = natija.filter((m) => m.nom.toLowerCase().includes(qidiruvSozi));

  // Kategoriya bo'yicha filter
  let kategoriya = categoryFilter.value;

  if (kategoriya !== "all") {
    natija = natija.filter((m) => m.category === kategoriya);
  }

  // Faqat mavjud mahsulotlar
  if (stockFilter.checked) {
    natija = natija.filter((m) => m.stock);
  }

  // Narx va nom bo'yicha saralash
  let sortValue = sortFilter.value;

  if (sortValue === "low") {
    natija.sort((a, b) => a.narx - b.narx);
  }

  if (sortValue === "high") {
    natija.sort((a, b) => b.narx - a.narx);
  }

  if (sortValue === "name") {
    natija.sort((a, b) => a.nom.localeCompare(b.nom));
  }

  mahsulotlarniChiqar(natija);
}

// =====================================
// 6. SAVATCHAGA MAHSULOT QO'SHISH
// =====================================

function savatchagaQosh(id) {
  let mahsulot = mahsulotlar.find((m) => m.id === id);

  if (!mahsulot || !mahsulot.stock) {
    return;
  }

  let mavjudMahsulot = savatcha.find((m) => m.id === id);

  if (mavjudMahsulot) {
    mavjudMahsulot.soni++;
  } else {
    savatcha.push({
      ...mahsulot,
      soni: 1,
    });
  }

  savatchaniYangilash();
}

// =====================================
// 7. SAVATCHANI YANGILASH
// =====================================

function savatchaniYangilash() {
  // Savatchadagi umumiy mahsulotlar soni
  let soni = savatcha.reduce((sum, m) => sum + m.soni, 0);

  cartCount.textContent = soni;

  // Savatchadagi mahsulotlarni chiqarish
  cartItems.innerHTML = savatcha.length
    ? savatcha
        .map(
          (m) => `
            <div class="cart-item">

              <div>
                <h4>${m.icon} ${m.nom}</h4>
                <p>$${m.narx} × ${m.soni}</p>
              </div>

              <div class="cart-controls">

                <button data-action="minus" data-id="${m.id}">
                  -
                </button>

                <span>${m.soni}</span>

                <button data-action="plus" data-id="${m.id}">
                  +
                </button>

                <button
                  class="remove-button"
                  data-action="remove"
                  data-id="${m.id}"
                >
                  ✕
                </button>

              </div>

            </div>
          `,
        )
        .join("")
    : `<p class="cart-empty">Savatcha hozircha bo'sh.</p>`;

  // Umumiy narx
  let jami = savatcha.reduce((sum, m) => sum + m.narx * m.soni, 0);

  cartTotal.textContent = `$${jami}`;

  // Buyurtma tugmasi
  document.querySelector("#checkoutButton").disabled = savatcha.length === 0;
}

// =====================================
// 8. SAVATCHA SONINI O'ZGARTIRISH
// =====================================

function soniniOzgar(id, action) {
  let mahsulot = savatcha.find((m) => m.id === id);

  if (!mahsulot) return;

  if (action === "plus") {
    mahsulot.soni++;
  }

  if (action === "minus") {
    mahsulot.soni--;

    if (mahsulot.soni <= 0) {
      savatcha = savatcha.filter((m) => m.id !== id);
    }
  }

  savatchaniYangilash();
}

// =====================================
// 9. SAVATCHADAN O'CHIRISH
// =====================================

function savatchadanOchirish(id) {
  savatcha = savatcha.filter((m) => m.id !== id);

  savatchaniYangilash();
}

// =====================================
// 10. EVENTLAR
// =====================================

// Qidiruv
searchInput.addEventListener("input", filterlash);

// Kategoriya
categoryFilter.addEventListener("change", filterlash);

// Saralash
sortFilter.addEventListener("change", filterlash);

// Omborda mavjudligi
stockFilter.addEventListener("change", filterlash);

// Mahsulot qo'shish
productsList.addEventListener("click", (e) => {
  let button = e.target.closest(".add-button");

  if (!button || button.disabled) return;

  let id = Number(button.dataset.id);

  savatchagaQosh(id);
});

// Savatchani ochish
document.querySelector("#cartButton").addEventListener("click", () => {
  cartModal.classList.add("active");
});

// Savatchani yopish
document.querySelector("#closeCart").addEventListener("click", () => {
  cartModal.classList.remove("active");
});

// Modal tashqarisiga bosish
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove("active");
  }
});

// Savatcha ichidagi tugmalar
cartItems.addEventListener("click", (e) => {
  let button = e.target.closest("button");

  if (!button) return;

  let id = Number(button.dataset.id);
  let action = button.dataset.action;

  if (action === "plus" || action === "minus") {
    soniniOzgar(id, action);
  }

  if (action === "remove") {
    savatchadanOchirish(id);
  }
});

// Buyurtma berish
document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (savatcha.length === 0) return;

  alert("Buyurtmangiz qabul qilindi!");

  savatcha = [];

  savatchaniYangilash();

  cartModal.classList.remove("active");
});

// =====================================
// 11. DASTLABKI ISHGA TUSHIRISH
// =====================================

kategoriyalarniChiqar();

mahsulotlarniChiqar(mahsulotlar);

savatchaniYangilash();
