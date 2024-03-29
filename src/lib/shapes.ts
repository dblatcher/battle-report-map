import { Unit, UnitDesign } from "@/types";
import { Cartesian, Point, addCartesian, getXYVector } from "./geometry";
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
        case "image-only":
            return {
                outlinePoints: [],
                patternPoints: [],
            }
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

export const getWingPath = (unit: Unit): string => {
    const { x, y, heading, width } = unit

    const forward = Math.PI + heading
    const wingScale = width * .5

    const goForward = (d: number) => getXYVector(d * wingScale, forward)
    const goRight = (d: number) => getXYVector(d * wingScale, forward + inRads(90))
    const plot = (f: number, r: number): Cartesian => addCartesian([goForward(f), goRight(r)]);

    const topRight = plot(.5, 2)
    const oneRight = plot(.3, 1.8)
    const oneRightIn = plot(.3, 1.6)
    const twoRight = plot(.1, 1.6)
    const twoRightIn = plot(.1, 1.4)
    const threeRight = plot(-.1, 1.4)
    const threeRightIn = plot(-.1, 1.2)
    const fourRight = plot(-.3, 1.2)
    const fourRightIn = plot(-.3, 1.0)

    const topLeft = plot(.5, -2)
    const oneLeft = plot(.3, -1.8)
    const oneLeftIn = plot(.3, -1.6)
    const twoLeft = plot(.1, -1.6)
    const twoLeftIn = plot(.1, -1.4)
    const threeLeft = plot(-.1, -1.4)
    const threeLeftIn = plot(-.1, -1.2)
    const fourLeft = plot(-.3, -1.2)

    const pointAt = (v: Cartesian) => `${x + v.x}, ${y + v.y}`
    const arcRadi = `${wingScale * .2} ${wingScale * .2}`

    return `
    M ${pointAt(topRight)}

    A ${arcRadi} 0 0 0 ${pointAt(oneRight)}
    L ${pointAt(oneRightIn)}
    L ${pointAt(oneRight)}

    A ${arcRadi} 0 0 0 ${pointAt(twoRight)}
    L ${pointAt(twoRightIn)}
    L ${pointAt(twoRight)}

    A ${arcRadi} 0 0 0 ${pointAt(threeRight)}
    L ${pointAt(threeRightIn)}
    L ${pointAt(threeRight)}

    A ${arcRadi} 0 0 0 ${pointAt(fourRight)}
    L ${pointAt(fourRightIn)}
    L ${pointAt(fourRight)}

    L ${pointAt(fourLeft)}

    A ${arcRadi} 0 0 0 ${pointAt(threeLeft)}
    L ${pointAt(threeLeftIn)}
    L ${pointAt(threeLeft)}

    A ${arcRadi} 0 0 0 ${pointAt(twoLeft)}
    L ${pointAt(twoLeftIn)}
    L ${pointAt(twoLeft)}

    A ${arcRadi} 0 0 0 ${pointAt(oneLeft)}
    L ${pointAt(oneLeftIn)}
    L ${pointAt(oneLeft)}

    A ${arcRadi} 0 0 0 ${pointAt(topLeft)}
    L ${pointAt(topRight)}
    `
}


export const pointToString = (pair: Point) => `${pair[0]},${pair[1]}`

export const scalePoint: { (scale: number): { (point: Point): Point } } = (scale) => (point) => ([point[0] * scale, point[1] * scale])
