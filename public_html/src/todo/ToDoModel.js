'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import ChangeText_Transaction from './transactions/ChangeText_Transaction.js'
import ChangeDate_Transaction from './transactions/ChangeDate_Transaction.js'
import ChangeStatus_Transaction from './transactions/ChangeStatus_Transaction.js'
import MoveUp_Transaction from './transactions/MoveUp_Transaction.js'
import MoveDown_Transaction from './transactions/MoveDown_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;

        this.lastEditedList = null;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        if (this.lastEditedList != this.currentList){
            this.tps.clearAllTransactions();
            this.lastEditedList = this.currentList;
        }
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
        this.updateRedo();
        this.updateUndo();
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        this.tps.clearAllTransactions();
        this.updateRedo();
        this.updateUndo();
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList, false);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    addItemToList(item){
        this.currentList.items.push(item);
        this.view.viewList(this.currentList);
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists.splice(listIndex, 1);
            this.toDoLists.unshift(listToLoad[0]);
            this.currentList = this.toDoLists[0];
            this.view.refreshLists(this.toDoLists);
            this.view.viewList(this.currentList);
        }
        this.view.selectListYellow(listId);
        this.updateAddList();
        this.updateListEdit();
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
        this.updateRedo();
        this.updateUndo();
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    showModal(){
        this.view.showModal();
    }

    hideModal(){
        this.view.hideModal();
    }
    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
        this.view.hideModal();
        this.updateAddList();
        this.updateListEdit();
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
        this.updateRedo();
        this.updateUndo();
    } 

    changeTextTransaction(newText, listItem){
        if (this.lastEditedList != this.currentList){
            this.tps.clearAllTransactions();
            this.lastEditedList = this.currentList;
        }
        let transaction = new ChangeText_Transaction(this, newText, listItem);
        this.tps.addTransaction(transaction);
        this.updateRedo();
        this.updateUndo();
    }

    changeText(text, listItem){
        let oldText = listItem.getDescription();
        listItem.setDescription(text);
        this.view.viewList(this.currentList);
        return oldText;
    }

    changeDateTransaction(newDate, listItem){
        if (this.lastEditedList != this.currentList){
            this.tps.clearAllTransactions();
            this.lastEditedList = this.currentList;
        }
        let transaction = new ChangeDate_Transaction(this, newDate, listItem);
        this.tps.addTransaction(transaction);
        this.updateRedo();
        this.updateUndo();
    }

    changeDate(date, listItem){
        let oldDate = listItem.getDueDate();
        listItem.setDueDate(date);
        this.view.viewList(this.currentList);
        return oldDate;
    }

    changeStatusTransaction(newStatus, listItem){
        if (this.lastEditedList != this.currentList){
            this.tps.clearAllTransactions();
            this.lastEditedList = this.currentList;
        }
        let transaction = new ChangeStatus_Transaction(this, newStatus, listItem);
        this.tps.addTransaction(transaction);
        this.updateRedo();
        this.updateUndo();
    }

    changeStatus(status, listItem){
        let oldStatus = listItem.getStatus();
        listItem.setStatus(status);
        this.view.viewList(this.currentList);
        return oldStatus;
    }
    
    moveUpTransaction(listItem){
        if (this.lastEditedList != this.currentList){
            this.tps.clearAllTransactions();
            this.lastEditedList = this.currentList;
        }
        let transaction = new MoveUp_Transaction(this, listItem);
        this.tps.addTransaction(transaction);
        this.updateRedo();
        this.updateUndo();
    }

    moveUp(listItem){
        let currentPos = this.currentList.getIndexOfItem(listItem);
        this.currentList.removeItem(listItem);
        this.currentList.addElementToIndex(currentPos - 1, listItem);
        this.view.viewList(this.currentList);
    }

    moveDown(listItem){
        let currentPos = this.currentList.getIndexOfItem(listItem);
        this.currentList.removeItem(listItem);
        this.currentList.addElementToIndex(currentPos + 1, listItem);
        this.view.viewList(this.currentList);
    }

    moveDownTransaction(listItem){
        if (this.lastEditedList != this.currentList){
            this.tps.clearAllTransactions();
            this.lastEditedList = this.currentList;
        }
        let transaction = new MoveDown_Transaction(this, listItem);
        this.tps.addTransaction(transaction);
        this.updateRedo();
        this.updateUndo();
    }

    deleteItemTransaction(listItem){
        if (this.lastEditedList != this.currentList){
            this.tps.clearAllTransactions();
            this.lastEditedList = this.currentList;
        }
        let transaction = new DeleteItem_Transaction(this, listItem);
        this.tps.addTransaction(transaction);
        this.updateRedo();
        this.updateUndo();
    }

    deleteItem(listItem){
        let position = this.currentList.getIndexOfItem(listItem);
        this.currentList.removeItem(listItem);
        this.view.viewList(this.currentList);
        return position;
    }

    addItem(index, listItem){
        this.currentList.addElementToIndex(index, listItem);
        this.view.viewList(this.currentList);
    }

    closeList(){
        this.currentList = null;
        this.view.refreshLists(this.toDoLists);
        this.view.clearItemsList();
        this.updateAddList();
        this.updateListEdit();
    }

    updateRedo(){
        this.view.updateRedo(this.tps.hasTransactionToRedo());
    }

    updateUndo(){
        this.view.updateUndo(this.tps.hasTransactionToUndo());
    }

    updateAddList(){
        this.view.updateAddList(this.currentList);
    }

    updateListEdit(){
        this.view.updateListEdit(this.currentList);
    }

    listNameChange(listId, newName){
        for(let i = 0; i < this.toDoLists.length; i++){
            if (this.toDoLists[i].getId() == Number(listId)){
                this.toDoLists[i].setName(newName);
                
            }
        }
        this.view.refreshLists(this.toDoLists);
        this.view.selectListYellow(this.currentList.id);
    }
}