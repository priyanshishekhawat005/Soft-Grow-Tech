document.addEventListener('DOMContentLoaded', function () {
  var shell = document.querySelector('[data-product-shell]');
  if (!shell || !window.Store) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var product = window.Store.getProductById(id);

  if (!product) {
    shell.innerHTML = '<div class="product-info"><h2>Product not found</h2><p>Please return to the products page and choose an available item.</p><a class="btn btn-primary" href="products.html">Browse products</a></div>';
    return;
  }

  shell.innerHTML =
    '<div class="product-image reveal">' +
    '<img src="' + product.image + '" alt="' + product.name + '">' +
    '</div>' +
    '<article class="product-info reveal reveal-delay-1">' +
    '<h1>' + product.name + '</h1>' +
    '<p class="card-meta">' + product.category + ' | ' + product.rating + ' stars</p>' +
    '<p>' + product.description + '</p>' +
    '<h3 class="card-price">' + window.Store.formatCurrency(product.price) + '</h3>' +
    '<h4>Highlights</h4>' +
    '<ul class="feature-list">' + product.features.map(function (feature) {
      return '<li>' + feature + '</li>';
    }).join('') + '</ul>' +
    '<div style="margin-top: 1rem;" class="actions">' +
    '<button class="btn btn-primary" data-add-product>Add to cart</button>' +
    '<a class="btn btn-secondary" href="products.html">Back to products</a>' +
    '</div>' +
    '</article>';

  var addButton = shell.querySelector('[data-add-product]');
  addButton.addEventListener('click', function () {
    window.Store.addToCart(product.id, 1);
    addButton.textContent = 'Added to cart';
    setTimeout(function () {
      addButton.textContent = 'Add to cart';
    }, 900);
  });
});
