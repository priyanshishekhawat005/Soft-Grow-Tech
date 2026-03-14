document.addEventListener('DOMContentLoaded', function () {
  var listNode = document.querySelector('[data-cart-items]');
  var subtotalNode = document.querySelector('[data-subtotal]');
  var shippingNode = document.querySelector('[data-shipping]');
  var totalNode = document.querySelector('[data-total]');

  if (!listNode || !window.Store) {
    return;
  }

  function calculate(cartProducts) {
    var subtotal = cartProducts.reduce(function (sum, item) {
      return sum + item.product.price * item.quantity;
    }, 0);
    var shipping = subtotal > 0 ? 9 : 0;
    return {
      subtotal: subtotal,
      shipping: shipping,
      total: subtotal + shipping
    };
  }

  function hydrateCart() {
    var rawCart = window.Store.getCart();
    return rawCart
      .map(function (entry) {
        var product = window.Store.getProductById(entry.productId);
        return product ? { product: product, quantity: entry.quantity } : null;
      })
      .filter(Boolean);
  }

  function render() {
    var cartProducts = hydrateCart();

    if (!cartProducts.length) {
      listNode.innerHTML = '<article class="product-info"><h2>Your cart is empty</h2><p>Add products from the catalog to build your order.</p><a class="btn btn-primary" href="products.html">Go to products</a></article>';
      subtotalNode.textContent = window.Store.formatCurrency(0);
      shippingNode.textContent = window.Store.formatCurrency(0);
      totalNode.textContent = window.Store.formatCurrency(0);
      return;
    }

    listNode.innerHTML = cartProducts
      .map(function (entry) {
        return (
          '<article class="cart-item">' +
          '<img src="' + entry.product.image + '" alt="' + entry.product.name + '">' +
          '<div>' +
          '<h3 class="card-title">' + entry.product.name + '</h3>' +
          '<p class="card-meta">' + window.Store.formatCurrency(entry.product.price) + '</p>' +
          '<div class="qty-wrap">' +
          '<button class="qty-btn" data-dec="' + entry.product.id + '">-</button>' +
          '<strong>' + entry.quantity + '</strong>' +
          '<button class="qty-btn" data-inc="' + entry.product.id + '">+</button>' +
          '<button class="btn btn-secondary" data-remove="' + entry.product.id + '">Remove</button>' +
          '</div>' +
          '</div>' +
          '<strong>' + window.Store.formatCurrency(entry.product.price * entry.quantity) + '</strong>' +
          '</article>'
        );
      })
      .join('');

    var totals = calculate(cartProducts);
    subtotalNode.textContent = window.Store.formatCurrency(totals.subtotal);
    shippingNode.textContent = window.Store.formatCurrency(totals.shipping);
    totalNode.textContent = window.Store.formatCurrency(totals.total);

    bindActions();
  }

  function bindActions() {
    listNode.querySelectorAll('[data-inc]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-inc');
        var row = window.Store.getCart().find(function (item) { return item.productId === id; });
        var nextQty = row ? row.quantity + 1 : 1;
        window.Store.setCartQuantity(id, nextQty);
        render();
      });
    });

    listNode.querySelectorAll('[data-dec]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-dec');
        var row = window.Store.getCart().find(function (item) { return item.productId === id; });
        if (!row) {
          return;
        }
        window.Store.setCartQuantity(id, row.quantity - 1);
        render();
      });
    });

    listNode.querySelectorAll('[data-remove]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-remove');
        window.Store.removeFromCart(id);
        render();
      });
    });
  }

  render();
});
