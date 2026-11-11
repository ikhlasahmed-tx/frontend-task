import type { ErrorRequestHandler } from "express"
import { HttpError } from "../utils/HttpError"

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message, fields: err.fields })
        return
    }
    if (err.status >= 400 && err.status < 500) {
        res.status(err.status).json({ error: "Bad request" })
        return
    }
    console.error(err)
    res.status(500).json({ error: "Something went wrong" })
}
