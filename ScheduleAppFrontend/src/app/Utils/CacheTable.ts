import { BusinessHours } from "../Services/BusinessHoursService";
import CacheService from "../Services/CacheService";

type DatabaseTransaction<T> = {
    transaction : IDBTransaction,
    errorReturn : T | undefined
}

export class CacheTable<T> {
    private tableName : string = "";

    public constructor(name :string) {
        const db = CacheService.GetDBInstance();
        if (!db)
            return;
        this.tableName = name;
    }

    async All() : Promise<T[]> {
        return this.NewTransaction<T[]>('readonly', (transaction, store) => {
            return new Promise<T[]>(resolve => {
                const request = store.getAll();
                request.onerror = () => {
                    console.error("[IDB Error] All failed", request.error);
                    resolve([]);
                }
                request.onsuccess = () => {
                    resolve(request.result as T[]);
                }
            });
        });
    }

    async Get(id : number) : Promise<T|null> {
        return this.NewTransaction<T|null>('readonly', async (transaction, store) => {
            transaction.errorReturn = null;
            return new Promise<T|null>(resolve => {
                const request = store.get(id);
                request.onerror = () => {
                    console.error("[IDB Error] Get store failed", request.error);
                    resolve(null);
                }
                request.onsuccess = () => {
                    resolve((request.result as T) ?? null);
                    transaction.transaction.commit();
                }
            });
        });
        
    }

    async Add(value : T) : Promise<boolean> {
        return this.NewTransaction<boolean>('readwrite', async (transaction, store) => {
            transaction.errorReturn = false;
            return new Promise<boolean>(resolve => {
                const request = store.put(value);
                request.onerror = () => {
                    console.error("[IDB Error] Add store failed", request.error);
                    resolve(false);
                };
                request.onsuccess = () => {
                    resolve(true);
                    transaction.transaction.commit();
                }
            });
        })
    }

    async AddRange(values : T[]) : Promise<boolean> {
        return this.NewTransaction('readwrite', async (transaction, store) => {
            transaction.errorReturn = false;
            return new Promise<boolean>(async resolve => {
                for (let i = 0; i < values.length; i++) {
                    let result = await ((value : T) => {
                        return new Promise<boolean>(resolve => {
                            const request = store.put(value);
                            request.onerror = () => {
                                console.error(`[IDB Error] AddRange[${i}] store failed`, request.error);
                                resolve(false);
                            }
                            request.onsuccess = () => {
                                resolve(true);
                            }   
                        });
                    })(values[i]);
                    if (!result) {
                        resolve(false);
                        break;
                    }
                }
                resolve(true);
            });
        });
    }

    async Where(compFunc : (val : T) => boolean) {
        const all = await this.All();
        let result : T[] = [];
        all.forEach(val => {
            if (compFunc(val))
                result.push(val);
        });
        return result;
    }

    async Delete(id : number) : Promise<boolean> {
        return this.NewTransaction<boolean>("readwrite", (transaction, store) => {
            transaction.errorReturn = false;
            return new Promise<boolean>(resolve => {
                const request = store.delete(id);
                request.onerror = () => {
                    console.error("[IDB Error] Delete store failed", request.error);
                    resolve(false);
                }
                request.onsuccess = () => {
                    resolve(true);
                    transaction.transaction.commit();
                }
            });
        })
    }

    async DeleteRange(ids : number[]) : Promise<boolean> {
        return this.NewTransaction<boolean>('readwrite', (transaction, store) => {
            transaction.errorReturn = false;
            return new Promise<boolean>(async resolve => {
                for (let i = 0; i < ids.length; i++) {
                    const result = await ((id : number) => {
                        return new Promise<boolean>(resolve => {
                            const request = store.delete(id);
                            request.onerror = () => {
                                console.error(`[IDB Error] DeleteRange[${i}] delete failed`, request.error);
                                resolve(false);
                            }
                            request.onsuccess = () => {
                                resolve(true);
                            }
                        });
                    })(ids[i]);
                    if (!result) {
                        resolve(false);
                        break;
                    }
                }
                resolve(true);
            });
        });
    }

    async Clear() {
        return this.NewTransaction<boolean>('readwrite', (transaction, store) => {
            return new Promise<boolean>(resolve => {

                const request = store.clear();
                request.onerror = () => {
                    console.error("[IDB Error] Clear failed", request.error);
                    resolve(false);
                }
                request.onsuccess = () => {
                    resolve(true);     
                }
            });
        });
    }


    private async NewTransaction<T>(mode : IDBTransactionMode, actions : (transaction : DatabaseTransaction<T>, store : IDBObjectStore) => Promise<T>) {
        return new Promise<T>(async resolve => {
            const db = CacheService.GetDBInstance();
            if (db === null)
                return;
            
            const transaction = db.transaction(this.tableName, mode);
            const store = transaction.objectStore(this.tableName);

            let t = {transaction, errorReturn: undefined};
            const result = await actions(t, store);
            transaction.onerror = () => {
                console.error("[IDB Error] transaction failed", transaction.error);
                if (t.errorReturn !== undefined)
                    resolve(t.errorReturn);
                else
                    throw new DOMException("DatabaseTransaction errorReturn was not set.");
            }
            transaction.oncomplete = () => {
                resolve(result);
            }
        })
    }
}