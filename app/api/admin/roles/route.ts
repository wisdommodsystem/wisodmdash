import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import CustomRole from "@/models/CustomRole";

// Get all roles
export async function GET() {
  try {
    await connectToDatabase();
    const roles = await CustomRole.find({}).populate("categoryId");
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

// Add a new role
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, categoryId, color, discordRoleId } = body;

    if (!name || !categoryId || !discordRoleId) {
      return NextResponse.json({ error: "Name, category, and Discord Role ID are required" }, { status: 400 });
    }

    const newRole = await CustomRole.create({ name, categoryId, color, discordRoleId });
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}

// Delete a role
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await CustomRole.findByIdAndDelete(id);
    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
