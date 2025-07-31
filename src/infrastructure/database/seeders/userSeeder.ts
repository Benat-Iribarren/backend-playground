import db from '../dbClient';

export async function seedUser() {
  const users = [
    {
      nin: '12345678A',
      phone: '666666666',
      isBlocked: false,
    },
    {
      nin: '12345678B',
      phone: '111111111',
      isBlocked: false,
    },
    {
      nin: '87654321A',
      phone: '666666667',
      isBlocked: true,
    },
  ];

  for (const user of users) {
    const exists = await db
      .selectFrom('user')
      .select('nin')
      .where('nin', '=', user.nin)
      .executeTakeFirst();
      
      if (!exists) {
        await db
          .insertInto('user')
          .values({
            nin: user.nin,
            phone: user.phone,
            isBlocked: (user.isBlocked ? 1 : 0) as unknown as boolean,
          })
          .execute();
  
        console.log(`Usuario ${user.nin} insertado.`);
      }
  }
}
