/* eslint-disable @next/next/no-img-element */
import { getStoredImageAssets, removeStoredImageAsset } from '@/lib/image-asset-local-storage';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ToolbarButton } from "./ToolbarButton";

interface Props {
    updateLocalBadges: { (): void }
}



export const ImageManager = ({ updateLocalBadges }: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const storedBadgeAssets = getStoredImageAssets()

    const deleteBadgeAsset = (description: string) => {
        removeStoredImageAsset(description)
        updateLocalBadges()
    }

    return <>
        <ToolbarButton
            label="Open Image manager"
            onClick={() => { setDialogOpen(true) }}
        ><CollectionsOutlinedIcon /></ToolbarButton>

        <Dialog fullWidth
            open={dialogOpen}
            onClose={() => { setDialogOpen(false) }}>
            <DialogTitle>Image Manager</DialogTitle>
            <DialogContent>
                {storedBadgeAssets.map((asset, index) => (
                    <Card key={index} sx={{ padding: 1, marginBottom: 1 }}>
                        <Stack direction={'row'} alignItems={"center"} justifyContent={'space-between'}>
                            <img src={asset.href}
                                width={40}
                                height={asset.height * (40 / asset.width)}
                                alt={`badge asset: ${asset.description}`} />
                            <Typography flex={1} paddingX={1}>{asset.description}</Typography>
                            <IconButton title={'delete asset'}
                                color='warning'
                                onClick={() => deleteBadgeAsset(asset.description)}
                            >
                                <DeleteForever />
                            </IconButton>
                        </Stack>
                    </Card>
                ))}

            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setDialogOpen(false) }}>close</Button>
            </DialogActions>
        </Dialog >
    </>
}