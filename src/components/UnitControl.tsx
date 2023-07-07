import { Position, Unit } from "@/types";
import { Box, Button, ButtonGroup, Stack, Switch, Typography } from "@mui/material";
import { RectangularUnitInFrame } from "./RectangularUnitInFrame";
import { _DEG, inDegrees } from "@/lib/uitl";

type Props = {
    unit: Unit,
    move: { (position: Position): void },
    index: number,
    activeIndex?: number,
    select: { (on: boolean): void }
}

export const UnitControl = ({ unit, move, index, activeIndex, select }: Props) => {

    const clockwise = () => {
        move({ ...unit, heading: (unit.heading ?? 0) - 5 * _DEG })
    }
    const antiClockwise = () => {
        move({ ...unit, heading: (unit.heading ?? 0) + 5 * _DEG })
    }

    return (
        <Stack padding={1} direction={'row'} spacing={1} alignItems={'center'} marginBottom={1} borderColor={'primary.dark'} border={1} >
            <RectangularUnitInFrame unit={unit} boxProps={{ flexBasis: 50 }} />
            <Box>
                <Stack direction={'row'}>
                    <Switch size="small" onChange={() => { select(activeIndex !== index) }} checked={activeIndex === index} />
                    <ButtonGroup>
                        <Button size="small" onClick={antiClockwise}>↺</Button>
                        <Button size="small" onClick={clockwise}>↻</Button>
                    </ButtonGroup>
                </Stack>
                <Typography>[{unit.x}, {unit.y}] {inDegrees(unit.heading ?? 0)?.toFixed(0)}°</Typography>
            </Box>
        </Stack>
    )
}