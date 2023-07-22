import { defaultBadges } from "@/lib/badges"
import { useArrayState } from "@/lib/useArrayState"
import { useObjectState } from "@/lib/useObjectState"
import { Badge, BattleField, Position, TerrainPiece, Unit, UnitDesign } from "@/types"
import { AppBar, Box, Button, Container, Grid, Tab, Tabs, Toolbar, Typography } from "@mui/material"
import { useState } from "react"
import { BattleFieldDesigner } from "./BattleFieldDesigner"
import { DownloadableSvgFrame } from "./DownloadableSvgFrame"
import { FloodRect } from "./FloodRect"
import { TerrainFigure } from "./TerrainFigure"
import { UnitControl } from "./UnitControl"
import { UnitDesigner } from "./UnitDesigner"
import { UnitFigure } from "./UnitFigure"
import { CustomTabPanel, a11yProps } from "./tab-panels"

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

                            {terrainPieces.filter(piece => !piece.aboveUnits).map((piece, index) => (
                                <TerrainFigure
                                    isActive={activeTerrainPieceIndex === index && tabOpen == PanelNumbers.Terrain}
                                    terrainPiece={piece}
                                    key={index} />
                            ))}

                            {units.map((unit, index) => (
                                <UnitFigure key={index}
                                    isActive={activeUnitIndex === index && tabOpen == PanelNumbers.Units}
                                    showMarkers
                                    unit={unit}
                                    onContextMenu={() => { setActiveUnitIndex(index) }}
                                />
                            ))}

                            {terrainPieces.filter(piece => piece.aboveUnits).map((piece, index) => (
                                <TerrainFigure
                                    isActive={activeTerrainPieceIndex === index && tabOpen == PanelNumbers.Terrain}
                                    terrainPiece={piece}
                                    key={index} />
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
                                    merge={(changes) => { unitArray.merge(index, changes) }}
                                    badges={badges}
                                />
                            ))}

                            <Button fullWidth
                                sx={{ marginTop: 1 }}
                                variant={'outlined'}
                                onClick={() => { setUnitDesignerOpen(true) }}>add unit</Button>
                        </CustomTabPanel>

                    </Grid>
                </Grid>

                <UnitDesigner
                    confirm={handleConfirmDesign}
                    badges={badges}
                    isOpen={unitDesignerOpen}
                    close={() => { setUnitDesignerOpen(false) }} />

            </Container>
        </Box>
    )
}