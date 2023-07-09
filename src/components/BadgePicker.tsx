import { Badge, UnitDesign } from "@/types"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import Image from "next/image"
import { ChangeEventHandler } from "react";

interface Props {
    unit: UnitDesign;
    setUnit: { (design: UnitDesign): void }
    badges: Badge[];
}

export const BadgePicker = ({ unit, setUnit, badges }: Props) => {

    const { badge: currentBadge } = unit
    const setBadge = (badge: Badge | undefined) => setUnit({ ...unit, badge: badge ? { ...badge } : undefined })


    const changeBadgeProperty = (property: keyof Badge, value: string) => {
        switch (property) {
            case "width":
            case "height":
                if (!currentBadge) {
                    return
                }
                setBadge({ ...currentBadge, [property]: Number(value) })
                break;

        }
    }

    const makeHandler = (property: keyof Badge): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> => (event) => { changeBadgeProperty(property, event.target.value) }

    return (
        <Box>
            <Typography variant="caption">badge</Typography>
            <Stack direction={'row'}>
                <Button
                    onClick={() => { setBadge(undefined) }}
                >
                    X
                </Button>
                {badges.map((badge, index) => (
                    <Button key={index}
                        onClick={() => { setUnit({ ...unit, badge: { ...badge } }) }}
                    >
                        <Image src={badge.href}
                            width={40}
                            height={badge.height * (40 / badge.width)}
                            alt={`select badge: ${badge.description}`} />
                    </Button>
                ))}
            </Stack>

            <Stack direction={'row'} minHeight={40}>
                {unit.badge && <>
                    <TextField label='width'
                        type="number" size="small"
                        value={unit.badge.width}
                        onChange={makeHandler('width')}
                        inputProps={{ step: 1 }} />
                    <TextField label='height' size="small"
                        type="number"
                        value={unit.badge.height}
                        onChange={makeHandler('height')}
                        inputProps={{ step: 1 }} />
                </>}
            </Stack>
        </Box>
    )
}