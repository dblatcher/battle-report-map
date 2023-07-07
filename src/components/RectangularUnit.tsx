import { Point, rotate, translate } from "@/lib/geometry";
import { Unit } from "@/types";



type Props = { unit: Unit }


const pointToString = (pair: Point) => `${pair[0]},${pair[1]}`

export const RectangularUnit = ({ unit }: Props) => {
    const { x, y, width, height, heading = 0, arrowSize = 2, col1 = 'red', col2 = 'blue', patternShape } = unit
    const topLeft: Point = [- width / 2, - height / 2]
    const arrowLeft: Point = [- arrowSize, - height / 2]
    const arrowFront: Point = [0, - height / 2 - arrowSize]
    const arrowRight: Point = [arrowSize, - height / 2]
    const topRight: Point = [width / 2, - height / 2]
    const bottomRight: Point = [width / 2, + height / 2]
    const bottomLeft: Point = [- width / 2, + height / 2]

    const midLeft: Point = [-width / 2, 0]
    const midRight: Point = [+width / 2, 0]

    const outline = [
        topLeft,
        arrowLeft,
        arrowFront,
        arrowRight,
        topRight,
        bottomRight,
        bottomLeft
    ].map(rotate(heading))
        .map(translate(x, y))
        .map(pointToString)
        .join(" ")


    const patternPoints = patternShape === 'left-diagonal' ?
        [
            topLeft,
            bottomRight,
            bottomLeft
        ] : patternShape === 'right-diagonal' ? [topRight, bottomLeft, bottomRight] : patternShape === 'vertical' ? [
            midLeft, midRight, bottomRight, bottomLeft
        ] : undefined

    const pattern = patternPoints?.map(rotate(heading))
        .map(translate(x, y))
        .map(pointToString)
        .join(" ")

    return <g>
        <polygon points={outline} fill={col1} stroke="none" />
        {pattern && <polygon points={pattern} fill={col2} stroke="none" />}
        <polygon points={outline} fill="none" stroke="black" />
    </g>
}