import { Dispatch, SetStateAction, useState } from "react";

export function useArrayState<T>(initialValue: T[]): [
    T[],
    Dispatch<SetStateAction<T[]>>,
    {
        set: (index: number, newMember: T) => void;
        merge: (index: number, changes: Partial<T>) => void;
        push: (newMember: T) => void;
        deleteItem: (index: number) => void;
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

    return [array, setArray, { set, merge, push, deleteItem }]
}