import { getItemNames, loadItem, saveItem, removeItem } from "@/lib/local-storage"
import { BattleState } from "@/types"
import { Button, ButtonGroup, Card, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import SaveIcon from "@mui/icons-material/Save"
import LoadIcon from "@mui/icons-material/Input"
import DeleteIcon from "@mui/icons-material/DeleteForever"

interface Props {
    open: boolean
    close: { (): void }
    currentBattleState: BattleState
    setBattleState: { (battleField: BattleState): void }
}

const FOLDER_NAME = 'saved-states'

export const SaveDialog = ({ open, close, currentBattleState, setBattleState }: Props) => {
    const [savedFileNames, setSavedFileNames] = useState<string[]>([])
    const [fileName, setFileName] = useState('')

    useEffect(() => {
        setSavedFileNames(getItemNames(FOLDER_NAME))
    }, [setSavedFileNames])

    return (
        <Dialog open={open} onClose={close} fullWidth>
            <DialogTitle>Save Menu</DialogTitle>
            <DialogContent>
                <Typography variant="body2">saved maps</Typography>
                <Stack component={'ul'} spacing={1}>
                    {savedFileNames.map((name, index) => (
                        <Card component={'li'} key={index} sx={{ padding: 1, }}>
                            <Stack direction={'row'} alignItems={"center"} justifyContent={'space-between'}>

                                <Typography>{name}</Typography>
                                <ButtonGroup size="small">
                                    <Button
                                        endIcon={<LoadIcon />}
                                        onClick={() => {
                                            const data = loadItem(FOLDER_NAME, name)
                                            if (!data) { return }
                                            setBattleState(data as BattleState)
                                            close()
                                        }}
                                    >load
                                    </Button>
                                    <Button
                                        color="warning"
                                        endIcon={<DeleteIcon />}
                                        onClick={() => {
                                            removeItem(FOLDER_NAME, name)
                                            setSavedFileNames(getItemNames(FOLDER_NAME))
                                        }}>delete</Button>
                                </ButtonGroup>
                            </Stack>
                        </Card>
                    ))}
                </Stack>

                <Stack direction={'row'} spacing={2}>

                    <TextField
                        label='map title'
                        value={fileName}
                        onChange={(event) => {
                            setFileName(event.target.value)
                        }} />

                    <Button variant="contained"
                        size="small"
                        endIcon={<SaveIcon />}
                        onClick={() => {
                            saveItem(FOLDER_NAME, fileName.toString(), currentBattleState)
                            setSavedFileNames(getItemNames(FOLDER_NAME))
                        }}>save current map</Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}