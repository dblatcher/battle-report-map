import { Badge, Markers, Position, Unit } from "@/types";
import { Box, Button, ButtonGroup, Checkbox, Stack } from "@mui/material";
import { useState } from "react";
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

export const UnitControl = ({ unit, move, index, activeIndex, select, deleteUnit, badges, merge }: Props) => {

    const setRotation = (value: number) => {
        move({ ...unit, heading: value })
    }

    const [unitDesignerOpen, setUnitDesignerOpen] = useState(false)

    return (<>
        <Stack direction={'row'} spacing={1} alignItems={'center'} marginBottom={1} padding={1} borderColor={'primary.dark'} border={1}>

            <Button variant="outlined" sx={{ padding: 0, flexBasis: 80, minHeight: 60 }} onClick={() => { setUnitDesignerOpen(true) }}>
                <UnitFigureInFrame unit={unit} boxProps={{ flexBasis: 60 }} />
            </Button>

            <Box >
                <Stack direction={'row'} spacing={1} alignItems={'center'}  >
                    <Checkbox size="small" onChange={() => { select(activeIndex !== index) }} checked={activeIndex === index} />
                    <Button variant="outlined" size="small" onClick={deleteUnit}>X</Button>
                </Stack>
                <Stack direction={'row'}>
                    <RotationSlider value={unit.heading} setValue={setRotation} showValue />
                    <ButtonGroup size="small">
                        <Button onClick={() => {
                            merge({
                                hits: 1 + (unit.hits ?? 0)
                            })
                        }}>hit+</Button>
                        <Button onClick={() => {
                            merge({
                                hits: Math.max(-1 + (unit.hits ?? 0), 0)
                            })
                        }}>hit-</Button>
                    </ButtonGroup>
                </Stack>
            </Box>
        </Stack>

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