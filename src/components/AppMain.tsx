import { useArrayState } from "@/lib/useArrayState"
import { Badge, BattleField, Position, TerrainPiece, Unit, UnitDesign } from "@/types"
import { AppBar, Box, Button, Container, Dialog, DialogActions, DialogContent, Grid, Tab, Tabs, Toolbar, Typography } from "@mui/material"
import { useState } from "react"
import { DownloadableSvgFrame } from "./DownloadableSvgFrame"
import { UnitFigure } from "./UnitFigure"
import { UnitControl } from "./UnitControl"
import { UnitDesigner } from "./UnitDesigner"
import { FloodRect } from "./FloodRect"
import { BattleFieldDesigner } from "./BattleFieldDesigner"
import { defaultBadges } from "@/lib/badges"
import { useObjectState } from "@/lib/useObjectState"
import { a11yProps, CustomTabPanel } from "./tab-panels"
import { TerrainFigure } from "./TerrainFigure"

enum PanelNumbers {
    Terrain,
    Units
}

export const AppMain = () => {
    const [tabOpen, setTabOpen] = useState<PanelNumbers>(0)
    const [unitDesignerOpen, setUnitDesignerOpen] = useState(false)
    const [badges, badgeArray] = useArrayState<Badge>(defaultBadges)
    const [battleField, { set: setBattleField, merge: mergeBattleField }] = useObjectState<BattleField>({
        viewBox: { width: 300, height: 200 },
        backgroundColor: '#44AA33'
    })
    const [terrainPieces, terrainPieceArray] = useArrayState<TerrainPiece>([])

    const [units, unitArray] = useArrayState<Unit>([])
    const [activeUnitIndex, setActiveUnitIndex] = useState<number | undefined>(undefined)
    const [activeTerrainPieceIndex, setActiveTerrainPieceIndex] = useState<number | undefined>(undefined)

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
        switch (tabOpen) {
            case PanelNumbers.Terrain:
                if (typeof activeTerrainPieceIndex === 'number') {
                    terrainPieceArray.merge(activeTerrainPieceIndex, coordinates)
                }
                break
            case PanelNumbers.Units:
                if (typeof activeUnitIndex === 'number') {
                    unitArray.merge(activeUnitIndex, coordinates)
                }
                break
        }
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Battle map
                    </Typography>
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

                            {terrainPieces.map((piece, index) => (
                                <TerrainFigure terrainPiece={piece} key={index} />
                            ))}
                        </DownloadableSvgFrame>
                    </Grid>

                    <Grid item xs={4} paddingX={1}>
                        <Tabs value={tabOpen} onChange={(_, value) => setTabOpen(value)}>
                            <Tab label="Terrain" {...a11yProps(0)} />
                            <Tab label="Units" {...a11yProps(1)} />
                        </Tabs>

                        <CustomTabPanel index={PanelNumbers.Terrain} value={tabOpen}>
                            <BattleFieldDesigner
                                {...{
                                    terrainPieces, terrainPieceArray,
                                    mergeBattleField, setBattleField,
                                    battleField,
                                    activeTerrainPieceIndex, setActiveTerrainPieceIndex
                                }}
                            />
                        </CustomTabPanel>

                        <CustomTabPanel index={PanelNumbers.Units} value={tabOpen}>
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
                        </CustomTabPanel>

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
            </Container>
        </Box>
    )
}