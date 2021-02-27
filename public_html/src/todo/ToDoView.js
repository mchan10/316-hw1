'use strict'

import ToDoModel from "./ToDoModel.js";

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button todo-list");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);
        let inputElement = document.createElement("input");
        inputElement.setAttribute("class", "input-list-text");
        inputElement.setAttribute("value", listElement.innerHTML);
        listsElement.appendChild(inputElement);
        listElement.onclick = function(event){
            if(event.detail == 1){
                thisController.handleLoadList(newList.id);
            }
            if (event.detail == 2){
                inputElement.style.display = "block";
                listElement.style.display = "none";
                inputElement.focus();
            }
        }
        inputElement.onblur = function(){
            inputElement.style.display = "none";
            listElement.style.display = "block";
            thisController.handleListNameChange(newList.id, inputElement.value);
        }
        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {

        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        if (list == null){
            return;
        }

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div class='task-col'>" + "<input type='text' class='input-text' value='" + listItem.description + "'>"
                                + "</input>" + "<span class='list-item'>" + listItem.description + "</span></div>"
                                + "<div class='due-date-col'>" + "<input type='date' class='input-date' value='" + listItem.dueDate + "'>"
                                + "</input>" + "<span class='list-date'>" + listItem.dueDate + "</span></div>"
                                + "<div class='status-col'>" + "<select class='input-status'>" + "<option value='' style='display:none'>" + listItem.status + "</option>"
                                + "<option value='1'> complete </option>" + "<option value='2'> incomplete </option></select>"
                                + "<span class='list-status'>" + listItem.status + "</span></div>"
                                + "<div class='list-controls-col'>"
                                + " <div class='list-item-control material-icons todo_button'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons todo_button'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons todo_button'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.insertAdjacentHTML("beforeend", listItemElement);
            let inputDesc = document.getElementById("todo-list-item-" + listItem.id).childNodes[0];
            let thisController = this.controller;
            inputDesc.onclick = function(){
                inputDesc.getElementsByTagName("span")[0].style.display = "none";
                inputDesc.getElementsByTagName("input")[0].style.display = "block";
                inputDesc.getElementsByTagName("input")[0].focus();
            }
            inputDesc.getElementsByTagName("input")[0].onblur = function(){
                inputDesc.getElementsByTagName("input")[0].style.display = "none";
                inputDesc.getElementsByTagName("span")[0].style.display = "block";
                //inputDesc.getElementsByTagName("span")[0].innerHTML = inputDesc.getElementsByTagName("input")[0].value;
                if (inputDesc.getElementsByTagName("span")[0].innerHTML != inputDesc.getElementsByTagName("input")[0].value){
                    thisController.handleDescChange(inputDesc.getElementsByTagName("input")[0].value, listItem);
                }
            }
            let inputDate = document.getElementById("todo-list-item-" + listItem.id).childNodes[1];
            inputDate.onclick = function(){
                inputDate.getElementsByTagName("span")[0].style.display = "none";
                inputDate.getElementsByTagName("input")[0].style.display = "block";
                inputDate.getElementsByTagName("input")[0].focus();
            }
            inputDate.getElementsByTagName("input")[0].onblur = function(){
                inputDate.getElementsByTagName("input")[0].style.display = "none";
                inputDate.getElementsByTagName("span")[0].style.display = "block";
                //inputDate.getElementsByTagName("span")[0].innerHTML = inputDate.getElementsByTagName("input")[0].value;
                if (inputDate.getElementsByTagName("span")[0].innerHTML != inputDate.getElementsByTagName("input")[0].value){
                    thisController.handleDateChange(inputDate.getElementsByTagName("input")[0].value, listItem);
                }
            }
            let inputStatus = document.getElementById("todo-list-item-" + listItem.id).childNodes[2];
            inputStatus.onclick = function(){
                inputStatus.getElementsByTagName("span")[0].style.display = "none";
                inputStatus.getElementsByTagName("select")[0].style.display = "block";
                inputStatus.getElementsByTagName("select")[0].focus();
            }
            inputStatus.getElementsByTagName("select")[0].onblur = function(){
                inputStatus.getElementsByTagName("select")[0].style.display = "none";
                inputStatus.getElementsByTagName("span")[0].style.display = "block";
                let newStatus;
                if (inputStatus.getElementsByTagName("select")[0].value == 1){
                    newStatus = "complete";
                }
                else{
                    newStatus = "incomplete";
                }
                if (newStatus != inputStatus.getElementsByTagName("span")[0].innerHTML){
                    thisController.handleStatusChange(newStatus, listItem);
                }
            }
            let inputUp = document.getElementById("todo-list-item-" + listItem.id).childNodes[3].childNodes[1];
            if (i != 0){
                inputUp.onclick = function(){
                    thisController.handleUpMove(listItem);
                }
            }
            else{
                inputUp.classList.remove("todo_button");
            }
            let inputDown = document.getElementById("todo-list-item-" + listItem.id).childNodes[3].childNodes[3];
            if (i != list.items.length - 1){
                inputDown.onclick = function(){
                    thisController.handleDownMove(listItem);
                }
            }
            else{
                inputDown.classList.remove("todo_button");
            }
            let inputDelete = document.getElementById("todo-list-item-" + listItem.id).childNodes[3].childNodes[5];
            inputDelete.onclick = function(){
                thisController.handleDeleteItem(listItem);
            }
            if (inputStatus.getElementsByTagName("span")[0].innerHTML == "complete"){
                inputStatus.getElementsByTagName("span")[0].classList.add("complete-status");
            }
            else{
                inputStatus.getElementsByTagName("span")[0].classList.add("incomplete-status");
            }
        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }

    showModal(){
        let modal = document.getElementById("modal-overlay");
        modal.style.display = "block";
    }

    hideModal(){
        let modal = document.getElementById("modal-overlay");
        modal.style.display = "none";
    }
    
    updateRedo(possible){
        if (possible){
            document.getElementById("redo-button").classList.add("todo_button");
        }
        else{
            document.getElementById("redo-button").classList.remove("todo_button");
        }
    }

    updateUndo(possible){
        if (possible){
            document.getElementById("undo-button").classList.add("todo_button");
        }
        else{
            document.getElementById("undo-button").classList.remove("todo_button");
        }
    }

    updateAddList(list){
        if (list == null){
            document.getElementById("add-list-button").classList.add("todo_button");
        }
        else{
            document.getElementById("add-list-button").classList.remove("todo_button");
        }
    }

    updateListEdit(list){
        if (list == null){
            document.getElementById("delete-list-button").classList.remove("todo_button");
            document.getElementById("add-item-button").classList.remove("todo_button");
            document.getElementById("close-list-button").classList.remove("todo_button");
        }
        else{
            document.getElementById("delete-list-button").classList.add("todo_button");
            document.getElementById("add-item-button").classList.add("todo_button");
            document.getElementById("close-list-button").classList.add("todo_button");
        }
    }

    selectListYellow(listId){
        let list = document.getElementById("todo-list-" + listId);
        list.classList.add("selected-list");
    }
}