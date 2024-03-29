import { TextField } from "@mui/material";

interface Props {
    label: string;
    value: number;
    onChange: { (newValue: number): void }
    step?: number
    min?: number
    max?: number
}

export const NumberField = ({ label, value, onChange, step = 5, min, max }: Props) => {

    return (
        <TextField label={label} size="small" variant='outlined' sx={{ width: 80 }}
            type="number"
            value={value}
            onChange={(event) => { onChange(Number(event.target.value)) }}
            inputProps={{ step, min, max }} />
    )
}