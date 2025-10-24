    import { prisma } from "../configs/prisma";

    async function main(){
      await prisma.permission.createMany({
        data: [
          // workspace
          { permissionName: 'CREATE_WORKSPACE', description: 'create workspace' },
          { permissionName: 'VIEW_WORKSPACE', description: 'view workspace'},
          { permissionName: 'UPDATE_WORKSPACE', description: 'change visibility of workspace'},
          { permissionName: 'DELETE_WORKSPACE', description: 'delete workspace'},
          // board
          { permissionName: 'CREATE_BOARD', description: 'create board'},
          { permissionName: 'VIEW_BOARD', description: 'view board'}, 
          { permissionName: 'UPDATE_BOARD', description: 'update information of board'},
          { permissionName: 'DELETE_BOARD', description: 'delete board'},
          // card
          { permissionName: 'CREATE_CARD', description: 'create card'},
          { permissionName: 'UPDATE_CARD', description: 'update information of card'},
          { permissionName: 'DELETE_CARD', description: 'delete card'},
          // list
          { permissionName: 'CREATE_LIST', description: 'create list'},
          { permissionName: 'UPDATE_LIST',description: 'update information of list'},
          { permissionName: 'DELETE_LIST', description: 'delete list'},
          // member
          { permissionName: 'ADD_MEMBER', description: "add member to workspace or board"},
          { permissionName: 'VIEW_MEMBER', description: "view member in workspace or board"},
          { permissionName: 'CHANGE_MEMBER_PERMISSION', description: 'change user permission'},
          { permissionName: 'REMOVE_MEMBER', description: 'remove member over workspace or board'},

          //join-link
          { permissionName: 'MANAGE_JOIN_LINK', description: 'manage join link'},
        ],
        skipDuplicates: true,
      });

      const [admin, OwnerWorkspace, OwnerBoard, MemberWorkspace, MemberBoard] = await Promise.all([
        prisma.role.upsert({
          where: {roleName: 'Admin'},
          update: {},
          create: {roleName: 'Admin', description: 'users have all permissions of system'}
        }),
        prisma.role.upsert({
          where: {roleName: 'OwnerWorkspace'},
          update: {},
          create: {roleName: 'OwnerWorkspace', description: 'users have certain permissions of workspace'}
        }),
        prisma.role.upsert({
          where: {roleName: 'OwnerBoard'},
          update: {},
          create: {roleName: 'OwnerBoard', description: 'users have certain permissions of board'}
        }),
        prisma.role.upsert({
          where: {roleName: 'MemberWorkspace'},
          update: {},
          create: { roleName: 'MemberWorkspace', description: 'users have permissions of card, list'}
        }),
        prisma.role.upsert({
          where: {roleName: 'MemberBoard'},
          update: {},
          create: { roleName: 'MemberBoard', description: 'users have permissions of card, list'}
        })
      ])

      const allPermissions = await prisma.permission.findMany();

      const adminPermissions = allPermissions.filter( p => 
      ['VIEW_WORKSPACE', 'UPDATE_WORKSPACE', 'DELETE_WORKSPACE', 'CREATE_BOARD','VIEW_BOARD' ,'UPDATE_BOARD', 'DELETE_BOARD',
        'CREATE_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'CREATE_LIST','CREATE_LIST',
        'ADD_MEMBER', 'VIEW_MEMBER', 'CHANGE_MEMBER_PERMISSION',  'REMOVE_MEMBER', 'MANAGE_JOIN_LINK'
      ].includes(p.permissionName));

      const ownerWorkspacePermissions = allPermissions.filter( p => 
      [ 'VIEW_WORKSPACE', 'UPDATE_WORKSPACE', 'DELETE_WORKSPACE', 'CREATE_BOARD','VIEW_BOARD' ,'UPDATE_BOARD', 'DELETE_BOARD',
        'CREATE_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'CREATE_LIST','CREATE_LIST',
        'ADD_MEMBER', 'VIEW_MEMBER', 'CHANGE_MEMBER_PERMISSION',  'REMOVE_MEMBER', 'MANAGE_JOIN_LINK'
      ].includes(p.permissionName));

      const ownerBoardPermissions = allPermissions.filter( p => 
      [ 'VIEW_BOARD' ,'UPDATE_BOARD', 'DELETE_BOARD',
        'CREATE_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'CREATE_LIST','CREATE_LIST',
        'ADD_MEMBER', 'VIEW_MEMBER', 'CHANGE_MEMBER_PERMISSION',  'REMOVE_MEMBER', 'MANAGE_JOIN_LINK'
      ].includes(p.permissionName));

      const memberWorkspacePermissions = allPermissions.filter( p => 
      [ 'VIEW_WORKSPACE', 'CREATE_BOARD', 'VIEW_BOARD' ,'UPDATE_BOARD', 'DELETE_BOARD',
        'CREATE_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'CREATE_LIST','CREATE_LIST',
        'ADD_MEMBER', 'VIEW_MEMBER', 'MANAGE_JOIN_LINK'
      ].includes(p.permissionName));

      const memberBoardPermissions = allPermissions.filter( p => 
      [ 'VIEW_BOARD' ,'UPDATE_BOARD',
        'CREATE_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'CREATE_LIST','CREATE_LIST',
        'ADD_MEMBER', 'VIEW_MEMBER', 'MANAGE_JOIN_LINK'
      ].includes(p.permissionName));

      for( const p of adminPermissions){
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: {roleId: admin.id, permissionId: p.id}},
          update: {},
          create: { roleId: admin.id, permissionId: p.id}
        })
      }

      for( const p of ownerWorkspacePermissions){
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: {roleId: OwnerWorkspace.id, permissionId: p.id}},
          update: {},
          create: { roleId: OwnerWorkspace.id, permissionId: p.id}
        })
      }

      for( const p of ownerBoardPermissions){
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: {roleId: OwnerBoard.id, permissionId: p.id}},
          update: {},
          create: { roleId: OwnerBoard.id, permissionId: p.id}
        })
      }

      for( const p of memberWorkspacePermissions){
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: {roleId: MemberWorkspace.id, permissionId: p.id}},
          update: {},
          create: { roleId: MemberWorkspace.id, permissionId: p.id}
        })
      }

      for( const p of memberBoardPermissions){
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: {roleId: MemberBoard.id, permissionId: p.id}},
          update: {},
          create: { roleId: MemberBoard.id, permissionId: p.id}
        })
      }

      console.log('RBAC seed completed successfully!');
    }

    main()
    .catch( err => console.error(err))
    .finally( async () => await prisma.$disconnect());

