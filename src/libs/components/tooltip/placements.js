const offset = 8
const placements = {
    getLeft: ({left, width, height, bottom, top}) => ({
        x: left - offset - width,
        y: (bottom - top - height) / 2 + top,
        placement: "left"
    }),
    getRight: ({right, height, bottom, top}) => ({
        x: right + offset,
        y: (bottom - top - height) / 2 + top,
        placement: "right"
    }),
    getTop: ({right, left, width, height, top}) => ({
        x: (right - left - width) / 2 + left,
        y: top - offset - height,
        placement: "top"
    }),
    getBottom: ({right, left, width, bottom}) => ({
        x: (right - left - width) / 2 + left,
        y: bottom + offset,
        placement: "bottom"
    }),
    left ({width, height, top, bottom, left, right}, {innerWidth}) {
        if (left - width - offset > 0) {
            return this.getLeft({left, width, height, bottom, top})
        }

        if (width + right + offset < innerWidth) {
            return this.getRight({right, height, bottom, top})
        }

        if (top - offset - height > 0) {
            return this.getTop({right, left, width, height, top})
        }

        if (bottom + offset + height) {
            return this.getBottom({right, left, width, bottom})
        }
    },
    right({width, height, top, bottom, left, right}, {innerWidth, innerHeight}) {
        if (width + right + offset < innerWidth) {
            return this.getRight({right, height, bottom, top})
        }

        if (left - width - offset > 0) {
            return this.getLeft({left, width, height, bottom, top})
        }

        if (top - offset - height > 0) {
            return this.getTop({right, left, width, height, top})
        }

        if (bottom + offset + height < innerHeight) {
            return this.getBottom({right, left, width, bottom})
        }
    },
    top ({width, height, top, bottom, left, right}, {innerWidth, innerHeight}) {
        if (top - offset - height > 0) {
            return this.getTop({right, left, width, height, top})
        }

        if (bottom + offset + height < innerHeight) {
            return this.getBottom({right, left, width, bottom})
        }

        if (left - width - offset > 0) {
            return this.getLeft({left, width, height, bottom, top})
        }

        if (width + right + offset < innerWidth) {
            return this.getRight({right, height, bottom, top})
        }
    },
    bottom({width, height, top, bottom, left, right}, {innerWidth, innerHeight}) {
        if (bottom + offset + height < innerHeight) {
            return this.getBottom({right, left, width, bottom})
        }

        if (top - offset - height > 0) {
            return this.getTop({right, left, width, height, top})
        }

        if (left - width - offset > 0) {
            return this.getLeft({left, width, height, bottom, top})
        }

        if (width + right + offset < innerWidth) {
            return this.getRight({right, height, bottom, top})
        }
    }
}

export default function(placement, info) {
    const {innerWidth, innerHeight} = window
    return placements[placement](info, {innerWidth, innerHeight}) || placements.getTop({...info, innerWidth, innerHeight})
}