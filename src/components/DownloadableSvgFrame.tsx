import { svgToPng } from "@/lib/svgToPng"
import { ViewBox } from "@/types"
import { Box, Button, BoxProps } from "@mui/material"
import { MouseEventHandler, ReactNode, useRef } from "react"


interface Props {
    boxProps?: BoxProps
    children?: ReactNode
    viewBox?: ViewBox
    fileName: string
    reportClick?: { (coordinates: { x: number, y: number }): void }
}

export const DownloadableSvgFrame = ({ viewBox = {}, children, fileName, boxProps = {}, reportClick }: Props) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const { minX = 0, minY = 0, width = 100, height = 100 } = viewBox
    const viewBoxString = `${minX} ${minY} ${width} ${height}`

    const download = () => {
        if (!svgRef.current) {
            return
        }
        void svgToPng(svgRef.current, fileName)
    }

    const handleClick: MouseEventHandler<SVGSVGElement> = (event) => {
        if (!reportClick) { return }
        const { current: svg } = svgRef
        if (!svg) {
            return
        }
        const { nativeEvent: { offsetX, offsetY } } = event
        const { clientWidth, clientHeight } = svg

        const relative = {
            x: offsetX / clientWidth,
            y: offsetY / clientHeight,
        }
        reportClick({
            x: Math.round((relative.x * width) + minX),
            y: Math.round((relative.y * height) + minY),
        })
    }

    return <Box {...boxProps}>
        <svg
            ref={svgRef}
            viewBox={viewBoxString}
            xmlns="<http://www.w3.org/2000/svg>"
            onClick={handleClick}
        >
            {children}
        </svg>
        <Button variant='outlined' onClick={download}>download</Button>
    </Box>
}