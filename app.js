// Bill Controller
var billController = (function() {

    // Constructor for person
    var Person = function(id, name, initial, paid, balance) {
        this.id = id;
        this.name = name;
        this.initial = initial;
        this.paid = paid;
        this.balance = balance;
    }

})();

// UI Controller
var uiController = (function() {
    // String classes inputs from DOM
    var domStrings = {
        inputQuantity: ".addQuantity",
        inputPersonName: ".addPersonName",
        inputQuantityBtn: ".btn-addExpense",
        inputPersonBtn: ".btn-addPersonFinal",
    };

    return {
        getInput: function() {
            console.log("Input worked.");
            // Read and return input quantity from UI
            return {
                quantity: document.querySelector(domStrings.inputQuantity).value
            }
        },

        getPerson: function() {
            console.log("Added " + document.querySelector(domStrings.inputPersonName).value);
            // Read and return person name from modal (UI)
            return {
                personName: document.querySelector(domStrings.inputPersonName).value
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
        document.querySelector(dom.inputQuantityBtn).addEventListener('click', ctrlAddExpense);

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
        // Get field input
        var input = UICtrl.getInput();
        // Add expense to bill controller
        // Add expense to UI
        // Calculate total owed
        // Display on UI
    }

    // Add person to share the bill 
    var ctrlAddPerson = function() {
        // Get person name
        var input = UICtrl.getPerson();
        // TODO: Add data to controller and display
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
