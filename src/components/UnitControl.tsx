import { Position, Unit } from "@/types";
import { Box, Button, Typography } from "@mui/material";

type Props = { unit: Unit, move: { (position: Position): void } }

export const UnitControl = ({ unit, move }: Props) => {

    const up = () => {
        move({ ...unit, y: unit.y - 5 })
    }
    const down = () => {
        move({ ...unit, y: unit.y + 5 })
    }
    const left = () => {
        move({ ...unit, x: unit.x - 5 })
    }
    const right = () => {
        move({ ...unit, x: unit.x + 5 })
    }
    const clockwise = () => {
        move({ ...unit, heading: (unit.heading ?? 0) - .1 })
    }
    const antiClockwise = () => {
        move({ ...unit, heading: (unit.heading ?? 0) + .1 })
    }

    return (
        <Box borderColor={'primary.dark'} border={1} marginBottom={1} padding={1}>
            <Typography>[{unit.x}, {unit.y}] {unit.heading?.toFixed(1)}</Typography>
            <Button size="small" onClick={up}>&uarr;</Button>
            <Button size="small" onClick={down}>&darr;</Button>
            <Button size="small" onClick={left}>&larr;</Button>
            <Button size="small" onClick={right}>&rarr;</Button>
            <Button size="small" onClick={antiClockwise}>↺</Button>
            <Button size="small" onClick={clockwise}>↻</Button>
        </Box>
    )
}