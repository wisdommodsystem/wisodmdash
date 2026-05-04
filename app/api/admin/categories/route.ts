import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import CustomRole from "@/models/CustomRole";

// Get all categories
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({});
    const safeCategories = (categories || []).map(cat => ({
      ...cat.toObject(),
      name: cat.name || 'Unnamed Category'
    }));
    return NextResponse.json(safeCategories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// Add a new category
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, icon } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if category exists (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") } 
    });

    if (existingCategory) {
      return NextResponse.json({ 
        error: `Category "${existingCategory.name}" already exists` 
      }, { status: 400 });
    }

    const newCategory = await Category.create({ 
      name: trimmedName, 
      icon: icon || "Tag" 
    });
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Category creation error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Category already exists (Database Constraint)" }, { status: 400 });
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
