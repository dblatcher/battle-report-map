import { Badge, Position, Unit } from "@/types";
import DeleteIcon from "@mui/icons-material/Clear";
import { Box, Button, Card, Checkbox, IconButton, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { HitButtons } from "./HitButtons";
import { RotationSlider } from "./RotationSlider";
import { UnitDesigner } from "./UnitDesigner";
import { UnitFigureInFrame } from "./UnitFigureInFrame";

type Props = {
    unit: Unit,
    move: { (position: Position): void },
    index: number,
    activeIndex?: number,
    select: { (on: boolean): void }
    deleteUnit: { (): void }
    badges: Badge[];
    merge: { (changes: Partial<Unit>): void }
}

export const UnitControl = ({ unit, index, activeIndex, select, deleteUnit, badges, merge }: Props) => {

    const [unitDesignerOpen, setUnitDesignerOpen] = useState(false)

    const isActive = activeIndex === index

    return (<>

        <Card sx={{ marginBottom: 1, padding: 1, backgroundColor: 'secondary.light' }} elevation={isActive ? 8 : 3}>
            <Stack>
                <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'space-between'} >
                    <TextField size="small"
                        label="name"
                        value={unit.name ?? ''}
                        onChange={event => merge({ name: event.target.value })}
                    />
                    <Checkbox size="small" onChange={() => { select(activeIndex !== index) }} checked={isActive} />
                    <IconButton aria-label="delete" onClick={deleteUnit}><DeleteIcon color="primary" /></IconButton>
                </Stack>

                <Stack direction={'row'} spacing={1} alignItems={'center'}  >

                    <Button variant="contained"
                        sx={{ padding: 0, flexBasis: 100, height: 70, display: 'flex' }}
                        onClick={() => { setUnitDesignerOpen(true) }}>
                        <UnitFigureInFrame 
                            unit={unit} 
                            boxProps={{ flexBasis: 90, display: 'flex', maxHeight: 70 }} />
                    </Button>

                    <Box >
                        <Stack direction={'row'} spacing={1} alignItems={'center'}  >
                            <RotationSlider
                                value={unit.heading}
                                setValue={heading => { merge({ heading }) }}
                                showValue />
                        </Stack>
                        <Stack direction={'row'}>
                            <HitButtons
                                count={unit.hits}
                                label="hits"
                                setCount={(hits) => merge({ hits })} />
                            <HitButtons
                                count={unit.magicHits}
                                label="magic hits"
                                setCount={(magicHits) => merge({ magicHits })} />
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </Card>
        <UnitDesigner
            confirm={(design) => {
                merge(design)
                setUnitDesignerOpen(false)
            }}
            badges={badges}
            initialDesign={{
                width: unit.width,
                height: unit.height,
                arrowSize: unit.arrowSize,
                col1: unit.col1,
                col2: unit.col2,
                patternShape: unit.patternShape,
                shape: unit.shape,
                badge: unit.badge,
                wings: unit.wings,
            }}
            close={() => { setUnitDesignerOpen(false) }}
            isOpen={unitDesignerOpen}
        />
    </>
    )
}