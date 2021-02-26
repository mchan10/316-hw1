'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ChangeDate_Transaction extends jsTPS_Transaction {
    constructor(initModel, nudate, item) {
        super();
        this.model = initModel;
        this.newDate = nudate;
        this.listItem = item;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.oldDate = this.model.changeDate(this.newDate, this.listItem);
    }

    undoTransaction() {
        this.model.changeDate(this.oldDate, this.listItem);
    }
}