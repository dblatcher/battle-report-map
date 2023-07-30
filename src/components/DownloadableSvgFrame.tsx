import { svgToPngFile, svgToSvgFile } from "@/lib/svgToPng"
import { ViewBox } from "@/types"
import { Box, Button, BoxProps, Stack } from "@mui/material"
import { MouseEventHandler, ReactNode, useRef } from "react"
import Download from "@mui/icons-material/DownloadForOffline"

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

    const downloadPng = () => {
        if (!svgRef.current) {
            return
        }
        void svgToPngFile(svgRef.current, `${fileName}.png`)
    }
    const downloadSvg = () => {
        if (!svgRef.current) {
            return
        }
        void svgToSvgFile(svgRef.current, `${fileName}.svg`)
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
        <Stack padding={1} direction={'row'} justifyContent={'flex-end'} spacing={1}>
            <Button
                size="large"
                variant='outlined'
                onClick={downloadSvg}
                endIcon={<Download />}
            >download svg
            </Button>
            <Button
                size="large"
                variant='contained'
                onClick={downloadPng}
                endIcon={<Download />}
            >download png
            </Button>
        </Stack>
    </Box>
}