import { CacheStore } from "./CacheStore";


export class MemoryCacheStore
implements CacheStore {


    private store =
        new Map<string, unknown>();


    async get<T>(
        key: string
    ): Promise<T | null> {


        const value =
            this.store.get(key);


        if (!value) {
            return null;
        }


        return value as T;

    }



    async set<T>(
        key: string,
        value: T
    ): Promise<void> {


        this.store.set(
            key,
            value
        );

    }



    async delete(
        key: string
    ): Promise<void> {


        this.store.delete(
            key
        );

    }


}