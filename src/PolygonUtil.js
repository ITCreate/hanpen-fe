/**
 * 三角形の面積を求める
 * @param {Array} points  
 */
export const calcTriangleArea = (points) => {
    const hasOrgin = points.some(isOrigin);
    
    // 原点がない場合
    if (!hasOrgin) {
        const closestOriginPoint = points.sort(compareOriginDistance)[0]
        const [moveX, moveY] = closestOriginPoint

        points = pointsTranslation(points, moveX, moveY)
    }

    // 原点を取り除く
    const excludeOriginPoints = points.filter(point => !isOrigin(point)).sort(compareOriginDistance)
    
    const [ x1, y1 ] = excludeOriginPoints[0]
    const [ x2, y2 ] = excludeOriginPoints[1]
    
    return Math.abs(((x1 * y2) - (x2 * y1))) / 2
}

/**
 * 点たちを平行移動させる
 * @param {Array} points 
 * @param {number} moveX 
 * @param {number} moveY 
 */
const pointsTranslation = (points, moveX, moveY) => {
    return points.map( ([x, y]) => [ x - moveX, y - moveY ])
}

/**
 * 原点(0,0)か
 * @param {*} point 
 */
const isOrigin = (point) => {
    return point[0] === 0 && point[1] === 0;
}

/**
 * 原点からどれだけ遠いか
 * 数値が大きいほど遠い
 */
const distanceOrigin = (point) => {
    const [x, y] = point
    return Math.abs(0 - x) + Math.abs(0 -y )
}

/**
 * 原点から近い順に並べる
 */
const compareOriginDistance = (point1, point2) => {
    return distanceOrigin(point1) - distanceOrigin(point2)
}


/**
 * 2点から直線の公式を求める
 * @param {*} point1 
 * @param {*} point2 
 */
export const twoPointsToLineEquation = (point1, point2) => {
    const [x1, y1] = point1
    const [x2, y2] = point2

    return {
        a: (y2 - y1) / (x2 - x1),
        b: (x2 * y1 - x1 * y2) / (x2 - x1)
    }
}

/**
 * 2直線の交点を求める
 * @param {*} line1 
 * @param {*} line2 
 */
export const calcIntersection = (line1, line2) => {
    const { a: a1, b: b1 } = twoPointsToLineEquation(line1[0], line1[1])
    const { a: a2, b: b2 } = twoPointsToLineEquation(line2[0], line2[1])

    console.log(a1, b1, a2, b2)
    const x = (b2 - b1) / (a1 - a2)
    const y = (a1 * x) + b1
    return [ x, y ]
}

/**
 * 正しく動かない
 * 複数の点から面積を求める
 * @param {Array} points 
 */
export const calcPolygonArea = (points) => {
    console.log(points)
    return Math.abs(points.reduce((p, c, i, arr) => {
        const [xJ, yJ] = c

        if (!arr[i + 1]) {
            return p
        } else {
            const [xJ1, yJ1] = arr[i + 1]
            return p + ((xJ - xJ1) * (yJ + yJ1))
        }

    }, 0)) / 2
}