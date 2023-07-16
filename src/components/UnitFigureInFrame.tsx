import { UnitDesign } from "@/types"
import { UnitFigure } from "./UnitFigure"
import { SvgFrame } from "./SvgFrame"
import { BoxProps } from "@mui/material"

interface Props {
    unit: UnitDesign
    boxProps?: BoxProps
}

export const UnitFigureInFrame = ({ unit, boxProps = { sx: { width: '60px' } } }: Props) => {
    const { width, height, arrowSize = 2, } = unit
    return (
        <SvgFrame boxProps={boxProps} viewBox={{
            width: width*1.5,
            height: height + 2 * arrowSize,
            minX: -width * .75,
            minY: -height * .5
        }}>
            <UnitFigure unit={{
                ...unit,
                heading: 0,
                x: 0,
                y: 2 * arrowSize,
            }} />
        </SvgFrame>
    )
}