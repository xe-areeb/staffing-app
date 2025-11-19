import { google } from 'googleapis'

export interface StaffRow {
  name: string
  email?: string
  phone?: string
  [key: string]: any // For additional fields
}

export async function getGoogleSheetsData(
  spreadsheetId: string,
  range: string,
  credentials?: any
): Promise<StaffRow[]> {
  try {
    const auth = credentials
      ? new google.auth.GoogleAuth({
          credentials: JSON.parse(credentials),
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        })
      : new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        })

    const sheets = google.sheets({ version: 'v4', auth })
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      return []
    }

    // First row is headers
    const headers = rows[0] as string[]
    const dataRows = rows.slice(1)

    return dataRows.map((row) => {
      const staffRow: StaffRow = { name: '' }
      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(/\s+/g, '_')
        const value = row[index] || ''
        if (key === 'name' || key === 'full_name') {
          staffRow.name = value
        } else if (key === 'email') {
          staffRow.email = value
        } else if (key === 'phone' || key === 'phone_number') {
          staffRow.phone = value
        } else {
          staffRow[key] = value
        }
      })
      return staffRow
    })
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error)
    throw error
  }
}

