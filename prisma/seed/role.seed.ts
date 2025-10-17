import {prisma} from '../../src/repository'
import {TABLE_NAME} from '../../src/data/constants/seed.constants'


export const roleSeed = async ()=>{
  const existing = await prisma.role.findFirst({
    where : {
      name : 'SUPER_ADMIN'
    }
  })

  if (!existing) {
    await prisma.role.createMany({
      data: [
        {
          name : 'SUPER_ADMIN',
          authorizations:[
              TABLE_NAME.map(
                table => ({
                  tableName: table,
                  create: true,
                  read: true,
                  update: true,
                  delete: true,
                  visibleFields: []
                })
              )
          ]
        }
      ]
    });
    console.log('✅ Role "SUPER_ADMIN" créé.');
  } else {
    console.log('ℹ️ Role "SUPER_ADMIN" existe déjà.');
  }
}

