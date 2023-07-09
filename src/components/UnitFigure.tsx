import { Point, rotate, translate } from "@/lib/geometry";
import { getPoints } from "@/lib/shapes";
import { Unit } from "@/types";
import { MarkersOnUnit } from "./Markers";
import { inDegrees } from "@/lib/uitl";


type Props = { unit: Unit, isActive?: boolean, showMarkers?: boolean }


const pointToString = (pair: Point) => `${pair[0]},${pair[1]}`

export const UnitFigure = ({ unit, isActive, showMarkers }: Props) => {
    const { x, y, heading, col1, col2, badge } = unit

    const { outlinePoints, patternPoints } = getPoints(unit)

    const outline = outlinePoints.map(rotate(heading))
        .map(translate(x, y))
        .map(pointToString)
        .join(" ")

    const pattern = patternPoints?.map(rotate(heading))
        .map(translate(x, y))
        .map(pointToString)
        .join(" ")

    return (
        <g style={isActive ? { filter: 'drop-shadow(0px 0px 9px white' } : {}}>
            <polygon points={outline} fill={col1} stroke="none" />
            {pattern && <polygon points={pattern} fill={col2} stroke="none" />}
            <polygon points={outline} fill="none" stroke="black" />

            {badge && (
                <image {...badge} transform={`
                translate(${x} ${y})
                rotate (${inDegrees(-heading)})
                translate(${-badge.width / 2} ${-badge.height / 2})
                `} 
                preserveAspectRatio="none"
                />
            )}
            {showMarkers && <MarkersOnUnit unit={unit} />}

        </g>
    )
}