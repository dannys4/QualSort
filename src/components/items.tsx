export class SortItem {
    /**
     * Represents an item to be sorted.
     */
    member: string;
    email: string|undefined;

    public constructor(name:string,email?:string) {
        this.member = name;
        this.email = email;
    }

    public toString() {
        if(this.email) {
            return this.member + "," + this.email;
        }else return this.member;
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

    public constructor(id:number, items:Array<SortItem>|SortItem, initializer:any = {}) {
        this.id = id;
        if('length' in items){
            this.items = items as SortItem[];
        } else {this.items = [items as SortItem];}
        // Title and qualities are optional fields
        if(initializer.title) this.title = initializer.title;
        if(initializer.qualities) this.qualities = initializer.qualities;
    }

    /**
     * Function to see what the bundle should print.
     * Returns array of length 2 if the bundle has a title.
     * Otherwise returns a string
     * @returns String(s) representing this bundle
     */
    public get_tag() {
        const list_str = this.items.toString();
        if(this.title !== '') return [this.title, list_str];
        return list_str;
    }

    public memberString() {
        const arr = this.items.map((item)=>{return item.member;});
        return arr.join(", ");
    }

    public toString() {
        var ret_str = this.items.map((item)=>{return item.member;}).toString();
        if(this.title) {
            ret_str += ", title: " + this.title;
        }
        if(this.qualities) {
            ret_str += ", qualities: " + this.qualities.toString();
        }
        return ret_str;
    }
}

/**
 * Factory method to create an equibundle that has no qualifiers
 * @param id Identifier for the bundle
 * @param title Optional title of the bundle
 * @param args Contents of the bundle
 */
export function makeEquibundle(id:number, title:string, ...args:Array<string>) {
    if(args.length < 1) { // The title is the args
        const items = [new SortItem(title)];
        return new Equibundle(id, items);
    } else { // Must convert all args to type SortItem
        var items = Array<SortItem>(args.length)
        for(let j = 0; j < args.length; j++) {
            items[j] = new SortItem(args[j]);
        }
        return new Equibundle(id, items, {title: title});
    }
}