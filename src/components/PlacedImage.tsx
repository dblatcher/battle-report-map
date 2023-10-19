import { useImageDefUseNode } from "@/context/ImageDefProvider"
import { inDegrees } from "@/lib/uitl"

interface Props {
    width: number, height: number,
    href: string
    x: number,
    y: number,
    heading: number
}

export const PlacedImage = ({ width, height, href, x, y, heading }: Props) => {
    const transform = `translate(${x} ${y}) rotate (${inDegrees(-heading)}) translate(${-width / 2} ${-height / 2}) `
    const useElement = useImageDefUseNode(href)

    return (
        <g transform={transform}>
            <svg
                width={width}
                height={height}
                viewBox="0 0 100 100"
            >
                {useElement ||
                    <image href={href}
                        width={100}
                        height={100}
                        preserveAspectRatio="none"
                    />
                }
            </svg>
        </g>
    )
}