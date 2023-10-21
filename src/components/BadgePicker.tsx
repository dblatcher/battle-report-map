/* eslint-disable @next/next/no-img-element */
import { Badge, UnitDesign } from "@/types";
import { Box, Button, Stack, Typography } from "@mui/material";
import { NumberField } from "./NumberField";

interface Props {
    unit: UnitDesign;
    setUnit: { (design: UnitDesign): void }
    badges: Badge[];
}

export const BadgePicker = ({ unit, setUnit, badges }: Props) => {

    const { badge: currentBadge } = unit
    const setBadge = (badge: Badge | undefined) => setUnit({ ...unit, badge: badge ? { ...badge } : undefined })

    return (
        <Box>
            <Typography variant='subtitle1'>Badge</Typography>
            <Stack direction={'row'} flexWrap={'wrap'}>
                <Button
                    onClick={() => { setBadge(undefined) }}
                >
                    X
                </Button>
                {badges.map((badge, index) => (
                    <Button key={index} title={badge.description}
                        variant="outlined"
                        onClick={() => { setUnit({ ...unit, badge: { ...badge } }) }}
                    >
                        <img src={badge.href}
                            width={40}
                            height={badge.height * (40 / badge.width)}
                            alt={`select badge: ${badge.description}`} />
                    </Button>
                ))}
            </Stack>

            <Stack direction={'row'} minHeight={40} spacing={1} paddingTop={1}>
                {currentBadge && <>
                    <NumberField
                        label="width"
                        value={currentBadge.width}
                        step={1}
                        onChange={(newValue) => setBadge({ ...currentBadge, width: newValue })} />
                    <NumberField
                        label="height"
                        value={currentBadge.height}
                        step={1}
                        onChange={(newValue) => setBadge({ ...currentBadge, height: newValue })} />
                </>}
            </Stack>
        </Box>
    )
}