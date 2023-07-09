import { useArrayState } from "@/lib/useArrayState"
import { Badge, BattleField, Position, Unit, UnitDesign } from "@/types"
import { AppBar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Toolbar, Typography } from "@mui/material"
import { useState } from "react"
import { DownloadableSvgFrame } from "./DownloadableSvgFrame"
import { UnitFigure } from "./UnitFigure"
import { UnitControl } from "./UnitControl"
import { UnitDesigner } from "./UnitDesigner"
import { FloodRect } from "./FloodRect"
import { BattleFieldDesigner } from "./BattleFieldDesigner"
import { defaultBadges } from "@/lib/badges"

export const AppMain = () => {
    const [unitDesignerOpen, setUnitDesignerOpen] = useState(false)
    const [battleFieldDesignerOpen, setBattleFieldDesignerOpen] = useState(true)
    const [badges, badgeArray] = useArrayState<Badge>(defaultBadges)
    const [battleField, setBattleField] = useState<BattleField>({
        viewBox: { width: 300, height: 200 },
        backgroundColor: '#44AA33'
    })

    const [units, unitArray] = useArrayState<Unit>([])
    const [activeUnitIndex, setActiveUnitIndex] = useState<number | undefined>(undefined)

    const handleConfirmDesign = (newUnit: UnitDesign) => {
        setUnitDesignerOpen(false)
        setActiveUnitIndex(units.length)
        unitArray.push(
            {
                ...newUnit,
                x: battleField.viewBox.minX ?? 0,
                y: battleField.viewBox.minY ?? 0,
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
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Battle map
                    </Typography>
                    <Button color="inherit" onClick={() => { setBattleFieldDesignerOpen(true) }}>battle field</Button>
                    <Button color="inherit" onClick={() => { setUnitDesignerOpen(true) }}>add unit</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth={'lg'} sx={{ marginTop: 2 }}>
                <Grid container>
                    <Grid item xs={8}>
                        <DownloadableSvgFrame
                            reportClick={handleFrameClick}
                            fileName="map.png" boxProps={{ border: '1px solid black', padding: 1 }} viewBox={battleField.viewBox}>
                            <FloodRect fill={battleField.backgroundColor} viewBox={battleField.viewBox} />
                            {units.map((unit, index) => (
                                <UnitFigure key={index}
                                    isActive={activeUnitIndex === index}
                                    showMarkers
                                    unit={unit} />
                            ))}
                        </DownloadableSvgFrame>
                    </Grid>
                    <Grid item xs={4} paddingX={1}>

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

                        <Button fullWidth
                            sx={{ marginTop: 1 }}
                            variant={'outlined'}
                            onClick={() => { setUnitDesignerOpen(true) }}>add unit</Button>
                    </Grid>
                </Grid>
                <Dialog open={unitDesignerOpen} maxWidth="lg">
                    <DialogContent>
                        <UnitDesigner confirm={handleConfirmDesign} badges={badges} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setUnitDesignerOpen(false) }}>close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={battleFieldDesignerOpen} maxWidth="lg" onClose={() => { setBattleFieldDesignerOpen(false) }}>
                    <DialogTitle>Battle Field</DialogTitle>
                    <DialogContent>
                        <BattleFieldDesigner
                            battleField={battleField}
                            setBattleField={setBattleField} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setBattleFieldDesignerOpen(false) }}>close</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}