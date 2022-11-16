const ERRORS = {
    UNKNOWN_ERROR: {
        code: 1,
        status: 500
    },
    USER_NOT_EXIST: {
        code: 2,
        status: 402
    },
    INPUT_DATA_MISSING: {
        code: 3,
        status: 402
    },
    DUPLICATED_USER: {
        code: 4,
        status: 402
    }
};

export default ERRORS;