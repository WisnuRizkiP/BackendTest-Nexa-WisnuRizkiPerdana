const responseSuccess = (data,message) => {
    return {
        status: 200,
        body: {
            status: 'Success',
            message: message || 'Success',
            data,
        },
    };
}

const responseError = (message) => {
    return {
        status: 200,
        body: {
            status: 'Success',
            message: message || 'Success With warning',
        },
    };
}

const responseServerError = (message) => {
    return {
        status: 500,
        body: {
            status: 'Failed',
            message: message || 'Server error',
        },
    };
}

const responseBadRequest = (message) => {
    return {
        status: 400,
        body: {
            status: 'Failed',
            message: message || 'Success With warning',
        },
    };
}

module.exports = {
    responseSuccess,
    responseError,
    responseBadRequest,
    responseServerError
}