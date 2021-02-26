'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
            document.getElementById("redo-button").disabled = "true";
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            appModel.showModal();
        }
        document.getElementById("confirm-delete-exit").onmousedown = function(){
            appModel.hideModal();
        }
        document.getElementById("confirm-delete-cancel").onmousedown = function(){
            appModel.hideModal();
        }
        document.getElementById("confirm-delete-confirm").onmousedown = function(){
            appModel.removeCurrentList();
        }
        document.getElementById("add-item-button").onmousedown = function(){
            appModel.addNewItemTransaction();
        }  
        document.getElementById("close-list-button").onmousedown = function(){
            appModel.closeList();
        }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    handleDescChange(newText, listItem){ 
        this.model.changeTextTransaction(newText, listItem);
    }

    handleDateChange(newDate, listItem){
        this.model.changeDateTransaction(newDate, listItem);
    }

    handleStatusChange(newStatus, listItem){
        this.model.changeStatusTransaction(newStatus, listItem);
    }

    handleUpMove(listItem){
        this.model.moveUpTransaction(listItem);
    }

    handleDownMove(listItem){
        this.model.moveDownTransaction(listItem);
    }

    handleDeleteItem(listItem){
        this.model.deleteItemTransaction(listItem);
    }
}