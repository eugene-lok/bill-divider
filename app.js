// Bill Controller
var billController = (function() {

    // Expense
    var Expense;

    // Constructor for person
    var Person = function(id, name, balance) {
        this.id = id;
        this.name = name;
        this.balance = balance;
    };

    var data = {
        // Person Array
        allPeople: [],
        totalOwed: parseFloat("0"),

        getNumPeople: function() {
            return this.allPeople.length;
        },

        // Note: MUST call whenever & AFTER new expense or person is added
        updateBalances: function() {
            console.log("Updating...");
            // Calculate individual divided bill value
            var total = this.totalOwed;
            var numPeople = this.getNumPeople();
            var split = total/numPeople;
            for (var i = 0; i < this.getNumPeople(); i++) {
                this.allPeople[i].balance = split;
            }
        },
    };

    return {
        getNumPeople: function() {
            return data.getNumPeople();
        },

        getTotalOwed: function() {
            return data.totalOwed;
        },

        addExpense: function (exp) {
            var newExpense = 0;
            newExpense = exp;
            console.log("New Expense" + exp);
            // Add expense to total
            data.totalOwed += parseFloat(newExpense);
            // Update balances
            data.updateBalances();
            return newExpense;
        }, 

        addPerson: function(nam, exp) {
            var newPerson, id, bal;
            // Create ID based on id of last item + 1
            if (data.allPeople.length > 0) {
                id = data.allPeople[data.allPeople.length-1].id + 1;
            }
            else {
                id = 0;
            }
            // Create new person
            newPerson = new Person(id, nam, bal);
            // Get number of total people
            numPeople = data.getNumPeople();
            // Update individual expense
            bal = exp/numPeople;
            newPerson.balance = bal;
            // Push to data
            data.allPeople.push(newPerson);
            // Update balances
            data.updateBalances();
            // Return new person
            return newPerson;
        },

        testDisplay: function() {
            console.log(data);
        }
    };

})();

// UI Controller
var uiController = (function() {
    // String classes inputs from DOM
    var domStrings = {
        inputExpense: ".addExpense",
        inputPersonName: ".addPersonName",
        inputExpenseBtn: ".btn-addExpense",
        inputPersonBtn: ".btn-addPersonFinal",
        personItemCont: ".personContainer",
        personNoID: "#person-",
        personBalDiv: "div.owedAmount"
    };

    return {
        getExpense: function() {
            console.log("Added " + document.querySelector(domStrings.inputExpense).value);
            // Read and return expense quantity from UI
            return {
                expense: document.querySelector(domStrings.inputExpense).value
            }
        },

        getPerson: function() {
            console.log("Added " + document.querySelector(domStrings.inputPersonName).value);
            // Read and return person name from modal (UI)
            return {
                personName: document.querySelector(domStrings.inputPersonName).value
            }
        },

        addListPerson: function(obj) {
            var html, newHtml, element;
            // Create string with placeholder text
            element = domStrings.personItemCont;
            html = '<div class = "person clearfix" id = "person-%id%"><div class = "left clearfix"><div class = "personName">%name%</div></div><div class = "right clearfix"><div class = "owedAmount">$%balance%</div><div class = "btn-pay"><ion-icon name="cash-outline" size = "large"></ion-icon></div><div class = "btn-del"><ion-icon name="trash-outline" size = "large"></ion-icon></div></div></div>';

            // Replace placeholder with object attributes
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%name%', obj.name.personName);
            newHtml = newHtml.replace('%balance%', obj.balance);

            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // Update balances in list new person is added
        updateUIBalances: function () {
            var numPeople, total, newBalance;
            // Get number of people from bill controller
            numPeople = billController.getNumPeople();
            // Get total owed from bill controller and calculate new balances
            total = billController.getTotalOwed();
            newBalance = total/numPeople;
            // Update owed amount for each person in UI
            for (var i = 0; i < numPeople; i++) {
                document.querySelector(domStrings.personNoID+i).querySelectorAll(domStrings.personBalDiv)[0].textContent = "$"+newBalance;
            }
        },

        getDomStrings: function() {
            return domStrings;
        }
    };

})();

// Global Controller
var controller = (function(billCtrl, UICtrl) {

    // All event listeners
    var setupEventListeners = function() {
        // Get strings from DOM
        var dom = UICtrl.getDomStrings();

        // Adds an expense to the bill (Button)
        document.querySelector(dom.inputExpenseBtn).addEventListener('click', ctrlAddExpense);

        // Adds an expense to the bill (Enter key)
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13)  {
                ctrlAddExpense();
                console.log("Enter was pressed");
            }
        });

        // Adds a person to the group
        document.querySelector(dom.inputPersonBtn).addEventListener('click', function() {
            ctrlAddPerson();
            console.log("Person was pressed");
        });
    };

    // Add expense to the bill
    var ctrlAddExpense = function() {
        var input, newExpense;
        // Get field input
        input = UICtrl.getExpense().expense;
        // Add expense to bill controller
        newExpense = billCtrl.addExpense(input);
        // Add expense to UI
        // Update individual balances
        UICtrl.updateUIBalances();
        // Calculate total owed
        // Display on UI
    }

    // Add person to share the bill 
    var ctrlAddPerson = function() {
        var input, expense, newPerson;
        // Get person name
        input = UICtrl.getPerson();
        // Get total expense 
        expense = billCtrl.getTotalOwed();
        // Add person to bill controller
        newPerson = billCtrl.addPerson(input,expense);
        // Add person to UI & update balances
        UICtrl.addListPerson(newPerson);
        UICtrl.updateUIBalances();
        // Display on UI
    }

    // Init function
    return {
        init: function() {
            console.log("App has started");
            setupEventListeners();
        }
    };

})(billController, uiController);

// Start app and consequently, event listeners
controller.init();