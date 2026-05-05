"use client";

import { useState, useEffect } from "react";
<<<<<<< Updated upstream
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
=======
import { 
  Plus, 
  Trash2, 
  Tag, 
  Shield, 
  Palette, 
  LayoutGrid, 
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Layers
} from "lucide-react";
>>>>>>> Stashed changes

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
      const res = await fetch("/api/admin/roles", { cache: "no-store" });
<<<<<<< Updated upstream
      
      // التحقق من نوع المحتوى قبل المحاولة
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Check server logs.");
      }

      const data = await res.json();

      if (!res.ok) {
        // إذا كان هناك خطأ ولكن أرسل مصفوفة أدوار احتياطية (كما فعلنا في الـ API)
        if (data.roles && Array.isArray(data.roles)) {
          setRoles([]);
        }
        throw new Error(data.error || "Failed to fetch roles");
      }

      if (Array.isArray(data)) {
        // تصفية العناصر الفارغة وفحص سلامة كل دور بشكل صارم
        const validatedRoles = data
          .filter((r: any) => r !== null && typeof r === 'object')
          .map((role: any) => {
            // ضمان وجود كائن للتصنيف دائماً
            let cat = role.categoryId;
            
            // فحص شامل للتصنيف
            if (!cat || typeof cat !== 'object' || cat === null) {
              cat = { name: 'Uncategorized', _id: typeof cat === 'string' ? cat : 'none' };
            } else if (!cat.name) {
              cat.name = 'Uncategorized';
            }
            
            return {
              ...role,
              name: role.name || 'Unnamed Role',
              categoryId: cat
            };
          });
        setRoles(validatedRoles);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]); // إفراغ المصفوفة في حال الخطأ لمنع الانهيار في الـ render
=======
      const data = await res.json();
      if (Array.isArray(data)) {
        const validatedRoles = data.map((role: any) => {
          let cat = role.categoryId;
          if (!cat || typeof cat !== 'object') {
            cat = { name: 'Uncategorized', _id: 'none' };
          }
          return { ...role, categoryId: cat };
        });
        setRoles(validatedRoles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
>>>>>>> Stashed changes
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
<<<<<<< Updated upstream
        // التأكد من أن كل تصنيف هو كائن صالح
        const validCats = data
          .filter(c => c !== null && typeof c === 'object' && c._id)
          .map(c => ({
            ...c,
            name: c.name || 'Unnamed Category'
          }));
=======
        const validCats = data.filter(c => c && c._id);
>>>>>>> Stashed changes
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
    if (!categoryName.trim()) return;
    setCatLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName.trim() }),
      });
      if (res.ok) {
        setCategoryName("");
        await fetchCategories();
      } else {
        const err = await res.json();
<<<<<<< Updated upstream
        console.error("[UI] Category Add Error:", err);
        alert(`Error: ${err.error || "Unknown error"}\nDetails: ${err.details || "None"}`);
=======
        alert(err.error || "Failed to add category");
>>>>>>> Stashed changes
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setCatLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!id || !confirm("Are you sure? This will fail if roles are assigned to this category.")) return;
    try {
<<<<<<< Updated upstream
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error);
      }
=======
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchCategories();
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const addRole = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< Updated upstream
    if (!categoryId) {
      alert("Please select a category first!");
      return;
    }
=======
    if (!categoryId) return alert("Select a category!");
>>>>>>> Stashed changes
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, categoryId, color, discordRoleId }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setName("");
        setDiscordRoleId("");
<<<<<<< Updated upstream
        // تحديث القائمة فوراً
        await fetchRoles();
      } else {
        alert(result.error || "Failed to add role");
=======
        await fetchRoles();
>>>>>>> Stashed changes
      }
    } catch (error) {
      console.error("Error adding role:", error);
      alert("An unexpected error occurred while adding the role.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    if (!id || !confirm("Are you sure?")) return;
    try {
<<<<<<< Updated upstream
      const res = await fetch(`/api/admin/roles?id=${id}`, {
        method: "DELETE",
      });
=======
      const res = await fetch(`/api/admin/roles?id=${id}`, { method: "DELETE" });
>>>>>>> Stashed changes
      if (res.ok) await fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151a2b]/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
            <Layers className="h-6 w-6 text-[#5865F2]" />
            Identity Architecture
          </h2>
<<<<<<< Updated upstream
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
              key={cat?._id || Math.random().toString()}
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-[#151a2b] px-4 py-2 text-sm text-white transition hover:border-white/20"
            >
              <span>{cat?.name || 'Unknown Category'}</span>
              <button
                onClick={() => cat?._id && deleteCategory(cat._id)}
                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-slate-500 italic">No categories created yet.</p>
          )}
=======
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest opacity-70">
            Define and organize customizable roles for the ecosystem.
          </p>
>>>>>>> Stashed changes
        </div>
        <div className="flex items-center gap-4">
           <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#5865F2]/50 hidden lg:block" />
           <span className="text-[10px] font-black text-[#5865F2] uppercase tracking-[0.3em]">System v2.0 Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Management Forms */}
        <div className="lg:col-span-5 space-y-8">
          {/* Category Creation Card */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0e14] p-8 shadow-2xl transition-all hover:border-[#5865F2]/30">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Tag className="h-20 w-20 text-[#5865F2]" />
            </div>
            
            <form onSubmit={addCategory} className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-xl bg-[#5865F2]/10 flex items-center justify-center border border-[#5865F2]/20">
                  <LayoutGrid className="h-4 w-4 text-[#5865F2]" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Create Category</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Classification Name</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5865F2] focus:bg-white/[0.05] transition-all"
                    placeholder="e.g. Philosophical Sects"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={catLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#5865F2] py-3 text-xs font-black text-white uppercase tracking-widest hover:bg-[#4752c4] transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#5865F2]/20"
                >
                  {catLoading ? "Processing..." : <><Plus className="h-4 w-4" /> Add Classification</>}
                </button>
              </div>
            </form>
          </div>

          {/* Role Creation Card */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0e14] p-8 shadow-2xl transition-all hover:border-[#D4AF37]/30">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shield className="h-20 w-20 text-[#D4AF37]" />
            </div>
<<<<<<< Updated upstream
            <div>
              <label className="block text-xs text-slate-400 uppercase mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2] transition"
                required
              >
                <option value="" disabled>Select Category</option>
                {(categories || []).filter((cat: any) => cat && typeof cat === 'object').map((cat: any) => (
            <option key={cat?._id || Math.random()} value={cat?._id}>{cat?.name || 'Unknown'}</option>
          ))}
              </select>
=======

            <form onSubmit={addRole} className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <Palette className="h-4 w-4 text-[#D4AF37]" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Forge New Role</h3>
              </div>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Role Designation</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:bg-white/[0.05] transition-all"
                    placeholder="e.g. Grand Master"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Discord Role ID</label>
                  <input
                    type="text"
                    value={discordRoleId}
                    onChange={(e) => setDiscordRoleId(e.target.value)}
                    className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 text-xs font-mono text-blue-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white/[0.05] transition-all"
                    placeholder="123456789..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full rounded-2xl bg-[#1a1c23] border border-white/10 px-3 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select...</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Aura Color</label>
                    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-1.5 h-[46px]">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer overflow-hidden"
                      />
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{color}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || categories.length === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] py-3 text-xs font-black text-white uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#D4AF37]/20 mt-2"
                >
                  {loading ? "Forging..." : <><Plus className="h-4 w-4" /> Forge Identity</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: List and Management */}
        <div className="lg:col-span-7 space-y-8">
          {/* Categories Quick View */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Active Classifications</h3>
              <span className="text-[10px] font-bold text-[#5865F2] bg-[#5865F2]/10 px-2 py-0.5 rounded-full">{categories.length} Total</span>
>>>>>>> Stashed changes
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0e14] pl-4 pr-2 py-2 text-xs font-bold text-white transition-all hover:border-[#5865F2]/40 hover:bg-[#151a2b]"
                >
                  <Tag className="h-3 w-3 text-[#5865F2]" />
                  <span>{cat.name}</span>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="w-full p-8 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center space-y-2">
                  <AlertCircle className="h-6 w-6 text-slate-700" />
                  <p className="text-[10px] font-black text-slate-600 uppercase italic">No active sectors found</p>
                </div>
              )}
            </div>
          </div>

          {/* Roles Table Card */}
          <div className="rounded-[2.5rem] border border-white/5 bg-[#0d0e14] shadow-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Identity Registry</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sort: By Category</div>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Designation</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Registry ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ops</th>
                  </tr>
<<<<<<< Updated upstream
                ) : (
                  roles.map((role: any) => (
                    <tr key={role?._id || Math.random().toString()} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: role?.color || '#5865F2' }} />
                          <span className="font-medium text-white">{role?.name || 'Unknown Role'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-white/5 px-2 py-1 text-xs">
                          {role?.categoryId && typeof role.categoryId === 'object' 
                            ? (role.categoryId.name || 'Uncategorized') 
                            : 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-[#9aa7ff] bg-white/5 px-2 py-1 rounded">{role?.discordRoleId || 'N/A'}</code>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => role?._id && deleteRole(role._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition active:scale-90"
                          title="Delete Role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
=======
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {roles.map((role) => (
                    <tr key={role._id} className="group hover:bg-white/[0.02] transition-all">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-3.5 w-3.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-white/20" 
                            style={{ backgroundColor: role.color, boxShadow: `0 0 15px ${role.color}33` }} 
                          />
                          <span className="text-sm font-bold text-white tracking-tight">{role.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 px-2.5 py-1 text-[9px] font-black text-blue-400 uppercase">
                          {typeof role.categoryId === 'object' ? role.categoryId.name : 'Sector Link Lost'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <code className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
                          {role.discordRoleId}
                        </code>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => deleteRole(role._id)}
                            className="p-2.5 rounded-xl bg-red-500/5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
>>>>>>> Stashed changes
                      </td>
                    </tr>
                  ))}
                  {roles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                          <Shield className="h-12 w-12 text-slate-600" />
                          <p className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] italic">Archive is currently empty</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="h-1 w-1 rounded-full bg-slate-700" />
                 <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">End of Registry</span>
               </div>
               <CheckCircle2 className="h-3 w-3 text-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
