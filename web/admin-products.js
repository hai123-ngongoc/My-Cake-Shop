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
      const data = await response.json();
      console.log('Fetched products data:', data);
      products = Array.isArray(data) ? data : (data.items || []);
    } else {
      console.error('Failed to fetch products, using sample data');
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
      name: 'Product 2',
      description: 'Lorel forum metiu',
      price: 2.30,
      category: 'Món chính',
      quantity: 3,
      imageSrc: './hinh_anh/banh2.jpg'
    },
    {
      id: 3,
      name: 'Product 3',
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
      <img src="${product.imageSrc || './hinh_anh/banh2.jpg'}" alt="${product.name}" class="product-image product-card-image" />
    </div>
    <h3>${product.name || 'Unnamed Product'}</h3>
    <p>${product.description || ''}</p>
    <div class="price">${(product.price || 0).toFixed(2)} USD</div>
    <div class="product-actions">
      <button class="btn-edit edit-product-btn" data-id="${product.id || Date.now()}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="btn-delete delete-product-btn" data-id="${product.id || Date.now()}">
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
    const id = editBtn.getAttribute('data-id'); 
    console.log('Edit button clicked with ID:', id);
    handleEditProduct(id);
  });

  deleteBtn.addEventListener('click', () => {
    handleDeleteProduct(deleteBtn.getAttribute('data-id'));
  });

  return card;
}

function handleEditProduct(productId) {
  console.log('Product ID:', productId);
  console.log('Products array:', products);
  const product = products.find(p => Number(p.id) === Number(productId));
  if (!product) {
    console.error(`Product with ID ${productId} not found in products array`);
    alert('Product not found. Please refresh the page.');
    return;
  }

  const modal = editProductModal;
  modal.querySelector('.name-input').value = product.name || 'Unnamed Product';
  modal.querySelector('.price-input').value = product.price || 0;
  modal.querySelector('.description-input').value = product.description || '';
  
  const quantitySelect = modal.querySelector('.quantity-select');
  const categorySelect = modal.querySelector('.category-select');

  if (quantitySelect) {
    const options = quantitySelect.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === String(product.quantity || 0).padStart(2, '0')) {
        quantitySelect.selectedIndex = i;
        break;
      }
    }
  }

  if (categorySelect) {
    const options = categorySelect.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].textContent === (product.category || 'Bánh ngọt')) {
        categorySelect.selectedIndex = i;
        break;
      }
    }
  }

  const confirmBtn = modal.querySelector('.save-btn');
  if (confirmBtn) {
    confirmBtn.setAttribute('data-id', productId);
    confirmBtn.addEventListener('click', async () => {
      await saveProductChanges(productId);
      hideModal(editProductModal);
    });
  }

  showModal(editProductModal);
}

async function saveProductChanges(productId) {
  const modal = editProductModal;
  const name = modal.querySelector('.name-input').value;
  const price = parseFloat(modal.querySelector('.price-input').value) || 0;
  const description = modal.querySelector('.description-input').value;
  const quantity = parseInt(modal.querySelector('.quantity-select').value) || 0;
  const category = modal.querySelector('.category-select').options[
    modal.querySelector('.category-select').selectedIndex
  ].textContent;

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
      const index = products.findIndex(p => Number(p.id) === Number(productId));
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        renderProducts();
      }
      console.log(`Product with ID ${productId} updated successfully`);
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Failed to update product:', response.status, errorData);
      alert(`Failed to update product: ${errorData.error || 'Server error'}`);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    alert('Error updating product. Please try again later.');
  }
}

function handleDeleteProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Cập nhật nội dung modal với ID sản phẩm
  const deleteModalContent = deleteConfirmationModal.querySelector('.modal-content');
  if (deleteModalContent) {
    deleteModalContent.innerHTML = `
      <h3 class="text-center font-medium mb-2">Notification</h3>
      <p class="text-sm text-center mb-4">Are you sure you want to DELETE "${product.name}"?</p>
      <div class="flex justify-end gap-3">
        <button id="delete-cancel-btn" class="text-purple-600 text-sm">Cancel</button>
        <button id="delete-confirm-btn" class="text-purple-600 text-sm" data-id="${productId}">Confirm</button>
      </div>
    `;
  }

  // Thêm sự kiện cho Cancel button
  const cancelBtn = deleteConfirmationModal.querySelector('#delete-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      hideModal(deleteConfirmationModal);
    });
  }

  // Thêm sự kiện cho Confirm button
  const confirmBtn = deleteConfirmationModal.querySelector('#delete-confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      console.log(`Attempting to delete product with ID: ${productId}`);
      await deleteProduct(productId);
      hideModal(deleteConfirmationModal);
    });
  }

  showModal(deleteConfirmationModal);
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      products = products.filter(p => Number(p.id) !== Number(productId));
      renderProducts();
      updateProductCountDisplay();
      console.log(`Product with ID ${productId} deleted successfully`);
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Failed to delete product:', response.status, errorData);
      alert(`Failed to delete product: ${errorData.error || 'Server error'}`);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting product. Please try again later.');
  }
}

function handleNewProductSubmit() {
  const modal = newProductModal;
  const name = modal.querySelector('input[placeholder="Product name"]')?.value || "New Product";
  const price = parseFloat(modal.querySelector('input[placeholder="Price"]')?.value) || 50;
  const description = modal.querySelector('textarea')?.value || "Product description goes here.";
  
  const quantitySelect = modal.querySelector('select[name="quantity"]');
  const quantity = quantitySelect ? parseInt(quantitySelect.value) : 3;
  
  const categorySelect = modal.querySelector('select[name="category"]');
  const category = categorySelect ? 
    categorySelect.options[categorySelect.selectedIndex].textContent : "Bánh ngọt";
  
  const newProduct = {
    name,
    price,
    description,
    quantity,
    category,
    imageSrc: './hinh_anh/banh2.jpg'
  };
  
  addNewProduct(newProduct);
}

async function addNewProduct(product) {
  try {
    console.log('Sending new product to server:', product);
    
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Server response:', result);
      
      const newProduct = {
        ...product,
        id: result.id || Date.now() 
      };
      
      products.push(newProduct);
      renderProducts();
      updateProductCountDisplay();
      hideModal(newProductModal);
      
      resetNewProductForm();
    } else {
     
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Failed to add product:', response.status, errorData);
      alert(`Failed to add product: ${errorData.error || 'Server error'}`);
    }
  } catch (error) {
    console.error('Error adding product:', error);
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn('Using fallback behavior for local development');
      const newProduct = {
        ...product,
        id: Date.now()
      };
      
      products.push(newProduct);
      renderProducts();
      updateProductCountDisplay();
      hideModal(newProductModal);
      
      resetNewProductForm();
    } else {
      alert('Failed to add product. Please try again later.');
    }
  }
}

function resetNewProductForm() {
  const modal = newProductModal;
  const nameInput = modal.querySelector('input[placeholder="Product name"]');
  const priceInput = modal.querySelector('input[placeholder="Price"]');
  const descriptionInput = modal.querySelector('textarea');
  
  if (nameInput) nameInput.value = '';
  if (priceInput) priceInput.value = '';
  if (descriptionInput) descriptionInput.value = '';
}

function showModal(modal) {
  modal.classList.remove('hidden');
}

function hideModal(modal) {
  modal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Setting up event listeners');
  
  const addProductBtn = document.getElementById('add-product-btn');
  if (addProductBtn) {
    console.log('Add product button found');
    
    const newAddProductBtn = addProductBtn.cloneNode(true);
    addProductBtn.parentNode.replaceChild(newAddProductBtn, addProductBtn);
    
    newAddProductBtn.addEventListener('click', () => {
      console.log('Add product button clicked');
      handleNewProductSubmit();
    });
  } else {
    console.warn('Add product button not found! Check your HTML structure.');
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