import { Badge, UnitDesign } from "@/types"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField } from "@mui/material"
import { ChangeEventHandler, useState } from "react"
import { UnitFigureInFrame } from "./UnitFigureInFrame"
import { BadgePicker } from "./BadgePicker"
import { NumberField } from "./NumberField"

interface Props {
    confirm: { (design: UnitDesign): void };
    badges: Badge[];
    initialDesign?: UnitDesign;
    isOpen?: boolean
    close: { (): void }
}

export const UnitDesigner = ({ confirm, badges, initialDesign, isOpen, close }: Props) => {

    const [unit, setUnit] = useState<UnitDesign>(initialDesign || {
        width: 40,
        height: 40,
        patternShape: 'vertical',
        col1: '#0000FF',
        col2: '#FF0000',
        shape: 'rectangle',
    })

    const changeUnitProperty = (property: keyof UnitDesign, value: string | number) => {
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
        <Dialog open={!!isOpen} fullWidth>
            <DialogTitle>
                Unit Design
            </DialogTitle>
            <DialogContent>
                <Grid container width={'lg'}>
                    <Grid item xs={8}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1} marginTop={1}>

                            <NumberField label='width'
                                value={unit.width}
                                onChange={value => changeUnitProperty('width', value)} />

                            <NumberField label='height'
                                value={unit.height}
                                onChange={value => changeUnitProperty('height', value)} />

                            <FormControl size="small">
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

                            {unit.shape === 'circle' && (
                                <FormControlLabel
                                    sx={{ padding: 1 }}
                                    label="wings"
                                    control={
                                        <Switch size="small" checked={!!unit.wings} onChange={(e) => {
                                            setUnit({
                                                ...unit,
                                                wings: e.target.checked
                                            })
                                        }} />}
                                />
                            )}

                        </Stack>

                        <Stack direction={'row'} alignItems={'center'} spacing={1} marginTop={1}>
                            <FormControl size="small">
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

                            <TextField size="small" sx={{ minWidth: 60 }} label='col1' type="color" value={unit.col1} onChange={makeHandler('col1')} />
                            <TextField size="small" sx={{ minWidth: 60 }} label='col2' type="color" value={unit.col2} onChange={makeHandler('col2')} />
                        </Stack>

                        <BadgePicker unit={unit} setUnit={setUnit} badges={badges} />
                    </Grid>
                    <Grid item xs={4} display={'flex'} justifyContent={'flex-end'}>
                        <UnitFigureInFrame unit={unit} boxProps={{ flex: 1, padding: 1 }} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>cancel</Button>
                <Button variant="contained" onClick={() => { confirm(unit) }}>confirm</Button>
            </DialogActions>
        </Dialog>
    )
}