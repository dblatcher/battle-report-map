import { Markers, Position, Unit } from "@/types";
import { Box, Button, ButtonGroup, Checkbox, Stack } from "@mui/material";
import { UnitFigureInFrame } from "./UnitFigureInFrame";
import { _DEG } from "@/lib/uitl";
import { RotationSlider } from "./RotationSlider";

type Props = {
    unit: Unit,
    move: { (position: Position): void },
    index: number,
    activeIndex?: number,
    select: { (on: boolean): void }
    deleteUnit: { (): void }
    setMarkers: { (markers: Markers): void }
}

export const UnitControl = ({ unit, move, index, activeIndex, select, deleteUnit, setMarkers }: Props) => {

    const setRotation = (value: number) => {
        move({ ...unit, heading: value })
    }

    return (
        <Stack direction={'row'} spacing={1} alignItems={'center'} marginBottom={1} padding={1} borderColor={'primary.dark'} border={1}>
            <UnitFigureInFrame unit={unit} boxProps={{ flexBasis: 50 }} />
            <Box >
                <Stack direction={'row'} spacing={1} alignItems={'center'}  >
                    <Checkbox size="small" onChange={() => { select(activeIndex !== index) }} checked={activeIndex === index} />
                    <Button variant="outlined" size="small" onClick={deleteUnit}>X</Button>
                </Stack>
                <Stack direction={'row'}>
                    <RotationSlider value={unit.heading} setValue={setRotation} showValue />
                    <ButtonGroup size="small">
                        <Button onClick={() => {
                            setMarkers({
                                hits: 1 + (unit.hits ?? 0)
                            })
                        }}>hit+</Button>
                        <Button onClick={() => {
                            setMarkers({
                                hits: Math.max(-1 + (unit.hits ?? 0), 0)
                            })
                        }}>hit-</Button>
                    </ButtonGroup>
                </Stack>
            </Box>
        </Stack>
    )
}