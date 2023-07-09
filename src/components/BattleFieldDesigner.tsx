import { BattleField } from "@/types"
import { Stack, TextField } from "@mui/material"


interface Props {
    battleField: BattleField
    setBattleField: { (battleField: BattleField): void }
    mergeBattleField: { (battleField: Partial<BattleField>): void }
}

export const BattleFieldDesigner = ({ battleField, mergeBattleField }: Props) => {

    return (
        <Stack direction={'row'} marginTop={2}>
            <TextField label='height' type="number"
                value={battleField.viewBox.height}
                onChange={ev => { mergeBattleField({ viewBox: { ...battleField.viewBox, height: Number(ev.target.value) } }) }}
            />
            <TextField label='width' type="number"
                value={battleField.viewBox.width}
                onChange={ev => { mergeBattleField({ viewBox: { ...battleField.viewBox, width: Number(ev.target.value) } }) }}
            />
            <TextField sx={{ minWidth: 100 }} label='background' type="color"
                value={battleField.backgroundColor}
                onChange={ev => { mergeBattleField({ backgroundColor: ev.target.value }) }}
            />
        </Stack>
    )
}