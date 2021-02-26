'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ChangeStatus_Transaction extends jsTPS_Transaction {
    constructor(initModel, nustatus, item) {
        super();
        this.model = initModel;
        this.newStatus = nustatus;
        this.listItem = item;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.oldStatus = this.model.changeStatus(this.newStatus, this.listItem);
    }

    undoTransaction() {
        this.model.changeStatus(this.oldStatus, this.listItem);
    }
}