
const customersContainer = document.getElementById('customers-container');
const editCustomerModal = document.getElementById('edit-customer-modal'); 
const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
const newCustomerBtn = document.getElementById('new-customer-btn'); 
const editCancelBtn = document.getElementById('edit-cancel-btn'); 
const deleteCancelBtn = document.getElementById('delete-cancel-btn'); 

const nameInput = editCustomerModal.querySelector('input[placeholder="Pedro"]'); 
const emailInput = editCustomerModal.querySelector('input[placeholder="promfig@gmail.com"]'); 
const telephoneInput = editCustomerModal.querySelector('input[placeholder="+35 45788 45676"]'); 
const cityInput = editCustomerModal.querySelector('input[placeholder="Roma de Figueiredo"]'); 
const addressInput = editCustomerModal.querySelector('input[placeholder="Pedro"]'); 
const dobDaySelect = editCustomerModal.querySelectorAll('select')[0]; 
const dobMonthSelect = editCustomerModal.querySelectorAll('select')[1]; 
const dobYearSelect = editCustomerModal.querySelectorAll('select')[2]; 
const sexSelect = editCustomerModal.querySelector('select[class="w-full p-2 border rounded"]'); 
const saveCustomerBtn = editCustomerModal.querySelectorAll('button')[2]; 
const deleteCustomerBtn = deleteConfirmationModal.querySelectorAll('button')[1]; 

let customers = [];
let currentCustomerId = null;


document.addEventListener('DOMContentLoaded', () => {
  fetchCustomers();
  setupEventListeners(); 
  updateCustomerCountDisplay(); 
  populateDropdowns();
});

function setupEventListeners() {
  
  newCustomerBtn.addEventListener('click', () => {
    currentCustomerId = null;
    clearCustomerForm(); 
    showModal(editCustomerModal); 
  });

  editCancelBtn.addEventListener('click', () => {
    hideModal(editCustomerModal); 
  });
  
  
  deleteCancelBtn.addEventListener('click', () => {
    hideModal(deleteConfirmationModal);
  });
  
 
  saveCustomerBtn.addEventListener('click', saveCustomer);
  
  
  deleteCustomerBtn.addEventListener('click', deleteCustomer);
  
  window.addEventListener('click', (event) => {
    if (event.target === editCustomerModal) {
      hideModal(editCustomerModal);
    }
    if (event.target === deleteConfirmationModal) {
      hideModal(deleteConfirmationModal);
    }
  });
}

function populateDropdowns() {
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement('option');
    option.value = i < 10 ? `0${i}` : `${i}`;
    option.textContent = i;
    dobDaySelect.appendChild(option);
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = index < 9 ? `0${index + 1}` : `${index + 1}`;
    option.textContent = month;
    dobMonthSelect.appendChild(option);
  });

  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 100; i <= currentYear; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    dobYearSelect.appendChild(option);
  }
}

function clearCustomerForm() {
  nameInput.value = '';
  emailInput.value = '';
  telephoneInput.value = '';
  cityInput.value = '';
  addressInput.value = '';
  dobDaySelect.selectedIndex = 0;
  dobMonthSelect.selectedIndex = 0;
  dobYearSelect.selectedIndex = 0;
  sexSelect.selectedIndex = 0;
}

function updateCustomerCountDisplay() {
  const customerCountElement = document.querySelector('.bg-amber-200');
  if (customerCountElement) {
    customerCountElement.textContent = customers.length;
  }
}

async function fetchCustomers() {
  try {
    const response = await fetch('/api/customers');
    if (response.ok) {
      customers = await response.json();
    } else {
      customers = getSampleCustomers();
    }
    renderCustomers();
    updateCustomerCountDisplay(); 
  } catch (error) {
    console.error('Error fetching customers:', error);
    
    customers = getSampleCustomers();
    renderCustomers();
    updateCustomerCountDisplay();
  }
}

function getSampleCustomers() {
  return [
    {
      id: "337659701",
      name: 'Customer 1',
      email: 'customer1@example.com',
      telephone: '+1 123 456 7890',
      city: 'New York',
      address: 'Sample Address',
      dateOfBirth: '1980-05-15',
      sex: 'Female',
      totalOrder: 0,
      profileImage: 'hinh_anh/human2.jpg',
      isActive: true
    },
    {
      id: "337659702",
      name: 'Customer 2',
      email: 'customer2@example.com',
      telephone: '+1 987 654 3210',
      city: 'San Francisco',
      address: 'Another Sample Address',
      dateOfBirth: '1990-08-20',
      sex: 'Male',
      totalOrder: 0,
      profileImage: 'hinh_anh/human2.jpg', 
      isActive: false
    }
  ];
}

function renderCustomers() {
  customersContainer.innerHTML = '';
  customers.forEach(customer => {
    const customerCard = document.createElement('div');
    customerCard.classList.add('customer-card');
    customerCard.innerHTML = `
      <div class="customer-card-profile-icon ${customer.isActive ? 'active' : ''}">
        ${customer.isActive ? `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="green" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        ` : ''}
      </div>
      ${customer.profileImage ? `
        <div class="customer-card-image">
          <img src="${customer.profileImage}" alt="${customer.name}" class="w-full h-full object-cover">
        </div>
      ` : ''}
      <div class="customer-card-content">
        <div class="customer-info">
          <div class="customer-card-name">${customer.name}</div>
          <div class="customer-card-id">${customer.id}</div>
        </div>
        <div class="customer-card-actions">
          <div class="customer-card-edit" data-id="${customer.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </div>
          <div class="customer-card-delete" data-id="${customer.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      </div>
    `;
    
    const editBtn = customerCard.querySelector('.customer-card-edit');
    const deleteBtn = customerCard.querySelector('.customer-card-delete');
    
    editBtn.addEventListener('click', () => editCustomer(customer));
    deleteBtn.addEventListener('click', () => confirmDeleteCustomer(customer.id));
    
    customersContainer.appendChild(customerCard);
  });
}

function editCustomer(customer) {
  currentCustomerId = customer.id;
  
  nameInput.value = customer.name;
  emailInput.value = customer.email;
  telephoneInput.value = customer.telephone;
  cityInput.value = customer.city;
  addressInput.value = customer.address;
  
  if (customer.dateOfBirth) {
    const dob = new Date(customer.dateOfBirth);
    dobDaySelect.value = dob.getDate() < 10 ? `0${dob.getDate()}` : `${dob.getDate()}`;
    dobMonthSelect.value = dob.getMonth() < 9 ? `0${dob.getMonth() + 1}` : `${dob.getMonth() + 1}`;
    dobYearSelect.value = dob.getFullYear();
  }
  
  if (customer.sex) {
    sexSelect.value = customer.sex;
  }
  
  showModal(editCustomerModal);
}

function saveCustomer() {
  if (!nameInput.value || !emailInput.value || !telephoneInput.value || !cityInput.value) {
    alert('Please fill in all required fields.');
    return;
  }

  const customerData = {
    name: nameInput.value,
    email: emailInput.value,
    telephone: telephoneInput.value,
    city: cityInput.value,
    address: addressInput.value,
    dateOfBirth: `${dobYearSelect.value}-${dobMonthSelect.value}-${dobDaySelect.value}`,
    sex: sexSelect.value,
    totalOrder: 0, 
    profileImage: 'hinh_anh/human2.jpg',
    isActive: true
  };

  if (currentCustomerId) {
    updateCustomer(currentCustomerId, customerData);
  } else {
    addNewCustomer(customerData);
  }

  hideModal(editCustomerModal);
}

function updateCustomer(id, customerData) {
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...customerData };
    renderCustomers();
    updateCustomerCountDisplay();
  }
}

function addNewCustomer(customerData) {
  const newId = customers.length > 0 ? Math.max(...customers.map(c => parseInt(c.id, 10))) + 1 : 337659701;
  const newCustomer = { id: newId.toString(), ...customerData };
  customers.push(newCustomer);
  renderCustomers();
  updateCustomerCountDisplay();
}

function confirmDeleteCustomer(id) {
  currentCustomerId = id;
  showModal(deleteConfirmationModal);
}

function deleteCustomer() {
  customers = customers.filter(c => c.id !== currentCustomerId);
  renderCustomers();
  updateCustomerCountDisplay();
  hideModal(deleteConfirmationModal);
}

function showModal(modal) {
  modal.classList.remove('hidden');
}

function hideModal(modal) {
  modal.classList.add('hidden');
}