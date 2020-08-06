// Bill Controller
var billController = (function() {

    // Expense
    var Expense;

    // Constructor for person
    var Person = function(id, name, owed, paid) {
        this.id = id;
        this.name = name;
        this.owed = owed;
        this.paid = paid;
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

        addIndivOwed: function(newExpense) {
            var numPeople = data.getNumPeople();
            data.allPeople.forEach(function(current) {
                if (typeof current.owed === 'undefined') {
                    current.owed = newExpense/numPeople;
                }
                else {
                    current.owed += newExpense/numPeople;
                }
            });
        },

        // Note: MUST call AFTER person is added
        updateOwed: function() {
            var numPeople, paidStatus, totalOwed, indivOwed;
            // Calculate individual divided bill value
            numPeople = this.getNumPeople();
            // Get array of paid status 
            paidStatus = this.allPeople.map(function(current) {
                return current.paid;
            });
            console.log("Status: "+paidStatus);
            // Get indices where paid is false
            var indices = [];
            for (var i = 0; i < numPeople; i++) {
                if (paidStatus[i] === false) {
                    indices.push(i);
                }
            }
            console.log("Indices:"+ indices);
            // Get total amount owed, calculate individual amounts owed
            totalOwed = this.totalOwed;
            indivOwed = totalOwed/indices.length;
            // Assign individual amounts owed at indices
            for (var i = 0; i < indices.length; i++) {
                this.allPeople[indices[i]].owed = indivOwed;
            }
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

        getUnpaidIds: function() {
            var ids, paid; 
            var unpaidIds = [];
            ids = this.getAllIds();
            paid = this.getAllPaid();
            
            for(var i = 0; i < ids.length; i++) {
                if (paid[i] == false) {
                    unpaidIds.push(ids[i]);
                }
            }
            return unpaidIds;
        },

        getAllIds: function() {
            var allIDs;
            allIDs = data.allPeople.map(function(current) {
                return current.id;
            });
            return allIDs;
        },

        getIndivOwed: function() {
            var indivOwed;
            indivOwed = data.allPeople.map(function(current) {
                return current.owed;
            });
            return indivOwed;
        },

        getAllPaid: function() {
            var allPaid;
            allPaid = data.allPeople.map(function(current) {
                return current.paid;
            });
            return allPaid;
        },

        addExpense: function (exp) {
            var newExpense;
            newExpense = exp;
            console.log("New Expense: " + newExpense);
            // Add expense to total
            data.totalExpense += parseFloat(newExpense);
            // Update owed amounts
            data.addIndivOwed(parseFloat(newExpense));
            return newExpense;
        }, 

        addPerson: function(nam, exp) {
            var newPerson, id;
            //var owe;
            // Create ID based on id of last item + 1
            if (data.allPeople.length > 0) {
                id = data.allPeople[data.allPeople.length-1].id + 1;
            }
            else {
                id = 0;
            }
            // Create new person
            newPerson = new Person(id, nam, 0, false);
            // Get number of total people
            numPeople = data.getNumPeople();
            // Push to data
            data.allPeople.push(newPerson);
            // Update amounts owed 
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
            // Calculate total owed
            calcTotalOwed();
        },  

        getOwed: function() {
            console.log("TotalOwedClass: "+ data.totalOwed);
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

        // Update amounts owed in list when new expense is added 
        updateUIExpense: function() {

        },

        // Update amount owed in list when new person is added 
        updateUIOwed: function(unpaid, owed) {
            var nextId, nextOwed;
            // Get number of people from bill controller
            numPeople = billController.getNumPeople();
            // Get total owed from bill controller and calculate new amount owed
            total = billController.getTotalExpense();
            numUnpaid = unpaid.length;
            // Update owed amount for each person (unpaid) in UI
            for (var i = 0; i < numUnpaid; i++) {
                nextID = unpaid[i];
                nextOwed = owed[i];
                document.querySelector(domStrings.personNoID+nextID).querySelectorAll(domStrings.personBalDiv)[0].textContent = "$"+nextOwed.toFixed(2);
            }


        },

        // Update amount owed in list when person is deleted
        // TODO: 

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
        var totalOwed = billCtrl.getOwed();
        // TODO: Display total amount owed in UI
        console.log("Total owed"+totalOwed.totalOwed);
        UICtrl.displayTotalOwed(totalOwed);
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
            UICtrl.updateUIExpense();
            UICtrl.clearExpenseField();
            // Calculate total expense, total owed, & display on UI
            updateTotal();
            // Display on UI
        }
        else {
            alert("Please enter positive values only.");
        }
    };

    // Add person to share the bill 
    var ctrlAddPerson = function() {
        var input, expense, newPerson, numPeople;
        // Get person name
        input = UICtrl.getPerson();

        if (input.personName != "") {
            var owedList, unpaidList
            // Get total expense 
            expense = billCtrl.getTotalExpense();
            // Add person to bill controller
            newPerson = billCtrl.addPerson(input,expense);
            // Add person to UI, update amount owed, clear fields
            UICtrl.addListPerson(newPerson);
            // Get and display new number of people in group
            numPeople = billCtrl.getNumPeople();
            UICtrl.displayTotalPeople(numPeople);
            // Get IDs of people (unpaid)
            unpaidList = billCtrl.getUnpaidIds();
            // Get individual amounts owed
            owedList = billCtrl.getIndivOwed();
            console.log("unpaid:"+unpaidList);
            // Update UI with individual amounts owed
            UICtrl.updateUIOwed(unpaidList, owedList);
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
        UICtrl.updateUIOwed();
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
