// API for simple message
export const simpleMessage = async (req, res, next) => {
    try {
        if (req.method == 'POST' && req.body.name !== undefined)
            return res.send(`Hello World Name ${req.body.name} received`)
        else
            return res.send('Hello World')
    } catch (error) {
        return next(error)
    }
}