import { NumberField } from "./NumberField";

interface Props {
    count?: number;
    setCount: { (newCount: number): void };
    label: string;
}

export const HitButtons = ({ count = 0, setCount, label }: Props) => {
    return (
        <NumberField label={label} value={count} onChange={setCount} min={0} step={1} />
    )
}