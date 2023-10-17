import { inDegrees } from "@/lib/uitl"
import { ImageAsset } from "@/types"

interface Props {
    asset: ImageAsset
    x: number,
    y: number,
    heading: number
}

export const PlacedImage = ({ asset, x, y, heading }: Props) => {


    const { width, height, href } = asset

    return (
        <g transform={`
        translate(${x} ${y})
        rotate (${inDegrees(-heading)})
        translate(${-width / 2} ${-height / 2})
        `}>
            <image href={href} width={width} height={height} preserveAspectRatio="none"
            />
        </g>
    )
}