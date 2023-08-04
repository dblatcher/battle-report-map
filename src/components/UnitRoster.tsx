import { ArrayStateInterface } from "@/lib/useArrayState";
import { Unit } from "@/types";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DownloadableSvgFrame } from "./DownloadableSvgFrame";
import { UnitFigure } from "./UnitFigure";
import { FloodRect } from "./FloodRect";
import { HighPaddedCard } from "@/lib/customCards";
import ViewListIcon from '@mui/icons-material/ViewList';


interface Props {
    units: Unit[]
    unitArray: ArrayStateInterface<Unit>
}

const fontlist = [
    'arial,sans-serif,auto',
    'times,serif,auto',
    'cursive,sans-serif,auto',
    'monospace,serif,auto',
    'fantasy,sans-serif,auto'
]

export const UnitRoster = ({ units }: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState('#ffffff')
    const [textColor, setTextColor] = useState('#000000')
    const [font, setFont] = useState(fontlist[0])

    const widestUnitWidth = units.reduce<number>((max, nextUnit) => Math.max(max, nextUnit.width), 0)
    const longestNameLength = units.reduce<number>((max, nextUnit) => Math.max(max, nextUnit.name?.length ?? 0), 0)

    let lastBottom = 10
    const arrangedUnits: Unit[] = units.map((unit => {
        const newUnit = {
            ...unit,
            heading: 0,
            x: 10 + widestUnitWidth * .5,
            y: lastBottom + unit.height * .5
        }
        lastBottom += unit.height * 1.5 + 1
        return newUnit
    }))

    const viewBoxWidth = widestUnitWidth + 20 + (longestNameLength * 10)

    const viewBox = { height: lastBottom + 10, width: viewBoxWidth }

    return <>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Open roster"
            sx={{ mr: 2 }}
            onClick={() => { setDialogOpen(true) }}
        ><ViewListIcon /></IconButton>

        <Dialog fullWidth
            open={dialogOpen}
            onClose={() => { setDialogOpen(false) }}>
            <DialogTitle>Unit Roster</DialogTitle>

            <DialogActions>

                <FormControl size="small">
                    <InputLabel>Font</InputLabel>
                    <Select
                        value={font}
                        label="font"
                        onChange={(event) => {
                            setFont(event.target.value)
                        }}
                    >
                        {fontlist.map(font => (
                            <MenuItem key={font} value={font}>{font.split(',')[0]}</MenuItem>
                        ))}

                    </Select>
                </FormControl>

                <TextField size="small"
                    sx={{ minWidth: 100 }}
                    label='background'
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => { setBackgroundColor(event.target.value) }} />

                <TextField size="small"
                    sx={{ minWidth: 100 }}
                    label='text'
                    type="color"
                    value={textColor}
                    onChange={(event) => { setTextColor(event.target.value) }} />
                <Button onClick={() => { setDialogOpen(false) }}>close</Button>
            </DialogActions>

            <DialogContent>
                <DownloadableSvgFrame
                    fileName="roster"
                    viewBox={viewBox}
                    boxProps={{ component: HighPaddedCard, marginY: 1, marginX: 3 }}
                    innerBoxProps={{ maxHeight: 450, display: 'flex', margin: 1 }}
                >
                    <FloodRect fill={backgroundColor} viewBox={viewBox} />
                    {arrangedUnits.map((unit, index) => (
                        <UnitFigure unit={unit} key={index} />
                    ))}

                    {arrangedUnits.map((unit, index) => (
                        <text key={index}
                            fontFamily={font}
                            fill={textColor}
                            x={widestUnitWidth + 20}
                            y={unit.y + (unit.height / 8)}
                        >{unit.name}</text>
                    ))}
                </DownloadableSvgFrame>
            </DialogContent>
        </Dialog>
    </>
}