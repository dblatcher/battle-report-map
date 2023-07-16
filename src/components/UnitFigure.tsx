import { Point, getXYVector, rotate, translate } from "@/lib/geometry";
import { getCirclePaths, getPoints, getWingPaths, pointToString } from "@/lib/shapes";
import { Unit } from "@/types";
import { MarkersOnUnit } from "./Markers";
import { inDegrees, inRads } from "@/lib/uitl";


type Props = { unit: Unit, isActive?: boolean, showMarkers?: boolean }


const PolygonDesign = ({ unit }: { unit: Unit }) => {

    const { x, y, heading, col1, col2 } = unit
    const { outlinePoints, patternPoints } = getPoints(unit)

    const outline = outlinePoints.map(rotate(heading))
        .map(translate(x, y))
        .map(pointToString)
        .join(" ")

    const pattern = patternPoints?.map(rotate(heading))
        .map(translate(x, y))
        .map(pointToString)
        .join(" ")

    return (<>
        <polygon points={outline} fill={col1} stroke="none" />
        {pattern && <polygon points={pattern} fill={col2} stroke="none" />}
        <polygon points={outline} fill="none" stroke="black" />
    </>
    )
}

const CircleDesign = ({ unit }: { unit: Unit }) => {
    const { col1, col2, wings } = unit
    const { outlinePath, patternPath } = getCirclePaths(unit)
    const { leftWingPath, rightWingPath } = wings ? getWingPaths(unit) : { leftWingPath: undefined, rightWingPath: undefined }

    return (<>
        <path d={outlinePath} fill={col1} />
        {patternPath && <path d={patternPath} fill={col2} />}
        <path d={outlinePath} stroke={'black'} fill="none" />
        {leftWingPath && <>
            <path d={leftWingPath} fill="white" />
            <path d={leftWingPath} stroke={'black'} fill="none" />
        </>}
        {rightWingPath && <>
            <path d={rightWingPath} fill="white" />
            <path d={rightWingPath} stroke={'black'} fill="none" />
        </>}
    </>)
}

export const UnitFigure = ({ unit, isActive, showMarkers }: Props) => {
    const { x, y, heading, badge, shape } = unit

    return (
        <g style={isActive ? { filter: 'drop-shadow(0px 0px 9px white' } : {}}>
            {shape === 'circle' ? <CircleDesign unit={unit} /> : <PolygonDesign unit={unit} />}
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