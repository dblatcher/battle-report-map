import { BattleField, ViewBox } from "@/types"
import { Stack, TextField } from "@mui/material"
import { ChangeEventHandler } from "react"


interface Props {
    battleField: BattleField
    setBattleField: { (battleField: BattleField): void }
}

export const BattleFieldDesigner = ({ battleField, setBattleField }: Props) => {

    const changeProperty = (property: keyof ViewBox, value: string) => {
        switch (property) {
            case "width":
            case "height":
                setBattleField({ ...battleField, viewBox: { ...battleField.viewBox, [property]: Number(value) } })
                break;
        }
    }
    const makeHandler = (property: keyof ViewBox): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> => (event) => { changeProperty(property, event.target.value) }

    return (
        <Stack direction={'row'} marginTop={2}>
            <TextField label='height' type="number" value={battleField.viewBox.height} onChange={makeHandler('height')} />
            <TextField label='width' type="number" value={battleField.viewBox.width} onChange={makeHandler('width')} />
            <TextField sx={{ minWidth: 100 }} label='background' type="color" value={battleField.backgroundColor} onChange={ev => { setBattleField({ ...battleField, backgroundColor: ev.target.value }) }} />
        </Stack>
    )
}