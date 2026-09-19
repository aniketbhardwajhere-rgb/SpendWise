let transactions = [];


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

    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    const transaction = {
        id: Date.now(),
        type: transactionType,
        amount: amount,
        category: category,
        description: descriptionInput.value,
        date: date,
        
    };


    transactions.push(transaction);
    renderTransactions();
    formReset();
    
});


const formatAmount = (input) =>{
    return input.toLocaleString("en-IN");
}

const categoryIcons = {
    Food: "fa-utensils",
    Travel: "fa-car",
    Shopping: "fa-bag-shopping",
    Bills: "fa-file-invoice",
    Entertainment: "fa-film",
    Health: "fa-heart-pulse",
    Education: "fa-graduation-cap",
    Salary: "fa-money-bill",
    Other: "fa-ellipsis",
}

const createTransactionCard = (transaction) =>{
    const transactionCard = document.createElement("div");
    transactionCard.classList.add("transactionCard");
    const transactionLeft = document.createElement("div");
    transactionLeft.classList.add("transactionLeft");
    const transactionIcon = document.createElement("div");
    transactionIcon.classList.add("transactionIcon");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid");
    icon.classList.add(categoryIcons[transaction.category]);
    const transactionDetails = document.createElement("div");
    transactionDetails.classList.add("transactionDetails");
    const category = document.createElement("p");
    category.classList.add("category");
    category.textContent = transaction.category;
    const description = document.createElement("p");
    description.classList.add("description");
    if(transaction.description !== ""){
        description.textContent = transaction.description;
    };
    const date = document.createElement("p");
    date.classList.add("date");
    date.textContent = transaction.date;
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
    transactionDetails.append(description);
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

renderTransactions();