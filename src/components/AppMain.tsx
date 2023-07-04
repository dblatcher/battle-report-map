'use client'

import { Button, Container, Typography } from "@mui/material"
import { SvgFrame } from "./SvgFrame"
import { useState } from "react"
import { Unit } from "@/types"
import { RectangularUnit } from "./RectangularUnit"

export const AppMain = () => {

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

    return (
        <Container maxWidth={'xl'}>
            <Typography variant="h2">app</Typography>

            <SvgFrame style={{ backgroundColor: 'lightgreen' }}>
                {units.map((unit, index) => <RectangularUnit key={index} {...unit} />)}
            </SvgFrame>
            <Button onClick={doSomething}>do something</Button>
        </Container>
    )
}