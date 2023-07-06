'use client'

import { Box, Button, Container, Dialog, DialogContent, Grid, Typography } from "@mui/material"
import { SvgFrame } from "./SvgFrame"
import { useState } from "react"
import { Position, Unit, UnitDesign } from "@/types"
import { RectangularUnit } from "./RectangularUnit"
import { UnitDesigner } from "./UnitDesigner"
import { UnitControl } from "./UnitControl"
import { useArrayState } from "@/lib/useArrayState"
import { svgToPng } from "@/lib/svgToPng"

export const AppMain = () => {
    const [unitDesignerOpen, setUnitDesignerOpen] = useState(false)
    const [units, setUnits, unit] = useArrayState<Unit>([])

    const handleConfirmDesign = (unit: UnitDesign) => {
        setUnitDesignerOpen(false)
        setUnits([
            ...units,
            {
                ...unit,
                x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100),
                heading: 0,
            }
        ])
    }

    const handleMove = (position: Position, index: number) => {
        unit.merge(index, position)
    }

    return (
        <Container maxWidth={'lg'}>
            <Typography variant="h2">app</Typography>
            <Grid container>
                <Grid item xs={8}>
                    <SvgFrame style={{ backgroundColor: 'lightgreen' }} refFunc={svgToPng}>
                        {units.map((unit, index) => <RectangularUnit key={index} {...unit} />)}
                    </SvgFrame>
                </Grid>
                <Grid item xs={4}>
                    {units.map((unit, index) => <UnitControl key={index} unit={unit} move={(position) => { handleMove(position, index) }} />)}
                    <Box>
                        <Button variant="outlined" onClick={() => { setUnitDesignerOpen(true) }}>add unit</Button>
                    </Box>
                </Grid>
            </Grid>

            <Dialog open={unitDesignerOpen}>
                <DialogContent>
                    <UnitDesigner confirm={handleConfirmDesign} />
                </DialogContent>
            </Dialog>
        </Container>
    )
}