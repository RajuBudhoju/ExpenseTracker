// Get DOM elements
const balance = document.getElementById('balance');
const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const addTransactionBtn = document.getElementById('addTransaction');

// Get transactions from local storage or set to an empty array
const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Function to update the local storage
function updateLocalStorage() {
    axios.post("https://crudcrud.com/api/73074bce4b574e8197c823d7d0ba70cf/appointmentData", transactions)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
}


// Function to add a transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please enter text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
        };

        transactions.push(transaction);

        addTransactionToDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Function to generate a random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}




// Function to add a transaction to the DOM
function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const amountClass = transaction.amount < 0 ? 'expense' : 'income';
    const buttonColorClass = transaction.amount < 0 ? 'red' : 'green';

    const item = document.createElement('li');
    item.setAttribute('data-id', transaction.id);
    item.classList.add(amountClass);

    const transactionText = document.createElement('span');
    transactionText.textContent = transaction.text;
    transactionText.style.color = 'inherit';

    const transactionAmount = document.createElement('span');
    transactionAmount.textContent = `${sign} Rs ${Math.abs(transaction.amount)}`;

    const deleteEditContainer = document.createElement('div');
    deleteEditContainer.className = 'delete-edit-btn-container';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.className = `delete-btn ${buttonColorClass}`;
    deleteButton.onclick = () => removeTransaction(transaction.id);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = `edit-btn ${buttonColorClass}`;
    editButton.onclick = () => editTransaction(transaction.id);

    deleteEditContainer.appendChild(deleteButton);
    deleteEditContainer.appendChild(editButton);

    item.appendChild(transactionText);
    item.appendChild(transactionAmount);
    item.appendChild(deleteEditContainer);

    if (transaction.amount < 0) {
        expenseList.appendChild(item);
    } else {
        incomeList.appendChild(item);
    }
}

// Function to edit a transaction
function editTransaction(id) {
    const transactionIndex = transactions.findIndex(transaction => transaction.id === id);

    if (transactionIndex !== -1) {
        const transaction = transactions[transactionIndex];
        editText.value = transaction.text;
        editAmount.value = Math.abs(transaction.amount);
        editTransactionForm.style.display = 'block';
        updateTransactionBtn.addEventListener('click', () => updateTransaction(id));
    }
}

// Function to update the balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const incomeTotal = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expenseTotal = (
        amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `Rs: ${total}`;
    incomeList.innerText = ''; // Clear the income list
    expenseList.innerText = ''; // Clear the expense list
    transactions.forEach(addTransactionToDOM); // Re-add transactions to the correct lists
}

// Function to remove a transaction by ID
function removeTransaction(id) {
    const transactionIndex = transactions.findIndex(transaction => transaction.id === id);

    if (transactionIndex !== -1) {
        transactions.splice(transactionIndex, 1);
        updateLocalStorage();
        updateValues();
    }
}

function init() {
    axios.get("https://crudcrud.com/api/73074bce4b574e8197c823d7d0ba70cf/appintmentData")
        .then((response) => {
            transactions.length = 0; // Clear the transactions array
            transactions.push(...response.data); // Push data from the server into the array
            transactions.forEach(addTransactionToDOM);
            updateValues();
        })
        .catch((err) => {
            console.log(err);
        });
}
addTransactionBtn.addEventListener('click', addTransaction);




// Variables for edit transaction
const editTransactionForm = document.getElementById('editTransaction');
const editText = document.getElementById('editText');
const editAmount = document.getElementById('editAmount');
const updateTransactionBtn = document.getElementById('updateTransaction');

// Function to display the edit transaction form
function showEditForm(id) {
    const transaction = transactions.find(transaction => transaction.id === id);
    if (transaction) {
        editText.value = transaction.text;
        editAmount.value = Math.abs(transaction.amount);
        editTransactionForm.style.display = 'block';
        updateTransactionBtn.addEventListener('click', () => updateTransaction(id));
    }
}

// Function to hide the edit transaction form
function hideEditForm() {
    editTransactionForm.style.display = 'none';
    editText.value = '';
    editAmount.value = '';
    updateTransactionBtn.removeEventListener('click', updateTransaction);
}

// Function to update a transaction
function updateTransaction(id) {
    const transactionIndex = transactions.findIndex(transaction => transaction.id === id);

    if (transactionIndex !== -1) {
        const updatedText = editText.value.trim();
        const updatedAmount = +editAmount.value;
        if (updatedText !== '' && !isNaN(updatedAmount)) {
            transactions[transactionIndex].text = updatedText;
            transactions[transactionIndex].amount = -Math.abs(updatedAmount); // Ensure the amount is negative for expenses
            updateLocalStorage();
            hideEditForm();
            updateValues();
        }
    }
}

// Event listener to show the edit form
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const id = parseInt(e.target.parentElement.getAttribute('data-id'));
        showEditForm(id);
    }
});

// Event listener to hide the edit form
editTransactionForm.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-edit-form')) {
        hideEditForm();
    }
});

// Initialize the app
init();
