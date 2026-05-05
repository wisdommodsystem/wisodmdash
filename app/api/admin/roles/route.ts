import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import CustomRole from "@/models/CustomRole";
import "@/models/Category"; // ضمان تسجيل موديل التصنيفات قبل عمل populate

// Get all categories
export async function GET() {
  try {
    await connectToDatabase();
<<<<<<< Updated upstream
    const categories = await Category.find({});
    const safeCategories = (categories || []).map(cat => ({
      ...cat.toObject(),
      name: cat.name || 'Unnamed Category'
    }));
    return NextResponse.json(safeCategories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
=======
    
    // فحص سلامة الموديلات قبل الطلب
    if (!CustomRole) {
      console.error("CustomRole model not found");
      return NextResponse.json({ error: "Model error" }, { status: 500 });
    }

    const roles = await CustomRole.find({}).populate("categoryId").lean();
    
    // التأكد من أن كل دور يحتوي على بيانات أساسية حتى لو فشل الـ populate
    const safeRoles = (roles || []).map(role => ({
      ...role,
      categoryId: role.categoryId || { name: 'Uncategorized', _id: 'none' }
    }));

    return NextResponse.json(safeRoles);
  } catch (error: any) {
    console.error("CRITICAL API ERROR [/api/admin/roles]:", error);
    // إرجاع مصفوفة فارغة مع الخطأ لتجنب انهيار الفرونت إند
    return NextResponse.json({ 
      error: error.message || "Internal Server Error",
      roles: [] 
    }, { status: 500 });
>>>>>>> Stashed changes
  }
}

// Add a new category
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, icon } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newCategory = await Category.create({ name, icon: icon || "Tag" });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    if ((error as any).code === 11000) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

// Delete a category
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Check if any roles are using this category
    const rolesCount = await CustomRole.countDocuments({ categoryId: id });
    if (rolesCount > 0) {
      return NextResponse.json({ error: "Cannot delete category while roles are assigned to it" }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
