import { defaultBadges } from "@/lib/badges"
import { getStoredImageAssets, saveStoredImageAsset } from "@/lib/image-asset-local-storage"
import { useArrayState } from "@/lib/useArrayState"
import { useObjectState } from "@/lib/useObjectState"
import { BattleField, ImageAsset, Position, TerrainPiece, Unit, UnitDesign } from "@/types"
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import SaveIcon from "@mui/icons-material/Save"
import { AppBar, Box, Button, Container, Grid, Tab, Tabs, Toolbar, Typography } from "@mui/material"
import { useState } from "react"
import { BadgeBuilder } from "./BadgeBuilder"
import { BattleDiagram } from "./BattleDiagram"
import { BattleFieldDesigner } from "./BattleFieldDesigner"
import { SaveDialog } from "./SaveDialog"
import { ToolbarButton } from "./ToolbarButton"
import { UnitControl } from "./UnitControl"
import { UnitDesigner } from "./UnitDesigner"
import { UnitRoster } from "./UnitRoster"
import { CustomTabPanel, a11yProps } from "./tab-panels"
import { ImageManager } from "./ImageManager"

enum PanelNumbers {
    Terrain,
    Units
}

export const AppMain = () => {
    const [tabOpen, setTabOpen] = useState<PanelNumbers>(0)
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [isBadgeBuilderOpen, setIsBadgeBuilderOpen] = useState(false)
    const [unitDesignerOpen, setUnitDesignerOpen] = useState(false)

    const [battleField, { set: setBattleField, merge: mergeBattleField }] = useObjectState<BattleField>({
        viewBox: { width: 300, height: 200 },
        backgroundColor: '#44AA33'
    })
    const [terrainPieces, terrainPieceArray] = useArrayState<TerrainPiece>([])

    const [units, unitArray] = useArrayState<Unit>([])
    const [activeUnitIndex, setActiveUnitIndex] = useState<number | undefined>(undefined)
    const [activeTerrainPieceIndex, setActiveTerrainPieceIndex] = useState<number | undefined>(undefined)

    const [localBadges, setLocalBadges] = useState<ImageAsset[]>(getStoredImageAssets())
    const badges = [...defaultBadges, ...localBadges]

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
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Battle map
                    </Typography>

                    <UnitRoster units={units} unitArray={unitArray} />
                    <ImageManager updateLocalBadges={() => setLocalBadges(getStoredImageAssets())} />
                    <ToolbarButton label="build badges"
                        onClick={() => setIsBadgeBuilderOpen(!isBadgeBuilderOpen)}
                    >
                        <AddPhotoAlternateOutlinedIcon />
                    </ToolbarButton>

                    <ToolbarButton label="save and load"
                        onClick={() => setIsSaveDialogOpen(!isSaveDialogOpen)}>
                        <SaveIcon />
                    </ToolbarButton>

                </Toolbar>
            </AppBar>
            <Container maxWidth={'xl'} sx={{ marginTop: 2 }}>
                <Grid container columnSpacing={2}>
                    <Grid item xs={8}>
                        <BattleDiagram
                            activeUnitIndex={tabOpen == PanelNumbers.Units ? activeUnitIndex : undefined}
                            activeTerrainPieceIndex={tabOpen == PanelNumbers.Terrain ? activeTerrainPieceIndex : undefined}
                            {...{ units, terrainPieces, battleField, handleFrameClick, setActiveUnitIndex }}
                        />
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
                            <Box paddingTop={1}>

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
                                    endIcon={<AddCircleIcon />}
                                    onClick={() => { setUnitDesignerOpen(true) }}>add unit</Button>
                            </Box>
                        </CustomTabPanel>

                    </Grid>
                </Grid>

                <UnitDesigner
                    confirm={handleConfirmDesign}
                    badges={badges}
                    isOpen={unitDesignerOpen}
                    close={() => { setUnitDesignerOpen(false) }} />
            </Container>

            <SaveDialog
                open={isSaveDialogOpen}
                close={() => { setIsSaveDialogOpen(false) }}
                currentBattleState={
                    { battleField, units, terrainPieces }
                }
                setBattleState={battleState => {
                    setBattleField(battleState.battleField)
                    unitArray.setArray(battleState.units)
                    terrainPieceArray.setArray(battleState.terrainPieces)
                }}
            />

            <BadgeBuilder
                saveBadge={(imageAsset) => {
                    saveStoredImageAsset(imageAsset)
                    setLocalBadges(getStoredImageAssets())
                }}
                isOpen={isBadgeBuilderOpen}
                close={() => { setIsBadgeBuilderOpen(false) }} />
        </Box>
    )
}