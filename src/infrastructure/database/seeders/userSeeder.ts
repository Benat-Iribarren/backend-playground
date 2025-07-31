import db from '../dbClient';

export async function seedUser() {
  const users = [
    {
      id: 1,
      nin: '12345678A',
      phone: '666666666',
      isBlocked: false,
    },
    {
      id: 2,
      nin: '12345678B',
      phone: '111111111',
      isBlocked: false,
    },
    {
      id: 3,
      nin: '87654321A',
      phone: '666666667',
      isBlocked: true,
    },
  ];

  for (const user of users) {
    const exists = await db
      .selectFrom('user')
      .select('id')
      .where('id', '=', user.id)
      .executeTakeFirst();

    if (!exists) {
      await db
        .insertInto('user')
        .values({
          ...user,
          isBlocked: (user.isBlocked ? 1 : 0) as unknown as boolean,
        })
        .execute();

      console.log(`Usuario ${user.nin} insertado.`);
    }
  }
}
