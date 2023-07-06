import { ViewBox } from "@/types"
import { Stack, TextField } from "@mui/material"

import { ChangeEventHandler } from "react"


interface Props {
    viewBox: ViewBox
    setViewBox: { (viewport: ViewBox): void }
    background: string
    setBackground: { (background: string): void }
}

export const FrameControl = ({ viewBox, setViewBox, background, setBackground }: Props) => {

    const changeProperty = (property: keyof ViewBox, value: string) => {
        switch (property) {
            case "width":
            case "height":
                setViewBox({ ...viewBox, [property]: Number(value) })
                break;
        }
    }
    const makeHandler = (property: keyof ViewBox): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> => (event) => { changeProperty(property, event.target.value) }

    return (
        <Stack direction={'row'}>
            <TextField label='height' type="number" value={viewBox.height} onChange={makeHandler('height')} />
            <TextField label='width' type="number" value={viewBox.width} onChange={makeHandler('width')} />

            <TextField sx={{ minWidth: 100 }} label='background' type="color" value={background} onChange={ev => { setBackground(ev.target.value) }} />
        </Stack>
    )
}