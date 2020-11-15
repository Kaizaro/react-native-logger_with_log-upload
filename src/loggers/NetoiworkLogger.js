import {createLog} from '../config';

export const logRequest = (ComponentTag, methodName, parameters) => {
    createLog.request(
        JSON.stringify(
            {
                ComponentTag,
                methodName,
                parameters,
                endLine: '1',
            },
            null,
            2
        )
    );
};

export const logResponseStatus = (ComponentTag, methodName, status) => {
    createLog.response_status(
        JSON.stringify(
            {
                ComponentTag,
                methodName,
                status,
                endLine: '1',
            },
            null,
            2
        )
    );
};

export const logResponse = (ComponentTag, methodName, response) => {
    createLog.response(
        JSON.stringify(
            {
                ComponentTag,
                methodName,
                response: response,
                endLine: '1',
            },
            null,
            2
        )
    );
};

export const logResponseError = (
    ComponentTag,
    methodName,
    parameters,
    error
) => {
    createLog.response_error(
        JSON.stringify(
            {
                ComponentTag,
                methodName,
                parameters,
                error: error?.message ?? error,

                endLine: '1',
            },
            null,
            2
        )
    );
};
