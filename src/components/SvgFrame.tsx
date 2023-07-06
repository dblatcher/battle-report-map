import { Box, BoxProps } from "@mui/material"
import { CSSProperties, ReactNode } from "react"


interface Props {
    children?: ReactNode
    boxProps?: BoxProps
    viewBox?: {
        minX?: number
        minY?: number
        width?: number
        height?: number
    }
}

export const SvgFrame = ({ viewBox = {}, children, boxProps }: Props) => {
    const { minX = 0, minY = 0, width = 100, height = 100 } = viewBox
    const viewBoxString = `${minX} ${minY} ${width} ${height}`

    return <Box {...boxProps}>
        <svg
            viewBox={viewBoxString}
            xmlns="<http://www.w3.org/2000/svg>"
        >
            {children}
        </svg>
    </Box>
}