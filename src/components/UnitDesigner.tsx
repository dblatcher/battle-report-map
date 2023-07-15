import { Badge, UnitDesign } from "@/types"
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import { ChangeEventHandler, useState } from "react"
import { UnitFigureInFrame } from "./UnitFigureInFrame"
import { BadgePicker } from "./BadgePicker"

interface Props {
    confirm: { (design: UnitDesign): void };
    badges: Badge[];
}

export const UnitDesigner = ({ confirm, badges }: Props) => {

    const [unit, setUnit] = useState<UnitDesign>({
        width: 40,
        height: 40,
        patternShape: 'vertical',
        col1: '#0000FF',
        col2: '#FF0000',
        shape: 'rectangle',
    })

    const changeUnitProperty = (property: keyof UnitDesign, value: string) => {
        switch (property) {
            case "width":
            case "height":
            case "arrowSize":
                setUnit({ ...unit, [property]: Number(value) })
                break;
            case "col1":
            case "col2":
                if (typeof value === 'string') {
                    setUnit({ ...unit, [property]: value })
                }
                break;
            case "patternShape":
                switch (value) {
                    case 'left-diagonal':
                    case 'right-diagonal':
                    case 'vertical':
                        setUnit({ ...unit, [property]: value })
                        break;
                    case '':
                        setUnit({ ...unit, [property]: undefined })
                        break;
                }
                break
            case "shape":
                switch (value) {
                    case 'circle':
                    case 'triangle':
                    case 'rectangle':
                        setUnit({ ...unit, [property]: value })
                        break;
                }
                break;
        }
    }

    const makeHandler = (property: keyof UnitDesign): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> => (event) => { changeUnitProperty(property, event.target.value) }

    return (
        <Grid container width={'lg'}>
            <Grid item xs={8}>
                <Stack direction={'row'}>
                    <TextField label='width'
                        type="number"
                        value={unit.width}
                        onChange={makeHandler('width')}
                        inputProps={{ step: 5 }} />
                    <TextField label='height'
                        type="number"
                        value={unit.height}
                        onChange={makeHandler('height')}
                        inputProps={{ step: 5 }} />
                </Stack>
                <Stack direction={'row'}>
                    <FormControl fullWidth>
                        <InputLabel >Pattern</InputLabel>
                        <Select
                            value={unit.patternShape ?? ''}
                            label="Pattern"
                            onChange={(event) => {
                                changeUnitProperty('patternShape', event.target.value)
                            }}
                        >
                            <MenuItem value={''}>plain</MenuItem>
                            <MenuItem value={'left-diagonal'}>left-diagonal</MenuItem>
                            <MenuItem value={'right-diagonal'}>right-diagonal</MenuItem>
                            <MenuItem value={'vertical'}>vertical</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel >Shape</InputLabel>
                        <Select
                            value={unit.shape}
                            label="shape"
                            onChange={(event) => {
                                changeUnitProperty('shape', event.target.value)
                            }}
                        >
                            <MenuItem value={'rectangle'}>rectangle</MenuItem>
                            <MenuItem value={'triangle'}>triangle</MenuItem>
                            <MenuItem value={'circle'}>circle</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Stack direction={'row'}>
                    <TextField sx={{ minWidth: 60 }} label='col1' type="color" value={unit.col1} onChange={makeHandler('col1')} />
                    <TextField sx={{ minWidth: 60 }} label='col2' type="color" value={unit.col2} onChange={makeHandler('col2')} />
                </Stack>

                <BadgePicker unit={unit} setUnit={setUnit} badges={badges} />

                <Button variant="contained" onClick={() => { confirm(unit) }}>ok</Button>
            </Grid>
            <Grid item xs={4} display={'flex'} justifyContent={'flex-end'}>
                <UnitFigureInFrame unit={unit} boxProps={{ flex: 1, padding: 1 }} />
            </Grid>
        </Grid>
    )
}