(function () {
  var CART_KEY = 'shoplio_cart';

  function getProducts() {
    return window.PRODUCTS || [];
  }

  function getProductById(productId) {
    return getProducts().find(function (item) {
      return item.id === productId;
    });
  }

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Unable to parse cart data', error);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(productId, quantity) {
    var qty = Number(quantity) || 1;
    var cart = getCart();
    var existing = cart.find(function (item) {
      return item.productId === productId;
    });

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ productId: productId, quantity: qty });
    }

    saveCart(cart);
  }

  function removeFromCart(productId) {
    var filtered = getCart().filter(function (item) {
      return item.productId !== productId;
    });
    saveCart(filtered);
  }

  function setCartQuantity(productId, quantity) {
    var cart = getCart();
    var target = cart.find(function (item) {
      return item.productId === productId;
    });

    if (!target) {
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    target.quantity = quantity;
    saveCart(cart);
  }

  function getCartCount() {
    return getCart().reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  function updateCartCount() {
    var count = getCartCount();
    var nodes = document.querySelectorAll('[data-cart-count]');
    nodes.forEach(function (node) {
      node.textContent = count;
    });
  }

  document.addEventListener('DOMContentLoaded', updateCartCount);

  window.Store = {
    getProducts: getProducts,
    getProductById: getProductById,
    getCart: getCart,
    saveCart: saveCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    setCartQuantity: setCartQuantity,
    getCartCount: getCartCount,
    formatCurrency: formatCurrency,
    updateCartCount: updateCartCount
  };
})();
