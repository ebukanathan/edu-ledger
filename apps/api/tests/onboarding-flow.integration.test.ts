// End-to-end coverage of the platform-admin-onboards-school flow and the
// tenant-isolation guarantee it exists to protect: a school's users must
// never be visible to, or manageable by, another school.
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createApp } from '../src/app';
import { prisma } from '../src/database';
import { Role } from '../src/generated/prisma/client';

const app = createApp();
const RUN_ID = Date.now();
const userIdsToCleanUp: string[] = [];
const schoolIdsToCleanUp: string[] = [];

async function createPlatformAdmin() {
  const email = `platform-admin+${RUN_ID}@eduledger.test`;
  const password = 'super-secret-password';
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: 'Test Platform Admin', email, password: passwordHash, role: Role.PLATFORM_ADMIN, schoolId: null },
  });
  userIdsToCleanUp.push(user.id);
  return { email, password };
}

async function login(email: string, password: string) {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  expect(res.status).toBe(200);
  return res.body as { token: string; user: { role: string; schoolId: string | null } };
}

afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: { in: userIdsToCleanUp } } });
  await prisma.school.deleteMany({ where: { id: { in: schoolIdsToCleanUp } } });
  await prisma.$disconnect();
});

describe('platform onboarding -> school admin -> tenant isolation', () => {
  it('walks the full flow end to end', async () => {
    const platformAdmin = await createPlatformAdmin();
    const { token: platformToken } = await login(platformAdmin.email, platformAdmin.password);

    // Unauthenticated onboarding is rejected.
    const unauthed = await request(app)
      .post('/api/platform/schools')
      .send({ school: { name: 'x', email: 'x@x.com' }, admin: { name: 'x', email: 'y@x.com' } });
    expect(unauthed.status).toBe(401);

    // Onboard School A and School B.
    const onboardSchool = (label: string) =>
      request(app)
        .post('/api/platform/schools')
        .set('Authorization', `Bearer ${platformToken}`)
        .send({
          school: { name: `${label} School ${RUN_ID}`, email: `${label.toLowerCase()}+${RUN_ID}@school.test` },
          admin: { name: `${label} Admin`, email: `${label.toLowerCase()}-admin+${RUN_ID}@school.test` },
        });

    const schoolARes = await onboardSchool('A');
    expect(schoolARes.status).toBe(201);
    schoolIdsToCleanUp.push(schoolARes.body.school.id);
    userIdsToCleanUp.push(schoolARes.body.admin.id);

    const schoolBRes = await onboardSchool('B');
    expect(schoolBRes.status).toBe(201);
    schoolIdsToCleanUp.push(schoolBRes.body.school.id);
    userIdsToCleanUp.push(schoolBRes.body.admin.id);

    // Log in as School A's admin using the returned temp password.
    const { token: adminAToken, user: adminAUser } = await login(
      schoolARes.body.admin.email,
      schoolARes.body.temporaryPassword,
    );
    expect(adminAUser.role).toBe('school_admin');
    expect(adminAUser.schoolId).toBe(schoolARes.body.school.id);

    // A School Admin cannot onboard schools.
    const forbiddenOnboard = await request(app)
      .post('/api/platform/schools')
      .set('Authorization', `Bearer ${adminAToken}`)
      .send({ school: { name: 'x', email: `blocked+${RUN_ID}@x.com` }, admin: { name: 'x', email: `blocked2+${RUN_ID}@x.com` } });
    expect(forbiddenOnboard.status).toBe(403);

    // School Admin A creates a Finance Officer for their own school.
    const createUserRes = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAToken}`)
      .send({ name: 'Finance A', email: `finance-a+${RUN_ID}@school.test`, role: 'FINANCE_OFFICER' });
    expect(createUserRes.status).toBe(201);
    userIdsToCleanUp.push(createUserRes.body.user.id);

    // School A's user list contains that finance officer.
    const listA = await request(app).get('/api/users').set('Authorization', `Bearer ${adminAToken}`);
    expect(listA.status).toBe(200);
    expect(listA.body.map((u: { email: string }) => u.email)).toContain(createUserRes.body.user.email);

    // Tenant isolation: School B's admin must not see School A's users.
    const { token: adminBToken } = await login(schoolBRes.body.admin.email, schoolBRes.body.temporaryPassword);
    const listB = await request(app).get('/api/users').set('Authorization', `Bearer ${adminBToken}`);
    expect(listB.status).toBe(200);
    expect(listB.body.map((u: { email: string }) => u.email)).not.toContain(createUserRes.body.user.email);

    // A Finance Officer cannot manage users or onboard schools.
    const { token: financeToken } = await login(createUserRes.body.user.email, createUserRes.body.temporaryPassword);

    const financeCreateUser = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${financeToken}`)
      .send({ name: 'Nope', email: `nope+${RUN_ID}@school.test`, role: 'TEACHER' });
    expect(financeCreateUser.status).toBe(403);

    const financeOnboard = await request(app)
      .post('/api/platform/schools')
      .set('Authorization', `Bearer ${financeToken}`)
      .send({ school: { name: 'x', email: `x2+${RUN_ID}@x.com` }, admin: { name: 'x', email: `x3+${RUN_ID}@x.com` } });
    expect(financeOnboard.status).toBe(403);

    // /auth/me reflects the correct role + schoolId for each principal.
    const meResPlatform = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${platformToken}`);
    expect(meResPlatform.body.role).toBe('platform_admin');
    expect(meResPlatform.body.schoolId).toBeNull();

    const meResAdminA = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${adminAToken}`);
    expect(meResAdminA.body.schoolId).toBe(schoolARes.body.school.id);
  });
});
