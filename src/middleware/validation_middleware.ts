/* in the /signup route, this runValidation() middlware runs before the signup() controller function that handles
creating the User model. in order to be able to configure runValidation() to validate the correct schema and look at the
correct property in the request object, we have to wrap it in another function. this first function takes these two
configuration variables as arguments, which causes them to be captured in a closure so they will be available to the
wrapped function that is returned by this first wrapper function. */
export const runValidation = (schema, property='body') => async (ctx, next) => {
  const { error } = schema.validate(ctx.request[property])
  if (error) {
    ctx.status = 422
    ctx.body = {
      message: error.details.map(i => i.message).join(',')
    }
  } else {
    /* the signup() controller function that executes after this middlware function is an async function. in order for
    that to work right, this previous runValidation() middlware function needs to wait for the next() function's promise
    to be fulfilled, otherwise the router will not wait and will instead return the default empty response with status
    404. making this middleware function async as well, and waiting for next(), is the best way to accomplish this */
    await next()
  }
}
