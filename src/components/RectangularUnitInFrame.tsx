import { UnitDesign } from "@/types"
import { RectangularUnit } from "./RectangularUnit"
import { SvgFrame } from "./SvgFrame"

interface Props {
    unit: UnitDesign
}

export const RectangularUnitInFrame = ({ unit }: Props) => {
    const { width, height, arrowSize = 2 } = unit
    return (
        <SvgFrame boxProps={{ sx: { width: '60px' } }} viewBox={{
            width: width,
            height: height + 2 * arrowSize,
            minX: -width / 2,
            minY: -height / 2
        }}>
            <RectangularUnit {...unit} heading={0} x={0} y={0 + 2 * arrowSize} />
        </SvgFrame>
    )
}