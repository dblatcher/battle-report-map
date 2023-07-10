import { TerrainPiece } from "@/types";
import { Box, Stack, Switch, TextField, Typography } from "@mui/material";
import { RotationButtons } from "./RotationButtons";


type Props = {
    terrainPiece: TerrainPiece,
    merge: { (changes: Partial<TerrainPiece>): void },
    isActive: boolean
    toggle: { (): void }
}


export const TerrainDesigner = ({ terrainPiece, merge, isActive, toggle }: Props) => {
    const { x, y, heading, href, width, height } = terrainPiece

    return (
        <Box padding={1} borderColor={'primary.dark'} border={1}>
            <Stack marginTop={1} direction='row' spacing={1}>
                <Switch checked={isActive} onChange={toggle} />
                <Typography variant="caption">{href}</Typography>
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
        </Box>
    )
}