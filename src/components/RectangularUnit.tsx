import { rotate } from "@/lib/geometry";

interface Props {
    x: number;
    y: number;
    width: number;
    height: number;
    heading?: number;
    arrowSize?: number;
}

const pointToString = (pair: [number, number]) => `${pair[0]},${pair[1]}`

export const RectangularUnit = ({ x, y, width, height, heading = 0, arrowSize = 3 }: Props) => {

    const rotateByHeading = rotate(heading)
    const translate = (p: [number, number]): [number, number] => { return [p[0] + x, p[1] + y] }
    const topLeft: [number, number] = [- width / 2, - height / 2]
    const arrowLeft: [number, number] = [- arrowSize, - height / 2]
    const arrowFront: [number, number] = [0, - height / 2 - arrowSize]
    const arrowRight: [number, number] = [arrowSize, - height / 2]
    const topRight: [number, number] = [width / 2, - height / 2]
    const bottomRight: [number, number] = [width / 2, + height / 2]
    const bottomLeft: [number, number] = [- width / 2, + height / 2]

    const pointsString = [
        topLeft,
        arrowLeft,
        arrowFront,
        arrowRight,
        topRight,
        bottomRight,
        bottomLeft
    ].map(rotateByHeading)
        .map(translate)
        .map(pointToString)
        .join(" ")

    return <>
        <polygon points={pointsString} fill="none" stroke="black" />
        <circle cx={x} cy={y} r={1} />
    </>
}