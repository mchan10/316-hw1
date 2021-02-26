'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class MoveDown_Transaction extends jsTPS_Transaction {
    constructor(initModel, item) {
        super();
        this.model = initModel;
        this.listItem = item;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.position = this.model.deleteItem(this.listItem);
    }

    undoTransaction() {
        this.model.addItem(this.position, this.listItem);
    }
}