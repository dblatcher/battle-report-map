import { ImageAsset, TerrainPiece } from "@/types";
import { Box, Button, Dialog, DialogContent, Grid, Stack, Switch, TextField, Typography } from "@mui/material";
import { RotationButtons } from "./RotationButtons";
import { useState } from "react";
import { terrainImages } from "@/lib/terrainAssets";


type Props = {
    terrainPiece: TerrainPiece,
    merge: { (changes: Partial<TerrainPiece>): void },
    isActive: boolean
    toggle: { (): void }
}


export const TerrainDesigner = ({ terrainPiece, merge, isActive, toggle }: Props) => {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const { x, y, heading, href, width, height } = terrainPiece

    const pickImage = (image: ImageAsset) => {
        merge({ ...image })
        setImageDialogOpen(false)
    }

    return (
        <Box padding={1} borderColor={'primary.dark'} border={1}>
            <Stack marginTop={1} direction='row' spacing={1}>
                <Switch checked={isActive} onChange={toggle} />
                <Button variant="contained" onClick={() => setImageDialogOpen(true)}>{href}</Button>
                <Typography variant="caption">[{x},{y}]</Typography>
            </Stack>
            <Stack marginTop={1} direction='row'>
                <TextField label='width' size="small"
                    type="number"
                    value={width}
                    onChange={(event) => { merge({ width: Number(event.target.value) }) }}
                    inputProps={{ step: 5 }} />
                <TextField label='height' size="small"
                    type="number"
                    value={height}
                    onChange={(event) => { merge({ height: Number(event.target.value) }) }}
                    inputProps={{ step: 5 }} />
            </Stack>

            <RotationButtons value={heading} setValue={(value) => merge({ heading: value })} showValue />

            <Dialog open={imageDialogOpen} onClose={() => { setImageDialogOpen(false) }} fullWidth>
                <DialogContent>
                    <Grid container minWidth={'lg'}>
                        {terrainImages.map((image, index) => (
                            <Grid item xs={3} key={index}>
                                <Button variant="outlined"
                                    onClick={() => pickImage(image)}>
                                        {image.href}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    )
}