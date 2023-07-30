import { terrainImages } from "@/lib/terrainAssets";
import { ImageAsset, TerrainPiece } from "@/types";
import { Box, Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { NumberField } from "./NumberField";
import { RotationSlider } from "./RotationSlider";
import { TerrainPieceInFrame } from "./TerrainPieceInFrame";
import { hlMyCard } from "@/lib/customCards";


type Props = {
    terrainPiece: TerrainPiece,
    merge: { (changes: Partial<TerrainPiece>): void },
    isActive: boolean
    toggle: { (): void }
    deleteItem: { (): void }
}


export const TerrainDesigner = ({ terrainPiece, merge, isActive, toggle, deleteItem }: Props) => {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const { heading, width, height, aboveUnits = false } = terrainPiece

    const pickImage = (image: ImageAsset) => {
        merge({ ...image })
    }

    return (
        <>
            <Stack 
                direction='row' 
                spacing={1} 
                alignItems={'center'} 
                component={hlMyCard({ sx: { marginBottom: 1, padding: 1 }, elevation:isActive ? 8 : 3 })}
            >
                <Button variant="outlined" onClick={() => setImageDialogOpen(true)} sx={{ padding: 0 }}>
                    <TerrainPieceInFrame
                        terrainPiece={terrainPiece} allowRotate
                        boxProps={{ minHeight: 50, minWidth: 50, display: 'flex', alignItems: 'center' }}
                    />
                </Button>
                <Box>
                    <Stack direction='row' justifyContent={'space-between'} alignItems={'center'} spacing={1}>
                        <Checkbox checked={isActive} onChange={toggle} size="small" />
                        <Button variant="outlined" size="small" onClick={deleteItem}>x</Button>
                    </Stack>
                </Box>
            </Stack >

            <Dialog open={imageDialogOpen} onClose={() => { setImageDialogOpen(false) }} fullWidth>
                <DialogTitle>Pick Terrain Image</DialogTitle>
                <DialogContent>

                    <Card sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'primary.light',
                        marginBottom: 2
                    }}>
                        <TerrainPieceInFrame
                            allowRotate
                            terrainPiece={terrainPiece}
                            boxProps={{
                                width, height,
                                minHeight: 150,
                                display: 'flex', alignItems: 'center'
                            }} />
                    </Card>

                    <Stack direction='row' spacing={1} marginTop={1}>
                        <NumberField label='width' value={width} onChange={(newValue) => { merge({ width: newValue }) }} />
                        <NumberField label='height' value={height} onChange={(newValue) => { merge({ height: newValue }) }} />
                        <RotationSlider value={heading} setValue={(value) => merge({ heading: value })} showValue />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    value={aboveUnits}
                                    onChange={(event) => { merge({ aboveUnits: event.target.checked }) }}
                                />}
                            label="Above Units" />
                    </Stack>

                    <Grid container minWidth={'lg'} spacing={1}>
                        {terrainImages.map((image, index) => (
                            <Grid item key={index} display={'flex'}>
                                <Button variant="outlined"
                                    onClick={() => pickImage(image)}>
                                    <TerrainPieceInFrame
                                        boxProps={{ width: 30 }}
                                        terrainPiece={{
                                            height: 30,
                                            width: 30 * image.width / image.height,
                                            href: image.href,
                                            x: 0, y: 0,
                                            heading: 0
                                        }}
                                    />
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setImageDialogOpen(false) }}>ok</Button>
                </DialogActions>
            </Dialog >
        </>
    )
}