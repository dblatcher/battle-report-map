import { TextField } from "@mui/material";

interface Props {
    label: string;
    value: number;
    onChange: { (newValue: number): void }
    step?: number
}

export const NumberField = ({ label, value, onChange, step = 5 }: Props) => {

    return (
        <TextField label={label} size="small" variant='standard' sx={{ width: 80 }}
            type="number"
            value={value}
            onChange={(event) => { onChange(Number(event.target.value)) }}
            inputProps={{ step }} />
    )
}