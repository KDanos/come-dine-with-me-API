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
        console.log('allErrors was initially: ', allErrors)
        allErrors.forEach(keyValuePair => {
            const [fieldName, value] = keyValuePair
            errorResponse[fieldName] =  `${fieldName} "${value}" already taken. Please chose another`
            
        })
        return res.status(400).json(errorResponse)
    }

    //Cast error
    if(error.name === 'CastError' && error.kind === 'ObjectId')
        return res.status (404).json({message: 'Constantinos could not find this resource'})
    //Validation error
    errorObjects.forEach(error =>{
        errorResponse[error?.properties?.path || error.path ||'fieldError']=error?.properties?.message || error.message|| 'There has been some kind of validation error'
    })
    // console.log(error)
    return res.status(error.status || 500).json({message: error.message || 'Something went wrong'})
}

export default errorHandler