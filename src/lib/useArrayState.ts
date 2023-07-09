import { Dispatch, SetStateAction, useState } from "react";

export function useArrayState<T extends object>(initialValue: T[]): [
    T[],
    {
        set: (index: number, newMember: T) => void;
        merge: (index: number, changes: Partial<T>) => void;
        push: (newMember: T) => void;
        deleteItem: (index: number) => void;
        setArray: Dispatch<SetStateAction<T[]>>;
    }
] {
    const [array, setArray] = useState<T[]>(initialValue)

    const set = (index: number, newMember: T) => {
        if (!array[index]) {
            return
        }
        return setArray([
            ...array.slice(0, index),
            newMember,
            ...array.slice(index + 1)
        ])
    }
    const merge = (index: number, changes: Partial<T>) => {
        if (!array[index]) {
            return
        }
        return setArray([
            ...array.slice(0, index),
            { ...array[index], ...changes },
            ...array.slice(index + 1)
        ])
    }
    const push = (newMember: T) => {
        return setArray([
            ...array,
            newMember,
        ])
    }
    const deleteItem = (index: number) => {
        return setArray([
            ...array.slice(0, index),
            ...array.slice(index + 1)
        ])
    }

    return [array, { set, merge, push, deleteItem, setArray }]
}