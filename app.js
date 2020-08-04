// Bill Controller
var billController = (function() {

    // Expense
    var Expense;

    // Constructor for person
    var Person = function(id, name, owed) {
        this.id = id;
        this.name = name;
        this.owed = owed;
    };

    var data = {
        // Person Array
        allPeople: [],
        totalExpense: parseFloat("0"),
        totalOwed: parseFloat("0"),

        getNumPeople: function() {
            return this.allPeople.length;
        },

        // Note: MUST call whenever & AFTER new expense or person is added
        updateOwed: function() {
            // Calculate individual divided bill value
            var total = this.totalExpense;
            var numPeople = this.getNumPeople();
            var split = total/numPeople;
            for (var i = 0; i < this.getNumPeople(); i++) {
                this.allPeople[i].owed = split;
            }
            // TODO: Split AFTER payments are made
        }

        // Calculate total amount owed from all people
    };

    return {
        getNumPeople: function() {
            return data.getNumPeople();
        },

        getTotalExpense: function() {
            return data.totalExpense;
        },

        addExpense: function (exp) {
            var newExpense = 0;
            newExpense = exp;
            console.log("New Expense" + exp);
            // Add expense to total
            data.totalExpense += parseFloat(newExpense);
            // Update oweds
            data.updateOwed();
            return newExpense;
        }, 

        addPerson: function(nam, exp) {
            var newPerson, id, owe;
            // Create ID based on id of last item + 1
            if (data.allPeople.length > 0) {
                id = data.allPeople[data.allPeople.length-1].id + 1;
            }
            else {
                id = 0;
            }
            // Create new person
            newPerson = new Person(id, nam, owe);
            // Get number of total people
            numPeople = data.getNumPeople();
            // Update individual expense
            owe = exp/numPeople;
            newPerson.owed = owe;
            // Push to data
            data.allPeople.push(newPerson);
            // Update owed
            data.updateOwed();
            // Return new person
            return newPerson;
        },

        // FOR DEBUGGING
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
            html = '<div class = "person clearfix" id = "person-%id%"><div class = "left clearfix"><div class = "personName">%name%</div></div><div class = "right clearfix"><div class = "owedAmount">$%owed%</div><div class = "btn-pay"><ion-icon name="cash-outline" size = "large"></ion-icon></div><div class = "btn-del"><ion-icon name="trash-outline" size = "large"></ion-icon></div></div></div>';

            // Replace placeholder with object attributes
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%name%', obj.name.personName);
            newHtml = newHtml.replace('%owed%', obj.owed);

            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            // TODO: Update number of people in group in UI
        },

        // Update amount owed in list when new person is added
        updateUIOwed: function () {
            var numPeople, total, newOwed;
            // Get number of people from bill controller
            numPeople = billController.getNumPeople();
            // Get total owed from bill controller and calculate new amount owed
            total = billController.getTotalExpense();
            newOwed = total/numPeople;
            // Update owed amount for each person in UI
            for (var i = 0; i < numPeople; i++) {
                document.querySelector(domStrings.personNoID+i).querySelectorAll(domStrings.personBalDiv)[0].textContent = "$"+newOwed;
            }
        },

        // Clear expense input field when addExpense button is submitted
        clearExpenseField: function() {
            document.querySelector(domStrings.inputExpense).value = "";
            document.querySelector(domStrings.inputExpense).focus();
        },

        // Clear person input field when addPerson button is submitted   
        clearPersonField: function() {
            document.querySelector(domStrings.inputPersonName).value = "";
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
            }
        });

        // Adds a person to the group
        document.querySelector(dom.inputPersonBtn).addEventListener('click', function() {
            ctrlAddPerson();
        });
    };

    var updateTotal = function() {
        /// Return total
    }

    // Add expense to the bill
    var ctrlAddExpense = function() {
        var input, newExpense;
        // Get field input
        input = UICtrl.getExpense().expense;
        // Input error checking
        if (input != "" && !isNaN(input) && input > 0) {
            console.log("Added " + input);
            // Add expense to bill controller
            newExpense = billCtrl.addExpense(input);
            // Add expense to UI
            // Update individual amounts owed, clear fields
            UICtrl.updateUIOwed();
            UICtrl.clearExpenseField();
            // Calculate total owed & display on UI
            updateTotal();
            // Display on UI
        }
        else {
            alert("Please enter positive values only.")
        }
    }

    // Add person to share the bill 
    var ctrlAddPerson = function() {
        var input, expense, newPerson;
        // Get person name
        input = UICtrl.getPerson();

        if (input.personName != "") {
            // Get total expense 
            expense = billCtrl.getTotalExpense();
            // Add person to bill controller
            newPerson = billCtrl.addPerson(input,expense);
            // Add person to UI, update amount owed, clear fields
            UICtrl.addListPerson(newPerson);
            UICtrl.updateUIOwed();
            UICtrl.clearPersonField();
        }
        
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
