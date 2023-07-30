import { ArrayStateInterface } from "@/lib/useArrayState"
import { BattleField, TerrainPiece } from "@/types"
import { Box, Button, Stack, TextField } from "@mui/material"
import { TerrainDesigner } from "./TerrainDesigner"
import { terrainImages } from "@/lib/terrainAssets"
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface Props {
    battleField: BattleField
    setBattleField: { (battleField: BattleField): void }
    mergeBattleField: { (battleField: Partial<BattleField>): void }
    terrainPieces: TerrainPiece[],
    terrainPieceArray: ArrayStateInterface<TerrainPiece>
    activeTerrainPieceIndex?: number
    setActiveTerrainPieceIndex: { (index: number | undefined): void }
}

export const BattleFieldDesigner = ({ battleField, mergeBattleField, terrainPieces, terrainPieceArray, activeTerrainPieceIndex, setActiveTerrainPieceIndex }: Props) => {

    const mergeTerrainPiece = (index: number) => (changes: Partial<TerrainPiece>) => terrainPieceArray.merge(index, changes)
    const toggleActive = (index: number) => () => setActiveTerrainPieceIndex(activeTerrainPieceIndex === index ? undefined : index)

    const addTerrain = () => {
        setActiveTerrainPieceIndex(terrainPieces.length)
        terrainPieceArray.push({
            ...terrainImages[1],
            x: 0, y: 0,
            heading: 0,
        })
    }

    return (
        <Box>
            <Stack direction={'row'} marginTop={2}>
                <TextField label='height' type="number"
                    value={battleField.viewBox.height}
                    onChange={ev => { mergeBattleField({ viewBox: { ...battleField.viewBox, height: Number(ev.target.value) } }) }}
                />
                <TextField label='width' type="number"
                    value={battleField.viewBox.width}
                    onChange={ev => { mergeBattleField({ viewBox: { ...battleField.viewBox, width: Number(ev.target.value) } }) }}
                />
                <TextField sx={{ minWidth: 100 }} label='background' type="color"
                    value={battleField.backgroundColor}
                    onChange={ev => { mergeBattleField({ backgroundColor: ev.target.value }) }}
                />
            </Stack>

            <Stack marginTop={2}>
                {terrainPieces.map((piece, index) => (
                    <TerrainDesigner key={index}
                        terrainPiece={piece}
                        merge={mergeTerrainPiece(index)}
                        isActive={index === activeTerrainPieceIndex}
                        toggle={toggleActive(index)}
                        deleteItem={() => { terrainPieceArray.deleteItem(index) }}
                    />
                ))}
            </Stack>
            <Button
                sx={{ marginTop: 1 }}
                endIcon={<AddCircleIcon />}
                variant="outlined"
                fullWidth
                onClick={addTerrain}>Add Terrain</Button>
        </Box>
    )
}