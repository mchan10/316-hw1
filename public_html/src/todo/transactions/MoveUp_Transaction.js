'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class MoveUp_Transaction extends jsTPS_Transaction {
    constructor(initModel, item) {
        super();
        this.model = initModel;
        this.listItem = item;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.model.moveUp(this.listItem);
    }

    undoTransaction() {
        this.model.moveDown(this.listItem);
    }
}