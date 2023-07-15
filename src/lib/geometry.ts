function getVectorX(magnitude: number, direction: number) { return magnitude * Math.sin(direction) }
function getVectorY(magnitude: number, direction: number) { return magnitude * Math.cos(direction) }
export function getXYVector(magnitude: number, direction: number) { return { x: getVectorX(magnitude, direction), y: getVectorY(magnitude, direction) } }

/**
 * Calculate the magnitude of an [x,y] vector, using pythagoras' theorum
 *
 * @param x the x value of the vector
 * @param y the y value of the vector
 * @returns the vector magnitude
 */
function getMagnitude(x: number, y: number) {
    return Math.sqrt((x * x) + (y * y))
}

/**
 * Calculate the direction of an [x,y] vector
 *
 * @param x the x value of the vector
 * @param y the y value of the vector
 * @returns the direction in radians
 */
function getDirection(x: number, y: number) {
    if (x == 0 && y == 0) { return 0; }
    if (y != 0 && x != 0) {
        if (y > 0) {
            return Math.atan(x / y);
        }
        if (y < 0) {
            return Math.PI + Math.atan(x / y);
        }
    }
    if (y == 0 && x != 0) {
        return x < 0 ? Math.PI * 1.5 : Math.PI * 0.5;
    }
    if (x == 0 && y != 0) {
        return y > 0 ? 0 : Math.PI * 1;
    }
}

export type Point = [number, number]

export const rotate = (heading: number) => (pair: Point): Point => {
    const [x, y] = pair
    const m = getMagnitude(x, y)
    const d = getDirection(x, y) ?? 0
    const r = getXYVector(m, d + heading)
    return [r.x, r.y]
}

export const translate = (x: number, y: number) => (point: Point): Point => { return [point[0] + x, point[1] + y] }
