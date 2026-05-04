"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag } from "lucide-react";

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
    const res = await fetch("/api/admin/roles");
    const data = await res.json();
    if (Array.isArray(data)) setRoles(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (Array.isArray(data)) {
      setCategories(data);
      if (data.length > 0 && !categoryId) setCategoryId(data[0]._id);
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
          {categories.map((cat) => (
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
                {categories.map((cat) => (
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
                            ? role.categoryId.name 
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
