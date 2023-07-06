import { CSSProperties, ReactNode, useRef } from "react"


interface Props {
    children?: ReactNode
    style?: CSSProperties
    viewBox?: {
        minX?: number
        minY?: number
        width?: number
        height?: number
    }
    refFunc?: { (element: SVGSVGElement): void }
}

export const SvgFrame = ({ style = { margin: 0 }, viewBox = {}, children, refFunc }: Props) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const { minX = 0, minY = 0, width = 100, height = 100 } = viewBox
    const viewBoxString = `${minX} ${minY} ${width} ${height}`

    const doExport = () => {
        if (!refFunc) { return }

        if (!svgRef.current) {
            return
        }

        refFunc(svgRef.current)

    }

    return <figure style={style}>
        <svg
            ref={svgRef}
            viewBox={viewBoxString}
            xmlns="<http://www.w3.org/2000/svg>"
        >
            {children}
        </svg>
        {refFunc && (
            <button onClick={doExport}>e</button>
        )}
    </figure>
}