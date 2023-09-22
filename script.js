const balance = document.getElementById('balance');
const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');
const text = document.getElementById('text');
const editText = document.getElementById('editText');
const amount = document.getElementById('amount');
const editAmount = document.getElementById('editAmount');
const addTransactionBtn = document.getElementById('addTransaction');
const updateTransactionBtn = document.getElementById('updateTransaction');


let incomeArr = [];
let expenseArr = [];

// Fetch contact data when the page loads
window.addEventListener('load', () => {
    axios.get("https://crudcrud.com/api/05f575a992cc4b5fbbc5a2b25e9bb0db/data")
        .then((response) => {
            const responseData = response.data;

            
            responseData.forEach((item) => {
                addTransactionToDOM(item);
                if (item.amount >= 0) {
                    incomeArr.push(item);
                } else {
                    expenseArr.push(item);
                }
            });

        })
        .catch((err) => {
            console.log(err);
        });
});


//Add trasaction to server
addTransactionBtn.addEventListener('click', addTransaction);
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please enter text and amount');
    } 
    else {
        const transaction = {
            id: Math.floor(Math.random() * 100000000),
            text: text.value,
            amount: amount.value
        };
        if (transaction.amount > -1){
            incomeArr.push(transaction);
        } else {
            expenseArr.push(transaction);
        }
        addTransactionToDOM(transaction);
        axios.post("https://crudcrud.com/api/05f575a992cc4b5fbbc5a2b25e9bb0db/data", transaction)
                .then((response) => {
                    console.log(response);
                })
                .catch((err) => {
                    console.log(err);
                })

    }
}

//Add transation to client
function addTransactionToDOM(transaction) {

    const li = document.createElement('li');
    li.setAttribute('id', transaction.id);

    li.innerHTML = `
        <span>* ${transaction.text} - ${Math.abs(transaction.amount)}</span>
        <button class="edit-button" data-id="${transaction.id}">Edit</button>
        <button class="delete-button" data-id="${transaction.id}">Del</button>
    `;

    //Edit button html
    const editButton = li.querySelector('.edit-button');
    editButton.addEventListener('click', handleEditButtonClick);

    //Del button html
    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', handleDeleteButtonClick);

    if(transaction.amount > -1) {
        incomeList.appendChild(li);
    } else {
        expenseList.appendChild(li);
    }

    text.value = '';
    amount.value = '';
    
}

let editItemId = null;
//Edit button function
function handleEditButtonClick(event) {
    console.log("EDIT CLICKED");
    const id = parseInt(event.target.getAttribute('data-id'));
    const LiItem = incomeArr.find(ele => ele.id === id);

    if (!LiItem) {
        const LiItem = expenseArr.find(ele => ele.id == id);
    }

    editText.value = LiItem.text;
    editAmount.value = LiItem.amount;
    editItemId = id; 
    
}

//Delete button function
function handleDeleteButtonClick(event) {
    const deleteButton = event.target;
    const liElement = deleteButton.parentNode;
    const itemId = liElement.getAttribute("data-id");

    const incomeItemIndex = incomeArr.findIndex(item => item.id === itemId);
    const expenseItemIndex = expenseArr.findIndex(item => item.id === itemId);

    //removing from js arrays
    if (incomeItemIndex !== -1) {
        incomeArr.splice(incomeItemIndex, 1);
    } else if (expenseItemIndex !== -1) {
        expenseArr.splice(expenseItemIndex, 1);
    }

    // Remove the <li> element from the DOM
    liElement.remove();

    axios.delete(`https://crudcrud.com/api/05f575a992cc4b5fbbc5a2b25e9bb0db/data/${itemId}`)
        .then((response) => {
        console.log(`Item with ID ${idToDelete} deleted successfully.`);
        })
        .catch((error) => {
        console.error(`Error deleting item with ID ${idToDelete}:`, error);
        });

    // const query = incomeArr[incomeItemIndex];

    // axios.get(`https://crudcrud.com/api/e60ada00f37b47e0a3394901ba7613f2/data/${JSON.stringify(query)}`)
    // .then((response) => {
    //     const result = response.data;
    //     if (result.length > 0) {
    //         const _id = result[0]._id;
    //         console.log(`Found item with _id: ${_id}`);
    //     } else {
    //         console.log(`Item with id ${itemId} not found.`);
    //     }
    //     axios.delete(`https://crudcrud.com/api/e60ada00f37b47e0a3394901ba7613f2/data/${_id}`)
    //         .then((response) => {
    //             console.log(`Item with ID ${idToDelete} deleted successfully.`);
    //         })
    //         .catch((error) => {
    //             console.error(`Error deleting item with ID ${idToDelete}:`, error);
    //     });

    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });

}

//update transation to server
updateTransactionBtn.addEventListener('click', updateTransaction);
function updateTransaction(e){
    e.preventDefault();

    if (editText.value.trim() === '' || editAmount.value.trim() === '') {
        alert('Please enter text and amount');
    } 
    else {
        let item = incomeArr.find(ele => ele.id === editItemId);
        if(!item){
            item = expenseArr.find(ele => ele.id === editItemId);
        }
        if (item) {
            item.text = editText.value;
            item.amount = editAmount.value;
        }
        console.log(item.id);
        addUpdatedTransationToDOM(item);
        axios.put("https://crudcrud.com/api/05f575a992cc4b5fbbc5a2b25e9bb0db/data/", item)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        })
    }

}

//updated transation to client
function addUpdatedTransationToDOM(item) {
    let li;
    if (item.amount > -1) {
        li = document.getElementById(item.id);
    } else {
        li = document.getElementById(item.id);
    }
    

    li.innerHTML = '';
    li.innerHTML = `
        <span> * ${item.text} - ${item.amount}</span>
        <button class="edit-button" data-id="${item.id}">Edit</button>
        <button class="delete-button" data-id="${item.id}">Del</button>
    `;

    //Edit button html
    const editButton = li.querySelector('.edit-button');
    editButton.addEventListener('click', handleEditButtonClick);

    //Del button html
    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', handleDeleteButtonClick);

    editText.value = '';
    editAmount.value = '';
    editItemId = null;
}