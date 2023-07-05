import { CSSProperties, ReactNode } from "react"


interface Props {
    children?: ReactNode
    style?: CSSProperties
    viewBox?: {
        minX?: number
        minY?: number
        width?: number
        height?: number
    }

}

export const SvgFrame = ({ style = { margin: 0 }, viewBox = {}, children }: Props) => {

    const { minX = 0, minY = 0, width = 100, height = 100 } = viewBox
    const viewBoxString = `${minX} ${minY} ${width} ${height}`

    return <figure style={style}>
        <svg
            viewBox={viewBoxString}
            xmlns="<http://www.w3.org/2000/svg>"
        >
            {children}
        </svg>
    </figure>
}