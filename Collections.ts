namespace Com.JohnathonDev.Utilities.Collections {

    export interface IEnumerable<T> {
        Next(): T;

        Reset();
    }

    export interface ICollection<T> {
        ToArray(): T[];

        Count: number;

        ForEachAlter(operation: (T, number) => T): ICollection<T>;

        ForEachRead(operation: (T, number) => void): ICollection<T>;

        Where(identifyBy: (T) => boolean): ICollection<T>;

        OrderBy(field: string, direction: DirectionTypeEnum): ICollection<T>;

        LastOrDefault(identifyBy: (T) => boolean): T;

        FirstOrDefault(identifyBy: (T) => boolean): T;

        Any(identifyBy: (T) => boolean): boolean;

        None(identifyBy: (T) => boolean): boolean;

        All(identifyBy: (T) => boolean): boolean;

        Sum(field: string): number;

        Avg(field: string): number;

        Max(field: string): number;

        Min(field: string): number;

        Convert<T2>(converter: (T) => T2): ICollection<T2>;
    }

    export interface IList<T> {
        Add(item: T);

        Remove(item: T);
    }

    export interface IIndexable<T> {
        GetAtIndex(index: number): T;

        RemoveAtIndex(index: number);
    }

    export interface IStack<T> {
        Push(item: T);

        Pop(): T;
    }

    export interface IQueue<T> {
        Enqueue(item: T);

        Dequeue(): T;
    }

    export interface IDictionary<Tkey, Tval> {
        GetByKey(key: Tkey): Tval;

        GetKeyByIndex(index: number): Tkey;

        GetValueByIndex(index: number): Tval;

        AddItem(key: Tkey, value: Tval);

        RemoveItem(key: Tkey);

        GetKeys(): ICollection<Tkey>;

        GetValues(): ICollection<Tval>;

        Count: number;
    }

    export interface IDictItem<Tkey, Tval> {
        Key: Tkey;
        Value: Tval;
    }

//Enums
    export enum DirectionTypeEnum {
        Ascending = 0,
        Descending = 1
    }

//Implementations
    export class List<T> implements ICollection<T>, IList<T>, IEnumerable<T>, IIndexable<T> {
        private _items: T[];
        private _counter: number;
        private _location: number;

        constructor(items: T[]) {
            this._items = items;
            if (items) {
                this._counter = items.length;
            } else {
                this._counter = 0;
            }
        }

        //Implement ICollection
        ToArray(): T[] {
            return this._items;
        }

        get Count(): number {
            return this._counter;
        }

        ForEachAlter(operation: (T, number) => T): ICollection<T> {
            this.Reset();
            while (this.Peek()) {
                let item = this.Next();
                let index = this._location;
                this._items[index] = operation(item, index)
            }

            return this;
        }

        ForEachRead(operation: (T, number) => void): ICollection<T> {
            this.Reset();
            while (this.Peek()) {
                let item = this.Next();
                let index = this._location;
                operation(item, index)
            }
            return this;
        }

        Where(identifyBy: (T) => boolean): ICollection<T> {
            let list: T[];
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    list.push(val);
                }
            });
            return new List<T>(list);
        }

        OrderBy(field: string, direction: DirectionTypeEnum): ICollection<T> {
            if (direction === DirectionTypeEnum.Ascending) {
                this._items.sort(function (a, b) {
                    if (a[field] < b[field]) {
                        return -1;
                    }
                    if (a[field] > b[field]) {
                        return 1;
                    }
                    return 0;
                });
            }

            if (direction === DirectionTypeEnum.Descending) {
                this._items.sort(function (a, b) {
                    if (a[field] > b[field]) {
                        return -1;
                    }
                    if (a[field] < b[field]) {
                        return 1;
                    }
                    return 0;
                });
            }

            return this;
        }

        LastOrDefault(identifyBy: (T) => boolean): T {
            let item: T;
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    item = val;
                }
            });
            return item;
        }

        FirstOrDefault(identifyBy: (T) => boolean): T {
            let item: T;
            let list = this._items.reverse();
            let target = new List<T>(list);
            target.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    item = val;
                }
            });
            return item;
        }

        Any(identifyBy: (T) => boolean): boolean {
            let result = false;
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    result = true;
                }
            });
            return result;
        }

        None(identifyBy: (T) => boolean): boolean {
            return !this.Any(identifyBy);
        }

        All(identifyBy: (T) => boolean): boolean {
            let result = true;
            this.ForEachRead(function (val) {
                if (!identifyBy(val)) {
                    result = false;
                }
            });
            return result;
        }

        Sum(field: string): number {
            let total = 0;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        total = total + val[field];
                    }
                }
            });
            return total;
        }

        Avg(field: string): number {
            let total = 0;
            let count = 0;
            this.ForEachRead(function (val) {
                count++;
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        total = total + val[field];
                    }
                }
            });
            return total / count;
        }

        Max(field: string): number {
            let high: number;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        if (!high) {
                            high = val[field];
                        }
                        if (val[field] > high) {
                            high = val[field]
                        }
                    }
                }
            });
            return high;
        }

        Min(field: string): number {
            let low: number;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        if (!low) {
                            low = val[field];
                        }
                        if (val[field] < low) {
                            low = val[field];
                        }
                    }
                }
            });
            return low;
        }

        Convert<T2>(converter: (T) => T2): ICollection<T2> {
            let list: T2[];
            this.ForEachRead(function (val) {
                let newVal = converter(val);
                list.push(newVal);
            });
            return new List<T2>(list);
        }

        //IList Implementation
        Add(item: T) {
            this._items.push(item);
            this._counter = this._counter + 1;
        }

        Remove(item: T) {
            let indexOfItem: number;

            this.ForEachRead(function (val, index) {
                if (val === item) {
                    indexOfItem = index;
                }
            });

            if (indexOfItem && indexOfItem > -1) {
                this._items.splice(indexOfItem, 1);
            }

            this._counter = this._counter - 1;
        }

        //IEnumerable Implementation
        Next(): T {
            this._location++;
            return this._items[this._location];
        }

        Reset() {
            this._location = -1;
        }

        Peek(): boolean {
            let itemLoc = this._location + 1
            return this._items[itemLoc] != null;
        }

        //Implement Indexable
        GetAtIndex(index: number): T {
            return this._items[index];
        }

        RemoveAtIndex(index: number) {
            this._items.splice(index, 1);
            this._counter -= 1;
        }
    }

    export class Stack<T> implements IStack<T>, ICollection<T>, IEnumerable<T> {
        private _items: T[];
        private _counter: number;
        private _location: number;

        constructor(items: T[]) {
            this._items = items;
            if (items) {
                this._counter = items.length;
            } else {
                this._counter = 0;
            }
        }

        //Implement ICollection
        ToArray(): T[] {
            return this._items;
        }

        get Count(): number {
            return this._counter;
        }

        ForEachAlter(operation: (T, number) => T): ICollection<T> {
            this.Reset();
            while (this.Peek()) {
                let item = this.Next();
                let index = this._location;
                this._items[index] = operation(item, index)
            }

            return this;
        }

        ForEachRead(operation: (T, number) => void): ICollection<T> {
            this.Reset();
            while (this.Peek()) {
                let item = this.Next();
                let index = this._location;
                operation(item, index)
            }
            return this;
        }

        Where(identifyBy: (T) => boolean): ICollection<T> {
            let list: T[];
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    list.push(val);
                }
            });
            return new List<T>(list);
        }

        OrderBy(field: string, direction: DirectionTypeEnum): ICollection<T> {
            if (direction === DirectionTypeEnum.Ascending) {
                this._items.sort(function (a, b) {
                    if (a[field] < b[field]) {
                        return -1;
                    }
                    if (a[field] > b[field]) {
                        return 1;
                    }
                    return 0;
                });
            }

            if (direction === DirectionTypeEnum.Descending) {
                this._items.sort(function (a, b) {
                    if (a[field] > b[field]) {
                        return -1;
                    }
                    if (a[field] < b[field]) {
                        return 1;
                    }
                    return 0;
                });
            }

            return this;
        }

        LastOrDefault(identifyBy: (T) => boolean): T {
            let item: T;
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    item = val;
                }
            });
            return item;
        }

        FirstOrDefault(identifyBy: (T) => boolean): T {
            let item: T;
            let list = this._items.reverse();
            let target = new List<T>(list);
            target.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    item = val;
                }
            });
            return item;
        }

        Any(identifyBy: (T) => boolean): boolean {
            let result = false;
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    result = true;
                }
            });
            return result;
        }

        None(identifyBy: (T) => boolean): boolean {
            return !this.Any(identifyBy);
        }

        All(identifyBy: (T) => boolean): boolean {
            let result = true;
            this.ForEachRead(function (val) {
                if (!identifyBy(val)) {
                    result = false;
                }
            });
            return result;
        }

        Sum(field: string): number {
            let total = 0;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        total = total + val[field];
                    }
                }
            });
            return total;
        }

        Avg(field: string): number {
            let total = 0;
            let count = 0;
            this.ForEachRead(function (val) {
                count++;
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        total = total + val[field];
                    }
                }
            });
            return total / count;
        }

        Max(field: string): number {
            let high: number;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        if (!high) {
                            high = val[field];
                        }
                        if (val[field] > high) {
                            high = val[field]
                        }
                    }
                }
            });
            return high;
        }

        Min(field: string): number {
            let low: number;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        if (!low) {
                            low = val[field];
                        }
                        if (val[field] < low) {
                            low = val[field];
                        }
                    }
                }
            });
            return low;
        }

        Convert<T2>(converter: (T) => T2): ICollection<T2> {
            let list: T2[];
            this.ForEachRead(function (val) {
                let newVal = converter(val);
                list.push(newVal);
            });
            return new List<T2>(list);
        }

        //Istack Implementation
        Push(item: T) {
            this._items.push(item);
            this._counter = this._counter + 1;
        }

        Pop(): T {
            let item = this._items.pop();
            this._counter = this._counter - 1;
            return item;
        }

        //IEnumerable Implementation
        Next(): T {
            this._location++;
            return this._items[this._location];
        }

        Reset() {
            this._location = -1;
        }

        Peek(): boolean {
            let itemLoc = this._location + 1
            return this._items[itemLoc] != null;
        }

    }

    export class Queue<T> implements IQueue<T>, ICollection<T>, IEnumerable<T> {
        private _items: T[];
        private _counter: number;
        private _location: number;

        constructor(items: T[]) {
            this._items = items;
            if (items) {
                this._counter = items.length;
            } else {
                this._counter = 0;
            }
        }

        //Implement ICollection
        ToArray(): T[] {
            return this._items;
        }

        get Count(): number {
            return this._counter;
        }

        ForEachAlter(operation: (T, number) => T): ICollection<T> {
            this.Reset();
            while (this.Peek()) {
                let item = this.Next();
                let index = this._location;
                this._items[index] = operation(item, index)
            }

            return this;
        }

        ForEachRead(operation: (T, number) => void): ICollection<T> {
            this.Reset();
            while (this.Peek()) {
                let item = this.Next();
                let index = this._location;
                operation(item, index)
            }
            return this;
        }

        Where(identifyBy: (T) => boolean): ICollection<T> {
            let list: T[];
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    list.push(val);
                }
            });
            return new List<T>(list);
        }

        OrderBy(field: string, direction: DirectionTypeEnum): ICollection<T> {
            if (direction === DirectionTypeEnum.Ascending) {
                this._items.sort(function (a, b) {
                    if (a[field] < b[field]) {
                        return -1;
                    }
                    if (a[field] > b[field]) {
                        return 1;
                    }
                    return 0;
                });
            }

            if (direction === DirectionTypeEnum.Descending) {
                this._items.sort(function (a, b) {
                    if (a[field] > b[field]) {
                        return -1;
                    }
                    if (a[field] < b[field]) {
                        return 1;
                    }
                    return 0;
                });
            }

            return this;
        }

        LastOrDefault(identifyBy: (T) => boolean): T {
            let item: T;
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    item = val;
                }
            });
            return item;
        }

        FirstOrDefault(identifyBy: (T) => boolean): T {
            let item: T;
            let list = this._items.reverse();
            let target = new List<T>(list);
            target.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    item = val;
                }
            });
            return item;
        }

        Any(identifyBy: (T) => boolean): boolean {
            let result = false;
            this.ForEachRead(function (val) {
                if (identifyBy(val)) {
                    result = true;
                }
            });
            return result;
        }

        None(identifyBy: (T) => boolean): boolean {
            return !this.Any(identifyBy);
        }

        All(identifyBy: (T) => boolean): boolean {
            let result = true;
            this.ForEachRead(function (val) {
                if (!identifyBy(val)) {
                    result = false;
                }
            });
            return result;
        }

        Sum(field: string): number {
            let total = 0;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        total = total + val[field];
                    }
                }
            });
            return total;
        }

        Avg(field: string): number {
            let total = 0;
            let count = 0;
            this.ForEachRead(function (val) {
                count++;
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        total = total + val[field];
                    }
                }
            });
            return total / count;
        }

        Max(field: string): number {
            let high: number;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        if (!high) {
                            high = val[field];
                        }
                        if (val[field] > high) {
                            high = val[field]
                        }
                    }
                }
            });
            return high;
        }

        Min(field: string): number {
            let low: number;
            this.ForEachRead(function (val) {
                if (val.hasOwnProperty(field)) {
                    if (!isNaN(val[field])) {
                        if (!low) {
                            low = val[field];
                        }
                        if (val[field] < low) {
                            low = val[field];
                        }
                    }
                }
            });
            return low;
        }

        Convert<T2>(converter: (T) => T2): ICollection<T2> {
            let list: T2[];
            this.ForEachRead(function (val) {
                let newVal = converter(val);
                list.push(newVal);
            });
            return new List<T2>(list);
        }

        //Istack Implementation
        Enqueue(item: T) {
            this._items.push(item);
            this._counter = this._counter + 1;
        }

        Dequeue(): T {
            let item = this._items[0];
            this._items.splice(0, 1);
            this._counter = this._counter - 1;
            return item;
        }

        //IEnumerable Implementation
        Next(): T {
            this._location++;
            return this._items[this._location];
        }

        Reset() {
            this._location = -1;
        }

        Peek(): boolean {
            let itemLoc = this._location + 1
            return this._items[itemLoc] != null;
        }

    }

    export class DictItem<Tkey, Tval> implements IDictItem<Tkey, Tval> {
        Key: Tkey;
        Value: Tval;

        constructor(key: Tkey, value: Tval) {
            this.Key = key;
            this.Value = value;
        }
    }

    export class Dictionary<Tkey, Tval> implements IDictionary<Tkey, Tval> {
        private _items: List<IDictItem<Tkey, Tval>>;

        constructor() {
            this._items = new List<DictItem<Tkey, Tval>>([]);
        }

        //Implement IDictionary
        GetByKey(key: Tkey): Tval {
            return this._items.FirstOrDefault(function (val) {
                return val.Key === key;
            }).Value;
        }

        GetKeyByIndex(index: number): Tkey {
            return this._items.GetAtIndex(index).Key;
        }

        GetValueByIndex(index: number): Tval {
            return this._items.GetAtIndex(index).Value;
        }

        AddItem(key: Tkey, value: Tval) {
            if (this._items.Any(function (val) {
                    return val.Key === key;
                })) {
                console.error("Unable to add item to dictionay.  Key already exists!");
                return;
            }
            this._items.Add(new DictItem(key, value));
        }

        RemoveItem(key: Tkey) {
            let itemIndex: number;
            this._items.ForEachRead(function (item, index) {
                if (item.Key === key) {
                    itemIndex = index;
                }
            })
            this._items.RemoveAtIndex(itemIndex);
        }

        GetKeys(): ICollection<Tkey> {
            let list = this._items.Convert(function (val) {
                return val.Key;
            });
            return list;
        }

        GetValues(): ICollection<Tval> {
            let list = this._items.Convert(function (val) {
                return val.Value;
            });
            return list;
        }

        get Count(): number {
            return this._items.Count;
        }


    }
}

