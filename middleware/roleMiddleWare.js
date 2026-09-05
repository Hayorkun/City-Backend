export const verifyRole = (...allowedRoles) => {
  return function(req, res, next){
    const role = req.user.role

    if(!allowedRoles.includes(role)){
      return res.status(403).json({
        success: false,
        message: "Access denied"
      })
    }
    next()
  }
}