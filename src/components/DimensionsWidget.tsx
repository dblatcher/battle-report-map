import { Box, IconButton, Checkbox } from "@mui/material"
import { NumberField } from "./NumberField"

import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { useState } from "react";
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';

// TO DO - may need a method to set both values in one transaction
interface Props {
    height: number
    setHeight: { (newValue: number): void }
    width: number
    setWidth: { (newValue: number): void }
    reset?: { (): void }
    step?: number
}


export const DimensionsWidget = ({ height, setHeight, width, setWidth, reset, step = 1 }: Props) => {
    const [lockAspectRatio, setLockAspectRatio] = useState(false)
    const aspectRatio = width / height

    const handleWidthChange = (newWidth: number) => {
        if (!lockAspectRatio || !isFinite(aspectRatio)) {
            return setWidth(newWidth)
        }
        const newHeight = Math.round(newWidth / aspectRatio)
        setWidth(newWidth)
        setHeight(newHeight)
    }
    const handleHeightChange = (newHeight: number) => {
        if (!lockAspectRatio || !isFinite(aspectRatio)) {
            return setHeight(newHeight)
        }
        const newWidth = Math.round(newHeight * aspectRatio)
        setWidth(newWidth)
        setHeight(newHeight)
    }

    return (
        <Box paddingTop={1}>

            <Checkbox value={lockAspectRatio}
                title={lockAspectRatio ? 'aspect ratio lock:on' : 'aspect ratio lock:off'}
                icon={<RectangleOutlinedIcon />}
                checkedIcon={<AspectRatioIcon color="primary" />}
                onChange={({ target }) => { setLockAspectRatio(target.checked) }}
            />

            <NumberField
                label="width"
                value={width}
                onChange={handleWidthChange}
                step={step}
            />
            <NumberField
                label="height"
                value={height}
                onChange={handleHeightChange}
                step={step}
            />

            {reset && (
                <IconButton onClick={reset} title="reset size">
                    <SettingsBackupRestoreIcon />
                </IconButton>
            )}
        </Box>
    )
}