export const secret = (ctx) => {
  ctx.status = 200
  ctx.body = {
    message: 'Able to reach route with authentication',
    user: ctx.state.user
  }
}

export const protection = async (ctx) => {
  ctx.status = 200
  ctx.body = {
    message: 'The protected endpoint is also able to reach route with authentication',
    user: ctx.state.user
  }
}
