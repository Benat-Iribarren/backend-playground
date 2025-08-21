import db from '../dbClient';

export async function seedUser() {
  const users = getUsers();

  for (const { nin, phones, isBlocked } of users) {
    const userExists = await selectUser(nin);

    if (!userExists) {
      await insertUserAndPhones(nin, phones, isBlocked);
    }
  }
}

function getUsers() {
  return [
    {
      nin: '87654321Z',
      phones: ['222222222', '888888888'],
      isBlocked: false,
    },
    {
      nin: '12345678A',
      phones: ['666666666', '777777777'],
      isBlocked: false,
    },
    {
      nin: '12345678B',
      phones: ['111111111', '111111121'],
      isBlocked: false,
    },
    {
      nin: '87654321A',
      phones: ['666666667'],
      isBlocked: true,
    },
  ];
}

async function selectUser(nin: string) {
  return await db.selectFrom('user').select('nin').where('nin', '=', nin).executeTakeFirst();
}

async function insertUserAndPhones(nin: string, phones: string[], isBlocked: boolean) {
  const inserted = await db
    .insertInto('user')
    .values({
      nin,
      isBlocked: (isBlocked ? 1 : 0) as unknown as boolean,
    })
    .returning(['id'])
    .executeTakeFirst();

  if (inserted?.id) {
    const phoneInserts = phones.map((phoneNumber) => ({
      userId: inserted.id,
      phoneNumber,
    }));

    await db.insertInto('phone').values(phoneInserts).execute();
  }
}
