import { svgToPng } from "@/lib/svgToPng"
import { Box, Button, BoxProps } from "@mui/material"
import { ReactNode, useRef } from "react"


interface Props {
    boxProps?: BoxProps
    children?: ReactNode
    viewBox?: {
        minX?: number
        minY?: number
        width?: number
        height?: number
    }
    fileName: string
}

export const DownloadableSvgFrame = ({ viewBox = {}, children, fileName, boxProps = {} }: Props) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const { minX = 0, minY = 0, width = 100, height = 100 } = viewBox
    const viewBoxString = `${minX} ${minY} ${width} ${height}`

    const download = () => {
        if (!svgRef.current) {
            return
        }
        svgToPng(svgRef.current, fileName)
    }

    return <Box {...boxProps}>

        <svg
            ref={svgRef}
            viewBox={viewBoxString}
            xmlns="<http://www.w3.org/2000/svg>"
        >
            {children}
        </svg>

        <Button variant='outlined' onClick={download}>download</Button>
    </Box>

}