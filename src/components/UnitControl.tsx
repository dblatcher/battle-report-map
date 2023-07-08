import { Markers, Position, Unit } from "@/types";
import { Box, Button, ButtonGroup, Stack, Switch, Typography } from "@mui/material";
import { UnitFigureInFrame } from "./UnitFigureInFrame";
import { _DEG, inDegrees } from "@/lib/uitl";

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

    const clockwise = () => {
        move({ ...unit, heading: (unit.heading ?? 0) - 5 * _DEG })
    }
    const antiClockwise = () => {
        move({ ...unit, heading: (unit.heading ?? 0) + 5 * _DEG })
    }

    return (
        <Box padding={1} borderColor={'primary.dark'} border={1}>
            <Typography>[{unit.x}, {unit.y}] {inDegrees(unit.heading ?? 0)?.toFixed(0)}°</Typography>
            <Stack direction={'row'} spacing={1} alignItems={'center'} marginBottom={1}  >
                <UnitFigureInFrame unit={unit} boxProps={{ flexBasis: 50 }} />
                <Stack direction={'row'}>
                    <Switch size="small" onChange={() => { select(activeIndex !== index) }} checked={activeIndex === index} />
                    <ButtonGroup>
                        <Button size="small" onClick={antiClockwise}>↺</Button>
                        <Button size="small" onClick={clockwise}>↻</Button>
                    </ButtonGroup>
                </Stack>

                <Button variant="outlined" size="small" onClick={deleteUnit}>X</Button>
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
    )
}