// Storage controller
const StorageCtrl = (function () {


    // Public methods
    return {
        storeItem: function (item) {
            let items;

            // Check if any items in local storage
            if (localStorage.getItem('items') === '' || localStorage.getItem('items') === null) {
                items = [];
                // push item to items array
                items.push(item);

                // set local storage for items
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // get the items from local storage
                items = JSON.parse(localStorage.getItem('items'));
                // push new item
                items.push(item);
                // re set local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage : function () {
            let items;
            if (localStorage.getItem('items') === '' || localStorage.getItem('items') === null) {
                items = [];
                
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage : function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            // Re set local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
         deleteItemFromStorage : function (id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (item.id === id) {
                    items.splice(index, 1);
                }
            });

            // Re set local storage
            localStorage.setItem('items', JSON.stringify(items));
         },
         clearItemsFromStorage : function () {
             localStorage.removeItem('items');
         }
    }
})();



// Item controller

const ItemCtrl  = (function (){
  // Item constructor
  const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
  }

 
  // Data structure - state
  const data = {
      items: StorageCtrl.getItemsFromStorage(),
      currentItem: null,
      totalCalories: 0
  }

  return {
        getItems: function () {
            return data.items
        },
       logData : function(){
          return data;
      },
      addItem: function (name, calories) {
          let ID;
          if (data.items.length > 0) {
              ID = data.items[data.items.length - 1].id + 1;
          } else {
              ID = 0;
          }
          calories = parseInt(calories);

          // Create new item
          const newItem = new Item(ID, name, calories);

         

          // Add new item to item list
          data.items.push(newItem);

          return newItem;
      },
      updateItem : function (name, calories) {
          calories = parseInt(calories);

          let found = null;

          data.items.forEach(function (item) {
              if (item.id === data.currentItem.id) {
                  item.name = name;
                  item.calories = calories;
                  found = item;
              }
          });

          return found;
      },
      deleteItem: function (id) {
          const ids =  data.items.map(function (item) {
              return item.id;
          });

          // Get index
          const index = ids.indexOf(id);

          // Remove from Data Structure
          data.items.splice(index, 1);
        
      },
      clearAllItems: function () {
          data.items = [];
      },
      getTotalCalories: function(){
          let total = 0;
          data.items.forEach(function (item) {
              total += item.calories;
          })
          // Set total calories
          data.totalCalories = total;

          // Return total calories
          return data.totalCalories;
      },
      getItemById: function (id) {
          let found = null;
          data.items.forEach(function (item) {
              if (item.id === id) {
                  found = item;
              }
          })
          return found;
      },
      setCurrentItem: function (item) {
          data.currentItem = item;
      },
      getCurrentItem: function () {
          return data.currentItem;
      }

  }
})();



// UI controller
const UICtrl = (function (){
   const UISelectors = {
    itemList : '#item-list',
    listItems : '#item-list li',
    addBtn : '.add-btn',
    updateBtn : '.update-btn',
    deleteBtn : '.delete-btn',
    backBtn : '.back-btn',
    clearBtn : '.clear-btn',
    itemNameInput : '#item-name',
    itemCaloriesInput : '#item-calories',
    totalCalories: '.total-calories'
    }

    return {
        populateListItems: function(items){
            
            let html = '';

            items.forEach(function(item) {
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>
                `;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function () {
            return UISelectors;
        },
        getFormInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value 
            }
        },
        addListItem : function (item) {
            // Show list item
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add html
            li.innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;

            // Insert li
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function (item) {
            let listItems =  document.querySelectorAll(UISelectors.listItems);

            // Turn node list to array
            listItems = Array.from(listItems);

            // Loop through list items
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
            
        },
        deleteListItem : function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        removeAllItems : function () {
            
            let listItems = document.querySelectorAll(UISelectors.listItems); // returns a node list
            // Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            });
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hidelist: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCals){
            document.querySelector(UISelectors.totalCalories).textContent = totalCals;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        addItemToForm : function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            // Show update, delete and back when clicked on edit button
            UICtrl.showEditState();
        }
    }
})();

// App controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl){
    
    // Load event listeners
    const loadEventListeners = function(){
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', addItem);

        // Disable enter keypress
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })

        // Item edit event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

         // Item update event
         document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

         // Back button event
         document.querySelector(UISelectors.backBtn).addEventListener('click', onClearEdit);

          // Item update event
          document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

          // Clear all event
          document.querySelector(UISelectors.clearBtn).addEventListener('click', onClearAllItems);
    }
    
    // Add item event
    const addItem = function (e) {
        e.preventDefault();
        // Get form input form UI controller
        const input = UICtrl.getFormInput();

        if (input.name !== '' && input.calories !== '') {
            // Item add event
           const newItem = ItemCtrl.addItem(input.name, input.calories);

           // Add item to UI
           UICtrl.addListItem(newItem);

           // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories()
           // Show item calories
           UICtrl.showTotalCalories(totalCalories);

           // Store in local storage
           StorageCtrl.storeItem(newItem);

           // Clear input
            UICtrl.clearInput();
        } else {
            alert('Name/Calories cannot be blank')
        }

        

    }

    // click edit item
    const itemEditClick = function (e) {
        e.preventDefault();
        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
            const listIdArray = listId.split('-');

            const id = parseInt(listIdArray[1])

           // Get item by id
           const itemToUpdate = ItemCtrl.getItemById(id);

           // Set current item
           ItemCtrl.setCurrentItem(itemToUpdate);

           // add item to form
           UICtrl.addItemToForm();
        }
    }

    // Item update submit
    const itemUpdateSubmit = function (e) {
        e.preventDefault();
        
        const input = UICtrl.getFormInput();
       
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI with updated item
        UICtrl.updateListItem(updatedItem);

         // Get total calories
         const totalCalories = ItemCtrl.getTotalCalories()
         // Show item calories
         UICtrl.showTotalCalories(totalCalories);

         // Update item in local storage
         StorageCtrl.updateItemStorage(updatedItem);

         // claer edit state
         UICtrl.clearEditState();
    }

    // Item delete submit
    const itemDeleteSubmit = function (e) {
        e.preventDefault();
        
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        // Show item calories
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        
    }

    // Clear all items
    const onClearAllItems = function () {
       // Clear all items form data structure
       ItemCtrl.clearAllItems(); 

       // Clear from UI
       UICtrl.removeAllItems();
       
       // Clear items from local storage
       StorageCtrl.clearItemsFromStorage();

       // Get total calories
       const totalCalories = ItemCtrl.getTotalCalories()
       // Show item calories
       UICtrl.showTotalCalories(totalCalories);
    }

   // Clear edit state event
   const onClearEdit = function (e) {
       e.preventDefault();

       // call clear edit state event from UI controller
       UICtrl.clearEditState();
   }
    return {
        init: function () {
            // Clear edit  state
            UICtrl.clearEditState();  
            
            // Fetch list items
            const items = ItemCtrl.getItems();
            if (items.length === 0) {
                 UICtrl.hidelist();
                //console.log(items)
            } else {
                // poulate items on UI
            UICtrl.populateListItems(items);
            }
            // Get total calories
           const totalCalories = ItemCtrl.getTotalCalories()
           // Show item calories
           UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize app
App.init()

