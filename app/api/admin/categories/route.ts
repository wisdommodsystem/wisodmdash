import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import CustomRole from "@/models/CustomRole";

// Get all categories
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({});
    return NextResponse.json(categories);
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
