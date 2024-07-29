const Service = require("../../common/CommonService");
class RoleService extends Service {
  constructor(model) {
    super(model);
  }
  async createRoleWithPermissions(roleData, permissionIds) {
    const role = await this.model.create(roleData);
    const rolePermissionMappings = permissionIds.map((permissionId) => ({
      roleId: role._id,
      permissionId,
    }));
    await this.rolepermissionsmappingService.createMany(rolePermissionMappings);
    return role;
  }
  async removePermissionsFromRole(rolePermissionMappingIds) {
    await this.rolepermissionsmappingService.deleteMany(
      rolePermissionMappingIds
    );
    return;
  }
}

module.exports = RoleService;
