"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shield_1 = require("./Shield");
const defaultOptions = {
    mongo: true,
    proto: true,
    errorHandler: (_err, _req, res) => res.sendStatus(403),
};
function ExpressShield(options) {
    const opts = Object.assign(Object.assign({}, defaultOptions), options);
    return (req, res, next) => {
        Shield_1.Shield.evaluate(req.query, opts, (queryErr) => {
            if (queryErr) {
                opts.errorHandler(queryErr, req, res, next);
                return;
            }
            Shield_1.Shield.evaluate(req.body, opts, (bodyErr) => {
                if (bodyErr) {
                    opts.errorHandler(bodyErr, req, res, next);
                    return;
                }
                next();
            });
        });
    };
}
exports.ExpressShield = ExpressShield;
