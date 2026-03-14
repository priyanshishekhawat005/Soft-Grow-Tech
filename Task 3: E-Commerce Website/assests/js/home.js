document.addEventListener('DOMContentLoaded', function () {
  var container = document.querySelector('[data-featured-products]');
  if (!container || !window.Store) {
    return;
  }

  var products = window.Store.getProducts().slice(0, 4);

  container.innerHTML = products
    .map(function (product, index) {
      return (
        '<article class="card reveal reveal-delay-' + (index % 3) + '">' +
        '<div class="card-media"><img src="' + product.image + '" alt="' + product.name + '"></div>' +
        '<div class="card-body">' +
        '<h3 class="card-title">' + product.name + '</h3>' +
        '<div class="card-meta">' + product.category + ' | ' + product.rating + ' stars</div>' +
        '<div class="card-price">' + window.Store.formatCurrency(product.price) + '</div>' +
        '<div class="card-actions">' +
        '<a class="btn btn-secondary" href="product.html?id=' + product.id + '">View details</a>' +
        '<button class="btn btn-primary" data-add-id="' + product.id + '">Add to cart</button>' +
        '</div>' +
        '</div>' +
        '</article>'
      );
    })
    .join('');

  container.querySelectorAll('[data-add-id]').forEach(function (button) {
    button.addEventListener('click', function () {
      var productId = button.getAttribute('data-add-id');
      window.Store.addToCart(productId, 1);
      button.textContent = 'Added';
      setTimeout(function () {
        button.textContent = 'Add to cart';
      }, 900);
    });
  });
});
