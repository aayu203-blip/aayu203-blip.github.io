import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

// Connect to the DB located in the parent directory
const dbPath = path.resolve(process.cwd(), '../catalog.db');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 50;
  const offset = (page - 1) * limit;

  try {
    const db = new Database(dbPath, { readonly: true });
    
    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) as count FROM products';
    const params: any[] = [];
    
    if (q) {
      query += ' WHERE title LIKE ? OR url LIKE ? OR vendor LIKE ? OR part_number LIKE ?';
      countQuery += ' WHERE title LIKE ? OR url LIKE ? OR vendor LIKE ? OR part_number LIKE ?';
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    
    const countResult = db.prepare(countQuery).get(...params) as { count: number };
    const total = countResult.count;
    
    const products = db.prepare(query).all(...params, limit, offset);
    
    db.close();
    
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
