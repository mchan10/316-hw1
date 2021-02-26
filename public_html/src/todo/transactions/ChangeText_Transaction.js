'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ChangeText_Transaction extends jsTPS_Transaction {
    constructor(initModel, nutext, item) {
        super();
        this.model = initModel;
        this.newText = nutext;
        this.listItem = item;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.oldText = this.model.changeText(this.newText, this.listItem);
    }

    undoTransaction() {
        this.model.changeText(this.oldText, this.listItem);
    }
}