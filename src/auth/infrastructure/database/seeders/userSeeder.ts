import db from '../dbClient';

export async function seedUser() {
  const users = getUsers();

  for (const user of users) {
    const userExists = await selectUser(user);

    if (!userExists) {
      await insertUserIntoDb(user);
    }
  }
}

function getUsers() {
  return [
    {
      nin: '87654321Z',
      phone: '222222222',
      isBlocked: false,
    },
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
}

async function selectUser(user: { nin: string; phone: string; isBlocked: boolean }) {
  return await db.selectFrom('user').select('nin').where('nin', '=', user.nin).executeTakeFirst();
}

async function insertUserIntoDb(user: { nin: string; phone: string; isBlocked: boolean }) {
  await db
    .insertInto('user')
    .values({
      nin: user.nin,
      phone: user.phone,
      isBlocked: (user.isBlocked ? 1 : 0) as unknown as boolean,
    })
    .execute();
}
