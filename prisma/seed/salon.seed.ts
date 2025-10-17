import {prisma} from '../../src/repository'

export const salonSeed = async ()=>{
  const existing = await prisma.salon.findFirst({
    where : {
      title : 'Annonce officielle'
    }
  })

  if (!existing) {
    await prisma.salon.create({
      data: {
        title: 'Annonce officielle',
        description: 'Salon par défaut',
        // ajoute d'autres champs selon ton modèle
      },
    });
    console.log('✅ Salon "Annonce officielle" créé.');
  } else {
    console.log('ℹ️ Salon "Annonce officielle" existe déjà.');
  }
}

