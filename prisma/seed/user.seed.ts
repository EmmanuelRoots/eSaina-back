import {prisma} from '../../src/repository'

export const userSeed = async ()=>{
  const existing = await prisma.user.findFirst({
    where : {
      role : {
        name : 'SUPER_ADMIN'
      }
    }
  })

  const superAdminRole = await prisma.role.findFirst({
    where : {
      name : 'SUPER_ADMIN'
    }
  })

  const salonOfficiel = await prisma.salon.findFirst({
    where : {
      title : 'Annonce officielle'
    }
  })

  if (!existing) {
    await prisma.user.create({
      data: {
        email : "em.razanakoto@gmail.com",
        firstName : "Razanakoto",
        lastName : "Emmanuel",
        password : '',
        active : true,
        phoneNumber : '',
        birthDate: new Date(),
        pdpUrl: "https://lh3.googleusercontent.com/a/ACg8ocKM6Mn7P3AwgZGMFcBPOpdcW1Po-Jj4h0kHg0CCaIUozb6p3f0=s96-c",
        roleId : superAdminRole?.id!,
        createdAt: new Date(),
        ownedConversations : {
          create : {
            title : 'Assistant IA',
            type : 'AI_CHAT',
            messages : {
              create : {
                content : 'Bonjour, comment puis-je vous aidez aujourd\'hui?',
                sender : 'AI',
                type : 'TEXT',
              }
            },
          }
        },
        salonMembers: {
          create : {
            role : 'ADMIN',
            salonId: salonOfficiel?.id!
          }
        }
      }

    });
    console.log('✅ User "admin" créé.');
  } else {
    console.log('ℹ️ User "admin" existe déjà.');
  }
}

