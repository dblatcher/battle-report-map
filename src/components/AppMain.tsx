'use client'

import { useArrayState } from "@/lib/useArrayState"
import { Position, Unit, UnitDesign } from "@/types"
import { Box, Button, Container, Dialog, DialogContent, Grid, Typography } from "@mui/material"
import { useState } from "react"
import { DownloadableSvgFrame } from "./DownloadableSvgFrame"
import { RectangularUnit } from "./RectangularUnit"
import { UnitControl } from "./UnitControl"
import { UnitDesigner } from "./UnitDesigner"

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
                    <DownloadableSvgFrame fileName="map.png" boxProps={{ border: '1px solid black', padding: 1 }}>
                        {units.map((unit, index) => <RectangularUnit key={index} {...unit} />)}
                    </DownloadableSvgFrame>
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