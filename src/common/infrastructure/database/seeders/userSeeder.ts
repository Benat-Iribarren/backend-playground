import db from '../dbClient';

export async function seedUser() {
  const users = getUsers();

  for (const { nin, phones, isBlocked, fullName, email } of users) {
    const userExists = await selectUser(nin);

    if (!userExists) {
      await insertUserAndPhones(nin, phones, isBlocked, fullName, email);
    }
  }
}

function getUsers(): Array<{
  nin: string;
  phones: { [key: string]: { isPrimary: boolean } };
  isBlocked: boolean;
  fullName: string;
  email: string;
}> {
  return [
    {
      nin: '87654321Z',
      phones: { '222222222': { isPrimary: true }, '888888888': { isPrimary: false } },
      isBlocked: false,
      fullName: 'Usuario Uno',
      email: 'usuario1@example.com',
    },
    {
      nin: '12345678A',
      phones: { '666666666': { isPrimary: true }, '777777777': { isPrimary: false } },
      isBlocked: false,
      fullName: 'Usuario Dos',
      email: 'usuario2@example.com',
    },
    {
      nin: '12345678B',
      phones: { '111111111': { isPrimary: true }, '111111121': { isPrimary: false } },
      isBlocked: false,
      fullName: 'Usuario Tres',
      email: 'usuario3@example.com',
    },
    {
      nin: '87654321A',
      phones: { '666666667': { isPrimary: true } },
      isBlocked: true,
      fullName: 'Usuario Bloqueado',
      email: 'bloqueado@example.com',
    },
  ];
}

async function selectUser(nin: string) {
  return await db.selectFrom('user').select('nin').where('nin', '=', nin).executeTakeFirst();
}

async function insertUserAndPhones(
  nin: string,
  phones: { [key: string]: { isPrimary: boolean } },
  isBlocked: boolean,
  fullName: string,
  email: string,
) {
  const inserted = await db
    .insertInto('user')
    .values({
      nin,
      isBlocked: (isBlocked ? 1 : 0) as unknown as boolean,
      fullName,
      email,
    })
    .returning(['id'])
    .executeTakeFirst();

  if (inserted?.id) {
    const phoneInserts = Object.entries(phones).map(([phoneNumber, { isPrimary }]) => ({
      userId: inserted.id,
      phoneNumber,
      isPrimary: isPrimary ? 1 : 0,
    }));

    await db.insertInto('phone').values(phoneInserts).execute();
  }
}
