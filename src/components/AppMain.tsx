'use client'

import { Box, Button, Container, Dialog, DialogContent, Typography } from "@mui/material"
import { SvgFrame } from "./SvgFrame"
import { useState } from "react"
import { Unit, UnitDesign } from "@/types"
import { RectangularUnit } from "./RectangularUnit"
import { UnitDesigner } from "./UnitDesigner"

export const AppMain = () => {
    const [unitDesignerOpen, setUnitDesignerOpen] = useState(false)
    const [units, setUnits] = useState<Unit[]>([
        {
            x: 45,
            y: 40,
            width: 20,
            height: 20,
            heading: 1,
            col1: "green",
            col2: "white",
            patternShape: "right-diagonal",
        }
    ])

    const doSomething = () => {
        setUnits([
            { ...units[0], heading: (units[0].heading || 0) + .1 }
        ])
    }

    const handleConfirmDesign = (unit: UnitDesign) => {
        setUnitDesignerOpen(false)
        setUnits([
            ...units,
            {
                ...unit,
                x: Math.floor(Math.random() * 100), 
                y: Math.floor(Math.random() * 100), 
                heading: .1
            }
        ])
    }

    return (
        <Container maxWidth={'lg'}>
            <Typography variant="h2">app</Typography>

            <Box>
                <Button onClick={() => { setUnitDesignerOpen(true) }}>add unit</Button>
            </Box>

            <SvgFrame style={{ backgroundColor: 'lightgreen', maxWidth: '500px' }}>
                {units.map((unit, index) => <RectangularUnit key={index} {...unit} />)}
            </SvgFrame>
            <Button onClick={doSomething}>do something</Button>

            <Dialog open={unitDesignerOpen}>
                <DialogContent>
                    <UnitDesigner confirm={handleConfirmDesign} />
                </DialogContent>
            </Dialog>
        </Container>
    )
}