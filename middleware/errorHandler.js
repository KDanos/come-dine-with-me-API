const errorHandler = (error, req, res, next) => {
    console.log('⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔')
    console.log('you are inside Konstantin errorhandler')
    console.log(error)
    console.log('⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔')

    //Define an object to which we can append new error keys
    const errorResponse = {}

    //Unique constaint
    if (error.code === 11000) {
        const allErrors = Object.entries(error.keyValue)
        console.log('allErrors is currently: ', allErrors)
        allErrors.forEach(keyValuePair => {
            const [fieldName, value] = keyValuePair
            errorResponse[fieldName] =  `${fieldName} "${value}" already taken. Please chose another`
            'THIS IS A TEMP ERROR MESSAGE'
        })
        return res.status(400).json(errorResponse)
    }

    //Cast error
    if(error.name === 'CastError' && error.kind === 'ObjectId')
        return res.status (404).json({message: 'Constantinos could not find this resource'})
    
    return res.json(error)
}

export default errorHandler