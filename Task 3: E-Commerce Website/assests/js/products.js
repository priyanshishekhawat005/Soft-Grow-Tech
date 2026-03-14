document.addEventListener('DOMContentLoaded', function () {
  var grid = document.querySelector('[data-products-grid]');
  var searchInput = document.querySelector('[data-search]');
  var categorySelect = document.querySelector('[data-category]');
  var sortSelect = document.querySelector('[data-sort]');

  if (!grid || !window.Store) {
    return;
  }

  function getCategories(products) {
    return products.reduce(function (list, item) {
      if (!list.includes(item.category)) {
        list.push(item.category);
      }
      return list;
    }, []);
  }

  function renderCategoryOptions() {
    var categories = getCategories(window.Store.getProducts());
    categorySelect.innerHTML = '<option value="all">All categories</option>' +
      categories.map(function (category) {
        return '<option value="' + category + '">' + category + '</option>';
      }).join('');
  }

  function filterProducts() {
    var products = window.Store.getProducts().slice();
    var query = (searchInput.value || '').trim().toLowerCase();
    var category = categorySelect.value;
    var sortBy = sortSelect.value;

    if (query) {
      products = products.filter(function (item) {
        return item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      });
    }

    if (category !== 'all') {
      products = products.filter(function (item) {
        return item.category === category;
      });
    }

    if (sortBy === 'priceAsc') {
      products.sort(function (a, b) { return a.price - b.price; });
    } else if (sortBy === 'priceDesc') {
      products.sort(function (a, b) { return b.price - a.price; });
    } else if (sortBy === 'ratingDesc') {
      products.sort(function (a, b) { return b.rating - a.rating; });
    }

    renderProducts(products);
  }

  function renderProducts(items) {
    if (!items.length) {
      grid.innerHTML = '<p>No products found. Try adjusting filters.</p>';
      return;
    }

    grid.innerHTML = items
      .map(function (product) {
        return (
          '<article class="card">' +
          '<div class="card-media"><img src="' + product.image + '" alt="' + product.name + '"></div>' +
          '<div class="card-body">' +
          '<h3 class="card-title">' + product.name + '</h3>' +
          '<div class="card-meta">' + product.category + ' | ' + product.rating + ' stars</div>' +
          '<div class="card-price">' + window.Store.formatCurrency(product.price) + '</div>' +
          '<div class="card-actions">' +
          '<a class="btn btn-secondary" href="product.html?id=' + product.id + '">Details</a>' +
          '<button class="btn btn-primary" data-add-id="' + product.id + '">Add to cart</button>' +
          '</div>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    grid.querySelectorAll('[data-add-id]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-add-id');
        window.Store.addToCart(id, 1);
        button.textContent = 'Added';
        setTimeout(function () {
          button.textContent = 'Add to cart';
        }, 900);
      });
    });
  }

  renderCategoryOptions();
  filterProducts();

  [searchInput, categorySelect, sortSelect].forEach(function (el) {
    el.addEventListener('input', filterProducts);
    el.addEventListener('change', filterProducts);
  });
});
