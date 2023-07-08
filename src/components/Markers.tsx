import { Point, rotate, translate } from "@/lib/geometry";
import { pointToString, scalePoint } from "@/lib/shapes";
import { Unit } from "@/types";


type Props = { unit: Unit }

type HitmarkerProps = { unit: Unit, index: number }

const getMarkerPosition = (index: number, width: number, height: number): Point => {

    const x = (10 * (index % 5) + 5) * width / 50
    const y = (8 * (index % 3) + 2 * (index % 6)) * height / 50
    return [x, y]
}

const HitMarker = ({ unit: { x, y, heading, width, height }, index }: HitmarkerProps) => {
    const markerShape: Point[] = [
        [1, -8],
        [2, -2],
        [7, 0],
        [3, 1],
        [6, 4],
        [3, 3],
        [0, 2],
        [-3, 7],
        [-4, 2],
        [-8, 2],
        [-4, -2],
        [-4, -8],
        [-1, -3],
    ].map(p => { return scalePoint(.75)(p as Point) })

    const points = markerShape.map(rotate(heading + index / 5))
        .map(translate(x - width / 2, y - height / 3))
        .map(translate(...getMarkerPosition(index, width, height)))
        .map(pointToString)
        .join(" ")

    return (
        <polygon stroke="red" fill="yellow" fillOpacity={.8} points={points} strokeWidth={.25} />
    )
}


export const MarkersOnUnit = ({ unit }: Props) => {
    const { x, y, hits = 0 } = unit
    const hitCount: unknown[] = []
    hitCount.length = hits
    hitCount.fill(1, 0, hits)
    return (
        <>
            {hitCount.map((_, index) => <HitMarker key={index} unit={unit} index={index} />)}
        </>
    )
}