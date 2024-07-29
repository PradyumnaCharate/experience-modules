const Service = require("../../common/CommonService");
const User = require("./users.model");
class UserService extends Service {
  constructor(model) {
    super(model);
  }
  async login(email, password) {
    const user = await User.findOne({
      email,
      isActive: true,
      isLocked: false,
    })
      .select("+password")
      .populate({
        path: "role",
        select: "id name priority",
      });
    if (!user) {
      return;
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) return;
    return user;
  }
}

module.exports = UserService;
