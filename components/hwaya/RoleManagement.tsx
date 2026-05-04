"use client";

import { useState, useEffect } from "react";
// Inline SVG icons to avoid missing lucide-react dependency
const Plus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Trash2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const Tag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

interface Category {
  _id: string;
  name: string;
  icon: string;
}

interface Role {
  _id: string;
  name: string;
  categoryId: Category | string;
  color: string;
  discordRoleId: string;
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Role Form
  const [name, setName] = useState("");
  const [discordRoleId, setDiscordRoleId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [color, setColor] = useState("#5865F2");
  
  // Category Form
  const [categoryName, setCategoryName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchCategories();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch roles");
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        // تصفية العناصر الفارغة وفحص سلامة كل دور
        const validatedRoles = data.filter(r => r !== null).map(role => ({
          ...role,
          categoryId: role.categoryId || { name: 'Uncategorized', _id: 'none' }
        }));
        setRoles(validatedRoles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        const validCats = data.filter(c => c !== null && c._id && c.name);
        setCategories(validCats);
        if (validCats.length > 0 && !categoryId) {
          setCategoryId(validCats[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });
      if (res.ok) {
        setCategoryName("");
        fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setCatLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will fail if roles are assigned to this category.")) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const addRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Please create a category first!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, categoryId, color, discordRoleId }),
      });
      if (res.ok) {
        setName("");
        setDiscordRoleId("");
        fetchRoles();
      }
    } catch (error) {
      console.error("Error adding role:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/roles?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div className="space-y-12">
      {/* Category Management */}
      <section className="space-y-6">
        <form onSubmit={addCategory} className="rounded-xl border border-white/10 bg-[#151a2b] p-6">
          <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#5865F2]" />
            Manage Categories
          </h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 uppercase mb-1">New Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                placeholder="e.g. Religions, Gaming, Languages"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={catLoading}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-6 py-2 text-sm font-medium text-white hover:bg-[#4752c4] disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-wrap gap-3">
          {categories.filter(cat => cat !== null).map((cat) => (
            <div
              key={cat._id}
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-[#151a2b] px-4 py-2 text-sm text-white transition hover:border-white/20"
            >
              <span>{cat.name}</span>
              <button
                onClick={() => deleteCategory(cat._id)}
                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-slate-500 italic">No categories created yet.</p>
          )}
        </div>
      </section>

      {/* Role Management */}
      <section className="space-y-6">
        <form onSubmit={addRole} className="rounded-xl border border-white/10 bg-[#151a2b] p-4 md:p-6">
          <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#D4AF37]" />
            Add New Customizable Role
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs text-slate-400 uppercase mb-1">Role Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2] transition"
                placeholder="e.g. Muslim, Gamer"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase mb-1">Discord Role ID</label>
              <input
                type="text"
                value={discordRoleId}
                onChange={(e) => setDiscordRoleId(e.target.value)}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2] transition"
                placeholder="1234567890..."
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2] transition"
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.filter(c => c !== null).map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase mb-1">Display Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-[42px] rounded-lg bg-[#0f1424] border border-white/10 px-1 py-1 cursor-pointer transition"
              />
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                disabled={loading || categories.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#4752c4] disabled:opacity-50 transition active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Add Role
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-xl border border-white/10 bg-[#151a2b] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
              <thead className="bg-[#0f1424] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Role Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Discord Role ID</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No roles added yet.</td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role._id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: role.color }} />
                          <span className="font-medium text-white">{role.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-white/5 px-2 py-1 text-xs">
                          {typeof role.categoryId === 'object' && role.categoryId !== null 
                            ? (role.categoryId.name || 'Uncategorized') 
                            : 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-[#9aa7ff] bg-white/5 px-2 py-1 rounded">{role.discordRoleId}</code>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteRole(role._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition active:scale-90"
                          title="Delete Role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
