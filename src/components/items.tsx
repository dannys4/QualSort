import React from 'react'

export class SortItem {
    /**
     * Represents an item to be sorted.
     */
    name: string = '';

    public toString() {
        return this.name;
    }
}

export class Equibundle {
    /**
     * Represents a "bundle" of objects that all have an equal value.
     * Can have qualities that might be used to sort.
     */
    id: number;
    items: Array<SortItem>;
    title: string = '';
    qualities: Map<string,number>|undefined;

    public constructor(id:number, items:Array<SortItem>, initializer?:any) {
        this.id = id;
        this.items = items;
        if(initializer.title) this.title = initializer.title;
        if(initializer.qualities) this.qualities = initializer.qualities;
    }
    public get_tag() {
        const list_str = this.items.toString();
        if(this.title != '') return [this.title, list_str];
        return list_str;
    }
}