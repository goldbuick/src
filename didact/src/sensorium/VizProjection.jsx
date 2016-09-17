
class VizProjection {

    plane(scale) {
        return (x, y, z) => {
            let _x = x * scale,
                _y = y * scale,
                _z = z * scale;
            return [ _x, _y, _z ];
        };
    }

    column(radius, scale) {
        return (x, y, z) => {
            y = y * scale;
            let _radius = radius + z,
                _x = Math.sin(y) * _radius,
                _y = x,
                _z = Math.cos(y) * _radius;
            return [ _x, _y, _z ];
        };
    }

    sphere(radius, scale) {
        scale *= 0.001;
        let start = Math.PI * 0.5;
        return (x, y, z) => {
            x = x * scale;
            y = y * scale;
            let xcos = Math.cos(y),
                xsin = Math.sin(y),
                ycos = Math.cos(x + start),
                ysin = Math.sin(x + start),
                height = z + radius,
                _x = -height * xcos * ycos,
                _y = height * xsin,
                _z = height * xcos * ysin;
            return [ _x, _y, _z ];
        };
    }

}

export default new VizProjection();
