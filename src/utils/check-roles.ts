export function checkRoles(
    roles: number[],
    roleStrings: string | any[]
): boolean {
    if (!Array.isArray(roleStrings)) {
        roleStrings = [roleStrings];
    }

    const roleMap: any = {
        coach: 20684,
    };

    let result = true;
    for (const roleString of roleStrings) {
        // console.log(user.roles);
        // console.log(roleMap[roleString])
        result = result && roles.includes(roleMap[roleString]);
    }
    return result;
}