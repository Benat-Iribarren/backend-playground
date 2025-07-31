import db from "../dbClient";

export async function seedUser() {
    const users = [
        {
            id: 1,
            nin: "12345678A",
            phone: "666666666",
            blocked: false
        },
        {
            id: 2,
            nin: "12345678B",
            phone: "111111111",
            blocked: false
        },
        {
            id: 3,
            nin: "87654321A",
            phone: "666666667",
            blocked: true
        }
    ];

    for(const user of users ){
        const exists = await db
            .selectFrom("user")
            .select("id")
            .where("id", "=", user.id)
            .executeTakeFirst();

        if (!exists) {
        await db
            .insertInto("user")
            .values(user)
            .execute();
        console.log(`Usuario ${user.nin} insertado.`);
        }
    }
}