// Dữ liệu danh sách iPhone (Bạn có thể dễ dàng thêm/sửa giá hoặc link ảnh tại đây)
const products = [
  {
    id: 1,
    name: "iPhone 16 Pro Max",
    spec: "256GB • Titan Sa Mạc",
    price: 34990000,
    image:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=512&hei=512&fmt=png-alpha",
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    spec: "128GB • Titan Tự Nhiên",
    price: 28990000,
    image:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=512&hei=512&fmt=png-alpha",
  },
  {
    id: 3,
    name: "iPhone 16",
    spec: "128GB • Xanh Lưu Ly",
    price: 22990000,
    image:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=512&hei=512&fmt=png-alpha",
  },
  {
    id: 4,
    name: "iPhone 15 Pro Max",
    spec: "256GB • Titan Xanh",
    price: 29490000,
    image:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=512&hei=512&fmt=png-alpha",
  },
  {
    id: 5,
    name: "iPhone 15",
    spec: "128GB • Hồng",
    price: 19490000,
    image:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=512&hei=512&fmt=png-alpha",
  },
  {
    id: 6,
    name: "iPhone 14",
    spec: "128GB • Đêm Xanh Thẳm",
    price: 16990000,
    image:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=512&hei=512&fmt=png-alpha",
  },
];

let cart = [];

// Định dạng tiền tệ VNĐ
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "₫";
}

// Hiển thị danh sách sản phẩm
function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  const noResult = document.getElementById("noResult");
  grid.innerHTML = "";

  if (list.length === 0) {
    noResult.style.display = "block";
    return;
  }

  noResult.style.display = "none";
  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <div>
                <img src="${product.image}" alt="${product.name}">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-spec">${product.spec}</p>
            </div>
            <div>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-btn" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>
        `;
    grid.appendChild(card);
  });
}

// Chức năng tìm kiếm iPhone theo tên hoặc dung lượng/màu sắc
document.getElementById("searchInput").addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase().trim();
  const filtered = products.filter(
    (item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.spec.toLowerCase().includes(keyword),
  );
  renderProducts(filtered);
});

// Thêm vào giỏ hàng
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

// Tăng/giảm số lượng
function changeQuantity(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }
  updateCartUI();
}

// Xóa khỏi giỏ
function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  updateCartUI();
}

// Cập nhật giao diện giỏ hàng
function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQty;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align:center; color:#86868b; padding: 15px 0;">Giỏ hàng đang trống.</p>';
    totalPrice.textContent = "0₫";
    return;
  }

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small style="color:#6e6e73">${formatPrice(item.price)}</small>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Xóa</button>
            </div>
        `;
    cartItems.appendChild(div);
  });

  totalPrice.textContent = formatPrice(total);
}

// Đóng/mở cửa sổ giỏ hàng
function toggleCart() {
  const modal = document.getElementById("cartModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

// Xử lý đặt hàng
function placeOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống. Vui lòng chọn ít nhất 1 chiếc iPhone!");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const total = document.getElementById("totalPrice").textContent;

  const orderSummary = cart
    .map((i) => `- ${i.name} (x${i.quantity})`)
    .join("\n");

  alert(
    `ĐẶT HÀNG THÀNH CÔNG!\n\n` +
      `Khách hàng: ${name}\n` +
      `Số điện thoại: ${phone}\n` +
      `Địa chỉ giao hàng: ${address}\n\n` +
      `Sản phẩm:\n${orderSummary}\n\n` +
      `Tổng thanh toán: ${total}`,
  );

  // Reset giỏ hàng và form sau khi đặt thành công
  cart = [];
  updateCartUI();
  document.getElementById("checkoutForm").reset();
  toggleCart();
}

// Đóng modal khi bấm ra ngoài vùng trắng
window.onclick = function (event) {
  const modal = document.getElementById("cartModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Khởi chạy ban đầu
renderProducts(products);
updateCartUI();
