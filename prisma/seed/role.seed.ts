import {prisma} from '../../src/repository'
import {TABLE_NAME} from '../../src/data/constants/seed.constants'


export const roleSeed = async () => {
  const roles = [
    {
      name: 'SUPER_ADMIN',
      authorizations: TABLE_NAME.map(table => ({
        tableName: table,
        create: true,
        read: true,
        update: true,
        delete: true,
        visibleFields: []
      }))
    },
    {
      name: 'ADMIN',
      authorizations: TABLE_NAME.map(table => ({
        tableName: table,
        create: true,
        read: true,
        update: true,
        delete: true,
        visibleFields: []
      }))
    },
    {
      name: 'PO',
      authorizations: TABLE_NAME.map(table => ({
        tableName: table,
        create: true,
        read: true,
        update: true,
        delete: true,
        visibleFields: []
      }))
    },
    {
      name: 'DEVELOPER',
      authorizations: TABLE_NAME.map(table => ({
        tableName: table,
        create: true,
        read: true,
        update: true,
        delete: true,
        visibleFields: []
      }))
    },
    {
      name: 'USER',
      authorizations: TABLE_NAME.map(table => ({
        tableName: table,
        create: false,
        read: true,
        update: false,
        delete: false,
        visibleFields: []
      }))
    }
  ];

  for (const role of roles) {
    const existing = await prisma.role.findFirst({
      where: { name: role.name }
    });

    if (!existing) {
      await prisma.role.create({
        data: role
      });
      console.log(`✅ Role "${role.name}" créé.`);
    } else {
      console.log(`ℹ️ Role "${role.name}" existe déjà.`);
    }
  }
}

