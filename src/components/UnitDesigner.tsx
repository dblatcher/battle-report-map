import { UnitDesign } from "@/types"
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import { ChangeEventHandler, useState } from "react"
import { SvgFrame } from "./SvgFrame"
import { UnitFigure } from "./UnitFigure"

interface Props {
    confirm: { (design: UnitDesign): void }
}

export const UnitDesigner = ({ confirm }: Props) => {

    const [unit, setUnit] = useState<UnitDesign>({
        width: 20,
        height: 20,
        patternShape: 'vertical',
        col1: '#0000FF',
        col2: '#FF0000',
        shape: 'triangle',
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
        <Grid container maxWidth={'sm'}>
            <Grid item xs={6}>
                <TextField label='width' type="number" value={unit.width} onChange={makeHandler('width')} />
                <TextField label='height' type="number" value={unit.height} onChange={makeHandler('height')} />

                <Stack direction={'row'}>
                    <FormControl>
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
                    <FormControl>
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
                        </Select>
                    </FormControl>

                    <TextField sx={{ minWidth: 50 }} label='col1' type="color" value={unit.col1} onChange={makeHandler('col1')} />
                    <TextField sx={{ minWidth: 50 }} label='col2' type="color" value={unit.col2} onChange={makeHandler('col2')} />
                </Stack>
                <Button variant="contained" onClick={() => { confirm(unit) }}>ok</Button>
            </Grid>
            <Grid item xs={6} >
                <SvgFrame>
                    <UnitFigure unit={{ ...unit, x: 50, y: 50, heading: 0 }} />
                </SvgFrame>
            </Grid>
        </Grid>
    )
}