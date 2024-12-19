import {create} from 'zustand'

interface permissionType {
    roleID: string|null,
    checkedRolePermissions : Array<string>
    initialCheckedRolePermissions: Array<string>
    checkRole: (id:string, permission: Array<string>)=> void
    addPermission: (permission: string) => void
    deletePermission: (permission: string) => void
}

export const usePermissionStore = create<permissionType>((set, get)=>({
    roleID: null,
    checkedRolePermissions: [],
    initialCheckedRolePermissions: [],
    checkRole: (id, permission)=>{set({roleID: id, checkedRolePermissions: permission, initialCheckedRolePermissions: permission})},
    addPermission: (permission)=> {
        const {checkedRolePermissions} = get()
        const newPermissions = [...checkedRolePermissions, permission]
        set({checkedRolePermissions: newPermissions})
    },
    deletePermission: (permission) =>{
        const {checkedRolePermissions} = get()
        const newPermissions = checkedRolePermissions.filter((perm)=> perm !== permission)
        set({checkedRolePermissions: newPermissions})
    }
}))