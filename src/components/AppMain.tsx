import { useArrayState } from "@/lib/useArrayState"
import { Position, Unit, UnitDesign, ViewBox } from "@/types"
import { Box, Button, Container, Dialog, DialogContent, Grid, Typography } from "@mui/material"
import { useState } from "react"
import { DownloadableSvgFrame } from "./DownloadableSvgFrame"
import { UnitFigure } from "./UnitFigure"
import { UnitControl } from "./UnitControl"
import { UnitDesigner } from "./UnitDesigner"
import { FloodRect } from "./FloodRect"
import { FrameControl } from "./FrameControl"

export const AppMain = () => {
    const [unitDesignerOpen, setUnitDesignerOpen] = useState(false)
    const [units, setUnits, unitArray] = useArrayState<Unit>([])
    const [viewBox, setViewBox] = useState<ViewBox>({ width: 300, height: 200 })
    const [activeUnitIndex, setActiveUnitIndex] = useState<number | undefined>(undefined)
    const [background, setBackground] = useState<string>('#44AA33')

    const handleConfirmDesign = (newUnit: UnitDesign) => {
        setUnitDesignerOpen(false)
        setActiveUnitIndex(units.length)
        unitArray.push(
            {
                ...newUnit,
                x: viewBox.minX ?? 0,
                y: viewBox.minY ?? 0,
                heading: 0,
            }
        )
    }

    const handleMove = (position: Position, index: number) => {
        unitArray.merge(index, position)
    }

    const handleFrameClick = (coordinates: { x: number, y: number }) => {
        if (typeof activeUnitIndex === 'number') {
            unitArray.merge(activeUnitIndex, coordinates)
        }
    }

    return (
        <Container maxWidth={'lg'}>
            <Typography variant="h2">app</Typography>
            <Grid container>
                <Grid item xs={8}>
                    <DownloadableSvgFrame
                        reportClick={handleFrameClick}
                        fileName="map.png" boxProps={{ border: '1px solid black', padding: 1 }} viewBox={viewBox}>
                        <FloodRect fill={background} viewBox={viewBox} />
                        {units.map((unit, index) => (
                            <UnitFigure key={index}
                                isActive={activeUnitIndex === index}
                                showMarkers
                                unit={unit} />
                        ))}
                    </DownloadableSvgFrame>
                </Grid>
                <Grid item xs={4} paddingX={1}>
                    <FrameControl
                        viewBox={viewBox}
                        setViewBox={setViewBox}
                        background={background}
                        setBackground={setBackground} />
                    {units.map((unit, index) => (
                        <UnitControl
                            key={index}
                            unit={unit}
                            index={index}
                            activeIndex={activeUnitIndex}
                            select={(on) => {
                                setActiveUnitIndex(on ? index : undefined)
                            }}
                            move={(position) => { handleMove(position, index) }}
                            deleteUnit={() => { unitArray.deleteItem(index) }}
                            setMarkers={(markers) => { unitArray.merge(index, markers) }}
                        />
                    ))}
                    <Box>
                        <Button variant="outlined" onClick={() => { setUnitDesignerOpen(true) }}>add unit</Button>
                    </Box>
                </Grid>
            </Grid>

            <Dialog open={unitDesignerOpen} maxWidth="lg">
                <DialogContent>
                    <UnitDesigner confirm={handleConfirmDesign} />
                </DialogContent>
            </Dialog>
        </Container>
    )
}