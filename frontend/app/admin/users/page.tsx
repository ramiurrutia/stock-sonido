"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BackButton from "@/app/components/navbar/backButton";
import PermissionsRefresher from "@/app/components/PermissionRefresher";


interface User {
  id: number;
  email: string;
  active: boolean;
  username: string;
  created_at: string;
  roles: string[];
}

export default function UserManagementPage() {


  const { data: session, status } = useSession(); // Obtenemos la sesión
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUsers(data);
          } else {
            console.error("Error en la respuesta del servidor");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!session?.user?.accessToken) return;

    setUpdatingId(userId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers(users.map(u =>
          u.id === userId ? { ...u, roles: [newRole] } : u
        ));
      } else {
        alert("Error al actualizar el rol");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (status === "loading" || (loading && status === "authenticated")) {
    return (
      <div className="flex justify-center items-center min-h-screen text-zinc-500 bg-black">
        <div role="status">
          <svg className="mx-auto size-8 animate-spin text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>

            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && !session?.user?.permissions?.includes('admin.access')) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-zinc-200">
        <h1 className="text-xl font-bold text-red-500">Acceso Denegado</h1>
        <p className="text-zinc-500">Tu usuario no tiene el permiso <span className="text-red-400">admin.access</span></p>
        <p className="text-xs mt-4 bg-zinc-900 p-2 rounded">Permisos actuales: {session.user.permissions?.join(', ')}</p>
        <BackButton />
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'text-sky-300 border-sky-300/30 bg-sky-400/10';
      case 'operator': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      default: return 'text-zinc-400 border-zinc-700 bg-zinc-800/50';
    }
  };

  if (loading) return <div role="status">
    <svg className="mx-auto size-8 animate-spin text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>

      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>;

  return (
    <div className="min-h-screen min-w-screen text-zinc-200 p-4">
      <BackButton />
      <div className="max-w-5xl mx-auto flex flex-col justify-center items-center mt-12">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Gestión de Usuarios</h1>

        <div className="overflow-x-auto rounded-lg ring-1 ring-zinc-800 bg-zinc-900/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="p-3 text-center text-xs font-medium uppercase text-zinc-500">Usuario</th>
                <th className="border-x border-zinc-800 p-3 text-center text-xs font-medium uppercase text-zinc-500">Rol</th>
                <th className="p-3 text-center text-xs font-medium uppercase text-zinc-500">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="p-3 flex flex-col">
                    <span className="">{user.username}</span>
                    <span className="text-xs text-zinc-400">{user.email}</span>
                  </td>
                  <td className="p-3 border-x border-zinc-800 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase ${getRoleColor(user.roles[0])}`}>
                      {user.roles[0] || 'SIN ROL'}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      disabled={updatingId === user.id}
                      value={user.roles[0] || ""}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-xs rounded px-2 py-1 outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 cursor-pointer"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="operator">Operator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}