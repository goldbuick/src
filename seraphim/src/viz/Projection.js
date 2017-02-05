
class Projection {

    plane(scale) {
        return (x, y, z) => {
            let _x = x * scale,
                _y = y * scale,
                _z = z * scale;
            return [ _x, _y, _z ];
        };
    }

    column(radius, scale) {
        scale *= 0.001;
        return (x, y, z) => {
            x = x * scale;
            let _radius = radius + z,
                _x = Math.sin(x) * _radius,
                _y = y,
                _z = Math.cos(x) * _radius;
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

export default new Projection();
