import { Dispatch, SetStateAction, useState } from "react";

export function useObjectState<T extends object>(initialValue: T): [
    T,
    {
        set: Dispatch<SetStateAction<T>>;
        merge: (changes: Partial<T>) => void;
    }
] {
    const [value, set] = useState<T>(initialValue)
    const merge = (changes: Partial<T>) => {
        return set(
            { ...value, ...changes },
        )
    }

    return [value, { set, merge }]
}