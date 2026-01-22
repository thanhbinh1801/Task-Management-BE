import { prisma } from "../configs/prisma";

async function main() {
  await prisma.permission.createMany({
    data: [
      // workspace
      { permissionName: "CREATE_WORKSPACE", description: "create workspace" },
      { permissionName: "VIEW_WORKSPACE", description: "view workspace" },
      {
        permissionName: "UPDATE_WORKSPACE",
        description: "change visibility of workspace",
      },
      { permissionName: "DELETE_WORKSPACE", description: "delete workspace" },
      // board
      { permissionName: "CREATE_BOARD", description: "create board" },
      { permissionName: "VIEW_BOARD", description: "view board" },
      {
        permissionName: "UPDATE_BOARD",
        description: "update information of board",
      },
      { permissionName: "DELETE_BOARD", description: "delete board" },
      // card
      { permissionName: "CREATE_CARD", description: "create card" },
      { permissionName: "VIEW_CARD", description: "view card" },
      {
        permissionName: "UPDATE_CARD",
        description: "update information of card",
      },
      { permissionName: "DELETE_CARD", description: "delete card" },
      // list
      { permissionName: "CREATE_LIST", description: "create list" },
      { permissionName: "VIEW_LIST", description: "view list" },
      {
        permissionName: "UPDATE_LIST",
        description: "update information of list",
      },
      { permissionName: "DELETE_LIST", description: "delete list" },
      // member
      {
        permissionName: "ADD_MEMBER",
        description: "add member to workspace or board",
      },
      {
        permissionName: "VIEW_MEMBER",
        description: "view member in workspace or board",
      },
      {
        permissionName: "CHANGE_MEMBER_PERMISSION",
        description: "change user permission",
      },
      {
        permissionName: "REMOVE_MEMBER",
        description: "remove member over workspace or board",
      },

      //join-link
      { permissionName: "MANAGE_JOIN_LINK", description: "manage join link" },
    ],
    skipDuplicates: true,
  });

  const [admin, OwnerWorkspace, OwnerBoard, MemberWorkspace, MemberBoard] =
    await Promise.all([
      prisma.role.upsert({
        where: { roleName: "Admin" },
        update: {},
        create: {
          roleName: "Admin",
          description: "users have all permissions of system",
        },
      }),
      prisma.role.upsert({
        where: { roleName: "OwnerWorkspace" },
        update: {},
        create: {
          roleName: "OwnerWorkspace",
          description: "users have certain permissions of workspace",
        },
      }),
      prisma.role.upsert({
        where: { roleName: "OwnerBoard" },
        update: {},
        create: {
          roleName: "OwnerBoard",
          description: "users have certain permissions of board",
        },
      }),
      prisma.role.upsert({
        where: { roleName: "MemberWorkspace" },
        update: {},
        create: {
          roleName: "MemberWorkspace",
          description: "users have permissions of card, list",
        },
      }),
      prisma.role.upsert({
        where: { roleName: "MemberBoard" },
        update: {},
        create: {
          roleName: "MemberBoard",
          description: "users have permissions of card, list",
        },
      }),
    ]);

  const allPermissions = await prisma.permission.findMany();

  const adminPermissions = allPermissions.filter((p) =>
    [
      "VIEW_WORKSPACE",
      "UPDATE_WORKSPACE",
      "DELETE_WORKSPACE",
      "CREATE_BOARD",
      "VIEW_BOARD",
      "UPDATE_BOARD",
      "DELETE_BOARD",
      "CREATE_CARD",
      "VIEW_CARD",
      "UPDATE_CARD",
      "DELETE_CARD",
      "CREATE_LIST",
      "VIEW_LIST",
      "UPDATE_LIST",
      "ADD_MEMBER",
      "VIEW_MEMBER",
      "CHANGE_MEMBER_PERMISSION",
      "REMOVE_MEMBER",
      "MANAGE_JOIN_LINK",
    ].includes(p.permissionName),
  );

  const ownerWorkspacePermissions = allPermissions.filter((p) =>
    [
      "VIEW_WORKSPACE",
      "UPDATE_WORKSPACE",
      "DELETE_WORKSPACE",
      "CREATE_BOARD",
      "VIEW_BOARD",
      "UPDATE_BOARD",
      "DELETE_BOARD",
      "CREATE_CARD",
      "VIEW_CARD",
      "UPDATE_CARD",
      "DELETE_CARD",
      "CREATE_LIST",
      "VIEW_LIST",
      "UPDATE_LIST",
      "ADD_MEMBER",
      "VIEW_MEMBER",
      "CHANGE_MEMBER_PERMISSION",
      "REMOVE_MEMBER",
      "MANAGE_JOIN_LINK",
    ].includes(p.permissionName),
  );

  const ownerBoardPermissions = allPermissions.filter((p) =>
    [
      "VIEW_BOARD",
      "UPDATE_BOARD",
      "DELETE_BOARD",
      "CREATE_CARD",
      "VIEW_CARD",
      "UPDATE_CARD",
      "DELETE_CARD",
      "CREATE_LIST",
      "VIEW_LIST",
      "UPDATE_LIST",
      "ADD_MEMBER",
      "VIEW_MEMBER",
      "CHANGE_MEMBER_PERMISSION",
      "REMOVE_MEMBER",
      "MANAGE_JOIN_LINK",
    ].includes(p.permissionName),
  );

  const memberWorkspacePermissions = allPermissions.filter((p) =>
    [
      "VIEW_WORKSPACE",
      "CREATE_BOARD",
      "VIEW_BOARD",
      "UPDATE_BOARD",
      "DELETE_BOARD",
      "CREATE_CARD",
      "VIEW_CARD",
      "UPDATE_CARD",
      "DELETE_CARD",
      "CREATE_LIST",
      "VIEW_LIST",
      "UPDATE_LIST",
      "ADD_MEMBER",
      "VIEW_MEMBER",
      "MANAGE_JOIN_LINK",
    ].includes(p.permissionName),
  );

  const memberBoardPermissions = allPermissions.filter((p) =>
    [
      "VIEW_BOARD",
      "UPDATE_BOARD",
      "CREATE_CARD",
      "VIEW_CARD",
      "UPDATE_CARD",
      "DELETE_CARD",
      "CREATE_LIST",
      "VIEW_LIST",
      "UPDATE_LIST",
      "ADD_MEMBER",
      "VIEW_MEMBER",
      "MANAGE_JOIN_LINK",
    ].includes(p.permissionName),
  );

  for (const p of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: admin.id, permissionId: p.id } },
      update: {},
      create: { roleId: admin.id, permissionId: p.id },
    });
  }

  for (const p of ownerWorkspacePermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: OwnerWorkspace.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: OwnerWorkspace.id, permissionId: p.id },
    });
  }

  for (const p of ownerBoardPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: OwnerBoard.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: OwnerBoard.id, permissionId: p.id },
    });
  }

  for (const p of memberWorkspacePermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: MemberWorkspace.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: MemberWorkspace.id, permissionId: p.id },
    });
  }

  for (const p of memberBoardPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: MemberBoard.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: MemberBoard.id, permissionId: p.id },
    });
  }

  console.log("RBAC seed completed successfully!");

  console.log("Starting system templates seed...");

  const educationTemplate = await prisma.board.upsert({
    where: { id: "system-template-education" },
    update: {},
    create: {
      id: "system-template-education",
      name: "Giáo dục",
      workspaceId: null,
      isTemplate: true,
      category: "EDUCATION",
      description: "Template quản lý bài tập, tài liệu học tập",
      List: {
        create: [
          {
            name: "Resources",
            position: 1,
            Card: {
              create: [
                { name: "Getting started with Trello", position: 1 },
                { name: "Ways to contact Dr. Theisen Remotely", position: 2 },
                { name: "Coping with Covid-19", position: 3 },
                { name: "Remote Class Plan and Revised Schedule", position: 4 },
                { name: "Links to eTextbook - Biochemistry", position: 5 },
              ],
            },
          },
          {
            name: "Weekly Assignments",
            position: 2,
            Card: {
              create: [
                { name: "Week of 3/23-3/29", position: 1 },
                { name: "Week of 3/30-4/5", position: 2 },
                { name: "Week of 4/6-12", position: 3 },
                { name: "Week of 4/13-19", position: 4 },
                { name: "Week of 4/20-26", position: 5 },
                { name: "Week of 4/27-5/3", position: 6 },
              ],
            },
          },
          {
            name: "Lab Projects",
            position: 3,
            Card: {
              create: [
                { name: "Poster - Both Tracks", position: 1 },
                { name: "Final Lab Report - Catalase Track", position: 2 },
                { name: "Final Lab Report - Hexokinase Track", position: 3 },
              ],
            },
          },
          {
            name: "Exams",
            position: 4,
            Card: {
              create: [
                { name: "Exam 2: Ch. 5-8", position: 1 },
                { name: "Exam 3: Ch. 10-12, 15-16, and 18-21", position: 2 },
                { name: "Optional Retake (Finals Week)", position: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  const businessTemplate = await prisma.board.upsert({
    where: { id: "system-template-business" },
    update: {},
    create: {
      id: "system-template-business",
      name: "Business - CRM Pipeline",
      workspaceId: null,
      isTemplate: true,
      category: "BUSINESS",
      description: "Quản lý pipeline bán hàng và quan hệ khách hàng",
      List: {
        create: [
          { name: "Leads", position: 1 },
          { name: "Qualified", position: 2 },
          { name: "Proposal Sent", position: 3 },
          { name: "Closed Won", position: 4 },
        ],
      },
    },
  });

  const kanbanTemplate = await prisma.board.upsert({
    where: { id: "system-template-kanban" },
    update: {},
    create: {
      id: "system-template-kanban",
      name: "Kanban - Quản lý dự án",
      workspaceId: null,
      isTemplate: true,
      category: "PROJECT_MANAGEMENT",
      description: "Template Kanban cơ bản cho quản lý công việc",
      List: {
        create: [
          { name: "Backlog", position: 1 },
          { name: "To Do", position: 2 },
          { name: "In Progress", position: 3 },
          { name: "Review", position: 4 },
          { name: "Done", position: 5 },
        ],
      },
    },
  });

  const marketingTemplate = await prisma.board.upsert({
    where: { id: "system-template-marketing" },
    update: {},
    create: {
      id: "system-template-marketing",
      name: "Marketing Campaign",
      workspaceId: null,
      isTemplate: true,
      category: "MARKETING",
      description: "Quản lý chiến dịch marketing",
      List: {
        create: [
          { name: "Ideas", position: 1 },
          { name: "Planning", position: 2 },
          { name: "In Progress", position: 3 },
          { name: "Published", position: 4 },
        ],
      },
    },
  });

  console.log("System templates seeded successfully!");
}
