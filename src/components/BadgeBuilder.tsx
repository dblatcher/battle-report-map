/* eslint-disable @next/next/no-img-element */
import { getStoredImageAssetDescriptions } from "@/lib/image-asset-local-storage";
import { ImageAsset, UnitDesign } from "@/types";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { createRef, useState } from "react";
import { NumberField } from "./NumberField";
import { UnitFigureInFrame } from "./UnitFigureInFrame";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

interface Props {
    isOpen: boolean
    close: { (): void }
    saveBadge: { (badge: ImageAsset): void }
}


const baseDesign1: UnitDesign = {
    width: 50,
    height: 40,
    shape: 'rectangle',
    patternShape: 'right-diagonal',
    col1: 'red',
    col2: 'blue',
}
const baseDesign2: UnitDesign = {
    width: 30,
    height: 30,
    shape: 'rectangle',
    patternShape: 'vertical',
    col1: 'antiquewhite',
    col2: 'palegreen',
    wings: true,
}

const buildSampleUnit = (base: UnitDesign, badge?: ImageAsset): UnitDesign => ({
    ...base,
    badge
})

export const BadgeBuilder = ({ isOpen, close, saveBadge }: Props) => {
    const [urlInput, setUrlInput] = useState('')
    const [loadFailure, setLoadFailure] = useState<string | undefined>()
    const [verifiedImageUrl, setVerifiedImageUrl] = useState<URL | undefined>()

    const [description, setDescription] = useState('')
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    //TO DO - not efficient to get his on every render
    const existingDescriptions = getStoredImageAssetDescriptions()
    const descriptionInUse = existingDescriptions.includes(description)

    const imageRef = createRef<HTMLImageElement>()

    const loadImage = async () => {
        setLoadFailure(undefined)

        let url: URL;
        try {
            url = new URL(urlInput)
        } catch (err) {
            setLoadFailure('not valid url')
            return
        }
        try {
            const response = await fetch(url, { mode: 'cors' })
            if (!response.ok) {
                console.log('status', response.status)
                setLoadFailure(`could not load image: ${response.statusText}`)
                return
            }

            const blob = await response.blob()
            if (!blob.type.startsWith('image')) {
                console.log(blob)
                setLoadFailure(`was not an image!`)
            }
            setVerifiedImageUrl(url)

            const lastPartOfPath = url.pathname.split('/').reverse()[0];
            if (lastPartOfPath) { setDescription(lastPartOfPath) }

        } catch (err) {
            console.log(err)
            setLoadFailure(`failed to load image`)
        }
    }

    const handleLoadButton = () => {
        void loadImage()
    }

    const handleSaveAssetButton = () => {
        if (!badgeAsset) { return }
        saveBadge(badgeAsset)
        close()
    }

    const setDimensions = () => {
        const element = imageRef.current
        if (!element) { return }
        const { naturalHeight, naturalWidth } = element
        const scale = Math.min(1, 40 / naturalWidth)
        setHeight(naturalHeight * scale)
        setWidth(naturalWidth * scale)
    }

    const badgeAsset: ImageAsset | undefined = verifiedImageUrl ? {
        href: verifiedImageUrl.toString(),
        height,
        width,
        description
    } : undefined

    return (
        <Dialog open={isOpen} onClose={close} maxWidth={"md"}>
            <DialogTitle>badge builder</DialogTitle>
            <DialogContent>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Box>
                        <Box display={'flex'} paddingTop={1}>
                            <TextField size="small" label="enter image url" value={urlInput} onChange={(e) => { setUrlInput(e.target.value) }} />
                            <IconButton color="primary"
                                onClick={handleLoadButton}
                                sx={{ flexShrink: 0 }}
                                title="load image from URL"
                            ><FileUploadIcon /></IconButton>
                        </Box>

                        <TextField sx={{ marginTop: 1 }} size="small" label="description" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                        {loadFailure && (
                            <Alert severity="error">{loadFailure}</Alert>
                        )}
                        {verifiedImageUrl && (
                            <>
                                <Box display={'flex'} alignItems={'center'} padding={2}>
                                    <img ref={imageRef}
                                        src={verifiedImageUrl.toString()}
                                        onLoad={setDimensions}
                                        alt="loaded image"
                                        style={{ maxWidth: 150, height: 'auto' }}
                                    />
                                </Box>
                                <Box paddingTop={1}>
                                    <NumberField
                                        label="width"
                                        value={width}
                                        onChange={setWidth}
                                        step={1}
                                    />
                                    <NumberField
                                        label="height"
                                        value={height}
                                        onChange={setHeight}
                                        step={1}
                                    />
                                    <IconButton onClick={setDimensions} title="reset size">
                                        <SettingsBackupRestoreIcon />
                                    </IconButton>
                                </Box>
                            </>
                        )}
                    </Box>
                    <Box display={'flex'} flexWrap={'wrap'} flexDirection={'column'} alignItems={'center'}>
                        <Typography>Sample Units</Typography>
                        <UnitFigureInFrame unit={buildSampleUnit(baseDesign1, badgeAsset)} boxProps={{ width: 200 }} />
                        <UnitFigureInFrame unit={buildSampleUnit(baseDesign2, badgeAsset)} boxProps={{ width: 200 }} />
                    </Box>
                </Box>
                {descriptionInUse && (
                    <Alert severity="warning" sx={{ maxWidth: 450 }}>
                        There is already a badge called &ldquo;{description}&rdquo; - saving will replace it
                    </Alert>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={close}>close</Button>
                {badgeAsset && (
                    <Button variant="contained" onClick={handleSaveAssetButton}>Save to browser local storage</Button>
                )}
            </DialogActions>
        </Dialog>
    )

}