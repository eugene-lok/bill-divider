// Bill Controller
var billController = (function() {

})();

// UI Controller
var uiController = (function() {
    // String classes inputs from DOM
    var domStrings = {
        inputQuantity: ".addQuantity",
        inputQuantityBtn: ".btn-addExpense",
        inputPersonBtn: ".btn-addPerson",
    };

    return {
        getInput: function() {
            // Read and return input quantity from UI
            return {
                quantity: document.querySelector(domStrings.inputQuantity).value
            }
        },

        getDomStrings: function() {
            return domStrings;
        }
    };

})();

var controller = (function(billCtrl, UICtrl) {

    // Get strings from DOM
    var dom = UICtrl.getDomStrings();
    
    var ctrlAddExpense = function() {
        // Get field input
        var input = UICtrl.getInput();
        console.log(input);
        // Add expense to bill controller
        // Add expense to UI
        // Calculate total owed
        // Display on UI
    }

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
        console.log("Person was pressed");
    });


})(billController, uiController);

