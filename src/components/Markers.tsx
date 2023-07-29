import { Point, rotate, translate } from "@/lib/geometry";
import { pointToString, scalePoint } from "@/lib/shapes";
import { Unit } from "@/types";


type Props = { unit: Unit }
type HitType = 'hit' | 'magic'

type HitmarkerProps = { unit: Unit, index: number, hitType: HitType }

const getMarkerPosition = (index: number, width: number, height: number): Point => {
    const x = (10 * (index % 5) + 5) * width / 50
    const y = (8 * (index % 3) + 2 * (index % 6)) * height / 50
    return [x, y]
}

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

const markerColors = {
    hit: {
        stroke: 'red',
        fill: 'yellow',
        fillOpacity: .8
    },
    magic: {
        stroke: 'white',
        fill: 'skyblue',
        fillOpacity: 1,
    }
}

const HitMarker = ({ unit: { x, y, heading, width, height }, index, hitType }: HitmarkerProps) => {
    const points = markerShape.map(rotate(heading + index / 5))
        .map(translate(x - width / 2, y - height / 3))
        .map(translate(...getMarkerPosition(index, width, height)))
        .map(pointToString)
        .join(" ")

    const colorScheme = markerColors[hitType]
    return (
        <polygon {...colorScheme} points={points} strokeWidth={.25} />
    )
}


export const MarkersOnUnit = ({ unit }: Props) => {
    const { hits = 0, magicHits = 0 } = unit
    const hitCount: HitType[] = []
    hitCount.length = hits + magicHits
    hitCount.fill('hit', 0, hits)
    hitCount.fill('magic', hits, hits + magicHits)
    return (
        <>
            {hitCount.map((hitType, index) => <HitMarker key={index} unit={unit} index={index} hitType={hitType} />)}
        </>
    )
}