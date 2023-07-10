import { _DEG, inDegrees } from "@/lib/uitl"
import { ButtonGroup, Button, Typography } from "@mui/material"

interface Props {
    value: number,
    setValue: { (newValue: number): void }
    showValue?: boolean
}

export const RotationButtons = ({ value, setValue, showValue }: Props) => {

    const clockwise = () => {
        setValue(value - (5 * _DEG))
    }
    const antiClockwise = () => {
        setValue(value + (5 * _DEG))
    }

    return (
        <>
            <ButtonGroup size="small">
                <Button onClick={antiClockwise}>↺</Button>
                <Button onClick={clockwise}>↻</Button>
            </ButtonGroup>
            {showValue && <Typography variant="caption">{inDegrees(value).toFixed(0)}°</Typography>}
        </>
    )
}