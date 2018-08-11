var noise = (function () {

    function perlin(size, dim) {
        var gradients = new Array(size),
            fns = {},
            self = this;

        function init2D() {
            var x, y, v, h;
            for (y = 0; y < size; y++) {
                gradients[y] = new Array(size);
                for (x = 0; x < size; x++) {
                    v = [Math.random() * 2 - 1, Math.random() * 2 - 1];
                    h = 1 / Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
                    v[0] = v[0] * h;
                    v[1] = v[1] * h;
                    gradients[y][x] = v;
                }
                gradients[y][size] = gradients[y][0];
            }
            gradients[y] = gradients[0];
        }

        function init3D() {
            var x, y, z, v, h;
            for (y = 0; y < size; y++) {
                gradients[y] = new Array(size);
                for (x = 0; x < size; x++) {
                    gradients[y][x] = new Array(size);
                    for (z = 0; z < size; z++) {
                        v = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1];
                        h = 1 / Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));
                        v[0] = v[0] * h;
                        v[1] = v[1] * h;
                        v[2] = v[2] * h;
                        gradients[y][x][z] = v;
                    }
                    gradients[y][x][size] = gradients[y][x][0];
                }
                gradients[y][size] = gradients[y][0];
            }
            gradients[y] = gradients[0];
        }

        function init() {
            dim = dim || 2;

            if (dim === 2) {
                init2D();
                self.noise = fns["noise2D"];
            } else {
                self.noise = fns["noise3D"];
                init3D();
            }
        }

        this.gradient = function (x, y, z) {
            if (dim === 2) {
                return gradients[y][x];
            }
            return gradients[y][x][z];
        }

        function subtract(a, b) {
            if (dim === 2) {
                return [a[0] - b[0], a[1] - b[1]];
            }
            return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
        }

        function dot(a, b) {
            if (dim === 2) {
                return a[0] * b[0] + a[1] * b[1];
            }
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }

        fns.noise2D = function (v) {
            var xf = Math.floor(v[0] % size),
                yf = Math.floor(v[1] % size),
                xsf = v[0] % 1,
                ysf = v[1] % 1,
                xe = 3 * Math.pow(xsf, 2) - 2 * Math.pow(xsf, 3),
                ye = 3 * Math.pow(ysf, 2) - 2 * Math.pow(ysf, 3),
                xse = xf + xsf,
                yse = yf + ysf,
                sv = [xse, yse],
                ul = gradients[yf][xf],
                ulv = [xf, yf],
                ur = gradients[yf][xf + 1],
                urv = [xf + 1, yf],
                bl = gradients[yf + 1][xf],
                blv = [xf, yf + 1],
                br = gradients[yf + 1][xf + 1],
                brv = [xf + 1, yf + 1],
                uld = subtract(sv, ulv),
                urd = subtract(sv, urv),
                bld = subtract(sv, blv),
                brd = subtract(sv, brv),
                dp1 = dot(ul, uld),
                dp2 = dot(ur, urd),
                dp3 = dot(bl, bld),
                dp4 = dot(br, brd),
                z1 = (dp1 * (1 - xe) + dp2 * (xe)),
                z2 = (dp3 * (1 - xe) + dp4 * xe),
                val = (z1 * (1 - ye) + z2 * ye);
            return val;
        }

        fns.noise3D = function (v) {
            var xf = Math.floor(v[0] % size),
                yf = Math.floor(v[1] % size),
                zf = Math.floor(v[2] % size),
                xsf = v[0] % 1,
                ysf = v[1] % 1,
                zsf = v[2] % 1,
                xe = 3 * Math.pow(xsf, 2) - 2 * Math.pow(xsf, 3),
                ye = 3 * Math.pow(ysf, 2) - 2 * Math.pow(ysf, 3),
                ze = 3 * Math.pow(zsf, 2) - 2 * Math.pow(zsf, 3),
                xse = xf + xsf,
                yse = yf + ysf,
                zse = zf + zsf,

                sv = [xse, yse, zse],

                ul = gradients[yf][xf][zf],
                ulv = [xf, yf, zf],

                ur = gradients[yf][xf + 1][zf],
                urv = [xf + 1, yf, zf],

                bl = gradients[yf + 1][xf][zf],
                blv = [xf, yf + 1, zf],

                br = gradients[yf + 1][xf + 1][zf],
                brv = [xf + 1, yf + 1, zf],


                ful = gradients[yf][xf][zf + 1],
                fulv = [xf, yf, zf + 1],

                fur = gradients[yf][xf + 1][zf + 1],
                furv = [xf + 1, yf, zf + 1],

                fbl = gradients[yf + 1][xf][zf + 1],
                fblv = [xf, yf + 1, zf + 1],

                fbr = gradients[yf + 1][xf + 1][zf + 1],
                fbrv = [xf + 1, yf + 1, zf + 1],


                uld = subtract(sv, ulv),
                urd = subtract(sv, urv),
                bld = subtract(sv, blv),
                brd = subtract(sv, brv),

                fuld = subtract(sv, fulv),
                furd = subtract(sv, furv),
                fbld = subtract(sv, fblv),
                fbrd = subtract(sv, fbrv),


                dp1 = dot(ul, uld),
                dp2 = dot(ur, urd),
                dp3 = dot(bl, bld),
                dp4 = dot(br, brd),

                fdp1 = dot(ful, fuld),
                fdp2 = dot(fur, furd),
                fdp3 = dot(fbl, fbld),
                fdp4 = dot(fbr, fbrd),


                z1 = (dp1 * (1 - xe) + dp2 * (xe)),
                z2 = (dp3 * (1 - xe) + dp4 * xe),
                z3 = (fdp1 * (1 - xe) + fdp2 * (xe)),
                z4 = (fdp3 * (1 - xe) + fdp4 * xe),

                val1 = (z1 * (1 - ye) + z2 * ye),
                val2 = (z3 * (1 - ye) + z4 * ye),

                val = (val1 * (1 - ze) + val2 * ze)

                ;

            return val;
        }

        init();
    }

    return {
        perlin: perlin
    }

}());

