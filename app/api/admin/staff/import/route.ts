import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { getGoogleSheetsData } from '@/lib/google-sheets'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { spreadsheetId, range } = await req.json()

    if (!spreadsheetId || !range) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, we'll use a simple approach
    // In production, you'd set up Google Service Account credentials
    // For testing, you can make the sheet publicly readable or use API key
    const staffData = await getGoogleSheetsData(
      spreadsheetId,
      range,
      process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
    )

    let importedCount = 0
    let skippedCount = 0

    for (const row of staffData) {
      if (!row.name) continue

      try {
        // Check if staff already exists (by name or email)
        const existing = await prisma.staff.findFirst({
          where: {
            OR: [
              { name: row.name },
              ...(row.email ? [{ email: row.email }] : []),
            ],
          },
        })

        if (existing) {
          // Update existing staff
          await prisma.staff.update({
            where: { id: existing.id },
            data: {
              name: row.name,
              email: row.email || existing.email,
              phone: row.phone || existing.phone,
              metadata: row as any,
            },
          })
          importedCount++
        } else {
          // Create new staff
          await prisma.staff.create({
            data: {
              name: row.name,
              email: row.email || null,
              phone: row.phone || null,
              metadata: row as any,
            },
          })
          importedCount++
        }
      } catch (error) {
        console.error('Error importing staff member:', row, error)
        skippedCount++
      }
    }

    return NextResponse.json({
      success: true,
      count: importedCount,
      skipped: skippedCount,
    })
  } catch (error) {
    console.error('Error importing staff:', error)
    return NextResponse.json(
      {
        error:
          'Failed to import staff. Make sure your Google Sheets is accessible and the credentials are configured.',
      },
      { status: 500 }
    )
  }
}

