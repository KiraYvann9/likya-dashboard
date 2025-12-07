import {create} from 'zustand'

interface permissionType {
    roleID: string|null,
    initialRolePermissions? : Array<string>,
    setInitialRolePermissions: (permissions: Array<string>) => void
    checkedRolePermissions : Array<string>
    setCheckedRolePermissions: (permissions: Array<string>) => void
    checkRole: (id:string)=> void
    addPermission: (permission: string) => void
    deletePermission: (permission: string) => void
}

export const usePermissionStore = create<permissionType>((set, get)=>({
    roleID: null,
    initialRolePermissions: [],
    setInitialRolePermissions: (permissions)=> set({initialRolePermissions: permissions}),
    checkedRolePermissions: [],
    setCheckedRolePermissions: (permissions)=> set({checkedRolePermissions: permissions}),
    checkRole: (id)=>{set({roleID: id})},
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