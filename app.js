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

    var calcTotalOwed = function() {
        var sum = 0;
        // Sum all owed amounts
        data.allPeople.forEach(function(current) {
            sum += current.owed;
        });
        data.totalOwed = sum;
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

        deletePerson: function(id) {
            var allID, index, remainOwed;
            // Return array of person ids
            allID = data.allPeople.map(function(current) {
                return current.id;
            });
            // Find index of id
            index = allID.indexOf(id);
            
            if (index !== -1) {
                // Get remaining amount owed
                remainOwed = data.allPeople[index].owed;
                // Splice person from array 
                data.allPeople.splice(index, 1);
                console.log("Person deleted.");
                // Get remaining number of people
                var remainPeople = data.getNumPeople();
                // If more than 0 people left
                if (remainPeople > 0) {
                    // Calculate remaining amount per person 
                    var remainOwedSplit = remainOwed/remainPeople;
                    // Add remaining amount to each person's amount owed
                    data.allPeople.forEach(function(current) {
                        current.owed += remainOwedSplit; 
                    });
                }
            }

            
            
            
            
            
            // TODO: Split remaining amount owed among the rest of people, IF there is more than 0 people left
        },

        calculateOwed: function() {
            // Calcualte total owed
            calcTotalOwed();
        },  

        getOwed: function() {
            return {
                totalOwed: data.totalOwed
            };
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
        personBalDiv: "div.owedAmount",
        personPay: ".btn-pay",
        personDel: ".btn-del",
        owedLabel: ".owedAmount",
        numPeopleLabel: ".owedPeopleNum",
        listContainer: ".personContainer"
        
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

        // Deletes a person from UI
        deleteListPerson: function(idString) {
            var element = document.getElementById(idString);
            element.parentNode.removeChild(element);
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
                document.querySelector(domStrings.personNoID+i).querySelectorAll(domStrings.personBalDiv)[0].textContent = "$"+newOwed.toFixed(2);
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

        // Display total amount owed on UI
        displayTotalOwed: function(owedObj) {
            document.querySelector(domStrings.owedLabel).textContent = "$"+owedObj.totalOwed.toFixed(2);
        },

        // Display total number of people in group
        displayTotalPeople: function(num) {
            document.querySelector(domStrings.numPeopleLabel).textContent = num;
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

        // Clears or deletes a person from the group
        document.querySelector(dom.listContainer).addEventListener('click', ctrlPersonAction);
    };

    var updateTotal = function() {
        // Calculate total amount owed
        billCtrl.calculateOwed();
        // Return total amount owed
        var total = billCtrl.getOwed();
        // TODO: Display total amount owed in UI
        console.log("Total owed"+total.totalOwed);
        UICtrl.displayTotalOwed(total);
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
    };

    // Add person to share the bill 
    var ctrlAddPerson = function() {
        var input, expense, newPerson, numPeople;
        // Get person name
        input = UICtrl.getPerson();

        if (input.personName != "") {
            // Get total expense 
            expense = billCtrl.getTotalExpense();
            // Add person to bill controller
            newPerson = billCtrl.addPerson(input,expense);
            // Add person to UI, update amount owed, clear fields
            UICtrl.addListPerson(newPerson);
            // Get new number of people in group
            numPeople = billCtrl.getNumPeople();
            UICtrl.displayTotalPeople(numPeople);
            UICtrl.updateUIOwed();
            UICtrl.clearPersonField();
        }
    };
    
    // Deletes a person from the list
    var ctrlDelPerson = function(idString, id) {
        console.log("IdString: "+idString)
        // Delete person from data
        billCtrl.deletePerson(id);
        // Delete person from UI
        UICtrl.deleteListPerson(idString);
        // Update individual amounts owed 

        // Update total owed, number of people
        updateTotal();
        var numPeople = billCtrl.getNumPeople();
        UICtrl.displayTotalPeople(numPeople);
        
    };

    // Controller for all actions for Person
    var ctrlPersonAction = function(event) {
        // Get strings from DOM
        var dom = UICtrl.getDomStrings();
        // Get class name of target button 
        var btnSelect = event.target.parentNode;
        var btnName = btnSelect.className;
        // Get id/index of person from target button
        var personIDString = btnSelect.parentNode.parentNode.id;
        var personID = parseInt(personIDString.split('-')[1]);
        console.log(btnName);
        console.log(typeof personID);
        // Pay action
        if ("."+btnName == dom.personPay) {
            // TODO
        }
        // Delete person action
        else if (("."+btnName) == dom.personDel) {
            console.log("Delete person.")
            ctrlDelPerson(personIDString,personID);
        }
    };

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
