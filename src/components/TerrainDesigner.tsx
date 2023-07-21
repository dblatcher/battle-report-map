import { ImageAsset, TerrainPiece } from "@/types";
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, Stack, TextField } from "@mui/material";
import { RotationButtons } from "./RotationButtons";
import { useState } from "react";
import { terrainImages } from "@/lib/terrainAssets";
import { TerrainPieceInFrame } from "./TerrainPieceInFrame";
import { RotationSlider } from "./RotationSlider";
import { NumberField } from "./NumberField";


type Props = {
    terrainPiece: TerrainPiece,
    merge: { (changes: Partial<TerrainPiece>): void },
    isActive: boolean
    toggle: { (): void }
}


export const TerrainDesigner = ({ terrainPiece, merge, isActive, toggle }: Props) => {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const { heading, width, height, aboveUnits = false } = terrainPiece

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
                        <NumberField label='width' value={width} onChange={(newValue) => { merge({ width: newValue }) }} />
                        <NumberField label='height' value={height} onChange={(newValue) => { merge({ height: newValue }) }} />
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
            </Dialog>
        </>
    )
}