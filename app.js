// Bill Controller
var billController = (function() {

})();

// UI Controller
var uiController = (function() {
    return {
        getInput: function() {
            // Read and return input quantity from UI
            return {
                quantity: document.querySelector(".addQuantity").value
            }
        }
    };
})();

var controller = (function(billCtrl, UICtrl) {

    var ctrlAddExpense = function() {
        // Get field input
        var input = UICtrl.getInput();
        console.log(input);
        // Add expense to bill controller
        // Add expense to UI
        // Calculate total owed
        // Display on UI
        console.log("this should work.")
    }

    // Adds an expense to the bill (Button)
    document.querySelector(".btn-addExpense").addEventListener('click', ctrlAddExpense);

    // Adds an expense to the bill (Enter key)
    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13)  {
            console.log("Enter was pressed");
        }
    });

    // Adds a person to the group
    document.querySelector(".btn-addPerson").addEventListener('click', function() {

    });


})(billController, uiController);

