let transactions = [
    
];


// Navigation logic
const navItems = document.querySelectorAll(".bottom-nav button");
const screens = document.querySelectorAll(".screen");

navItems.forEach((item)=> {
    item.addEventListener("click",()=>{
        const targetScreen = item.dataset.screen;
        const target = Array.from(screens).find(screen => {
            return screen.id === targetScreen;
        });
        
        screens.forEach((screen)=>{
            screen.classList.remove("active");
        });

        target.classList.add("active");

        navItems.forEach((item)=>{
            item.classList.remove("active");
        });

        item.classList.add("active");

    });
});



// Add transaction screen logic

// Type btn toggle logic
const typeBtns = document.querySelectorAll(".typeBtn");

let transactionType = "expense";

typeBtns.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        typeBtns.forEach((btn)=>{
            btn.classList.remove("active");
        });

        btn.classList.add("active");
        transactionType = btn.dataset.type;
    });
});

// Transaction form validation logic
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const descriptionInput = document.querySelector("#description");
const dateInput = document.querySelector("#date");

const addTransactionBtn = document.querySelector(".addTransactionBtn");

const amountError = document.querySelector(".amountError");
const categoryError = document.querySelector(".categoryError");
const dateError = document.querySelector(".dateError");


const formReset = () =>{
    amountInput.value = "";
    categoryInput.value = "";
    descriptionInput.value = "";
    dateInput.value = "";
    amountValid = false;
    categoryValid = false;
    dateValid = false;
};

let amountValid = false;
amountInput.addEventListener("input", ()=>{
    const amount = Number(amountInput.value);
    if(amount <= 0){
        amountError.style.display = "block";
        amountValid = false;
    }
    else{
        amountError.style.display = "none";
        amountValid = true;
    }
    
});

let categoryValid = false;
categoryInput.addEventListener("change",()=>{
    const category = categoryInput.value;
    if(category === ""){
        categoryError.style.display = "block";
        categoryValid = false;
    }
    else{
        categoryError.style.display = "none";
        categoryValid = true;
    }
});


let dateValid = false;
dateInput.addEventListener("input",()=>{
    const date = dateInput.value;
    if(date === ""){
        dateError.style.display = "block";
        dateValid = false;
    }
    else{
        dateError.style.display = "none";
        dateValid = true;
    }
});


const updateTransaction = (clickedTransaction) =>{
    clickedTransaction.amount = Number(amountInput.value);
    clickedTransaction.category = categoryInput.value;
    clickedTransaction.description = descriptionInput.value;
    clickedTransaction.date = dateInput.value;
    clickedTransaction.type = transactionType;
}

let isEditing = false;


const formatAmount = (amount) =>{
    return amount.toLocaleString("en-IN");
}

const formatDate = (date) =>{
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

const categoryIcons = {
    Food: "fa-utensils",
    Travel: "fa-car",
    Shopping: "fa-bag-shopping",
    Bills: "fa-file-invoice",
    Entertainment: "fa-film",
    Health: "fa-heart-pulse",
    Education: "fa-graduation-cap",
    Other: "fa-ellipsis",
}

const categoryColors = {
    Food: "food",
    Travel: "travel",
    Shopping: "shopping",
    Bills: "bills",
    Entertainment: "entertainment",
    Health: "health",
    Education: "education",
    Other: "other"
};

const createTransactionCard = (transaction) =>{
    const transactionCard = document.createElement("div");
    transactionCard.classList.add("transactionCard");
    transactionCard.dataset.id = transaction.id;
    const transactionLeft = document.createElement("div");
    transactionLeft.classList.add("transactionLeft");
    const transactionIcon = document.createElement("div");
    transactionIcon.classList.add("transactionIcon");
    transactionIcon.classList.add(categoryColors[transaction.category]);
    const icon = document.createElement("i");
    icon.classList.add("fa-solid");
    icon.classList.add(categoryIcons[transaction.category]);
    const transactionDetails = document.createElement("div");
    transactionDetails.classList.add("transactionDetails");
    const category = document.createElement("p");
    category.classList.add("category");
    category.textContent = transaction.category;
    const date = document.createElement("p");
    date.classList.add("date");
    date.textContent = formatDate(transaction.date);
    const amount = document.createElement("p");
    amount.classList.add("amount");
    if(transaction.type === "expense"){
        amount.textContent = `-₹${formatAmount(transaction.amount)}`;
    }
    if(transaction.type === "income"){
        amount.textContent = `+₹${formatAmount(transaction.amount)}`;
    }
    

    transactionIcon.append(icon);
    transactionDetails.append(category);
    if(transaction.description !== ""){
        const description = document.createElement("p");
        description.classList.add("description");
        description.textContent = transaction.description;
        transactionDetails.append(description);
    }
    transactionDetails.append(date);

    transactionLeft.append(transactionIcon);
    transactionLeft.append(transactionDetails);

    transactionCard.append(transactionLeft);
    transactionCard.append(amount);

    return transactionCard;
}

const recentTransactions = document.querySelector(".recentTransactions");

const renderTransactions = () =>{
    const latestTransactions = transactions.slice(-3);
    recentTransactions.innerHTML = "";
    if(latestTransactions.length === 0){
        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("emptyMessage");
        emptyMessage.textContent = "No recent transactions found..";
        recentTransactions.append(emptyMessage);
    }
    else{
        latestTransactions.forEach((transaction)=>{
            const cardElement = createTransactionCard(transaction);
            recentTransactions.prepend(cardElement);
        });
    }
    updateBalanceCard();
    
}

const totalIncome = document.querySelector("#totalIncome");
const totalExpense = document.querySelector("#totalExpense");
const totalBalance = document.querySelector("#totalBalance");
const updateBalanceCard = () =>{
    let balance = 0;
    let incomeSum = 0;
    let expenseSum = 0;
    if(transactions.length !== 0){
        transactions.forEach((transaction)=>{
            if(transaction.type === "income"){
                incomeSum += transaction.amount;
            }
            else if(transaction.type === "expense"){
                expenseSum += transaction.amount;
            }
        });

        totalIncome.textContent = `₹${formatAmount(incomeSum)}`;
        totalExpense.textContent = `₹${formatAmount(expenseSum)}`;
        balance = incomeSum-expenseSum;
        totalBalance.textContent = `₹${formatAmount(balance)}`;
        
    }
    else{
        totalIncome.textContent = `₹0`;
        totalExpense.textContent = `₹0`;
        totalBalance.textContent = `₹0`;
    }
}



// All Transactions screen logic
const allTransactions = document.querySelector(".allTransactions");

const renderAllTransactions = (transactionsToRender) => {
    allTransactions.innerHTML = "";
    if(transactionsToRender.length === 0){
        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("transactionsEmpty");
        emptyMessage.textContent = "No transaction data found..";
        allTransactions.append(emptyMessage);
    }
    else{
        const groupedTransaction = groupTransactionsByDate(transactionsToRender);
        const dates = Object.keys(groupedTransaction);
        const sortedDates = dates.sort();
        sortedDates.forEach((date)=>{
            const transactionGroup = document.createElement("div");
            transactionGroup.classList.add("transactionGroup");
            const dateHeading = document.createElement("p");
            dateHeading.classList.add("dateHeading");
            dateHeading.textContent = formatDate(date);
            groupedTransaction[date].forEach((transaction)=>{
                const cardElement = createTransactionCard(transaction);
                transactionGroup.prepend(cardElement);
            });
            transactionGroup.prepend(dateHeading);
            allTransactions.prepend(transactionGroup);
        });
    }
    
};

const groupTransactionsByDate = (transactionsToGrouped) =>{
    const groups = {};

    transactionsToGrouped.forEach((transaction)=>{
        if(groups[transaction.date]){
            groups[transaction.date].push(transaction);
        }
        else{
            groups[transaction.date] = [transaction];
        }
    });
    return groups;
    
}


const transactionSearchInput = document.querySelector(".transactionSearch input");
let searchedText = transactionSearchInput.value.trim().toLowerCase();

transactionSearchInput.addEventListener("input", () =>{
    searchedText = transactionSearchInput.value.trim().toLowerCase();
    const filteredTransaction = applyFilters(searchedText);
    renderAllTransactions(filteredTransaction);
});

let currentFilter = "all";
const transactionFilterBtns = document.querySelectorAll(".transactionFilterBtn");
transactionFilterBtns.forEach((btn)=>{
    btn.addEventListener("click", () =>{
        currentFilter = btn.dataset.filter;
        transactionFilterBtns.forEach((btn)=>{
            btn.classList.remove("active");
        });
        btn.classList.add("active");
        const filteredTransaction = applyFilters(searchedText);
        renderAllTransactions(filteredTransaction);
    });
});

const filterByType = (transactionArray,currentFilter) =>{
    const filteredTransaction = transactionArray.filter((transaction) =>{
        return transaction.type === currentFilter;
    });
    return filteredTransaction;
};

const applyFilters = (searchedText) =>{
    let filteredTransactions = transactions;
    if(searchedText !== ""){
        const searchedTransactions = filteredTransactions.filter((transaction)=>{
            const cardAmount = transaction.amount.toString();
            const cardCategory = (transaction.category).toLowerCase();
            const cardDescription = (transaction.description).toLowerCase();
            return cardAmount.includes(searchedText) || cardCategory.includes(searchedText) || cardDescription.includes(searchedText);
        });
        filteredTransactions = searchedTransactions;
    }
    if(currentFilter !== "all"){
        const typeFilteredTransactions = filterByType(filteredTransactions,currentFilter);
        filteredTransactions = typeFilteredTransactions;
    };

    if(selectedCategory !== "all"){
        const categorisedTransactions = filteredTransactions.filter((transaction) =>{
            return transaction.category === selectedCategory;
        });
        filteredTransactions = categorisedTransactions;
    };
    
    if(selectedDate !== ""){
        const dateWisetransactions = filteredTransactions.filter((transaction) =>{
            return transaction.date === selectedDate;
        });
        filteredTransactions = dateWisetransactions;
    };

    return filteredTransactions;
};

const updateFilterIndicator = () =>{
    if(selectedCategory !== "all" || selectedDate !== ""){
        filterBtn.classList.add("active-filter");
    }
    else{
        filterBtn.classList.remove("active-filter");
    }
}

const filterBtn = document.querySelector(".transactionFilter");
const filterModal = document.querySelector(".filterModal");
const filterCloseBtn = document.querySelector(".filterCloseBtn");
const applyFilterBtn = document.querySelector(".applyFilterBtn");
const clearFilterBtn = document.querySelector(".clearFilterBtn");

filterBtn.addEventListener("click", () =>{
    filterModal.classList.add("show");
});

filterCloseBtn.addEventListener("click", () =>{
    filterModal.classList.remove("show");
});

const categoryFilter = document.querySelector("#categoryFilter");
let selectedCategory = "all";
categoryFilter.addEventListener("change", () =>{
    selectedCategory = categoryFilter.value;
});

const dateFilter = document.querySelector("#dateFilter");
let selectedDate = "";
dateFilter.addEventListener("change", () =>{
    selectedDate = dateFilter.value;
});

applyFilterBtn.addEventListener("click", () =>{
    const filteredTransaction = applyFilters(searchedText);
    filterModal.classList.remove("show");
    updateFilterIndicator();
    renderAllTransactions(filteredTransaction);
});

clearFilterBtn.addEventListener("click", () =>{
    categoryFilter.value = "all";
    selectedCategory = "all";
    dateFilter.value = "";
    selectedDate = "";
    updateFilterIndicator();
    const filteredTransactions = applyFilters(searchedText);
    renderAllTransactions(filteredTransactions);
    filterModal.classList.remove("show");
});


// transaction detail modal

const transactionDetailModal = document.querySelector(".transactionDetailModal");
const transactionHeader = document.querySelector(".transactionHeader");
const modalCategory = document.querySelector(".category");
const modalamount = document.querySelector(".amount");
const modaltype = document.querySelector(".type");
const modaldescription = document.querySelector(".description");
const modaldate = document.querySelector(".date");

let selectedTransaction;
allTransactions.addEventListener("click", (e) =>{
    const transactionCard = e.target.closest(".transactionCard");
    if(transactionCard){
        const transactionCardId = Number(transactionCard.dataset.id);
        const clickedTransaction = transactions.find((transaction)=>{
            return transaction.id === transactionCardId;
        });
        selectedTransaction = clickedTransaction;
        modalCategory.textContent = clickedTransaction.category;
        if(clickedTransaction.type === "expense"){
            modalamount.textContent = `-₹${formatAmount(clickedTransaction.amount)}`;
        }
        else if(clickedTransaction.type === "income"){
            modalamount.textContent = `+₹${formatAmount(clickedTransaction.amount)}`;
        }
        if(clickedTransaction.description === ""){
            document.querySelector(".descriptionInfo").style.display = "none";
        }
        else{
            document.querySelector(".descriptionInfo").style.display = "flex";
        }
        
        const oldIcon = document.querySelector(".categoryIcon");
        if(oldIcon){
            oldIcon.remove();
        }
        
        
        const modalCategoryIcon = document.createElement("i");
        modalCategoryIcon.className = `categoryIcon ${categoryColors[clickedTransaction.category]} fa-solid ${categoryIcons[clickedTransaction.category]}`;
        transactionHeader.prepend(modalCategoryIcon);
        modaltype.textContent = (clickedTransaction.type).toUpperCase();
        modaldescription.textContent = clickedTransaction.description;
        modaldate.textContent = formatDate(clickedTransaction.date);
        transactionDetailModal.classList.add("show");
    };
});

const modalCloseBtn = document.querySelector(".closeBtn");
modalCloseBtn.addEventListener("click",() =>{
    selectedTransaction = "";
    transactionDetailModal.classList.remove("show");
});

transactionDetailModal.addEventListener("click",(e) =>{
    if(e.target === transactionDetailModal){
        selectedTransaction = "";
        transactionDetailModal.classList.remove("show");
    };
});


// Delete confirm modal

const deleteConfirmModal = document.querySelector(".delete-confirm-modal");
const cancelDeletionBtn = document.querySelector(".cancel-delete");
const confirmDeletionBtn = document.querySelector(".confirm-delete");

const transactionDeleteBtn = document.querySelector(".delete");
transactionDeleteBtn.addEventListener("click", () =>{
    deleteConfirmModal.classList.add("show");
});

cancelDeletionBtn.addEventListener("click", () =>{
    deleteConfirmModal.classList.remove("show");
});

deleteConfirmModal.addEventListener("click", (e) =>{
    if(e.target === deleteConfirmModal){
        deleteConfirmModal.classList.remove("show");
    };
});

confirmDeletionBtn.addEventListener("click", () =>{
    const nonDeletedTransaction = transactions.filter((transaction) =>{
        return transaction.id !== selectedTransaction.id;
    });
    transactions = nonDeletedTransaction;
    renderTransactions();
    const filteredTransaction = applyFilters(searchedText);
    renderAllTransactions(filteredTransaction);
    deleteConfirmModal.classList.remove("show");
    transactionDetailModal.classList.remove("show");
    selectedTransaction = "";
});

const transactionUpdateBtn = document.querySelector(".edit");
transactionUpdateBtn.addEventListener("click", () =>{
    transactionType = selectedTransaction.type;
    typeBtns.forEach((btn) =>{
        btn.classList.toggle("active", btn.dataset.type === transactionType);
    });
    amountInput.value = selectedTransaction.amount;
    amountValid = true;
    categoryInput.value = selectedTransaction.category;
    categoryValid = true;
    descriptionInput.value = selectedTransaction.description;
    dateInput.value = selectedTransaction.date;
    dateValid = true;
    addTransactionBtn.textContent = "Save changes";
    isEditing = true;
    const addTransactionScreen = document.querySelector("#add");
    transactionDetailModal.classList.remove("show");
    addTransactionScreen.classList.add("active");

});

const toastBox = document.querySelector(".toast");
const toastMsg = document.querySelector(".toast-message");
let toastTimer = null;
const showToast = (msg) =>{
    if(toastTimer !== null){
        clearTimeout(toastTimer);
    }
    toastMsg.textContent = msg;
    toastBox.classList.add("show");
    toastTimer = setTimeout(() =>{
        toastBox.classList.remove("show");
        toastTimer = null;
    }, 2000);
}

addTransactionBtn.addEventListener("click", ()=>{
    if(!amountValid){
        amountError.style.display = "block";
        return;
    };

    if(!categoryValid){
        categoryError.style.display = "block";
        return;
    };
    
    if(!dateValid){
        dateError.style.display = "block";
        return;
    };

    if(isEditing){
        updateTransaction(selectedTransaction);
        showToast("Transaction updated successfully.");
        addTransactionBtn.textContent = "Add transaction";
        isEditing = false;
        selectedTransaction = "";
    }
    else{
        const amount = Number(amountInput.value);
        const category = categoryInput.value;
        const date = dateInput.value;

        const transaction = {
            id: Date.now(),
            type: transactionType,
            amount: amount,
            category: category,
            description: descriptionInput.value.trim(),
            date: date,
            
        };


        transactions.push(transaction);
        showToast("Transaction added successfully.");
    }
    renderTransactions();
    const transactionsToShow = applyFilters(searchedText);
    renderAllTransactions(transactionsToShow);
    formReset();
    
});

const addScreenBtn = document.querySelector(".add-btn");
addScreenBtn.addEventListener("click", () =>{
    isEditing = false;
    selectedTransaction = "";
    formReset();
    addTransactionBtn.textContent = "Add transaction";
});

renderTransactions();
renderAllTransactions(transactions);