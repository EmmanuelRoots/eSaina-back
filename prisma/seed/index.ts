import {prisma} from '../../src/repository'
import { roleSeed } from './role.seed';
import { salonSeed } from './salon.seed';
import { userSeed } from './user.seed';
import { projectSeed } from './project.seed';

const main = async ()=>{
  await roleSeed()
  await salonSeed()
  await userSeed()
  await projectSeed()
}

main()
  .catch((e) => {
    console.error('❌ Erreur dans le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });