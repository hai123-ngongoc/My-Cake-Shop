
const ordersContainer = document.getElementById('orders-container');
const completeConfirmationModal = document.getElementById('complete-confirmation-modal');
const rejectConfirmationModal = document.getElementById('reject-confirmation-modal');
const completeConfirmBtn = document.getElementById('complete-confirm-btn');
const rejectConfirmBtn = document.getElementById('reject-confirm-btn');
const completeCancelBtn = document.getElementById('complete-cancel-btn');
const rejectCancelBtn = document.getElementById('reject-cancel-btn');
const searchInput = document.querySelector('input[type="text"]');
const filterDatetimeBtn = document.querySelector('button.bg-white.text-gray-800');
const paginationButtons = document.querySelectorAll('.flex.gap-1 button');


let orders = [];
let currentOrderId = null;
let currentPage = 1;
const ordersPerPage = 9;


document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
  setupEventListeners();
  updateOrderCountDisplay();
});

function setupEventListeners() {
 
  completeCancelBtn.addEventListener('click', () => {
    hideModal(completeConfirmationModal);
  });
  
  rejectCancelBtn.addEventListener('click', () => {
    hideModal(rejectConfirmationModal);
  });
  
  completeConfirmBtn.addEventListener('click', () => {
    const orderId = currentOrderId;
    if (orderId) {
      completeOrder(orderId);
    }
    hideModal(completeConfirmationModal);
  });
  
  rejectConfirmBtn.addEventListener('click', () => {
    const orderId = currentOrderId;
    if (orderId) {
      rejectOrder(orderId);
    }
    hideModal(rejectConfirmationModal);
  });
  
 
  window.addEventListener('click', (event) => {
    if (event.target === completeConfirmationModal) {
      hideModal(completeConfirmationModal);
    }
    if (event.target === rejectConfirmationModal) {
      hideModal(rejectConfirmationModal);
    }
  });

  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    filterOrders(searchTerm);
  });

 
  filterDatetimeBtn.addEventListener('click', () => {
    
    alert('Datetime filter functionality to be implemented');
  });

 
  paginationButtons.forEach(button => {
    button.addEventListener('click', () => {
      const page = parseInt(button.textContent);
      if (!isNaN(page)) {
        currentPage = page;
        renderPaginatedOrders();
        updatePaginationButtons();
      }
    });
  });
}

function updateOrderCountDisplay() {
  const orderCountElement = document.querySelector('.bg-amber-200');
  if (orderCountElement) {
    orderCountElement.textContent = orders.length;
  }
}


async function fetchOrders() {
  try {
    const response = await fetch('/api/orders');
    if (response.ok) {
      orders = await response.json();
    } else {
      
      orders = getSampleOrders();
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    orders = getSampleOrders();
  }
  
  renderPaginatedOrders();
  updateOrderCountDisplay();
  updatePaginationButtons();
}


function getSampleOrders() {
  return [
    {
      id: '351',
      date: '05 Feb 2023, 08:28 PM',
      items: [
        {
          id: 1,
          name: 'Vegetable Mixups',
          description: 'Vegetable Fritters with Egg',
          price: 5.30,
          quantity: 1,
          imageSrc: './hinh_anh/banh2.jpg'
        },
        {
          id: 2,
          name: 'Chinese Takeout Disj',
          description: 'Fresh Prawn mix salad',
          price: 5.30,
          quantity: 1,
          imageSrc: './hinh_anh/banh2.jpg'
        }
      ],
      totalItems: 2,
      totalPrice: 11,
      status: 'pending'
    },
    {
      id: '349',
      date: '05 Feb 2023, 08:28 PM',
      items: [
        {
          id: 3,
          name: 'Product 1',
          description: 'Bánh Tacos',
          price: 5.30,
          quantity: 1,
          imageSrc: './hinh_anh/banh2.jpg'
        },
        {
          id: 4,
          name: 'Product 2',
          description: 'Fresh Prawn mix salad',
          price: 5.30,
          quantity: 1,
          imageSrc: './hinh_anh/banh2.jpg'
        }
      ],
      totalItems: 2,
      totalPrice: 11,
      status: 'completed'
    },
    {
      id: '350',
      date: '05 Feb 2023, 08:28 PM',
      items: [
        {
          id: 5,
          name: 'Baked Pasted Dishes',
          description: 'Vegetable Fritters with Egg',
          price: 2.48,
          quantity: 1,
          imageSrc: './hinh_anh/banh2.jpg'
        },
        {
          id: 6,
          name: 'Chinese Takeout Disj',
          description: 'Fresh Prawn mix salad',
          price: 5.30,
          quantity: 1,
          imageSrc: './hinh_anh/banh2.jpg'
        }
      ],
      totalItems: 2,
      totalPrice: 11,
      status: 'rejected',
      rejectionReason: 'Value'
    }
  ];
}

function renderPaginatedOrders() {
  const start = (currentPage - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  const paginatedOrders = orders.slice(start, end);

  ordersContainer.innerHTML = '';
  
  paginatedOrders.forEach(order => {
    const orderCard = createOrderCard(order);
    ordersContainer.appendChild(orderCard);
  });
}


function createOrderCard(order) {
  const card = document.createElement('div');
  card.className = `order-card ${order.status}`; 
  card.dataset.orderId = order.id;
 
  const header = document.createElement('div');
  header.className = 'order-header';
  
  header.innerHTML = `
    <div>
      <div class="order-number">Order #${order.id}</div>
      <div class="order-date">${order.date}</div>
    </div>
    
  `;
  
  card.appendChild(header);
  
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'order-items';
  
  order.items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    
    itemElement.innerHTML = `
      <img src="${item.imageSrc || './hinh_anh/banh2.jpg'}" alt="${item.name}" class="item-image">
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-description">${item.description}</div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="item-quantity">Qty: ${item.quantity}</div>
    `;
    
    itemsContainer.appendChild(itemElement);
  });
  
  card.appendChild(itemsContainer);
  
  const footer = document.createElement('div');
  footer.className = 'order-footer';
  
  let statusHtml = '';
  let actionButtonsHtml = '';
  
  if (order.status === 'completed') {
    statusHtml = `<div class="completed-status">✓ COMPLETED</div>`;
  } else if (order.status === 'rejected') {
    statusHtml = `<div class="rejected-status">✕ REJECTED</div>`;
  } else {
    
    actionButtonsHtml = `
      <div class="order-actions">
        <button class="action-button reject" data-order-id="${order.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button class="action-button approve" data-order-id="${order.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    `;
  }
  
  footer.innerHTML = `
    <div class="order-total">
      <div class="total-label">Total: ${order.totalItems} items</div>
      <div class="total-price">Total Price: $${order.totalPrice}</div>
    </div>
    ${statusHtml}
    ${actionButtonsHtml}
  `;
  
  card.appendChild(footer);
  
  if (order.status === 'rejected' && order.rejectionReason) {
    const rejectionElement = document.createElement('div');
    rejectionElement.className = 'rejection-reason';
    rejectionElement.innerHTML = `
      <div class="rejection-reason-title">Reason for rejection</div>
      <textarea class="rejection-reason-text" readonly>${order.rejectionReason}</textarea>
    `;
    card.appendChild(rejectionElement);
  }
  
  if (order.status === 'pending') {
    const rejectBtn = card.querySelector('.action-button.reject');
    const approveBtn = card.querySelector('.action-button.approve');
    
    rejectBtn.addEventListener('click', () => {
      showRejectConfirmation(order.id);
    });
    
    approveBtn.addEventListener('click', () => {
      showCompleteConfirmation(order.id);
    });
  }
  
  return card;
}


function showCompleteConfirmation(orderId) {
  currentOrderId = orderId;
  showModal(completeConfirmationModal);
}

function showRejectConfirmation(orderId) {
  currentOrderId = orderId;
  showModal(rejectConfirmationModal);
}


async function completeOrder(orderId) {
  try {
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'completed';
      renderPaginatedOrders();
    }
  } catch (error) {
    console.error('Error completing order:', error);
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'completed';
      renderPaginatedOrders();
    }
  }
}


async function rejectOrder(orderId) {
  try {
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'rejected';
      orders[orderIndex].rejectionReason = 'Value';
      renderPaginatedOrders();
    }
  } catch (error) {
    console.error('Error rejecting order:', error);
    
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'rejected';
      orders[orderIndex].rejectionReason = 'Value';
      renderPaginatedOrders();
    }
  }
}

function filterOrders(searchTerm) {
  if (!searchTerm) {
    renderPaginatedOrders();
    return;
  }
  
  const filteredOrders = orders.filter(order => {
   
    if (order.id.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    return order.items.some(item => 
      item.name.toLowerCase().includes(searchTerm) || 
      item.description.toLowerCase().includes(searchTerm)
    );
  });
  
  ordersContainer.innerHTML = '';
  
  if (filteredOrders.length === 0) {
    ordersContainer.innerHTML = '<div class="text-center w-full p-4">No orders found matching your search.</div>';
    return;
  }
  
  filteredOrders.forEach(order => {
    const orderCard = createOrderCard(order);
    ordersContainer.appendChild(orderCard);
  });
}

function showModal(modal) {
  modal.classList.remove('hidden');
}

function hideModal(modal) {
  modal.classList.add('hidden');
  currentOrderId = null; 
}

function updatePaginationButtons() {
  paginationButtons.forEach(button => {
    const page = parseInt(button.textContent);
    if (!isNaN(page)) {
      if (page === currentPage) {
        button.classList.add('bg-gray-800', 'text-white');
        button.classList.remove('text-gray-800');
      } else {
        button.classList.remove('bg-gray-800', 'text-white');
        button.classList.add('text-gray-800');
      }
    }
  });
}