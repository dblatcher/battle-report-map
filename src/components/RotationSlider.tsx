import { _DEG, inDegrees, inRads } from "@/lib/uitl"
import { Typography, Slider, Stack, Box } from "@mui/material"

interface Props {
    value: number,
    setValue: { (newValue: number): void }
    showValue?: boolean
}

export const RotationSlider = ({ value, setValue, showValue }: Props) => {

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };

    return (
        <Stack paddingX={1} direction="column" alignItems="center">
            <Stack spacing={2} direction="row" alignItems="center" sx={{ width: 80 }}>
                <Slider value={value} onChange={handleChange}
                    step={inRads(5)}
                    min={0}
                    max={inRads(360)} />
            </Stack>
            {showValue && <Typography variant="caption">{inDegrees(value).toFixed(0)}°</Typography>}
        </Stack>
    )
}