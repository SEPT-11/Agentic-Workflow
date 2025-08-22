import { google } from 'googleapis';

export class GoogleSheetsService {
  private sheets = google.sheets('v4');

  async getSheetData(sheetId: string, accessToken: string): Promise<any[]> {
    try {
      // Set up OAuth2 client with access token
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const response = await this.sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: 'A:Z', // Get all columns
      });

      const rows = response.data.values || [];
      
      if (rows.length === 0) {
        return [];
      }

      // Convert rows to objects using first row as headers
      const headers = rows[0];
      const data = rows.slice(1).map((row: any) => {
        const obj: any = {};
        headers.forEach((header: any, index: number) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      return data;
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      throw new Error('Failed to fetch Google Sheets data');
    }
  }

  async validateSheetAccess(sheetId: string, accessToken: string): Promise<boolean> {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      await this.sheets.spreadsheets.get({
        auth,
        spreadsheetId: sheetId,
      });

      return true;
    } catch (error) {
      console.error('Error validating sheet access:', error);
      return false;
    }
  }

  async getSheetMetadata(sheetId: string, accessToken: string): Promise<{
    title: string;
    sheetCount: number;
  }> {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const response = await this.sheets.spreadsheets.get({
        auth,
        spreadsheetId: sheetId,
      });

      return {
        title: response.data.properties?.title || 'Untitled',
        sheetCount: response.data.sheets?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching sheet metadata:', error);
      throw new Error('Failed to fetch sheet metadata');
    }
  }
}
