import { KeyValue } from "@angular/common";
import { App } from "../App.component";

export class DataCacheMap<K, V> {
    name : string = "";

    public constructor(name : string) {
        if (name === "")
            throw new DOMException("Cache name string is empty");

        this.name = name;
        this.Cache();
    }

    public Set(key : K, value : V) {
        let cache = this.Cache();
        cache.set(key, value);
        this.Write(cache);
    }

    public All() : Map<K, V> {
        return this.Cache();
    }

    public Get(key : K) : V | null {
        return this.Cache().get(key) ?? null;
    }

    public Delete(key : K) {
        let cache = this.Cache();
        cache.delete(key);
        this.Write(cache);
    }

    public Clear() {
        this.Write(new Map<K, V>());
    }

    public Contains(key : K) : boolean {
        return this.Cache().has(key);
    }

    private Cache() {
        if (this.name === "")
            throw new DOMException("Cache name string is empty");
        if (localStorage.getItem(this.name) === null)
            localStorage.setItem(this.name, JSON.stringify(new Map<K, V>));

        const item = localStorage.getItem(this.name);
        const obj = JSON.parse(item!);
        return new Map<K, V>(Array.from(obj));
    }

    private Write(cache : Map<K, V>) {
        localStorage.setItem(this.name, JSON.stringify(Array.from(cache)));
    }
}

export class DataCache<T> {
    name : string = "";

    public constructor(name : string) {
        if (name === "")
            throw new DOMException("Cache name string is empty");

        this.name = name;
        this.Cache();
    }

    public Set(value : T) {
        this.Write(value);
    }

    public Get() : T | null {
        return this.Cache();
    }

    public Delete() {
        localStorage.removeItem(this.name);
    }

    public Is(value : T | null) : boolean {
        return this.Cache() === value;
    }

    private Cache() : T | null {
        if (this.name === "")
            throw new DOMException("Cache name string is empty");

        const item = localStorage.getItem(this.name);
        return item !== null ? JSON.parse(item) as T : null;
    }

    private Write(value : T | object) {
        localStorage.setItem(this.name, JSON.stringify(value));
    }
}