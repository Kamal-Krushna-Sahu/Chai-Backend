// 1st way "asyncHandler using promise"
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

/*
NOTE:-
-----
const asyncHandler = () => {}                   //asyncHandler() is a higher order function which accepts a function as parameter or returns a function

const asyncHandler = (func) => {() => {}}       // function as parameter

const asyncHandler = (func) => () => {}         // removed outer curly braces works the same

const asyncHandler = (func) => async () => {}   // made the function asynchronous
*/

/*
// 2nd way "asyncHandler using try-catch"
const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false, // used by frontend developer
      message: err.message,
    });
  }
};

export { asyncHandler }
*/
