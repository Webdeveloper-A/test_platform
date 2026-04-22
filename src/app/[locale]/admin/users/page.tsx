import { prisma } from "@/lib/prisma";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { requireRole } from "@/lib/auth";

export default async function AdminUsersPage() {
  requireRole("ADMIN");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="grid grid-2">
      <CreateUserForm />
      <div className="card">
        <h2>Foydalanuvchilar</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>F.I.Sh.</th>
                <th>Login</th>
                <th>Rol</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td><UserRowActions userId={user.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
