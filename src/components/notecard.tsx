import React from 'react'
import { Equibundle, makeEquibundle } from './items';

function isEquibundle(obj:number|Equibundle): obj is Equibundle {
    return (obj as Equibundle).id !== undefined;
}

/**
 * Class to keep track of bundles for displaying and comparing bundles.
 */
export class Notecard {
    bundle: Equibundle
    public constructor(id:number|Equibundle, title?:string, ...args: Array<string>) {
        if(isEquibundle(id)) { // the first argument is just a bundle
            this.bundle = id;
        } else {
            if(title) {
                this.bundle = makeEquibundle(id, title, ...args);
            } else {
                throw Error("There must be at least one item on notecard")
            }
        }
    }
}

function DisplayNotecard() {
    return <h1>Notecard!</h1>;
}

export default DisplayNotecard