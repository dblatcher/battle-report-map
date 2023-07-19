import { ImageAsset, TerrainPiece } from "@/types";
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, Stack, TextField } from "@mui/material";
import { RotationButtons } from "./RotationButtons";
import { useState } from "react";
import { terrainImages } from "@/lib/terrainAssets";
import { TerrainPieceInFrame } from "./TerrainPieceInFrame";
import { RotationSlider } from "./RotationSlider";


type Props = {
    terrainPiece: TerrainPiece,
    merge: { (changes: Partial<TerrainPiece>): void },
    isActive: boolean
    toggle: { (): void }
}


export const TerrainDesigner = ({ terrainPiece, merge, isActive, toggle }: Props) => {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const { x, y, heading, width, height, aboveUnits = false } = terrainPiece

    const pickImage = (image: ImageAsset) => {
        merge({ ...image })
        setImageDialogOpen(false)
    }

    return (
        <>
            <Stack marginTop={1} direction='row' spacing={1} padding={1} borderColor={'primary.dark'} border={1} alignItems={'center'}>
                <Button variant="outlined" onClick={() => setImageDialogOpen(true)} sx={{ padding: 0 }}>
                    <TerrainPieceInFrame
                        terrainPiece={terrainPiece}
                        boxProps={{ minHeight: 50, minWidth: 50, display: 'flex', alignItems: 'center' }}
                    />
                </Button>
                <Box >
                    <Stack direction='row' spacing={1}>
                        <Checkbox checked={isActive} onChange={toggle} />
                        <TextField label='width' size="small" variant='standard' sx={{ width: 80 }}
                            type="number"
                            value={width}
                            onChange={(event) => { merge({ width: Number(event.target.value) }) }}
                            inputProps={{ step: 5 }} />
                        <TextField label='height' size="small" variant='standard' sx={{ width: 80 }}
                            type="number"
                            value={height}
                            onChange={(event) => { merge({ height: Number(event.target.value) }) }}
                            inputProps={{ step: 5 }} />
                    </Stack>

                    <Stack direction={'row'} spacing={1}>
                        <Stack marginTop={1} direction='row' justifyContent={'space-between'} alignItems={'center'} spacing={1}>
                            <RotationSlider value={heading} setValue={(value) => merge({ heading: value })} showValue />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        value={aboveUnits}
                                        onChange={(event) => { merge({ aboveUnits: event.target.checked }) }}
                                    />}
                                label="Above" />
                        </Stack>
                    </Stack>
                </Box>
            </Stack >

            <Dialog open={imageDialogOpen} onClose={() => { setImageDialogOpen(false) }} fullWidth>
                <DialogTitle>Pick Terrain Image</DialogTitle>
                <DialogContent>
                    <Grid container minWidth={'lg'}>
                        {terrainImages.map((image, index) => (
                            <Grid item xs={3} key={index} display={'flex'}>
                                <Button variant="outlined"
                                    onClick={() => pickImage(image)}>
                                    <TerrainPieceInFrame
                                        terrainPiece={{
                                            height: 50,
                                            width: 50 * image.width / image.height,
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
            </Dialog>
        </>
    )
}