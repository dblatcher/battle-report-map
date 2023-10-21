/* eslint-disable @next/next/no-img-element */
import { ImageAsset, UnitDesign } from "@/types"
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"
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

const buildSampleUnit = (base: UnitDesign, badge?: ImageAsset): UnitDesign => {

    return {
        ...base,
        badge
    }

}

export const BadgeBuilder = ({ isOpen, close, saveBadge }: Props) => {
    const [urlInput, setUrlInput] = useState('')
    const [loadFailure, setLoadFailure] = useState<string | undefined>()
    const [verifiedImageUrl, setVerifiedImageUrl] = useState<URL | undefined>()

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
        } catch (err) {
            console.log(err)
            setLoadFailure(`failed to load image`)
        }
    }

    const handleLoadButton = () => {
        void loadImage()
    }

    const badgeAsset = verifiedImageUrl ? {
        href: verifiedImageUrl.toString(),
        height: 20,
        width: 20,
        description: 'unset'
    } : undefined

    return (
        <Dialog open={isOpen} onClose={close}>
            <DialogTitle>badge builder</DialogTitle>
            <DialogContent>

                <Box paddingTop={2}>
                    <TextField fullWidth label="enter url" value={urlInput} onChange={(e) => { setUrlInput(e.target.value) }} />
                </Box>
                <Button onClick={handleLoadButton}>load</Button>
            </DialogContent>

            {loadFailure && <Alert>{loadFailure}</Alert>}

            {verifiedImageUrl && (
                <Box display={'flex'} alignItems={'center'} padding={2}>
                    <img src={verifiedImageUrl.toString()} alt="loaded image" style={{ maxWidth: 200, height: 'auto' }} />
                    <Typography variant="caption" style={{ wordWrap: 'break-word', wordBreak: 'break-all', display: 'block' }}>{verifiedImageUrl.toString()}</Typography>
                </Box>
            )}

            <Box display={'flex'}>
                <UnitFigureInFrame unit={buildSampleUnit(baseDesign1, badgeAsset)} boxProps={{ width: 200 }} />
                <UnitFigureInFrame unit={buildSampleUnit(baseDesign2, badgeAsset)} boxProps={{ width: 200 }} />
            </Box>


            <DialogActions>
                {badgeAsset && (
                    <Button variant="contained" onClick={() => { 
                        saveBadge(badgeAsset) 
                        close()
                    }}>Save badge for this session only</Button>
                )}
            </DialogActions>
        </Dialog>
    )

}