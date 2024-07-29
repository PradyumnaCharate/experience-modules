
const { Mongoose, default: mongoose } = require("mongoose");
const Service = require("../../common/CommonService");
class RolepermissionsmappingService extends Service {
  constructor(model) {
    super(model);
  }
  async createMany(permissions){
    const rolePermissionMappings = await this.model.insertMany(permissions);
    return rolePermissionMappings;
  }
  async deleteMany(roleId,permissions){
    const removedPermissionMappings = await this.model.deleteMany({ role:roleId, permission: { $in: permissions }});
    return removedPermissionMappings;
  }
  async updateRolePermissions(roleId, selectedPermissions) {
    const currentRolePermissions = await this.model.find({ role: roleId });
    const currentPermissionIds = currentRolePermissions.map(mapping => mapping.permission);
    const permissionsToAdd = selectedPermissions.filter(permissionId => !(currentPermissionIds.includes(permissionId)));
    const permissionsToRemove = currentPermissionIds.filter(permissionId => !selectedPermissions.includes(permissionId));
    const addedMappings = permissionsToAdd.map(permissionId => ({
      role: roleId,
      permission: permissionId
    }));
    const addedItems = await this.createMany(addedMappings);
    const removedPermissionMappings = await this.deleteMany(roleId,permissionsToRemove);
    return {
      addedItems,
      removedPermissionIds: permissionsToRemove
    };
  }

  async findByRoleAndCode(role,code){
    const rolePermissionMappings = await this.model.findOne({role,permission:code}).populate("role")
    return rolePermissionMappings;
  }
  async getMyPermissions(role,codesOnly=true){
    let permissions;
    if(codesOnly){
      permissions = await this.model.aggregate([
        {
          $match: { role: mongoose.Types.ObjectId(role) } 
        },
        {
          $lookup: {
            from: 'permissions',
            localField: 'permission',
            foreignField: 'code',
            as: 'items'
          }
        },
        {
          $unwind: '$items' // Flatten the 'permissions' array
        },
        {
          $lookup: {
            from: 'permissiongroups',
            localField: 'items.permissionGroup',
            foreignField: '_id',
            as: 'items.permissionGroup'
          },
        },
        
        {
          $group: {
            _id: '$role', // Group by the 'role' field
            items: { $push:'$items.code' } // Collect 'code' values into an array for each role
          }
        },  
        {
          $project: {
            _id: 0, 
            items: 1 
          },
          
        }
      ])

    }else{
      permissions = await this.model.aggregate([
        {
          $match: { role: mongoose.Types.ObjectId(role) } // Match your desired role
        },
        {
          $lookup: {
            from: 'permissions',
            localField: 'permission',
            foreignField: 'code',
            as: 'items'
          }
        },
        {
          $unwind: '$items' // Flatten the 'permissions' array
        },
        {
          $lookup: {
            from: 'permissiongroups',
            localField: 'items.permissionGroup',
            foreignField: '_id',
            as: 'items.permissionGroup'
          }
        },
        {
          $unwind: '$items.permissionGroup' // Unwind the 'permissionGroup' array
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'roleInfo'
          }
        },
        {
          $unwind: '$roleInfo' // Unwind the 'roleInfo' array
        },
        {
          $group: {
            _id: {
              role: '$role',
              permissionGroup: '$items.permissionGroup.name', // Group by 'role' and 'permissionGroup'
              priority: '$roleInfo.priority' // Include priority field
            },
            permissions: { $push: codesOnly ? '$items.code' : '$items' }
          }
        },
        {
          $group: {
            _id: '$_id.role', // Group by 'role' again
            priority: { $first: '$_id.priority' }, // Extract priority for the role
            items: {
              $push: {
                name: '$_id.permissionGroup',
                permissions: '$permissions'
              }
            } // Collect permission groups and their permissions
          }
        },
        {
          $project: {
            _id: 0,
            priority: 1, // Include priority as a separate field
            items: 1
          }
        }
      ]);
    }
    return permissions[0]?.items?{items:permissions[0].items,priority:permissions[0]?.priority}:{items:[],priority:permissions[0]?.priority};
  }

};

module.exports = RolepermissionsmappingService;