import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder for fetching contacts
  const contacts = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '(123) 456-7890' },
    // Add more contacts as needed
  ];

  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const newContact = await request.json();
  // Placeholder for saving the new contact
  return NextResponse.json(newContact, { status: 201 });
}
