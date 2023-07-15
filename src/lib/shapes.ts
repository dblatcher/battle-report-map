import { Unit, UnitDesign } from "@/types";
import { Point, getXYVector } from "./geometry";
import { inRads } from "./uitl";

const getRectangularUnitPoints = (design: UnitDesign) => {
    const { width, height, arrowSize = 2, patternShape } = design

    const topLeft: Point = [- width / 2, - height / 2]
    const arrowLeft: Point = [- arrowSize, - height / 2]
    const arrowFront: Point = [0, - height / 2 - arrowSize]
    const arrowRight: Point = [arrowSize, - height / 2]
    const topRight: Point = [width / 2, - height / 2]
    const bottomRight: Point = [width / 2, + height / 2]
    const bottomLeft: Point = [- width / 2, + height / 2]

    const midLeft: Point = [-width / 2, 0]
    const midRight: Point = [+width / 2, 0]

    const outlinePoints = [
        topLeft,
        arrowLeft,
        arrowFront,
        arrowRight,
        topRight,
        bottomRight,
        bottomLeft
    ]

    const patternPoints = patternShape === 'left-diagonal' ?
        [
            topLeft,
            bottomRight,
            bottomLeft
        ] : patternShape === 'right-diagonal' ? [topRight, bottomLeft, bottomRight] : patternShape === 'vertical' ? [
            midLeft, midRight, bottomRight, bottomLeft
        ] : undefined

    return { outlinePoints, patternPoints }
}

const getTriangularPoints = (design: UnitDesign) => {
    const { width, height, patternShape } = design
    const front: Point = [0, - height / 2]
    const bottomRight: Point = [width / 2, + height / 2]
    const bottomLeft: Point = [- width / 2, + height / 2]
    const xAtHalfWayUp = (height / 2) / (height / (width / 2))
    const halfRight: Point = [xAtHalfWayUp, 0]
    const halfLeft: Point = [- xAtHalfWayUp, 0]
    const outlinePoints = [
        front,
        bottomRight,
        bottomLeft
    ]
    const patternPoints = patternShape === 'left-diagonal' ?
        [halfLeft, bottomRight, bottomLeft] : patternShape === 'right-diagonal' ? [halfRight, bottomRight, bottomLeft] : patternShape === 'vertical' ? [halfLeft, halfRight, bottomRight, bottomLeft] : undefined

    return { outlinePoints, patternPoints }
}

export const getPoints = (design: UnitDesign): {
    outlinePoints: Point[],
    patternPoints?: Point[]
} => {
    switch (design.shape) {
        case "rectangle":
            return getRectangularUnitPoints(design)
        case "triangle":
            return getTriangularPoints(design)
        case "circle":
            return getRectangularUnitPoints(design)
    }
}

export const getCirclePaths = (unit: Unit): {
    outlinePath: string,
    patternPath?: string,
} => {

    const { x, y, heading, width, arrowSize = 2, patternShape } = unit
    const radius = width / 2
    const arrowLeft = getXYVector(radius, Math.PI + heading - inRads(10));
    const arrowRight = getXYVector(radius, Math.PI + heading + inRads(10));
    const arrowFront = getXYVector(radius + arrowSize, Math.PI + heading);

    const outlinePath = `
        M ${x + arrowLeft.x}, ${y + arrowLeft.y}
        A ${radius} ${radius} 0  1 1 ${x + arrowRight.x} ${y + arrowRight.y}
        L ${x + arrowFront.x} ${y + arrowFront.y} 
        L ${x + arrowLeft.x} ${y + arrowLeft.y}
    `

    let patternPath: string | undefined = undefined
    switch (patternShape) {
        case 'vertical': {
            const circleFront = getXYVector(radius, Math.PI + heading);
            const circleBack = getXYVector(-radius, Math.PI + heading);
            patternPath = `
            M ${x + circleFront.x}, ${y + circleFront.y}
            A ${radius} ${radius} 0  1 1 ${x + circleBack.x} ${y + circleBack.y}
            `
            break
        }
        case 'left-diagonal': {
            const circleFront = getXYVector(radius, Math.PI + heading + inRads(45));
            const circleBack = getXYVector(-radius, Math.PI + heading + inRads(45));
            patternPath = `
            M ${x + circleFront.x}, ${y + circleFront.y}
            A ${radius} ${radius} 0  1 0 ${x + circleBack.x} ${y + circleBack.y}
            `
            break
        }
        case 'right-diagonal': {
            const circleFront = getXYVector(radius, Math.PI + heading - inRads(45));
            const circleBack = getXYVector(-radius, Math.PI + heading - inRads(45));
            patternPath = `
            M ${x + circleFront.x}, ${y + circleFront.y}
            A ${radius} ${radius} 0  1 1  ${x + circleBack.x} ${y + circleBack.y}
            `
            break
        }
    }

    return {
        outlinePath,
        patternPath,
    }
}

export const pointToString = (pair: Point) => `${pair[0]},${pair[1]}`

export const scalePoint: { (scale: number): { (point: Point): Point } } = (scale) => (point) => ([point[0] * scale, point[1] * scale])
