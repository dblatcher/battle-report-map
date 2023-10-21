/* eslint-disable @next/next/no-img-element */
import { ImageAsset, UnitDesign } from "@/types"
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, IconButton } from "@mui/material"
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useState } from "react"
import { UnitFigureInFrame } from "./UnitFigureInFrame"

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
    col1: 'brown',
    col2: 'crimson',
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

    const badgeAsset: ImageAsset | undefined = verifiedImageUrl ? {
        href: verifiedImageUrl.toString(),
        height: 20,
        width: 20,
        description
    } : undefined

    return (
        <Dialog open={isOpen} onClose={close} maxWidth={false}>
            <DialogTitle>badge builder</DialogTitle>
            <DialogContent>
                <Box display={'flex'}>
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
                            <Box display={'flex'} alignItems={'center'} padding={2}>
                                <img src={verifiedImageUrl.toString()} alt="loaded image" style={{ maxWidth: 150, height: 'auto' }} />
                            </Box>
                        )}
                    </Box>
                    <Box display={'flex'} flexWrap={'wrap'} flexDirection={'column'} alignItems={'center'}>
                        <Typography>Sample Units</Typography>
                        <UnitFigureInFrame unit={buildSampleUnit(baseDesign1, badgeAsset)} boxProps={{ width: 200 }} />
                        <UnitFigureInFrame unit={buildSampleUnit(baseDesign2, badgeAsset)} boxProps={{ width: 200 }} />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={close}>close</Button>
                {badgeAsset && (
                    <Button variant="contained" onClick={() => {
                        saveBadge(badgeAsset)
                        close()
                    }}>Save to browser local storage</Button>
                )}
            </DialogActions>
        </Dialog>
    )

}