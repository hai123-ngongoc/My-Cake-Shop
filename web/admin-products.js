
const productsContainer = document.getElementById('products-container');
const editProductModal = document.getElementById('edit-product-modal');
const newProductModal = document.getElementById('new-product-modal');
const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
const newProductBtn = document.getElementById('new-product-btn');
const editCancelBtn = document.getElementById('edit-cancel-btn');
const newCancelBtn = document.getElementById('new-cancel-btn');
const deleteCancelBtn = document.getElementById('delete-cancel-btn');

let products = [];


document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  setupEventListeners();
  updateProductCountDisplay();
});

function setupEventListeners() {
 
  newProductBtn.addEventListener('click', () => {
    showModal(newProductModal);
  });
  

  editCancelBtn.addEventListener('click', () => {
    hideModal(editProductModal);
  });
  
  newCancelBtn.addEventListener('click', () => {
    hideModal(newProductModal);
  });
  
  deleteCancelBtn.addEventListener('click', () => {
    hideModal(deleteConfirmationModal);
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === editProductModal) {
      hideModal(editProductModal);
    }
    if (event.target === newProductModal) {
      hideModal(newProductModal);
    }
    if (event.target === deleteConfirmationModal) {
      hideModal(deleteConfirmationModal);
    }
  });
}


function updateProductCountDisplay() {
  const productCountElement = document.querySelector('.product-count');
  if (productCountElement) {
    productCountElement.textContent = `Total: ${products.length}`;
  }
}


async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    if (response.ok) {
      products = await response.json();
    } else {
      
      products = getSampleProducts();
    }
    renderProducts();
    updateProductCountDisplay();
  } catch (error) {
    console.error('Error fetching products:', error);
    products = getSampleProducts();
    renderProducts();
    updateProductCountDisplay();
  }
}


function getSampleProducts() {
  return [
    {
      id: 1,
      name: 'Product 1',
      description: 'Lorel forum metiu',
      price: 2.30,
      category: 'Bánh ngọt',
      quantity: 2,
      imageSrc: './hinh_anh/banh2.jpg'
    },
    {
      id: 2,
      name: 'Product 1',
      description: 'Lorel forum metiu',
      price: 2.30,
      category: 'Món chính',
      quantity: 3,
      imageSrc: './hinh_anh/banh2.jpg'
    },
    {
      id: 3,
      name: 'Product 1',
      description: 'Lorel forum metiu',
      price: 2.30,
      category: 'Đồ uống',
      quantity: 4,
      imageSrc: './hinh_anh/banh2.jpg'
    }
  ];
}


function renderProducts() {
  productsContainer.innerHTML = '';
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}


function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card product-single-card';
  
  card.innerHTML = `
    <div class="product-image-container">
      <img 
        src="${product.imageSrc || './hinh_anh/banh2.jpg'}" 
        alt="${product.name}" 
        class="product-image product-card-image" 
      />
    </div>
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <div class="price">${product.price.toFixed(2)} USD</div>
    <div class="product-actions">
      <button class="btn-edit edit-product-btn" data-id="${product.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="btn-delete delete-product-btn" data-id="${product.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;
  
  const editBtn = card.querySelector('.edit-product-btn');
  const deleteBtn = card.querySelector('.delete-product-btn');
  
  editBtn.addEventListener('click', () => {
    handleEditProduct(product.id);
  });
  
  deleteBtn.addEventListener('click', () => {
    handleDeleteProduct(product.id);
  });
  
  return card;
}


function handleEditProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
 
  const modal = editProductModal;
  modal.querySelector('h2').textContent = product.name;
  modal.querySelector('.text-3xl').textContent = product.price.toFixed(2);
  

  const descriptionContainer = modal.querySelector('.bg-white.p-3.rounded');
  if (descriptionContainer) {
    descriptionContainer.textContent = product.description;
  }
  
  
  const quantitySelect = modal.querySelector('select:first-of-type');
  const categorySelect = modal.querySelector('select:last-of-type');

  if (quantitySelect) {
    const options = quantitySelect.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === String(product.quantity).padStart(2, '0')) {
        quantitySelect.selectedIndex = i;
        break;
      }
    }
  }
  
  if (categorySelect) {
    const options = categorySelect.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].textContent === product.category) {
        categorySelect.selectedIndex = i;
        break;
      }
    }
  }

  const confirmBtn = modal.querySelector('.bg-red-500.text-white');
  if (confirmBtn) {
    confirmBtn.setAttribute('data-id', productId);
    
    confirmBtn.addEventListener('click', async () => {
      await saveProductChanges(productId);
      hideModal(editProductModal);
    }, { once: true });
  }
  
  showModal(editProductModal);
}

async function saveProductChanges(productId) {
  const modal = editProductModal;
  const name = modal.querySelector('h2').textContent;
  const price = parseFloat(modal.querySelector('.text-3xl').textContent);
  const description = modal.querySelector('.bg-white.p-3.rounded').textContent;
  const quantity = parseInt(modal.querySelector('select:first-of-type').value);
  const category = modal.querySelector('select:last-of-type').value;
  
  const updatedProduct = {
    name,
    price,
    description,
    quantity,
    category
  };
  
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    });
    
    if (response.ok) {
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        renderProducts();
      }
    } else {
      console.error('Failed to update product');
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
}

function handleDeleteProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const confirmBtn = deleteConfirmationModal.querySelector('.text-purple-600.text-sm:last-child');
  if (confirmBtn) {
    confirmBtn.setAttribute('data-id', productId);
  
    confirmBtn.addEventListener('click', async () => {
      await deleteProduct(productId);
      hideModal(deleteConfirmationModal);
    }, { once: true });
  }
  
  showModal(deleteConfirmationModal);
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      
      products = products.filter(p => p.id !== productId);
      renderProducts();
      updateProductCountDisplay(); 
    } else {
      console.error('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

function handleNewProductSubmit() {
  const modal = newProductModal;
  const name = modal.querySelector('input[placeholder="Product name"]')?.value || "Product 1";
  const price = parseFloat(modal.querySelector('input[placeholder="Price"]')?.value || "2.30");
  const description = modal.querySelector('textarea')?.value || "Lorel forum metiu";
  const quantity = parseInt(modal.querySelector('select:first-of-type')?.value || "01");
  const category = modal.querySelector('select:last-of-type')?.value || "Món chính";
  
  const newProduct = {
    name,
    price,
    description,
    quantity,
    category
  };
  
  addNewProduct(newProduct);
}

async function addNewProduct(product) {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    
    if (response.ok) {
    
      product.id = Date.now(); 
      product.imageSrc = './hinh_anh/banh2.jpg'; 
      
      products.push(product);
      renderProducts();
      updateProductCountDisplay(); 
      hideModal(newProductModal);
    } else {
      console.error('Failed to add product');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    
    product.id = Date.now();
    product.imageSrc = './hinh_anh/banh2.jpg';
    products.push(product);
    renderProducts();
    updateProductCountDisplay();
    hideModal(newProductModal);
  }
}

function showModal(modal) {
  modal.classList.remove('hidden');
}

function hideModal(modal) {
  modal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const addProductBtn = newProductModal.querySelector('.bg-red-500.text-white');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', handleNewProductSubmit);
  }
  
  const searchInput = document.querySelector('input[type="text"]');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterProducts(searchTerm);
    });
  }
});

function filterProducts(searchTerm) {
  if (!searchTerm) {
    renderProducts();
    return;
  }
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
  
  productsContainer.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = '<div class="text-center w-full p-4">No products found matching your search.</div>';
    return;
  }
  
  filteredProducts.forEach(product => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}